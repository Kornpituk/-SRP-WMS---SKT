<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'

// import data from '@/views/demos/forms/tables/data-table/datatable'

const data = []

for (let i = 0; i < 10; i++) {
  const newItem = {
    no: Math.floor(Math.random() * 100) + 1,
    status: ['Pending Received', 'Completely Received', 'Pending Partial Received', 'Partial Received'][Math.floor(Math.random() * 4)],
    receivedNo: `RBO${Math.floor(Math.random() * 10000000) + 1000000}`,
    receivedDate: `${new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString().split(', ')[0]}`,
    poNo: `POW${Math.floor(Math.random() * 100000000) + 10000000}`,
    poDate: `${new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString().split(', ')[0]}`,
    receiptStore: `${Math.floor(Math.random() * 10) + 1}`,
    reference: `20-${Math.floor(Math.random() * 100000000000) + 10000000000}`,
    typeOfReceived: ['For Stock', 'For Use', 'For Defect'][Math.floor(Math.random() * 3)],
    supplierId: `000${Math.floor(Math.random() * 100) + 1}`,
    supplierName: `Supplier ${Math.floor(Math.random() * 100) + 1} Co. Ltd.`,
    deliveredDate: `${new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString().split(', ')[0]}`,
    receiptStore: ['Warehouse 1', 'Warehouse 2', 'Warehouse 3'][Math.floor(Math.random() * 3)],
    receivedBy: ['John', 'Jane', 'Kimberly', 'Mary', 'Samantha'][Math.floor(Math.random() * 5)],
    remark: ['remark1', 'remark2', 'remark3', 'remark4', 'remark5'][Math.floor(Math.random() * 5)],
  }
  
  data.push(newItem)
}

console.log(data)

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
    title: 'P/O NO.',
    key: 'poNo',
  },
  {
    title: 'P/O DATE',
    key: 'poDate',
  },
  {
    title: 'RECEIVED BY STORE',
    key: 'receiptStore',
  },
  {
    title: 'REFERENCE',
    key: 'reference',
  },
  {
    title: 'TYPE OF RECEIVED',
    key: 'typeOfReceived',
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
    title: 'DELIVERED DATE',
    key: 'deliveredDate',
  },
  {
    title: 'RECEIVED BY',
    key: 'receivedBy',
  },
  {
    title: 'REMARK',
    key: 'remark',
  },
]

const resolveStatusVariant = status => {
  if (status === "Completely Received")
    return {
      color: 'success',
      text: 'Completely Received',
    }
  else if (status === 'Pending Received')
    return {
      color: 'error',
      text: 'Pending Received',
    }
  else if (status === "Partial Received")
    return {
      color: 'info',
      text: 'Partial Received',
    }
  else if (status === "Pending Partial Received")
    return {
      color: 'warning',
      text: 'Pending Partial Received',
    }
  else
    return {
      color: 'error',
      text: 'Applied',
    }
}
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="data"
    :items-per-page="5"
  >
    <template #top>
      <VToolbar
        flat
        class="bg-light-green"
      >
        <VToolbarTitle style="color: white;">{{ $t('Received PO') }}</VToolbarTitle>
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
