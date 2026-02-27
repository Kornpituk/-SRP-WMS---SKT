/**
 * src/components/master/index.js
 * ─────────────────────────────────────────────────────────────────
 * Barrel export — import ได้จากที่เดียว
 *
 * Usage:
 *   import { BaseMasterCrud } from '@/components/master'
 *   import { MasterTable, MasterCreateDialog } from '@/components/master'
 *   import { useMasterCrud } from '@/components/master'
 * ─────────────────────────────────────────────────────────────────
 */

export { default as BaseMasterCrud }      from './BaseMasterCrud.vue'
export { default as MasterHeader }        from './MasterHeader.vue'
export { default as MasterSearchBar }     from './MasterSearchBar.vue'
export { default as MasterToolbar }       from './MasterToolbar.vue'
export { default as MasterTable }         from './MasterTable.vue'
export { default as MasterCreateDialog }  from './MasterCreateDialog.vue'
export { default as MasterDeleteDialog }  from './MasterDeleteDialog.vue'
export { default as MasterSnackbar }      from './MasterSnackbar.vue'
// eslint-disable-next-line import/extensions
export { useMasterCrud }                  from './useMasterCrud.js'
