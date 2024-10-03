<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'

const generateRandomData = count => {
  const data = []
  for (let i = 1; i <= count; i++) {
    const item = {
      no: i,
      product_code: `PRD${Math.floor(Math.random() * 1000)}`,
      product_name: `Product ${i}`,
      categories: ['Electronics', 'Clothing', 'Home Appliances', 'Furniture'][Math.floor(Math.random() * 4)],
      group: `Group ${Math.floor(Math.random() * 10)}`,
      sub_group: `Sub Group ${Math.floor(Math.random() * 20)}`,
      color: ['Red', 'Blue', 'Green', 'Yellow'][Math.floor(Math.random() * 4)],
      size: ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)],
      warehouse: `Warehouse ${Math.floor(Math.random() * 5)}`,
      min: Math.floor(Math.random() * 50),
      max: Math.floor(Math.random() * 100) + 50,
      stock: Math.floor(Math.random() * 1000),
      max_min: Math.random() > 0.5 ? 'Max' : 'Min',
      uom: ['Piece', 'Box', 'Kilogram'][Math.floor(Math.random() * 3)],
      alert: Math.random() > 0.5 ? true : false,
      last_update: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
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
    title: 'Product Code',
    key: 'product_code',
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
    title: 'Color',
    key: 'color',
  },
  {
    title: 'Size',
    key: 'size',
  },
  {
    title: 'Warehouse',
    key: 'warehouse',
  },
  {
    title: 'Min',
    key: 'min',
  },
  {
    title: 'Max',
    key: 'max',
  },
  {
    title: 'Stock',
    key: 'stock',
  },
  {
    title: 'Max/Min',
    key: 'max_min',
  },
  {
    title: 'UoM',
    key: 'uom',
  },
  {
    title: 'Alert',
    key: 'alert',
  },
  {
    title: 'Last Update',
    key: 'last_update',
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
</script>

<template lang="">
  <div>
    <VCard class="mb-6">
      <VCardText>
        <VRow class="d-flex align-center">
          <VCol
            cols="12"
            lg="10"
          >
            <VRow>
              <VCol cols="6">
                <VAutocomplete density="compact" label="Warehouse" />
              </VCol>
              <VCol cols="6">
                <VAutocomplete density="compact" label="Categories" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="6">
                <VAutocomplete density="compact" label="Sub Group" />
              </VCol>
              <VCol cols="6">
                <VAutocomplete density="compact" label="Sec Group" />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            cols="12"
            lg="2"
          >
            <VRow>
              <VCol cols="12">
                <VBtn
                  size="large"
                  color="primary"
                  style="width: 100%;"
                >
                  Search
                </VBtn>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VBtn
                  color="error"
                  size="large"
                  style="width: 100%;"
                >
                  Clear
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
        >
          <template #item="{ item }">
            <tr>
              <td :class="{ }">
                {{ item.raw.no }}
              </td>
              <td :class="{ }">
                {{ item.raw.product_code }}
              </td>
              <td :class="{ }">
                {{ item.raw.product_name }}
              </td>
              <td :class="{ }">
                {{ item.raw.categories }}
              </td>
              <td :class="{ }">
                {{ item.raw.group }}
              </td>
              <td :class="{ }">
                {{ item.raw.sub_group }}
              </td>
              <td :class="{ }">
                {{ item.raw.color }}
              </td>
              <td :class="{ }">
                {{ item.raw.size }}
              </td>
              <td :class="{ }">
                {{ item.raw.warehouse }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.min}">
                {{ item.raw.min }}
              </td>
              <td :class="{ 'bg-blue-lighten-4': item.raw.max}">
                {{ item.raw.max }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.max_min === 'Min' , 'bg-blue-lighten-4': item.raw.max_min === 'Max' }">
                {{ item.raw.stock }}
              </td>
              <td :class="{ 'bg-red-lighten-4': item.raw.max_min === 'Min' , 'bg-blue-lighten-4': item.raw.max_min === 'Max' }">
                {{ item.raw.max_min }}
              </td>
              <td :class="{ }">
                {{ item.raw.uom }}
              </td>
              <td :class="{ }">
                <VCheckbox
                  v-model="item.raw.alert"
                  readonly
                />
              </td>
              <td :class="{ }">
                {{ item.raw.last_update }}
              </td>
            </tr>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </div>
</template>


