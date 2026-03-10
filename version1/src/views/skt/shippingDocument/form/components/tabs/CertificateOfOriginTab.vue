/* stylelint-disable declaration-block-single-line-max-declarations */
<!--
  ============================================================
  CertificateOfOriginTab.vue  
  Matches Image 4: Sentence-based certificate layout
  
  "TO : WHOM IT MAY CONCERN,
  CERTIFICATE OF ORIGIN
  THIS IS TO CERTIFY THAT TOTAL [weight] IN [count] ' CONTAINER
  OF [product]
  MANUFACTURED BY [maker] ARE OF [country] ORIGIN
  REF. [invoice] / [po]"
  ============================================================ 
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- Date -->
      <div class="text-right mb-4">
        <VChip
          v-if="isReadonly"
          color="amber-lighten-4"
          variant="flat"
          size="small"
        >
          {{ formData.date }}
        </VChip>
        <VTextField
          v-else
          :model-value="formData.date"
          type="date"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 200px; margin-left: auto;"
          @update:model-value="(v) => updateField('date', v)"
        />
      </div>

      <!-- TO -->
      <p class="text-body-1 mb-4">
        TO : WHOM IT MAY CONCERN,
      </p>

      <!-- Title -->
      <div class="text-center mb-6">
        <h2 class="text-h6 font-weight-bold">
          CERTIFICATE OF ORIGIN
        </h2>
      </div>

      <!-- Sentence: THIS IS TO CERTIFY THAT TOTAL ... -->
      <div class="certificate-sentence mb-4">
        <span class="text-body-1">THIS IS TO CERTIFY THAT TOTAL</span>
        <span class="mx-2">
          <VChip
            v-if="isReadonly"
            color="amber-lighten-4"
            variant="flat"
            size="small"
          >{{ formData.totalWeight }}</VChip>
          <VTextField
            v-else
            :model-value="formData.totalWeight"
            variant="outlined"
            density="compact"
            hide-details
            style="display: inline-flex; width: 280px;"
            placeholder="40,000 KGS (250KGX160DRUM)"
            @update:model-value="(v) => updateField('totalWeight', v)"
          />
        </span>
        <span class="text-body-1 mx-2">IN</span>
        <span class="mx-2">
          <VTextField
            v-if="!isReadonly"
            :model-value="formData.containerCount"
            variant="outlined"
            density="compact"
            hide-details
            style="display: inline-flex; width: 100px;"
            placeholder="2X20"
            @update:model-value="(v) => updateField('containerCount', v)"
          />
          <span v-else>{{ formData.containerCount }}</span>
        </span>
        <span class="text-body-1">' CONTAINER</span>
      </div>

      <!-- OF [product] -->
      <div class="mb-4">
        <span class="text-body-1">OF </span>
        <InputOrText
          :readonly="isReadonly"
          :value="formData.productName"
          @input="(v) => updateField('productName', v)"
        />
      </div>

      <!-- MANUFACTURED BY ... -->
      <div class="mb-4">
        <span class="text-body-1">MANUFACTURED BY </span>
        <span
          v-if="isReadonly"
          class="text-body-1"
        >{{ formData.manufacturer }}</span>
        <VTextField
          v-else
          :model-value="formData.manufacturer"
          variant="outlined"
          density="compact"
          hide-details
          style="display: inline-flex; width: 400px;"
          @update:model-value="(v) => updateField('manufacturer', v)"
        />
        <span class="text-body-1"> ARE OF </span>
        <span
          v-if="isReadonly"
          class="text-body-1"
        >{{ formData.originCountry }}</span>
        <VTextField
          v-else
          :model-value="formData.originCountry"
          variant="outlined"
          density="compact"
          hide-details
          style="display: inline-flex; width: 150px;"
          @update:model-value="(v) => updateField('originCountry', v)"
        />
        <span class="text-body-1"> ORIGIN</span>
      </div>

      <!-- REF. -->
      <div class="mt-8">
        <FieldRow
          label="REF."
          class="mb-2"
        >
          <VChip
            v-if="isReadonly"
            color="amber-lighten-4"
            variant="flat"
            size="small"
          >
            INVOICE NO.{{ formData.invoiceNo }} ({{ formData.contractNo }})
          </VChip>
          <VTextField
            v-else
            :model-value="formData.invoiceNo"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="Invoice No."
            @update:model-value="(v) => updateField('invoiceNo', v)"
          />
        </FieldRow>
        <FieldRow
          label=""
          class="m-12"
        >
          <VChip
            v-if="isReadonly"
            color="amber-lighten-4"
            variant="flat"
            size="small"
          >
            PO NO : {{ formData.poNo }}
          </VChip>
          <VTextField
            v-else
            :model-value="formData.poNo"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="PO No."
            @update:model-value="(v) => updateField('poNo', v)"
          />
        </FieldRow>
      </div>
    </div>

    <TabActionBar
      :tab-key="TabKey.CERTIFICATE_OF_ORIGIN"
      :is-loading="isLoading"
      :is-dirty="isDirty"
      @print="handlePrint"
      @save-draft="saveDraft"
      @confirm="confirm"
    />
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
  useTabForm(TabKey.CERTIFICATE_OF_ORIGIN, {
    onSaveDraft: d => tabApiMap[TabKey.CERTIFICATE_OF_ORIGIN].save(store.documentId, d),
    onConfirm: d => tabApiMap[TabKey.CERTIFICATE_OF_ORIGIN].confirm(store.documentId, d),
  })

const { print: handlePrint } = usePrint(TabKey.CERTIFICATE_OF_ORIGIN)
</script>

<style scoped>
.tab-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.tab-content {
  flex: 1; 
  padding: 24px 48px;
  background: #fff; 
}

.certificate-sentence {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px; 
}
</style>
