<script setup>
import { itemSlot } from '@/views/demos/forms/form-elements/rating/demoCodeRating'
import axios from '@axios'

// const urlApi = ref('https://webapi.easetrackwms.com')

// const urlApi = ref('https://vm02webapi.easetrackwms.com')
// const urlApi = ref('https://vm03webapi.easetrackwms.com')

import { urlApi } from '../api'

const whereHouseSelectedItem = ([])
const whereRoomNameSet = ref('')

const items = []


// Get access token from localStorage in another page
const accessToken = localStorage.getItem('accessTokenAtStore')
const whereHouseName = localStorage.getItem('whereHouseName')

// console.log("accessToken:",accessToken)

const url = ref(`${urlApi.value}/api/Auth/GetLocation/all`)

const GetWhereHouse = () => {
  axios.get(`${urlApi.value}/api/Auth/GetLocation`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      const responseData = response.data

      console.log('Wharehouse', responseData)

      // Extracting the id and name properties
      for (let i = 0; i < responseData.length; i++) {
        const { id, name } = responseData[i]

        items.push({ id, name })
      }

      for (let i = 0; i < items.length; i++) {
        // console.log('items loop:'+[i],items[i])

        if ( items[i].id ===  whereHouseName){
          // console.log('items[i].Name:',items[i].name)
          localStorage.setItem('WarehouseNameAtIcons', items[i].name)
          localStorage.setItem('WarehouseIDAtIcons', items[i].id)
          break
        } else {
          // console.log('items'+items[i].id,'Not Match',whereHouseName)
        }
      }


      // console.log('localStorage Warehouse: ',localStorage.getItem('WarehouseNameAtIcons'))
      whereRoomNameSet.value = localStorage.getItem('WarehouseNameAtIcons')

      // Now `items` contains an array of objects with id and name properties
      // console.log('items location whereHouse At menu Warehouse:',items)

    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watchEffect(GetWhereHouse)

const loopFindItemWareHouse = () => {

  // console.log('loopFindItemWareHouse Start!!')
  for (let i = 0; i < items.length; i++) {
    // console.log('items loop:',items[i])
  }
}

watchEffect(loopFindItemWareHouse)
</script>

<template>
  <VContainer
  class="py-0"
    location="bottom right"
    offset-x="3"
    offset-y="3"
  >
    <VBadge
      dot
      location="bottom right"
      offset-x="3"
      offset-y="3"
      bordered
      color="success"
    >
      <VAvatar
        class="cursor-pointer"
        
        variant="tonal"
      >
        <VIcon
          icon="mdi-warehouse"
          where-house
        />

        <!-- SECTION Menu -->
        <VMenu
          activator="parent"
          width="230"
          location="bottom end"
          offset="14px"
        >
          <VList>
            <!-- 👉 User Avatar & Name -->
            <VListItem>
              <template #prepend>
                <VListItemAction start>
                  <VBadge
                    dot
                    location="bottom right"
                    offset-x="3"
                    offset-y="3"
                    color="success"
                  >
                    <VAvatar variant="tonal">
                      <VIcon
                        icon="mdi-warehouse"
                        where-house
                      />
                    </VAvatar>
                  </VBadge>
                </VListItemAction>
              </template>

              <VListItemTitle class="font-weight-semibold">
                {{ whereRoomNameSet }}
              </VListItemTitle>
              <VListItemSubtitle>{{ whereHouseName }}</VListItemSubtitle>
            </VListItem>

            <VDivider class="my-2" />

            <!-- 👉 Profile -->
            <VListItem link>
              <VListItemTitle>{{ whereRoomNameSet }}</VListItemTitle>
              <VListItemTitle>ID : {{ whereHouseName }}</VListItemTitle>
            </VListItem>

            <!-- Divider -->
            <VDivider class="my-2" />
          </VList>
        </VMenu>
      <!-- !SECTION -->
      </VAvatar>
    </VBadge>
  </VContainer>
</template>
