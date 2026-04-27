export const DEFAULT_SAMPLE_DESCRIPTION = `(FREE SAMPLE)
(NO COMMERCIAL VALUE)
(VALUE SHOWN FOR CUSTOMS PURPOSE ONLY)`

export function createDefaultSampleDescription(subDescription = '') {
  const lines = []
  const normalizedSubDescription = String(subDescription || '').trim()

  if (normalizedSubDescription) {
    lines.push(
      normalizedSubDescription.startsWith('(') && normalizedSubDescription.endsWith(')')
        ? normalizedSubDescription
        : `(${normalizedSubDescription})`,
    )
  }

  lines.push(...DEFAULT_SAMPLE_DESCRIPTION.split('\n'))

  return lines.join('\n')
}

function asNumber(value) {
  return Number(value) || 0
}

function normalizeUnit(unit) {
  return String(unit || '').trim().toUpperCase()
}

function pluralizeUnit(unit, qty) {
  const normalized = normalizeUnit(unit)
  if (!normalized) return ''
  if (Number(qty) === 1) return normalized
  if (normalized.endsWith('S')) return normalized

  return `${normalized}S`
}

function getItemUnit(item) {
  const packageTypeParts = String(item?.packageType || '').split(' ')
  const fallbackUnit = packageTypeParts[packageTypeParts.length - 1]

  return normalizeUnit(item?.unitType || item?.packageUnit || fallbackUnit)
}

export function getPackingItems(packingListData) {
  return Array.isArray(packingListData?.items) ? packingListData.items : []
}

export function buildSampleDescription(item) {
  const sampleNote = String(item?.sampleDescription || '').trim()

  if (sampleNote) return sampleNote

  return createDefaultSampleDescription(item?.subDescription)
}

export function getItemTotalNet(item) {
  return asNumber(item?.netWeight) + (item?.isSample ? asNumber(item?.sampleNetWeight) : 0)
}

export function getItemTotalGross(item) {
  return asNumber(item?.grossWeight) + (item?.isSample ? asNumber(item?.sampleGrossWeight) : 0)
}

export function buildItemPackageSummary(item, { includePallet = true } = {}) {
  const qty = asNumber(item?.quantity)
  const unit = getItemUnit(item)
  const palletCount = asNumber(item?.palletCount)
  const parts = []

  if (qty && unit) parts.push(`${qty} ${pluralizeUnit(unit, qty)}`)
  if (includePallet && palletCount) parts.push(`(${palletCount} PALLETS)`)

  return parts.join(' ')
}

export function buildPackingNames(items) {
  return [...new Set(
    getPackingItems({ items })
      .map(item => item.packageType || item.package)
      .filter(Boolean),
  )].join(', ')
}

export function buildPackagingSummary(items) {
  const totals = new Map()
  let totalPallets = 0

  getPackingItems({ items }).forEach(item => {
    const qty = asNumber(item.quantity)
    const unit = getItemUnit(item)
    if (qty && unit) totals.set(unit, (totals.get(unit) || 0) + qty)
    totalPallets += asNumber(item.palletCount)
  })

  const qtyParts = [...totals.entries()].map(([unit, qty]) => `${qty} ${pluralizeUnit(unit, qty)}`)
  if (totalPallets) qtyParts.push(`(${totalPallets} PALLETS)`)

  return qtyParts.join(', ')
}

export function buildTotalNet(items) {
  return getPackingItems({ items }).reduce((sum, item) => sum + getItemTotalNet(item), 0)
}

export function buildTotalGross(items) {
  return getPackingItems({ items }).reduce((sum, item) => sum + getItemTotalGross(item), 0)
}

export function buildCommercialInvoiceRows(items) {
  return getPackingItems({ items }).map(item => ({
    ...item,
    quantity: asNumber(item.netWeight || item.quantity),
    amount: item.isSample ? 0 : asNumber(item.amount || asNumber(item.netWeight || item.quantity) * asNumber(item.unitPrice)),
    amountText: item.isSample ? 'F.O.C' : '',
    sampleDescription: buildSampleDescription(item),
  }))
}

export function buildCommercialTotalAmount(items) {
  return buildCommercialInvoiceRows(items).reduce((sum, item) => sum + asNumber(item.amount), 0)
}

export function buildCertificateGoodsText(items) {
  return getPackingItems({ items })
    .filter(item => !item.isSample)
    .map(item => {
      const net = asNumber(item.netWeight).toLocaleString('en-US')
      const qty = asNumber(item.quantity)
      const unit = getItemUnit(item)

      const packageText = item.packageType
        ? `${item.packageType.match(/^\d+\s*KG/i)?.[0]?.replace(/\s+/g, '') || ''}X${qty}${unit}`.replace(/^X/, '')
        : buildItemPackageSummary(item, { includePallet: false }).replace(/\s+/g, '')

      return `${net} KGS (${packageText}) OF ${item.descriptionOfGoods || ''}`
    })
    .filter(Boolean)
    .join(' , ')
}

export function buildShippingProductDescriptions(items) {
  return getPackingItems({ items })
    .filter(item => !item.isSample)
    .map(item => [
      item.descriptionOfGoods,
      item.subDescription ? `(${item.subDescription})` : '',
    ].filter(Boolean).join(' '))
    .filter(Boolean)
}

export function buildFirstMarks(items) {
  const first = getPackingItems({ items }).find(item => item.marksAndNos)

  return first ? String(first.marksAndNos).split('\n').filter(Boolean) : []
}
