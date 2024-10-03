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

//----------------------------- Mock Data --------------------------------
const mockData = []

const responsive_id = ['', '', '', '', '', '']
const ordinalNumberMock = [1, 2, 3, 4, 5, 6]
const statusMock = [1, 2, 3, 4, 5, 6]
const pickingGoodDateMock = ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01', '2022-06-01']
const pickingGoodsNumberMock = ['POW001230047', 'POW001230048', 'POW001230049', 'POW001230050', 'POW001230051', 'POW001230052']
const oderDateMock = ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01', '2022-06-01']
const referencesMock = ['POW001230047', 'POW001230048', 'POW001230049', 'POW001230050', 'POW001230051', 'POW001230052']
const vendorCodeMock = ['SRP-000001', 'SRP-000002', 'SRP-000003', 'SRP-000004', 'SRP-000005', 'SRP-000006']
const vendorNameMock = ['SMART REFORM PLUS', 'SMART REFORM PLUS', 'SMART REFORM PLUS', 'SMART REFORM PLUS', 'SMART REFORM PLUS', 'SMART REFORM PLUS']
const deliveryDateMock = ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01', '2022-06-01']
const pickingGoodsByMock = ['HQ-Store', 'HQ-Store', 'HQ-Store', 'HQ-Store', 'HQ-Store', 'HQ-Store']
const buyerByMock = ['Sam Smith', 'Justin Timberlake', 'Ai Green', 'Bruno Mars', 'Adam Levine', 'Katy Perry']
const approvedCancelledByMock = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6']
const approvedCancelledDateMock = ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01', '2022-06-01']
const importMock = [true, false, true, false, true, false]

// สร้างข้อมูลแบบสุ่ม
for (let i = 0; i < responsive_id.length; i++) {
  const dataMock = {
    responsive_id: responsive_id[i],
    ordinal_number: ordinalNumberMock[i],
    status: statusMock[i],
    picking_good_date: pickingGoodDateMock[i],
    picking_goods_number: pickingGoodsNumberMock[i],
    order_date: oderDateMock[i],
    references: referencesMock[i],
    vendor_code: vendorCodeMock[i],
    vendor_name: vendorNameMock[i],
    delivery_date: deliveryDateMock[i],
    picking_goods_by: pickingGoodsByMock[i],
    buyer_by: buyerByMock[i],
    approved_cancelled_by: approvedCancelledByMock[i],
    approved_cancelled_date: approvedCancelledDateMock[i],
    import: importMock[i],
  }

  mockData.push(dataMock)
}

console.log(mockData)

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

const translatedPickingGoodsNumber = ref('')
const translatedPickingGoodsDate = ref('')
const translatedPickingGoodsByTheWarehouse = ref('')
const translatedPickingGoodsType = ref('')
const translatedPickingGoodsTheWarehouse = ref('')
const translatedPickingGoodsBy = ref('')


// ใช้ watchEffect เพื่อให้มั่นใจว่า translatedOrdinalNumber ถูกอัปเดตเมื่อข้อความถูกแปล
watchEffect(() => {
  translatedOrdinalNumber.value = t('Ordinal Number')
  translatedStatus.value = t('Status')
  translatedPickingGoodsNumber.value = t('Picking Goods Number')
  translatedPickingGoodsDate.value = t('Picking Goods Date')
  translatedPickingGoodsByTheWarehouse.value = t('Picking Goods By The Warehouse')
  translatedPickingGoodsType.value = t('Picking Good By')
  translatedReferences.value = t('References')
  translatedVendorCode.value = t('Vendor Code')
  translatedVendorName.value = t('Vendor Name')
  translatedDeliveryDate.value = t('Delivery Date')

  translatedPickingGoodsTheWarehouse.value = t('Picking Goods The Warehouse')

  translatedPickingGoodsBy.value = t('Picking Goods By')
  translatedApprovedCancelledBy.value = t('Approved/Cancelled By')
  translatedApprovedCancelledDate.value = t('Approved/Cancelled Date')
  translatedImport.value = t('Import')
  translatedPickingGoodsType.value = t('Picking Goods Type')
})

const headers = [
  {
    title: '',
    key: 'data-table-expand',
  },
  {
    title: translatedOrdinalNumber,
    key: 'ordinal_number',
  },
  {
    title: translatedStatus,
    key: 'status',
  },
  {
    title: translatedPickingGoodsDate,
    key: 'picking_good_date',
  },
  {
    title: translatedPickingGoodsNumber,
    key: 'picking_goods_number',
  },
  {
    title: translatedOrderDate,
    key: 'order_date',
  },
  {
    title: translatedReferences,
    key: 'references',
  },
  {
    title: translatedVendorCode,
    key: 'vendor_code',
  },
  {
    title: translatedVendorName,
    key: 'vendor_name',
  },
  {
    title: translatedDeliveryDate,
    key: 'delivery_date',
  },
  {
    title: translatedPickingGoodsBy,
    key: 'picking_goods_by',
  },
  {
    title: translatedBuyer,
    key: 'buyer_by',
  },
  {
    title: translatedApprovedCancelledBy,
    key: 'approved_cancelled_by',
  },
  {
    title: translatedApprovedCancelledDate,
    key: 'approved_cancelled_date',
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
      text: 'Product Receipt Completed',
    }
  else if (status === 2)
    return {
      color: 'success',
      text: 'Approved',
    }
  else if (status === 3)
    return {
      color: 'error',
      text: 'Canceled',
    }
  else if (status === 4)
    return {
      color: 'warning',
      text: 'Waiting for Approval',
    }
  else if (status === 5)
    return {
      color: 'red-lighten-1',
      text: 'Product Receipt Cancel',
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
        {{ $t("Picking Goods Delivery List") }}
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
              :to="{ name: 'importData-importDeliveryNote-importPurchaseOrderDelivery' }"
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
          :items="mockData"
          :items-per-page="5"
          expanded
        >
          <!-- Expanded Row Data -->

          <template #expanded-row="slotProps">
            <tr class="pa-4">
              <th />
              <th />
              <th />
              <th class="text-uppercase">
                {{ $t('Barcode') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Product Code') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Product Name') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Counting Unit') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Picking Goods By The Warehouse') }}
              </th>
              <th class="text-uppercase">
                {{ $t('Picking Goods Quantity') }}
              </th>
              <th />
              <th />
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
                City:
              </td>
              <td>
                Experience: 
              </td>
              <td>
                Post:
              </td>
              <td>
                Experience:
              </td>
              <td>
                Post: {{ slotProps.item.value.status }}
              </td>
              <td>
                -
              </td>
              <td />
            </tr>
          </template>      

          <!-- full name -->

          
          
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
              v-model="item.raw.import"
              :value="selected"
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
