<!--
  MasterTable.vue
  ─────────────────────────────────────────────────────────────────
  ตารางข้อมูล + Pagination footer
  ─────────────────────────────────────────────────────────────────
  Props:
  tableFields      FieldConfig[]   คอลัมน์ที่แสดง
  items            any[]           ข้อมูลแถว (หน้าปัจจุบัน)
  loading          boolean
  saving           boolean
  editingInlineId  string|number   id แถวที่กำลัง edit
  inlineForm       object          ค่าใน inline edit

  currentPage      number          หน้าปัจจุบัน
  totalPages       number          หน้าทั้งหมด
  totalItems       number          จำนวน record ทั้งหมด
  itemsPerPage     number          rows/page ที่เลือก
  perPageOptions   number[]        ตัวเลือก rows/page [10,25,50,100]
  paginationInfo   string          "Showing X – Y of Z entries"

  Emits:
  edit              (item)
  save              (item)
  delete            (item)
  inline-update     (fieldKey, value)
  update:page       (page)       → เปลี่ยนหน้า
  update:per-page   (perPage)    → เปลี่ยน rows/page
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <div class="table-wrapper">
    <!--
      ════════════════════════════════════════
      DATA TABLE
      ════════════════════════════════════════ 
    -->
    <VTable
      density="compact"
      class="master-table"
      hover
      fixed-header
    >
      <!-- ─── thead ──────────────────────────── -->
      <thead>
        <tr>
          <!--
            <th class="col-no text-center">
            No.
            </th> 
          -->
          <th
            v-for="field in tableFields"
            :key="field.key"
            :style="field.width ? { width: field.width } : {}"
          >
            {{ field.label }}
          </th>
          <th class="col-action text-center">
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
          v-for="n in itemsPerPage"
          v-else-if="loading"
          :key="`sk-${n}`"
        >
          <td
            v-for="i in tableFields.length + 2"
            :key="i"
            class="skeleton-cell"
          >
            <div class="skeleton-line" />
          </td>
        </tr>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="(item, index) in items"
            :key="item.id ?? index"
            class="data-row"
            :class="{ 'row-editing': editingInlineId === item.id }"
          >
            <!-- No. — แสดงเลข global ตาม offset หน้าปัจจุบัน -->
            <!--
              <td class="col-no">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}.
              </td> 
            -->

            <!-- Data cells -->
            <template
              v-for="field in tableFields"
              :key="field.key"
            >
              <td :style="field.width ? { minWidth: field.width } : {}">
                <!-- Inline edit mode -->
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

                <!-- Read mode -->
                <span
                  v-else
                  class="cell-text"
                >{{ item[field.key] }}</span>
              </td>
            </template>

            <!-- Action column -->
            <td class="col-action">
              <!-- Editing: SAVE + DELETE -->
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
              <!-- Normal: EDIT + DELETE -->
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

    <!--
      ════════════════════════════════════════
      PAGINATION FOOTER
      ════════════════════════════════════════ 
    -->
    <div class="pagination-footer">
      <!-- ── ซ้าย: info + rows/page ────────── -->
      <div class="pagination-left">
        <span class="pagination-info">{{ paginationInfo }}</span>
      </div>

      <!-- ── ขวา: page navigation ──────────── -->
      <div class="pagination-right">
        <div class="per-page-wrap">
          <span class="per-page-label">Rows per page</span>
          <VSelect
            :model-value="itemsPerPage"
            :items="perPageOptions"
            variant="outlined"
            density="compact"
            hide-details
            class="per-page-select text-center"
            @update:model-value="emit('update:per-page', $event)"
          />
        </div>
        <!-- ปุ่ม First -->
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage <= 1 || loading"
          class="nav-btn"
          @click="emit('update:page', 1)"
        >
          <VIcon size="18">
            mdi-page-first
          </VIcon>
        </VBtn>

        <!-- ปุ่ม Prev -->
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage <= 1 || loading"
          class="nav-btn"
          @click="emit('update:page', currentPage - 1)"
        >
          <VIcon size="18">
            mdi-chevron-left
          </VIcon>
        </VBtn>

        <!-- Page numbers -->
        <div class="page-numbers">
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn"
            :class="{
              'page-btn--active' : p === currentPage,
              'page-btn--ellipsis': p === '…',
            }"
            :disabled="p === '…' || loading"
            @click="p !== '…' && emit('update:page', p)"
          >
            {{ p }}
          </button>
        </div>

        <!-- ปุ่ม Next -->
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage >= totalPages || loading"
          class="nav-btn"
          @click="emit('update:page', currentPage + 1)"
        >
          <VIcon size="18">
            mdi-chevron-right
          </VIcon>
        </VBtn>

        <!-- ปุ่ม Last -->
        <VBtn
          icon
          variant="text"
          size="small"
          :disabled="currentPage >= totalPages || loading"
          class="nav-btn"
          @click="emit('update:page', totalPages)"
        >
          <VIcon size="18">
            mdi-page-last
          </VIcon>
        </VBtn>
      </div>
    </div>
    <!-- end pagination footer -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

// ─── Props ────────────────────────────────────
const props = defineProps({
  tableFields: { type: Array,          required: true },
  items: { type: Array,          default: () => [] },
  loading: { type: Boolean,        default: false },
  saving: { type: Boolean,        default: false },
  editingInlineId: { type: [String, Number], default: null },
  inlineForm: { type: Object,         default: () => ({}) },

  // pagination
  currentPage: { type: Number,         default: 1 },
  totalPages: { type: Number,         default: 1 },
  totalItems: { type: Number,         default: 0 },
  itemsPerPage: { type: Number,         default: 10 },
  perPageOptions: { type: Array,          default: () => [10, 25, 50, 100] },
  paginationInfo: { type: String,         default: '' },
})

// ─── Emits ────────────────────────────────────
const emit = defineEmits([
  'edit',
  'save',
  'delete',
  'inline-update',
  'update:page',      // (page: number)
  'update:per-page',  // (perPage: number)
])

// ─── Visible page buttons (max 7 buttons) ─────
/**
 * สร้างปุ่มหน้าที่แสดง เช่น  [1] [2] [3] … [8] [9] [10]
 * หรือ  [1] … [4] [5] [6] … [10]
 * แทน '…' เมื่อหน้าเยอะ
 */
const visiblePages = computed(() => {
  const total   = props.totalPages
  const current = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []

  pages.push(1)

  if (current > 3) pages.push('…')

  const start = Math.max(2,        current - 1)
  const end   = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('…')

  pages.push(total)
  
  return pages
})
</script>

<style scoped src="./css/MasterTable.css"></style>
