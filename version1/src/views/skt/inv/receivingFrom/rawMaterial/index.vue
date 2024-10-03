<script setup>
const vasss = ref('dd')

import image01 from '@/views/skt/inv/lorryLoading/flow/sannix/img.png'

const fileMuti = ref([])
const files = ref([])
const isDialogVisibleImgFileMuti = ref(false)

const imgDialog = ref('')
const imgNameDialog = ref('')

const showDialogImageMuti = (img, name) => {
  isDialogVisibleImgFileMuti.value =true
  imgDialog.value = img
  imgNameDialog.value = name
}

const handleFilesO = event => {
  files.value = []

  const selectedFiles = event.target.files
  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i]
    const reader = new FileReader()

    reader.onload = e => {
      files.value.push({
        name: file.name,
        src: e.target.result,
        size: (file.size / 1024).toFixed(3),
      })
    }
    reader.readAsDataURL(file)
  }
  fileMuti.value = selectedFiles
}

const removeFile = index => {
  files.value.splice(index, 1)
  if (!files.value.length) {
    fileMuti.value = null
  }
}

const seeTruck = () => {
  console.log('data truck', resaleProductShipping.value)
}

const seeTruckO = () => {
  console.log('data truck', files.value)
}

const removeFilesInTruck = index => {
  resaleProductShipping.value[index].files = []
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div
        style="font-size: 20px; font-weight: bolder;"
        class="d-flex justify-center align-center"
      >
        Raw  Material  Receiving  Form
      </div>
    </VCol>

    <VCol
      class="text-center mx-4"
      style="border: 1px solid black; font-size: 14px; font-weight: bold;"
      cols="2"
    >
      CONFIDENTIAL
    </VCol>

    <VCol
      cols="12"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <table class="custom-table">
        <tr>
          <th
            class=""
            colspan="2"
          >
            SKT Name
          </th>
          <td
            class="text-center"
            colspan="3"
          >
            AZOBIS
          </td>
          <th
            rowspan="1"
            colspan="2"
            class=""
          >
            <div class="text-center">
              <span style="font-size: 16px;">Raw Mat. Code</span>
            </div>
          </th>
          <th
            colspan="2"
            class=""
          >
            Supplier Name
          </th>
          <td
            colspan="3"
            class="text-center"
          >
            MC INDUSTRIAL CHEMICL CO.,LID
          </td>
        </tr>
        <tr>
          <th
            colspan="2"
            class=""
          >
            Trade Name
          </th>
          <td
            colspan="3"
            class="text-center"
          >
            ABN-R, ABNR (AIBN)
          </td>
          <td
            colspan="2"
            class="text-center"
          >
            4156391503420
          </td>
          <th colspan="2">
            Manufacturer Name
          </th>
          <td
            class="text-center"
            colspan="3"
          >
            Japan Finechem Company, INC
          </td>
        </tr>
        <tr>
          <th colspan="2">
            Received Date
          </th>
          <td
            colspan="3"
            class="text-center"
          >
            9-Apr-24
          </td>
          <th
            class=""
            colspan="2"
          >
            SKT LOT No.
          </th>
          <td
            class="text-center"
            colspan="3"
          >
            1N24040002
          </td>
        </tr>
      </table>
    </VCol>

    <!-- Purchasing Order -->
    <VCol
      cols="12"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <div style="overflow-x: auto;">
        <table class="custom-table">
          <tr>
            <th
              class="text-start"
              colspan="5"
            >
              <div>
                Purchasing Order
              </div>
            </th>
            <th
              class="text-center"
              colspan="8"
            >
              <div>
                Raw Material Receiving
              </div>
            </th>
          </tr>
          <!-- P/O -->
          <tr class="text-center">
            <th
              class="text-start"
              colspan="1"
            >
              P/O No.
            </th>
            <td
              class="text-center"
              colspan="2"
            >
              450005830
            </td>
            <th
              class="text-center"
              colspan="2"
            >
              Maker Lot No.
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              1
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
                :style="{ width: '100%', minWidth: '150px' }"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              2
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              <VTextField
                :style="{ width: '100%', minWidth: '150px' }"
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              3
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              <VTextField
                :style="{ width: '100%', minWidth: '150px' }"
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              Total
            </th>
          </tr>
          <!-- Invoice -->
          <tr class="text-center">
            <th
              class="text-start"
              colspan="1"
            >
              Invoice No.
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField density="compact" />
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              Net Cont.(kg.)
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                :style="{ width: '100%', minWidth: '150px' }"
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                :style="{ width: '100%', minWidth: '150px' }"
                density="compact"
              />
            </th>
          </tr>
          <!-- Invoice -->
          <tr class="text-center">
            <th
              class="text-start"
              colspan="1"
            >
              Expect, Delivery Date
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField density="compact" />
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              Amount(Unit)
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-edit-line" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField density="compact" />
            </th>
          </tr>

          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
              rowspan="6"
            >
              Delivery Quantity
            </th>
            <th
              class="text-center"
              colspan="1"
            >
              Packing
            </th>
            <td
              class="text-center"
              colspan="1"
            >
              P/O
            </td>
            <th
              class="text-center"
              colspan="2"
              rowspan="3"
            />
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-functions" />
                </template>
              </VTextField>
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-functions" />
                </template>
              </VTextField>
            </th>
          
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField
                density="compact"
                style="font-size: 16px;"
              >
                <template #label>
                  <VIcon icon="ri-functions" />
                </template>
              </VTextField>
            </th>
            <th
              class="text-center"
              colspan="2"
            >
              <VTextField density="compact" />
            </th>
          </tr>
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            >
              Net Cont.(kg.)
            </th>
            <td
              class="text-center"
              colspan="1"
            >
              20
            </td>
            <th
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          
            <th
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          </tr>
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            >
              Amount(Unit)
            </th>
            <td
              class="text-center"
              colspan="1"
            >
              8
            </td>
            <th
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          
            <th
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          </tr>
          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            >
              Total Quantity
            </th>
            <td
              class="text-center"
              colspan="1"
            >
              160.00
            </td>
            <th
              class="text-center"
              colspan="2"
            >
              Manufacturer Name
            </th>
            <th
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          
            <th
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          </tr>

          <tr class="text-center">
            <th
              class="text-center"
              colspan="1"
            />
            <th
              class="text-center"
              colspan="1"
            />
            <th
              class="text-center"
              colspan="2"
            >
              Label / Warning Label
            </th>
            <td
              class="text-center"
              colspan="2"
            >
              AZOBIS
            </td>
            <th
              class="text-center"
              colspan="2"
            />
          
            <th
              class="text-center"
              colspan="2"
            />
            <th
              class="text-center"
              colspan="2"
            />
          </tr>
        </table>
      </div>
    </VCol>

    <VCol cols="12">
      <div class="mb-2">
        Note
      </div>
      <Table class="custom-table">
        <tr>
          <th>
            <VTextarea
              clearable
              clear-icon="ri-close-line"
              label="Note"
              placeholder="Text"
            />
          </th>
        </tr>
      </Table>
    </VCol>

    <VCol cols="4">
      <Table class="custom-table">
        <tr>
          <th>
            <div class="demo-space-x">
              <VCheckbox
                v-model="checkboxOne"
                label="RM from Halal Product"
              />
            </div>
          </th>
        </tr>
      </Table>
    </VCol>
    <VCol cols="6" />

    <VCol cols="12">
      <div class="mb-2">
        COA
      </div>
      <Table class="custom-table">
        <tr>
          <th>
            <VRow v-if="!files.length">
              <VCol cols="12">
                <VFileInput
                  v-model="files"
                  label="File Input COA"
                  placeholder="Upload your documents"
                  multiple
                  prepend-icon="mdi-paperclip"
                  @change="handleFilesO"
                />
              </VCol>
            </VRow>

            <VRow
              v-if="files.length"
              class="pa-2 d-flex justify-center"
            >
              <VCol
                v-for="(file, index) in files"
                :key="index"
                cols="12"
                md="4"
                lg="3"
              >
                <VCard>
                  <VCardText>
                    <VImg
                      role="presentation"
                      :alt="file.name"
                      :src="file.src"
                      height="150"
                      contain
                      @click="showDialogImageMuti(file.src, file.name )"
                    />
                    <div class="d-flex flex-column align-center">
                      <span>{{ file.name }}</span>
                      <span>{{ file.size }} KB</span>
                    </div>
                  </VCardText>
                  <VCardActions>
                    <VBtn
                      variant="flat"
                      width="100%"
                      color="error"
                      @click="removeFile(index)"
                    >
                      <VIcon>ri-delete-bin-5-fill</VIcon>
                    </VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>
          </th>
        </tr>
      </Table>
    </VCol>

    <VDialog
      v-model="isDialogVisibleImgFileMuti"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard>
        <VCardTitle class="bg-primary">
          <div class="d-flex justify-space-between">
            <span>{{ imgNameDialog }}</span>
            <VBtn
              icon="mdi-close"
              color="white"
              size="small"
              variant="tonal"
              @click="isDialogVisibleImgFileMuti = false"
            />
          </div>
        </VCardTitle>

        <VCardText>
          <VImg
            role="presentation"
            :src="imgDialog"
            height="100%"
            contain
          />
        </VCardText>
      </VCard>
    </VDialog>

    <VCol cols="8">
      <table class="custom-table">
        <tr>
          <th
            class="text-center"
            colspan="12"
          >
            WareHouse
          </th>
        </tr>
        <tr>
          <td colspan="6">
            <VTextField
              v-model="varA"
              class="pa-0"
              density="compact"
              style="font-size: 16px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span>Staff</span>
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>
          </td>
          <td colspan="6">
            <VTextField
              v-model="varA"
              class="pa-0"
              density="compact"
              style="font-size: 16px;"
            >
              <template #prepend>
                <span />
              </template>
              <template #label>
                <span>Supervisor</span>
              </template>
              <template #append>
                <span />
              </template>
            </VTextField>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <VueDatePicker
              v-model="dateSupervisor"
              :max-date="new Date()"
              :enable-time-picker="false"
            />
          </td>
          <td colspan="6">
            <VueDatePicker
              v-model="dateSupervisor"
              :max-date="new Date()"
              :enable-time-picker="false"
            />
          </td>
        </tr>
      </table>
    </VCol>
    <VCol cols="12">
      <div class="py-3 d-flex justify-end">
        <VBtn
          class="mx-4"
          color="warning"
        >
          SAVE DRAFT
        </VBtn>
        <VBtn color="grey">
          SUBMIT
        </VBtn>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

.text-center {
  text-align: center;
}

.custom-table {
  border-collapse: collapse;
  border-spacing: 0;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
  font-size: 14px;
}

.custom-table th,
.custom-table td {
  padding: 8px;
  text-align: start;
}

.header {
  justify-content: space-between;
  font-weight: bold;
  text-align: center;
}

.section-title {
  font-weight: bold;
}

.image {
  inline-size: 100px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.custom-radio input[type="radio"] {
  block-size: 20px !important;
  inline-size: 20px !important;
}

.v-selection-control__wrapper {
  block-size: 50% !important;
  inline-size: 50% !important;
}

.v-text-field .v-input__control .v-input__slot {
  display: flex !important;
  align-items: center !important;
  min-block-size: auto !important;
}
</style>
