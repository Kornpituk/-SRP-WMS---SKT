<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'

// import data from '@/views/demos/forms/tables/data-table/datatable'

const data = []

for (let i = 0; i < 20; i++) {
  const newItem = {
    no: i + 1,
    status: ['Pending Received', 'Completely Received', 'Pending Partial Received', 'Partial Received'][Math.floor(Math.random() * 4)],
    receivedNo: `RBO${Math.floor(Math.random() * 10000000) + 1000000}`,
    receivedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
    receivedBy: `User ${Math.floor(Math.random() * 100) + 1}`,
    reason: `Reason ${Math.floor(Math.random() * 10) + 1}`,
    receivedReason: `Received Reason ${Math.floor(Math.random() * 10) + 1}`,
    poNo: `POW${Math.floor(Math.random() * 100000000) + 10000000}`,
    poDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
    receiptStore: `Warehouse ${Math.floor(Math.random() * 3) + 1}`,
    pickUpNo: `PUN${Math.floor(Math.random() * 10000000) + 1000000}`,
    pickUp: `Pick Up ${Math.floor(Math.random() * 10) + 1}`,
    pickUpStore: `Warehouse ${Math.floor(Math.random() * 3) + 1}`,
    deliveryDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
    supplierId: `000${Math.floor(Math.random() * 100) + 1}`,
    supplierName: `Supplier ${Math.floor(Math.random() * 100) + 1} Co. Ltd.`,
    typeOfPickUp: `Type ${Math.floor(Math.random() * 3) + 1}`,
    cancelledBy: `User ${Math.floor(Math.random() * 100) + 1}`,
    cancelledDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
    cancelledReason: `Cancelled Reason ${Math.floor(Math.random() * 10) + 1}`,
    cancelledRemark: `Cancelled Remark ${Math.floor(Math.random() * 10) + 1}`,
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
    title: 'RECEIVED BY',
    key: 'receivedBy',
  },
  {
    title: 'REASON',
    key: 'reason',
  },
  {
    title: 'RECEIVED REASON',
    key: 'receivedReason',
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
    title: 'PICK UP NO.',
    key: 'pickUpNo',
  },
  {
    title: 'PICK UP',
    key: 'pickUp',
  },
  {
    title: 'PICK UP BY STORE',
    key: 'pickUpStore',
  },
  {
    title: 'DELIVERY DATE',
    key: 'deliveryDate',
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
    title: 'TYPE OF PICK UP',
    key: 'typeOfPickUp',
  },
  {
    title: 'CANCELLED BY',
    key: 'cancelledBy',
  },
  {
    title: 'CANCELLED DATE',
    key: 'cancelledDate',
  },
  {
    title: 'CANCELLED REASON',
    key: 'cancelledReason',
  },
  {
    title: 'CANCELLED REMARK',
    key: 'cancelledRemark',
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
        class="bg-deep-orange"
      >
        <VToolbarTitle>{{ $t('Transfer In') }}</VToolbarTitle>
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
