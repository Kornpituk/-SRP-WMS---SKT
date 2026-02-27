<!--
  BaseMasterCrud.vue  ← Orchestrator (บางมาก เพราะ logic อยู่ใน composable)
  ─────────────────────────────────────────────────────────────────
  ประกอบ sub-component ทั้งหมดเข้าด้วยกัน:
  MasterHeader       → header + title + filter toggle
  MasterSearchBar    → search inputs + SEARCH/CLEAR
  MasterToolbar      → CREATE button + Refresh
  MasterTable        → data table + inline edit
  MasterCreateDialog → create modal form
  MasterDeleteDialog → delete confirmation
  MasterSnackbar     → toast notification

  Logic ทั้งหมดมาจาก  useMasterCrud()  composable
  ─────────────────────────────────────────────────────────────────
  Props:
  title    : string         – ชื่อ entity
  fields   : FieldConfig[]  – กำหนด columns, form, search
  service  : MasterService  – inject service จากภายนอก

  FieldConfig {
  key          : string
  label        : string
  type         : 'text' | 'number' | 'select' | 'textarea'
  required?    : boolean
  width?       : string           column width e.g. '120px'
  searchable?  : boolean          show in search bar (default true)
  hideInTable? : boolean          hide col แต่ยังอยู่ใน form
  options?     : { label, value }[]  for select type
  }

  MasterService {
  getList(params)        : Promise<{ data[] } | []>
  create(payload)        : Promise<any>
  update(id, payload)    : Promise<any>
  delete(id)             : Promise<void>
  }
  ─────────────────────────────────────────────────────────────────
-->
<template>
  <div class="master-crud-wrapper">
    <!-- ① Header ─────────────────────────────────── -->
    <MasterHeader
      :title="title"
      :search-visible="showSearch"
      @close="emit('close')"
      @toggle-search="toggleSearch"
    />

    <!-- ② Search Bar (collapsible) ───────────────── -->
    <MasterSearchBar
      :visible="showSearch"
      :search-fields="searchFields"
      :model-value="searchParams"
      :loading="loading"
      @update:model-value="Object.assign(searchParams, $event)"
      @search="handleSearch"
      @clear="handleClear"
    />

    <!-- ③ Toolbar ────────────────────────────────── -->
    <MasterToolbar
      :title="title"
      :loading="loading"
      @create="openCreateDialog"
      @refresh="loadData"
    />

    <!-- ④ Data Table ─────────────────────────────── -->
    <MasterTable
      :table-fields="tableFields"
      :items="items"
      :editing-inline-id="editingInlineId"
      :inline-form="inlineForm"
      :loading="loading"
      :saving="saving"
      @edit="startInlineEdit"
      @save="saveInline"
      @delete="openDeleteDialog"
      @inline-update="(key, val) => (inlineForm[key] = val)"
    />

    <!-- ⑤ Create Dialog ──────────────────────────── -->
    <MasterCreateDialog
      v-model="showCreateDialog"
      :title="title"
      :fields="fields"
      :form-data="createForm"
      :saving="saving"
      @close="closeCreateDialog"
      @save="submitCreate"
      @field-update="(key, val) => (createForm[key] = val)"
    />

    <!-- ⑥ Delete Confirmation ────────────────────── -->
    <MasterDeleteDialog
      v-model="showDeleteDialog"
      :title="title"
      :item-name="deleteItemName"
      :deleting="deleting"
      @confirm="confirmDelete"
      @cancel="closeDeleteDialog"
    />

    <!-- ⑦ Snackbar ───────────────────────────────── -->
    <MasterSnackbar
      v-model="snackbar.show"
      :message="snackbar.message"
      :color="snackbar.color"
    />
  </div>
</template>

<script setup>
import { useMasterCrud }      from './useMasterCrud'
import MasterHeader           from './MasterHeader.vue'
import MasterSearchBar        from './MasterSearchBar.vue'
import MasterToolbar          from './MasterToolbar.vue'
import MasterTable            from './MasterTable.vue'
import MasterCreateDialog     from './MasterCreateDialog.vue'
import MasterDeleteDialog     from './MasterDeleteDialog.vue'
import MasterSnackbar         from './MasterSnackbar.vue'

// ─── Props ────────────────────────────────────
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  fields: {
    type: Array,
    required: true,
  },
  service: {
    type: Object,
    required: true,
  },

  /**
   * key ของ field ที่ใช้แสดงชื่อใน delete dialog เช่น 'name', 'forwarderName', 'code'
   * default: 'name'  → จะดึง item.name มาแสดงเป็น "ABC Logistics"
   */
  deleteNameKey: {
    type: String,
    default: 'name',
  },
})

const emit = defineEmits(['close'])

// ─── Composable (ทุก logic อยู่ที่นี่) ────────
const {
  // derived
  tableFields,
  searchFields,

  // state
  items,
  loading,
  saving,
  deleting,

  showSearch,
  searchParams,

  showCreateDialog,
  createForm,

  editingInlineId,
  inlineForm,

  showDeleteDialog,
  deleteItemName,
  snackbar,

  // methods
  loadData,
  toggleSearch,
  handleSearch,
  handleClear,
  openCreateDialog,
  closeCreateDialog,
  submitCreate,
  startInlineEdit,
  saveInline,
  openDeleteDialog,
  closeDeleteDialog,
  confirmDelete,
} = useMasterCrud(props, emit)
</script>

<style scoped>
.master-crud-wrapper {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  block-size: 100%;
}
</style>
