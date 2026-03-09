<!-- ============================================================
  PackingDeclarationTab.vue
  Matches Image 5:
  1. Date (right), REF NO. (left)
  2. "TO : WHOM IT MAY CONCERN,"
  3. Title "PACKING DECLARATION (THERE IS NO WOOD...)"
  4. Table: DESC OF GOODS | PACKAGE | NET WEIGHT | GROSS WEIGHT
  5. Bottom: INVOICE NO / NAME OF VESSEL / DATE OF SHIPMENT / B/L NO
============================================================ -->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- Date (right aligned) -->
      <div class="text-center mb-2">
        <span>{{ formData.date || '—' }}</span>
      </div>

      <!-- REF NO -->
      <div class="d-flex align-center mb-4">
        <span class="text-body-2 font-weight-bold mr-3">REF NO. :</span>
        <v-text-field v-if="!isReadonly" :model-value="formData.refNo" variant="outlined" density="compact"
          hide-details style="max-width: 120px" @update:model-value="(v) => updateField('refNo', v)" />
        <span v-else>{{ formData.refNo }}</span>
      </div>

      <!-- TO -->
      <p class="text-body-2 mb-3">TO : WHOM IT MAY CONCERN,</p>

      <!-- Title -->
      <div class="text-center mb-6">
        <h2 class="text-h6 font-weight-bold">PACKING DECLARATION</h2>
        <p class="text-body-2">(THERE IS NO WOOD IN THE CONTAINER)</p>
      </div>

      <!-- Items Table -->
      <div class="mb-6">
        <v-table density="compact">
          <thead>
            <tr class="bg-grey-lighten-4">
              <th style="width:35%">DESCRIPTION OF GOODS OR ITEM NO.</th>
              <th style="width:25%">PACKAGE</th>
              <th class="text-right" style="width:20%">NET WEIGHT (KGS)</th>
              <th class="text-right" style="width:20%">GROSS WEIGHT (KGS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-3">
                <InputOrText :readonly="isReadonly" :value="formData.descriptionOfGoods"
                  @input="(v) => updateField('descriptionOfGoods', v)" />
              </td>
              <td class="py-3">
                <!-- Package Type (DRUM) -->
                <v-select v-if="!isReadonly" :model-value="formData.packageType" :items="['DRUM','CARTON','BAG','PALLET']"
                  variant="outlined" density="compact" hide-details class="mb-2"
                  @update:model-value="(v) => updateField('packageType', v)" />
                <v-chip v-else color="amber-lighten-4" variant="flat" size="small" class="mb-2">{{ formData.packageType }}</v-chip>

                <!-- Dimensions -->
                <v-text-field v-if="!isReadonly" :model-value="formData.packageDimensions" variant="outlined"
                  density="compact" hide-details placeholder="(517MMx571×887MM)"
                  @update:model-value="(v) => updateField('packageDimensions', v)" />
                <span v-else class="text-body-2">({{ formData.packageDimensions }})</span>
              </td>
              <td class="text-right py-3">
                <v-chip color="amber-lighten-4" variant="flat" size="small">
                  {{ formatNum(formData.netWeight) }} {{ formData.netWeightUnit }}<br>
                  (TOTAL = {{ formData.totalDrums }} DRUMS)
                </v-chip>
              </td>
              <td class="text-right py-3">
                <v-chip color="amber-lighten-5" variant="flat" size="small">
                  {{ formatNum(formData.grossWeight) }} {{ formData.grossWeightUnit }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <!-- Shipment Reference -->
      <div class="section-card">
        <FieldRow label="INVOICE NO :" class="mb-3">
          <v-chip v-if="isReadonly" color="amber-lighten-4" variant="flat" size="small">{{ formData.invoiceNo }}</v-chip>
          <v-text-field v-else :model-value="formData.invoiceNo" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('invoiceNo', v)" />
        </FieldRow>
        <FieldRow label="NAME OF VESSEL :" class="mb-3">
          <v-chip v-if="isReadonly" color="amber-lighten-4" variant="flat" size="small">{{ formData.vesselName }}</v-chip>
          <v-text-field v-else :model-value="formData.vesselName" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('vesselName', v)" />
        </FieldRow>
        <FieldRow label="DATE OF SHIPMENT :" class="mb-3">
          <v-chip v-if="isReadonly" color="amber-lighten-4" variant="flat" size="small">{{ formData.dateOfShipment }}</v-chip>
          <v-text-field v-else :model-value="formData.dateOfShipment" type="date" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('dateOfShipment', v)" />
        </FieldRow>
        <FieldRow label="B/L NO. :">
          <v-text-field v-if="!isReadonly" :model-value="formData.blNo" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('blNo', v)" />
          <span v-else>{{ formData.blNo }}</span>
        </FieldRow>
      </div>
    </div>

    <TabActionBar :tab-key="TabKey.PACKING_DECLARATION" :is-loading="isLoading" :is-dirty="isDirty"
      @print="handlePrint" @save-draft="saveDraft" @confirm="confirm" />
  </div>
</template>

<script setup>
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import TabActionBar from '../shared/TabActionBar.vue'
import FieldRow from '../shared/FieldRow.vue'
import InputOrText from '../shared/InputOrText.vue'

const store = useShipDocumentStore()
const { formData, isDirty, isLoading, isReadonly, updateField, saveDraft, confirm } =
  useTabForm(TabKey.PACKING_DECLARATION, {
    onSaveDraft: (d) => tabApiMap[TabKey.PACKING_DECLARATION].save(store.documentId, d),
    onConfirm: (d) => tabApiMap[TabKey.PACKING_DECLARATION].confirm(store.documentId, d),
  })
const { print: handlePrint } = usePrint(TabKey.PACKING_DECLARATION)

function formatNum(n) {
  return n != null ? Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
}
</script>

<style scoped>
.tab-page { display: flex; flex-direction: column; min-height: 100%; }
.tab-content { flex: 1; padding: 24px 48px; background: #fff; }
.section-card { padding: 16px 0; }
</style>
