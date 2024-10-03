<script setup>
import { ref } from 'vue'

const form = ref({
  sktName: '',
  rawMatCode: '',
  tradeName: '',
  supplierName: '',
  receivedDate: '',
  sktLotNo: '',
  manufacturerName: '',
  warehouse: '',
  poNo: '',
  invoiceNo: '',
  deliveryDetails: [],
  notes: '',
})

const tableHeaders = [
  { text: 'Maker Lot No.', value: 'makerLotNo' },
  { text: 'Net Cont.(kg)', value: 'netCont' },
  { text: 'Amount(Unit)', value: 'amount' },
  { text: 'Actions', value: 'actions', sortable: false },
]

const addNewDetail = () => {
  form.value.deliveryDetails.push({ makerLotNo: '', netCont: '', amount: '' })
}

const editDetail = item => {
  // Logic to edit the detail
}

const deleteDetail = item => {
  const index = form.value.deliveryDetails.indexOf(item)
  if (index > -1) {
    form.value.deliveryDetails.splice(index, 1)
  }
}

const checkboxOne = ref(false)

const rawMaterialInspection = ref([
  {analysisItems:'Appearance', unit:'', analysisMethodNo:'B0020 0ST00000', specificationRanges:'Colorless clear liquid', actualAnalysis:'', a:'', B:'', aa: true},
  {analysisItems:'Purity', unit:'[%]', analysisMethodNo:'JISK-8085-72', specificationRanges:'25.0 ~ 28.0', actualAnalysis:'', a:'', B:'', aa: false},
  {analysisItems:'Chloride(Cl) content', unit:'[%]', analysisMethodNo:'JISK-8085-72', specificationRanges:'0.0005 max.', actualAnalysis:'', a:'', B:'', aa: false},
  {analysisItems:'Sulfate(SO4) content', unit:'[%]', analysisMethodNo:'JISK-8085-72', specificationRanges:'0.0020 max.', actualAnalysis:'', a:'', B:'', aa: false},
  {analysisItems:'Iron(Fe) content', unit:'[%]', analysisMethodNo:'JISK-8085-72', specificationRanges:'0.0003 max.', actualAnalysis:'', a:'', B:'', aa: false},
  {analysisItems:'Heavy metal content', unit:'[%]', analysisMethodNo:'JISK-8085-72', specificationRanges:'0.0005 max.', actualAnalysis:'', a:'', B:'', aa: true},
  
])

const Reference = ref([
  {analysisItems:'Carbonate content', unit:'[%]', analysisMethodNo:'JISK-8085-72', specificationRanges:'0.010 max.', actualAnalysis:'', a:'', B:''},
  {analysisItems:'Ignition residue', unit:'[%]', analysisMethodNo:'JISK-8085-72', specificationRanges:'0.0050 max.', actualAnalysis:'', a:'', B:''},
  
  
])

//--------------------------------- Date Time -----------------------------------------
const dateStaffWarehouse = ref(new Date())
const dateSupervisorWarehouse = ref(new Date())
const dateStaffInspection = ref(new Date())
const dateSupervisorInspection = ref(new Date())

//--------------------------------  Dialog COA ----------------------------------------------------------------
const isDialogVisibleCOA = ref(false)

const checkBoxCOAYes = ref(true)
const checkBoxCOANo = ref(false)
const srcImagCOA = ref('')

const showDialogCOA = (img) => {
  isDialogVisibleCOA.value = true
  srcImagCOA.value = img
}
</script>

<template>
  <div>
    <h2 class="text-center">
          Raw Material Inspection Request Form
        </h2>
  </div>

  <VRow>
    <VCol cols="3">
       <div class="my-4 pa-2 text-center" style="border: 1px solid black; font-size: 14px; font-weight: bold;">
        CONFIDENTIAL
      </div>
    </VCol>
  </VRow>

  <div style="overflow-x: auto; white-space: nowrap;">
     <table class="custom-table">
    <thead>
      <tr>
        <th colspan="4">
        </th>
        <th colspan="1" class="text-center">
          SKT Name
        </th>
        <td colspan="2">
          TELA
        </td>
        <th colspan="1"  class="text-center">
          Raw Mat. Code
        </th>
        <th colspan="2">
          Supplier Name
        </th>
        <td colspan="2">
          <div>1) Toyota Tocho(thailand) Co., Ltd.</div>
          <div>2) Choroen International Co., Ltd.</div>
        </td>
      </tr>
      <tr>
        <th colspan="2">
          Received Date 
        </th>
        <th colspan="2">
          22/11/2024
        </th>
        <th colspan="1"  class="text-center">
          Trade Name
        </th>
        <td colspan="2">
          AQUEOUS AMMONIA
        </td>
        <td colspan="1">
          415619310060
        </td>
        <th colspan="2">
          Manufacturer Name
        </th>
        <td colspan="2">
          <div>1) TIG via Asian Polytrade Co., Ltd.</div>
          <div>2) Komon Chokrowan(2003) Co., Ltd.</div>
        </td>
      </tr>
      <tr>
        <th colspan="5">
          Certificate of Analysis from manufacturer
        </th>
        <td colspan="3">
          <VRow>
            <VCol cols="6">
                  <VCheckbox
                  readonly
                  v-model="checkBoxCOAYes"
                  label="Yes"
                />
            </VCol>
            <VCol cols="6">
              <VCheckbox
                v-model="checkBoxCOANo"
                readonly
                label="No"
              /></VCol>
          </VRow>
        </td>
        <th class="d-flex justify-center" @click="showDialogCOA('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQon6iDpseJ1PAYOSBxRIeIw-OLb11MeRrDcw&s')" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQon6iDpseJ1PAYOSBxRIeIw-OLb11MeRrDcw&s" colspan="2">
          <div>
            <VImg @click="showDialogCOA('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQon6iDpseJ1PAYOSBxRIeIw-OLb11MeRrDcw&s')" width="40" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQon6iDpseJ1PAYOSBxRIeIw-OLb11MeRrDcw&s"></VImg>
          </div>
        </th>
        <td colspan="2">
          
        </td>
      </tr>
    </thead>
  </table>
  </div>
 
  <VDialog
    v-model="isDialogVisibleCOA"
    width="500"
  >
    <!-- Dialog Content -->
    <VCard>

      <VCardTitle class="bg-primary d-flex justify-space-between align-center">
        <span>COA</span>
      <VBtn @click="isDialogVisibleCOA = false" color="white" variant="tonal" icon="ri-close-fill"></VBtn>
      </VCardTitle>

      <VCardText>
        <VImg :src="srcImagCOA"></VImg>
      </VCardText>

      <VCardText v-if="false" class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="isDialogVisibleCOA = false"
        >
          close
        </VBtn>
        <VBtn @click="isDialogVisibleCOA = false">
          I accept
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VContainer fluid>
    <!-- Raw Material Inspection Request Form -->
    <VRow class="mt-4">
      <VCol class="px-0" cols="12">
        <div style="overflow-x: auto; white-space: nowrap;">
          <table class="custom-table">
          <tr>
            <th class="text-center" rowspan="3" colspan="1">No.</th>
            <th class="text-center" rowspan="3" colspan="2">Analytical Items</th>
            <th class="text-center" rowspan="3" colspan="2">Unit</th>
            <th class="text-center" rowspan="3" colspan="2">Analytical  Method No.</th>
            <th class="text-center" rowspan="3" colspan="2">Specification Ranges</th>
            <th class="text-center " colspan="1">Sanyo Lot No.</th>
            <th colspan="2">
              <VTextField density="compact">
               </VTextField>
            </th>
          </tr>
          <tr>
            <th class="text-center" colspan="1">Maker Lot No.</th>
            <th class="text-center" colspan="1" >
              <div class="d-flex justify-center align-center">
                <VTextField  :style="{ width: '150px', maxWidth: '300px' }" density="compact">
                  <template v-slot:prepend>
                    A
                  </template>
                </VTextField>
              </div>
            </th>
            <th colspan="1">
              <div class="d-flex justify-center align-center">
                <VTextField  :style="{ width: '150px', maxWidth: '300px' }" density="compact">
                  <template v-slot:prepend>
                    A
                  </template>
                </VTextField>
              </div>
            </th>
          </tr>
          <tr>
            <th class="text-center"  colspan="1">Net Count,x Amount</th>
            <th class="text-center" colspan="1">X</th>
            <th class="text-center" colspan="1">X</th>
          </tr>
          <tr>
            <th class="text-center" colspan="9"></th>
            <th class="text-center" colspan="1">Actual Analysis</th>
            <th class="text-center" colspan="1">
              <VTextField density="compact">
               </VTextField>
                    </th>
            <th class="text-center" colspan="1">
              <VTextField density="compact">
                </VTextField></th>
          </tr>

          <tr v-for="(item , index) in rawMaterialInspection" :key="index">
            <td :class="{ 'bg-primary': !item.aa, 'bg-primary': item.aa }" class="text-center" colspan="1">{{ index + 1 }}</td>
            <td colspan="2">{{ item.analysisItems }}</td>
            <td class="text-center" colspan="2">{{ item.unit }}</td>
            <td class="text-center" colspan="2">{{ item.analysisMethodNo }}</td>
            <td class="text-center" colspan="2">{{ item.specificationRanges }}</td>
            <td class="text-center" colspan="1">{{ item.actualAnalysis }}</td>

            <td v-if="!item.aa" class="text-center" colspan="1">
              <VRow>
                <VCol cols="6">
                  <VRadioGroup
                    v-model="inlineRadio"
                    inline
                    style="font-size: 14px;"
                  >
                    <v-radio-group v-model="radios">
                      <v-radio value="OK">
                        <template v-slot:label>
                          <div style="font-size: 14px;">OK</div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </VRadioGroup>
                </VCol>
                <VCol cols="6">
                  <VRadioGroup
                    v-model="inlineRadio"
                    style="font-size: 14px;"
                    inline
                  >
                    <v-radio-group v-model="radios">
                      <v-radio value="NOT">
                        <template v-slot:label>
                          <div style="font-size: 14px;">NOT</div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </VRadioGroup>
                </VCol>
              </VRow>
            </td>
            <td v-if="!item.aa" class="text-center" colspan="1">
              <VRow>
                <VCol cols="6">
                  <VRadioGroup
                    v-model="inlineRadio"
                    inline
                    style="font-size: 14px;"
                  >
                    <v-radio-group v-model="radios">
                      <v-radio value="OK">
                        <template v-slot:label>
                          <div style="font-size: 14px;">OK</div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </VRadioGroup>
                </VCol>
                <VCol cols="6">
                  <VRadioGroup
                    v-model="inlineRadio"
                    style="font-size: 14px;"
                    inline
                  >
                    <v-radio-group v-model="radios">
                      <v-radio value="NOT">
                        <template v-slot:label>
                          <div style="font-size: 14px;">NOT</div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </VRadioGroup>
                </VCol>
              </VRow>
            </td>

            <td v-if="item.aa" class="text-center" colspan="1"><VTextField density="compact"></VTextField></td>
            <td v-if="item.aa" class="text-center" colspan="1"><VTextField density="compact"></VTextField></td>
          </tr>

          <tr>
            <td class="text-center" colspan="12"></td>
          </tr>

          <tr>
            <td class="text-center" colspan="1"></td>
            <th class="text-start text-decoration-underline" colspan="11">Reference</th>
          </tr>

          <tr v-for="(item , index) in Reference" :key="index">
            <td :class="{ 'bg-primary': !item.aa, 'bg-primary': item.aa }" class="text-center" colspan="1">{{ index + 1 }}</td>
            <td colspan="2">{{ item.analysisItems }}</td>
            <td class="text-center" colspan="2">{{ item.unit }}</td>
            <td class="text-center" colspan="2">{{ item.analysisMethodNo }}</td>
            <td class="text-center" colspan="2">{{ item.specificationRanges }}</td>
            <td class="text-center" colspan="1">{{ item.actualAnalysis }}</td>

            <td class="text-center" colspan="1"><VTextField density="compact"></VTextField></td>
            <td class="text-center" colspan="1"><VTextField density="compact"></VTextField></td>
          </tr>

          <tr>
            <td class="text-center" colspan="1"></td>
            <td class="text-start" colspan="11">
              <div class="d-flex align-center">
                <VIcon color="primary" icon="ri-circle-fill"></VIcon> = After arrival of raw material, we have to actually analyze every lot.
              </div>
            </td>
          </tr>
        </table>
        </div>
        
      </VCol>
    </VRow>

    <!-- Note -->
    <VRow class="my-0">
      <VCol
        class="px-0"
        cols="12"
      >
        <!-- Note -->
        <VRow class="mt-6 text-decoration-underline">
          
          <VCol cols="6">Note</VCol>
          <VCol cols="6">Details of Limitation Condition</VCol>
        </VRow>

        <VRow class="my-4">
          <VCol
            style="border: 1px solid black;"
            cols="6"
            class
          >
            <VTextarea
              v-model="textareaValue"
              variant="plain"
              placeholder="Enter Note"
              auto-grow
            />
          </VCol>
          <VCol
            style="border: 1px solid black;"
            cols="6"
          >
            <VTextarea
              v-model="textareaValue"
              variant="plain"
              placeholder="Enter Details"
              auto-grow
            />
          </VCol>
        </VRow>

        <!-- WareHouse / Inspection -->
        <VRow>
          <VCol cols="6">
            <VRow>
              <VCol
                style="border: 1px solid black;"
                class="text-center"
                cols="12"
              >
                WareHouse
              </VCol>
              <VCol
                style="border: 1px solid black;"
                class="text-center"
                cols="6"
              >
              <VTextField
                  v-model="textareaValue"
                  variant="plain"
                  label="Staff"
                  placeholder="signature"
                  auto-grow
                />
                <VDivider />
                <VueDatePicker
                  v-model="dateStaffWarehouse"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </VCol>
              <VCol
                style="border: 1px solid black;"
                class="text-center"
                cols="6"
              >
              <VTextField
                  v-model="textareaValue"
                  variant="plain"
                  placeholder="signature"
                  label="Supervisor"
                  auto-grow
                />
                <VDivider />
                <VueDatePicker
                  v-model="dateSupervisorWarehouse"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            cols="6"
          >
          <VRow>
              <VCol
                style="border: 1px solid black;"
                class="text-center"
                cols="12"
              >
                Inspection
              </VCol>
              <VCol
                style="border: 1px solid black;"
                class="text-center"
                cols="6"
              >
              <VTextField
                  v-model="textareaValue"
                  variant="plain"
                  placeholder="signature"
                  label="Staff"
                  auto-grow
                />
                <VDivider />
                <VueDatePicker
                  v-model="dateStaffInspection"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </VCol>
              <VCol
                style="border: 1px solid black;"
                class="text-center"
                cols="6"
              >
              <VTextField
                  v-model="textareaValue"
                  variant="plain"
                  placeholder="signature"
                  label="Supervisor"
                  auto-grow
                />
                <VDivider />
                <VueDatePicker
                  v-model="dateSupervisorInspection"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <VRow>
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
        class="mx-4"
      >
        Save daft
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
    </VRow>
  </VContainer>
</template>

<style scoped>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 10px;
  text-align: center;
}

.custom-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
  font-size: 14px;
}

.custom-radio-group .v-label {
  font-size: 14px !important;
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

.divider {
  border-inline-end: 1px solid black;
  line-height: 20px; /* ปรับค่า line-height ตามที่คุณต้องการ */
  padding-inline-end: 10px;
}
</style>
