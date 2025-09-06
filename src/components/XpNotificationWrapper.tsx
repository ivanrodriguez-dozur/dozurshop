'use client'

import { useGamificationStore } from '@/store/gamificationStore'
import XpNotification from '@/components/XpNotification'

export default function XpNotificationWrapper() {
  const { notification, hideNotification } = useGamificationStore()
  
  return (
    <XpNotification
      xp={notification.xp}
      message={notification.message}
      show={notification.show}
      onHide={hideNotification}
    />
  )
}
