<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { avatarText } from '@/@core/utils/formatters'

const headers = [
  {
    title: 'Code',
    key: 'code',
  },
  {
    title: 'NAME',
    key: 'full_name',
  },
  {
    title: '',
    key: 'checkbox',
  },
]

import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'

const data = [
  {
    responsive_id: '',
    code: '001',
    id: 95,
    avatar: avatar2,
    full_name: 'Edwina Ebsworth',
    post: 'Human Resources Assistant',
    email: 'eebsworth2m@sbwire.com',
    city: 'Puzi',
    start_date: '09/27/2018',
    salary: 19586.23,
    age: '27',
    experience: '2 Years',
    status: 1,
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '002',
    id: 1,
    avatar: avatar8,
    full_name: 'Korrie O\'Crevy',
    post: 'Nuclear Power Engineer',
    email: 'kocrevy0@thetimes.co.uk',
    city: 'Krasnosilka',
    start_date: '09/23/2016',
    salary: 23896.35,
    age: '61',
    experience: '1 Year',
    status: 2,
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '003',
    id: 7,
    avatar: '',
    full_name: 'Eileen Diehn',
    post: 'Environmental Specialist',
    email: 'ediehn6@163.com',
    city: 'Lampuyang',
    start_date: '10/15/2017',
    salary: 18991.67,
    age: '59',
    experience: '9 Years',
    status: 3, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '004',
    id: 11,
    avatar: '',
    full_name: 'De Falloon',
    post: 'Sales Representative',
    email: 'dfalloona@ifeng.com',
    city: 'Colima',
    start_date: '06/12/2018',
    salary: 19252.12,
    age: '30',
    experience: '0 Year',
    status: 4, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '005',
    id: 3,
    avatar: avatar7,
    full_name: 'Stella Ganderton',
    post: 'Operator',
    email: 'sganderton2@tuttocitta.it',
    city: 'Golcowa',
    start_date: '03/24/2018',
    salary: 13076.28,
    age: '66',
    experience: '6 Years',
    status: 5, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '006',
    id: 5,
    avatar: '',
    full_name: 'Harmonia Nisius',
    post: 'Senior Cost Accountant',
    email: 'hnisius4@gnu.org',
    city: 'Lucan',
    start_date: '08/25/2017',
    salary: 10909.52,
    age: '33',
    experience: '3 Years',
    status: 2, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '007',
    id: 6,
    avatar: '',
    full_name: 'Genevra Honeywood',
    post: 'Geologist',
    email: 'ghoneywood5@narod.ru',
    city: 'Maofan',
    start_date: '06/01/2017',
    salary: 17803.8,
    age: '61',
    experience: '1 Year',
    status: 1, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '008',
    id: 4,
    avatar: avatar8,
    full_name: 'Dorolice Crossman',
    post: 'Cost Accountant',
    email: 'dcrossman3@google.co.jp',
    city: 'Paquera',
    start_date: '12/03/2017',
    salary: 12336.17,
    age: '22',
    experience: '2 Years',
    status: 2, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '009',
    id: 8,
    avatar: avatar7,
    full_name: 'Richardo Aldren',
    post: 'Senior Sales Associate',
    email: 'raldren7@mtv.com',
    city: 'Skoghall',
    start_date: '11/05/2016',
    salary: 19230.13,
    age: '55',
    experience: '5 Years',
    status: 3, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '010',
    id: 9,
    avatar: avatar2,
    full_name: 'Allyson Moakler',
    post: 'Safety Technician',
    email: 'amoakler8@shareasale.com',
    city: 'Mogilany',
    start_date: '12/29/2018',
    salary: 11677.32,
    age: '39',
    experience: '9 Years',
    status: 5, 
    checkbox: false,
  },
  {
    responsive_id: '',
    code: '011',
    id: 10,
    avatar: avatar7,
    full_name: 'Merline Penhalewick',
    post: 'Junior Executive',
    email: 'mpenhalewick9@php.net',
    city: 'Kanuma',
    start_date: '04/19/2019',
    salary: 15939.52,
    age: '23',
    experience: '3 Years',
    status: 2, 
    checkbox: false,
  },
]

const resolveStatusVariant = status => {
  if (status === 1)
    return {
      color: 'primary',
      text: 'Current',
    }
  else if (status === 2)
    return {
      color: 'success',
      text: 'Professional',
    }
  else if (status === 3)
    return {
      color: 'error',
      text: 'Rejected',
    }
  else if (status === 4)
    return {
      color: 'warning',
      text: 'Resigned',
    }
  else
    return {
      color: 'info',
      text: 'Applied',
    }
}

//------------------------------- search ----------------------
const search = ref('')
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex align-center pe-2">
      <VIcon icon="mdi-warehouse" /> &nbsp;
      {{ $t('Production Warehouse') }}

      <VSpacer />

      <VTextField
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        :label="$t('Search')"
        single-line
        flat
        hide-details
        variant="solo-filled"
      />
    </VCardTitle>

    <VDivider />

    <VDataTable
      :headers="headers"
      :items="data"
      :items-per-page="5"
    >
      <!-- full name -->
      <template #item.full_name="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="32"
            :color="item.raw.avatar ? '' : 'primary'"
            :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
            :variant="!item.raw.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="item.raw.avatar"
              :src="item.raw.avatar"
            />
            <span
              v-else
              class="text-sm"
            >{{ avatarText(item.raw.full_name) }}</span>
          </VAvatar>
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.raw.full_name }}</span>
            <small>{{ item.raw.post }}</small>
          </div>
        </div>
      </template>
      <template #item.checkbox="{ item }">
        <VCheckbox v-model="item.checkbox" />
      </template>
    </VDataTable>  
  </VCard>

  <VCard class="mt-10">
    <VCardTitle class="d-flex align-center pe-2">
      <VIcon icon="mdi-warehouse" /> &nbsp;
      {{ $t('Requisition Warehouse') }}

      <VSpacer />

      <VTextField
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        :label="$t('Search')"
        single-line
        flat
        hide-details
        variant="solo-filled"
      />
    </VCardTitle>

    <VDivider />

    <VDataTable
      :headers="headers"
      :items="data"
      :items-per-page="5"
    >
      <!-- full name -->
      <template #item.full_name="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="32"
            :color="item.raw.avatar ? '' : 'primary'"
            :class="item.raw.avatar ? '' : 'v-avatar-light-bg primary--text'"
            :variant="!item.raw.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="item.raw.avatar"
              :src="item.raw.avatar"
            />
            <span
              v-else
              class="text-sm"
            >{{ avatarText(item.raw.full_name) }}</span>
          </VAvatar>
          <div class="d-flex flex-column ms-3">
            <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.raw.full_name }}</span>
            <small>{{ item.raw.post }}</small>
          </div>
        </div>
      </template>
      <template #item.checkbox="{ item }">
        <VCheckbox v-model="item.checkbox" />
      </template>
    </VDataTable>  
  </VCard>
</template>
