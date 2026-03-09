// ============================================================================
// Router — Ship Document Module
// ============================================================================
// Import into main router:
//   import { shipDocumentRoutes } from '@/modules/ship-document/router'
//   routes: [...otherRoutes, ...shipDocumentRoutes]
// ============================================================================

export const shipDocumentRoutes = [
  {
    path: '/shipping-document',
    name: 'ship-document-list',
    component: () => import('../views/ShipDocumentList.vue'),
    meta: { title: 'Ship Documents', requiresAuth: true },
  },
  {
    path: '/shipping-document/:id',
    name: 'ship-document-detail',
    component: () => import('../views/[id].vue'),
    meta: { title: 'Ship Document Detail', requiresAuth: true },
    props: true,
  },
]
