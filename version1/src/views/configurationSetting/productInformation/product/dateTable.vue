<script setup>
import { ref, computed } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

const searchData = ref('')





const headers = [
  {
    align: 'start',
    key: 'name',
    title: 'Dessert (100g serving)',
  },
  { key: 'calories', title: 'Calories' },
  { key: 'fat', title: 'Fat (g)' },
  { key: 'carbs', title: 'Carbs (g)' },
  { key: 'protein', title: 'Protein (g)' },
  { key: 'iron', title: 'Iron (%)' },
]

const searchUpper = ref([
  { key: 'desserts', value: '' },
  { key: 'calories', value: '' },
  { key: 'fat', value: '' },
  { key: 'carbs', value: '' },
  { key: 'protein', value: '' },
  { key: 'iron', value: '' },
])

const search = ref(headers.map(header => ({ key: header.key, value: '' })))

const desserts = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: 1,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: 1,
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: 7,
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: 8,
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: 16,
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: 0,
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: 2,
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: 45,
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: 22,
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: 6,
  },
]

// Custom filter function
const customFilter = (value, search, item) => {
  // ตรวจสอบว่าคำที่ต้องการค้นหา (value) เหมือนกับค่าในคอลัมน์ที่เป้าหมาย (item[search.key])
  return String(item[search.key]).toLowerCase().includes(String(value).toLowerCase())
}

const filterOnlyCapsText = (value, query, item) => {
  // console.log('Item', item)
  console.log('Query', query)

  // Get the key of the column to search in
  // const columnKey = Object.keys(item).find(key => item[key] === value)

  // // Perform the search operation based on the column key
  // if (columnKey) {
  //   return item[columnKey] != null &&
  //     query != null &&
  //     typeof item[columnKey] === 'string' &&
  //     item[columnKey].toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
  // }

  // return false
}

const testData =() => {
  console.log('searchUpper', searchUpper.value)
}
</script>

<template>
  <VCard
    title="Nutrition"
    flat
  >
    <VBtn @click="testData">
      Test
    </VBtn>
    <VDataTable
      :headers="headers"
      :items="desserts"
      :custom-filter="filterOnlyCapsText"
      :search="searchUpper"
      item-value="name"
      multi-sort
    >
      <template #top>
        <VRow>
          <VCol
            v-for="(header, index) in headers"
            :key="index"
            cols="12"
            md="2"
          >
            <VTextField
              v-model="searchUpper[index].value"
              class="pa-2"
              label="Search (UPPER CASE ONLY)"
            />
          </VCol>
        </VRow>
      </template>
    </VDataTable>
  </VCard>
</template>
