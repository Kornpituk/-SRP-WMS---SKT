export const usefileInput = () => {
  const typeFileInput = ref('hideInput')

  const filesFromUploaderSO = ref([])
  const filesFromUploaderPO = ref([])
  const filesFromUploaderCOA = ref([])
  const filesFromUploaderTruckOrder = ref([])
  const filesFromUploaderDeliNote = ref([])

  return {
    typeFileInput,
    filesFromUploaderSO,
    filesFromUploaderPO,
    filesFromUploaderCOA,
    filesFromUploaderTruckOrder,
    filesFromUploaderDeliNote,
  }
}
