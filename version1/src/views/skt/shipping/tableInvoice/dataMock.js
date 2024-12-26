// ฟังก์ชันสำหรับสุ่มสถานะ (ตามที่ใช้ใน mockData)
const getRandomStatus = () => {
  const statuses = ['Pending', 'Approved', 'Rejected']
  
  return statuses[Math.floor(Math.random() * statuses.length)]
}
  
// ข้อมูล mockData
export const mockData = ref([
  { no: 1, status: getRandomStatus(), saleOrderNo: '1100077645', soAttachment: '', 
    sapInvoiceNo: 'TIX2406001', payerName: 'DAINICHI COLOR (THAILAND) LTD.', user: 'CHALERM CHAICHAN CO., LTD.', shipper: 'CHALERM CHAICHAN CO., LTD.', 
    shipperLocation: '536 Ekkachai Rd, Khlong Bang Phran, Bang Bon, Bangkok 10150', shippingCondition: `1) COA 1 Set
    2) Label in English & Malaysian Language
    3) Shipping mark provide by TCPT`, shippingMark: `AL-40
    No. 
    PO NO.
    MADE IN THAILAND`, endUser: '', consignee: 'SHANGHAI NAGASE TRADING CO., LTD.', product: 'SANPRENE IB-967T Do 1st-Org2', 
    lotNumber: [{ id: '01', lotNUmber: 'PC23110006' }, 
      { id: '01', lotNUmber: 'PC23110007' }], qty: '16,000.00', coa: '', 
    freightForwarder: '', carrier: '', vesselName: '', truck: 'LCL', truckResNo: '', 
    truckFee: '', truckPrint: '', truckOrder: '', doEx: '', country: 'SINGAPORE', 
    loadingDate: '07/05/2024', etd: '07/05/2024', eta: '25/05/2024', deliveryNote: '', 
    remarkSal: '', remarkWh: 'Shipping complete', remarkLog: '5501354541', 
    byWhow: 'admin' },
  { no: 2, status: getRandomStatus(), saleOrderNo: '1100077646', 
    soAttachment: '', sapInvoiceNo: 'TIX2406002', payerName: 'MC INDUSTRIAL CHEMICAL CO., LTD.', 
    user: 'MC INDUSTRIAL CHEMICAL CO., LTD.', shipper: 'CHALERM CHAICHAN CO., LTD.', shipperLocation: '536 Ekkachai Rd, Khlong Bang Phran, Bang Bon, Bangkok 10150', shippingCondition: `1) COA 1 Set
    2) Label in English & Malaysian Language
    3) Shipping mark provide by TCPT`, 
    shippingMark: `AL-47
    No. 
    PO NO.
    MADE IN THAILAND`, endUser: '', consignee: 'PT. SHINTO PAINT MANUFACTURING INDO', product: 'SANPRENE TH8  D/M  1st-Org2', 
    lotNumber: [{ id: '01', lotNUmber: 'PC23110041' }, 
      { id: '01', lotNUmber: 'PC23110007' }, 
      { id: '01', lotNUmber: 'PC23110008' }], qty: '14,400.00', coa: '', 
    freightForwarder: '', carrier: '', vesselName: '', truck: 'LEO', truckResNo: '',  truckFee: '', 
    truckPrint: '', truckOrder: '', doEx: '', country: 'JAPAN', 
    loadingDate: '06/07/2024', etd: '18/06/2024', eta: '20/06/2024', deliveryNote: '', 
    remarkSal: '', remarkWh: '', remarkLog: 'OSMO(1)2405', byWhow: 'WH1' },
  { no: 3, status: getRandomStatus(), saleOrderNo: '1100077647', soAttachment: '', 
    sapInvoiceNo: 'TIX2406003', payerName: 'TOA PAINT (THAILAND) PCL.', user: 'TOA PAINT (THAILAND) PCL.', shipper: 'TOA PAINT (THAILAND) PCL.', 
    shipperLocation: '31/2 Moo 3 Bang Na-Trat Frontage Rd, Bang Sao Thong, Bang Sao Thong District, Samut Prakan 10570', shippingCondition: `1) On plastic pallet with wrapping
    2) Label with product name and lot number
    3) COA Original 2 sets
    4) Shipping mark
    CHEMICLEAN AS- S142T
    NO. 1-
    PO. No....SHM400000XXXX
    MM02P02031
    MADE IN THAILAND`, shippingMark: `CHEMICLEAN AS- S142T
    NO. 1-
    PO. No....SHM400000XXXX
    MM02P02031
    MADE IN THAILAND`, 
    endUser: '', consignee: 'PT. HI-TECH INK INDONESIA', product: 'GLYCI-ALE PP-300P (DO) 1st-org2', 
    lotNumber: [{ id: '01', lotNUmber: 'PC231151561' }], 
    qty: '5,000.00', coa: '', freightForwarder: '', carrier: '', 
    vesselName: '', truck: 'BTS', truckResNo: '',  truckFee: '', truckFee: '', truckPrint: '',
    doEx: '', country: 'MALAYSIA', loadingDate: '06/02/2024', etd: '10/03/2024', 
    eta: '29/03/2024', deliveryNote: '', remarkSal: '', remarkWh: '', remarkLog: '7400',
    byWhow: 'WH2' },
])
  
export default mockData
