<!-- ============================================================
  PackingListTab.vue
  Layout matches screenshots Image 3 (edit) / Image 6 (confirmed)
  
  Sections:
  1. Title "PACKING LIST"
  2. Date / Invoice No / (C-No) / PO No / Proforma Invoice No
  3. Payer | Consignee | Payment + Due Date
  4. Feeder/Vessel/ETD + From/To/ETA
  5. Items table (MARKS & NOS | DESC | PACKAGE | NET | GROSS)
  6. Footer (Packing / Country / Maker / Packaging / Lot No)
============================================================ -->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- ===== Title ===== -->
      <div class="text-center py-4">
        <h2 class="text-h6 font-weight-bold">PACKING LIST</h2>
      </div>

      <!-- ===== Section: Date & References ===== -->
      <div class="section-card">
        <v-row dense>
          <v-col cols="12">
            <FieldRow label="Date">
              <v-text-field v-if="!isReadonly" :model-value="formData.date" type="date" variant="outlined"
                density="compact" hide-details @update:model-value="(v) => updateField('date', v)" />
              <span v-else>{{ formData.date }}</span>
            </FieldRow>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="5">
            <FieldRow label="INVOICE NO. :">
              <v-text-field v-if="!isReadonly" :model-value="formData.invoiceNo" variant="outlined"
                density="compact" hide-details @update:model-value="(v) => updateField('invoiceNo', v)" />
              <span v-else>{{ formData.invoiceNo }}</span>
            </FieldRow>
          </v-col>
          <v-col cols="3">
            <FieldRow label="">
              <v-text-field v-if="!isReadonly" :model-value="formData.contractNo" variant="outlined"
                density="compact" hide-details placeholder="(C-No)" @update:model-value="(v) => updateField('contractNo', v)" />
              <span v-else>({{ formData.contractNo }})</span>
            </FieldRow>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="8">
            <FieldRow label="PO NO :">
              <v-text-field v-if="!isReadonly" :model-value="formData.poNo" variant="outlined"
                density="compact" hide-details @update:model-value="(v) => updateField('poNo', v)" />
              <span v-else>{{ formData.poNo }}</span>
            </FieldRow>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="8">
            <FieldRow label="PROFORMA INVOICE NO. :">
              <v-text-field v-if="!isReadonly" :model-value="formData.proformaInvoiceNo" variant="outlined"
                density="compact" hide-details @update:model-value="(v) => updateField('proformaInvoiceNo', v)" />
              <span v-else>{{ formData.proformaInvoiceNo }}</span>
            </FieldRow>
          </v-col>
        </v-row>
      </div>

      <!-- ===== Section: Payer / Consignee / Payment ===== -->
      <div class="section-card">
        <v-row>
          <v-col cols="12" md="4">
            <div class="text-caption font-weight-bold mb-1">Payer :</div>
            <PartyInfoFields :party="formData.payer" :readonly="isReadonly"
              @update="(v) => updateField('payer', v)" />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption font-weight-bold mb-1">Consignee :</div>
            <PartyInfoFields :party="formData.consignee" :readonly="isReadonly"
              @update="(v) => updateField('consignee', v)" />
          </v-col>
          <v-col cols="12" md="4">
            <FieldRow label="Payment :">
              <v-select v-if="!isReadonly" :model-value="formData.payment" :items="['T/T in advance','L/C','D/P','D/A']"
                variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('payment', v)" />
              <span v-else>{{ formData.payment }}</span>
            </FieldRow>
            <FieldRow label="Due Date :" class="mt-3">
              <v-text-field v-if="!isReadonly" :model-value="formData.dueDate" type="date" variant="outlined"
                density="compact" hide-details @update:model-value="(v) => updateField('dueDate', v)" />
              <span v-else>{{ formData.dueDate }}</span>
            </FieldRow>
          </v-col>
        </v-row>
      </div>

      <!-- ===== Section: Shipping Info ===== -->
      <div class="section-card">
        <v-row dense>
          <v-col cols="3"><FieldRow label="Feeder :">
            <v-text-field v-if="!isReadonly" :model-value="formData.feeder" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('feeder', v)" />
            <span v-else>{{ formData.feeder }}</span>
          </FieldRow></v-col>
          <v-col cols="4"><FieldRow label="Vessel :">
            <v-text-field v-if="!isReadonly" :model-value="formData.vessel" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('vessel', v)" />
            <span v-else>{{ formData.vessel }}</span>
          </FieldRow></v-col>
          <v-col cols="2"><FieldRow label="ETD :">
            <v-text-field v-if="!isReadonly" :model-value="formData.etd" type="date" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('etd', v)" />
            <span v-else>{{ formData.etd }}</span>
          </FieldRow></v-col>
        </v-row>
        <v-row dense class="mt-1">
          <v-col cols="3"><FieldRow label="From :">
            <v-autocomplete v-if="!isReadonly" :model-value="formData.from" :items="ports" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('from', v)" />
            <span v-else>{{ formData.from }}</span>
          </FieldRow></v-col>
          <v-col cols="4"><FieldRow label="To :">
            <v-autocomplete v-if="!isReadonly" :model-value="formData.to" :items="ports" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('to', v)" />
            <span v-else>{{ formData.to }}</span>
          </FieldRow></v-col>
          <v-col cols="2"><FieldRow label="ETA:">
            <v-text-field v-if="!isReadonly" :model-value="formData.eta" type="date" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('eta', v)" />
            <span v-else>{{ formData.eta }}</span>
          </FieldRow></v-col>
        </v-row>
      </div>

      <!-- ===== Section: Items Table ===== -->
      <div class="section-card pa-0">
        <v-table density="compact">
          <thead>
            <tr class="bg-grey-lighten-4">
              <th class="text-left" style="width:22%">MARKS & NOS</th>
              <th class="text-left" style="width:28%">DESCRIPTION OF GOODS</th>
              <th class="text-left" style="width:22%">PACKAGE</th>
              <th class="text-right" style="width:14%">NET WEIGHT (KGS)</th>
              <th class="text-right" style="width:14%">GROSS WEIGHT (KGS)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in formData.items" :key="item.id">
              <td class="py-3">
                <div>{{ item.marksAndNos }}</div>
              </td>
              <td class="py-3">
                <div>{{ item.descriptionOfGoods }}</div>
                <div class="text-grey-darken-1">({{ item.subDescription }})</div>
              </td>
              <td class="py-3">
                <div>{{ item.package }}</div>
                <div class="text-grey-darken-1">{{ item.packageDetail }}</div>
              </td>
              <td class="text-right py-3">{{ formatNumber(item.netWeight) }}</td>
              <td class="text-right py-3">{{ formatNumber(item.grossWeight) }}</td>
            </tr>
            <tr v-if="!formData.items.length">
              <td colspan="5" class="text-center text-grey py-6">No items</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-grey-lighten-5 font-weight-bold">
              <td colspan="3" class="text-left pa-3">Total</td>
              <td class="text-right pa-3">{{ formatNumber(totalNet) }}</td>
              <td class="text-right pa-3">{{ formatNumber(totalGross) }}</td>
            </tr>
          </tfoot>
        </v-table>
      </div>

      <!-- ===== Section: Footer Info ===== -->
      <div class="section-card">
        <FieldRow label="PACKING :" class="mb-2">
          <v-text-field v-if="!isReadonly" :model-value="formData.packing" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('packing', v)" />
          <span v-else>{{ formData.packing }}</span>
        </FieldRow>
        <FieldRow label="COUNTRY OF ORIGIN :" class="mb-2">
          <v-text-field v-if="!isReadonly" :model-value="formData.countryOfOrigin" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('countryOfOrigin', v)" />
          <span v-else>{{ formData.countryOfOrigin }}</span>
        </FieldRow>
        <FieldRow label="MAKER NAME :" class="mb-2">
          <v-text-field v-if="!isReadonly" :model-value="formData.makerName" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('makerName', v)" />
          <span v-else>{{ formData.makerName }}</span>
        </FieldRow>
        <FieldRow label="PACKAGING :" class="mb-2">
          <v-text-field v-if="!isReadonly" :model-value="formData.packaging" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('packaging', v)" />
          <span v-else>{{ formData.packaging }}</span>
        </FieldRow>
        <FieldRow label="Lot No :">
          <v-text-field v-if="!isReadonly" :model-value="formData.lotNo" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('lotNo', v)" />
          <span v-else>{{ formData.lotNo }}</span>
        </FieldRow>
      </div>
    </div>

    <!-- ===== Action Bar ===== -->
    <TabActionBar :tab-key="TabKey.PACKING_LIST" :is-loading="isLoading" :is-dirty="isDirty"
      @print="handlePrint" @save-draft="saveDraft" @confirm="confirm" />
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import TabActionBar from '../shared/TabActionBar.vue'
import PartyInfoFields from '../shared/PartyInfoFields.vue'
import FieldRow from '../shared/FieldRow.vue'

const store = useShipDocumentStore()

const { formData, isDirty, isLoading, isReadonly, updateField, saveDraft, confirm, getError } =
  useTabForm(TabKey.PACKING_LIST, {
    onSaveDraft: (d) => tabApiMap[TabKey.PACKING_LIST].save(store.documentId, d),
    onConfirm: (d) => tabApiMap[TabKey.PACKING_LIST].confirm(store.documentId, d),
    validate: (d) => {
      const e = {}
      if (!d.date) e.date = ['Date is required']
      if (!d.invoiceNo) e.invoiceNo = ['Invoice No. is required']
      return Object.keys(e).length ? e : null
    },
  })

const { print: handlePrint } = usePrint(TabKey.PACKING_LIST)

const totalNet = computed(() => formData.value.items.reduce((s, i) => s + (i.netWeight || 0), 0))
const totalGross = computed(() => formData.value.items.reduce((s, i) => s + (i.grossWeight || 0), 0))

function formatNumber(n) {
  return n != null ? Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
}

const ports = ['LAEM CHABANG, THAILAND', 'HCM CITY, VIETNAM', 'HAIPHONG, VIETNAM', 'BANGKOK, THAILAND']
</script>

<style scoped>
.tab-page { display: flex; flex-direction: column; min-height: 100%; }
.tab-content { flex: 1; padding: 0 24px 24px; }
.section-card { background: #fff; border-radius: 4px; padding: 16px 24px; margin-bottom: 16px; }
</style>
