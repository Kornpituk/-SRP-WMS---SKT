<script setup>
import { ref, computed } from 'vue'

const tableData = ref([
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: '1',
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    iron: '0',
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    iron: '6',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: '7',
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    iron: '16',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: '1',
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    iron: '2',
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: '8',
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    iron: '45',
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    iron: '22',
  },
])

const currentPage = ref(1)
const itemsPerPage = ref(10) // เริ่มต้นค่า 2 ไอเทมต่อหน้า
const sortKey = ref('')
const sortOrder = ref('asc')

// ฟังก์ชันจัดเรียงข้อมูล
const sortTable = key => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  tableData.value.sort((a, b) => {
    if (a[key] < b[key]) return sortOrder.value === 'asc' ? -1 : 1
    if (a[key] > b[key]) return sortOrder.value === 'asc' ? 1 : -1
    
    return 0
  })
}

// คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
const paginatedData = computed(() => {
  if (itemsPerPage.value === 'All') {
    return tableData.value // แสดงข้อมูลทั้งหมด
  }
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  
  return tableData.value.slice(start, end)
})

// จำนวนหน้าทั้งหมด
const totalPages = computed(() => {
  if (itemsPerPage.value === 'All') {
    return 1 // ถ้าแสดงทั้งหมด จะมีเพียงหน้าเดียว
  }
  
  return Math.ceil(tableData.value.length / itemsPerPage.value)
})

// ติดตามการเปลี่ยนแปลงของ itemsPerPage และปรับหน้าปัจจุบันให้อยู่ในช่วงที่เหมาะสม
watch(itemsPerPage, () => {
  currentPage.value = 1
})
</script>

<template>
  <div>
    <!-- ตาราง -->
    <VTable>
      <thead>
        <tr>
          <th @click="sortTable('id')">
            ID
          </th>
          <th @click="sortTable('name')">
            Name
          </th>
          <th @click="sortTable('age')">
            Age
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in paginatedData"
          :key="item.id"
        >
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
        </tr>
      </tbody>
    </VTable>

    <!-- ตัวเลือกจำนวนไอเทมต่อหน้า -->
    <div class="table-controls">
      <label for="itemsPerPage">Items per page:</label>
      <VSelect
        v-model="itemsPerPage"
        :items="[2, 5, 30, 50, 'All']"
        dense
        outlined
        hide-details
        class="items-per-page-select"
      />
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <VBtn
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Previous
      </VBtn>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <VBtn
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </VBtn>
    </div>
  </div>
</template>

<style scoped>
.table-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 1rem;
}

.items-per-page-select {
  inline-size: 120px;
}

.pagination {
  display: flex;
  justify-content: flex-end; /* จัดตำแหน่งไปทางขวา */
  justify-content: center;
  gap: 1rem;
  margin-block-start: 1rem;
}
</style>
