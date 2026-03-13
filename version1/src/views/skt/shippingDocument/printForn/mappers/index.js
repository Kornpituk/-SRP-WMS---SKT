import packingListMapper from './packingList'
import commercialInvoiceMapper from './commercialInvoiceTab'
import certificateOfOriginMapper from './certificateOfOriginTab'
import packingDeclarationMapper from './packingDeclarationTab'
import shippingParticularMapper from './shippingParticularTab'


const mappers = {
  packingList: packingListMapper,
  commercialInvoice: commercialInvoiceMapper,
  certificateOfOrigin: certificateOfOriginMapper,
  packingDeclaration: packingDeclarationMapper,
  shippingParticular: shippingParticularMapper,
}

export function getMapper(tabKey) {
  return mappers[tabKey]
}
