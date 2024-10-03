<script setup>
const vasss = ref('dd')
import image02 from '@/views/skt/resale/ibc/img/02.png'
import img01 from '@/views/skt/resale/flexible/img/01.png'
import img02 from '@/views/skt/resale/flexible/img/02.png'
import img03 from '@/views/skt/resale/flexible/img/03.png'
import img04 from '@/views/skt/resale/flexible/img/04.png'
import img05 from '@/views/skt/resale/flexible/img/05.png'

const imagePicture = ref([img01, img02, img03, img04, img05])
</script>

<template>
  <VRow>
    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th
            colspan="12"
            class="text-center"
          >
            Filling direction & Report to Lorry
          </th>
        </tr>
        <tr>
          <th
            colspan="4"
            class="text-center"
          >
            Customer Name : FMT /SINGBURI,SO1100077656
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            Delivery Place : 10-04-2024
          </th>
          <th
            colspan="4"
            class="text-center"
          >
            Weight:     12,500         Kg.
          </th>
        </tr>
        <tr>
          <th
            colspan="4"
            class="text-center "
          >
            Date of Issue :  10-04-2024
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            Issued by
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            Checked by
          </th>
          <th
            colspan="4"
            class="text-center "
          >
            Approved by
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            Product Name
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            F-190
          </th>
          <th
            colspan="2"
            class="text-center "
          />
          <th
            colspan="2"
            class="text-center "
          />
          <th
            colspan="4"
            class="text-center "
          />
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            Lot No.
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            PA24020033
          </th>
          <th
            colspan="8"
            class="text-center "
          />
        </tr>
      </table>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th
            colspan="1"
            rowspan="3"
            class="text-center "
          >
            Strainer type
          </th>
          <th
            colspan="2"
            class="text-center "
          >
            Mesh
          </th>
          <th
            colspan="6"
            class="text-center "
          >
            80&nbsp;&nbsp;&nbsp;100&nbsp;&nbsp;&nbsp;20&nbsp;&nbsp;&nbsp;150&nbsp;&nbsp;&nbsp;200&nbsp;&nbsp;&nbsp;300
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VCheckbox />YES
              <VCheckbox />NO
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            Material
          </th>
          <th
            colspan="6"
            class="text-center "
          >
            VESEL……….    LOT NO.…PA24020033
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VCheckbox />YES
              <VCheckbox />NO
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="2"
            class="text-center "
          >
            Bag filter
          </th>
          <th
            colspan="5"
            class="text-start "
          >
            <span class="text-start">
              Cotton( pieces) 
            </span>
          </th>
          <th
            colspan="1"
            class="text-end "
          >
            <span class="end">
              flannel( pieces)
            </span>
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            <div class="checkbox-container">
              <VCheckbox />YES
              <VCheckbox />NO
            </div>
          </th>
        </tr>
      </table>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Filling equipment
          </th>
          <th
            colspan="11"
            rowspan="2"
            class="text-center "
          >
            <div class="d-flex">
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
              <VTextField
                append-inner-icon="ri-arrow-right-wide-line"
                density="compact"
                prepend-inner-icon="ri-arrow-left-wide-line"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            (Filling order)
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Lot No.(Actual)
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div>
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Container
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div>
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Net 
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div Class="d-flex">
              <VTextField
                density="compact"
                variant="outlined"
                @click:append-inner="visible = !visible"
              />
              <VTextField
                density="compact"
                variant="outlined"
                label="Kg."
                @click:append-inner="visible = !visible"
              />
            </div>
          </th>
        </tr>
        <tr>
          <th
            colspan="1"
            class="text-start "
          >
            Point of delivery
          </th>
          <th
            colspan="11"
            class="text-center "
          >
            <div class="checkbox-container">
              <VRow>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
                >
                  <VCheckbox />Export
                </VCol>
                <VCol
                  class="d-flex justify-center align-center"
                  cols="6"
                >
                  <VCheckbox />Domestic
                </VCol>
              </VRow>
            </div>
          </th>
        </tr>

        <tr>
          <th
            colspan="1"
            class="text-center "
          >
            Filling Check
          </th>
          <th
            colspan="5"
            class="text-center "
          >
            Appearance
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            TIME  DATE
          </th>
          <th
            colspan="3"
            class="text-center "
          >
            Person incharge
          </th>
        </tr>

        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            Analysis result
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Before
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            1st Sampling
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Start
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            2nd Sampling
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Middle
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            3rd  Sampling
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            Final
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
        <tr>
          <th
            class="text-center "
            colspan="1"
          >
            4th Sampling
          </th>
          <th
            class="text-center "
            colspan="1"
          >
            In Lorry
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="2"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
          <th
            class="text-center "
            colspan="4"
          >
            <VTextField
              density="compact"
              variant="outlined"
            />
          </th>
        </tr>
      </table>
    </VCol>
    

    <VCol cols="12">
      <table class="custom-table">
        <thead>
          <tr>
            <th
              class="text-center "
              colsapn="6"
            >
              Picture
            </th>
            <th
              class="text-center "
              colsapn="6"
            >
              <VTextField
                density="compact"
                variant="outlined"
                label="Seal No."
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(image, index) in imagePicture"
            :key="index"
          >
            <td colspan="6">
              <VImg :src="image" />
            </td>
            <td colspan="6">
              <div class="d-flex justify-center">
                Already Cleaned
              </div>
              <div class="d-flex justify-space-between">
                <VCheckbox
                  class="mx-4"
                  label="YES"
                />
                <VCheckbox
                  class="mx-4"
                  label="NO"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </VCol>

    <VCol cols="12">
      <table class="custom-table">
        <tr>
          <th colspan="12">
            <VTextarea
              autocomplete="email"
              label="Remark"
              placeholder="johndoe@email.com"
            />
          </th>
        </tr>
      </table>
    </VCol>

    <VCol cols="12">
      <div class="d-flex justify-end">
        <VBtn class="mx-2" @click="submitForm" color="warning">Save Draft</VBtn>
        <VBtn @click="resetForm">Submit</VBtn>
      </div>
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

.custom-table {
  border-collapse: collapse;
  inline-size: 100%;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
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
