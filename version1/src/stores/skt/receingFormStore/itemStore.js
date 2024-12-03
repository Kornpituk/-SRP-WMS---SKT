import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const SECRET_KEY = 'KornpitakHandsome&Cool' // คีย์ลับสำหรับเข้ารหัส
import { useCookie } from '@/stores/skt/receingFormStore/useCookie'

// กำหนดประเภทของ state เพื่อให้ TypeScript รู้จัก
export const useItemStore = defineStore('itemStore', {
  state: () => ({
    itemDetails: null, // เก็บข้อมูล Product
  }),
  actions: {
    setItemDetails(data, nameCookie) {
      this.itemDetails = data

      // เข้ารหัสข้อมูลก่อนบันทึกใน cookies
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY,
      ).toString()

      Cookies.set(nameCookie, encryptedData, { expires: 30 }) // บันทึกข้อมูลที่เข้ารหัสใน cookies
    },
    getItemDetails(nameCookie) {
      const encryptedData = Cookies.get(nameCookie)

      if (encryptedData) {
        try {
          // ถอดรหัสข้อมูลจาก cookies
          const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

          this.itemDetails = decryptedData // ตั้งค่าใน state
          
          return this.itemDetails // คืนค่าข้อมูล
        } catch (error) {
          console.error('Error decrypting data:', error)
          
          return null // กรณีข้อมูลถอดรหัสไม่ได้
        }
      }

      return null // หากไม่มีข้อมูลใน cookies ก็คืนค่า null
    },
    clearItemDetails(nameCookie) {
      Cookies.remove(nameCookie) // ลบข้อมูลใน cookies
      this.itemDetails = null
    },
  },
})

export const useCookieStore = defineStore('cookieStore', {
  state: () => ({
    cookieValue: null,
  }),
  actions: {
    setCookieValue(value) {
      this.cookieValue = value
    },
  },
})
