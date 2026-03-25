// ─────────────────────────────────────────────────────────────────────────────
// composables/useExpensesService.js
//
// Data-fetching abstraction for Export Expenses Record.
// ✅  Uses mock data with a simulated async delay.
// 🔌  To connect a real API: replace only the body of fetchExpenses() —
//     the { data, total } return contract and all filter params stay the same.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Reference Data
// ─────────────────────────────────────────────────────────────────────────────
const PAYERS = [
  'SARASTRI BROS',
  'Bangkok Trading Co.',
  'Siam Export Ltd.',
  'Pacific Traders',
  'Golden Gate Corp.',
  'Thai Union Foods',
  'Eastern Logistics',
  'Asia Pacific Intl',
  'K.N. Sharp Ltd.',
]

const END_USERS = [
  'Honda Automobile (Thailand)',
  'Toyota Motor Thailand',
  'SCG Packaging PCL',
  'PTT Global Chemical',
  'IRPC PCL',
  'Thai Beverage PCL',
  'Kasikorn Bank PCL',
  'CP All PCL',
  'Berli Jucker PCL',
]

const ITEMS = [
  'AGL STFOR - HP',
  'AGL STFOR - MP',
  'EH-DISPERSANT 50:50',
  'CHEMICAL ADDITIVE TYPE A',
  'POLYMER RESIN GR-5',
  'INDUSTRIAL SOLVENT IPA',
  'LUBRICANT GRADE 46',
  'HYDRAULIC FLUID HF-32',
  'ANTI-RUST COMPOUND AR-10',
]

const TERMS   = ['COD', 'CFR', 'CIP', 'NET 30', 'NET 60']
const SALES   = ['MPL', 'TVL', 'BKK', 'CHR']
const STATUSES = ['MPL', 'CIP', 'CFR', 'TVL', 'Pending', 'Cancelled']

// Exchange rate used to derive Baht values from USD
const USD_TO_THB = 35.5

/**
 * Helper: random float in [min, max] rounded to 2 dp
 */
function rnd(min, max) {
  return +((Math.random() * (max - min)) + min).toFixed(2)
}

/**
 * Helper: pick a random element from an array
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Helper: generate a random ISO date string in a given year/month range
 */
function randomDate(startYear = 2023, endYear = 2024) {
  const y = startYear + Math.floor(Math.random() * (endYear - startYear + 1))
  const m = Math.floor(Math.random() * 12)
  const d = 1 + Math.floor(Math.random() * 28)
  
  return new Date(y, m, d).toISOString().split('T')[0]
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Record Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates one realistic expense record.
 * Each expense column stores a USD value; the paired `baht*` column
 * stores the THB equivalent (USD × exchange rate).
 *
 * @param {number} index  — zero-based row index
 * @returns {Object}
 */
function createRecord(index) {
  const n           = index + 1
  const forwarder   = rnd(500, 5000)
  const courier     = rnd(100, 800)
  const trucking    = rnd(200, 1500)
  const storage     = rnd(0, 400)
  const insurance   = rnd(50, 300)
  const ftaForm     = rnd(0, 200)
  const shipping    = rnd(300, 3000)
  const other       = rnd(0, 500)
  const customsOtFee = rnd(0, 600)

  const totalCost   = +(
    forwarder + courier + trucking + storage +
    insurance + ftaForm + shipping + other + customsOtFee
  ).toFixed(2)

  const quantity    = 10 + Math.floor(Math.random() * 490)
  const costPerUnit = +(totalCost / quantity).toFixed(2)

  const updatedDate = randomDate(2024, 2024)

  return {
    no: n,
    salesOrderNo: `TL${String(1100000 + n).padStart(7, '0')}`,
    poNo: `PO${String(4000000 + n * 7).padStart(10, '0')}TQ`,
    invoice: `INV${String(1000000 + n).padStart(7, '0')}`,
    invoiceInSap: `9${String(200000000 + n).padStart(9, '0')}`,
    payerName: pick(PAYERS),
    endUser: pick(END_USERS),
    item: pick(ITEMS),
    etd: randomDate(2023, 2024),
    term: pick(TERMS),
    sale: pick(SALES),

    // USD expense values
    forwarder,
    courier,
    trucking,
    storage,
    insurance,
    ftaForm,
    shipping,
    other,
    customsOtFee,

    // THB equivalents (paired Baht columns)
    bahtForwarder: +(forwarder  * USD_TO_THB).toFixed(2),
    bahtCourier: +(courier    * USD_TO_THB).toFixed(2),
    bahtTrucking: +(trucking   * USD_TO_THB).toFixed(2),
    bahtStorage: +(storage    * USD_TO_THB).toFixed(2),
    bahtInsurance: +(insurance  * USD_TO_THB).toFixed(2),
    bahtFtaForm: +(ftaForm    * USD_TO_THB).toFixed(2),
    bahtShipping: +(shipping   * USD_TO_THB).toFixed(2),
    bahtOther: +(other      * USD_TO_THB).toFixed(2),

    // Summary
    totalCost,
    quantity,
    status: pick(STATUSES),
    costPerUnit,
    updatedBy: `User${String(n % 5 + 1).padStart(3, '0')}`,
    updatedDate,
  }
}

/** Full mock dataset — 50 records, generated once at module load */
const MOCK_DATA = Array.from({ length: 50 }, (_, i) => createRecord(i))

// ─────────────────────────────────────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useExpensesService
 *
 * Exposes:
 *   fetchExpenses(params) → Promise<{ data: Array, total: number }>
 *
 * Filter params accepted:
 *   invoiceInSap  {string}
 *   endUser       {string}
 *   poNo          {string}
 *   payerName     {string}
 *   etdFrom       {string}  YYYY-MM-DD
 *   etdTo         {string}  YYYY-MM-DD
 *   salesOrderNo  {string}
 *   invoice       {string}
 *   item          {string}
 *   page          {number}
 *   itemsPerPage  {number}
 */
export function useExpensesService() {

  async function fetchExpenses(params) {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400))

    // ── Apply filters ───────────────────────────────────────────
    let rows = [...MOCK_DATA]
    console.log("mockData", MOCK_DATA)

    const contains = (field, value) =>
      !value?.trim() || field?.toLowerCase().includes(value.trim().toLowerCase())

    rows = rows.filter(r =>
      contains(r.invoiceInSap,  params.invoiceInSap)  &&
      contains(r.endUser,       params.endUser)        &&
      contains(r.poNo,          params.poNo)           &&
      contains(r.payerName,     params.payerName)      &&
      contains(r.salesOrderNo,  params.salesOrderNo)   &&
      contains(r.invoice,       params.invoice)        &&
      contains(r.item,          params.item),
    )

    if (params.etdFrom) {
      rows = rows.filter(r => r.etd >= params.etdFrom)
    }

    if (params.etdTo) {
      rows = rows.filter(r => r.etd <= params.etdTo)
    }

    // ── Paginate ────────────────────────────────────────────────
    const total   = rows.length
    const page    = params.page       ?? 1
    const perPage = params.itemsPerPage ?? 10
    const start   = (page - 1) * perPage

    const data = rows
      .slice(start, start + perPage)
      .map((row, i) => ({ ...row, no: start + i + 1 })) // re-number current page

    return { data, total }

    // ── REAL API — swap in when backend is ready ─────────────────
    // const response = await axios.get('/api/export-expenses', { params })
    // return { data: response.data.records, total: response.data.total }
  }

  return { fetchExpenses }
}
