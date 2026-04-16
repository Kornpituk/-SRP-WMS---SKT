<template>
  <div class="table-wrapper">
    <VTable
      density="compact"
      class="master-table"
      hover
      fixed-header
    >
      <thead>
        <tr>
          <th class="col-no text-center">
            No.
          </th>
          <th
            v-for="field in tableFields"
            :key="field.key"
            :style="getColumnStyle(field)"
            class="sortable-th"
            @click="emit('sort', field.key)"
          >
            <div class="th-content">
              <span class="th-label">{{ field.label }}</span>
              <span class="sort-icon">
                <template v-if="sortField === field.key">
                  <VIcon size="14">
                    {{ sortDirection === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                  </VIcon>
                </template>
                <template v-else>
                  <VIcon
                    size="14"
                    class="sort-idle"
                  >
                    mdi-swap-vertical
                  </VIcon>
                </template>
              </span>
            </div>

            <button
              type="button"
              class="column-resizer"
              :aria-label="`Resize ${field.label} column`"
              @click.stop
              @dblclick.stop.prevent="autoFitColumn(field)"
              @pointerdown.stop.prevent="startResize($event, field)"
            />
          </th>
          <th class="col-action text-center">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
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

        <template v-else>
          <tr
            v-for="(item, index) in items"
            :key="item.id ?? index"
            class="data-row"
            :class="{ 'row-editing': editingInlineId === item.id }"
          >
            <td class="col-no">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}.
            </td>

            <template
              v-for="field in tableFields"
              :key="field.key"
            >
              <td :style="getColumnStyle(field)">
                <template v-if="editingInlineId === item.id">
                  <VTextField
                    v-if="getEditorType(field) !== 'select'"
                    :model-value="inlineForm[getEditorKey(field)]"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="inline-input"
                    @update:model-value="emit('inline-update', getEditorKey(field), $event)"
                  />
                  <VSelect
                    v-else
                    :model-value="inlineForm[getEditorKey(field)]"
                    :items="field.editOptions ?? field.options ?? []"
                    item-title="label"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="inline-input"
                    @update:model-value="emit('inline-update', getEditorKey(field), $event)"
                  />
                </template>

                <span
                  v-else
                  class="cell-text"
                >
                  {{ item[field.key] }}
                </span>
              </td>
            </template>

            <td class="col-action">
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

    <div class="pagination-footer">
      <div class="pagination-left">
        <span class="pagination-info">{{ paginationInfo }}</span>
        <VBtn
          variant="text"
          size="small"
          class="reset-widths-btn"
          @click="resetColumnWidths"
        >
          Reset widths
        </VBtn>
      </div>

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

        <div class="page-numbers">
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn"
            :class="{
              'page-btn--active': p === currentPage,
              'page-btn--ellipsis': p === '…',
            }"
            :disabled="p === '…' || loading"
            @click="p !== '…' && emit('update:page', p)"
          >
            {{ p }}
          </button>
        </div>

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
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, watch } from 'vue'

const props = defineProps({
  tableFields: { type: Array, required: true },
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  editingInlineId: { type: [String, Number], default: null },
  inlineForm: { type: Object, default: () => ({}) },
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  totalItems: { type: Number, default: 0 },
  itemsPerPage: { type: Number, default: 10 },
  perPageOptions: { type: Array, default: () => [10, 25, 50, 100] },
  paginationInfo: { type: String, default: '' },
  sortField: { type: String, default: '' },
  sortDirection: { type: String, default: '' },
})

const emit = defineEmits([
  'edit',
  'save',
  'delete',
  'inline-update',
  'update:page',
  'update:per-page',
  'sort',
])

const STORAGE_PREFIX = 'setting-master:column-widths'
const DEFAULT_MIN_WIDTH = 120
const COLUMN_HORIZONTAL_PADDING = 30
const SORT_ICON_SPACE = 24
const RESIZER_SPACE = 16

const columnWidths = reactive({})

const resizeState = reactive({
  activeKey: '',
  startX: 0,
  startWidth: 0,
})

const storageKey = computed(() => {
  const path = typeof window !== 'undefined' ? window.location.pathname : 'unknown-path'
  const fieldSignature = props.tableFields.map(field => field.key).join('|')

  return `${STORAGE_PREFIX}:${path}:${fieldSignature}`
})

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = [1]

  if (current > 3) pages.push('…')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('…')

  pages.push(total)

  return pages
})

function parseWidth(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }

  return null
}

function getMinWidth(field) {
  return Math.max(field.minWidth ?? DEFAULT_MIN_WIDTH, 72)
}

function getInitialWidth(field) {
  const configured = parseWidth(field.width)
  if (configured) return Math.max(configured, getMinWidth(field))

  const estimated = String(field.label ?? '').length * 9 + 56

  return Math.max(estimated, getMinWidth(field))
}

function syncColumnWidths() {
  const activeKeys = new Set(props.tableFields.map(field => field.key))

  props.tableFields.forEach(field => {
    if (!Number.isFinite(columnWidths[field.key])) {
      columnWidths[field.key] = getInitialWidth(field)
    }
  })

  Object.keys(columnWidths).forEach(key => {
    if (!activeKeys.has(key)) delete columnWidths[key]
  })
}

function restoreColumnWidths() {
  if (typeof window === 'undefined') return

  syncColumnWidths()

  try {
    const raw = window.localStorage.getItem(storageKey.value)
    if (!raw) return

    const saved = JSON.parse(raw)
    if (!saved || typeof saved !== 'object') return

    props.tableFields.forEach(field => {
      const width = parseWidth(saved[field.key])
      if (width) {
        columnWidths[field.key] = Math.max(width, getMinWidth(field))
      }
    })
  } catch (error) {
    console.warn('[MasterTable] failed to restore column widths', error)
  }
}

function persistColumnWidths() {
  if (typeof window === 'undefined' || !props.tableFields.length) return

  const payload = props.tableFields.reduce((acc, field) => {
    acc[field.key] = columnWidths[field.key] ?? getInitialWidth(field)

    return acc
  }, {})

  window.localStorage.setItem(storageKey.value, JSON.stringify(payload))
}

function clearPersistedWidths() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(storageKey.value)
}

function getColumnStyle(field) {
  const width = columnWidths[field.key] ?? getInitialWidth(field)
  const value = `${width}px`

  return {
    width: value,
    minWidth: value,
    maxWidth: value,
  }
}

function getEditorKey(field) {
  return field.editKey || field.key
}

function getEditorType(field) {
  return field.editType || field.type
}

function measureTextWidth(text, font = '600 12px "Segoe UI", sans-serif') {
  if (typeof document === 'undefined') return String(text ?? '').length * 9

  const canvas = measureTextWidth.canvas || (measureTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  if (!context) return String(text ?? '').length * 9

  context.font = font

  return context.measureText(String(text ?? '')).width
}

function autoFitColumn(field) {
  const headerWidth = measureTextWidth(field.label ?? '') + COLUMN_HORIZONTAL_PADDING + SORT_ICON_SPACE + RESIZER_SPACE

  const rowWidth = props.items.reduce((maxWidth, item) => {
    const rawValue = item?.[field.key]
    const displayValue = rawValue === null || rawValue === undefined ? '' : String(rawValue)
    const measuredWidth = measureTextWidth(displayValue, '400 13px "Segoe UI", sans-serif') + COLUMN_HORIZONTAL_PADDING

    return Math.max(maxWidth, measuredWidth)
  }, 0)

  columnWidths[field.key] = Math.ceil(Math.max(headerWidth, rowWidth, getMinWidth(field)))
  persistColumnWidths()
}

function resetColumnWidths() {
  props.tableFields.forEach(field => {
    columnWidths[field.key] = getInitialWidth(field)
  })

  clearPersistedWidths()
}

function handlePointerMove(event) {
  if (!resizeState.activeKey) return

  const field = props.tableFields.find(item => item.key === resizeState.activeKey)
  if (!field) return

  const nextWidth = resizeState.startWidth + (event.clientX - resizeState.startX)

  columnWidths[resizeState.activeKey] = Math.max(nextWidth, getMinWidth(field))
}

function stopResize() {
  if (!resizeState.activeKey) return

  resizeState.activeKey = ''
  document.body.classList.remove('master-table-resizing')
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', stopResize)
  window.removeEventListener('pointercancel', stopResize)
  persistColumnWidths()
}

function startResize(event, field) {
  resizeState.activeKey = field.key
  resizeState.startX = event.clientX
  resizeState.startWidth = columnWidths[field.key] ?? getInitialWidth(field)

  document.body.classList.add('master-table-resizing')
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', stopResize)
  window.addEventListener('pointercancel', stopResize)
}

watch(
  () => props.tableFields.map(field => `${field.key}:${field.width ?? ''}:${field.minWidth ?? ''}`).join('|'),
  () => {
    restoreColumnWidths()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stopResize()
})
</script>

<style scoped src="./css/MasterTable.css"></style>
