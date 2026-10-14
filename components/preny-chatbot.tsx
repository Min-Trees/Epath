'use client'

import { useEffect } from 'react'

/**
 * PrenyChatbot
 * Integrates Preny AI Chatbot widget for EPath Education.
 *
 * Embed script:
 * <script
 *   data-name-bot="EPath Education"
 *   src="https://app.preny.ai/embed-global.js"
 *   data-button-style="width:300px;height:300px;"
 *   data-language="vi"
 *   async
 *   defer
 *   data-preny-bot-id="6acdb082d9183fe783ba1c26"
 * ></script>
 */
export function PrenyChatbot() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Inject Preny script if not already present
    const hasHost = document.querySelector('#preny-chat-host')
    const hasScript = document.querySelector('script[data-preny-bot-id="6acdb082d9183fe783ba1c26"]')

    if (!hasHost && !hasScript) {
      const script = document.createElement('script')
      script.src = 'https://app.preny.ai/embed-global.js'
      script.async = true
      script.defer = true
      script.setAttribute('data-name-bot', 'EPath Education')
      script.setAttribute('data-image', '/images/epath-chat-icon.svg')
      script.setAttribute('data-button-style', 'width:64px;height:64px;right:24px;bottom:24px;')
      script.setAttribute('data-width', '410px')
      script.setAttribute('data-height', '600px')
      script.setAttribute('data-container-style', 'border-radius:16px;box-shadow:0 24px 60px -12px rgba(30,53,112,0.25);border:1px solid #DEDDD6;bottom:24px;right:24px;overflow:hidden;')
      script.setAttribute('data-language', 'vi')
      script.setAttribute('data-preny-bot-id', '6acdb082d9183fe783ba1c26')
      document.body.appendChild(script)
    }

    // 2. Inject custom CSS into Preny's Open Shadow DOM for refined button icon, hover, and layout
    const applyShadowStyles = () => {
      const host = document.getElementById('preny-chat-host')
      if (host && host.shadowRoot) {
        // Ensure image is set to EPath icon
        const gifImg = host.shadowRoot.getElementById('preny-gif') as HTMLImageElement | null
        if (gifImg && !gifImg.src.includes('epath-chat-icon.svg')) {
          gifImg.src = '/images/epath-chat-icon.svg'
        }

        if (!host.shadowRoot.getElementById('epath-preny-custom-style')) {
          const style = document.createElement('style')
          style.id = 'epath-preny-custom-style'
          style.textContent = `
            #preny-open {
              width: 64px !important;
              height: 64px !important;
              right: 24px !important;
              bottom: 24px !important;
              padding: 0 !important;
              border-radius: 50% !important;
              transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease !important;
              filter: drop-shadow(0 10px 24px rgba(30, 53, 112, 0.3)) !important;
              cursor: pointer !important;
              overflow: visible !important;
            }
            #preny-open:hover {
              transform: scale(1.08) translateY(-3px) !important;
              filter: drop-shadow(0 16px 36px rgba(30, 53, 112, 0.42)) !important;
            }
            #preny-gif {
              width: 100% !important;
              height: 100% !important;
              object-fit: contain !important;
              border-radius: 50% !important;
            }
            #preny-chat-container {
              width: 410px !important;
              height: 600px !important;
              border-radius: 16px !important;
              border: 1px solid #DEDDD6 !important;
              box-shadow: 0 24px 60px -12px rgba(30, 53, 112, 0.25), 0 4px 16px rgba(0, 0, 0, 0.04) !important;
              bottom: 24px !important;
              right: 24px !important;
              overflow: hidden !important;
            }
            #preny-close {
              background-color: rgba(255, 255, 255, 0.9) !important;
              backdrop-filter: blur(8px) !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
              top: 12px !important;
              right: 12px !important;
              transition: all 0.2s ease !important;
            }
            #preny-close:hover {
              background-color: #ffffff !important;
              transform: scale(1.08) !important;
            }
            @media (max-width: 640px) {
              #preny-open {
                width: 56px !important;
                height: 56px !important;
                right: 16px !important;
                bottom: 16px !important;
              }
              #preny-chat-container {
                width: 100% !important;
                height: 86vh !important;
                border-radius: 20px 20px 0 0 !important;
                bottom: 0 !important;
                right: 0 !important;
              }
            }
          `
          host.shadowRoot.appendChild(style)
        }
        return true
      }
      return false
    }

    const intervalId = window.setInterval(() => {
      if (applyShadowStyles()) {
        window.clearInterval(intervalId)
      }
    }, 250)

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId)
    }, 8000)

    // 3. Listen for custom 'epath-open-chat' events (e.g. from AdvisoryLeadPopup or other CTA buttons)
    const handleOpenChat = () => {
      const tryClick = (retries = 12) => {
        const host = document.getElementById('preny-chat-host')
        if (host && host.shadowRoot) {
          const openBtn = host.shadowRoot.getElementById('preny-open')
          if (openBtn) {
            openBtn.click()
            return
          }
        }
        if (retries > 0) {
          setTimeout(() => tryClick(retries - 1), 300)
        }
      }
      tryClick()
    }

    // 4. Check if a trigger was queued before mount
    if (sessionStorage.getItem('epath-wants-chat-open') === '1') {
      sessionStorage.removeItem('epath-wants-chat-open')
      handleOpenChat()
    }

    window.addEventListener('epath-open-chat', handleOpenChat)
    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
      window.removeEventListener('epath-open-chat', handleOpenChat)
    }
  }, [])

  return null
}

