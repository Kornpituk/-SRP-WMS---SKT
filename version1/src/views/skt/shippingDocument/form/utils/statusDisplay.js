// ============================================================================
// Status Display Helpers (status → color / icon / text)
// ============================================================================

import { TabStatus, DocumentStatus } from '../types/shipDocument'

const tabMap = {
  [TabStatus.DRAFT]: { color: 'grey', icon: 'mdi-circle-outline', text: 'Draft', chipColor: 'grey-lighten-1' },
  [TabStatus.SAVED]: { color: 'orange', icon: 'mdi-circle-half-full', text: 'Saved', chipColor: 'orange' },
  [TabStatus.CONFIRMED]: { color: 'green', icon: 'mdi-check-circle', text: 'Confirmed', chipColor: 'green' },
}

const docMap = {
  [DocumentStatus.ACTIVE]: { color: 'green', icon: 'mdi-check-circle', text: 'Active' },
  [DocumentStatus.VOID]: { color: 'red', icon: 'mdi-cancel', text: 'Void' },
}

export function getTabStatusDisplay(status) {
  return tabMap[status] ?? { color: 'grey', icon: 'mdi-help-circle', text: status, chipColor: 'grey' }
}

export function getDocumentStatusDisplay(status) {
  return docMap[status] ?? { color: 'grey', icon: 'mdi-help-circle', text: status }
}
