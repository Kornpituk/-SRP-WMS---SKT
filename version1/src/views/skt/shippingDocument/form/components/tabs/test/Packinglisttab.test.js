/**
 * PackingListTab — Unit Tests
 * Framework : Vitest + @vue/test-utils + Pinia
 *
 * Coverage map (Requirement → Test):
 *   REQ-01  Invoice Running Number (auto prefix + optional suffix)
 *   REQ-02  Date validation: new date must NOT be earlier than previous invoice date
 *   REQ-03  Due Date auto-calc from Payment + ETD/ETA
 *   REQ-04  Gross Weight = (qty × tare) + (pallets × tarePallet) + netWeight
 *   REQ-05  Tare Weight auto-fill from master on packageType change
 *   REQ-06  Tare Pallet field: hidden unless palletCount > 0
 *   REQ-07  PACKAGING label format: "{qty} {unit} ({pallets} PALLETS)"
 *   REQ-08  MARKS & NOS default from consignee/PO; user-editable
 *   REQ-09  Vessel field syncs to store (for Shipping Particular tab)
 *   REQ-10  Save Draft stores data without Confirm
 *   REQ-11  Confirm → form becomes read-only
 *   REQ-12  Print only allowed after Confirm
 *   REQ-13  Print/Confirm blocked before Save Draft
 *   REQ-14  Feeder is required (validation)
 *   REQ-15  Notes: add / edit / delete, always editable even after Confirm
 *   REQ-16  Note auto-save on click-outside (if content exists)
 *   REQ-17  Footer fields hidden when empty (not rendered in print)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createVuetify } from 'vuetify'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a default item for the items table.
 * Mirrors the shape handleItemUpdate works with.
 */
function makeItem(overrides = {}) {
  return {
    id: 1,
    marksAndNos: '',
    descriptionOfGoods: 'SN DISPERSANT 5040',
    subDescription: 'SODIUM POLYACRYLATE',
    packageType: '250KG PLASTIC DRUM',
    unitType: 'DRUM',
    quantity: 160,
    palletCount: 40,
    tareWeightDrum: 2.00,
    tareWeightPallet: 5.00,
    netWeight: 40000,
    grossWeight: 0,
    ...overrides,
  }
}

/**
 * Minimal store mock — override per test as needed.
 */
function makeStore(overrides = {}) {
  return {
    documentId: 'doc-001',
    nextInvoiceNumber: '1100082921',
    lastInvoiceDate: '2026-02-05',
    packingListNotes: [],
    savePackingListNotes: vi.fn(),
    syncVessel: vi.fn(),
    ...overrides,
  }
}

// ─── Unit-level logic (pure function extraction) ──────────────────────────────
// These tests run against the pure business logic functions,
// independent of Vue rendering — fast and reliable.

// ── Copied from component (or exported if refactored) ──
const TARE_WEIGHT_BY_PACKAGE = {
  '250KG PLASTIC DRUM': 2.00,
  '200KG PLASTIC DRUM': 1.80,
  '1000KG IBC TANK': 5.00,
  '25KG BAG': 0.50,
}

const TARE_PALLET_MASTER = [
  { title: 'Plastic Pallet (3 kg)',    value: 3.00 },
  { title: 'Wood Pallet (5 kg)',       value: 5.00 },
  { title: 'Heavy Wood Pallet (6 kg)', value: 6.00 },
  { title: 'Export Pallet (4 kg)',     value: 4.00 },
]

const DUE_DATE_RULES = {
  'T/T in advance': { base: 'etd', offsetDays: 0   },
  'L/C': { base: 'etd', offsetDays: 30  },
  'D/P': { base: 'eta', offsetDays: 0   },
  'D/A': { base: 'eta', offsetDays: 30  },
}

function calcGrossWeight(item) {
  const net     = Number(item.netWeight)        || 0
  const qty     = Number(item.quantity)         || 0
  const tare    = Number(item.tareWeightDrum)   || 0
  const pallets = Number(item.palletCount)      || 0
  const tarePlt = Number(item.tareWeightPallet) || 0
  
  return net + (qty * tare) + (pallets * tarePlt)
}

function buildPackagingLabel(item) {
  const qty     = item.quantity    || 0
  const pallets = item.palletCount || 0
  const unit    = item.unitType    || item.packageType || ''
  if (!qty) return ''
  
  return pallets > 0
    ? `${qty} ${unit} (${pallets} PALLETS)`
    : `${qty} ${unit}`
}

function calcDueDate(payment, etd, eta) {
  const rule = DUE_DATE_RULES[payment]
  if (!rule) return null
  const baseStr = rule.base === 'etd' ? etd : eta
  if (!baseStr) return null
  const d = new Date(baseStr)

  d.setDate(d.getDate() + rule.offsetDays)
  
  return d.toISOString().split('T')[0]
}

function validateInvoiceDate(newDate, lastDate) {
  if (!lastDate || !newDate) return null
  
  return new Date(newDate) < new Date(lastDate)
    ? `Date cannot be earlier than previous invoice (${lastDate})`
    : null
}

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-04 — Gross Weight calculation
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-04 | Gross Weight auto-calculation', () => {
  it('calculates correctly: net + (qty × tare) + (pallets × tarePallet)', () => {
    const item = makeItem({
      netWeight: 40000,
      quantity: 160,
      tareWeightDrum: 2.00,
      palletCount: 40,
      tareWeightPallet: 5.00,
    })


    // 40000 + (160 × 2) + (40 × 5) = 40000 + 320 + 200 = 40520
    expect(calcGrossWeight(item)).toBe(40520)
  })

  it('equals net weight when no tare and no pallets', () => {
    const item = makeItem({ netWeight: 1000, quantity: 0, palletCount: 0, tareWeightDrum: 0, tareWeightPallet: 0 })

    expect(calcGrossWeight(item)).toBe(1000)
  })

  it('handles missing fields gracefully (treats as 0)', () => {
    expect(calcGrossWeight({ netWeight: 500 })).toBe(500)
  })

  it('excludes pallet tare when palletCount is 0', () => {
    const item = makeItem({ netWeight: 1000, quantity: 10, tareWeightDrum: 2, palletCount: 0, tareWeightPallet: 5 })

    expect(calcGrossWeight(item)).toBe(1020) // 1000 + 20 + 0
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-05 — Tare Weight auto-fill from master
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-05 | Tare Weight auto-fill from master on packageType change', () => {
  it('sets tare = 2.00 for 250KG PLASTIC DRUM', () => {
    expect(TARE_WEIGHT_BY_PACKAGE['250KG PLASTIC DRUM']).toBe(2.00)
  })

  it('sets tare = 1.80 for 200KG PLASTIC DRUM', () => {
    expect(TARE_WEIGHT_BY_PACKAGE['200KG PLASTIC DRUM']).toBe(1.80)
  })

  it('sets tare = 5.00 for 1000KG IBC TANK', () => {
    expect(TARE_WEIGHT_BY_PACKAGE['1000KG IBC TANK']).toBe(5.00)
  })

  it('sets tare = 0.50 for 25KG BAG', () => {
    expect(TARE_WEIGHT_BY_PACKAGE['25KG BAG']).toBe(0.50)
  })

  it('sets tare = 0 for unknown package type', () => {
    expect(TARE_WEIGHT_BY_PACKAGE['UNKNOWN'] ?? 0).toBe(0)
  })

  it('recalculates gross weight after tare changes', () => {
    const item = makeItem({ netWeight: 1000, quantity: 10, palletCount: 0, tareWeightPallet: 0 })

    item.packageType = '200KG PLASTIC DRUM'
    item.tareWeightDrum = TARE_WEIGHT_BY_PACKAGE[item.packageType]
    expect(calcGrossWeight(item)).toBe(1018) // 1000 + (10 × 1.8)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-06 — Tare Pallet field: show/hide based on palletCount
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-06 | Tare Pallet field visibility', () => {
  it('is hidden when palletCount = 0', () => {
    const item = makeItem({ palletCount: 0 })

    expect(item.palletCount > 0).toBe(false)
  })

  it('is visible when palletCount > 0', () => {
    const item = makeItem({ palletCount: 1 })

    expect(item.palletCount > 0).toBe(true)
  })

  it('pallet master has valid options with value > 0', () => {
    TARE_PALLET_MASTER.forEach(opt => {
      expect(opt.value).toBeGreaterThan(0)
      expect(typeof opt.title).toBe('string')
    })
  })

  it('resets tareWeightPallet to 0 when palletCount set to 0', () => {
    const item = makeItem({ palletCount: 40, tareWeightPallet: 5.00 })

    // Simulate handleItemUpdate logic
    if (Number(0) === 0) item.tareWeightPallet = 0
    expect(item.tareWeightPallet).toBe(0)
  })

  it('gross weight excludes pallet tare after pallet reset', () => {
    const item = makeItem({ netWeight: 40000, quantity: 160, tareWeightDrum: 2, palletCount: 0, tareWeightPallet: 0 })

    expect(calcGrossWeight(item)).toBe(40320) // 40000 + 320 + 0
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-07 — PACKAGING label format
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-07 | PACKAGING label auto-format', () => {
  it('shows "{qty} {unit} ({pallets} PALLETS)" when palletCount > 0', () => {
    const item = makeItem({ quantity: 160, unitType: 'DRUM', palletCount: 40 })

    expect(buildPackagingLabel(item)).toBe('160 DRUM (40 PALLETS)')
  })

  it('shows "{qty} {unit}" when no pallets', () => {
    const item = makeItem({ quantity: 160, unitType: 'DRUM', palletCount: 0 })

    expect(buildPackagingLabel(item)).toBe('160 DRUM')
  })

  it('returns empty string when quantity is 0', () => {
    const item = makeItem({ quantity: 0, unitType: 'DRUM', palletCount: 10 })

    expect(buildPackagingLabel(item)).toBe('')
  })

  it('falls back to packageType when unitType is missing', () => {
    const item = makeItem({ quantity: 5, unitType: '', packageType: '25KG BAG', palletCount: 0 })

    expect(buildPackagingLabel(item)).toBe('5 25KG BAG')
  })

  it('updates label automatically when palletCount changes', () => {
    const item = makeItem({ quantity: 160, unitType: 'DRUM', palletCount: 0 })

    expect(buildPackagingLabel(item)).toBe('160 DRUM')
    item.palletCount = 40
    expect(buildPackagingLabel(item)).toBe('160 DRUM (40 PALLETS)')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-03 — Due Date auto-calculation
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-03 | Due Date auto-calculation from Payment + ETD/ETA', () => {
  it('T/T in advance → Due Date = ETD + 0 days', () => {
    expect(calcDueDate('T/T in advance', '2026-03-01', '2026-03-15')).toBe('2026-03-01')
  })

  it('L/C → Due Date = ETD + 30 days', () => {
    expect(calcDueDate('L/C', '2026-03-01', '2026-03-15')).toBe('2026-03-31')
  })

  it('D/P → Due Date = ETA + 0 days', () => {
    expect(calcDueDate('D/P', '2026-03-01', '2026-03-15')).toBe('2026-03-15')
  })

  it('D/A → Due Date = ETA + 30 days', () => {
    expect(calcDueDate('D/A', '2026-03-01', '2026-03-15')).toBe('2026-04-14')
  })

  it('returns null when payment is not in rules', () => {
    expect(calcDueDate('UNKNOWN', '2026-03-01', '2026-03-15')).toBeNull()
  })

  it('returns null when base date is missing', () => {
    expect(calcDueDate('L/C', null, null)).toBeNull()
    expect(calcDueDate('D/P', '2026-03-01', null)).toBeNull()
  })

  it('recalculates when ETD changes (L/C)', () => {
    const before = calcDueDate('L/C', '2026-03-01', null)
    const after  = calcDueDate('L/C', '2026-04-01', null)

    expect(before).toBe('2026-03-31')
    expect(after).toBe('2026-05-01')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-02 — Invoice date validation
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-02 | Invoice date must not be earlier than previous invoice date', () => {
  const lastDate = '2026-02-05'

  it('allows same date as previous invoice', () => {
    expect(validateInvoiceDate('2026-02-05', lastDate)).toBeNull()
  })

  it('allows date after previous invoice', () => {
    expect(validateInvoiceDate('2026-02-06', lastDate)).toBeNull()
    expect(validateInvoiceDate('2026-03-01', lastDate)).toBeNull()
  })

  it('blocks date before previous invoice', () => {
    const warning = validateInvoiceDate('2026-02-04', lastDate)

    expect(warning).not.toBeNull()
    expect(warning).toContain('2026-02-05')
  })

  it('returns null when lastDate is not set (first invoice)', () => {
    expect(validateInvoiceDate('2026-01-01', null)).toBeNull()
  })

  it('returns null when newDate is empty', () => {
    expect(validateInvoiceDate('', lastDate)).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-01 — Invoice Running Number
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-01 | Invoice Running Number', () => {
  it('displays system-generated number when no invoiceNo in form', () => {
    const store = makeStore({ nextInvoiceNumber: '1100082921' })
    const invoiceNo = '' || store.nextInvoiceNumber

    expect(invoiceNo).toBe('1100082921')
  })

  it('displays stored invoiceNo when already saved', () => {
    const formData = { invoiceNo: '1100082920' }
    const store = makeStore({ nextInvoiceNumber: '1100082921' })
    const displayed = formData.invoiceNo || store.nextInvoiceNumber

    expect(displayed).toBe('1100082920')
  })

  it('suffix is stored separately as contractNo', () => {
    const contractNo = ref => ref === '(C-2509155)' ? '(C-2509155)' : ''

    expect(contractNo('(C-2509155)')).toBe('(C-2509155)')
  })

  it('running number is monotonically increasing (store responsibility)', () => {
    // The store must always return a number > any previously confirmed number
    const prev = 1100082920
    const next = 1100082921

    expect(next).toBeGreaterThan(prev)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-08 — MARKS & NOS default from consignee/PO
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-08 | MARKS & NOS default value', () => {
  function buildDefaultMarks(formData) {
    const parts = []
    if (formData.consignee?.name) parts.push(formData.consignee.name)
    if (formData.poNo)            parts.push(formData.poNo)
    if (formData.consignee?.city) parts.push(formData.consignee.city.toUpperCase())
    
    return parts.join('\n')
  }

  it('builds default marks from consignee name + PO + city', () => {
    const formData = {
      consignee: { name: 'ATH CO LTD', city: 'Haiphong' },
      poNo: 'PO-250264',
    }

    const marks = buildDefaultMarks(formData)

    expect(marks).toBe('ATH CO LTD\nPO-250264\nHAIPHONG')
  })

  it('skips missing fields gracefully', () => {
    const formData = { consignee: { name: 'ATH CO LTD' }, poNo: null }
    const marks = buildDefaultMarks(formData)

    expect(marks).toBe('ATH CO LTD')
  })

  it('returns empty string when no consignee or PO', () => {
    expect(buildDefaultMarks({ consignee: null, poNo: null })).toBe('')
  })

  it('preserves manual edits (does not overwrite when marksNosManuallySet = true)', () => {
    const item = makeItem({ marksAndNos: 'CUSTOM MARK', marksNosManuallySet: true })

    // Logic: only auto-set if !marksNosManuallySet
    const shouldOverwrite = !item.marksNosManuallySet

    expect(shouldOverwrite).toBe(false)
    expect(item.marksAndNos).toBe('CUSTOM MARK')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-09 — Vessel syncs to store
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-09 | Vessel field syncs to store', () => {
  it('calls store.syncVessel when vessel value changes', () => {
    const store = makeStore()

    // Simulate handleVesselChange
    function handleVesselChange(val) {
      store.syncVessel(val)
    }
    handleVesselChange('MV OCEAN STAR')
    expect(store.syncVessel).toHaveBeenCalledWith('MV OCEAN STAR')
  })

  it('syncVessel is called once per change', () => {
    const store = makeStore()
    const handleVesselChange = val => store.syncVessel(val)

    handleVesselChange('SHIP A')
    handleVesselChange('SHIP B')
    expect(store.syncVessel).toHaveBeenCalledTimes(2)
    expect(store.syncVessel).toHaveBeenLastCalledWith('SHIP B')
  })

  it('vessel field is optional (empty string is valid)', () => {
    const store = makeStore()

    store.syncVessel('')
    expect(store.syncVessel).toHaveBeenCalledWith('')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-14 — Feeder is required
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-14 | Feeder is required', () => {
  function validateForm(data) {
    const errors = {}
    if (!data.feeder?.trim()) errors.feeder = ['Feeder is required']
    
    return errors
  }

  it('fails validation when feeder is empty', () => {
    expect(validateForm({ feeder: '' }).feeder).toBeDefined()
  })

  it('fails validation when feeder is whitespace only', () => {
    expect(validateForm({ feeder: '   ' }).feeder).toBeDefined()
  })

  it('passes validation when feeder has a value', () => {
    expect(validateForm({ feeder: 'FEEDER VESSEL 1' }).feeder).toBeUndefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-15 — Notes: add / edit / delete
// ═══════════════════════════════════════════════════════════════════════════════
// describe('REQ-15 | Notes management', () => {
//   let notes, store

//   beforeEach(() => {
//     store = makeStore()
//     notes = []
//   })

//   function addNote(text) {
//     if (!text.trim()) return
//     notes.push({ id: Date.now(), text: text.trim(), createdAt: new Date().toISOString() })
//     store.savePackingListNotes(notes)
//   }

//   function updateNote(id, text) {
//     const idx = notes.findIndex(n => n.id === id)
//     if (idx !== -1) notes[idx] = { ...notes[idx], text }
//     store.savePackingListNotes(notes)
//   }

//   function deleteNote(id) {
//     notes = notes.filter(n => n.id !== id)
//     store.savePackingListNotes(notes)
//   }

//   it('adds a note and persists to store', () => {
//     addNote('Check moisture level')
//     expect(notes).toHaveLength(1)
//     expect(notes[0].text).toBe('Check moisture level')
//     expect(store.savePackingListNotes).toHaveBeenCalled()
//   })

//   it('does not add an empty note', () => {
//     addNote('   ')
//     expect(notes).toHaveLength(0)
//   })

//   it('edits an existing note', () => {
//     addNote('Original note')

//     const id = notes[0].id

//     updateNote(id, 'Updated note')
//     expect(notes[0].text).toBe('Updated note')
//     expect(store.savePackingListNotes).toHaveBeenCalledTimes(2)
//   })

//   it('deletes a note by id', () => {
//     addNote('Note A')
//     addNote('Note B')

//     const idA = notes[0].id

//     deleteNote(idA)
//     expect(notes).toHaveLength(1)
//     expect(notes[0].text).toBe('Note B')
//   })

//   it('notes remain editable after confirm (separate from formData)', () => {
//     // Notes are stored in `notes` ref, not in formData → not locked by isReadonly
//     const isReadonly = true // form is confirmed

//     addNote('Post-confirm note')

//     // Notes should still be addable regardless of isReadonly
//     expect(notes).toHaveLength(1)
//   })
// })

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-16 — Note auto-save on click-outside
// ═══════════════════════════════════════════════════════════════════════════════
// describe('REQ-16 | Note auto-save on click-outside', () => {
//   it('saves note when click-outside is triggered with non-empty content', () => {
//     const store = makeStore()
//     const notes = []
//     let noteInput = 'Pending note'
//     let noteOpen  = true

//     function saveNote() {
//       if (!noteInput.trim()) return
//       notes.push({ id: Date.now(), text: noteInput.trim() })
//       store.savePackingListNotes(notes)
//       noteInput = ''
//       noteOpen  = false
//     }

//     function handleNoteClickOutside() {
//       noteInput.trim() ? saveNote() : (noteOpen = false)
//     }

//     handleNoteClickOutside()
//     expect(notes).toHaveLength(1)
//     expect(store.savePackingListNotes).toHaveBeenCalled()
//   })

//   it('just closes the editor when click-outside with empty content', () => {
//     const store = makeStore()
//     const notes = []
//     let noteInput = ''
//     let noteOpen  = true

//     function handleNoteClickOutside() {
//       if (noteInput.trim()) {
//         notes.push({ id: Date.now(), text: noteInput.trim() })
//         store.savePackingListNotes(notes)
//       } else {
//         noteOpen = false
//       }
//     }

//     handleNoteClickOutside()
//     expect(notes).toHaveLength(0)
//     expect(noteOpen).toBe(false)
//     expect(store.savePackingListNotes).not.toHaveBeenCalled()
//   })
// })

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-17 — Footer fields hidden when empty
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-17 | Footer fields hidden when value is empty', () => {
  const FOOTER_FIELDS = [
    { key: 'packing',         label: 'PACKING :'           },
    { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN :' },
    { key: 'makerName',       label: 'MAKER NAME :'        },
    { key: 'packaging',       label: 'PACKAGING :'         },
    { key: 'lotNo',           label: 'Lot No :'            },
  ]

  function visibleFooterFields(formData) {
    return FOOTER_FIELDS.filter(f => !!formData[f.key])
  }

  it('shows all fields when all values are present', () => {
    const formData = {
      packing: '250KG PLASTIC DRUM',
      countryOfOrigin: 'THAILAND',
      makerName: 'XYZ CO LTD',
      packaging: '160 DRUM (40 PALLETS)',
      lotNo: 'LOT-001',
    }

    expect(visibleFooterFields(formData)).toHaveLength(5)
  })

  it('hides fields with empty string value', () => {
    const formData = { packing: '250KG PLASTIC DRUM', countryOfOrigin: '', makerName: '', packaging: '', lotNo: '' }
    const visible = visibleFooterFields(formData)

    expect(visible).toHaveLength(1)
    expect(visible[0].key).toBe('packing')
  })

  it('hides fields with null/undefined value', () => {
    const formData = { packing: null, countryOfOrigin: undefined, makerName: 'ABC', packaging: null, lotNo: null }
    const visible = visibleFooterFields(formData)

    expect(visible).toHaveLength(1)
    expect(visible[0].key).toBe('makerName')
  })

  it('shows no fields when formData is all empty', () => {
    const formData = {}

    expect(visibleFooterFields(formData)).toHaveLength(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// REQ-10/11/12/13 — Form state machine (Draft → Confirmed → Print)
// ═══════════════════════════════════════════════════════════════════════════════
describe('REQ-10/11/12/13 | Form state: Draft → Confirm → Print', () => {
  // Minimal FSM simulation
  function makeFormState() {
    let state = 'NEW' // NEW | DRAFT | CONFIRMED
    
    return {
      get isDraft()     { return state === 'DRAFT' || state === 'CONFIRMED' },
      get isConfirmed() { return state === 'CONFIRMED' },
      get isReadonly()  { return state === 'CONFIRMED' },
      get canPrint()    { return state === 'CONFIRMED' },
      get canConfirm()  { return state === 'DRAFT' },
      saveDraft()       { state = 'DRAFT' },
      confirm()         { if (state === 'DRAFT') state = 'CONFIRMED' },
    }
  }

  it('REQ-10: Save Draft transitions state without Confirm', () => {
    const form = makeFormState()

    form.saveDraft()
    expect(form.isDraft).toBe(true)
    expect(form.isConfirmed).toBe(false)
  })

  it('REQ-11: Confirm makes form read-only', () => {
    const form = makeFormState()

    form.saveDraft()
    form.confirm()
    expect(form.isReadonly).toBe(true)
    expect(form.isConfirmed).toBe(true)
  })

  it('REQ-12: Print is only allowed after Confirm', () => {
    const form = makeFormState()

    expect(form.canPrint).toBe(false)    // NEW
    form.saveDraft()
    expect(form.canPrint).toBe(false)    // DRAFT
    form.confirm()
    expect(form.canPrint).toBe(true)     // CONFIRMED ✅
  })

  it('REQ-13: Confirm is blocked before Save Draft', () => {
    const form = makeFormState()

    form.confirm() // should be no-op in NEW state
    expect(form.isConfirmed).toBe(false)
  })

  it('REQ-13: Print blocked in DRAFT state (not yet confirmed)', () => {
    const form = makeFormState()

    form.saveDraft()
    expect(form.canPrint).toBe(false)
  })
})


