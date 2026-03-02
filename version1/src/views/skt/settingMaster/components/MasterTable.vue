<!--
  MasterTable.vue
  ─────────────────────────────────────────────────────────────────
  ตารางข้อมูล Master CRUD
  • Auto-generate columns จาก tableFields prop
  • Inline edit mode (EDIT → row กลายเป็น inputs + SAVE/DELETE)
  • Loading skeleton
  • Empty state
  • Action column sticky ด้านขวา
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <div class="table-wrapper">
    <VTable
      density="compact"
      class="master-table"
      hover
      fixed-header
    >
      <!-- ─── thead ──────────────────────────── -->
      <thead>
        <tr>
          <th class="col-no">
            No.
          </th>
          <th
            v-for="field in tableFields"
            :key="field.key"
            :style="field.width ? { width: field.width } : {}"
          >
            {{ field.label }}
          </th>
          <th class="col-action">
            Action
          </th>
        </tr>
      </thead>

      <!-- ─── tbody ──────────────────────────── -->
      <tbody>
        <!-- Empty state -->
        <tr v-if="!loading && items.length === 0">
          <td
            :colspan="tableFields.length + 2"
            class="empty-cell"
          >
            <div class="empty-state">
              <VIcon
                size="40"
                color="grey-lighten-1"
              >
                mdi-database-off-outline
              </VIcon>
              <span>No data found</span>
            </div>
          </td>
        </tr>

        <!-- Loading skeleton -->
        <tr
          v-for="n in 4"
          v-else-if="loading"
          :key="`sk-${n}`"
        >
          <td
            v-for="i in tableFields.length + 2"
            :key="i"
          >
            <VSkeletonLoader type="text" />
          </td>
        </tr>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="(item, index) in items"
            :key="item.id ?? index"
            class="data-row"
            :class="[{ 'row-editing': editingInlineId === item.id }]"
          >
            <!-- No. -->
            <td class="col-no">
              {{ index + 1 }}.
            </td>

            <!-- Data cells -->
            <template
              v-for="field in tableFields"
              :key="field.key"
            >
              <td :style="field.width ? { minWidth: field.width } : {}">
                <!-- ── Inline edit mode ── -->
                <template v-if="editingInlineId === item.id">
                  <VTextField
                    v-if="field.type !== 'select'"
                    :model-value="inlineForm[field.key]"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="inline-input"
                    @update:model-value="emit('inline-update', field.key, $event)"
                  />
                  <VSelect
                    v-else
                    :model-value="inlineForm[field.key]"
                    :items="field.options ?? []"
                    item-title="label"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="inline-input"
                    @update:model-value="emit('inline-update', field.key, $event)"
                  />
                </template>

                <!-- ── Read mode ── -->
                <span v-else>{{ item[field.key] }}</span>
              </td>
            </template>

            <!-- Action buttons -->
            <td class="col-action">
              <!-- Editing mode: SAVE + DELETE -->
              <template v-if="editingInlineId === item.id">
                <VBtn
                  size="small"
                  color="success"
                  class="btn-action"
                  :loading="saving"
                  @click="emit('save', item)"
                >
                  SAVE
                </VBtn>
                <VBtn
                  size="small"
                  color="error"
                  class="btn-action"
                  @click="emit('delete', item)"
                >
                  DELETE
                </VBtn>
              </template>

              <!-- Normal mode: EDIT + DELETE -->
              <template v-else>
                <VBtn
                  size="small"
                  color="warning"
                  class="btn-action"
                  @click="emit('edit', item)"
                >
                  EDIT
                </VBtn>
                <VBtn
                  size="small"
                  color="error"
                  class="btn-action"
                  @click="emit('delete', item)"
                >
                  DELETE
                </VBtn>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </VTable>
  </div>
</template>

<script setup>
defineProps({
  /**
   * FieldConfig[] ที่แสดงในตาราง (ไม่รวม hideInTable)
   */
  tableFields: {
    type: Array,
    required: true,
  },

  /** ข้อมูลแถว */
  items: {
    type: Array,
    default: () => [],
  },

  /** id ของแถวที่กำลัง edit inline อยู่ */
  editingInlineId: {
    type: [String, Number],
    default: null,
  },

  /** Object ค่า inline edit { [fieldKey]: value } */
  inlineForm: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits([
  'edit',           // (item) → เริ่ม inline edit
  'save',           // (item) → บันทึก inline edit
  'delete',         // (item) → เปิด delete dialog
  'inline-update',  // (fieldKey, value) → อัปเดตค่าใน inlineForm
])
</script>

<style scoped src="./css/MasterTable.css"></style>
