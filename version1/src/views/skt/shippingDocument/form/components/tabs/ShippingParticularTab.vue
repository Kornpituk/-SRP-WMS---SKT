<!-- ============================================================
  ShippingParticularTab.vue
  Matches Image 2 — the most complex tab:
  1. BOOKING NO / B/L NO / DATE
  2. SHIPPER block (with "KINDLY ISSUE US..." text)
  3. CONSIGNEE block
  4. NOTIFY PARTY block (bordered box)
  5. PORT OF RECEIPT / PORT OF LOADING
  6. FEEDER / VESSEL / Container Type / ETD / ETA
  7. PORT / PORT OF DELIVERY / delivery type
  8. SHIPPING MARK section (marks + FCL + NW/GW/M3 + product + HS)
  9. CONTAINER & SEAL NO. (MARK | freight terms | BL type)
============================================================ -->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <div class="text-center py-3">
        <h2 class="text-h6 font-weight-bold">SHIPPING PARTICULAR</h2>
      </div>

      <!-- ===== Booking / BL / Date ===== -->
      <div class="section-card">
        <v-row dense>
          <v-col cols="4"><FieldRow label="BOOKING NO :"><InputOrText :readonly="isReadonly" :value="formData.bookingNo" @input="(v) => updateField('bookingNo', v)" /></FieldRow></v-col>
          <v-col cols="4"><FieldRow label="B/L NO :"><InputOrText :readonly="isReadonly" :value="formData.blNo" @input="(v) => updateField('blNo', v)" /></FieldRow></v-col>
          <v-col cols="4"><FieldRow label="DATE :"><InputOrText :readonly="isReadonly" :value="formData.date" type="date" @input="(v) => updateField('date', v)" /></FieldRow></v-col>
        </v-row>
      </div>

      <!-- ===== Shipper ===== -->
      <div class="section-card">
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-caption font-weight-bold mb-2">SHIPPER. :</div>
            <PartyInfoFields :party="formData.shipper" :readonly="isReadonly" @update="(v) => updateField('shipper', v)" />
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-body-2 mt-4">
              KINDLY ISSUE US, AT OUR REQUEST,<br>
              SHIPPING ORDER OR B/L FOR THE<br>
              FOLLOWING PARTICULAR:-
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- ===== Consignee ===== -->
      <div class="section-card">
        <div class="text-caption font-weight-bold mb-2">CONSIGNEE. :</div>
        <PartyInfoFields :party="formData.consignee" :readonly="isReadonly" @update="(v) => updateField('consignee', v)" />
      </div>

      <!-- ===== Notify Party (bordered box in screenshot) ===== -->
      <div class="section-card">
        <div class="text-caption font-weight-bold mb-2">NOTIFY PARTY :</div>
        <div class="notify-box">
          <PartyInfoFields :party="formData.notifyParty" :readonly="isReadonly" @update="(v) => updateField('notifyParty', v)" />
        </div>
      </div>

      <!-- ===== Ports ===== -->
      <div class="section-card">
        <FieldRow label="PORT OF RECEIPT :" class="mb-2"><InputOrText :readonly="isReadonly" :value="formData.portOfReceipt" @input="(v) => updateField('portOfReceipt', v)" /></FieldRow>
        <FieldRow label="PORT OF LOADING:"><InputOrText :readonly="isReadonly" :value="formData.portOfLoading" @input="(v) => updateField('portOfLoading', v)" /></FieldRow>
      </div>

      <!-- ===== Feeder / Vessel / Container Type / ETD / ETA ===== -->
      <div class="section-card">
        <v-row dense class="mb-2">
          <v-col cols="6"><FieldRow label="FEEDER :"><InputOrText :readonly="isReadonly" :value="formData.feeder" @input="(v) => updateField('feeder', v)" /></FieldRow></v-col>
          <v-col cols="6">
            <FieldRow label="ETD :">
              <v-chip v-if="isReadonly" color="amber-lighten-4" variant="flat" size="small">{{ formData.etd }}</v-chip>
              <v-text-field v-else :model-value="formData.etd" type="date" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('etd', v)" />
            </FieldRow>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="4"><FieldRow label="VESSEL :"><InputOrText :readonly="isReadonly" :value="formData.vessel" @input="(v) => updateField('vessel', v)" /></FieldRow></v-col>
          <v-col cols="3">
            <FieldRow label="Container Type :">
              <v-select v-if="!isReadonly" :model-value="formData.containerType" :items="['CY','CFS','FCL','LCL']" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('containerType', v)" />
              <span v-else>{{ formData.containerType }}</span>
            </FieldRow>
          </v-col>
          <v-col cols="5">
            <FieldRow label="ETA :">
              <v-chip v-if="isReadonly" color="amber-lighten-4" variant="flat" size="small">{{ formData.eta }}</v-chip>
              <v-text-field v-else :model-value="formData.eta" type="date" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('eta', v)" />
            </FieldRow>
          </v-col>
        </v-row>
      </div>

      <!-- ===== Discharge / Delivery ===== -->
      <div class="section-card">
        <FieldRow label="PORT :" class="mb-2"><InputOrText :readonly="isReadonly" :value="formData.portOfDischarge" @input="(v) => updateField('portOfDischarge', v)" /></FieldRow>
        <v-row dense>
          <v-col cols="8"><FieldRow label="PORT OF DELIVERY :"><InputOrText :readonly="isReadonly" :value="formData.portOfDelivery" @input="(v) => updateField('portOfDelivery', v)" /></FieldRow></v-col>
          <v-col cols="4"><span class="font-weight-bold">{{ formData.deliveryType || formData.containerType }}</span></v-col>
        </v-row>
      </div>

      <!-- ===== Shipping Mark ===== -->
      <div class="section-card">
        <div class="text-caption font-weight-bold mb-3">SHIPPING MARK :</div>
        <v-row>
          <!-- Left: Mark text -->
          <v-col cols="3">
            <div v-if="isReadonly" class="text-body-2">
              <div v-for="(m, i) in (formData.shippingMark?.marks || [])" :key="i">{{ m }}</div>
            </div>
            <v-textarea v-else :model-value="(formData.shippingMark?.marks || []).join('\n')" variant="outlined"
              density="compact" hide-details rows="3" @update:model-value="(v) => updateField('shippingMark', { ...formData.shippingMark, marks: v.split('\n') })" />
          </v-col>

          <!-- Right: Details grid -->
          <v-col cols="9">
            <!-- Row 1: Package desc + N.W. + G.W. + M3 headers -->
            <v-row dense class="mb-1">
              <v-col cols="4">
                <v-chip v-if="isReadonly" color="amber-lighten-4" variant="flat" size="small">{{ formData.shippingMark?.packageDescription }}</v-chip>
                <v-text-field v-else :model-value="formData.shippingMark?.packageDescription" variant="outlined" density="compact" hide-details placeholder="160 DRUMS (20 PALLETS)" @update:model-value="(v) => updateField('shippingMark', { ...formData.shippingMark, packageDescription: v })" />
              </v-col>
              <v-col cols="2" class="text-center text-caption font-weight-bold">N.W.</v-col>
              <v-col cols="2" class="text-center text-caption font-weight-bold">G.W.</v-col>
              <v-col cols="2" class="text-center text-caption font-weight-bold">M3</v-col>
            </v-row>

            <!-- Row 2: FCL Container + values -->
            <v-row dense class="mb-2">
              <v-col cols="4">
                <FieldRow label="FCL CONTAINER :">
                  <InputOrText :readonly="isReadonly" :value="formData.shippingMark?.fclContainer" @input="(v) => updateField('shippingMark', { ...formData.shippingMark, fclContainer: v })" />
                </FieldRow>
              </v-col>
              <v-col cols="2">
                <v-chip color="amber-lighten-4" variant="flat" size="small">{{ formatNum(formData.shippingMark?.netWeight) }}</v-chip>
              </v-col>
              <v-col cols="2">
                <v-chip color="amber-lighten-4" variant="flat" size="small">{{ formatNum(formData.shippingMark?.grossWeight) }}</v-chip>
              </v-col>
              <v-col cols="2">
                <InputOrText :readonly="isReadonly" :value="formData.shippingMark?.cbm" @input="(v) => updateField('shippingMark', { ...formData.shippingMark, cbm: Number(v) })" />
              </v-col>
            </v-row>

            <!-- Product description -->
            <div class="mb-2">
              <v-chip v-if="isReadonly" color="amber-lighten-4" variant="flat" size="small">{{ formData.shippingMark?.productDescription }}</v-chip>
              <v-text-field v-else :model-value="formData.shippingMark?.productDescription" variant="outlined" density="compact" hide-details placeholder="SN-DISPERSANT 5040 (SODIUM POLYACRYLATE)" @update:model-value="(v) => updateField('shippingMark', { ...formData.shippingMark, productDescription: v })" />
            </div>

            <!-- HS Code -->
            <FieldRow label="HS CODE :" class="mb-2">
              <v-select v-if="!isReadonly" :model-value="formData.shippingMark?.hsCode" :items="['3906.90.20','3906.90.90']" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('shippingMark', { ...formData.shippingMark, hsCode: v })" />
              <span v-else>{{ formData.shippingMark?.hsCode }}</span>
            </FieldRow>

            <!-- Country -->
            <div class="text-body-2 mb-2">COUNTRY OF ORIGIN : {{ formData.shippingMark?.countryOfOrigin || 'THAILAND' }}</div>

            <!-- Pallet note -->
            <div class="text-body-2">{{ formData.shippingMark?.palletNote }}</div>
          </v-col>
        </v-row>
      </div>

      <!-- ===== Container & Seal No. ===== -->
      <div class="section-card">
        <div class="text-caption font-weight-bold mb-3">CONTAINER & SEAL NO.:</div>
        <v-row dense>
          <v-col cols="3"><FieldRow label="MARK :"><InputOrText :readonly="isReadonly" :value="formData.containerSealNo?.mark" @input="(v) => updateField('containerSealNo', { ...formData.containerSealNo, mark: v })" /></FieldRow></v-col>
          <v-col cols="4">
            <v-select v-if="!isReadonly" :model-value="formData.containerSealNo?.freightTerms" :items="['FREIGHT PREPAID','FREIGHT COLLECT']" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('containerSealNo', { ...formData.containerSealNo, freightTerms: v })" />
            <span v-else>{{ formData.containerSealNo?.freightTerms }}</span>
          </v-col>
          <v-col cols="4">
            <v-select v-if="!isReadonly" :model-value="formData.containerSealNo?.blType" :items="['SURRENDER B/L','ORIGINAL B/L']" variant="outlined" density="compact" hide-details @update:model-value="(v) => updateField('containerSealNo', { ...formData.containerSealNo, blType: v })" />
            <span v-else>{{ formData.containerSealNo?.blType }}</span>
          </v-col>
        </v-row>
      </div>
    </div>

    <TabActionBar :tab-key="TabKey.SHIPPING_PARTICULAR" :is-loading="isLoading" :is-dirty="isDirty"
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
import PartyInfoFields from '../shared/PartyInfoFields.vue'
import FieldRow from '../shared/FieldRow.vue'
import InputOrText from '../shared/InputOrText.vue'

const store = useShipDocumentStore()
const { formData, isDirty, isLoading, isReadonly, updateField, saveDraft, confirm } =
  useTabForm(TabKey.SHIPPING_PARTICULAR, {
    onSaveDraft: (d) => tabApiMap[TabKey.SHIPPING_PARTICULAR].save(store.documentId, d),
    onConfirm: (d) => tabApiMap[TabKey.SHIPPING_PARTICULAR].confirm(store.documentId, d),
  })
const { print: handlePrint } = usePrint(TabKey.SHIPPING_PARTICULAR)

function formatNum(n) {
  return n != null ? Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
}
</script>

<style scoped>
.tab-page { display: flex; flex-direction: column; min-height: 100%; }
.tab-content { flex: 1; padding: 0 24px 24px; }
.section-card { background: #fff; border-radius: 4px; padding: 16px 24px; margin-bottom: 16px; }
.notify-box { border: 1px solid #bdbdbd; border-radius: 4px; padding: 16px; }
</style>
