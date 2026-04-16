import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

const mockData = [
  {
    termOfPaymentId: 1,
    abb: 'T/T',
    termOfPaymentName: 'T/T 30 DAYS FROM B/L DATE',
    startDateLabel: 'B/L Date',
    startDateType: 'B/L Date',
    days: '30',
  },
  {
    termOfPaymentId: 2,
    abb: 'T/T',
    termOfPaymentName: 'T/T 30 DAYS FROM END MONTH',
    startDateLabel: 'End Month',
    startDateType: 'End Month',
    days: '30',
  },
]

const baseService = createCrudService({
  resourceName: 'TermOfPayment',
  idField: 'termOfPaymentId',
  mockData,
  useMock: false,
  map: {
    termOfPaymentId: 'termOfPaymentId',
    id: 'termOfPaymentId',
    abb: 'abb',
    termOfPaymentName: 'termOfPaymentName',
    startDateLabel: 'startDateLabel',
    startDateType: 'startDateType',
    days: 'days',
  },
})

export const termOfPaymentService = {
  ...baseService,
  save: payload => {
    const nextPayload = { ...payload }

    delete nextPayload.startDateLabel

    return baseService.save(nextPayload)
  },
}
