# Ship Document — Frontend Architecture

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [State Priority Cascade](#3-state-priority-cascade)
4. [State Machine (FSM)](#4-state-machine-fsm)
5. [Store Design](#5-store-design)
6. [Composable Architecture](#6-composable-architecture)
7. [Permission System](#7-permission-system)
8. [Adding a New Tab](#8-adding-a-new-tab)
9. [Trade-off Analysis](#9-trade-off-analysis)
10. [Future Extensions](#10-future-extensions)
11. [Data Flow Diagram](#11-data-flow-diagram)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Vue Router                                │
│              /shipping-document/:id                               │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│              ShipDocumentDetail.vue (Page)                        │
│  ┌──────────────┐ ┌──────────────────────────────────────┐       │
│  │ DocumentHeader│ │          Tab Bar (v-tabs)            │       │
│  └──────────────┘ └──────────┬───────────────────────────┘       │
│                              │                                    │
│  ┌───────────┬───────────┬───┴───────┬───────────┬─────────────┐ │
│  │ PackingList│ CommInv  │ CertOrigin│ PackDecl  │ ShipParticular│
│  │   Tab.vue │ Tab.vue  │  Tab.vue  │  Tab.vue  │   Tab.vue    │ │
│  └─────┬─────┴────┬─────┴─────┬─────┴────┬──────┴──────┬──────┘ │
│        │          │           │          │             │          │
│        └──────────┴───────────┴──────────┴─────────────┘         │
│                         │                                         │
│              ┌──────────▼───────────┐                             │
│              │   useTabForm()       │ ← Reusable Composable       │
│              │   usePermissions()   │                             │
│              │   usePrint()         │                             │
│              └──────────┬───────────┘                             │
│                         │                                         │
└─────────────────────────┼────────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│                  Pinia Store (Single)                              │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ documentId, documentNo, documentStatus                     │  │
│  │ tabs: { packingList: TabState, commercialInvoice: ... }    │  │
│  │ executeTransition(tabKey, action) → FSM                    │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│              Status Machine (Pure Functions)                       │
│  transition(action, context) → newStatus | null                   │
│  canTransition(action, context) → boolean                         │
└──────────────────────────────────────────────────────────────────┘
```

### Design Principles

- **Single Store** for the entire document (not per tab)
- **Reusable composable** (`useTabForm()`) reused by every tab
- **FSM** for all status transitions — no ad-hoc status mutations
- **Computed permissions** — never stored, always derived
- **Business logic in composables** — components are pure UI
- **Registry pattern** — new tabs registered declaratively
- **JSDoc typedefs** — IDE intellisense without TypeScript dependency

---

## 2. Folder Structure

```
ship-document/
├── types/
│   └── shipDocument.js          # Constants (Object.freeze) & JSDoc @typedef
├── constants/
│   ├── statusMachine.js         # FSM: transition rules & guards
│   ├── tabRegistry.js           # Tab configs (label, order, icon)
│   └── defaultTabData.js        # Factory functions for blank tab data
├── stores/
│   └── shipDocumentStore.js     # Pinia store (single source of truth)
├── composables/
│   ├── useTabForm.js            # Core tab form logic (THE core composable)
│   ├── usePermissions.js        # Permission resolver (document + tab level)
│   ├── useDocumentActions.js    # Document-level actions (fetch, void)
│   ├── usePrint.js              # Print logic
│   └── useUnsavedChangesGuard.js # Navigation guard
├── services/
│   └── shipDocumentApi.js       # All HTTP calls (isolated)
├── utils/
│   └── statusDisplay.js         # Status → color/icon mapping
├── components/
│   ├── shared/
│   │   ├── TabActionBar.vue     # Print / Save Draft / Confirm buttons
│   │   ├── TabStatusIndicator.vue # Status icon on tab headers
│   │   ├── DocumentHeader.vue   # Page header with Void/Approve
│   │   └── PartyInfoFields.vue  # Reusable party info form
│   └── tabs/
│       ├── PackingListTab.vue
│       ├── CommercialInvoiceTab.vue
│       ├── CertificateOfOriginTab.vue
│       ├── PackingDeclarationTab.vue
│       └── ShippingParticularTab.vue
├── views/
│   ├── ShipDocumentList.vue     # List page (server-side table)
│   └── ShipDocumentDetail.vue   # Detail page (tabs)
├── router/
│   └── index.js                 # Module routes
└── ARCHITECTURE.md              # This file
```

---

## 3. State Priority Cascade

```
Priority 1 (HIGHEST): Document Status
  └── VOID → ALL tabs readonly, override everything
  └── ACTIVE → defer to tab status

Priority 2: Tab Status
  └── CONFIRMED → readonly for this tab
  └── SAVED → editable
  └── DRAFT → editable

Priority 3 (LOWEST): User Role (Future)
  └── ADMIN → can reopen confirmed tabs
  └── VIEWER → read-only override
  └── EDITOR → normal access
```

This cascade is implemented in `usePermissions.js`:

```javascript
// Simplified logic
if (documentStatus === DocumentStatus.VOID) return READONLY_PERMISSIONS
if (tabStatus === TabStatus.CONFIRMED) return READONLY_PERMISSIONS
return FULL_PERMISSIONS // then check role
```

The key insight: **permissions are computed, not stored**. When `documentStatus` changes to `VOID`, every tab's permissions automatically recompute. No iteration, no event bus, no manual sync.

---

## 4. State Machine (FSM)

### Transition Diagram

```
                    ┌──────────┐
                    │  DRAFT   │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │ SAVE_DRAFT│  CONFIRM │
              ▼          │          ▼
         ┌────────┐     │    ┌───────────┐
         │ SAVED  │     │    │ CONFIRMED │
         └───┬────┘     │    └───────────┘
             │          │          ▲
     SAVE_DRAFT│    CONFIRM│      │
     (re-save) │          │      │
             │          │      │
             ▼──────────┘──────┘
         (same state)
```

### Guard Conditions

Every transition has a guard that checks `documentStatus !== VOID`. This means:
- If the document is VOID, **no transitions are possible**
- The FSM enforces this — components don't need to check

### Why FSM over simple if/else?

| Aspect | if/else | FSM |
|--------|---------|-----|
| Add new status | Touch every component | Add one transition rule |
| Add guards | Scattered conditions | Centralized in transitions |
| Testability | Test every component | Test the machine only |
| Documentation | Hidden in code | Transition table IS the doc |

---

## 5. Store Design

### Why One Store (Not Per-Tab)?

**Option A: One store per tab**
```
❌ Cross-tab dependencies require inter-store communication
❌ Document VOID must notify 5 stores
❌ "Any unsaved changes?" requires checking 5 stores
❌ DevTools shows 5 separate stores
```

**Option B: One store for the whole document** ✅
```
✅ Document status change → all tabs react instantly (computed)
✅ hasUnsavedChanges → single computed property
✅ DevTools → one store, full picture
✅ loadDocument() → one action loads everything
```

### Store Shape

```javascript
{
  documentId: 'doc-123',
  documentStatus: 'ACTIVE',
  tabs: {
    packingList: {
      status: 'CONFIRMED',
      data: { ... },
      isDirty: false,
      errors: {},
    },
    commercialInvoice: {
      status: 'SAVED',
      data: { ... },
      isDirty: true,
      errors: {},
    },
    // ... other tabs
  }
}
```

---

## 6. Composable Architecture

### Composable Dependency Graph

```
Component (e.g., PackingListTab.vue)
  │
  ├── useTabForm(TabKey.PACKING_LIST, options)
  │     ├── reads from store.tabs[key]
  │     ├── calls store.updateTabData()
  │     ├── calls store.executeTransition()  → FSM
  │     └── uses useTabPermissions(key) internally
  │           └── reads store.documentStatus + store.tabs[key].status
  │
  ├── usePrint(TabKey.PACKING_LIST)
  │     └── reads permissions.canPrint
  │
  └── TabActionBar (shared component)
        └── uses useTabPermissions(key) for button states
```

### Why `useTabForm()` is a Single Reusable Composable

Every tab follows the same pattern:
1. Read form data from store
2. Update fields → mark dirty
3. Save draft → validate → API call → FSM transition
4. Confirm → validate → API call → FSM transition

The only differences are:
- The API endpoints (passed as options)
- The validation rules (passed as options)

So `useTabForm()` encapsulates the common pattern, and each tab passes its specific config:

```javascript
// In PackingListTab.vue — just 5 lines of setup
const { formData, saveDraft, confirm, ... } = useTabForm(
  TabKey.PACKING_LIST,
  {
    onSaveDraft: (data) => api.savePackingList(docId, data),
    onConfirm: (data) => api.confirmPackingList(docId, data),
    validate: (data) => { /* packing-list-specific rules */ },
  }
)
```

---

## 7. Permission System

### Computed Permission Flow

```
documentStatus ─┐
                 ├──→ useTabPermissions(tabKey) ──→ {
tabStatus ───────┘                                    canView: true,
                                                      canEdit: false,
                                                      canSave: false,
                                                      canConfirm: false,
                                                      canPrint: true,
                                                      canVoid: false,
                                                    }
```

### Permission Matrix

| Document | Tab Status | canEdit | canSave | canConfirm | canPrint |
|----------|-----------|---------|---------|------------|----------|
| ACTIVE   | DRAFT     | ✅      | ✅      | ✅         | ❌       |
| ACTIVE   | SAVED     | ✅      | ✅      | ✅         | ✅       |
| ACTIVE   | CONFIRMED | ❌      | ❌      | ❌         | ✅       |
| VOID     | *any*     | ❌      | ❌      | ❌         | ✅       |

### How Components Use Permissions

```vue
<!-- Field is readonly when can't edit -->
<v-text-field :readonly="isReadonly" ... />

<!-- Button disabled when can't save -->
<v-btn :disabled="!permissions.canSave" @click="saveDraft">Save</v-btn>

<!-- Print always works (even VOID) -->
<v-btn :disabled="!permissions.canPrint" @click="print">Print</v-btn>
```

---

## 8. Adding a New Tab

Adding a new tab requires touching **6 files**, none of which involve rewriting existing logic:

### Step 1: Constants (`types/shipDocument.js`)
```javascript
// Add key to the frozen object
export const TabKey = Object.freeze({
  ...existing,
  INSURANCE_CERTIFICATE: 'insuranceCertificate',
})
```

### Step 2: Registry (`constants/tabRegistry.js`)
```javascript
TAB_REGISTRY.push({
  key: TabKey.INSURANCE_CERTIFICATE,
  label: 'Insurance Certificate',
  icon: 'mdi-shield-check',
  order: 6,
})
```

### Step 3: Default Data (`constants/defaultTabData.js`)
```javascript
dataFactories[TabKey.INSURANCE_CERTIFICATE] = () => ({
  policyNo: '', insurer: '', ...
})
```

### Step 4: API (`services/shipDocumentApi.js`)
```javascript
tabApiMap[TabKey.INSURANCE_CERTIFICATE] = {
  save: (docId, data) => request('PUT', `.../${docId}/insurance/draft`, data),
  confirm: (docId, data) => request('POST', `.../${docId}/insurance/confirm`, data),
}
```

### Step 5: Component (`components/tabs/InsuranceCertificateTab.vue`)
```vue
<script setup>
const { formData, saveDraft, confirm, ... } = useTabForm(
  TabKey.INSURANCE_CERTIFICATE,
  { onSaveDraft: ..., onConfirm: ... }
)
</script>
```

### Step 6: Register in Detail Page (`views/ShipDocumentDetail.vue`)
```javascript
import InsuranceCertificateTab from '../components/tabs/InsuranceCertificateTab.vue'
tabComponents[TabKey.INSURANCE_CERTIFICATE] = markRaw(InsuranceCertificateTab)
```

**Nothing else changes.** The store, FSM, permissions, dirty tracking — all work automatically because they're generic over `TabKey`.

---

## 9. Trade-off Analysis

### Approach 1: Pinia Global Store + Composables (CHOSEN)

| Pro | Con |
|-----|-----|
| Single source of truth | Store can grow large with many tabs |
| DevTools friendly | All tab data in memory simultaneously |
| Cross-tab features trivial | Slightly more boilerplate than Options API |
| Composables are testable | No compile-time type checking (JS) |

### Approach 2: Pinia Per-Tab Store

| Pro | Con |
|-----|-----|
| Better code splitting | Cross-store communication is painful |
| Smaller individual stores | Document VOID → notify all stores |
| Independent loading | "Any dirty?" requires checking N stores |

**Verdict:** Rejected. The cross-cutting concern (document status affecting all tabs) makes multi-store painful.

### Approach 3: XState / Formal FSM Library

| Pro | Con |
|-----|-----|
| Visual state charts | Heavy dependency for simple transitions |
| Built-in guards/effects | Learning curve for team |
| Time-travel debugging | Overkill for 3 states |

**Verdict:** Rejected for now. Our hand-rolled FSM is ~60 lines and covers the use case. If we add REJECTED, ARCHIVED, APPEALED, etc., reconsider XState.

### Approach 4: Composable per Tab (No Store)

| Pro | Con |
|-----|-----|
| No store dependency | State lost on unmount (even with keep-alive) |
| Maximum encapsulation | Cross-tab queries impossible |
| Simple mental model | Document status must be passed as prop everywhere |

**Verdict:** Rejected. We need cross-tab awareness.

### JavaScript vs TypeScript Decision

| Pro (JS) | Con (JS) |
|----------|----------|
| No build config for TS | No compile-time type safety |
| Faster dev iteration | Refactoring riskier without compiler |
| Lower barrier for team | IDE support weaker than TS |
| No generic type complexity | JSDoc more verbose than interfaces |

**Mitigation:** JSDoc `@typedef` provides IDE intellisense. `Object.freeze` prevents enum mutation. Runtime validation in the FSM guards catches invalid transitions.

---

## 10. Future Extensions

### Role-Based Access Control

Plug into `usePermissions.js` Priority 3:

```javascript
// In useTabPermissions
if (userRole === 'VIEWER') {
  return { ...basePermissions, canEdit: false, canSave: false }
}
if (userRole === 'ADMIN') {
  // Admins can reopen confirmed tabs
  return { ...basePermissions, canReopen: true }
}
```

### New Statuses (REJECTED, ARCHIVED)

1. Add to `TabStatus` in `types/shipDocument.js`
2. Add transitions in `constants/statusMachine.js`
3. Add display config in `utils/statusDisplay.js`
4. Update permission matrix in `composables/usePermissions.js`

### Audit Trail

The store already tracks `lastSavedAt` and `lastConfirmedAt`. Extend with:

```javascript
// In TabState shape
{
  ...existing,
  history: [] // Array of { action, from, to, timestamp, userId }
}
```

### Offline Support

The store's serializable state makes it straightforward to persist to IndexedDB and sync when back online.

### Approval Workflow

Add document-level transitions:

```
ACTIVE → PENDING_APPROVAL → APPROVED → VOID
                          → REJECTED → ACTIVE (reopen)
```

### Migration to TypeScript (Optional)

If the team decides to adopt TypeScript later:
- `Object.freeze` constants → `enum`
- JSDoc `@typedef` → `interface`
- Add `.ts` extension + `lang="ts"` to `<script setup>`
- The architecture and logic remain identical

---

## 11. Data Flow Diagram

```
User Action          Component           Composable           Store              FSM
    │                    │                    │                  │                  │
    │  clicks Save Draft │                    │                  │                  │
    │───────────────────>│                    │                  │                  │
    │                    │  saveDraft()       │                  │                  │
    │                    │──────────────────>│                  │                  │
    │                    │                    │  validate()      │                  │
    │                    │                    │──────┐           │                  │
    │                    │                    │<─────┘ ok        │                  │
    │                    │                    │                  │                  │
    │                    │                    │  API call        │                  │
    │                    │                    │──────────────>   │                  │
    │                    │                    │  <── success     │                  │
    │                    │                    │                  │                  │
    │                    │                    │  executeTransition('SAVE_DRAFT')    │
    │                    │                    │─────────────────>│                  │
    │                    │                    │                  │  transition()    │
    │                    │                    │                  │─────────────────>│
    │                    │                    │                  │  newStatus=SAVED │
    │                    │                    │                  │<─────────────────│
    │                    │                    │                  │                  │
    │                    │                    │                  │  tab.status=SAVED│
    │                    │                    │                  │  tab.isDirty=false│
    │                    │                    │<─────────────────│                  │
    │                    │  formData updated  │                  │                  │
    │                    │  (computed reacts) │                  │                  │
    │                    │<──────────────────│                  │                  │
    │  UI updates        │                    │                  │                  │
    │<───────────────────│                    │                  │                  │
```

---

## Summary

This architecture achieves:

- **Scalable**: New tabs = 6 files, zero rewrites
- **Maintainable**: Business logic in composables, UI in components
- **Separation of concerns**: Constants → Store → Composables → Components
- **Future-proof**: Role permissions, new statuses, approval workflows — all have clear extension points
- **Testable**: FSM and composables are pure functions/logic, testable without mounting components
- **No TypeScript dependency**: JSDoc provides IDE intellisense, Object.freeze protects constants
