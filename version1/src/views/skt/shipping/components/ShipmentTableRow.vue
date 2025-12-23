// =====================================================
// 📄 components/ShipmentTableRow.vue
// =====================================================
<template>
  <tr :class="rowClasses">
    <!-- Checkbox -->
    <td v-if="showCheckbox">
      <VCheckbox
        v-model="selected"
        :value="item"
      />
    </td>
    
    <!-- Status -->
    <td>
      <VChip
        :color="statusColor"
        size="small"
      >
        {{ item.statusText }}
      </VChip>
    </td>
    
    <!-- Dynamic Columns -->
    <td
      v-for="col in columns"
      :key="col.key"
      :class="col.class"
    >
      <Component
        :is="getCellComponent(col.key)"
        :value="item[col.key]"
        :item="item"
        :editable="canEdit(col.key)"
        @update="handleUpdate(col.key, $event)"
      />
    </td>
    
    <!-- Actions -->
    <td>
      <ShipmentRowActions
        :item="item"
        :permissions="permissions"
        @action="$emit('action', $event)"
      />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { useRowSelection } from './composables/useRowSelection'
import { useStatusColor } from './composables/useStatusColor'

// Cell Components (lazy loaded)
import TextCell from './cells/TextCell.vue'
import DateCell from './cells/DateCell.vue'
import SelectCell from './cells/SelectCell.vue'
import FileCell from './cells/FileCell.vue'

const props = defineProps({
  item: Object,
  columns: Array,
  permissions: Object,
})

const emit = defineEmits(['action', 'update'])

// ✅ Selection state
const { selected, showCheckbox } = useRowSelection(props.item)

// ✅ Status color
const statusColor = useStatusColor(props.item.statusId)

// ✅ Row classes
const rowClasses = computed(() => ({
  'row-selected': selected.value,
  'row-disabled': props.item.statusId === 206 || props.item.statusId === 207,
}))

// ✅ Dynamic cell component
function getCellComponent(columnKey) {
  const componentMap = {
    etd: DateCell,
    eta: DateCell,
    truck: SelectCell,
    sapInvoiceNo: TextCell,

    // Files
    sOAttachment: FileCell,
    COA: FileCell,

    // Default
    default: TextCell,
  }
  
  return componentMap[columnKey] || componentMap.default
}

// ✅ Permission check
function canEdit(columnKey) {
  const permission = `COL_${columnKey.toUpperCase()}`
  
  return props.permissions.canExecute(permission)
}

// ✅ Update handler with debounce
const updateDebounce = {}
function handleUpdate(key, value) {
  clearTimeout(updateDebounce[key])
  updateDebounce[key] = setTimeout(() => {
    emit('update', { key, value, item: props.item })
  }, 500)
}
</script>

<style scoped>
.row-selected {
  background-color: #E0F7FA;
}

.row-disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
