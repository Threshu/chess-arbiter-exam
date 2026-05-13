// sweepExpiredSessions (scheduled, every 5 minutes)
// Find sessions where status == 'active' AND expiresAt < now - 60s, force them
// to 'completed' (auto-submit safety net). The 60-second grace lets the
// client's own submission land first under normal conditions.
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { FIRESTORE_REGION, SWEEP_INTERVAL_MINUTES } from '../../../shared/constants.js'

export const sweepExpiredSessions = onSchedule(
  {
    schedule: `every ${SWEEP_INTERVAL_MINUTES} minutes`,
    region: FIRESTORE_REGION,
    timeZone: 'Europe/Warsaw',
  },
  async () => {
    // TODO(phase-4): query and auto-submit expired active sessions
  },
)
