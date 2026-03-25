// mappers/shippingDocExcel.mapper.js
export function mapShippingDocsToExcel(items) {
  return items.map((i, index) => ({
    No: index + 1,
    Status: i.status,
    'Invoice (SAP)': i.invoiceInSAP,
    Invoice: i.invoice,
    Payer: i.payerName,
    Consignee: i.consignee,
    Item: i.item,
    Qty: i.qty,
    UOM: i.uom,
    Term: i.termOfPricing,
    Mode: i.shippingMode,
    ETD: i.etd,
    Destination: i.destination,
  }))
}

export function mapTableToExcel(items, headers, pagination) {
  return items.map((item, index) => {
    const row = {}

    headers
      .filter(h => h.exportable !== false)
      .filter(h => h.key !== 'actions') // ✅ ตัดตรงนี้
      .forEach(h => {
        // handle No. column (special case)
        if (h.key === 'no') {
          row[h.title] =
            (pagination.page - 1) * pagination.itemsPerPage + index + 1
        } else {
          row[h.title] = item[h.key]
        }
      })

    return row
  })
}
