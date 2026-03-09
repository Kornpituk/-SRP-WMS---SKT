// ============================================================================
// Ship Document — Constants & JSDoc Type Definitions
// ============================================================================
// Single source of truth. Object.freeze replaces TS enums.
// JSDoc @typedef gives VS Code / WebStorm autocomplete without TypeScript.
// ============================================================================

// ---------------------------------------------------------------------------
// Status Constants
// ---------------------------------------------------------------------------

/** Document-level status */
export const DocumentStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  VOID: 'VOID',
  // ARCHIVED: 'ARCHIVED',
  // REJECTED: 'REJECTED',
})

/** Tab-level status */
export const TabStatus = Object.freeze({
  DRAFT: 'DRAFT',
  SAVED: 'SAVED',
  CONFIRMED: 'CONFIRMED',
  // REJECTED: 'REJECTED',
  // ARCHIVED: 'ARCHIVED',
})

/** Unique key per tab — used everywhere as registry key */
export const TabKey = Object.freeze({
  PACKING_LIST: 'packingList',
  COMMERCIAL_INVOICE: 'commercialInvoice',
  CERTIFICATE_OF_ORIGIN: 'certificateOfOrigin',
  PACKING_DECLARATION: 'packingDeclaration',
  SHIPPING_PARTICULAR: 'shippingParticular',
})

// ---------------------------------------------------------------------------
// JSDoc Type Definitions (IDE intellisense only — no runtime cost)
// ---------------------------------------------------------------------------

/**
 * @typedef {'SAVE_DRAFT'|'CONFIRM'|'VOID'|'REJECT'|'REOPEN'} TabAction
 */

/**
 * @typedef {Object} TabPermissions
 * @property {boolean} canView
 * @property {boolean} canEdit
 * @property {boolean} canSave
 * @property {boolean} canConfirm
 * @property {boolean} canPrint
 * @property {boolean} canVoid
 */

/**
 * @typedef {Object} DocumentPermissions
 * @property {boolean} canApprove
 * @property {boolean} canVoid
 * @property {boolean} canEdit
 * @property {boolean} canPrint
 */

/**
 * @typedef {Object} StatusTransition
 * @property {string} from
 * @property {TabAction} action
 * @property {string} to
 * @property {function(TransitionContext):boolean} [guard]
 */

/**
 * @typedef {Object} TransitionContext
 * @property {string} documentStatus
 * @property {string} tabKey
 * @property {string} currentTabStatus
 * @property {string} [userRole]
 */

/**
 * @typedef {Object} TabConfig
 * @property {string} key
 * @property {string} label
 * @property {string} [icon]
 * @property {number} order
 * @property {boolean} [isGatekeeper]
 */

/**
 * @typedef {Object} PartyInfo
 * @property {string} name
 * @property {string} address
 * @property {string} [address2]
 * @property {string} [address3]
 * @property {string} [city]
 * @property {string} [country]
 * @property {string} [tel]
 * @property {string} [taxId]
 * @property {string} [attn]
 * @property {string} [email]
 */

/**
 * @typedef {Object} BankingDetail
 * @property {string} accountNo
 * @property {string} bankName
 * @property {string} address
 * @property {string} swiftCode
 */

/**
 * @typedef {Object} TabState
 * @property {string} key
 * @property {string} status
 * @property {Object} data
 * @property {boolean} isDirty
 * @property {boolean} isLoading
 * @property {Object.<string,string[]>} errors
 * @property {string|null} lastSavedAt
 * @property {string|null} lastConfirmedAt
 */

/**
 * @typedef {Object} ShipDocument
 * @property {string} id
 * @property {string} documentNo
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} createdBy
 * @property {Object.<string,TabState>} tabs
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {*} data
 * @property {string} [message]
 * @property {Object.<string,string[]>} [errors]
 */
