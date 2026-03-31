# SKT Setting Master

เอกสารนี้อธิบายโครงสร้างและแนวคิดของโมดูล `src/views/skt/settingMaster` สำหรับคนที่เข้ามารับช่วงโปรเจกต์ครั้งแรก เพื่อให้อ่านแล้วเข้าใจว่าโค้ดชุดนี้ทำงานอย่างไร, หน้าไหนใช้ pattern กลางร่วมกัน, หน้าไหนเขียนแยก, และควรเริ่มแก้จากตรงไหนเมื่อมี requirement ใหม่

## 1. โฟลเดอร์นี้คืออะไร

โฟลเดอร์ `settingMaster` เป็นชุดหน้าจอสำหรับจัดการข้อมูล Master ของฝั่ง Shipping Documents เช่น

- Forwarder
- Term of Payment
- Port
- Term of Pricing
- Currency
- Container Type
- Package
- HS Code No
- Bank Account No
- Shipping Mode
- Carrier
- Sale Person
- Ship Document

หน้ากลุ่มนี้ส่วนใหญ่เป็น CRUD page:

- โหลดรายการข้อมูล
- ค้นหา
- เรียงลำดับ
- แบ่งหน้า
- เพิ่มข้อมูล
- แก้ไขข้อมูลแบบ inline ในตาราง
- ลบข้อมูล

## 2. ภาพรวมสถาปัตยกรรม

ภายในโฟลเดอร์นี้มี 2 รูปแบบหลัก

### 2.1 กลุ่มมาตรฐาน: ใช้ BaseMasterCrud ร่วมกัน

โมดูลส่วนใหญ่ใช้ component กลางชื่อ `BaseMasterCrud.vue` ร่วมกับ composable `useMasterCrud.js`

แนวคิดคือแต่ละหน้าไม่ต้องเขียน CRUD ใหม่ทั้งหมด แค่ส่ง 3 อย่างเข้าไป:

1. `title`
2. `fields`
3. `service`

ตัวอย่าง pattern ของแต่ละหน้า:

```vue
<template>
  <BaseMasterCrud
    title="Carrier"
    :fields="fields"
    :service="carrierService"
    delete-name-key="id"
  />
</template>
```

ข้อดีของ pattern นี้:

- เพิ่มหน้า master ใหม่ได้เร็ว
- พฤติกรรมของหลายหน้าจะสม่ำเสมอกัน
- เวลาแก้ UI/UX กลาง แก้ครั้งเดียวกระทบหลายหน้า

### 2.2 กลุ่มพิเศษ: เขียนแยกเอง

`ship-document` ไม่ได้ใช้ `BaseMasterCrud`

หน้านี้แยกเขียนเองทั้ง table, dialog, form, composable และ service เพราะรูปแบบการใช้งาน/การออกแบบอาจถูกแยกพัฒนาอีกสายหนึ่ง

ผลคือ:

- ยืดหยุ่นกว่า
- แต่ behavior ไม่เหมือน master อื่น 100%
- เวลาปรับมาตรฐานต้องดูแยกอีกชุด

## 3. โครงสร้างโฟลเดอร์

```text
settingMaster/
  bank-account-no/
  carrier/
  components/
  container-type/
  currency/
  forwarder/
  hs-code-no/
  package/
  port/
  sale-person/
  services/
  ship-document/
  shipping-mode/
  term-of-payment/
  term-of-pricing/
```

### 3.1 `components/`

ชุด component กลางที่ใช้กับ master มาตรฐาน

- `BaseMasterCrud.vue`
  หน้าหลักที่ประกอบทุก sub-component เข้าด้วยกัน
- `useMasterCrud.js`
  เก็บ logic หลักทั้งหมดของ CRUD
- `MasterHeader.vue`
  ส่วนหัวของหน้า
- `MasterSearchBar.vue`
  search/filter bar
- `MasterToolbar.vue`
  ปุ่ม create และ refresh
- `MasterTable.vue`
  ตารางข้อมูล + sort + pagination + inline edit
- `MasterCreateDialog.vue`
  dialog สำหรับสร้าง record
- `MasterDeleteDialog.vue`
  dialog ยืนยันการลบ
- `MasterSnackbar.vue`
  แจ้งเตือนผลลัพธ์
- `index.js`
  barrel export

### 3.2 `services/`

- `serviceUtils.js`
  utility กลางสำหรับสร้าง CRUD service ของแต่ละ master ด้วย `createCrudService()`

แนวคิดคือไม่ต้องเขียน axios CRUD ซ้ำทุกโมดูล

### 3.3 โฟลเดอร์รายโมดูล

แต่ละโมดูลมักจะประกอบด้วย

- `*.vue` หรือ `*View.vue`
  ตัวหน้า
- `field/Field.js` หรือ `types/*.js`
  config ของ field
- `services/*.service.js`
  service ของโมดูลนั้น

## 4. การเชื่อมจากเมนู/route มายัง view

เมนูอยู่ที่:

- `src/navigation/vertical/skt.js`

หน้าระดับ page wrapper อยู่ที่:

- `src/pages/skt/settingMaster/*.vue`

page wrapper จะ import view จริงจากโฟลเดอร์นี้อีกที เช่น:

- `src/pages/skt/settingMaster/forwarder.vue`
- `src/views/skt/settingMaster/forwarder/Forwarder.vue`

ดังนั้นเวลา debug ให้ไล่ตามเส้นนี้:

1. เมนู
2. page wrapper
3. view ใน `settingMaster`
4. fields
5. service

## 5. Data Flow ของกลุ่มมาตรฐาน

ภาพรวมการทำงานของ master ทั่วไป:

1. Page view ส่ง `title`, `fields`, `service` เข้า `BaseMasterCrud`
2. `BaseMasterCrud` ดึง state และ action ทั้งหมดจาก `useMasterCrud`
3. `useMasterCrud` เรียก `service.getList()` เพื่อโหลดข้อมูล
4. service ที่สร้างจาก `createCrudService()` จะจัดการ map field UI <-> API
5. ข้อมูลถูกส่งไปแสดงใน `MasterTable`
6. เวลา create/update/delete จะเรียก `service.save()` หรือ `service.delete()`
7. เมื่อทำสำเร็จจะ reload list และแสดง snackbar

## 6. BaseMasterCrud ทำอะไรบ้าง

`components/BaseMasterCrud.vue` เป็น orchestrator ของหน้า CRUD มาตรฐาน

หน้าที่หลัก:

- แสดง header
- แสดง search bar
- แสดง toolbar
- แสดง table
- เปิด create dialog
- เปิด delete dialog
- แสดง snackbar

สิ่งสำคัญคือ component นี้พยายาม "บาง" ให้มากที่สุด และเอา business/UI state ไปอยู่ใน `useMasterCrud.js`

## 7. useMasterCrud ทำอะไรบ้าง

ไฟล์นี้คือหัวใจของกลุ่มมาตรฐาน

ความรับผิดชอบหลัก:

- เตรียม `tableFields` จาก `fields`
- เตรียม `searchFields` จาก `fields`
- เก็บ state เช่น `items`, `loading`, `saving`, `deleting`
- จัดการ pagination
- จัดการ sorting
- จัดการ search/filter
- เปิด/ปิด create dialog
- สร้างและ reset form
- inline edit
- delete confirmation
- snackbar notification

### 7.1 Pagination

รองรับ 2 กรณี:

- Client-side pagination
  service คืน array ทั้งก้อน แล้ว composable slice เอง
- Server-side pagination
  service คืน `{ data, total }` แล้ว composable ใช้ค่าจาก backend

### 7.2 Sorting

ตารางรองรับ cycle แบบ:

- click ครั้งที่ 1 = `asc`
- click ครั้งที่ 2 = `desc`
- click ครั้งที่ 3 = clear sort

### 7.3 Search

search field ถูก derive มาจาก `fields`

เงื่อนไขหลัก:

- ต้องไม่ `hideInTable`
- `searchable !== false`

ข้อควรรู้:

- ปัจจุบัน search bar จำกัดแสดงแค่ 3 field แรก

## 8. serviceUtils.js ทำอะไร

`services/serviceUtils.js` มี function สำคัญชื่อ `createCrudService()`

ใช้สร้าง service object ในรูปแบบมาตรฐาน:

- `getList(params)`
- `save(payload)`
- `delete(id)`

หน้าที่หลักของ utility นี้:

- สร้าง endpoint จาก `resourceName`
- ใส่ header มาตรฐาน
- map field UI -> API ตอน save
- map field API -> UI ตอนอ่านข้อมูล
- รองรับ mock data

แนวคิดสำคัญคือ service ของแต่ละโมดูลไม่ควรซ้ำกันมาก ต่างกันแค่:

- ชื่อ resource
- map field
- mock data

## 9. ความหมายของ `fields`

แต่ละโมดูลจะมีไฟล์ field config เช่น:

- `field/Field.js`
- `types/*.js`

field หนึ่งตัวมักมีรูปแบบประมาณนี้:

```js
{
  key: 'carrierName',
  label: 'Carrier Name',
  type: 'text',
  required: true,
  width: '350px',
  searchable: true,
}
```

field config ชุดเดียวถูกนำไปใช้หลายที่:

- สร้าง column ใน table
- สร้าง field ใน create dialog
- สร้าง input ใน search bar
- ใช้สร้าง inline edit form

จึงถือว่า `fields` เป็น schema ระดับ UI ของแต่ละ master

## 10. รายละเอียดรายโมดูล

ด้านล่างคือภาพรวมของแต่ละโมดูลในโฟลเดอร์นี้

### 10.1 `bank-account-no`

หน้าจัดการเลขบัญชีธนาคาร

field หลัก:

- `accountNo`
- `bankName`
- `address`
- `swiftCode`

รูปแบบ:

- ใช้ `BaseMasterCrud`
- service: `bankaccountno.service.js`

### 10.2 `carrier`

หน้าจัดการ carrier

field หลัก:

- `abb`
- `carrierName`

รูปแบบ:

- ใช้ `BaseMasterCrud`

### 10.3 `container-type`

หน้าจัดการประเภท container

field หลัก:

- `abb`
- `containerTypeName`

รูปแบบ:

- ใช้ `BaseMasterCrud`

### 10.4 `currency`

หน้าจัดการ currency

field หลัก:

- `ABB`
- `currencyName`

รูปแบบ:

- ใช้ `BaseMasterCrud`

ข้อควรระวัง:

- field ใช้ `ABB` ตัวพิมพ์ใหญ่ แต่ service map ส่วนใหญ่ใช้ `abb`
- ถ้าข้อมูลจาก API เป็น `abb` อาจมีอาการค่าไม่ขึ้นหรือ save/mapping สับสน

### 10.5 `forwarder`

หน้าจัดการ forwarder

field หลัก:

- `ABB`
- `forwarderName`
- `address`
- `contactName`
- `contactNo`

รูปแบบ:

- ใช้ `BaseMasterCrud`

ข้อควรระวัง:

- field ใช้ `ABB` แต่ mock/service บางส่วนอิงชื่อ `abb`
- naming ไม่สม่ำเสมอ ต้องเช็ก backend contract ก่อนแก้

### 10.6 `hs-code-no`

หน้าจัดการ HS Code

field หลัก:

- `hsCodeNo`
- `itemCode`
- `itemName`
- `country`

รูปแบบ:

- ใช้ `BaseMasterCrud`

### 10.7 `package`

หน้าจัดการ package

field หลัก:

- `packageName`
- `package`
- `tareWeight`

รูปแบบ:

- ใช้ `BaseMasterCrud`

### 10.8 `port`

หน้าจัดการ port

field หลัก:

- `abb`
- `portName`
- `country`

รูปแบบ:

- ใช้ `BaseMasterCrud`

ข้อควรระวัง:

- mock data บางส่วนใช้ชื่อ `port` แต่ field ใช้ `portName`
- ถ้า backend response ใช้คนละชื่อกับ UI ต้อง map ให้ชัด

### 10.9 `sale-person`

หน้าจัดการ sale person

field หลัก:

- `displayName`
- `firstName`
- `lastName`

รูปแบบ:

- ใช้ `BaseMasterCrud`

### 10.10 `shipping-mode`

หน้าจัดการ shipping mode

field หลัก:

- `abb`
- `shippingModeName`

รูปแบบ:

- ใช้ `BaseMasterCrud`

### 10.11 `term-of-payment`

หน้าจัดการ term of payment

field หลัก:

- `abb`
- `termOfPaymentName`
- `startDateLabel`
- `days`

รูปแบบ:

- ใช้ `BaseMasterCrud`

ข้อควรระวัง:

- field ใช้ `startDateLabel`
- แต่ service/mock ใช้ `startDate`
- ถ้าไม่ map ให้ตรง จะเกิดปัญหาแสดงผลหรือ save ผิด field

### 10.12 `term-of-pricing`

หน้าจัดการ term of pricing

field หลัก:

- `abb`
- `termOfPricingName`

รูปแบบ:

- ใช้ `BaseMasterCrud`

### 10.13 `ship-document`

หน้าจัดการ Ship Document

องค์ประกอบหลัก:

- `ShipDocumentView.vue`
- `composables/useShipDocumentData.js`
- `composables/useShipDocumentActions.js`
- `services/shipDocument.service.js`

ความต่างจากโมดูลอื่น:

- ไม่ใช้ `BaseMasterCrud`
- ใช้ `VDataTable` โดยตรง
- มี search แบบ keyword รวม
- dialog create/edit/delete เขียนเอง

ข้อควรระวัง:

- ตอนนี้ service ตั้ง `USE_MOCK = true`
- header auth ในไฟล์นี้ไม่เหมือน service กลาง

## 11. วิธีเพิ่ม master ใหม่

ถ้าจะเพิ่ม master ใหม่และรูปแบบ CRUD ไม่ซับซ้อน แนะนำให้เดินตาม pattern มาตรฐาน

### Step 1: สร้างโฟลเดอร์ใหม่

เช่น `customer-type/`

### Step 2: สร้าง view

สร้างไฟล์เช่น `CustomerTypeView.vue`

```vue
<template>
  <BaseMasterCrud
    title="Customer Type"
    :fields="fields"
    :service="customerTypeService"
    delete-name-key="id"
  />
</template>
```

### Step 3: สร้าง fields

สร้าง `field/Field.js` หรือ `types/customerType.types.js`

### Step 4: สร้าง service

ใช้ `createCrudService()` และกำหนด

- `resourceName`
- `map`
- `mockData`
- `useMock`

### Step 5: สร้าง page wrapper

เพิ่มไฟล์ใน `src/pages/skt/settingMaster/`

### Step 6: เพิ่มเมนู

เพิ่มรายการใน `src/navigation/vertical/skt.js`

## 12. Convention ที่ควรรักษา

ถ้าจะพัฒนาต่อ แนะนำให้รักษากติกาเหล่านี้เพื่อไม่ให้โค้ดแตก pattern มากขึ้น

- ใช้ `BaseMasterCrud` ก่อนเสมอ ถ้า requirement ไม่ได้พิเศษจริง
- ตั้งชื่อ field ฝั่ง UI ให้สม่ำเสมอ เช่น `abb` ไม่สลับ `ABB`
- ถ้า field ฝั่ง UI ไม่ตรงกับ API ต้อง map ให้ครบใน service
- ถ้า mock data ใช้ชื่อ field คนละแบบกับ UI ต้องรีบแก้ ไม่เช่นนั้นจะ debug ยาก
- อย่ากระจาย logic CRUD ไปหลายจุดถ้าใช้ pattern กลางได้

## 13. จุดที่คนมารับช่วงงานควรรู้ก่อนแก้

### 13.1 Naming ไม่สม่ำเสมอบางโมดูล

ตัวอย่าง:

- `ABB` vs `abb`
- `startDateLabel` vs `startDate`
- `portName` vs `port`

เวลามีอาการ data ไม่ขึ้น, save แล้ว field หาย, inline edit แปลก ๆ ให้เช็กเรื่อง map ก่อนเป็นอันดับแรก

### 13.2 `delete-name-key`

แต่ละหน้าอาจส่ง `delete-name-key` ต่างกัน เพื่อบอกว่าเวลาเปิด dialog ลบ จะใช้ field ไหนมาแสดงชื่อรายการ

ถ้าหน้าหนึ่งขึ้นชื่อใน dialog ลบไม่ถูก ให้เช็ก prop นี้ก่อน

### 13.3 `createFormRef`

ใน logic กลางมีแนวคิดเรื่อง validate form ผ่าน ref แต่การเชื่อม ref ระหว่าง parent/dialog ควรตรวจทุกครั้งเมื่อจะ refactor เพราะตอนนี้โครงสร้างอาจยังไม่ผูกครบทุกจุด

### 13.4 Search แสดงไม่ครบทุก field

ถึง field จะ `searchable: true` แต่ search bar ปัจจุบันแสดงแค่ 3 field แรก

ถ้า user บอกว่าค้นหา field บางตัวไม่ได้ ให้เช็ก logic ตรงนี้

### 13.5 ship-document เป็นคนละ pattern

อย่าสมมติว่าแก้ `BaseMasterCrud` แล้ว `ship-document` จะเปลี่ยนตาม

ต้องดูแยกอีกชุดเสมอ

## 14. แผนที่ไฟล์ที่ควรรู้จักก่อน

ไฟล์สำคัญที่สุดสำหรับคนใหม่:

- `components/BaseMasterCrud.vue`
- `components/useMasterCrud.js`
- `components/MasterTable.vue`
- `components/MasterCreateDialog.vue`
- `services/serviceUtils.js`
- โฟลเดอร์ของโมดูลที่กำลังจะแก้

ถ้าจะเริ่มอ่านโค้ด แนะนำลำดับนี้:

1. อ่าน `BaseMasterCrud.vue`
2. อ่าน `useMasterCrud.js`
3. อ่าน `serviceUtils.js`
4. อ่าน `fields` ของโมดูลที่สนใจ
5. อ่าน `service` ของโมดูลนั้น
6. ค่อยดู page wrapper และ navigation

## 15. สรุปสั้น ๆ

ถ้ามองเร็ว ๆ โฟลเดอร์นี้คือ mini-framework สำหรับหน้า master data

- CRUD ส่วนใหญ่ใช้ framework กลางร่วมกัน
- ความต่างของแต่ละหน้าอยู่ที่ `fields` และ `service`
- จุดเสี่ยงหลักของชุดนี้คือ naming/mapping ระหว่าง UI กับ API
- `ship-document` เป็นกรณีพิเศษที่ต้องดูแยก

ถ้าจะพัฒนาต่อโดยปลอดภัยที่สุด:

- รักษา pattern เดิม
- ทำ naming ให้สม่ำเสมอ
- ตรวจ map field ทุกครั้งก่อน debug เรื่อง data
