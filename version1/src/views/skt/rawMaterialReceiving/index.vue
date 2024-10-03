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

//--------------------------------- Date Time -----------------------------------------
const dateStaff = ref(new Date())
const dateSupervisor = ref(new Date())
</script>

<template>
  <VContainer fluid>
    <VRow class="px-0">
      <VCol cols="12">
        <h2 class="text-center">
          Raw Material Receiving Form
        </h2>
      </VCol>
      <VCol
        class="px-0"
        cols="12"
      >
        <span
          style="border: 1px solid black;"
          class="text-start"
        >
          CONFIDENTIAL
        </span>
      </VCol>
    </VRow>
    <!-- SKT Name | AZOBIS |Raw Mat. Code -->
    <VRow>
      <VCol
        class="px-0"
        cols="12"
      >
        <VRow
          class="pa-0"
          style="border: 2px solid black;"
        >
          <VCol
            style="border: 1px solid black;"
            cols="2"
            class="text-start bg-grey-lighten-1"
          >
            SKT Name
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="3"
          >
            AZOBIS
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="2 "
          >
            Raw Mat. Code
          </VCol>
          <VCol
            style="border: 1px solid black;"
            cols="2"
            class="text-start"
          >
            Supplier Name
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="3"
          >
            MC INDUSTRIAL CHEMICL CO.,Lid
          </VCol>
        </VRow>

        <VRow
          class="pa-0"
          style="border: 2px solid black;"
        >
          <VCol
            style="border: 1px solid black;"
            cols="2"
            class="text-start"
          >
            Trade Name
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="3"
          >
            ABN-R, ABNR(AIBN)
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="2 "
          >
            41563591503420
          </VCol>
          <VCol
            style="border: 1px solid black;"
            cols="2"
            class="text-start"
          >
            Manufacturer Name
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="3"
          >
            Japan Finechem Company , INC
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <!-- Receied Date -->
    <VRow class="my-6">
      <VCol
        class="px-0"
        cols="12"
      >
        <VRow class="pa-0">
          <VCol
            style="border: 1px solid black;"
            cols="2"
            class="text-start"
          >
            Receied Date
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="1"
          >
            9-Apr-24
          </VCol>
          <VCol
            class="text-center pa-1"
            style="border: 1px solid black;"
            cols="2"
          >
            <VTextField
              class="centered-input"
              density="compact"
              variant="plain"
              placeholder="---"
            />
          </VCol>
          <VCol
            class="text-center"
            cols="1"
          />
          <VCol
            style="border: 1px solid black; background-color: #bdbdbd ;"
            cols="2"
            class="text-start"
          >
            SKT LOT No.
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="2"
          >
            1N24040002
          </VCol>
          <VCol
            class="text-center pa-1 d-flex justify-space-between"
            style="border: 1px solid black;"
            cols="2"
          >
            <VCheckbox
              v-model="checkboxOne"
              max-width="50"
            />
            <VTextField
              readonly="checkboxOne"
              class="centered-input"
              density="compact"
              variant="plain"
              placeholder="---"
            />
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <VRow class="my-6">
      <VCol
        class="px-0"
        cols="12"
      >
        <!-- Purchasing -->
        <VRow class="pa-0">
          <VCol
            style="border: 1px solid black;"
            cols="6"
            class="text-center"
          >
            Purchasing Order
          </VCol>
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="6"
          >
            Raw Material Receiving
          </VCol>
        </VRow>
        <!-- P/O -->
        <VRow class="pa-0">
          <!-- Label -->
          <VCol
            style="border: 1px solid black;"
            cols="6"
            class="text-start"
          >
            <!-- P/O -->
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
              >
                P/O No.
              </VCol>
              <VCol
                class="text-center"
                style="border: 1px solid black;"
                cols="6"
              >
                4500053830
              </VCol>
              <VCol
                class="text-center bg-grey-lighten-2"
                style="border: 1px solid black;"
                cols="3"
              >
                Maker Lot No.
              </VCol>
            </VRow>
            <!-- Invoice -->
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
              >
                Invoice No.
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="6"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="---"
                />
              </VCol>
              <VCol
                class="text-center bg-grey-lighten-1"
                style="border: 1px solid black;"
                cols="3"
              >
                Net Count. (kg.)
              </VCol>
            </VRow>
            <!-- Expect -->
            <VRow>
              <VCol
                class="pa-2"
                style="border: 1px solid black;"
                cols="3"
              >
                Expect. Delivery Date
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="6"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="---"
                />
              </VCol>
              <VCol
                class="text-center bg-grey-lighten-1 "
                style="border: 1px solid black;"
                cols="3"
              >
                Amount(Unit)
              </VCol>
            </VRow>
          </VCol>
          <!-- Input -->
          <VCol
            class="text-center"
            style="border: 1px solid black;"
            cols="6"
          >
            <!-- Input A B C Total  -->
            <VRow class="bg-grey-lighten-3">
              <VCol
                style="border: 1px solid black;"
                cols="3"
              >
                <VRow>
                  <VCol
                    class="pa-2"
                    cols="2"
                    style="border: 1px solid black; border-width: border;"
                  >
                    <strong>A</strong>
                  </VCol>
                  <VCol
                    class="pa-1"
                    cols="10"
                  >
                    <VTextField
                      class="centered-input"
                      density="compact"
                      variant="plain"
                      placeholder="3L02-31F"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                class="text-center"
                style="border: 1px solid black;"
                cols="3"
              >
                <VRow>
                  <VCol
                    class="pa-2"
                    cols="2"
                    style="border: 1px solid black;"
                  >
                    <strong>B</strong>
                  </VCol>
                  <VCol
                    class="pa-1"
                    cols="10"
                  >
                    <VTextField
                      class="centered-input"
                      density="compact"
                      variant="plain"
                      placeholder="3L02-31F"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                class="text-center"
                style="border: 1px solid black;"
                cols="3"
              >
                <VRow>
                  <VCol
                    class="pa-2"
                    cols="2"
                    style="border: 1px solid black;"
                  >
                    <strong>C</strong>
                  </VCol>
                  <VCol
                    class="pa-1"
                    cols="10"
                  >
                    <VTextField
                      class="centered-input"
                      density="compact"
                      variant="plain"
                      placeholder="00"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                class="text-center pa-2"
                style="border: 1px solid black;"
                cols="3"
              >
                <span style="font-weight: bolder;">Total</span>
              </VCol>
            </VRow>
            <!-- Input   -->
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>

        <!-- Delivery -->
        <VRow class="pa-0">
          <VCol
            style="border: 1px solid black;"
            cols="6"
            class="text-start"
          >
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
              >
                Delivery Quality
              </VCol>
              <VCol
                style="border: 1px solid black;"
                cols="9"
              >
                <VRow class="">
                  <!-- Picking - P/B - 0 -->
                  <VCol
                    class="text-center"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    Picking
                  </VCol>
                  <VCol
                    class="text-center"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    P/B
                  </VCol>
                  <VCol
                    class="text-center pa-1"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    <VTextField
                      class="centered-input"
                      density="compact"
                      variant="plain"
                      placeholder="00"
                    />
                  </VCol>
                  <!-- Net Count - 20 - 0 -->
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    Net Count.(Kg.)
                  </VCol>
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                    class="text-center"
                  >
                    20
                  </VCol>
                  <VCol
                    class="text-center pa-1"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    <VTextField
                      class="centered-input"
                      density="compact"
                      variant="plain"
                      placeholder="00"
                    />
                  </VCol>
                  <!-- Amount - 8 - 0 -->
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    Amount(Unit)
                  </VCol>
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                    class="text-center"
                  >
                    8
                  </VCol>
                  <VCol
                    class="text-center pa-1"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    <VTextField
                      class="centered-input"
                      density="compact"
                      variant="plain"
                      placeholder="00"
                    />
                  </VCol>
                  <!-- Total Q - 8 - Manufacturer Name -->
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    Total Quantity
                  </VCol>
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                    class="text-center"
                  >
                    160.00
                  </VCol>
                  <VCol
                    class="text-center pa-0"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    Manufacturer Name
                  </VCol>
                  <!--  - - Label / Warming Label -->
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                    class="text-center"
                  >
                    ---
                  </VCol>
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                    class="text-center"
                  >
                    --
                  </VCol>
                  <VCol
                    class="text-center pa-0"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    Label / Warming Label
                  </VCol>
                  <!--  - - Label / Storage place No. -->
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                    class="text-center"
                  >
                    ----
                  </VCol>
                  <VCol
                    style="border: 1px solid black;"
                    cols="4"
                    class="text-center"
                  >
                    ----
                  </VCol>
                  <VCol
                    class="text-center pa-0"
                    style="border: 1px solid black;"
                    cols="4"
                  >
                    Storage place No.
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCol>



          <VCol
            style="border: 1px solid black;"
            cols="6"
            class="text-start"
          >
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                style="border: 1px solid black;"
                cols="3"
                class="px-2 pa-1"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
              <VCol
                class="text-center pa-1"
                style="border: 1px solid black;"
                cols="3"
              >
                <VTextField
                  class="centered-input"
                  density="compact"
                  variant="plain"
                  placeholder="00"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>

        <!-- Note -->
        <VRow class="mt-6 text-decoration-underline">
          Note
        </VRow>

        <VRow class="my-4">
          <VCol
            style="border: 1px solid black;"
            cols="12"
          >
            <VTextarea
              v-model="textareaValue"
              variant="plain"
              placeholder="Note"
              auto-grow
            />
          </VCol>
        </VRow>

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
                Staff
              </VCol>
              <VCol
                style="border: 1px solid black;"
                class="text-center"
                cols="6"
              >
                Supervisor
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
                  auto-grow
                />
                <VDivider />
                <VueDatePicker
                  v-model="dateStaff"
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
                  auto-grow
                />
                <VDivider />
                <VueDatePicker
                  v-model="dateSupervisor"
                  :max-date="new Date()"
                  :enable-time-picker="false"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            class="d-flex justify-end align-end"
            cols="6"
          >
            <VBtn
              class="mx-1"
              color="warning"
            >
              Save
            </VBtn>
            <VBtn class="mx-1">
              Confirm
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VContainer>
</template>



<style scoped>
.text-center {
  text-align: center;
}

.centered-input >>> input {
  padding: 2;
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
</style>
