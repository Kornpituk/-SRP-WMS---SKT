<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'

// import data from '@/views/demos/forms/tables/data-table/datatable'

const generateRandomData = rowCount => {
  const data = []
  const statuses = ['Pending', 'Approved', 'In Process', 'Partial', 'Complete']
  
  for (let i = 0; i < rowCount; i++) {
    const item = {
      no: i + 1,
      status: ['Pending Picking', 'Completely Picking', 'Pending Partial Picking', 'Partial Picking'][Math.floor(Math.random() * 4)],
      receivedNo: `RBO${Math.floor(Math.random() * 10000000) + 1000000}`,
      receivedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      receiptStore: `Warehouse ${Math.floor(Math.random() * 3) + 1}`,
      picksPOUp: `PUP${Math.floor(Math.random() * 10000000) + 1000000}`,
      typeOfPickUp: `Type ${Math.floor(Math.random() * 3) + 1}`,
      pickUpStore: `Warehouse ${Math.floor(Math.random() * 3) + 1}`,
      pickUpBy: `User ${Math.floor(Math.random() * 100) + 1}`,
      supplierId: `000${Math.floor(Math.random() * 100) + 1}`,
      supplierName: `Supplier ${Math.floor(Math.random() * 100) + 1} Co. Ltd.`,
      reference: `REF${Math.floor(Math.random() * 100000000) + 10000000}`,
      pickUpDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      arrangeBy: ['Pending Picking', 'Completely Picking', 'Pending Partial Picking', 'Partial Picking'][Math.floor(Math.random() * 4)],
      approveBy: `User ${Math.floor(Math.random() * 100) + 1}`,
      approveDay: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      remark: `Remark ${Math.floor(Math.random() * 10) + 1}`,
      rfid: `RFID${Math.floor(Math.random() * 10000000) + 1000000}`,
    }

    data.push(item)
  }
  
  return data
}

// Generate random data with 10 rows
const randomData = generateRandomData(10)

console.log('randomData Out', randomData)

const headers = [
  {
    title: 'NO',
    key: 'no',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
  {
    title: 'RECEIVED NO.',
    key: 'receivedNo',
  },
  {
    title: 'RECEIVED DATE',
    key: 'receivedDate',
  },
  {
    title: 'RECEIVED BY STORE',
    key: 'receiptStore',
  },
  {
    title: 'PICK UP PO NO.',
    key: 'picksPOUp',
  },
  {
    title: 'TYPE OF PICK UP',
    key: 'typeOfPickUp',
  },
  {
    title: 'PICK UP STORE',
    key: 'pickUpStore',
  },
  {
    title: 'PICK UP BY',
    key: 'pickUpBy',
  },
  {
    title: 'SUPPLIER ID',
    key: 'supplierId',
  },
  {
    title: 'SUPPLIER NAME',
    key: 'supplierName',
  },
  {
    title: 'REFERENCE',
    key: 'reference',
  },
  {
    title: 'PICK UP DATE',
    key: 'pickUpDate',
  },
  {
    title: 'ARRANGE BY',
    key: 'arrangeBy',
  },
  {
    title: 'APPROVE/CANCEL BY',
    key: 'approveBy',
  },
  {
    title: 'APPROVE/CANCEL DATE',
    key: 'approveDay',
  },
  {
    title: 'REMARK',
    key: 'remark',
  },
  {
    title: 'RFID',
    key: 'rfid',
  },
]

const resolveStatusVariant = status => {
  if (status === "Completely Picking")
    return {
      color: 'success',
      text: 'Completely Picking',
    }
  else if (status === 'Pending Picking')
    return {
      color: 'error',
      text: 'Pending Picking',
    }
  else if (status === "Partial Picking")
    return {
      color: 'info',
      text: 'Partial Picking',
    }
  else if (status === "Pending Partial Picking")
    return {
      color: 'warning',
      text: 'Pending Partial Picking',
    }
  else
    return {
      color: 'info',
      text: 'Applied',
    }
}
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="randomData"
    :items-per-page="5"
  >
    <template #top>
      <VToolbar
        flat
        class="bg-blue"
      >
        <VToolbarTitle>{{ $t('Transfer Out') }}</VToolbarTitle>
      </VToolbar>
    </template>
    <!-- status -->
    <template #item.status="{ item }">
      <VChip
        :color="resolveStatusVariant(item.raw.status).color"
        class="font-weight-medium"
        size="small"
      >
        {{ resolveStatusVariant(item.raw.status).text }}
      </VChip>
    </template>
  </VDataTable>
</template>
