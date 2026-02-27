// src/views/TermOfPayment/services/termOfPaymentAdapter.js

import {
  fetchTermOfPaymentListService,
  createTermOfPaymentService,
  updateTermOfPaymentService,
  deleteTermOfPaymentService,
} from './termOfPayment.service'

/**
 * Adapter ที่แปลง 4 functions แยกกัน
 * ให้กลายเป็น MasterService interface
 * ที่ BaseMasterCrud ต้องการ
 */
export const termOfPaymentService = {
  // BaseMasterCrud เรียก service.getList(params)
  getList: params => fetchTermOfPaymentListService(params),

  // BaseMasterCrud เรียก service.create(payload)
  create: payload => createTermOfPaymentService(payload),

  // BaseMasterCrud เรียก service.update(id, payload)
  update: (id, payload) => updateTermOfPaymentService(id, payload),

  // BaseMasterCrud เรียก service.delete(id)
  delete: id => deleteTermOfPaymentService(id),
}
