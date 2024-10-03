<script setup>
import { urlApi } from '@/api'
import axios from '@axios'

// Get access token from localStorage in another page
const accessTokenAtStore = localStorage.getItem('accessTokenAtStore')

const whereHouse = localStorage.getItem('whereHouseName')

const configs = ref([])

//---------------------------- Model Config ---------------
const idUser = ref(null)
const receiveBatch = ref(null)
const showDigit = ref(null)
const showRfid = ref(null)
const bigyaFormat = ref(null)


const getConfig = () => {
  axios.get(`${urlApi.value}/api/v1/Settings`, {
    headers: {
      'accept': '*/*',
      'x-location': `${whereHouse}`,
      Authorization: `Bearer ${accessTokenAtStore}`,
    },
  })
    .then(response => {

      configs.value = response.data
      receiveBatch.value = response.data.receiveBatch
      showDigit.value = response.data.showDigit
      showRfid.value = response.data.showRfid
      bigyaFormat.value = response.data.bigyaFormat
      idUser.value = response.data.id

      localStorage.setItem('configsShowRfdi', response.data.showRfid)
      localStorage.setItem('configsShowExpiryDate', response.data.bigyaFormat)

      // Now `items` contains an array of objects with id and name properties
      // console.log('wareHouse.value At index',wareHouseItemsSearchById.value)

      
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error)
    })

    
}

watch(getConfig)

const postConfig = async () => {
  try {
    const response = await axios.post(
      `${urlApi.value}/api/v1/Settings/Update`,
      {
        "id": idUser.value,
        "receiveBatch": receiveBatch.value,
        "showDigit": showDigit.value,
        "showRfid": showRfid.value,
        "bigyaFormat": bigyaFormat.value,
      },
      {
        headers: {
          'accept': '*/*',
          'x-location': `${whereHouse}`,
          Authorization: `Bearer ${accessTokenAtStore}`,
        },
        params: {},  // Add any params if needed
      },
    )

    configs.value = response.data
    console.log('configs.value:', configs.value)

    // Reload the page
    location.reload()


    // Now `items` contains an array of objects with id and name properties
    // console.log('wareHouse.value At index', wareHouseItemsSearchById.value);
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
  }
}

//----------------------------- permission config ------------------------
console.log('permission')

const nameUser = ref('')

watchEffect(() => {
  nameUser.value = localStorage.getItem('userCheck')
  console.log('User Name ;', nameUser.value)
})

const checkConfigPermiss = ref(false)

const checkPermisForConfig = () => {
  if(nameUser.value == 'air') {
    checkConfigPermiss.value = true
  } else {
    checkConfigPermiss.value = false
  }
}

watchEffect(checkPermisForConfig)

const negativeShowDigit = ref(true)

watchEffect(() => {
  if(showDigit.value === true){
    negativeShowDigit.value = false

  }
  console.log('ShowDigit', showDigit.value)
  console.log('negativeShowDigit', negativeShowDigit.value)
})
</script>

<template>
  <VCard
    v-if="!checkConfigPermiss"
    title="Setting Config"
  >
    <VCardText>
      Setting
      <a href="javascript:void(0)">Config</a>
    </VCardText>

    <VCardText>
      <VTable class="text-no-wrap border rounded table-header-bg">
        <thead>
          <tr>
            <th scope="col">
              id
            </th>
            <th>
              {{ $t('Receive Batch') }}
            </th>
            <th scope="col">
              show Digit
            </th>
            <th scope="col">
              show Rfid
            </th>
            <th scope="col">
              show Expiry Date
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span class="">{{ idUser }}</span>
            </td>
            <td>
              <VCheckbox
                v-model="receiveBatch"
                readonly
              />
            </td>
            <td>
              <VCheckbox
                v-model="negativeShowDigit"
                readonly
              />
            </td>
            <td>
              <VCheckbox
                v-model="showRfid"
                readonly
              />
            </td>
            <td>
              <VCheckbox
                v-model="bigyaFormat"
                readonly
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <VCard
    v-if="checkConfigPermiss"
    title="Setting Config"
  >
    <VCardText>
      Setting Root
      <a href="javascript:void(0)">Config</a>
    </VCardText>

    <VCardText>
      <VTable class="text-no-wrap border rounded table-header-bg">
        <thead>
          <tr>
            <th scope="col">
              {{ $t('id') }}
            </th>
            <th
              v-if="false"
              scope="col"
            >
              {{ $t('receive Batch') }}
            </th>
            <th scope="col">
              {{ $t('show Digit') }}
            </th>
            <th scope="col">
              {{ $t('show Rfid') }}
            </th>
            <th scope="col">
              {{ $t('show Expiry Date') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span class="">{{ idUser }}</span>
            </td>
            <td v-if="false">
              <VCheckbox v-model="receiveBatch" />
            </td>
            <td>
              <VCheckbox v-model="negativeShowDigit" />
            </td>
            <td>
              <VCheckbox v-model="showRfid" />
            </td>
            <td>
              <VCheckbox v-model="bigyaFormat" />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>

    <VCardText>
      <VForm @submit.prevent="postConfig">
        <div class="d-flex flex-wrap gap-4 mt-4">
          <VBtn type="submit">
            Save Changes
          </VBtn>
          <VBtn
            color="secondary"
            variant="outlined"
            type="reset"
          >
            Reset
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>
