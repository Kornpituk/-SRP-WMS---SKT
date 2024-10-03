<script setup>
import { ref } from "vue"

const items = ref([
  { sktLotNo: '', productCode: '', tradeName: '', netWeight: '', packing: '', quantity: '', customerName: '', deliveryPlace: '' },
  { sktLotNo: '', productCode: '', tradeName: '', netWeight: '', packing: '', quantity: '', customerName: '', deliveryPlace: '' },
])

const exportT = ref(false)
const domestic = ref(false)
const conditions = ref({ shippingMark: false, sanyoChemical: false })
const checkedBy = ref('')
const preparedBy = ref('')
const driverCheckedBy = ref('')


const checkboxOne = ref(false)

const checkboxThree = ref(true)
const checkboxTwo = ref(false)

import image01 from '../image/01.png'
import image02 from '../image/02.png'
import image03 from '../image/03.png'

const selectedLanguage = ref([])

const addItemsLang = item => {
  const index = selectedLanguage.value.indexOf(item)
  if (index === -1) {
    selectedLanguage.value.push(item)
  } else {
    selectedLanguage.value.splice(index, 1)
  }
  console.log('Log Lang Add', selectedLanguage.value)
}
</script>

<template>
  <VContainer fluid>
    <div class="my-6">
      <table class="custom-table">
        <!-- col header -->
        <tr>
          <td
            colspan="10"
            class="header text-center bg-perfect-scrollbar-thumb"
          >
            Resale / Product Shipping Check Sheet (Drum and Gallon) on ....27-11-2023...1100076181......
          </td>
          <td
            colspan="5"
            class="header bg-yellow"
          >
            <div class="checkbox-container">
              <VCheckbox />Export
              <VCheckbox />Domicile
            </div>
          </td>
        </tr>
        <!-- table header -->
        <!-- table header -->
        <tr class="text-center">
          <th rowspan="1">
            No.
          </th>
          <th rowspan="1">
            SKT Lot No.
          </th>
          <th rowspan="1">
            Supplier Lot No.
          </th>
          <th rowspan="1">
            Product Code
          </th>
          <th rowspan="1">
            Trade Name
          </th>
          <th rowspan="1">
            Packaging
          </th>
          <th rowspan="1">
            Net Content
          </th>
          <th rowspan="1">
            Amount
          </th>
          <th rowspan="1">
            Quantity (Kg.)
          </th>
          <th rowspan="1">
            Customer Name
          </th>
          <th
            colspan="2"
            rowspan="1"
          >
            Delivery Place
          </th>
          <th
            colspan="1"
            rowspan="1"
          >
            Appearance Check
          </th>
          <th
            colspan="2"
            rowspan="1"
          >
            Remark
          </th>
        </tr>
        
        <!-- table row -->
        <tr>
          <td>1</td>
          <td>PC2311000B</td>
          <td>4500178132/0320</td>
          <td>CHEMICAL PR-029</td>
          <td>CHEMICAL PR-029</td>
          <td>DM</td>
          <td>200</td>
          <td>8</td>
          <td>1,800.00</td>
          <td>INNOVATIVE CHEMICALS</td>
          <td
            colspan="2"
            class="text-center"
          >
            SKT
          </td>
          <td class="text-center">
            <div class="d-flex justify-center">
              <VCheckbox />
            </div>
          </td>
          <td class="text-center">
            12 Bags X 1 พาเลท
          </td>
        </tr>
        <!-- Example for adding more rows -->
        <tr>
          <td>2</td>
          <td>PC2311001C</td>
          <td>4500178133/0321</td>
          <td>CHEMICAL PR-030</td>
          <td>CHEMICAL PR-030</td>
          <td>DM</td>
          <td>300</td>
          <td>10</td>
          <td>2,000.00</td>
          <td>ADVANCED CHEMICALS</td>
          <td
            colspan="2"
            class="text-center"
          >
            SKT
          </td>
          <td class="text-center">
            <div class="d-flex justify-center">
              <VCheckbox />
            </div>
          </td>
          <td class="text-center">
            10 Bags X 1 พาเลท
          </td>
        </tr>
        <tr>
          <td
            colspan="3"
            class="section-title text-center bg-perfect-scrollbar-thumb"
          >
            ** Condition check for special request **
          </td>
          <td
            colspan="2"
            class="section-title text-center bg-perfect-scrollbar-thumb"
          >
            Check by
          </td>
          <td
            colspan="5"
            class="section-title text-center bg-yellow"
          >
            Picture Label
          </td>
          <td
            colspan="10"
            class="section-title text-center bg-yellow"
          >
            Picture for Packaging
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <VCheckbox />
          </td>
          <td
            class="text-underline"
            colspan="2"
          >
            <u>SHIPPING MARK</u>
          </td>
          <td
            class="text-center"
            colspan="2"
          >
            --
          </td>
          <td
            class="text-center cursor-pointer"
            colspan="1"
            ripple
            :style="{
              borderColor: selectedLanguage.includes('Thai') ? 'green' : '',
              borderWidth: selectedLanguage.includes('Thai') ? '5px': '1px',
              borderStyle: 'solid',
            }"
            :class="{'bg-green-lighten-3': selectedLanguage.includes('Thai')}"
            @click="addItemsLang('Thai')"
          >
            Thai
          </td>
          <td
            colspan="4"
            rowspan="6"
          >
            <div class="d-flex justify-center">
              <VImg
                height="250"
                width="150"
                :src="image02"
                alt="Packaging Image"
                class="image"
              />
            </div>
          </td>
          <td
            colspan="4"
            rowspan="6"
          >
            <div class="d-flex justify-center">
              <VImg
                height="250"
                width="150"
                :src="image01"
                alt="Packaging Image"
                class="image"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <VCheckbox />
          </td>
          <td colspan="2">
            PR2E(1)2312
          </td>
          <td
            class="text-center"
            colspan="2"
          >
            --
          </td>
          <td
            class="text-center  cursor-pointer"
            colspan="1"
            ripple
            :style="{
              borderColor: selectedLanguage.includes('English') ? 'green' : '',
              borderWidth: selectedLanguage.includes('English') ? '5px': '1px',
              borderStyle: 'solid',
              
            }"
            :class="{'bg-green-lighten-3': selectedLanguage.includes('English')}"
            @click="addItemsLang('English')"
          >
            English
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <VCheckbox />
          </td>
          <td colspan="2">
            SAN~O CHEMICAL
          </td>
          <td
            class="text-center"
            colspan="2"
          >
            --
          </td>
          <td
            class="text-center  cursor-pointer"
            colspan="1"
            ripple
            :style="{
              borderColor: selectedLanguage.includes('Japanese') ? 'green' : '',
              borderWidth: selectedLanguage.includes('Japanese') ? '5px': '1px',
              borderStyle: 'solid',
            }"
            :class="{'bg-green-lighten-3': selectedLanguage.includes('Japanese')}"
            @click="addItemsLang('Japanese')"
          >
            Japanese
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <VCheckbox />
          </td>
          <td colspan="2">
            KYO~O / JAPAN
          </td>
          <td
            class="text-center"
            colspan="2"
          >
            --
          </td>
          <td
            class="text-center  cursor-pointer" 
            colspan="1"
            ripple
            :style="{
              borderColor: selectedLanguage.includes('Chinese') ? 'green' : '',
              borderWidth: selectedLanguage.includes('Chinese') ? '5px': '1px',
              borderStyle: 'solid',
            }"
            :class="{'bg-green-lighten-3': selectedLanguage.includes('Chinese')}"
            @click="addItemsLang('Chinese')"
          >
            Chinese
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <VCheckbox />
          </td>
          <td colspan="2">
            ส่ง ตัวอย่าง 250 g = 1 ขวด/Lot ให้ SCI พร้อมแนบไปกับสินค้า
          </td>
          <td
            class="text-center"
            colspan="2"
          >
            --
          </td>
          <td
            class="text-center  cursor-pointer"
            colspan="1"
            ripple
            :style="{
              borderColor: selectedLanguage.includes('Malaysia') ? 'green' : '',
              borderWidth: selectedLanguage.includes('Malaysia') ? '5px': '1px',
              borderStyle: 'solid',
            }"
            :class="{'bg-green-lighten-3': selectedLanguage.includes('Malaysia')}"
            @click="addItemsLang('Malaysia')"
          >
            Malaysia
          </td>
        </tr>
        <tr>
          <td colspan="1">
            <VCheckbox />
          </td>
          <td colspan="2">
            ตืดฉลากภาษาญี่ปุ่นและภาษาอังกฤษ
          </td>
          <td
            class="text-center"
            colspan="2"
          >
            --
          </td>
          <td
            class="text-center  cursor-pointer"
            colspan="1"
            ripple
            :style="{
              borderColor: selectedLanguage.includes('SDS') ? 'green' : '',
              borderWidth: selectedLanguage.includes('SDS') ? '5px': '1px',
              borderStyle: 'solid',
            }"
            :class="{'bg-green-lighten-3': selectedLanguage.includes('SDS')}"
            @click="addItemsLang('SDS')"
          >
            SDS
          </td>
        </tr>

        <!--  validate -->
        <tr>
          <td
            colspan="5"
            class="section-title"
          />
          <td
            colspan="5"
            class="section-title text-center bg-yellow"
          >
            ตรวจสอบรายการต่อไปนี้ก่อนจัดส่ง
          </td>
          <td
            colspan="3"
            class="section-title text-center bg-perfect-scrollbar-thumb"
          >
            <div class="d-flex justify-center align-center">
              <VCheckbox /> Wood
            </div>
          </td>
          <td
            colspan="2"
            class="section-title text-center bg-perfect-scrollbar-thumb"
          >
            <div class="d-flex justify-center align-center ">
              <VCheckbox /> Plastic
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="5" />
          <td colspan="1">
            <div class="d-flex justify-center align-center">
              <VCheckbox />
            </div>
          </td>
          <td colspan="4">
            สินค้ากับฉลากตรงกัน
          </td>
          <td
            rowspan="5"
            colspan="3"
          >
            <div class="d-flex justify-center">
              <img
                :src="packagingImageUrl"
                alt="Packaging Image"
                class="image"
              >
            </div>
          </td>
          <td
            rowspan="5"
            colspan="5"
          >
            <VImg
              height="250"
              width="150"
              :src="image03"
              alt="Packaging Image"
              class="image"
            />
          </td>
        </tr>
        <tr>
          <td colspan="5" />
          <td colspan="1">
            <div class="d-flex justify-center align-center">
              <VCheckbox />
            </div>
          </td>
          <td colspan="4">
            มีฉลากติดตรงจุดที่กำหนด
          </td>
        </tr>
        <tr>
          <td colspan="5" />
          <td colspan="1">
            <div class="d-flex justify-center align-center">
              <VCheckbox />
            </div>
          </td>
          <td colspan="4">
            ฉลากไม่ฉีกขาด
          </td>
        </tr>
        <tr>
          <td colspan="5" />
          <td colspan="1">
            <div class="d-flex justify-center align-center">
              <VCheckbox />
            </div>
          </td>
          <td colspan="4">
            ชื่อและLot no.บนฉลากถูกต้อง
          </td>
        </tr>
        <tr>
          <td colspan="5" />
          <td colspan="1">
            <div class="d-flex justify-center align-center">
              <VCheckbox />
            </div>
          </td>
          <td colspan="4">
            ฉลากมีทั้ง2ภาษาและติดคู่กันถูกต้อง
          </td>
        </tr>
        <tr>
          <td
            colspan="5"
            class="section-title text-center bg-yellow"
          >
            ผู้ตรวจสอบ
          </td>
          <td
            colspan="5"
            class="section-title"
          />
          <td
            colspan="5"
            class="section-title text-center bg-yellow"
          >
            ตรวจสอบบรรจุภัณฑ์
          </td>
        </tr>
        <tr>
          <td
            class="section-title bg-yellow"
            colspan="2"
          >
            Prepared By
          </td>
          <td
            class="section-title bg-yellow"
            colspan="1"
          >
            Checked By
          </td>
          <td
            class="section-title bg-yellow"
            colspan="2"
          >
            Driver checked By
          </td>
          <td
            class=""
            colspan="5"
          />


          <td
            colspan="1"
            class=""
          >
            Wrapping
          </td>
          <td
            colspan="2"
            class=""
          >
            <div class="d-flex justify-center align-center">
              <VCheckbox />
              Yes 
            </div>
          </td>
          <td
            colspan="2"
            class=""
          >
            <div class="d-flex justify-center align-center">
              <VCheckbox />
              No 
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            PHIROM
          </td>
          <td colspan="1">
            PHIROM
          </td>
          <td colspan="2">
            PHIROM
          </td>
          <td
            colspan="5"
            class=""
          />
          <td
            colspan="5"
            class=""
          />
        </tr>
        <tr>
          <td colspan="2">
            Date .... / .... / ...
          </td>
          <td colspan="1">
            Date .... / .... / ...
          </td>
          <td colspan="2">
            Date .... / .... / ...
          </td>

          <td
            colspan="5"
            class=""
          />
          <td
            colspan="5"
            class=""
          />
        </tr>
        <tr>
          <td colspan="5">
            หมายเหตุ : คนขับรถ ตรวจสภาพสินค้าหลังนำขึ้นรถแล้ว  สภาพปกติ ไม่รั่ว 
          </td>
          <td
            colspan="5"
            class=""
          />
          <td
            colspan="5"
            class=""
          />
        </tr>
      </table>
    </div>
  </VContainer>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 0;
  text-align: center;
}

.custom-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}

.section-title {
  font-weight: bold;
}

.image {
  inline-size: 100px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
