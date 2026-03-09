// ============================================================================
// Finite State Machine — Tab Status Transitions
// ============================================================================
// ALL status transitions go through here. Components never mutate status
// directly. Guards check documentStatus so VOID blocks everything.
// ============================================================================

import { TabStatus, DocumentStatus } from '../types/shipDocument'

/** @type {import('../types/shipDocument').StatusTransition[]} */
const transitions = [
  {
    from: TabStatus.DRAFT,
    action: 'SAVE_DRAFT',
    to: TabStatus.SAVED,
    guard: (ctx) => ctx.documentStatus !== DocumentStatus.VOID,
  },
  {
    from: TabStatus.SAVED,
    action: 'SAVE_DRAFT',
    to: TabStatus.SAVED,
    guard: (ctx) => ctx.documentStatus !== DocumentStatus.VOID,
  },
  {
    from: TabStatus.SAVED,
    action: 'CONFIRM',
    to: TabStatus.CONFIRMED,
    guard: (ctx) => ctx.documentStatus !== DocumentStatus.VOID,
  },
  {
    from: TabStatus.DRAFT,
    action: 'CONFIRM',
    to: TabStatus.CONFIRMED,
    guard: (ctx) => ctx.documentStatus !== DocumentStatus.VOID,
  },
  // Future:
  // { from: TabStatus.CONFIRMED, action: 'REOPEN', to: TabStatus.SAVED,
  //   guard: (ctx) => ctx.userRole === 'ADMIN' },
]

/**
 * @param {import('../types/shipDocument').TabAction} action
 * @param {import('../types/shipDocument').TransitionContext} context
 * @returns {boolean}
 */
export function canTransition(action, context) {
  return transitions.some(
    (t) =>
      t.from === context.currentTabStatus &&
      t.action === action &&
      (!t.guard || t.guard(context))
  )
}

/**
 * @param {import('../types/shipDocument').TabAction} action
 * @param {import('../types/shipDocument').TransitionContext} context
 * @returns {string|null}
 */
export function transition(action, context) {
  const rule = transitions.find(
    (t) =>
      t.from === context.currentTabStatus &&
      t.action === action &&
      (!t.guard || t.guard(context))
  )
  return rule?.to ?? null
}

/**
 * @param {import('../types/shipDocument').TransitionContext} context
 * @returns {import('../types/shipDocument').TabAction[]}
 */
export function getAllowedActions(context) {
  return transitions
    .filter(
      (t) =>
        t.from === context.currentTabStatus && (!t.guard || t.guard(context))
    )
    .map((t) => t.action)
}

/**
 * @param {string} status
 * @param {string} documentStatus
 * @returns {boolean}
 */
export function isTerminalStatus(status, documentStatus) {
  if (documentStatus === DocumentStatus.VOID) return true
  return status === TabStatus.CONFIRMED
}
