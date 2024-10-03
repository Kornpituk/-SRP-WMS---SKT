<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
import { avatarText } from '@/@core/utils/formatters'
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
    ordinalNumber: 95,
    approvedCancelledBy: avatar2,
    vendorName: 'Edwina Ebsworth',
    deliveryDate: 'Human Resources Assistant',
    buyer: 'eebsworth2m@sbwire.com',
    orderedByTheWarehouse: 'Puzi',
    startDate: '09/27/2018',
    references: 19586.23,
    vendorCode: '27',
    orderDate: '2 Years',
    status: 1,
    approvedCancelledDate: 'asdasdsad',
    import: 'GGWP1',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 1,
    approvedCancelledBy: avatar8,
    vendorName: 'Korrie O\'Crevy',
    deliveryDate: 'Nuclear Power Engineer',
    buyer: 'kocrevy0@thetimes.co.uk',
    orderedByTheWarehouse: 'Krasnosilka',
    startDate: '09/23/2016',
    references: 23896.35,
    vendorCode: '61',
    orderDate: '1 Year',
    status: 2,
    approvedCancelledDate: 'asdasdsad',
    import: 'GGWP2',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 7,
    approvedCancelledBy: '',
    vendorName: 'Eileen Diehn',
    deliveryDate: 'Environmental Specialist',
    buyer: 'ediehn6@163.com',
    orderedByTheWarehouse: 'Lampuyang',
    startDate: '10/15/2017',
    references: 18991.67,
    vendorCode: '59',
    orderDate: '9 Years',
    status: 3,
    approvedCancelledDate: 'asdasdsad',
    import: 'GGWP3',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 11,
    approvedCancelledBy: '',
    vendorName: 'De Falloon',
    deliveryDate: 'Sales Representative',
    buyer: 'dfalloona@ifeng.com',
    orderedByTheWarehouse: 'Colima',
    startDate: '06/12/2018',
    references: 19252.12,
    vendorCode: '30',
    orderDate: '0 Year',
    status: 4,
    approvedCancelledDate: 'asdasdsad',
    import: 'GGWP4',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 3,
    approvedCancelledBy: avatar7,
    vendorName: 'Stella Ganderton',
    deliveryDate: 'Operator',
    buyer: 'sganderton2@tuttocitta.it',
    orderedByTheWarehouse: 'Golcowa',
    startDate: '03/24/2018',
    references: 13076.28,
    vendorCode: '66',
    orderDate: '6 Years',
    status: 5,
    approvedCancelledDate: 'asdasdsad',
    import: 'GGWP5',
  },
  {
    responsive_ordinalNumber: '',
    ordinalNumber: 5,
    approvedCancelledBy: '',
    vendorName: 'Harmonia Nisius',
    deliveryDate: 'Senior Cost Accountant',
    buyer: 'hnisius4@gnu.org',
    orderedByTheWarehouse: 'Lucan',
    startDate: '08/25/2017',
    references: 10909.52,
    vendorCode: '33',
    orderDate: '3 Years',
    status: 2,
    approvedCancelledDate: 'asdasdsad',
    import: 'GGWP6',
  },
]

const { t } = useI18n()

const translatedOrdinalNumber = ref('')
const translatedStatus = ref('')
const translatedStartDate = ref('')
const translatedOrderDate = ref('')
const translatedReferences = ref('')
const translatedVendorCode = ref('')
const translatedVendorName = ref('')
const translatedDeliveryDate = ref('')
const translatedOrderedByTheWarehouse = ref('')
const translatedBuyer = ref('')
const translatedApprovedCancelledBy = ref('')
const translatedApprovedCancelledDate = ref('')
const translatedImport = ref('')


// ใช้ watchEffect เพื่อให้มั่นใจว่า translatedOrdinalNumber ถูกอัปเดตเมื่อข้อความถูกแปล
watchEffect(() => {
  translatedOrdinalNumber.value = t('Ordinal Number')
  translatedStatus.value = t('Status')
  translatedStartDate.value = t('Start date')
  translatedOrderDate.value = t('Order Date')
  translatedReferences.value = t('References')
  translatedVendorCode.value = t('Vendor Code')
  translatedVendorName.value = t('Vendor Name')
  translatedDeliveryDate.value = t('Delivery Date')
  translatedOrderedByTheWarehouse.value = t('Ordered By The Warehouse')
  translatedBuyer.value = t('Buyer')
  translatedApprovedCancelledBy.value = t('Approved/Cancelled By')
  translatedApprovedCancelledDate.value = t('Approved/Cancelled Date')
  translatedImport.value = t('Import')
})

const headers = [
  {
    title: translatedOrdinalNumber,
    key: 'ordinalNumber',
  },
  {
    title: '',
    key: 'data-table-expand',
  },
  {
    title: translatedStatus,
    key: 'status',
  },
  {
    title: translatedStartDate,
    key: 'startDate',
  },
  {
    title: translatedOrderDate,
    key: 'orderDate',
  },
  {
    title: translatedReferences,
    key: 'references',
  },
  {
    title: translatedVendorCode,
    key: 'vendorCode',
  },
  {
    title: translatedVendorName,
    key: 'vendorName',
  },
  {
    title: translatedDeliveryDate,
    key: 'deliveryDate',
  },
  {
    title: translatedOrderedByTheWarehouse,
    key: 'orderedByTheWarehouse',
  },
  {
    title: translatedBuyer,
    key: 'buyer',
  },
  {
    title: translatedApprovedCancelledBy,
    key: 'approvedCancelledBy',
  },
  {
    title: translatedApprovedCancelledDate,
    key: 'approvedCancelledDate',
  },
  {
    title: translatedImport,
    key: 'import',
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

//---------------------------- check Import ----------------------
const selected = ref([])

watch(() => {
  console.log('Import', selected.value)
})

//-----------------------------------------------------------
import { urlApi } from '@/api'
import axiosIns from '@axios'
</script>

<template>
  <!-- ----------------        Label Page | Back           ------------------------------------ -->
  <section>
    <!-- Tag page back / Search / Btn -->
    <VRow>
      <VCol
        col="12"
        sm="12"
        md="2"
        lg="8"
      >
        <RouterLink :to="{ name: 'dashboards-main' }">
          <IconBtn>
            <VIcon
              icon="
                mdi-chevron-left"
            />
          </IconBtn>
        </RouterLink>
        {{ $t("Purchase Order List") }}
      </VCol>
      <VCol
        cols="12"
        sm="12"
        md="12"
        lg="4"
        class="d-flex justify-center justify-lg-end justify-sm-end"
      >
        <VRow class="d-flex justify-end">
          <!-- Btn Print Barcode -->
          <VCol
            class="d-flex justify-end justify-lg-start"
            sm="6"
            cols="12"
            lg="8"
          >
            <!-- Btn Print Barcode -->

            <VBtn
              color="warning"
              style="width: 100%;"
              @click="onClickExportExcel"
            >
              <template #prepend>
                <img
                  src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                  style="width: auto;"
                  class="custom-small-img"
                > 
              </template>
              <span>{{ $t('Download Template') }}</span>
            </VBtn>
          </VCol>
          <!-- Btn Add -->
          <VCol
            sm="6"
            lg="4"
            cols="12"
          >
            <!-- Btn Add -->
            <VBtn
              :to="{ name: 'importData-importPurchaseOrder-importPurchaseOrder' }"
              color="primary"
              prepend-icon="mdi-plus"
              style="width: 100%;"
            >
              <template #prepend>
                <VIcon color="white" />
              </template>
              <span class="text-white">{{ $t('Add') }}</span>
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
    <!-- Tag page back / Search / Btn -->
    <VRow />
  </section>

  <!-- Date -->
  <section>
    <VRow>
      <VCol
        cols="12"
        lg="6"
      >
        <VCard class="mt-4 d-flex align-center">
          <VCardText class="pa-1 px-4">
            <VRow>
              <VCol
                cols="12"
                lg="7"
              >
                <VRow>
                  <VCol
                    cols="12"
                    sm="4"
                    lg="6"
                    class="d-flex align-center"
                  >
                    <span>{{ $t('Purchase Order Date') }}</span>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="8"
                    lg="6"
                  >
                    <AppDateTimePicker
                      v-model="datest"
                      :config="{ dateFormat: 'd/m/Y' }"
                      density="compact"
                      :label="$t('Date')"
                      append-inner-icon="mdi-calendar-range"
                    />
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                cols="12"
                lg="5"
              >
                <VRow>
                  <VCol
                    cols="12"
                    lg="2"
                    sm="4"
                    class="d-flex align-center"
                  >
                    {{ $t('to') }}
                  </VCol>
                  <VCol
                    cols="12"
                    lg="8"
                    sm="8"
                  >
                    <AppDateTimePicker
                      v-model="datest"
                      :config="{ dateFormat: 'd/m/Y' }"
                      density="compact"
                      :label="$t('Date')"
                      append-inner-icon="mdi-calendar-range"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>

  <!-- Table -->
  <section>
    <VCard class="mt-8">
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="data"
          :items-per-page="5"
          density="compact"
          expanded
        >
          <!-- Expanded Row Data -->

          <template #expanded-row="slotProps">
            <tr class="pa-4">
              <th />
              <th />
              <th />
              <th class="text-uppercase">
                {{ $t('Product Code') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Product Name') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Quantity') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Counting Unit') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Unit price') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Discount') }}
              </th>
              <th />
              <th />
              <th />
              <th />
              <th />
            </tr>
            <tr>
              <td />
              <td />
              <td />
              <td>
                City: {{ slotProps.item.raw.city }}
              </td>
              <td>
                Experience: {{ slotProps.item.raw.experience }}
              </td>
              <td>
                Post: {{ slotProps.item.raw.post }}
              </td>
              <td>
                Experience: {{ slotProps.item.raw.start_date }}
              </td>
              <td>
                Post: {{ slotProps.item.raw.age }}
              </td>
              <td>
                -
              </td>
              <td />
            </tr>
          </template>      

          <template #item.status="{ item }">
            <VChip
              :color="resolveStatusVariant(item.raw.status).color"
              class="font-weight-medium"
              size="small"
            >
              {{ resolveStatusVariant(item.raw.status).text }}
            </VChip>
          </template>

          <template #item.import="{ item }">
            <VCheckbox
              v-model="selected"
              :value="item.raw.import"
            />
          </template>
        </VDataTable>
      </VCardText>
      <VCardText />
    </VCard>
  </section>

  <!-- Mock Data Label -->
  <section class="py-4">
    <VCard class="bg-red-lighten-5">
      <VCardText>
        <VIcon
          icon="mdi-file-table-box-multiple"
          class="custom-small-img"
        />
        <span>!Mock Data</span>
      </VCardText>
    </VCard>
  </section>
</template>
