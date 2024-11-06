// receivingModel.js

export const ControllerDeleteAllCIA = {
  deleteAllCIA (coaFiles, files) {
    coaFiles.value = []
    files.value = []
  },
}

export const ReceivingModel = {
  getReceivingData(poEtlLogDetailJournalID) {
    return axios.get(`/api/v1/ReceivingPlan/GetByPoEtlLogDetailJournalID/${poEtlLogDetailJournalID}`)
  },
}
