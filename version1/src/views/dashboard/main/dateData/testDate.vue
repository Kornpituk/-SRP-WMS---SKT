<script setup>
import AppDataTimePickerAllWay from '@/views/dashboard/main/dateData/appTImePicker/appDatatimePicker.vue'

const currentDate = new Date()
const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`

const oneWeekAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000))
const formattedDateOneWeekAgo = formattedDate+` To `+`${oneWeekAgo.getDate().toString().padStart(2, '0')}/${(oneWeekAgo.getMonth() + 1).toString().padStart(2, '0')}/${oneWeekAgo.getFullYear()}`

const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate())
const formattedDateOneMonthAgo = formattedDate+` To `+`${oneMonthAgo.getDate().toString().padStart(2, '0')}/${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}/${oneMonthAgo.getFullYear()}`

const currentTime = ref(formattedDate)
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

const clearBtnDate = () => {
  currentTime.value = formattedDate
  checkDate.value = true
  checkDateCalendal.value = false
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

const items = [
  { title: 'Day', value: "day" },
  { title: 'Week', value: formattedDateOneWeekAgo },
  { title: 'Month', value: formattedDateOneMonthAgo },
]
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
          label="Select Date"
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
            <VListItem
              :item-props="itemProps"
              @click="handleItemClickNew(item)"
            >
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
          :config="{ mode: 'range', dateFormat: 'd/m/Y' }"
        />
      </VCol>
      <VCol cols="6">
        <VRow>
          <VCol cols="6">
            <VBtn style="width: 100%; height: 40px;">
              <span style="font-size: 16px;">{{ $t('Apply') }}</span>
            </VBtn>
          </VCol>
          <VCol cols="6">
            <VBtn
              color="error"
              style="width: 100%; height: 40px;"
              @click="clearBtnDate"
            >
              <span style="font-size: 16px;">{{ $t('Clear') }}</span>
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>
