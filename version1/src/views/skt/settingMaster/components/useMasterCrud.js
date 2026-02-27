/**
 * useMasterCrud.js
 * ─────────────────────────────────────────────────────────────────
 * Composable หลักที่เก็บ logic ทั้งหมดของ BaseMasterCrud
 * ทุก component ย่อยรับ state / fn มาจาก composable นี้เท่านั้น
 * ─────────────────────────────────────────────────────────────────
 */
import { ref, reactive, computed, onMounted } from 'vue'

/**
 * @param {object} props - props ของ BaseMasterCrud (title, fields, service)
 * @param {function} emit - emit ของ BaseMasterCrud
 */
export function useMasterCrud (props, emit) {

  // ───────────────────────────────────────────────
  // DERIVED FIELD SETS
  // ───────────────────────────────────────────────

  /** คอลัมน์ในตาราง (ไม่รวม hideInTable) */
  const tableFields = computed(() =>
    props.fields.filter(f => !f.hideInTable),
  )

  /** ช่องค้นหา (searchable !== false, max 3 ช่อง) */
  const searchFields = computed(() => {
    const candidates = props.fields.filter(
      f => f.searchable !== false && !f.hideInTable,
    )
    
    return candidates.slice(0, 3)
  })

  // ───────────────────────────────────────────────
  // STATE
  // ───────────────────────────────────────────────

  const items    = ref([])
  const loading  = ref(false)
  const saving   = ref(false)
  const deleting = ref(false)

  // Search bar
  const showSearch   = ref(false)
  const searchParams = reactive({})

  // Create dialog
  const showCreateDialog = ref(false)
  const createForm       = reactive({})
  const createFormRef    = ref(null)   // ref ของ <v-form> ใน MasterCreateDialog

  // Inline edit
  const editingInlineId = ref(null)
  const inlineForm      = reactive({})

  // Delete dialog
  const showDeleteDialog = ref(false)
  const deleteTarget     = ref(null)

  /**
   * ชื่อที่แสดงใน delete dialog เช่น "ABC Logistics"
   * ดึงจาก deleteNameKey prop (default: 'name')
   * fallback: code → id
   */
  const deleteItemName = computed(() => {
    if (!deleteTarget.value) return ''
    const key = props.deleteNameKey || 'name'
    
    return (
      deleteTarget.value[key] ||
      deleteTarget.value['name'] ||
      deleteTarget.value['code'] ||
      String(deleteTarget.value.id || '')
    )
  })

  // Snackbar
  const snackbar = reactive({ show: false, message: '', color: 'success' })

  // ───────────────────────────────────────────────
  // HELPERS
  // ───────────────────────────────────────────────

  function buildEmptyForm () {
    const form = {}

    props.fields.forEach(f => { form[f.key] = '' })
    
    return form
  }

  function showNotification (message, color = 'success') {
    snackbar.message = message
    snackbar.color   = color
    snackbar.show    = true
  }

  const requiredRule = v => !!v || 'This field is required'

  // ───────────────────────────────────────────────
  // LOAD DATA
  // ───────────────────────────────────────────────

  async function loadData () {
    loading.value = true
    try {
      const res = await props.service.getList({ ...searchParams })

      items.value = res?.data ?? res ?? []
    } catch (err) {
      showNotification('Failed to load data', 'error')
      console.error('[useMasterCrud] loadData error', err)
    } finally {
      loading.value = false
    }
  }

  // ───────────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────────

  function toggleSearch () {
    showSearch.value = !showSearch.value
  }

  async function handleSearch () {
    await loadData()
  }

  function handleClear () {
    searchFields.value.forEach(f => { searchParams[f.key] = '' })
    loadData()
  }

  // ───────────────────────────────────────────────
  // CREATE
  // ───────────────────────────────────────────────

  function openCreateDialog () {
    Object.assign(createForm, buildEmptyForm())
    showCreateDialog.value = true
  }

  function closeCreateDialog () {
    showCreateDialog.value = false
  }

  async function submitCreate () {
    const { valid } = await createFormRef.value?.validate() ?? { valid: true }
    if (!valid) return

    saving.value = true
    try {
      await props.service.create({ ...createForm })
      showNotification(`${props.title} created successfully`)
      closeCreateDialog()
      await loadData()
    } catch (err) {
      showNotification('Failed to create record', 'error')
      console.error('[useMasterCrud] create error', err)
    } finally {
      saving.value = false
    }
  }

  // ───────────────────────────────────────────────
  // INLINE EDIT
  // ───────────────────────────────────────────────

  function startInlineEdit (item) {
    editingInlineId.value = item.id
    props.fields.forEach(f => { inlineForm[f.key] = item[f.key] ?? '' })
  }

  async function saveInline (item) {
    saving.value = true
    try {
      await props.service.update(item.id, { ...inlineForm })
      showNotification(`${props.title} updated successfully`)
      editingInlineId.value = null
      await loadData()
    } catch (err) {
      showNotification('Failed to update record', 'error')
      console.error('[useMasterCrud] update error', err)
    } finally {
      saving.value = false
    }
  }

  // ───────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────

  function openDeleteDialog (item) {
    deleteTarget.value     = item
    showDeleteDialog.value = true
  }

  function closeDeleteDialog () {
    deleteTarget.value     = null
    showDeleteDialog.value = false
  }

  async function confirmDelete () {
    if (!deleteTarget.value) return
    deleting.value = true
    try {
      await props.service.delete(deleteTarget.value.id)
      showNotification(`${props.title} deleted successfully`)
      if (editingInlineId.value === deleteTarget.value?.id) {
        editingInlineId.value = null
      }
      closeDeleteDialog()
      await loadData()
    } catch (err) {
      showNotification('Failed to delete record', 'error')
      console.error('[useMasterCrud] delete error', err)
    } finally {
      deleting.value = false
    }
  }

  // ───────────────────────────────────────────────
  // LIFECYCLE
  // ───────────────────────────────────────────────

  onMounted(() => loadData())

  // ───────────────────────────────────────────────
  // EXPOSE ทุกอย่างให้ component ย่อยใช้
  // ───────────────────────────────────────────────
  return {
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
    createFormRef,

    editingInlineId,
    inlineForm,

    showDeleteDialog,
    deleteTarget,
    deleteItemName,

    snackbar,

    // helpers
    requiredRule,

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
  }
}
