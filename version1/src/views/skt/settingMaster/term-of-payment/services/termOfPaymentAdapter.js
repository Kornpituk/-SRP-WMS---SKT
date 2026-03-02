// src/views/TermOfPayment/services/termOfPaymentAdapter.js

import {
  fetchListService,
  createService,
  updateService,
  deleteService,
} from './termOfPayment.service'

/**
 * Adapter ที่แปลง 4 functions แยกกัน
 * ให้กลายเป็น MasterService interface
 * ที่ BaseMasterCrud ต้องการ
 */
export const termOfPaymentService = {
  // BaseMasterCrud เรียก service.getList(params)
  getList: params => fetchListService(params),

  // BaseMasterCrud เรียก service.create(payload)
  create: payload => createService(payload),

  // BaseMasterCrud เรียก service.update(id, payload)
  update: (id, payload) => updateService(id, payload),

  // BaseMasterCrud เรียก service.delete(id)
  delete: id => deleteService(id),
}
