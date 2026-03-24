import packingListMapper from './packingList'
import commercialInvoiceMapper from './commercialInvoiceTab'
import certificateOfOriginMapper from './certificateOfOriginTab'
import packingDeclarationMapper from './packingDeclarationTab'
import shippingParticularMapper from './shippingParticularTab'


const mappers = {
  'PACKING LIST': packingListMapper,
  'COMMERCIAL INVOICE': commercialInvoiceMapper,
  'CERTIFICATE OF ORIGIN': certificateOfOriginMapper,
  'PACKING DECLARATION': packingDeclarationMapper,
  'SHIPPING PARTICULAR': shippingParticularMapper,
}

export function getMapper(tabKey) {
  return mappers[tabKey]
}
