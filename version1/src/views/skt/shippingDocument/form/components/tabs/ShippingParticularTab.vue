<!--
  ShippingParticularTab.vue - Vue 3 + Vuetify 3 + Composition API
  Stylelint: stylelint-config-standard + stylelint-order

  Figma analysis (Shipping_Document_30_.png):

  INPUTS:
  - BOOKING NO, B/L NO (text fields)
  - Container Type (dropdown: CY)
  - FCL CONTAINER (text field: 2 X 20)
  - M3 (text field: 0.00)
  - "-" field under product desc
  - HS CODE (dropdown: 3906.90.20)
  - CONTAINER & SEAL: freight term, B/L type

  YELLOW CHIPS (display):
  - ETD, ETA dates
  - Package desc "160 DRUMS (20 PALLETS)"
  - N.W., G.W. values
  - Product desc "SN-DISPERSANT 5040..."

  PLAIN TEXT (display):
  - DATE, SHIPPER block, CONSIGNEE block, NOTIFY PARTY block
  - PORT OF RECEIPT, PORT OF LOADING, FEEDER, VESSEL
  - PORT, PORT OF DELIVERY, CY
  - Marks text, COUNTRY OF ORIGIN, pallet note
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <div class="section">
        <h2 class="section-title">
          SHIPPING PARTICULAR
        </h2>
      </div>

      <div class="section">
        <div class="book-grid">
          <div class="book-cell">
            <span class="book-cell__label">BOOKING NO :</span>
            <VTextField
              v-if="!isReadonly"
              :model-value="formData.bookingNo"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('bookingNo', v)"
            />
            <span v-else>{{ formData.bookingNo }}</span>
          </div>
          <div class="book-cell">
            <span class="book-cell__label">B/L NO :</span>
            <VTextField
              v-if="!isReadonly"
              :model-value="formData.blNo"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="(v) => updateField('blNo', v)"
            />
            <span v-else>{{ formData.blNo }}</span>
          </div>
          <div class="book-cell book-cell--date">
            <span class="book-cell__label">DATE :</span>
            <span class="book-cell__text">{{ formData.date }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="shipper-grid">
          <div class="shipper-grid__left">
            <div class="party-label">
              SHIPPER. :
            </div>
            <div class="party-text">
              <div>{{ formData.shipper?.name }}</div>
              <div>{{ formData.shipper?.address }}</div>
              <div v-if="formData.shipper?.address2">
                {{ formData.shipper.address2 }}
              </div>
              <div v-if="formData.shipper?.address3">
                {{ formData.shipper.address3 }}
              </div>
              <div>{{ formData.shipper?.city }}, {{ formData.shipper?.country }}</div>
              <div v-if="formData.shipper?.tel">
                TEL. {{ formData.shipper.tel }}
              </div>
              <div v-if="formData.shipper?.taxId">
                TAX ID {{ formData.shipper.taxId }}
              </div>
            </div>
          </div>
          <div class="shipper-grid__right">
            KINDLY ISSUE US, AT OUR REQUEST,<br>
            SHIPPING ORDER OR B/L FOR THE<br>
            FOLLOWING PARTICULAR:-
          </div>
        </div>
      </div>

      <div class="section">
        <div class="consignee-grid">
          <div class="consignee-grid__left">
            <div class="party-label">
              CONSIGNEE. :
            </div>
            <div class="party-text party-text--indent">
              <div>{{ formData.consignee?.name }}</div>
              <div>{{ formData.consignee?.address }}</div>
              <div v-if="formData.consignee?.address2">
                {{ formData.consignee.address2 }}
              </div>
              <div v-if="formData.consignee?.address3">
                {{ formData.consignee.address3 }}
              </div>
              <div>
                {{ formData.consignee?.city }}
                <template v-if="formData.consignee?.country">
                  - {{ formData.consignee.country }}
                </template>
              </div>
              <div v-if="formData.consignee?.tel">
                TEL.: {{ formData.consignee.tel }}
              </div>
              <div v-if="formData.consignee?.taxId">
                TAX ID : {{ formData.consignee.taxId }}
              </div>
              <div v-if="formData.consignee?.attn">
                ATTN : {{ formData.consignee.attn }}
              </div>
              <div v-if="formData.consignee?.email">
                Email : {{ formData.consignee.email }}
              </div>
            </div>
          </div>

          <div class="consignee-grid__right">
            <VTextarea
              v-if="!isReadonly"
              :model-value="formData.consigneeNote"
              variant="outlined"
              density="compact"
              hide-details
              rows="5"
              no-resize
              class="consignee-note-input"
              @update:model-value="(v) => updateField('consigneeNote', v)"
            />
            <div
              v-else
              class="consignee-note-display"
            >
              {{ formData.consigneeNote }}
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="party-label">
          NOTIFY PARTY :
        </div>
        <div class="notify-box">
          <VTextarea
            v-if="!isReadonly"
            :model-value="formData.notifyParty.notifyParty"
            density="compact"
            hide-details
            auto-grow
            rows="1"
            class="notify-party-input"
            @update:model-value="v => updateField('notifyParty.notifyParty', v)"
          />

          <span
            v-else
            class="notify-party-text"
          >
            {{ formData.notifyParty?.notifyParty }}
          </span>
        </div>
      </div>

      <div class="section">
        <div class="info-line">
          <span class="info-line__label">PORT OF RECEIPT :</span>
          <span>{{ formData.portOfReceipt }}</span>
        </div>
        <div class="info-line">
          <span class="info-line__label">PORT OF LOADING:</span>
          <span>{{ formData.portOfLoading }}</span>
        </div>
      </div>

      <div class="section">
        <div class="ship-row">
          <div class="ship-row__main">
            <span class="ship-row__label">FEEDER :</span>
            <span>{{ formData.feeder }}</span>
          </div>
          <div class="ship-row__end">
            <span class="chip chip--yellow">ETD : {{ formData.etd }}</span>
          </div>
        </div>

        <div class="ship-row ship-row--spaced">
          <div class="ship-row__main">
            <span class="ship-row__label">VESSEL :</span>
            <span>{{ formData.vessel }}</span>
          </div>
          <div class="ship-row__mid">
            <span class="ship-row__label">Container Type :</span>
            <VSelect
              v-if="!isReadonly"
              :model-value="formData.containerType"
              :items="CONTAINER_TYPES"
              variant="outlined"
              density="compact"
              hide-details
              class="ship-row__select"
              @update:model-value="(v) => updateField('containerType', v)"
            />
            <span v-else>{{ formData.containerType }}</span>
          </div>
          <div class="ship-row__end">
            <span class="chip chip--yellow">ETA : {{ formData.eta }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="info-line">
          <span class="info-line__label">PORT :</span>
          <span>{{ formData.portOfDischarge }}</span>
        </div>
        <div class="info-line">
          <span class="info-line__label">PORT OF DELIVERY :</span>
          <span>{{ formData.portOfDelivery }}</span>
          <span class="info-line__extra">{{ formData.deliveryType || formData.containerType }}</span>
        </div>
      </div>

      <div class="section">
        <div class="mark-label">
          SHIPPING MARK :
        </div>

        <div class="mark-grid">
          <div class="mark-grid__left">
            <div
              v-for="(m, i) in shippingMarks"
              :key="i"
              class="mark-text"
            >
              {{ m }}
            </div>
          </div>

          <div class="mark-grid__right">
            <div class="mark-detail-row">
              <div class="mark-detail-row__pkg">
                <span class="chip chip--yellow">{{ shippingPackageDescription }}</span>
              </div>
              <div class="mark-detail-row__header">
                N.W.
              </div>
              <div class="mark-detail-row__header">
                G.W.
              </div>
              <div class="mark-detail-row__header">
                M3
              </div>
            </div>

            <div class="mark-detail-row">
              <div class="mark-detail-row__pkg">
                <span class="mark-detail-row__fcl-label">FCL CONTAINER :</span>
                <VTextField
                  v-if="!isReadonly"
                  :model-value="formData.shippingMark?.fclContainer"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="mark-detail-row__fcl-input"
                  @update:model-value="(v) => updateMark('fclContainer', v)"
                />
                <span v-else>{{ formData.shippingMark?.fclContainer }}</span>
              </div>
              <div class="mark-detail-row__val">
                <span class="chip chip--yellow">{{ fmtNum(shippingNetWeight) }}</span>
              </div>
              <div class="mark-detail-row__val">
                <span class="chip chip--yellow">{{ fmtNum(shippingGrossWeight) }}</span>
              </div>
              <div class="mark-detail-row__val">
                <VTextField
                  v-if="!isReadonly"
                  :model-value="formData.shippingMark?.cbm"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => updateMark('cbm', Number(v))"
                />
                <span v-else>{{ formData.shippingMark?.cbm }}</span>
              </div>
            </div>

            <div
              v-for="(description, idx) in shippingProductDescriptions"
              :key="idx"
              class="mark-line"
            >
              <span class="chip chip--yellow">{{ description }}</span>
            </div>

            <div class="mark-line">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.shippingMark?.extraNote || '-'"
                variant="outlined"
                density="compact"
                hide-details
                class="mark-extra-input"
                @update:model-value="(v) => updateMark('extraNote', v)"
              />
              <span v-else>{{ formData.shippingMark?.extraNote || '-' }}</span>
            </div>

            <div class="mark-hs-row">
              <span class="mark-hs-row__label">HS CODE :</span>
              <VSelect
                v-if="!isReadonly"
                :model-value="formData.shippingMark?.hsCode"
                :items="HS_CODES"
                variant="outlined"
                density="compact"
                hide-details
                class="mark-hs-row__select"
                @update:model-value="(v) => updateMark('hsCode', v)"
              />
              <span v-else>{{ formData.shippingMark?.hsCode }}</span>
            </div>

            <div class="mark-info">
              COUNTRY OF ORIGIN : {{ formData.shippingMark?.countryOfOrigin || 'THAILAND' }}
            </div>

            <div class="mark-info">
              {{ formData.shippingMark?.palletNote }}
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="seal-label">
          CONTAINER & SEAL NO.:
        </div>
        <div class="seal-grid">
          <div class="seal-cell">
            <span class="seal-cell__label">MARK :</span>
            <VSelect
              v-if="!isReadonly"
              :model-value="formData.containerSealNo?.freightTerms"
              :items="FREIGHT_TERM_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Shipping payment term"
              @update:model-value="(v) => updateSeal('freightTerms', v)"
            />
            <span v-else>{{ formData.containerSealNo?.freightTerms }}</span>
          </div>
          <div class="seal-cell">
            <VSelect
              v-if="!isReadonly"
              :model-value="formData.containerSealNo?.blType"
              :items="BL_TYPE_OPTIONS"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Type of B/L"
              @update:model-value="(v) => updateSeal('blType', v)"
            />
            <span v-else>{{ formData.containerSealNo?.blType }}</span>
          </div>
        </div>
      </div>
    </div>

    <TabActionBar
      :tab-key="TabKey.SHIPPING_PARTICULAR"
      :is-loading="isLoading"
      :show-print-options="false"
      :is-dirty="isDirty"
      :notes="notes"
      :print-targets="printTargets"
      :print-config="{
        buyer: {
          hasDisplay: false,
          displayFields: []
        },
        customs: {
          hasDisplay: false,
          displayFields: []
        }
      }"
      @print="handlePrint"
      @save-draft="saveDraft"
      @confirm="confirm"
      @add-note="handleAddNote"
      @delete-note="handleDeleteNote"
      @edit-note="handleEditNote"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import {
  buildFirstMarks,
  buildPackagingSummary,
  buildShippingProductDescriptions,
  buildTotalGross,
  buildTotalNet,
} from '../../utils/packingDerived'
import TabActionBar from '../shared/TabActionBar.vue'

const CONTAINER_TYPES = ['CY', 'CFS', 'FCL', 'LCL']
const HS_CODES = ['3906.90.20', '3906.90.90']
const FREIGHT_TERM_OPTIONS = ['Freight Collect', 'Freight Collect in Japan', 'Freight Prepaid']
const BL_TYPE_OPTIONS = ['Original B/L', 'Surrendered B/L', 'Sea Waybill', 'Truck Waybill', 'Air Waybill']

const store = useShipDocumentStore()

const {
  formData,
  isDirty,
  isLoading,
  isReadonly,
  updateField,
  saveDraft,
  confirm,
} = useTabForm(TabKey.SHIPPING_PARTICULAR, {
  onSaveDraft: data => tabApiMap[TabKey.SHIPPING_PARTICULAR].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.SHIPPING_PARTICULAR].confirm(store.documentId, data),
})

const notes = ref([])

const { print } = usePrint(
  TabKey.SHIPPING_PARTICULAR,
  () => ({
    ...formData.value,
    packingItems: store.tabs[TabKey.PACKING_LIST]?.data?.items || [],
    note: notes.value[0]?.text ?? '',
  }),
)

const printTargets = [
  { label: 'For Buyer', value: 'buyer' },
  { label: 'For Customs', value: 'customs' },
]

const route = useRoute()
const shippMode = computed(() => route.query.mode || 'ocean')
const packingListData = computed(() => store.tabs[TabKey.PACKING_LIST]?.data || {})
const packingListItems = computed(() => packingListData.value.items || [])

const shippingMarks = computed(() => {
  const marks = buildFirstMarks(packingListItems.value)

  return marks.length ? marks : (formData.value.shippingMark?.marks || [])
})

const shippingPackageDescription = computed(() =>
  buildPackagingSummary(packingListItems.value) || formData.value.shippingMark?.packageDescription,
)

const shippingProductDescriptions = computed(() => {
  const descriptions = buildShippingProductDescriptions(packingListItems.value)

  return descriptions.length
    ? descriptions
    : [formData.value.shippingMark?.productDescription].filter(Boolean)
})

const shippingNetWeight = computed(() => buildTotalNet(packingListItems.value) || formData.value.shippingMark?.netWeight)
const shippingGrossWeight = computed(() => buildTotalGross(packingListItems.value) || formData.value.shippingMark?.grossWeight)

function handlePrint(payload) {
  print(
    payload?.target ?? 'buyer',
    payload?.display ?? [],
    shippMode.value,
  )
}

function handleAddNote(text) {
  notes.value = [{ id: Date.now(), text, date: new Date().toLocaleString('en-GB') }]
}

function handleEditNote({ id, text }) {
  if (notes.value[0]?.id === id) notes.value[0].text = text
}

function handleDeleteNote(noteId) {
  notes.value = notes.value.filter(n => n.id !== noteId)
}

function updateMark(field, value) {
  updateField('shippingMark', { ...formData.value.shippingMark, [field]: value })
}

function updateSeal(field, value) {
  updateField('containerSealNo', { ...formData.value.containerSealNo, [field]: value })
}

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}
</script>

<style src="./css/ShippingParticularTab.css">

</style>
