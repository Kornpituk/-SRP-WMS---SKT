// CommercialInvoiceTab.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia, setActivePinia } from 'pinia'
import CommercialInvoiceTab from '../CommercialInvoiceTab.vue' // ปรับ path ให้ถูกต้อง

// --- Mocks ---
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: { mode: 'OCEAN' } })),
}))

const mockUpdateField = vi.fn()
const mockSaveDraft = vi.fn()
const mockConfirm = vi.fn()

vi.mock('../../composables/useTabForm', () => ({
  useTabForm: vi.fn(() => {
    const formData = ref({
      date: '2025-03-12',
      invoiceNo: 'INV-001',
      contractNo: 'CT-001',
      poNo: 'PO-123',
      proformaInvoiceNo: 'PI-001',
      payer: { name: 'Payer Co.', address: 'Addr', city: 'Bangkok', country: 'Thailand' },
      consignee: { name: 'Consignee', address: 'Addr2', city: 'Tokyo', country: 'Japan', taxId: '12345' },
      payment: 'L/C',
      dueDate: '2025-04-12',
      feeder: 'Feeder A',
      vessel: 'Vessel B',
      etd: '2025-03-15',
      from: 'Port A',
      to: 'Port B',
      eta: '2025-03-20',
      shippingMode: 'OCEAN',
      amountCurrency: 'US$',
      items: [
        { id: 1, marksAndNos: 'MARK1', descriptionOfGoods: 'GOODS1', subDescription: 'SUB1', quantity: 100, unitPrice: 10, amount: 1000 },
      ],
      totalDescription: 'Total Desc',
      pricingTerm: 'CIF',
      cifType: 'CIF',
      cifPort: 'HCM CITY',
      fobType: 'FOB',
      fobPort: 'LAEM CHABANG',
      fobValue: 800,
      oceanFreight: 100,
      insurance: 20,
      cifValue: 920,
      packing: 'PACKING INFO',
      countryOfOrigin: 'Thailand',
      makerName: 'Maker',
      packaging: 'BOX',
      lotNo: 'LOT001',
      bankingDetail: {
        accountNo: '21-31080051 SANYO KASEI (THAILAND) LTD.',
        bankName: 'SANYO BANK',
        address: 'Bank Address',
        swiftCode: 'SANYO SWIFT',
      },
    })

    
    return {
      formData,
      isDirty: ref(false),
      isLoading: ref(false),
      isReadonly: ref(false),
      tabStatus: ref('WAITING'),
      updateField: mockUpdateField,
      saveDraft: mockSaveDraft,
      confirm: mockConfirm,
    }
  }),
}))

vi.mock('../../composables/usePrint', () => ({
  usePrint: vi.fn(() => ({ print: vi.fn() })),
}))

vi.mock('../../stores/shipDocumentStore', () => ({
  useShipDocumentStore: vi.fn(() => ({ documentId: 'doc123' })),
}))

// Stub for TabActionBar
vi.mock('../shared/TabActionBar.vue', () => ({
  default: {
    name: 'TabActionBar',
    template: '<div data-testid="tab-action-bar"><button @click="$emit(\'save-draft\')">Save Draft</button></div>',
    props: ['tabKey', 'isLoading', 'isDirty', 'notes'],
  },
}))

const vuetify = createVuetify({ components, directives })

describe('CommercialInvoiceTab', () => {
  let wrapper

  beforeEach(() => {
    // สร้าง Pinia instance และ set ให้ active
    const pinia = createPinia()

    setActivePinia(pinia)

    wrapper = mount(CommercialInvoiceTab, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          VSelect: true,
          VTextField: true,
        },
      },
    })
  })

  // ------------------------------------------------------------
  // REQ-1 : Auto-populated read-only fields (yellow highlight)
  // ------------------------------------------------------------
  it('displays yellow-highlight fields with values from formData and they are read-only', () => {
    const dateField = wrapper.find('[data-testid="field-date"]')

    expect(dateField.text()).toBe('2025-03-12')
    expect(dateField.classes()).toContain('ref-val--highlight')

    const invoiceNoField = wrapper.find('[data-testid="field-invoice-no"]')

    expect(invoiceNoField.text()).toContain('INVOICE NO. : INV-001 (CT-001)')
    expect(invoiceNoField.classes()).toContain('ref-val--highlight')

    const poNoField = wrapper.find('[data-testid="field-po-no"]')

    expect(poNoField.text()).toContain('PO NO : PO-123')
    expect(poNoField.classes()).toContain('ref-val--highlight')

    const qtyCell = wrapper.find('.tbl-c--qty span')

    expect(qtyCell.exists()).toBe(true)
    expect(qtyCell.text()).toMatch(/100/)
  })

  // ------------------------------------------------------------
  // REQ-2 : Currency selection and propagation
  // ------------------------------------------------------------
  it('changes currency via dropdown and propagates to other sections', async () => {
    const currencySelect = wrapper.find('[data-testid="currency-select"]')

    expect(currencySelect.exists()).toBe(true)

    await currencySelect.vm.$emit('update:model-value', 'JPY')
    expect(mockUpdateField).toHaveBeenCalledWith('amountCurrency', 'JPY')

    expect(wrapper.vm.activeCurrency).toBe('JPY')
  })

  // ------------------------------------------------------------
  // REQ-2 : Calculation logic (Amount, CIF, Insurance)
  // ------------------------------------------------------------
  it('calculates amount when unit price changes', () => {
    wrapper.vm.handleItemUpdate(0, 15)
    expect(mockUpdateField).toHaveBeenCalledWith('items', [
      expect.objectContaining({ unitPrice: 15, amount: 1500 }),
    ])
  })

  it('calculates CIF and insurance correctly for CIF term', async () => {
    const formData = wrapper.vm.formData.value

    formData.pricingTerm = 'CIF'
    formData.fobValue = 800
    formData.oceanFreight = 101  // เปลี่ยนเล็กน้อยเพื่อกระตุ้น watcher
    formData.insurance = 0

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // เผื่อกรณี watcher ทำงานไม่ทัน

    expect(mockUpdateField).toHaveBeenCalledWith('insurance', 15) // (800+101)*1.1*0.0016 = 1.58 < 15
    expect(mockUpdateField).toHaveBeenCalledWith('cifValue', 800 + 101 + 15)
  })

  it('hides insurance row when pricing term is EXWORK', async () => {
    wrapper.vm.formData.value.pricingTerm = 'EXWORK'
    await wrapper.vm.$nextTick()

    const hasInsurance = wrapper.vm.visiblePricingRows.some(row => row.port === 'INSURANCE')

    expect(hasInsurance).toBe(false)
  })

  // ------------------------------------------------------------
  // REQ-3 : Save Draft action
  // ------------------------------------------------------------
  it('calls saveDraft when Save Draft button is clicked', async () => {
    const saveBtn = wrapper.find('[data-testid="tab-action-bar"] button')

    await saveBtn.trigger('click')
    expect(mockSaveDraft).toHaveBeenCalled()
  })

  // ------------------------------------------------------------
  // REQ-4 : Banking dropdown validation (filtering)
  // ------------------------------------------------------------
  it('filters banking account options based on currency and payment method', () => {
    const formData = wrapper.vm.formData.value

    formData.amountCurrency = 'US$'
    formData.payment = 'L/C'
    expect(wrapper.vm.filteredAccountOptions.every(opt => opt.startsWith('21'))).toBe(true)
    expect(wrapper.vm.filteredAccountOptions).toHaveLength(2)

    formData.amountCurrency = 'JPY'
    formData.payment = 'T/T'
    expect(wrapper.vm.filteredAccountOptions.every(opt => opt.startsWith('22'))).toBe(true)
    expect(wrapper.vm.filteredAccountOptions).toHaveLength(1)

    formData.amountCurrency = 'US$'
    formData.payment = 'T/T'
    expect(wrapper.vm.filteredAccountOptions.every(opt => opt.startsWith('21'))).toBe(true)
    expect(wrapper.vm.filteredAccountOptions).toHaveLength(2)
  })

  // ------------------------------------------------------------
  // REQ-5 : Shipping Mode display
  // ------------------------------------------------------------
  it('displays shipping mode label as "{MODE} FREIGHT"', async () => {
    wrapper.vm.formData.value.shippingMode = 'AIR'
    await wrapper.vm.$nextTick()

    const modeDisplay = wrapper.find('[data-testid="shipping-mode-display"]')

    expect(modeDisplay.text()).toBe('AIR FREIGHT')
  })

  // ------------------------------------------------------------
  // REQ-6 : Master data dropdowns (Term of Pricing, FOB type)
  // ------------------------------------------------------------
  it('provides term of pricing dropdown with correct master data options', () => {
    const termSelect = wrapper.find('[data-testid="term-of-pricing-select"]')

    expect(termSelect.props('items')).toEqual(['CIF', 'FOB', 'EXWORK', 'C&F'])
  })

  it('provides FOB type dropdown with correct master data options', () => {
    // FOB type select อยู่ในแถวที่ 2 (index 1) ของ .pricing-row__type-select
    const fobTypeSelect = wrapper.findAll('.pricing-row__type-select')[1]

    expect(fobTypeSelect.props('items')).toEqual(['CIF', 'FOB', 'CFR'])
  })
})
