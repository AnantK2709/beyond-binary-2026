import { useContext } from 'react'
import { GamificationContext } from '../../../context/GamificationContext'
import PointsNotification from './PointsNotification'
import LevelUpModal from './LevelUpModal'
import BadgeUnlock from './BadgeUnlock'

function GamificationOverlay() {
  const {
    recentAction,
    levelUpData,
    badgeUnlockData,
    dismissPointsNotification,
    dismissLevelUp,
    dismissBadgeUnlock,
  } = useContext(GamificationContext)

  return (
    <>
      {recentAction && (
        <PointsNotification
          points={recentAction.points}
          label={recentAction.label}
          onDismiss={dismissPointsNotification}
        />
      )}

      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          badge={levelUpData.badge}
          onDismiss={dismissLevelUp}
        />
      )}

      {badgeUnlockData && !levelUpData && (
        <BadgeUnlock
          badge={badgeUnlockData}
          onDismiss={dismissBadgeUnlock}
        />
      )}
    </>
  )
}

export default GamificationOverlay
