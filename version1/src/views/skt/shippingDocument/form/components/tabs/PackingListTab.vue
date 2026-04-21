<!--
  PackingListTab.vue — Vue 3 + Vuetify 3 + Composition API
  Style: Stylelint compliant (stylelint-config-standard + stylelint-order)

  ✅ Requirements implemented:
  #1  Invoice Running Number (auto-generated prefix) + free-text suffix
  #2  Date validation: new invoice date >= previous invoice date
  #3  Due Date auto-calculate from Payment + ETD/ETA
  #4  Gross Weight auto-calculate = (qty × tare) + (pallets × tarePallet) + net
  #5  Tare Weight auto-fill from master on packageType change
  #6  Tare Pallet show/hide based on palletCount + master options
  #7  PACKAGING auto-format with palletCount suffix
  #8  MARKS & NOS default value from consignee/PO
  #9  Vessel sync → store (Shipping Particular tab)
  #15 Note feature (add/edit/delete, always editable)
  #16 Note auto-save on click-outside
  #17 Empty field filter flag (for print template)
-->
<template>
  <div class="tab-page">
    <div class="tab-content">
      <!-- ================================================ -->
      <!-- SECTION 1: Title + Reference fields               -->
      <!--                                                    -->
      <!-- Layout:                                            -->
      <!--  |          PACKING LIST          |               -->
      <!--  |      [ date picker      ]      |               -->
      <!--  |  INVOICE NO. : 110008  [input] |               -->
      <!--  |  PO NO :       [input        ] |               -->
      <!--  |  PROFORMA :    [input        ] |               -->
      <!--                                                    -->
      <!-- All rows are centered as one block.               -->
      <!-- Label (right-align) + field inline per row.       -->
      <!-- ================================================ -->
      <div class="section">
        <h2 class="section-title">
          PACKING LIST
        </h2>

        <!-- Centered ref block -->
        <div class="ref-block">
          <!-- Date — full-width within block, no label -->
          <div class="ref-row">
            <div class="ref-row__label" />
            <div class="ref-row__field">
              <template v-if="!isReadonly">
                <VTextField
                  :model-value="formData.date"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-calendar"
                  :error-messages="getError('date').value"
                  @update:model-value="(v) => handleDateChange(v)"
                />
                <div
                  v-if="dateWarning"
                  class="field-warning"
                >
                  {{ dateWarning }}
                </div>
              </template>
              <span
                v-else
                class="ref-row__text"
              >{{ formData.date }}</span>
            </div>
          </div>

          <!-- INVOICE NO. : [bold auto number] [suffix input] -->
          <div class="ref-row">
            <div class="ref-row__label">
              INVOICE NO. :
            </div>
            <div class="ref-row__field ref-row__field--invoice">
              <template v-if="!isReadonly">
                <!-- System-generated running number (read-only) -->
                <span class="invoice-num">{{ formData.invoiceNo || nextInvoiceNumber }}</span>
                <!-- Optional suffix input e.g. (C-2509155) -->
                <VTextField
                  :model-value="invoiceSuffix"
                  variant="outlined"
                  density="compact"
                  hide-details
                  placeholder="(C-2509155)"
                  class="invoice-suffix"
                  @update:model-value="handleSuffixChange"
                />
              </template>
              <span
                v-else
                class="ref-row__text"
              >
                {{ formData.invoiceNo }}
                <template v-if="invoiceSuffix">&nbsp;({{ invoiceSuffix }})</template>
              </span>
            </div>
          </div>

          <!-- PO NO -->
          <div class="ref-row">
            <div class="ref-row__label">
              PO NO :
            </div>
            <div class="ref-row__field">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.poNo"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('poNo', v)"
              />
              <span
                v-else
                class="ref-row__text"
              >{{ formData.poNo }}</span>
            </div>
          </div>

          <!-- PROFORMA INVOICE NO. -->
          <div class="ref-row">
            <div class="ref-row__label">
              PROFORMA INVOICE NO. :
            </div>
            <div class="ref-row__field">
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.proformaInvoiceNo"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('proformaInvoiceNo', v)"
              />
              <span
                v-else
                class="ref-row__text"
              >{{ formData.proformaInvoiceNo }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 2: Payer | Consignee | Payment + Due Date -->
      <!-- ================================================ -->
      <div class="section">
        <div class="party-grid">
          <!-- Payer — read-only from Shipment Plan -->
          <div class="party-block">
            <VBtn
              class="party-select-btn"
              color="primary"
              density="compact"
              prepend-icon="mdi-account-search-outline"
              size="small"
              variant="text"
              :disabled="isReadonly"
              @click="openPartyDialog('payer')"
            >
              Payer :
            </VBtn>
            <div class="party-block__body">
              <div>{{ formData.payer?.name }}</div>
              <div>{{ formData.payer?.address }}</div>
              <div v-if="formData.payer?.address2">
                {{ formData.payer.address2 }}
              </div>
              <div>{{ formData.payer?.city }} {{ formData.payer?.country }}</div>
              <div v-if="formData.payer?.tel">
                TEL.: {{ formData.payer.tel }}
              </div>
              <div v-if="formData.payer?.attn">
                ATTN : {{ formData.payer.attn }}
              </div>
            </div>
          </div>

          <!-- Consignee — read-only from Shipment Plan -->
          <div class="party-block">
            <VBtn
              class="party-select-btn"
              color="primary"
              density="compact"
              prepend-icon="mdi-account-search-outline"
              size="small"
              variant="text"
              :disabled="isReadonly"
              @click="openPartyDialog('consignee')"
            >
              Consignee :
            </VBtn>
            <div class="party-block__body">
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
            </div>
          </div>

          <!-- Payment + Due Date (#3 Due Date auto-calc) -->
          <div class="party-block party-block--inputs">
            <div class="kv-pair">
              <span class="kv-pair__label">Payment :</span>
              <VSelect
                v-if="!isReadonly"
                :model-value="formData.payment"
                :items="PAYMENT_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                class="kv-pair__input"
                @update:model-value="(v) => handlePaymentChange(v)"
              />
              <span
                v-else
                class="kv-pair__value"
              >{{ formData.payment }}</span>
            </div>
            <div class="kv-pair kv-pair--spaced">
              <span class="kv-pair__label">Due Date :</span>
              <!-- #3: Auto-calculated; shown as read-only with badge -->
              <div
                v-if="!isReadonly"
                class="due-date-wrap"
              >
                <VTextField
                  :model-value="formData.dueDate"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-calendar"
                  class="kv-pair__input"
                  :readonly="isDueDateAutoCalc"
                  :bg-color="isDueDateAutoCalc ? 'grey-lighten-4' : undefined"
                  @update:model-value="(v) => updateField('dueDate', v)"
                />
                <VTooltip
                  v-if="isDueDateAutoCalc"
                  text="Calculated automatically from Payment + ETD/ETA"
                  location="top"
                >
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      class="due-date-info"
                      size="16"
                      color="info"
                    >
                      mdi-information-outline
                    </VIcon>
                  </template>
                </VTooltip>
              </div>
              <span
                v-else
                class="kv-pair__value"
              >{{ formData.dueDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION: Shipping                                  -->
      <!-- ================================================ -->
      <div class="section">
        <template v-if="isAirMode">
          <div class="air-ship-layout">
            <div class="air-ship-layout__left">
              <div class="air-ship-flight">
                <span class="ship-label">Fight :</span>
                <div class="air-ship-flight__body">
                  <VTextField
                    v-if="!isReadonly"
                    :model-value="formData.feeder"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="(v) => updateField('feeder', v)"
                  />
                  <span v-else>{{ formData.feeder }}</span>

                  <div class="air-ship-subfield">
                    <span class="air-ship-subfield__label">MAWB NO.</span>
                    <VTextField
                      v-if="!isReadonly"
                      :model-value="formData.mawbNo"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @update:model-value="(v) => updateField('mawbNo', v)"
                    />
                    <span v-else>{{ formData.mawbNo }}</span>
                  </div>

                  <div class="air-ship-subfield">
                    <span class="air-ship-subfield__label">HAWB NO.</span>
                    <VTextField
                      v-if="!isReadonly"
                      :model-value="formData.hawbNo"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @update:model-value="(v) => updateField('hawbNo', v)"
                    />
                    <span v-else>{{ formData.hawbNo }}</span>
                  </div>
                </div>
              </div>

              <div class="air-ship-route">
                <div class="ship-cell ship-cell--wide">
                  <span class="ship-label">From :</span>
                  <VAutocomplete
                    v-if="!isReadonly"
                    :model-value="formData.from"
                    :items="PORT_OPTIONS"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="(v) => updateField('from', v)"
                  />
                  <span v-else>{{ formData.from }}</span>
                </div>
                <div class="ship-cell ship-cell--wide">
                  <span class="ship-label">To :</span>
                  <VAutocomplete
                    v-if="!isReadonly"
                    :model-value="formData.to"
                    :items="PORT_OPTIONS"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="(v) => updateField('to', v)"
                  />
                  <span v-else>{{ formData.to }}</span>
                </div>
              </div>
            </div>

            <div class="air-ship-layout__right">
              <div class="air-ship-time">
                <span class="ship-label">ETD :</span>
                <div class="ship-datetime">
                  <VTextField
                    v-if="!isReadonly"
                    :model-value="formData.etd"
                    type="date"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-calendar"
                    @update:model-value="(v) => handleEtdChange(v)"
                  />
                  <VTextField
                    v-if="!isReadonly"
                    :model-value="formData.etdTime"
                    type="time"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-clock-outline"
                    @update:model-value="(v) => updateField('etdTime', v)"
                  />
                  <template v-else>
                    <span>{{ formData.etd }}</span>
                    <span>{{ formatTimeDisplay(formData.etdTime) }}</span>
                  </template>
                </div>
              </div>

              <div class="air-ship-time air-ship-time--spaced">
                <span class="ship-label">ETA:</span>
                <div class="ship-datetime">
                  <VTextField
                    v-if="!isReadonly"
                    :model-value="formData.eta"
                    type="date"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-calendar"
                    @update:model-value="(v) => handleEtaChange(v)"
                  />
                  <VTextField
                    v-if="!isReadonly"
                    :model-value="formData.etaTime"
                    type="time"
                    variant="outlined"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-clock-outline"
                    @update:model-value="(v) => updateField('etaTime', v)"
                  />
                  <template v-else>
                    <span>{{ formData.eta }}</span>
                    <span>{{ formatTimeDisplay(formData.etaTime) }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="ship-grid">
            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">{{ primaryShipLabel }}</span>
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.feeder"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('feeder', v)"
              />
              <span v-else>{{ formData.feeder }}</span>
            </div>

            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">{{ secondaryShipLabel }}</span>
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.vessel"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => handleVesselChange(v)"
              />
              <span v-else>{{ formData.vessel }}</span>
            </div>

            <div class="ship-cell ship-cell--narrow">
              <span class="ship-label">ETD :</span>
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.etd"
                type="date"
                variant="outlined"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-calendar"
                @update:model-value="(v) => handleEtdChange(v)"
              />
              <span v-else>{{ formData.etd }}</span>
            </div>
          </div>

          <div class="ship-grid ship-grid--spaced">
            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">From :</span>
              <VAutocomplete
                v-if="!isReadonly"
                :model-value="formData.from"
                :items="PORT_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('from', v)"
              />
              <span v-else>{{ formData.from }}</span>
            </div>
            <div class="ship-cell ship-cell--wide">
              <span class="ship-label">To :</span>
              <VAutocomplete
                v-if="!isReadonly"
                :model-value="formData.to"
                :items="PORT_OPTIONS"
                variant="outlined"
                density="compact"
                hide-details
                @update:model-value="(v) => updateField('to', v)"
              />
              <span v-else>{{ formData.to }}</span>
            </div>
            <div class="ship-cell ship-cell--narrow">
              <span class="ship-label">ETA:</span>
              <VTextField
                v-if="!isReadonly"
                :model-value="formData.eta"
                type="date"
                variant="outlined"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-calendar"
                @update:model-value="(v) => handleEtaChange(v)"
              />
              <span v-else>{{ formData.eta }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 3: Items Table                             -->
      <!-- ================================================ -->
      <div class="section">
        <div class="section--item--table">
          <div class="tbl-head">
            <div class="tbl-c tbl-c--marks">
              MARKS &amp; NOS
            </div>
            <div class="tbl-c tbl-c--desc">
              DESCRIPTION OF GOODS
            </div>
            <div class="tbl-c tbl-c--pkg">
              PACKAGE
            </div>
            <div class="tbl-c tbl-c--wt">
              NET WEIGHT (KGS)
            </div>
            <div class="tbl-c tbl-c--wt">
              GROSS WEIGHT (KGS)
            </div>
          </div>

          <div
            v-for="(item, idx) in formData.items"
            :key="item.id || idx"
            class="tbl-body"
          >
            <!-- MARKS & NOS — #8: default from consignee/PO, editable -->
            <div class="tbl-c tbl-c--marks">
              <VTextarea
                v-if="!isReadonly"
                :model-value="item.marksAndNos"
                variant="outlined"
                density="compact"
                hide-details
                rows="3"
                auto-grow
                @update:model-value="(v) => handleItemUpdate(idx, 'marksAndNos', v)"
              />
              <div v-else>
                <div
                  v-for="(line, li) in splitLines(item.marksAndNos)"
                  :key="li"
                >
                  {{ line }}
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="tbl-c tbl-c--desc">
              <template v-if="!isReadonly">
                <VTextField
                  :model-value="item.descriptionOfGoods"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="tbl-field--spaced"
                  @update:model-value="(v) => handleItemUpdate(idx, 'descriptionOfGoods', v)"
                />
                <VTextField
                  :model-value="item.subDescription"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="(v) => handleItemUpdate(idx, 'subDescription', v)"
                />
                <VCheckbox
                  :model-value="!!item.isSample"
                  label="SAMPLE"
                  density="compact"
                  hide-details
                  class="sample-checkbox"
                  @update:model-value="(v) => handleItemUpdate(idx, 'isSample', v)"
                />
                <VTextarea
                  v-if="item.isSample"
                  :model-value="item.sampleDescription || DEFAULT_SAMPLE_DESCRIPTION"
                  variant="outlined"
                  density="compact"
                  hide-details
                  rows="4"
                  auto-grow
                  class="sample-description"
                  @update:model-value="(v) => handleItemUpdate(idx, 'sampleDescription', v)"
                />
              </template>
              <template v-else>
                <div>{{ item.descriptionOfGoods }}</div>
                <div
                  v-if="item.subDescription"
                  class="text-muted"
                >
                  ({{ item.subDescription }})
                </div>
                <div
                  v-if="item.isSample"
                  class="sample-text"
                >
                  <div
                    v-for="(line, li) in splitLines(item.sampleDescription || DEFAULT_SAMPLE_DESCRIPTION)"
                    :key="li"
                  >
                    {{ line }}
                  </div>
                </div>
              </template>
            </div>

            <!-- Package + Tare -->
            <div class="tbl-c tbl-c--pkg">
              <template v-if="!isReadonly">
                <!-- Row 1: Package type — full width -->
                <VSelect
                  :model-value="item.packageType"
                  :items="PACKAGE_TYPES"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="pkg-type-select"
                  @update:model-value="(v) => handleItemUpdate(idx, 'packageType', v)"
                />

                <!--
                  TRUE 4-column grid — both rows have exactly 4 independent cells.
                  grid-template-columns: auto | 1fr | auto | auto
                  Row 2: [160] | [DRUM▼] | [40] | [PALLET]
                  Row 3: [Tare W.(KG)] | [2.00] | [Tare W.(KG)] | [5.00▼]
                -->
                <div class="pkg-tare-grid">
                  <!-- ── Row 2 ── -->
                  <VTextField
                    :model-value="item.quantity"
                    type="number"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="ptg-qty"
                    @update:model-value="(v) => handleItemUpdate(idx, 'quantity', Number(v))"
                  />
                  <span class="ptg-pallet-label">{{ item.unitType }}</span>


                  <span class="ptg-tare-text">Tare Weight (KG)</span>
                  <span class="ptg-tare-val">{{ fmtDec(item.tareWeightDrum) }}</span>

                 

                  <!-- ── Row 3: each cell aligns under row 2 ── -->
                  <VTextField
                    :model-value="item.palletCount"
                    type="number"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="ptg-pallet"
                    @update:model-value="(v) => handleItemUpdate(idx, 'palletCount', Number(v))"
                  />
                  <span class="ptg-pallet-label">PALLET</span>
                  
                  
                  <span
                    class="ptg-tare-text"
                    :style="{ visibility: item.palletCount > 0 ? 'visible' : 'hidden' }"
                  >Tare Weight (KG)</span>

                  <VSelect
                    v-if="item.palletCount > 0"
                    :model-value="item.tareWeightPallet"
                    :items="TARE_PALLET_MASTER"
                    item-title="value"
                    item-value="value"
                    variant="outlined"
                    class="ptg-pallet"
                    density="compact"
                    hide-details
                    @update:model-value="(v) => handleItemUpdate(idx, 'tareWeightPallet', Number(v))"
                  />
                  <span v-else />
                </div>

              <!-- Row 4: packaging summary -->
              <!--
                <div class="pkg-summary-label">
                {{ buildPackagingLabel(item) }}
                </div> 
              -->
              </template>

              <template v-else>
                <div v-if="item.packageType || item.package">
                  {{ item.packageType || item.package }}
                </div>
                <div
                  v-if="buildPackagingLabel(item)"
                  class="text-muted"
                >
                  {{ buildPackagingLabel(item) }}
                </div>
              </template>
            </div>

            <!-- Net Weight -->
            <div class="tbl-c tbl-c--wt text-right">
              <VTextField
                v-if="!isReadonly"
                :model-value="item.netWeight"
                type="number"
                variant="outlined"
                density="compact"
                hide-details
                style="min-width: 100px;"
                reverse
                @update:model-value="(v) => handleItemUpdate(idx, 'netWeight', Number(v))"
              />
              <span v-else>{{ fmtNum(item.netWeight) }}</span>
            </div>

            <!-- #4: Gross Weight — auto-calculated, read-only badge -->
            <div class="tbl-c tbl-c--wt text-right">
              <div
                v-if="!isReadonly"
                class="gross-weight-wrap"
              >
                <VTextField
                  :model-value="item.grossWeight"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  reverse
                  style="min-width: 100px;"
                  bg-color="grey-lighten-4"
                  readonly
                />
                <VTooltip
                  text="Auto-calculated: Net + (Qty × Tare) + (Pallets × Tare Pallet)"
                  location="top"
                >
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      class="gross-info"
                      size="14"
                      color="info"
                    >
                      mdi-information-outline
                    </VIcon>
                  </template>
                </VTooltip>
              </div>
              <span v-else>{{ fmtNum(item.grossWeight) }}</span>
            </div>
            <div
              v-if="!isReadonly"
              class="tbl-c tbl-c--actions"
            >
              <VBtn
                icon="mdi-plus"
                size="x-small"
                variant="text"
                color="success"
                @click="addItemAfter(idx)"
              />
              <VBtn
                icon="mdi-delete-outline"
                size="x-small"
                variant="text"
                color="error"
                :disabled="formData.items.length <= 1"
                @click="removeItem(idx)"
              />
            </div>
          </div>

          <!-- Totals -->
          <div class="tbl-foot">
            <div class="tbl-c tbl-c--marks tbl-c--bold">
              Total
            </div>
            <div class="tbl-c tbl-c--desc" />
            <div class="tbl-c tbl-c--pkg" />
            <div class="tbl-c tbl-c--wt tbl-c--bold text-right">
              {{ fmtNum(totalNet) }}
            </div>
            <div class="tbl-c tbl-c--wt tbl-c--bold text-right">
              {{ fmtNum(totalGross) }}
            </div>
            <div
              v-if="!isReadonly"
              class="tbl-c tbl-c--actions"
            />
          </div>

          <div
            v-if="!formData.items?.length"
            class="tbl-empty"
          >
            No items
          </div>
        </div>
      </div>

      <!-- ================================================ -->
      <!-- SECTION 4: Footer (display text only)              -->
      <!-- ================================================ -->
      <div class="section">
        <div
          v-for="f in FOOTER_FIELDS"
          :key="f.key"
          class="info-row"
        >
          <!-- #17: Only display if value exists -->
          <template v-if="formData[f.key]">
            <span
              v-if="f.key === 'lotNo'"
              class="info-row__label"
            >{{ f.label }}</span>
            <span
              v-else
              class="info-row__label"
            >{{ f.label }}</span>
            <span
              v-if="f.key === 'lotNo'"
              class="info-row__value"
            >
              <VTextField
                :model-value="formData.lotNo"
                variant="outlined"
                density="compact"
                hide-details
                class=""
                style="max-width: 500px;"
                @update:model-value="(v) => updateField('lotNo', v)"
              />
            </span>
            <span
              v-else-if="f.key === 'hsCode'"
              class="info-row__value"
            >
              <VSelect
                :model-value="formData.hsCode"
                :items="HS_CODE_TYPES"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 500px;"
                class=""
                @update:model-value="(v) => updateField('hsCode', v)"
              />
            </span>
            <span
              v-else
              class="info-row__value"
            >{{ formData[f.key] }}</span>
          </template>
        </div>
      </div>
    </div>

    <VDialog
      v-model="partyDialogOpen"
      max-width="980"
      scrollable
    >
      <VCard>
        <VCardTitle class="party-dialog__title">
          Select {{ activePartyLabel }}
        </VCardTitle>
        <VCardText>
          <VTextField
            v-model="partySearch"
            class="party-dialog__search"
            clearable
            density="compact"
            hide-details
            label="Search company, address, tel, tax id"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />

          <VTable
            class="party-dialog__table"
            density="compact"
            hover
          >
            <thead>
              <tr>
                <th
                  v-for="header in partyTableHeaders"
                  :key="header.key"
                  :class="header.class"
                >
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="party in filteredPartyOptions"
                :key="party.id"
              >
                <td>{{ party.name }}</td>
                <td>
                  <div class="party-dialog__address">
                    <div>{{ party.address }}</div>
                    <div v-if="party.address2">
                      {{ party.address2 }}
                    </div>
                    <div v-if="party.address3">
                      {{ party.address3 }}
                    </div>
                  </div>
                </td>
                <td>{{ party.country }}</td>
                <td>{{ party.taxId }}</td>
                <td>{{ party.tel }}</td>
                <td>{{ party.attn }}</td>
                <td class="party-dialog__action">
                  <VBtn
                    color="primary"
                    size="small"
                    variant="flat"
                    @click="selectParty(party)"
                  >
                    Select
                  </VBtn>
                </td>
              </tr>
              <tr v-if="filteredPartyOptions.length === 0">
                <td
                  class="party-dialog__empty"
                  colspan="7"
                >
                  No data found
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="partyDialogOpen = false"
          >
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <TabActionBar
      v-model:selected-target="printTarget"
      :tab-key="TabKey.PACKING_LIST"
      :is-loading="isLoading"
      :is-dirty="isDirty"
      :notes="notes"
      :is-printing="isPrinting"
      :can-print="!isReadonly"
      :print-targets="printTargets"
      :print-config="{
        buyer: {
          hasDisplay: true,
          displayFields: PRINT_DISPLAY_FIELDS.buyer
        },
        customs: {
          hasDisplay: true,
          displayFields: PRINT_DISPLAY_FIELDS.customs
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
import { computed, ref, watch } from 'vue'
import { TabKey } from '../../types/shipDocument'
import { useTabForm } from '../../composables/useTabForm'
import { usePrint } from '../../composables/usePrint'
import { useShipDocumentStore } from '../../stores/shipDocumentStore'
import { tabApiMap } from '../../services/shipDocumentApi'
import {
  DEFAULT_SAMPLE_DESCRIPTION,
  buildItemPackageSummary,
  buildPackingNames,
  buildPackagingSummary,
  buildTotalGross,
  buildTotalNet,
} from '../../utils/packingDerived'
import TabActionBar from '../shared/TabActionBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// อ่าน ?mode=ocean จาก URL  ← แทน props.tabKey ที่ไม่มีค่า
const shippMode = computed(() => route.query.mode || 'ocean')
const isAirMode = computed(() => shippMode.value === 'air')
const isCourierMode = computed(() => shippMode.value === 'courier')
const primaryShipLabel = computed(() => (isCourierMode.value ? 'Courier :' : 'Feeder :'))
const secondaryShipLabel = computed(() => (isCourierMode.value ? 'AWB No. :' : 'Vessel :'))

// ─── Constants ───────────────────────────────────────────────────────────────

const PAYMENT_OPTIONS = ['T/T in advance', 'L/C', 'D/P', 'D/A']
const PORT_OPTIONS    = ['LAEM CHABANG, THAILAND', 'HCM CITY, VIETNAM', 'HAIPHONG, VIETNAM', 'BANGKOK, THAILAND']
const PACKAGE_TYPES   = ['250KG PLASTIC DRUM', '200KG PLASTIC DRUM', '1000KG IBC TANK', '25KG BAG', 'BOTTLE']
const UNIT_TYPES      = ['DRUM', 'CARTON', 'BAG', 'BOTTLE']

const PARTY_OPTIONS = {
  payer: [
    {
      id: 'payer-age-dor',
      name: "AGE D'OR PTE LTD",
      address: '25 BUKIT BATOK CRESCENT',
      address2: '#06-13 THE ELITIST',
      city: 'SINGAPORE',
      country: '658066',
      tel: '+65 6776 5228',
      taxId: '198305357N',
      attn: 'MS. POOI YEE',
    },
    {
      id: 'payer-toyotsu',
      name: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
      address: '607 ASOKE-DINDAENG ROAD',
      address2: 'DINDAENG',
      city: 'BANGKOK',
      country: 'THAILAND',
      tel: '+66 2 248 1000',
      taxId: '0105530000000',
      attn: 'PURCHASING DEPARTMENT',
    },
    {
      id: 'payer-sanyo',
      name: 'SANYO CHEMICAL INDUSTRIES, LTD.',
      address: '11-1, IKEDA-CHO',
      address2: 'HIGASHIYAMA-KU',
      city: 'KYOTO',
      country: 'JAPAN',
      tel: '+81 75 541 4311',
      taxId: 'JP-2000000000',
      attn: 'EXPORT TEAM',
    },
  ],
  consignee: [
    {
      id: 'consignee-ath',
      name: 'ATH CO., LTD',
      address: '53 QUANG TRUNG STREET',
      address2: '#17-02B PRIME CENTRE',
      address3: 'HAI BA TRUNG WARD',
      city: 'HANOI',
      country: 'VIETNAM',
      tel: '(848) 822 9362 - 3',
      taxId: '0101509379',
      attn: 'MS. TRANG',
    },
    {
      id: 'consignee-toyotsu',
      name: 'TOYOTSU CHEMIPLAS(THAILAND)CO.,LTD.',
      address: '607 ASOKE-DINDAENG ROAD',
      address2: 'DINDAENG',
      city: 'BANGKOK',
      country: 'THAILAND',
      tel: '+66 2 248 1000',
      taxId: '0105530000000',
    },
    {
      id: 'consignee-sanyo',
      name: 'SANYO CHEMICAL INDUSTRIES, LTD.',
      address: '11-1, IKEDA-CHO',
      address2: 'HIGASHIYAMA-KU',
      city: 'KYOTO',
      country: 'JAPAN',
      tel: '+81 75 541 4311',
      taxId: 'JP-1000000000',
    },
  ],
}

const partyTableHeaders = [
  { title: 'name', key: 'name' },
  { title: 'address', key: 'address' },
  { title: 'country', key: 'country' },
  { title: 'tax no', key: 'taxId' },
  { title: 'tel', key: 'tel' },
  { title: 'ATTN', key: 'attn' },
  { title: 'Action', key: 'actions', class: 'text-center' },
]

const FOOTER_FIELDS = [
  { key: 'packing',         label: 'PACKING :'           },
  { key: 'countryOfOrigin', label: 'COUNTRY OF ORIGIN :' },
  { key: 'makerName',       label: 'MAKER NAME :'        },
  { key: 'packaging',       label: 'PACKAGING :'         },
  { key: 'lotNo',           label: 'Lot No :'            },
  { key: 'hsCode',          label: 'HS CODE :'            },
]

// ─── #5 Master: Tare Weight per Package Type ─────────────────────────────────
// SOURCE: Replace with API call to your master data endpoint
const TARE_WEIGHT_BY_PACKAGE = {
  '250KG PLASTIC DRUM': 2.00,
  '200KG PLASTIC DRUM': 1.80,
  '1000KG IBC TANK': 5.00,
  '25KG BAG': 0.50,
  BOTTLE: 0.10,
}

// ─── #6 Master: Tare Weight options for Pallets ──────────────────────────────
// SOURCE: Replace with API call to your master data endpoint
const TARE_PALLET_MASTER = [
  { title: 'Plastic Pallet (3 kg)',    value: 3.00 },
  { title: 'Wood Pallet (5 kg)',       value: 5.00 },
  { title: 'Heavy Wood Pallet (6 kg)', value: 6.00 },
  { title: 'Export Pallet (4 kg)',     value: 4.00 },
]

// ─── #3 Payment → Due Date offset rules ──────────────────────────────────────
// base: which date to add offset to ('etd' or 'eta')
// offsetDays: number of days to add
const DUE_DATE_RULES = {
  'T/T in advance': { base: 'etd', offsetDays: 0   },
  'L/C': { base: 'etd', offsetDays: 30  },
  'D/P': { base: 'eta', offsetDays: 0   },
  'D/A': { base: 'eta', offsetDays: 30  },
}

// ─── #4 HS Code Types ────────────────────────────────────────────────────────
const HS_CODE_TYPES = [
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
  { title: '3906.90.20',    value: '3906.90.20' },
]

// ─── #7 Print Display Fields ────────────────────────────────────────────────
const PRINT_DISPLAY_FIELDS = {
  buyer: ['lotNo', 'productDescription', 'note'],
  customs: ['lotNo'],
}

// ─── Store + Composables ─────────────────────────────────────────────────────

const store = useShipDocumentStore()

const {
  formData, isDirty, isLoading, isReadonly,
  updateField, saveDraft, confirm, getError,
} = useTabForm(TabKey.PACKING_LIST, {
  onSaveDraft: data => tabApiMap[TabKey.PACKING_LIST].save(store.documentId, data),
  onConfirm: data => tabApiMap[TabKey.PACKING_LIST].confirm(store.documentId, data),
  validate: data => {
    const errors = {}

    if (!data.date) {
      errors.date = ['Date is required']
    } else if (dateWarning.value) {
      // #2: Block save when date is before previous invoice
      errors.date = [dateWarning.value]
    }

    if (!data.invoiceNo) errors.invoiceNo = ['Invoice No. is required']

    return Object.keys(errors).length > 0 ? errors : null
  },
})

const partyDialogOpen = ref(false)
const activePartyType = ref('payer')
const partySearch = ref('')

const activePartyLabel = computed(() => (
  activePartyType.value === 'payer' ? 'Payer' : 'Consignee'
))

const filteredPartyOptions = computed(() => {
  const keyword = String(partySearch.value || '').trim().toLowerCase()
  const options = PARTY_OPTIONS[activePartyType.value] || []

  if (!keyword) return options

  return options.filter(option => [
    option.name,
    option.address,
    option.address2,
    option.address3,
    option.city,
    option.country,
    option.tel,
    option.attn,
    option.taxId,
  ].filter(Boolean).join(' ').toLowerCase().includes(keyword))
})

function openPartyDialog(type) {
  if (isReadonly.value) return

  activePartyType.value = type
  partySearch.value = ''
  partyDialogOpen.value = true
}

function syncPartyToLinkedTabs(type, partyData) {
  Object.values(TabKey).forEach(tabKey => {
    if (tabKey === TabKey.PACKING_LIST) return

    const tabData = store.tabs?.[tabKey]?.data
    if (!tabData || !(type in tabData)) return

    store.updateTabData(tabKey, { [type]: { ...partyData } })
  })
}

function selectParty(party) {
  const partyData = { ...party }

  delete partyData.id

  updateField(activePartyType.value, partyData)
  syncPartyToLinkedTabs(activePartyType.value, partyData)
  partyDialogOpen.value = false
}

// const { print: handlePrint } = usePrint(TabKey.PACKING_LIST)

const { isPrinting, print } = usePrint(
  TabKey.PACKING_LIST,
  () => ({
    ...formData.value,
    note: notes.value[0]?.text ?? '',  // ← merge note ตรงนี้
  }),
)

const printTarget = ref('buyer')

const printTargets = [
  { label: 'For Buyer', value: 'buyer' },
  { label: 'For Customs', value: 'customs' },
]

function handlePrint(payload) {
  print(
    payload.target,
    payload.display,
    shippMode.value,
  )
}

// ─── #1: Invoice Running Number ───────────────────────────────────────────────
// `store.nextInvoiceNumber` — the backend-generated next sequential number
// The prefix is read-only; only the suffix (in parentheses) is user-editable
const nextInvoiceNumber = computed(() => store.nextInvoiceNumber || formData.value.invoiceNo || '')
const invoiceSuffix     = ref(formData.value.contractNo || '')

function handleSuffixChange(val) {
  invoiceSuffix.value = val

  // Store suffix separately so print template can format "INV# (SUFFIX)"
  updateField('contractNo', val)
}

// ─── #2: Date validation — new date must be >= last invoice date ──────────────
const dateWarning = computed(() => {
  const lastDate = store.lastInvoiceDate // e.g. '2026-02-05' from store
  if (!lastDate || !formData.value.date) return null

  const current  = new Date(formData.value.date)
  const previous = new Date(lastDate)

  if (current < previous) {
    return `Date cannot be earlier than previous invoice (${lastDate})`
  }
  
  return null
})

function handleDateChange(val) {
  updateField('date', val)

  // Re-calculate due date when date changes
  recalcDueDate(formData.value.payment, formData.value.etd, formData.value.eta)
}

// ─── #3: Due Date auto-calculation ───────────────────────────────────────────
const isDueDateAutoCalc = computed(() => !!DUE_DATE_RULES[formData.value.payment])

function calcDueDate(payment, etd, eta) {
  const rule = DUE_DATE_RULES[payment]
  if (!rule) return null

  const baseStr = rule.base === 'etd' ? etd : eta
  if (!baseStr) return null

  const d = new Date(baseStr)

  d.setDate(d.getDate() + rule.offsetDays)
  
  return d.toISOString().split('T')[0]
}

function recalcDueDate(payment, etd, eta) {
  const calculated = calcDueDate(payment, etd, eta)
  if (calculated) updateField('dueDate', calculated)
}

function handlePaymentChange(val) {
  updateField('payment', val)
  recalcDueDate(val, formData.value.etd, formData.value.eta)
}

function handleEtdChange(val) {
  updateField('etd', val)
  recalcDueDate(formData.value.payment, val, formData.value.eta)
}

function handleEtaChange(val) {
  updateField('eta', val)
  recalcDueDate(formData.value.payment, formData.value.etd, val)
}

// ─── #9: Vessel sync to Shipping Particular tab ───────────────────────────────
function handleVesselChange(val) {
  updateField('vessel', val)

  // Syncs to store so ShippingParticularTab can read it
  store.syncVessel(val)
}

// ─── #4: Gross Weight auto-calculation ───────────────────────────────────────
// Formula: (quantity × tareWeightDrum) + (palletCount × tareWeightPallet) + netWeight
function calcGrossWeight(item) {
  const net     = Number(item.netWeight)      || 0
  const qty     = Number(item.quantity)       || 0
  const tare    = Number(item.tareWeightDrum) || 0
  const pallets = Number(item.palletCount)    || 0
  const tarePlt = Number(item.tareWeightPallet) || 0
  
  return net + (qty * tare) + (pallets * tarePlt)
}

// ─── #7: PACKAGING label builder ─────────────────────────────────────────────
// e.g. "160 DRUMS (40 PALLETS)" or "160 DRUMS"
function buildPackagingLabel(item) {
  return buildItemPackageSummary(item)
}

// ─── #8 Default MARKS & NOS from consignee/PO ────────────────────────────────
function buildDefaultMarks() {
  const parts = []
  if (formData.value.consignee?.name)    parts.push(formData.value.consignee.name)
  if (formData.value.poNo)               parts.push(formData.value.poNo)
  if (formData.value.consignee?.city)    parts.push(formData.value.consignee.city?.toUpperCase())
  
  return parts.join('\n')
}

function applyPackageDefaults(item, packageType) {
  item.tareWeightDrum = TARE_WEIGHT_BY_PACKAGE[packageType] ?? 0

  if (!item.unitType || packageType === 'BOTTLE') {
    item.unitType = packageType === 'BOTTLE' ? 'BOTTLE' : 'DRUM'
  }
}

function applyItemSideEffects(item, field, value) {
  if (field === 'packageType') applyPackageDefaults(item, value)
  if (field === 'isSample' && value && !item.sampleDescription) item.sampleDescription = DEFAULT_SAMPLE_DESCRIPTION
  if (field === 'palletCount' && Number(value) === 0) item.tareWeightPallet = 0
}

function shouldRecalculateGross(field) {
  return ['netWeight', 'quantity', 'tareWeightDrum', 'palletCount', 'tareWeightPallet', 'packageType'].includes(field)
}

function shouldSyncSummaries(field) {
  return ['quantity', 'unitType', 'palletCount', 'packageType'].includes(field)
}

function applyMarksState(item, field, value) {
  if (field !== 'marksAndNos') return
  if (!value && !item.marksNosManuallySet) item.marksAndNos = buildDefaultMarks()

  item.marksNosManuallySet = true
}

// ─── Item Update handler (central) ───────────────────────────────────────────
function handleItemUpdate(index, field, value) {
  const items = [...(formData.value.items || [])]

  items[index] = { ...items[index], [field]: value }
  applyItemSideEffects(items[index], field, value)

  // #4: Recalculate Gross Weight
  if (shouldRecalculateGross(field)) {
    items[index].grossWeight = calcGrossWeight(items[index])
  }

  // #7: Auto-update total packing summaries from all items.
  if (shouldSyncSummaries(field)) syncPackingSummaries(items)

  // #8: Set default MARKS & NOS on first edit if blank
  applyMarksState(items[index], field, value)

  updateField('items', items)
}

// ─── Totals ───────────────────────────────────────────────────────────────────
const totalNet   = computed(() => buildTotalNet(formData.value.items || []))
const totalGross = computed(() => buildTotalGross(formData.value.items || []))

function createBlankItem() {
  return {
    id: `item-${Date.now()}`,
    marksAndNos: buildDefaultMarks(),
    descriptionOfGoods: '',
    subDescription: '',
    isSample: false,
    sampleDescription: '',
    packageType: '250KG PLASTIC DRUM',
    quantity: 0,
    unitType: 'DRUM',
    palletCount: 0,
    tareWeightDrum: 2,
    tareWeightPallet: 0,
    netWeight: 0,
    grossWeight: 0,
    unitPrice: 0,
  }
}

function syncPackingSummaries(items) {
  updateField('packing', buildPackingNames(items))
  updateField('packaging', buildPackagingSummary(items))
}

function addItemAfter(index) {
  const items = [...(formData.value.items || [])]

  items.splice(index + 1, 0, createBlankItem())
  updateField('items', items)
  syncPackingSummaries(items)
}

function removeItem(index) {
  const items = [...(formData.value.items || [])]
  if (items.length <= 1) return

  items.splice(index, 1)
  updateField('items', items)
  syncPackingSummaries(items)
}

// ─── #15 #16 Notes ───────────────────────────────────────────────────────────
// Notes are always editable even after Confirm (stored separately from formData)
// ── note เก็บแค่ 1 อัน ──────────────────────────────────────────────────
const notes = ref(
  store.commercialInvoiceNote ? [store.commercialInvoiceNote] : [],
)
 
// เพิ่ม note ได้แค่ครั้งเดียว (ถ้ามีแล้วให้ replace)
function handleAddNote(text) {
  const note = {
    id: Date.now(),
    text,
    date: new Date().toLocaleString('en-GB'),
  }

  notes.value = [note]               // ← replace ไม่ใช่ push
}
 
// แก้ไข note
function handleEditNote({ id, text }) {
  if (notes.value[0]?.id === id) {
    notes.value[0].text = text
  }
}
 
// ลบ note
function handleDeleteNote(noteId) {
  notes.value = notes.value.filter(n => n.id !== noteId)
}
 


// ─── Confirm wrapper ──────────────────────────────────────────────────────────
function handleConfirm() {
  if (dateWarning.value) return   // #2: block confirm when date is invalid
  confirm()
}

// ─── Watchers ─────────────────────────────────────────────────────────────────
// #8: Auto-set MARKS & NOS defaults when items load and field is empty
watch(
  () => formData.value.items,
  items => {
    if (!items?.length) return

    const updated = items.map(item => ({
      ...item,
      marksAndNos: item.marksAndNos || buildDefaultMarks(),
    }))


    // Only patch if any item was missing the default
    const needsPatch = items.some((item, i) => item.marksAndNos !== updated[i].marksAndNos)
    if (needsPatch) updateField('items', updated)
  },
  { immediate: true, deep: false },
)

// Re-init notes from store when document changes
watch(() => store.documentId, () => {
  notes.value = store.packingListNotes || []
})

// ─── Utilities ────────────────────────────────────────────────────────────────
function splitLines(text) {
  return text ? String(text).split('\n') : []
}

function fmtNum(v) {
  return v != null
    ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'
}

function fmtDec(v) {
  return v != null ? Number(v).toFixed(2) : '0.00'
}

function formatTimeDisplay(value) {
  if (!value) return ''

  const [hours, minutes] = String(value).split(':')
  if (hours == null || minutes == null) return value

  const hourNum = Number(hours)
  const suffix = hourNum >= 12 ? 'PM' : 'AM'
  const normalized = ((hourNum + 11) % 12) + 1

  return `${String(normalized).padStart(2, '0')}:${minutes} ${suffix}`
}

function truncate(str, len) {
  return str?.length > len ? str.slice(0, len) + '…' : str
}
</script>

<style src="./css/PackingListTab.css" />
