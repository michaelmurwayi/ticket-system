import type { TicketPriority, TicketStatus } from '../store/types'

/**
 * Shared color + label definitions for ticket priorities and statuses.
 * This is the single source of truth used by the chips, the table, and the
 * legend so colors stay consistent everywhere.
 */

export interface BadgeMeta {
  label: string
  /** Base color for text/border. */
  color: string
  /** Translucent background derived from the color. */
  bg: string
}

export const priorityMeta: Record<TicketPriority, BadgeMeta> = {
  low: { label: 'Low', color: '#43a047', bg: 'rgba(67, 160, 71, 0.15)' },
  medium: { label: 'Medium', color: '#e6c65a', bg: 'rgba(230, 198, 90, 0.15)' },
  high: { label: 'High', color: '#e53935', bg: 'rgba(229, 57, 53, 0.15)' },
}

export const statusMeta: Record<TicketStatus, BadgeMeta> = {
  open: { label: 'Open', color: '#42a5f5', bg: 'rgba(66, 165, 245, 0.15)' },
  in_progress: {
    label: 'In Progress',
    color: '#ab47bc',
    bg: 'rgba(171, 71, 188, 0.15)',
  },
  closed: { label: 'Closed', color: '#9e9e9e', bg: 'rgba(158, 158, 158, 0.15)' },
}

/** Human-friendly label for a status, falling back to the raw value. */
export function statusLabel(status: string): string {
  return statusMeta[status as TicketStatus]?.label ?? status
}

/** Human-friendly label for a priority, falling back to the raw value. */
export function priorityLabel(priority: string): string {
  return priorityMeta[priority as TicketPriority]?.label ?? priority
}
