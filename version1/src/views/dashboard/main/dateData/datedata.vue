<script setup>
const dateRange = ref('2024-05-15')
const date = ref(new Date())

import avatar1 from '@images/avatars/avatar-1.png'
import AppDataTimePickerAllWay from '@/views/dashboard/main/dateData/appTImePicker/appDatatimePicker.vue'

const menu = ref(false)
const menu1 = ref(false)
const menusVariant = ['primary', 'secondary', 'success', 'info']

const selectedItem = ref(null)


const currentDate = new Date()
const currentTime = ref('Date')
const currentDateSelect = ref(null)
const checkDate = ref(true)
const checkDateCalendal = ref(false)

const handleItemClickNew = item => {
  console.log('item', item.value.value)
  currentTime.value = item.value.value
  if(item.value.value == 'day'){
    console.log('Starting date!')
    checkDate.value = false
    checkDateCalendal.value = true
  } else {
    checkDate.value = true
  }
}


watchEffect(() => {
  console.log('currentTime:', currentTime.value.value)
})


const itemProps = item => {
  if(!item){
    return {
      title: 'Select',
      subtitle: 'none Value',
    }
  } else if(item.value){
    return {
      title: item.title,
      subtitle: item.value,
    }
  }
}


// const items = [
//   { title: 'Year', value: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()) },
//   { title: 'Month', value: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()) },
//   { title: 'Week', value: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7) },
//   { title: 'Day', value: currentDate },
// ]

const items = [
  { title: 'Year', value: "2025-02-78 years" },
  { title: 'Month', value: "2025-02-78 Month" },
  { title: 'Week', value: "2025-02-78 week" },
  { title: 'Day', value: "day" },
]

const checkSelectDate = ref(true)
const dataLabel = ref('Select')

const handleItemClick = item => {
  selectedItem.value = item
  if (item.value === 'day') {
    menu1.value = false 
    checkSelectDate.value = false
  } else {
    checkSelectDate.value = true
  }
}



watchEffect(() => {

})
</script>


<template lang="">
  <div>
    <VRow>
      <VCol cols="6">
        <VSelect
          v-if="checkDate"
          v-model="currentTime"
          :items="items"
          :item-props="itemProps"
          label="Standard"
          placeholder="Select Item"
          density="compact"
          eager
          return-object
        >
          <template #selection="{ item }">
            <div>
              <span>{{ item.value }}</span>
            </div>
          </template>
          <template #item="{ item }">
            <VListItem @click="handleItemClickNew(item)">
              <VListItemContent>
                <VListItemTitle>{{ item.title }}</VListItemTitle>
              </VListItemContent>
            </VListItem>
          </template>
        </VSelect>
        <AppDataTimePickerAllWay
          v-if="checkDateCalendal"
          v-model="currentDate"
          label="Date"
          density="compact"
          placeholder="Select date"
          :config="{ mode: 'range' }"
        />
      </VCol>
      <VCol cols="6">
        <VRow>
          <VCol cols="6">
            <VBtn style="width: 100%;">
              Apply
            </VBtn>
          </VCol>
          <VCol cols="6">
            <VBtn color="error" style="width: 100%;">
              Clear
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>
