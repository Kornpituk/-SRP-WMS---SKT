import { createCrudService } from '@/views/skt/settingMaster/services/serviceUtils'

let mockData = [
  { 
    id: 1, 
    accountNo: "123-4-56789-0", 
    bankName: "Bangkok Bank Public Company Limited", 
    address: "333 Silom Road, Silom, Bangrak, Bangkok 10500, Thailand", 
    swiftCode: "BKKBTHBK",
  },
  { 
    id: 2, 
    accountNo: "9876543210", 
    bankName: "Kasikornbank Public Company Limited", 
    address: "1 Soi Kasikornthai, Rat Burana, Bangkok 10140, Thailand", 
    swiftCode: "KASITHBK",
  },
  { 
    id: 3, 
    accountNo: "445566778899", 
    bankName: "Krungsri (Bank of Ayudhya) Public Company Limited", 
    address: "1222 Rama III Road, Bang Phongphang, Yannawa, Bangkok 10120, Thailand", 
    swiftCode: "AYUDTHBK",
  },

  // เพิ่มข้อมูลตัวอย่างธนาคารอื่นๆ
  { 
    id: 4, 
    accountNo: "555-1-23456-7", 
    bankName: "Siam Commercial Bank Public Company Limited", 
    address: "9 Ratchadapisek Road, Jatujak, Bangkok 10900, Thailand", 
    swiftCode: "SICOTHBK",
  },
  { 
    id: 5, 
    accountNo: "888-9-87654-3", 
    bankName: "TMBThanachart Bank Public Company Limited", 
    address: "3000 Phahonyothin Road, Chomphon, Chatuchak, Bangkok 10900, Thailand", 
    swiftCode: "TMBKTHBK",
  },
  { 
    id: 6, 
    accountNo: "777-2-34567-8", 
    bankName: "United Overseas Bank (Thai) Public Company Limited", 
    address: "191 South Sathorn Road, Sathorn, Bangkok 10120, Thailand", 
    swiftCode: "UOVBTHBK",
  },
  { 
    id: 7, 
    accountNo: "666-3-78901-2", 
    bankName: "CIMB Thai Bank Public Company Limited", 
    address: "44 Langsuan Road, Lumpini, Pathumwan, Bangkok 10330, Thailand", 
    swiftCode: "CIMBTHBK",
  },
  { 
    id: 8, 
    accountNo: "999-5-43210-1", 
    bankName: "Standard Chartered Bank (Thai) Public Company Limited", 
    address: "90 North Sathorn Road, Silom, Bangrak, Bangkok 10500, Thailand", 
    swiftCode: "SCBLTHBK",
  },
]

// ← เปลี่ยน false = ใช้ API จริง
export const bankaccountnoService = createCrudService('bank-account-no', mockData, true)
