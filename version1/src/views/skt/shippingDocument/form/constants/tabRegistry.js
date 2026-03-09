// ============================================================================
// Tab Registry — Static Configuration
// ============================================================================

import { TabKey } from '../types/shipDocument'

/** @type {import('../types/shipDocument').TabConfig[]} */
export const TAB_REGISTRY = [
  { key: TabKey.PACKING_LIST, label: 'Packing List', icon: 'mdi-package-variant-closed', order: 1 },
  { key: TabKey.COMMERCIAL_INVOICE, label: 'Commercial Invoice', icon: 'mdi-file-document-outline', order: 2 },
  { key: TabKey.CERTIFICATE_OF_ORIGIN, label: 'Certificate of Origin', icon: 'mdi-certificate-outline', order: 3 },
  { key: TabKey.PACKING_DECLARATION, label: 'Packing Declaration', icon: 'mdi-text-box-check-outline', order: 4 },
  { key: TabKey.SHIPPING_PARTICULAR, label: 'Shipping Particular', icon: 'mdi-ship-wheel', order: 5 },
]

const tabMap = new Map(TAB_REGISTRY.map((t) => [t.key, t]))

export function getTabConfig(key) {
  return tabMap.get(key)
}

export function getOrderedTabs() {
  return [...TAB_REGISTRY].sort((a, b) => a.order - b.order)
}
