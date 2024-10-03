<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'

const remainingDaysZero = () => {
  const randomValue = Math.random() // สุ่มค่าแบบสุ่มตัวเลขทศนิยมระหว่าง 0 ถึง 1
  const probabilityZero = 0.5 // กำหนดอัตราความน่าจะเป็นที่จะเป็น 0 เป็น 10%
  if (randomValue < probabilityZero) {
    return 0 // สุ่มเลข 0 ถ้าอัตราความน่าจะเป็นต่ำกว่าค่าที่กำหนด
  } else {
    return Math.floor(Math.random() * 101) // สุ่มค่าตั้งแต่ 0 ถึง 100 หากไม่เป็น 0
  }
}

const generateRandomData = count => {
  const data = []
  for (let i = 1; i <= count; i++) {
    const item = {
      no: i,
      status: ['Pending', 'Approved', 'In Process', 'Partial', 'Complete'][Math.floor(Math.random() * 5)],
      product_code: `PRD${Math.floor(Math.random() * 1000)}`,
      barcode: `BAR${Math.floor(Math.random() * 1000000)}`,
      product_name: `Product ${i}`,
      categories: ['Electronics', 'Clothing', 'Home Appliances', 'Furniture'][Math.floor(Math.random() * 4)],
      group: `Group ${Math.floor(Math.random() * 10)}`,
      sub_group: `Sub Group ${Math.floor(Math.random() * 20)}`,
      lot: `LOT${Math.floor(Math.random() * 10000)}`,
      received_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      expire_date: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      remaining_days: remainingDaysZero(),
      alert: Math.random() > 0.5 ? true : false,
      stock: Math.floor(Math.random() * 1000),
      uom: ['Piece', 'Box', 'Kilogram'][Math.floor(Math.random() * 3)],
    }

    data.push(item)
  }
  
  return data
}

// สร้างข้อมูลแบบสุ่มจำนวน 10 รายการ
const randomData = generateRandomData(20)

console.log(randomData)

const headers = [
  {
    title: 'No.',
    key: 'no',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Product Code',
    key: 'product_code',
  },
  {
    title: 'Barcode',
    key: 'barcode',
  },
  {
    title: 'Product Name',
    key: 'product_name',
  },
  {
    title: 'Categories',
    key: 'categories',
  },
  {
    title: 'Group',
    key: 'group',
  },
  {
    title: 'Sub Group',
    key: 'sub_group',
  },
  {
    title: 'Lot',
    key: 'lot',
  },
  {
    title: 'Received Date',
    key: 'received_date',
  },
  {
    title: 'Expire Date',
    key: 'expire_date',
  },
  {
    title: 'Remaining (Days)',
    key: 'remaining_days',
  },
  {
    title: 'Alert',
    key: 'alert',
  },
  {
    title: 'Stock',
    key: 'stock',
  },
  {
    title: 'UoM',
    key: 'uom',
  },
]

const resolveStatusVariant = status => {
  if (status === 'Max')
    return {
      color: 'blue',
    }
  else if (status === 'Min')
    return {
      color: 'red',
    }
  else
    return {
      color: 'info',
    }
}

//--------------------- Model Radio Status Search ---------------------
const radioGroup = ref(1)
const label = ['All', 'About Expire', 'Expired']
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardText>
        <VRow class="d-flex align-center">
          <VCol
            cols="12"
            lg="12"
          >
            <VRow>
              <VCol
                cols="12"
                lg="4"
                sm="4"
              >
                <VAutocomplete
                  density="compact"
                  :label="$t('Warehouse')"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="4"
              >
                <VAutocomplete
                  density="compact"
                  :label="$t('Categories')"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="4"
              >
                <VAutocomplete
                  density="compact"
                  :label="$t('Categories')"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                lg="4"
                sm="4"
              >
                <VAutocomplete
                  density="compact"
                  :label="$t('Product Name')"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="4"
              >
                <VAutocomplete
                  density="compact"
                  :label="$t('Size')"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
                sm="4"
              >
                <VAutocomplete
                  density="compact"
                  :label="$t('Color')"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                lg="4"
              >
                <VRadioGroup
                  v-model="radioGroup"
                  inline
                  :rules="rules"
                >
                  <VRadio
                    v-for="(item, index) in label"
                    :key="index"
                    :label="item"
                    :value="index"
                  />
                </VRadioGroup>
              </VCol>
              <VCol
                cols="6"
                lg="4"
              >
                <VBtn
                  size="large"
                  color="primary"
                  style="width: 100%;"
                >
                  {{$t('Search')}}
                </VBtn>
              </VCol>
              <VCol
                cols="6"
                lg="4"
              >
                <VBtn
                  size="large"
                  style="width: 100%;"
                  color="error"
                >
                  {{$t('Clear')}}
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
  <div>
    <VCard>
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="randomData"
          :items-per-page="10"
          color="red"
        >
          <!-- status -->
          <template #item="{ item }">
            <tr>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.no }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.status }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.product_code }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.barcode }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.product_name }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.categories }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.group }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.sub_group }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.lot }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.received_date }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.expire_date }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.remaining_days }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                <VCheckbox
                  v-model="item.raw.alert"
                  :color="item.raw.remaining_days <= 0 ? 'error' : 'primary'"
                  readonly
                />
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.stock }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.remaining_days <= 0 , 'text-red': item.raw.remaining_days <= 0 }">
                {{ item.raw.uom }}
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </div>
</template>


