<script setup>
import { ref } from "vue"
import image from "./image/image.png"

const mockData = ref([
  { AItem: "Appearance(Dent/Clearness/Scratch)", CheckM: "By Sight", SR: "No Dent, Clearness, NoScratch", ActualC: [], A: [], B: [] },
  { AItem: "Color (Body and Top)", CheckM: "By Sight", SR: "Green, White (SK), B2C ", ActualC: [], A: [], B: [] },
])


const checkboxOne = ref(false)

//----------------------------------- COA ----------------------------------------------------------------
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

//--------------------------------- Date Time -----------------------------------------
const datePreparedBy = ref(new Date())

const dateManagerWarehouseApprove = ref(new Date())
const dateSupervisorWarehouseApprove = ref(new Date())

const dateStaffWarehouse = ref(new Date())
const dateSupervisorWarehouse = ref(new Date())

//------------------------------ Basic -----------------------------------------------------
const isDialogRejectVisible = ref(false)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h2 class="text-center">
        Packaging Inspection Request Form
      </h2>
    </VCol>
  </VRow>

  <VRow>
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
            colspan="4"
          />
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
            Received Date
          </th>
          <td
            colspan="2"
            class=""
          >
            20/01/2024
          </td>
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
          <th colspan="7">
            Certification of analysis from manufacturer
          </th>
          <td
            class="text-center"
            colspan="3"
          >
            <VRow>
              <VCol cols="6">
                <div class="demo-space-x">
                  <VCheckbox
                    v-model="checkboxOne"
                    label="Yes"
                  />
                </div>
              </VCol>
              <VCol cols="6">
                <div class="demo-space-x">
                  <VCheckbox
                    v-model="checkboxTwo"
                    label="No"
                  />
                </div>
              </VCol>
            </VRow>
          </td>
        </tr>
      </table>
    </VCol>
  </VRow>

  <VRow>
    <VCol
      cols="12"
      style="overflow-x: auto; white-space: nowrap;"
    >
      <table class="custom-table">
        <thead>
          <tr>
            <th
              colspan="1"
              rowspan="2"
            >
              No.
            </th>
            <th
              colspan="2"
              rowspan="2"
            >
              Analysis Items
            </th>
            <th
              colspan="2"
              rowspan="2"
            >
              Checking Method
            </th>
            <th
              colspan="2"
              rowspan="2"
            >
              Specification Ranges
            </th>
            <th colspan="1">
              P/O NO.
            </th>
            <th colspan="4">
              <VTextField density="compact" />
            </th>
          </tr>
          <tr>
            <th colspan="1">
              Amount (Piece)
            </th>
            <th colspan="4">
              <VTextField density="compact" />
            </th>
          </tr>
          <tr>
            <th colspan="7" />
            <th colspan="1">
              Actual Check
            </th>
            <th colspan="4">
              <VTextField density="compact" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in mockData"
            :key="index"
          >
            <th colspan="1">
              {{ index+1 }}
            </th>
            <td colspan="2">
              {{ item.AItem }}
            </td>
            <td colspan="2">
              {{ item.CheckM }}
            </td>
            <td colspan="2">
              {{ item.SR }}
            </td>
            <td colspan="1">
              <VTextField
                v-model="item.ActualC"
                density="compact"
              />
            </td>
            <td colspan="2">
              <VTextField
                v-model="item.A"
                :style="{ width: '150px', maxWidth: '300px' }"
                density="compact"
              />
            </td>
            <td colspan="2">
              <VTextField
                v-model="item.B"
                :style="{ width: '150px', maxWidth: '300px' }"
                density="compact"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>

    <!-- Image -->
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th>
              <VRow>
                <VCol cols="12">
                  <VImg
                    max-height="350px"
                    :src="image"
                  />
                </VCol>
              </VRow>
            </th>
          </tr>
        </thead>
      </table>
    </VCol>
  </VRow>

  <VRow>
    <!-- Note -->
    <VCol
      cols="6"
      class="text-decoration-underline"
    >
      Note
    </VCol>
    <VCol
      cols="6"
      class="text-decoration-underline"
    >
      Details of Limitation Condition
    </VCol>
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th colspan="6">
              <VTextarea
                v-model="textareaValue"
                variant="plain"
                placeholder="Note"
                auto-grow
              />
            </th>
            <th colspan="6">
              <VTextarea
                v-model="textareaValue"
                variant="plain"
                placeholder="Details"
                auto-grow
              />
            </th>
          </tr>
        </thead>
      </table>
    </VCol>
  </VRow>

  <VRow>
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
  </VRow>

  <VRow>
    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th
              class="text-center"
              colspan="12"
            >
              Warehouse
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6">
              <VTextField
                density="compact"
                label="Staff"
              />
            </td>
            <td colspan="6">
              <VTextField
                density="compact"
                label="Supervisor"
              />
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <VueDatePicker
                v-model="dateStaffInspection"
                :max-date="new Date()"
                :enable-time-picker="false"
              />
            </td>
            <td colspan="6">
              <VueDatePicker
                v-model="dateStaffInspection"
                :max-date="new Date()"
                :enable-time-picker="false"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>
  </VRow>

  <!-- Dialog Reject -->
  <section>
    <VDialog
      v-model="isDialogRejectVisible"
      width="500"
    >
      <!-- Dialog Content -->
      <VCard title="Comment">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogRejectVisible = false"
        />

        <VCardText>
          <VTextarea
            label="Comment"
            placeholder="Enter Comment Reject"
          />
        </VCardText>

        <VCardText class="d-flex justify-space-between flex-wrap gap-4">
          <VBtn
            color="error"
            @click="isDialogRejectVisible = false"
          >
            Reject
          </VBtn>
          <VBtn
            color="warning"
            @click="isDialogRejectVisible = false"
          >
            close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </section>

  <VRow>
    <VCol cols="4" />
    <VCol
      cols="8"
      class="d-flex justify-end"
    >
      <VBtn
        height="100%"
        width="150px"
        color="warning"
      >
        Save daft
      </VBtn>
      <VBtn
        height="100%"
        width="150px"
        class="mx-2"
        color="error"
        @click="isDialogRejectVisible = true"
      >
        Reject
      </VBtn>
      <VBtn
        height="40px"
        width="150px"
      >
        <VRow>
          <VCol
            class="py-2"
            cols="12"
          >
            submit
          </VCol>
        </VRow>
      </VBtn>
    </VCol>
  </VRow>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 0;
  text-align: center;
}

.table-container {
  overflow-x: auto;
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
</style>
