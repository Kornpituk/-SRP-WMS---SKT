/**
 * useMasterCrud.js
 * ─────────────────────────────────────────────────────────────────
 * Composable หลักที่เก็บ logic ทั้งหมดของ BaseMasterCrud
 * ─────────────────────────────────────────────────────────────────
 *
 * PAGINATION STRATEGY
 * ───────────────────
 * รองรับ 2 โหมดอัตโนมัติ:
 *
 * 1. Client-side (Mock / API คืน array)
 *    service.getList() → []
 *    → เราทำ slice เองใน composable
 *
 * 2. Server-side (API คืน paginated object)
 *    service.getList({ page, perPage }) → { data: [], total: N }
 *    → ใช้ total จาก response โดยตรง
 *
 * สลับโหมดอัตโนมัติ ไม่ต้องตั้งค่าอะไรเพิ่ม
 */
import { ref, reactive, computed, onMounted } from 'vue'

export function useMasterCrud (props, emit) {

  // ─────────────────────────────────────────────
  // DERIVED FIELD SETS
  // ─────────────────────────────────────────────

  const tableFields = computed(() =>
    props.fields.filter(f => !f.hideInTable),
  )

  const searchFields = computed(() => {
    const candidates = props.fields.filter(
      f => f.searchable !== false && !f.hideInTable,
    )

    
    return candidates.slice(0, 3)
  })

  // ─────────────────────────────────────────────
  // CORE STATE
  // ─────────────────────────────────────────────

  const items    = ref([])
  const loading  = ref(false)
  const saving   = ref(false)
  const deleting = ref(false)

  // ─────────────────────────────────────────────
  // PAGINATION STATE
  // ─────────────────────────────────────────────

  const currentPage   = ref(1)
  const itemsPerPage  = ref(10)
  const totalItems    = ref(0)

  /** ตัวเลือก rows/page ที่แสดงใน dropdown */
  const perPageOptions = [10, 25, 50, 100]

  /** จำนวนหน้าทั้งหมด */
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)),
  )

  /** ข้อความ "Showing X – Y of Z entries" */
  const paginationInfo = computed(() => {
    if (totalItems.value === 0) return 'No entries'
    const from = (currentPage.value - 1) * itemsPerPage.value + 1
    const to   = Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
    
    return `Showing ${from} – ${to} of ${totalItems.value} entries`
  })

  // ─────────────────────────────────────────────
  // SEARCH / FILTER STATE
  // ─────────────────────────────────────────────

  const showSearch   = ref(false)
  const searchParams = reactive({})

  // ─────────────────────────────────────────────
  // sorting
  // ─────────────────────────────────────────────
  // เพิ่มใน CORE STATE section
  const sortField     = ref('')
  const sortDirection = ref('')   // 'asc' | 'desc' | ''

  // เพิ่ม handleSort
  function handleSort (fieldKey) {
    if (sortField.value === fieldKey) {
    // toggle: asc → desc → clear
      if (sortDirection.value === 'asc')       sortDirection.value = 'desc'
      else if (sortDirection.value === 'desc') { sortField.value = ''; sortDirection.value = '' }
    } else {
      sortField.value     = fieldKey
      sortDirection.value = 'asc'
    }
    currentPage.value = 1
    loadData()
  }

  // ─────────────────────────────────────────────
  // CREATE DIALOG STATE
  // ─────────────────────────────────────────────

  const showCreateDialog = ref(false)
  const createForm       = reactive({})
  const createFormRef    = ref(null)

  // ─────────────────────────────────────────────
  // INLINE EDIT STATE
  // ─────────────────────────────────────────────

  const editingInlineId = ref(null)
  const inlineForm      = reactive({})

  // ─────────────────────────────────────────────
  // DELETE DIALOG STATE
  // ─────────────────────────────────────────────

  const showDeleteDialog = ref(false)
  const deleteTarget     = ref(null)

  const deleteItemName = computed(() => {
    if (!deleteTarget.value) return ''
    const key = props.deleteNameKey || 'name'
    
    return (
      deleteTarget.value[key]     ||
      deleteTarget.value['name']  ||
      deleteTarget.value['code']  ||
      String(deleteTarget.value.id || '')
    )
  })

  // ─────────────────────────────────────────────
  // SNACKBAR
  // ─────────────────────────────────────────────

  const snackbar = reactive({ show: false, message: '', color: 'success' })

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  function buildEmptyForm () {
    const form = {}

    props.fields
      .filter(f => !f.hideInForm)
      .forEach(f => { form[f.key] = '' })
    
    return form
  }

  function showNotification (message, color = 'success') {
    snackbar.message = message
    snackbar.color   = color
    snackbar.show    = true
  }

  const requiredRule = v => !!v || 'This field is required'

  // ─────────────────────────────────────────────
  // LOAD DATA  (รองรับ client-side + server-side pagination)
  // ─────────────────────────────────────────────

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async function loadData () {
    loading.value = true
    try {
      // รวม search params ที่ไม่ว่าง
      const filters = {}
      for (const [k, v] of Object.entries(searchParams)) {
        if (v !== '' && v !== null && v !== undefined) filters[k] = v
      }

      const params = {
        ...filters,
        page: currentPage.value,
        perPage: itemsPerPage.value,
        sortField: sortField.value || undefined,
        sortDirection: sortDirection.value || undefined,
      }

      const res = await props.service.getList(params)

      console.log("res", res)

      // ── Server-side: { data: [], total: N } ──
      if (res && !Array.isArray(res) && Array.isArray(res.data)) {
        items.value      = res.data
        totalItems.value = res.total || res.totalRows || res.totalCount
      }

      // ── Client-side: [] (mock returns full array) ──
      else {
        let all        = Array.isArray(res) ? res : []

        // client-side filter
        for (const [k, v] of Object.entries(filters)) {
          if (v) {
            all = all.filter(item =>
              String(item[k] ?? '').toLowerCase().includes(String(v).toLowerCase()),
            )
          }
        }

        // client-side sort
        if (sortField.value) {
          all = [...all].sort((a, b) => {
            const va = a[sortField.value] ?? ''
            const vb = b[sortField.value] ?? ''
            let cmp = 0
            if (typeof va === 'number' && typeof vb === 'number') {
              cmp = va - vb
            } else {
              cmp = String(va).localeCompare(String(vb))
            }
            
            return sortDirection.value === 'desc' ? -cmp : cmp
          })
        }

        totalItems.value = all.length

        const start = (currentPage.value - 1) * itemsPerPage.value

        items.value = all.slice(start, start + itemsPerPage.value)
      }

    } catch (err) {
      showNotification('Failed to load data', 'error')
      console.error('[useMasterCrud] loadData error', err)
    } finally {
      loading.value = false
    }
  }

  // ─────────────────────────────────────────────
  // PAGINATION ACTIONS
  // ─────────────────────────────────────────────

  function goToPage (page) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    loadData()
  }

  function changePerPage (val) {
    itemsPerPage.value = val
    currentPage.value  = 1   // reset กลับหน้า 1 เสมอ
    loadData()
  }

  // ─────────────────────────────────────────────
  // SEARCH ACTIONS
  // ─────────────────────────────────────────────

  function toggleSearch () {
    showSearch.value = !showSearch.value
  }

  async function handleSearch () {
    currentPage.value = 1   // search ใหม่ → reset หน้า 1
    await loadData()
  }

  function handleClear () {
    searchFields.value.forEach(f => { searchParams[f.key] = '' })
    currentPage.value = 1
    loadData()
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────

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
      await props.service.save({ ...createForm })
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

  // ─────────────────────────────────────────────
  // INLINE EDIT
  // ─────────────────────────────────────────────

  function startInlineEdit (item) {
    editingInlineId.value = item.id
    props.fields.forEach(f => { inlineForm[f.key] = item[f.key] ?? '' })
  }

  async function saveInline (item) {
    saving.value = true
    try {
      console.log("Edite", item)
      await props.service.save({ id: item.id, ...inlineForm })
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

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────

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
      if (editingInlineId.value === deleteTarget.value?.id)
        editingInlineId.value = null

      closeDeleteDialog()

      // ถ้าหน้าปัจจุบันว่างหลังลบ → ถอยหลัง 1 หน้า
      const remainOnPage = items.value.length - 1
      if (remainOnPage <= 0 && currentPage.value > 1)
        currentPage.value--

      await loadData()
    } catch (err) {
      showNotification('Failed to delete record', 'error')
      console.error('[useMasterCrud] delete error', err)
    } finally {
      deleting.value = false
    }
  }

  // ─────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────

  onMounted(() => loadData())

  // ─────────────────────────────────────────────
  // EXPOSE
  // ─────────────────────────────────────────────
  return {
    // fields
    tableFields,
    searchFields,

    // data
    items,
    loading,
    saving,
    deleting,

    // pagination
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    perPageOptions,
    paginationInfo,
    goToPage,
    changePerPage,

    // search
    showSearch,
    searchParams,
    toggleSearch,
    handleSearch,
    handleClear,

    // create dialog
    showCreateDialog,
    createForm,
    createFormRef,
    openCreateDialog,
    closeCreateDialog,
    submitCreate,

    // inline edit
    editingInlineId,
    inlineForm,
    startInlineEdit,
    saveInline,

    // delete dialog
    showDeleteDialog,
    deleteTarget,
    deleteItemName,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,

    // misc
    snackbar,
    sortField,
    sortDirection,
    requiredRule,
    loadData,
    handleSort,
  }
}
