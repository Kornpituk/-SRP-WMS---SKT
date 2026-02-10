<template>
  <thead class="">
    <tr>
      <!-- Checkbox column (hidden by default) -->
      <th
        v-if="showCheckboxColumn"
        style="width: 60px;"
        class="sticky-column"
      >
        <VCheckbox
          v-if="showCheckbox"
          :model-value="isSelectAll"
          :indeterminate="isIndeterminate"
          @update:model-value="$emit('toggleSelectAll')"
        />
      </th>
      
      <!-- Empty column for spacing -->
      <th
        style="width: 60px;"
        class="sticky-column"
      />
      
      <!-- Number column -->
      <th
        scope="row"
        class="sticky-column text-center px-1"
      >
        <span style="font-weight: bold;">{{ $t('No.') }}</span>
      </th>
      
      <!-- Status column -->
      <th class="sticky-column text-center">
        <span style="font-weight: bold;">{{ $t('Status') }}</span>
      </th>
      
      <!-- Sale Order No. column -->
      <th
        v-if="showColumn('COL_SALE_ORDER_NO')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Sale Order No.') }}</span>
          <SortIcon
            column="salesOrderNo"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'salesOrderNo')"
          />
        </div>
      </th>
      
      <!-- SO attachment column -->
      <th
        v-if="showColumn('COL_SO_ATTACHMENT')"
        class="text-center"
      >
        <span style="font-weight: bold;">{{ $t('SO attachment') }}</span>
      </th>
      
      <!-- PO No. column -->
      <th
        v-if="showColumn('COL_SO_ATTACHMENT')"
        class="text-start"
      >
        <span style="font-weight: bold;">{{ $t('PO No.') }}</span>
      </th>
      
      <!-- PO attachment column -->
      <th
        v-if="showColumn('COL_SO_ATTACHMENT')"
        class="text-center"
      >
        <span style="font-weight: bold;">{{ $t('PO attachment') }}</span>
      </th>
      
      <!-- SAP Invoice no column -->
      <th
        v-if="showColumn('COL_SAP_INVOICE_NO')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('SAP Invoice no') }}</span>
          <SortIcon
            column="sapInvoiceNo"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'sapInvoiceNo')"
          />
        </div>
      </th>
      
      <!-- Payer Name column -->
      <th
        v-if="showColumn('COL_PAYER_NAME')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Payer Name') }}</span>
          <SortIcon
            column="payerName"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'payerName')"
          />
        </div>
      </th>
      
      <!-- User column -->
      <th
        v-if="showColumn('COL_USER')"
        class="px-2"
      >
        <span style="font-weight: bold;">{{ $t('User') }}</span>
      </th>
      
      <!-- Shipper column -->
      <th
        v-if="showColumn('COL_SHIPPER')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Shipper') }}</span>
          <SortIcon
            column="shipper"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'shipper')"
          />
        </div>
      </th>
      
      <!-- Shipper location column -->
      <th
        v-if="showColumn('COL_SHIPPER_LOCATION')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Shipper location') }}</span>
          <SortIcon
            column="shipperLocation"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'shipperLocation')"
          />
        </div>
      </th>
      
      <!-- Shipping Mark/Cond. column -->
      <th
        v-if="showColumn('COL_SHIPPING_MARK')"
        class="text-start px-2"
      >
        <div>
          <span style="font-weight: bold;">
            {{ $t('Shipping Mark/Cond.') }}
          </span>
        </div>
      </th>
      
      <!-- End User column -->
      <th
        v-if="showColumn('COL_END_USER')"
        class="text-start px-2"
      >
        <span style="font-weight: bold;">{{ $t('End User') }}</span>
      </th>
      
      <!-- Consignee column -->
      <th
        v-if="showColumn('COL_CONSIGNEE')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Consignee') }}</span>
          <SortIcon
            column="consignee"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'consignee')"
          />
        </div>
      </th>
      
      <!-- Item Name column -->
      <th
        v-if="showColumn('COL_PRODUCT')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Item Name') }}</span>
          <SortIcon
            column="itemName"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'itemName')"
          />
        </div>
      </th>
      
      <!-- Lot column -->
      <th
        v-if="showColumn('COL_LOT_NUMBER')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Lot') }}</span>
          <SortIcon
            column="lot"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'lot')"
          />
        </div>
      </th>
      
      <!-- Qty. (Kg.) column -->
      <th
        v-if="showColumn('COL_QTY_KG')"
        class="text-end px-2"
      >
        <div class="d-flex align-center justify-end">
          <span style="font-weight: bold;">{{ $t('Qty. (Kg.)') }}</span>
          <SortIcon
            column="quantity"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'quantity')"
          />
        </div>
      </th>
      
      <!-- COA column -->
      <th
        v-if="showColumn('COL_COA')"
        class="text-center"
      >
        <span style="font-weight: bold;">{{ $t('COA') }}</span>
      </th>
      
      <!-- Freight forwarder column -->
      <th
        v-if="showColumn('COL_FREIGHT_FORWARDER')"
        class="bg-green-lighten-3"
      >
        <div class="d-flex align-center">
          <span
            style="font-weight: bold;"
            class="text-black"
          >{{ $t('Freight forwarder') }}</span>
          <SortIcon
            column="freightForwarder"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'freightForwarder')"
          />
        </div>
      </th>
      
      <!-- Carrier column -->
      <th
        v-if="showColumn('COL_CARRIER')"
        class="bg-green-lighten-3 text-start"
        style="min-width: 150px;"
      >
        <div class="d-flex align-center">
          <span
            style="font-weight: bold;"
            class="text-start"
          >{{ $t('Carrier') }}</span>
          <SortIcon
            column="carrier"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'carrier')"
          />
        </div>
      </th>
      
      <!-- Vessel name column -->
      <th
        v-if="showColumn('COL_VESSEL_NAME')"
        class="bg-green-lighten-3"
      >
        <div class="d-flex align-center">
          <span
            style="font-weight: bold;"
            class="text-black"
          >{{ $t('Vessel name') }}</span>
          <SortIcon
            column="vesselName"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'vesselName')"
          />
        </div>
      </th>
      
      <!-- Voy column -->
      <th
        v-if="showColumn('COL_VOY')"
        class="bg-yellow-lighten-3"
      >
        <div class="d-flex align-center">
          <span
            style="font-weight: bold;"
            class="text-black"
          >{{ $t('Voy') }}</span>
          <SortIcon
            column="voy"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'voy')"
          />
        </div>
      </th>
      
      <!-- Truck column -->
      <th
        v-if="showColumn('COL_TRUCK')"
        class="bg-green-lighten-3"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Truck') }}</span>
          <SortIcon
            column="truck"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'truck')"
          />
        </div>
      </th>
      
      <!-- Truck Reserving Number column -->
      <th
        v-if="showColumn('COL_TRUCK_RESERVING_NUMBER')"
        class="bg-yellow-lighten-3 text-end"
      >
        <div class="d-flex align-center justify-end">
          <span style="font-weight: bold;">{{ $t('Truck Reserving Number') }}</span>
          <SortIcon
            column="truckReservingNumber"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'truckReservingNumber')"
          />
        </div>
      </th>
      
      <!-- Truck fee column -->
      <th
        v-if="showColumn('COL_TRUCK_FEE')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Truck fee') }}</span>
          <SortIcon
            column="truckFee"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'truckFee')"
          />
        </div>
      </th>
      
      <!-- Truck Order column -->
      <th
        v-if="showColumn('COL_TRUCK_ORDER')"
        class="text-center"
      >
        <span style="padding-left: 1px; font-weight: bold;">{{ $t('Truck Order') }}</span>
      </th>
      
      <!-- DO/EX column -->
      <th
        v-if="showColumn('COL_DO_EX')"
        class="px-4"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('DO/EX') }}</span>
          <SortIcon
            column="doEx"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'doEx')"
          />
        </div>
      </th>
      
      <!-- Country column -->
      <th
        v-if="showColumn('COL_COUNTRY')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Country') }}</span>
          <SortIcon
            column="country"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'country')"
          />
        </div>
      </th>
      
      <!-- Loading date column -->
      <th
        v-if="showColumn('COL_LOADING_DATE')"
        class="text-start px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Loading date') }}</span>
          <SortIcon
            column="logUpdatedDate"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'logUpdatedDate')"
          />
        </div>
      </th>
      
      <!-- ETD column -->
      <th
        v-if="showColumn('COL_ETD')"
        class="text-start px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('ETD') }}</span>
          <div class="d-flex align-center mx-2">
            <SortIcon
              column="etd"
              :current-column="sortColumn"
              :direction="sortDirection"
              @click="$emit('toggleDirection', 'etd')"
            />
            <VIcon
              size="20"
              icon="ri-calendar-todo-fill"
              class="mx-1"
            />
          </div>
        </div>
      </th>
      
      <!-- ETA column -->
      <th
        v-if="showColumn('COL_ETA')"
        class="text-start px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('ETA') }}</span>
          <div class="d-flex align-center mx-2">
            <SortIcon
              column="eta"
              :current-column="sortColumn"
              :direction="sortDirection"
              @click="$emit('toggleDirection', 'eta')"
            />
            <VIcon
              size="20"
              icon="ri-calendar-todo-fill"
              class="mx-1"
            />
          </div>
        </div>
      </th>
      
      <!-- Delivery note column -->
      <th
        v-if="showColumn('COL_DELIVERY_NOTE')"
        class="text-center"
      >
        <span style="font-weight: bold;">{{ $t('Delivery note') }}</span>
      </th>
      
      <!-- Remark (SAL) column -->
      <th
        v-if="showColumn('COL_REMARK_SAL')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Remark (SAL)') }}</span>
          <SortIcon
            column="saL_Remarks"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'saL_Remarks')"
          />
        </div>
      </th>
      
      <!-- Remark (WH) column -->
      <th
        v-if="showColumn('COL_REMARK_WH')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Remark (WH)') }}</span>
          <SortIcon
            column="wH_Remarks"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'wH_Remarks')"
          />
        </div>
      </th>
      
      <!-- Remark (LOG) column -->
      <th
        v-if="showColumn('COL_REMARK_LOG')"
        class="px-2"
      >
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Remark (LOG)') }}</span>
          <SortIcon
            column="loG_Remarks"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'loG_Remarks')"
          />
        </div>
      </th>
      
      <!-- Updated By column -->
      <th class="px-1">
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Updated By') }}</span>
          <SortIcon
            column="updatedBy"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'updatedBy')"
          />
        </div>
      </th>
      
      <!-- Updated Date column -->
      <th class="px-1">
        <div class="d-flex align-center">
          <span style="font-weight: bold;">{{ $t('Updated Date') }}</span>
          <SortIcon
            column="updatedDate"
            :current-column="sortColumn"
            :direction="sortDirection"
            @click="$emit('toggleDirection', 'updatedDate')"
          />
        </div>
      </th>
      
      <!-- Save Draft button column -->
      <th
        v-if="showColumn('BTN_SAVE_DRAFT')"
        class="text-center"
      >
        <span style="font-weight: bold;" />
      </th>
      
      <!-- Action column -->
      <th class="text-center">
        <span style="font-weight: bold;">{{ $t('Action') }}</span>
      </th>
      
      <!-- Submit button column -->
      <th
        v-if="showColumn('BTN_SUBMIT')"
        class="text-center"
      >
        <span style="font-weight: bold;" />
      </th>
      
      <!-- Hidden Action column (for development) -->
      <th
        v-if="false"
        class="sticky-action"
      >
        <span style="font-weight: bold;">{{ $t('Action') }}</span>
      </th>
    </tr>
  </thead>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import SortIcon from './SortIcon.vue'

const props = defineProps({
  sortColumn: {
    type: String,
    default: '',
  },
  sortDirection: {
    type: String,
    default: 'desc',
  },
  isSelectAll: {
    type: Boolean,
    default: false,
  },
  isIndeterminate: {
    type: Boolean,
    default: false,
  },
  userDataInfo: {
    type: Object,
    required: true,
  },
  statusPermission: {
    type: Object,
    required: true,
  },
  canVisibleUserPermission: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['toggleDirection', 'toggleSelectAll'])

// Computed properties
const showCheckbox = computed(() => {
  return props.userDataInfo.id === '00023' || 
         props.userDataInfo.id === '00025' || 
         props.canVisibleUserPermission(props.statusPermission, 'BTN_APPROVE').canVisible
})

const showCheckboxColumn = computed(() => {
  // Return true if checkbox column should be shown (even if hidden by v-if="false" in original)
  return false // Based on original code v-if="false"
})

// Helper function to check column visibility
const showColumn = permissionKey => {
  return props.canVisibleUserPermission(props.statusPermission, permissionKey).canVisible
}
</script>

<style scoped>
.sticky-column {
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: inherit;
}

.sticky-action {
  position: sticky;
  right: 0;
  z-index: 2;
  background-color: inherit;
}

.bg-green-lighten-3 {
  background-color: #c8e6c9;
}

.bg-yellow-lighten-3 {
  background-color: #fff9c4;
}

.text-black {
  color: rgba(0, 0, 0, 0.87);
}
</style>
