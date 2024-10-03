export const modelHeader = { sktName: "AZOBIS", 
  rawMatCode: "4156391503420", 
  supplierName: "No Dent, Clearness, NoScratch", 
  receivedDate: "", 
  tradeName: "", 
  manufacturerName: "",
  cerCOA: false,
  note: "",
  details: "",
  staffWH: "",
  suppWH: "",
  staffDate: "",
  suppDate: "",
}
  
export function createPayload(data) {
  return {
    sktName: data.itemName,
    rawMatCode: data.itemCode,
    supplierName: data.supplierName,
    receivedDate: data.updatedDate,
    tradeName: data.concatTradename,
    manufacturerName: data.manufacturerName,
    cerCOA: data.cerCOA,
    note: data.note,
    details: data.details,
    staffWH: data.staffWH,
    suppWH: data.suppWH,
    staffDate: data.staffDate,
    suppDate: data.suppDate,
  }
}
