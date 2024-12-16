export class ProductionDataModel {
  constructor() {
    const defaultFields = {
      actualFgEntryBy: '',
      actualFgEntryDate: '',
      actualFinishedBy: '',
      actualFinishedDate: '',
      actualStartBy: '',
      actualStartDate: '',
      batchID: '',
      finishedDate: '',
      inputDate: '',
      journalID: '',
      linkedJournalID: '',
      lotNumber: '',
      no: 0,
      planningApprovedBy: '',
      planningApprovedDate: '',
      planningID: '',
      plantName: '',
      producingDate: '',
      product1InBomName: '',
      product1Name: '',
      product1PackagingName: '',
      product1PackingQtyKgs: 0,
      product1SelectedCode: '',
      product1SelectedPackagingCode: '',
      product1UomCount: 0,
      product2InBomName: '',
      product2Name: '',
      product2PackagingName: '',
      product2PackingQtyKgs: 0,
      product2SelectedCode: '',
      product2SelectedPackagingCode: '',
      product2UomCount: 0,
      productionCode: '',
      productionName: '',
      quantityKgs: 0,
      reactorName: '',
      remark: '',
      seqNo: '',
      statusComments: '',
      statusId: 0,
      submitedBy: '',
      submitedDate: '',
      updatedBy: '',
      updatedDate: '',
    }
  
    Object.entries(defaultFields).forEach(([key, defaultValue]) => {
      this[key] = data[key] ?? defaultValue
    })
  }
}
  