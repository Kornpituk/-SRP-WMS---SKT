import packingListMapper from './packingList'

// import commercialInvoiceMapper from './commercialInvoice'
// import certificateOfOriginMapper from './certificateOfOrigin'
// import packingDeclarationMapper from './packingDeclaration'
// import shippingParticularMapper from './shippingParticular'


const mappers = {
  packingList: packingListMapper,

  // commercialInvoice: commercialInvoiceMapper,
  // certificateOfOrigin: certificateOfOriginMapper,
  // packingDeclaration: packingDeclarationMapper,
  // shippingParticular: shippingParticularMapper,
}

export function getMapper(tabKey) {
  return mappers[tabKey]
}
