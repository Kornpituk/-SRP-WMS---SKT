<!-- ============================================================
  CommercialInvoiceTab.vue
  Layout matches screenshot Image 1:
  1. COMMERCIAL INVOICE title + date/invoice/PO/proforma
  2. Payer | Consignee | Payment + Due Date
  3. Shipping (Feeder/Vessel/ETD, From/To/ETA)
  4. Items table (MARKS | DESC | QTY | UNIT PRICE | AMOUNT)
  5. Total
  6. CIF/FOB/Ocean Freight/Insurance
  7. Footer (Packing/Country/Maker/Packaging/Lot No)
  8. Banking Detail
============================================================ -->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <div class="text-center py-4">
        <h2 class="text-h6 font-weight-bold">COMMERCIAL INVOICE</h2>
      </div>

      <!-- Date & References (yellow highlighted in screenshot) -->
      <div class="section-card">
        <div class="mb-1">
          <FieldRow label="">
            <v-text-field v-if="!isReadonly" :model-value="formData.date" type="date" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('date', v)" />
            <v-chip v-else color="amber-lighten-4" variant="flat" size="small">{{ formData.date }}</v-chip>
          </FieldRow>
        </div>
        <FieldRow label="INVOICE NO. :" class="mb-1">
          <span v-if="isReadonly"><v-chip color="amber-lighten-4" variant="flat" size="small">{{ formData.invoiceNo }} ({{ formData.contractNo }})</v-chip></span>
          <v-row v-else dense><v-col cols="7"><v-text-field :model-value="formData.invoiceNo" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('invoiceNo', v)" /></v-col><v-col cols="5"><v-text-field :model-value="formData.contractNo" variant="outlined" density="compact" hide-details placeholder="(C-No)" @update:model-value="(v) => updateField('contractNo', v)" /></v-col></v-row>
        </FieldRow>
        <FieldRow label="PO NO :" class="mb-1">
          <v-text-field v-if="!isReadonly" :model-value="formData.poNo" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('poNo', v)" />
          <v-chip v-else color="amber-lighten-4" variant="flat" size="small">PO-{{ formData.poNo }}</v-chip>
        </FieldRow>
        <FieldRow label="PROFORMA INVOICE NO. :">
          <v-text-field v-if="!isReadonly" :model-value="formData.proformaInvoiceNo" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('proformaInvoiceNo', v)" />
          <v-chip v-else color="amber-lighten-4" variant="flat" size="small">{{ formData.proformaInvoiceNo }}</v-chip>
        </FieldRow>
      </div>

      <!-- Payer / Consignee / Payment -->
      <div class="section-card">
        <v-row>
          <v-col cols="12" md="4">
            <div class="text-caption font-weight-bold mb-1">Payer :</div>
            <PartyInfoFields :party="formData.payer" :readonly="isReadonly" @update="(v) => updateField('payer', v)" />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-caption font-weight-bold mb-1">Consignee :</div>
            <PartyInfoFields :party="formData.consignee" :readonly="isReadonly" @update="(v) => updateField('consignee', v)" />
          </v-col>
          <v-col cols="12" md="4">
            <FieldRow label="Payment :">
              <v-select v-if="!isReadonly" :model-value="formData.payment" :items="['T/T in advance','L/C','D/P','D/A']" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('payment', v)" />
              <span v-else>{{ formData.payment }}</span>
            </FieldRow>
            <FieldRow label="Due Date :" class="mt-3">
              <v-text-field v-if="!isReadonly" :model-value="formData.dueDate" type="date" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('dueDate', v)" />
              <span v-else>{{ formData.dueDate }}</span>
            </FieldRow>
          </v-col>
        </v-row>
      </div>

      <!-- Shipping Info -->
      <div class="section-card">
        <v-row dense>
          <v-col cols="3"><FieldRow label="Feeder :"><InputOrText :readonly="isReadonly" :value="formData.feeder" @input="(v) => updateField('feeder', v)" /></FieldRow></v-col>
          <v-col cols="4"><FieldRow label="Vessel :"><InputOrText :readonly="isReadonly" :value="formData.vessel" @input="(v) => updateField('vessel', v)" /></FieldRow></v-col>
          <v-col cols="2"><FieldRow label="ETD :"><InputOrText :readonly="isReadonly" :value="formData.etd" type="date" @input="(v) => updateField('etd', v)" /></FieldRow></v-col>
        </v-row>
        <v-row dense class="mt-1">
          <v-col cols="3"><FieldRow label="From :"><InputOrText :readonly="isReadonly" :value="formData.from" @input="(v) => updateField('from', v)" /></FieldRow></v-col>
          <v-col cols="4"><FieldRow label="To :"><InputOrText :readonly="isReadonly" :value="formData.to" @input="(v) => updateField('to', v)" /></FieldRow></v-col>
          <v-col cols="2"><FieldRow label="ETA:"><InputOrText :readonly="isReadonly" :value="formData.eta" type="date" @input="(v) => updateField('eta', v)" /></FieldRow></v-col>
        </v-row>
      </div>

      <!-- Items Table -->
      <div class="section-card pa-0">
        <v-table density="compact">
          <thead>
            <tr class="bg-grey-lighten-4">
              <th style="width:20%">MARKS & NOS</th>
              <th style="width:25%">DESCRIPTION OF GOODS</th>
              <th class="text-right" style="width:15%">QUANTITY (KGS)</th>
              <th class="text-right" style="width:15%">UNIT PRICE (US$/KGS)</th>
              <th class="text-right" style="width:15%">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in formData.items" :key="item.id">
              <td class="py-3">{{ item.marksAndNos }}</td>
              <td class="py-3">{{ item.descriptionOfGoods }}<br><span class="text-grey">({{ item.subDescription }})</span></td>
              <td class="text-right py-3">
                <v-chip v-if="item.quantity" color="amber-lighten-4" variant="flat" size="small">{{ formatNum(item.quantity) }}</v-chip>
              </td>
              <td class="text-right py-3">{{ item.unitPrice?.toFixed(2) }}</td>
              <td class="text-right py-3">{{ formatNum(item.amount) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-weight-bold">
              <td colspan="2" class="pa-3">Total</td>
              <td class="text-right pa-3"><v-chip color="amber-lighten-4" variant="flat" size="small">{{ formatNum(totalQty) }}<br>({{ formData.totalDescription }})</v-chip></td>
              <td></td>
              <td class="text-right pa-3">{{ formatNum(totalAmount) }}</td>
            </tr>
          </tfoot>
        </v-table>
      </div>

      <!-- CIF / FOB / Freight / Insurance -->
      <div class="section-card">
        <v-row dense v-for="row in pricingRows" :key="row.key" class="mb-1">
          <v-col cols="2">
            <v-select v-if="row.hasType && !isReadonly" :model-value="row.type" :items="['CIF','FOB']" variant="outlined" density="compact" hide-details />
            <span v-else-if="row.hasType" class="font-weight-bold">{{ row.type }}</span>
            <span v-else>{{ row.label }}</span>
          </v-col>
          <v-col cols="5"><span>{{ row.port }}</span></v-col>
          <v-col cols="1" class="text-right"><span class="text-grey">US$</span></v-col>
          <v-col cols="4">
            <v-text-field v-if="!isReadonly" :model-value="formData[row.key]" type="number" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField(row.key, Number(v))" />
            <span v-else class="text-right d-block">{{ formatNum(formData[row.key]) }}</span>
          </v-col>
        </v-row>
      </div>

      <!-- Footer Info -->
      <div class="section-card">
        <FieldRow label="PACKING :" class="mb-2">
          <InputOrText :readonly="isReadonly" :value="formData.packing" highlight @input="(v) => updateField('packing', v)" />
        </FieldRow>
        <FieldRow label="COUNTRY OF ORIGIN :" class="mb-2"><InputOrText :readonly="isReadonly" :value="formData.countryOfOrigin" @input="(v) => updateField('countryOfOrigin', v)" /></FieldRow>
        <FieldRow label="MAKER NAME :" class="mb-2"><InputOrText :readonly="isReadonly" :value="formData.makerName" @input="(v) => updateField('makerName', v)" /></FieldRow>
        <FieldRow label="PACKAGING :" class="mb-2">
          <InputOrText :readonly="isReadonly" :value="formData.packaging" highlight @input="(v) => updateField('packaging', v)" />
        </FieldRow>
        <FieldRow label="Lot No :"><InputOrText :readonly="isReadonly" :value="formData.lotNo" @input="(v) => updateField('lotNo', v)" /></FieldRow>
      </div>

      <!-- Banking Detail -->
      <div class="section-card">
        <h3 class="text-subtitle-2 font-weight-bold mb-3">Banking Detail</h3>
        <FieldRow label="Account No :" class="mb-2"><InputOrText :readonly="isReadonly" :value="formData.bankingDetail?.accountNo" @input="(v) => updateField('bankingDetail', { ...formData.bankingDetail, accountNo: v })" /></FieldRow>
        <FieldRow label="Bank Name :" class="mb-2"><InputOrText :readonly="isReadonly" :value="formData.bankingDetail?.bankName" @input="(v) => updateField('bankingDetail', { ...formData.bankingDetail, bankName: v })" /></FieldRow>
        <FieldRow label="Address :" class="mb-2"><InputOrText :readonly="isReadonly" :value="formData.bankingDetail?.address" @input="(v) => updateField('bankingDetail', { ...formData.bankingDetail, address: v })" /></FieldRow>
        <FieldRow label="Swift Code :"><InputOrText :readonly="isReadonly" :value="formData.bankingDetail?.swiftCode" @input="(v) => updateField('bankingDetail', { ...formData.bankingDetail, swiftCode: v })" /></FieldRow>
      </div>
    </div>

    <TabActionBar :tab-key="TabKey.COMMERCIAL_INVOICE" :is-loading="isLoading" :is-dirty="isDirty"
      @print="handlePrint" @save-draft="saveDraft" @confirm="confirm" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import TabActionBar from '../shared/TabActionBar.vue'
import PartyInfoFields from '../shared/PartyInfoFields.vue'
import FieldRow from '../shared/FieldRow.vue'
import InputOrText from '../shared/InputOrText.vue'

const store = useShipDocumentStore()
const { formData, isDirty, isLoading, isReadonly, updateField, saveDraft, confirm } =
  useTabForm(TabKey.COMMERCIAL_INVOICE, {
    onSaveDraft: (d) => tabApiMap[TabKey.COMMERCIAL_INVOICE].save(store.documentId, d),
    onConfirm: (d) => tabApiMap[TabKey.COMMERCIAL_INVOICE].confirm(store.documentId, d),
  })
const { print: handlePrint } = usePrint(TabKey.COMMERCIAL_INVOICE)

const totalQty = computed(() => formData.value.items.reduce((s, i) => s + (i.quantity || 0), 0))
const totalAmount = computed(() => formData.value.items.reduce((s, i) => s + (i.amount || 0), 0))

const pricingRows = computed(() => [
  { key: 'cifValue', hasType: true, type: 'CIF', port: formData.value.cifPort || 'HCM CITY, VIETNAM', label: '' },
  { key: 'fobValue', hasType: true, type: 'FOB', port: formData.value.fobPort || 'LAEM CHABANG, THAILAND', label: '' },
  { key: 'oceanFreight', hasType: false, type: '', port: '', label: 'OCEAN FREIGHT' },
  { key: 'insurance', hasType: false, type: '', port: '', label: 'INSURANCE' },
])

function formatNum(n) {
  return n != null ? Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
}
</script>

<style scoped>
.tab-page { display: flex; flex-direction: column; min-height: 100%; }
.tab-content { flex: 1; padding: 0 24px 24px; }
.section-card { background: #fff; border-radius: 4px; padding: 16px 24px; margin-bottom: 16px; }
</style>
