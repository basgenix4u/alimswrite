// lib/sounds.js
'use client'

// Notification sound as base64 (short beep)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9teleVo9tele'

let audioContext = null
let notificationBuffer = null

export const initAudio = async () => {
  if (typeof window === 'undefined') return
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Create a simple beep sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.value = 0.3
    
    return true
  } catch (error) {
    console.error('Failed to init audio:', error)
    return false
  }
}

export const playNotificationSound = () => {
  if (typeof window === 'undefined') return
  
  try {
    // Simple beep using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
    
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.3)
  } catch (error) {
    // Fallback: try to play audio element
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch (e) {
      console.log('Could not play notification sound')
    }
  }
}

export const playMessageSound = () => {
  playNotificationSound()
}
