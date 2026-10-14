'use client'

/**
 * ChatbotMount
 *
 * Mounts the Preny AI Chatbot widget across all public pages,
 * along with the advisory lead prompt modal.
 */

import { useEffect, useState } from 'react'
import { AdvisoryLeadPopup } from './advisory-lead-popup'
import { PrenyChatbot } from './preny-chatbot'

export function ChatbotMount() {
  return (
    <>
      <AdvisoryLeadPopup />
      <PrenyChatbot />
    </>
  )
}

