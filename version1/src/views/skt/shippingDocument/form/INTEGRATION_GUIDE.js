// ============================================================================
// Integration Guide: ShippingDocumentPage → SelectShippingModeDialog → Detail
// ============================================================================
//
// FLOW:
//   1. User is on ShippingDocumentPage.vue (list page)
//   2. User clicks "Create Ship Doc" action button on a row
//   3. SelectShippingModeDialog opens (radio: Ocean/Air/Truck/Courier)
//   4. User selects a mode → clicks Confirm
//   5. Router navigates to ShipDocumentDetail.vue?mode=ocean (or air/truck/courier)
//   6. ShipDocumentDetail reads `route.query.mode` and filters tabs
//   7. Courier → only 2 tabs; Others → all 5 tabs
//
// ============================================================================
//
// STEP 1: Add this code to your existing ShippingDocumentPage.vue
//
// <template> section — add at the bottom (before closing tag):
//
//   <SelectShippingModeDialog
//     v-model="showModeDialog"
//     @confirm="handleModeConfirm"
//     @cancel="handleModeCancel"
//   />
//
// <script setup> section — add:
//
//   import { ref } from 'vue'
//   import { useRouter } from 'vue-router'
//   import SelectShippingModeDialog from '../components/shared/SelectShippingModeDialog.vue'
//
//   const router = useRouter()
//   const showModeDialog = ref(false)
//   const pendingRowId = ref(null)
//
//   // Called when user clicks "Create Ship Doc" action on a row
//   function onCreateShipDoc(row) {
//     pendingRowId.value = row.id    // remember which row
//     showModeDialog.value = true    // open dialog
//   }
//
//   // Called when user selects a mode and clicks Confirm
//   function handleModeConfirm(mode) {
//     router.push({
//       name: 'ship-document-create',
//       query: {
//         mode,                           // 'ocean' | 'air' | 'truck' | 'courier'
//         sourceId: pendingRowId.value,    // optional: link back to source row
//       },
//     })
//     pendingRowId.value = null
//   }
//
//   // Called when user clicks Cancel
//   function handleModeCancel() {
//     pendingRowId.value = null
//   }
//
// ============================================================================
//
// STEP 2: Add route in router/index.js
//
//   {
//     path: '/ship-document/create',
//     name: 'ship-document-create',
//     component: () => import('../views/ShipDocumentDetail.vue'),
//     // mode comes from query string: ?mode=ocean
//   },
//
// ============================================================================
//
// STEP 3: ShipDocumentDetail.vue already reads shipping mode from route:
//
//   const shippingMode = computed(() => {
//     return store.shippingMode || route.query.mode || 'ocean'
//   })
//
//   const visibleTabs = computed(() => {
//     const allowedKeys = getVisibleTabs(shippingMode.value)
//     return allTabs.filter(tab => allowedKeys.includes(tab.key))
//   })
//
// ============================================================================
//
// STEP 4: Store the shipping mode in backend when creating:
//
//   // In shipDocumentApi.js — add createDocument method:
//   async createDocument(mode, sourceId) {
//     if (USE_MOCK) {
//       await delay()
//       const newId = `doc-${Date.now()}`
//       console.log(`[Mock] Created doc ${newId} with mode: ${mode}`)
//       return ok({ id: newId, mode })
//     }
//     return request('POST', '/api/ship-documents', { mode, sourceId })
//   }
//
// ============================================================================

export default {}
