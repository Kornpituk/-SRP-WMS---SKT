<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'

// 1. รับค่าจาก Parent Component (Props)
const props = defineProps({
  filterForm: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  etdDate: { /* ... */ },
  itemsStatus: { /* ... */ },
  panelState: { /* ... */ },
  disabledBtnExport: { /* ... */ },
})

// 2. ส่งค่ากลับไปยัง Parent Component (Emits)
const emit = defineEmits([
  'update:filterForm', // เพิ่มตัวนี้สำคัญมาก
  'update:etdDate',
  'update:panelState',
  'search',
  'clear',
  'export',
])

// --- ส่วนที่ต้องเพิ่มใหม่ (แก้ปัญหา Mutation) ---

// 1. สร้างตัวแปร Local โดยก๊อปปี้ค่ามาจาก Props
const localFilter = ref({ ...props.filterForm })

// 2. ถ้ามีการแก้ไขค่าใน localFilter ให้ส่งค่ากลับไปอัปเดตที่ Parent
watch(localFilter, newVal => {
  emit('update:filterForm', newVal)
}, { deep: true })

// 3. (เผื่อไว้) ถ้า Parent มีการเปลี่ยนค่า (เช่น สั่ง Clear form จากข้างนอก) ให้ Local อัปเดตตาม
watch(() => props.filterForm, newVal => {
  // ใช้ Object.assign เพื่ออัปเดตค่าโดยไม่เปลี่ยน Reference
  Object.assign(localFilter.value, newVal)
}, { deep: true })

// ---------------------------------------------

// Helper สำหรับ v-model ของ Props (เพื่อไม่ให้ Mutate Props โดยตรงแบบผิดวิธี)
// หมายเหตุ: สำหรับ Object (filterForm) ถ้าแก้ค่าข้างใน Vue 3 reactive จะทำงานได้ แต่ถ้าให้ดีควรใช้ emit update
const localEtdDate = computed({
  get: () => props.etdDate,
  set: val => emit('update:etdDate', val),
})

const localPanel = computed({
  get: () => props.panelState,
  set: val => emit('update:panelState', val),
})

// ฟังก์ชันกดปุ่ม
const onSearch = () => emit('search')
const onClear = () => emit('clear')
const onExport = () => emit('export')

// Toggle Panel Logic
const togglePanel = () => {
  emit('update:panelState', props.panelState.length ? [] : ['filter'])
}
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center">
          <VRow class="d-flex align-center">
            <VCol cols="2">
              <IconBtn
                class="cursor-pointer"
                color="#FFFFFF"
                :to="{ name: 'skt-receiving' }"
              >
                <VIcon
                  size="30"
                  icon="ri-close-circle-fill"
                  color="#000000"
                />
              </IconBtn>
            </VCol>
            <VCol
              cols="8"
              class="text-center"
            >
              <div>
                <span
                  style="font-size: 22px; font-weight: bold;"
                  class="text-center"
                >{{ $t('Shipment Plan') }}</span>
              </div>
            </VCol>
            <VCol
              cols="2"
              class="d-flex justify-end"
            >
              <VBtn
                variant="flat"
                @click="togglePanel"
              >
                <VIcon icon="ri-equalizer-line" />
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCardTitle>
    </VCard>
  </div>

  <section>
    <div>
      <VExpansionPanels
        v-model="localPanel"
        multiple
      >
        <VExpansionPanel value="filter">
          <VExpansionPanelText>
            <VForm @submit.prevent="onSearch">
              <VRow>
                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VSelect
                    v-model="localFilter.StatusId"
                    :items="itemsStatus"
                    item-title="name"
                    item-value="name"
                    clearable
                    density="compact"
                  >
                    <template #label>
                      <span
                        class="d-flex align-center"
                        style="font-size: 12px;"
                      >
                        Select Status
                      </span>
                    </template>
                    <template #selection="{ item }">
                      <VChip
                        variant="elevated"
                        size="x-small"
                        style="min-height: 20px;"
                        :color="item.raw.color ? item.raw.color : 'grey'"
                      >
                        <span
                          v-if="item.raw.name"
                          class="text-white"
                        >{{ item.raw.name }}</span>
                        <span
                          v-else
                          class="text-white"
                        >All</span>
                      </VChip>
                    </template>
                  </VSelect>
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="localFilter.PayerNameSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Payer Name</span>
                    </template>
                  </VTextField>
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="localFilter.ItemNameSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Item Name</span>
                    </template>
                  </VTextField>
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <AppDateTimePicker
                    v-model="localEtdDate"
                    prepend-inner-icon="ri-calendar-schedule-fill"
                    placeholder="ETD (dd/mm/yyyy To dd/mm/yyyy)"
                    density="compact"
                    style="font-size: 14px;"
                    :config="{ dateFormat: 'd/m/Y', mode: 'range' }"
                  >
                    <template #label>
                      <span style="font-size: 12px;">ETD</span>
                    </template>
                  </AppDateTimePicker>
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="localFilter.SalesOrderNoSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Sale Order No.</span>
                    </template>
                  </VTextField>
                </VCol>

                <VCol
                  cols="12"
                  lg="4"
                  sm="6"
                  class="py-1"
                >
                  <VTextField
                    v-model="localFilter.LotSearch"
                    density="compact"
                  >
                    <template #label>
                      <span style="font-size: 12px;">Lot</span>
                    </template>
                  </VTextField>
                </VCol>

                <VCol cols="8" />
                <VCol
                  cols="12"
                  lg="4"
                  class="py-1"
                >
                  <VRow class="d-flex justify-end">
                    <VCol cols="4">
                      <VBtn
                        height="100%"
                        width="100%"
                        color="green"
                        density="compact"
                        class="mx-0"
                        @click="onSearch"
                      >
                        <span style="font-size: 12px;">{{ $t('Search') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol cols="4">
                      <VBtn
                        color="red"
                        height="100%"
                        width="100%"
                        density="compact"
                        @click="onClear"
                      >
                        <span style="font-size: 12px;">{{ $t('Clear') }}</span>
                      </VBtn>
                    </VCol>
                    <VCol
                      cols="4"
                      md="4"
                    >
                      <VBtn
                        :disabled="!disabledBtnExport"
                        density="compact"
                        class="px-16 px-sm-12 pa-sm-1 custom-small-btn-excel"
                        color="warning"
                        style="width: 100%; height: 40px;"
                        @click="onExport"
                      >
                        <img
                          src="/src/assets/images/icons/vscode-icons_file-type-excel2.png"
                          style="width: 27px;"
                          class="custom-small-img"
                        >
                        <span style="font-size: 12px;">{{ $t('Export file') }}</span>
                      </VBtn>
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VForm>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
  </section>
</template>

<style scoped>
/* ใส่ Style เฉพาะ component ถ้ามี */
</style>
