// components/common/ChatWidget.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  FaComments, 
  FaTimes, 
  FaPaperPlane, 
  FaWhatsapp, 
  FaPaperclip, 
  FaMicrophone, 
  FaStop,
  FaPlay,
  FaPause,
  FaImage
} from 'react-icons/fa'
import { FiFile } from 'react-icons/fi'
import { useSettings } from '@/lib/SettingsContext'

export default function ChatWidget() {
  const { settings } = useSettings()
  
  const [messagesMap, setMessagesMap] = useState(new Map())
  const [inputMessage, setInputMessage] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [visitorInfo, setVisitorInfo] = useState({ name: '', phone: '' })
  const [showInfoForm, setShowInfoForm] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [playingVoiceId, setPlayingVoiceId] = useState(null)
  const [error, setError] = useState(null)
  
  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)
  const timeoutRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const audioPlayerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const initializedRef = useRef(false)
  const lastPollTimeRef = useRef(null)

  const messages = Array.from(messagesMap.values()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  )

  // ==================== INITIALIZATION ====================
  
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const savedSession = localStorage.getItem('chatSessionId')
    if (savedSession) {
      setSessionId(savedSession)
      loadMessages(savedSession)
    }

    return () => {
      stopPolling()
      stopRecordingCleanup()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // ==================== LOAD MESSAGES ====================
  
  const loadMessages = async (sid) => {
    try {
      const res = await fetch(`/api/chat/${sid}`)
      if (!res.ok) {
        localStorage.removeItem('chatSessionId')
        setSessionId(null)
        return
      }
      
      const data = await res.json()
      if (data.messages && data.messages.length > 0) {
        const newMap = new Map()
        data.messages.forEach(msg => {
          newMap.set(msg.id, msg)
        })
        setMessagesMap(newMap)
        lastPollTimeRef.current = new Date().toISOString()
      }
    } catch (err) {
      console.error('Load messages error:', err)
    }
  }

  // ==================== WELCOME MESSAGE ====================
  
  useEffect(() => {
    if (isOpen && messagesMap.size === 0 && !sessionId) {
      const welcomeId = 'welcome_' + Date.now()
      setMessagesMap(new Map([[welcomeId, {
        id: welcomeId,
        sender: 'bot',
        message: 'Hello! Welcome to AlimsWrite. How can we help you today?',
        messageType: 'text',
        createdAt: new Date().toISOString(),
      }]]))
    }
  }, [isOpen, messagesMap.size, sessionId])

  // ==================== POLLING ====================
  
  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  useEffect(() => {
    if (!isOpen || !sessionId) {
      stopPolling()
      return
    }

    const poll = async () => {
      try {
        const url = `/api/chat/${sessionId}`
        const res = await fetch(url)
        if (!res.ok) return
        
        const data = await res.json()
        if (!data.messages) return

        setMessagesMap(prevMap => {
          const newMap = new Map(prevMap)
          let hasNewAdminMsg = false
          
          data.messages.forEach(msg => {
            if (!newMap.has(msg.id)) {
              newMap.set(msg.id, msg)
              if (msg.sender === 'admin') {
                hasNewAdminMsg = true
              }
            }
          })

          if (hasNewAdminMsg) {
            setShowWhatsApp(false)
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
              timeoutRef.current = null
            }
            playNotificationSound()
          }

          return newMap
        })
      } catch (err) {
        console.error('Poll error:', err)
      }
    }

    poll()
    pollingRef.current = setInterval(poll, 3000)

    return stopPolling
  }, [isOpen, sessionId])

  // ==================== SCROLL ====================
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // ==================== HELPERS ====================
  
  const getVisitorId = () => {
    if (typeof window === 'undefined') return null
    let id = localStorage.getItem('chatVisitorId')
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('chatVisitorId', id)
    }
    return id
  }

  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch (e) {}
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startWhatsAppTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setShowWhatsApp(true)
    }, (settings?.chatTimeout || 60) * 1000)
  }

  // ==================== SEND MESSAGE ====================
  
  const sendMessage = async (
    text = null,
    messageType = 'text',
    fileUrl = null,
    fileName = null,
    fileDuration = null
  ) => {
    const messageText = (text || inputMessage).trim()
    
    if (!messageText && !fileUrl) return
    if (isSending) return
    
    setIsSending(true)
    setError(null)
    setInputMessage('')

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
    const tempMsg = {
      id: tempId,
      sender: 'visitor',
      message: messageText,
      messageType,
      fileUrl,
      fileName,
      fileDuration,
      createdAt: new Date().toISOString(),
      pending: true,
    }
    
    setMessagesMap(prev => new Map(prev).set(tempId, tempMsg))
    startWhatsAppTimeout()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          visitorId: getVisitorId(),
          message: messageText,
          sender: 'visitor',
          messageType,
          fileUrl,
          fileName,
          fileDuration,
        }),
      })

      const data = await res.json()

      if (data.success && data.session) {
        if (!sessionId) {
          setSessionId(data.session.id)
          localStorage.setItem('chatSessionId', data.session.id)
        }

        setMessagesMap(prev => {
          const newMap = new Map(prev)
          newMap.delete(tempId)
          
          if (data.message) {
            newMap.set(data.message.id, { ...data.message, pending: false })
          } else {
            newMap.set(tempId, { ...tempMsg, pending: false })
          }
          
          return newMap
        })
      } else {
        throw new Error(data.error || 'Failed to send')
      }
    } catch (err) {
      console.error('Send error:', err)
      setError('Failed to send message')
      
      setMessagesMap(prev => {
        const newMap = new Map(prev)
        const msg = newMap.get(tempId)
        if (msg) {
          newMap.set(tempId, { ...msg, pending: false, failed: true })
        }
        return newMap
      })
    } finally {
      setIsSending(false)
    }
  }

  // ==================== FILE UPLOAD ====================
  
  const handleFileUpload = async (file, type = 'file') => {
    if (!file || isUploading) return
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB')
      return
    }
    
    setIsUploading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        const msgText = type === 'image' ? 'Sent an image' : `Sent: ${file.name}`
        await sendMessage(msgText, type, data.url, data.fileName)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload file')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  // ==================== VOICE RECORDING ====================
  
  const stopRecordingCleanup = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    setIsRecording(false)
  }

  const startRecording = async () => {
    if (isRecording || isUploading || isSending) return
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach(track => track.stop())
        
        if (audioChunksRef.current.length === 0) return
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const file = new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' })
        
        const duration = recordingTime
        
        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'voice')

        try {
          const res = await fetch('/api/upload', { method: 'POST', body: formData })
          const data = await res.json()
          
          if (data.success) {
            await sendMessage('Voice message', 'voice', data.url, null, duration)
          } else {
            setError('Failed to upload voice message')
          }
        } catch (err) {
          console.error('Voice upload error:', err)
          setError('Failed to upload voice message')
        } finally {
          setIsUploading(false)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (err) {
      console.error('Recording error:', err)
      setError('Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (!isRecording) return
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    stopRecordingCleanup()
  }

  // ==================== VOICE PLAYBACK ====================
  
  const playVoiceMessage = (url, msgId) => {
    if (playingVoiceId === msgId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current.currentTime = 0
      }
      setPlayingVoiceId(null)
      return
    }
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
    }
    
    audioPlayerRef.current = new Audio(url)
    audioPlayerRef.current.onended = () => {
      setPlayingVoiceId(null)
    }
    audioPlayerRef.current.onerror = () => {
      setPlayingVoiceId(null)
      setError('Failed to play audio')
    }
    
    audioPlayerRef.current.play()
      .then(() => {
        setPlayingVoiceId(msgId)
      })
      .catch(err => {
        console.error('Play error:', err)
        setPlayingVoiceId(null)
      })
  }

  // ==================== WHATSAPP ====================
  
  const openWhatsApp = () => {
    const phone = settings?.whatsappNumber || '09039611238'
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) cleaned = '234' + cleaned.substring(1)
    
    const lastMsg = messages.filter(m => m.sender === 'visitor').pop()
    const text = lastMsg?.message || 'Hello, I need help'
    
    window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // ==================== CALLBACK REQUEST ====================
  
  const submitContactInfo = async () => {
    if (!visitorInfo.name || !visitorInfo.phone) return

    try {
      if (sessionId) {
        await fetch(`/api/chat/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorName: visitorInfo.name,
            visitorPhone: visitorInfo.phone,
          }),
        })
      }

      const callbackId = `callback_${Date.now()}`
      setMessagesMap(prev => new Map(prev).set(callbackId, {
        id: callbackId,
        sender: 'bot',
        message: `Thank you ${visitorInfo.name}! We'll call you at ${visitorInfo.phone} shortly.`,
        messageType: 'text',
        createdAt: new Date().toISOString(),
      }))
      
      setShowInfoForm(false)
      setShowWhatsApp(false)
      setVisitorInfo({ name: '', phone: '' })
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    } catch (err) {
      console.error('Callback error:', err)
      setError('Failed to submit contact info')
    }
  }

  // ==================== KEYBOARD ====================
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ==================== RENDER MESSAGE CONTENT ====================
  
  const renderMessageContent = (msg) => {
    switch (msg.messageType) {
      case 'image':
        return (
          <div>
            <img 
              src={msg.fileUrl} 
              alt="Image" 
              className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
              onClick={() => window.open(msg.fileUrl, '_blank')}
            />
          </div>
        )
      
      case 'voice':
        return (
          <div className="flex items-center gap-2 min-w-[120px]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                playVoiceMessage(msg.fileUrl, msg.id)
              }}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
            >
              {playingVoiceId === msg.id ? (
                <FaPause size={10} />
              ) : (
                <FaPlay size={10} />
              )}
            </button>
            <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden min-w-[40px]">
              <div 
                className={`h-full bg-white/60 rounded-full transition-all duration-300 ${
                  playingVoiceId === msg.id ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <span className="text-xs opacity-75 flex-shrink-0">
              {formatDuration(msg.fileDuration || 0)}
            </span>
          </div>
        )
      
      case 'file':
        return (
          <a 
            href={msg.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 underline hover:no-underline"
          >
            <FiFile size={14} className="flex-shrink-0" />
            <span className="truncate max-w-[120px]">{msg.fileName || 'Download'}</span>
          </a>
        )
      
      default:
        return <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
    }
  }

  // ==================== RENDER ====================
  
  if (settings?.chatEnabled === false) return null

  const isDisabled = isSending || isUploading || isRecording

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file, 'file')
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file, 'image')
        }}
      />

      {/* Chat Button - Fixed position with safe area */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => { setIsOpen(true); setUnreadCount(0) }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-primary-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-800 transition-all hover:scale-105"
        >
          <FaComments size={20} className="sm:w-6 sm:h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window - FIXED MOBILE LAYOUT */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-50 
                        sm:w-80 md:w-96 sm:h-[500px] sm:max-h-[80vh]
                        bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:border">
          
          {/* Header */}
          <div className="bg-primary-900 text-white p-3 sm:p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <FaComments size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Chat with us</h3>
                <p className="text-xs text-primary-200">We reply within minutes</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => { setIsOpen(false); setUnreadCount(0) }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 text-sm flex justify-between items-center shrink-0">
              <span className="text-xs sm:text-sm">{error}</span>
              <button 
                type="button"
                onClick={() => setError(null)} 
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}

          {/* Messages - Scrollable area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-2.5 sm:p-3 rounded-2xl ${
                    msg.sender === 'visitor'
                      ? `bg-primary-900 text-white ${msg.pending ? 'opacity-60' : ''} ${msg.failed ? 'bg-red-500' : ''}`
                      : msg.sender === 'admin'
                      ? 'bg-green-100 text-gray-800 border border-green-200'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  }`}
                >
                  {msg.sender === 'admin' && (
                    <p className="text-xs text-green-600 font-medium mb-1">Support</p>
                  )}
                  
                  {renderMessageContent(msg)}
                  
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className={`text-[10px] sm:text-xs ${
                      msg.sender === 'visitor' ? 'text-primary-200' : 'text-gray-400'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {msg.pending && <span className="text-[10px]">•••</span>}
                    {msg.failed && <span className="text-[10px] text-red-200">Failed</span>}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Fallback */}
          {showWhatsApp && (
            <div className="p-3 bg-yellow-50 border-t space-y-2 shrink-0">
              <button
                type="button"
                onClick={openWhatsApp}
                className="w-full bg-green-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 text-sm font-medium"
              >
                <FaWhatsapp size={18} /> Continue on WhatsApp
              </button>
              
              {!showInfoForm ? (
                <button
                  type="button"
                  onClick={() => setShowInfoForm(true)}
                  className="w-full text-primary-600 text-sm hover:underline py-1"
                >
                  Or request a callback
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={visitorInfo.name}
                    onChange={(e) => setVisitorInfo(v => ({ ...v, name: e.target.value }))}
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={visitorInfo.phone}
                    onChange={(e) => setVisitorInfo(v => ({ ...v, phone: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={submitContactInfo}
                    disabled={!visitorInfo.name || !visitorInfo.phone}
                    className="w-full bg-primary-900 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                  >
                    Request Callback
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input Area - FIXED FOR MOBILE */}
{!showWhatsApp && (
  <div className="p-2 sm:p-3 border-t bg-white shrink-0">
    {/* Recording indicator */}
    {isRecording && (
      <div className="flex items-center justify-between mb-2 p-2 bg-red-50 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm text-red-600 font-medium">
            Recording {formatDuration(recordingTime)}
          </span>
        </div>
        <button 
          type="button"
          onClick={stopRecording} 
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <FaStop size={10} />
        </button>
      </div>
    )}

    {/* Uploading indicator */}
    {isUploading && (
      <div className="flex items-center gap-2 mb-2 p-2 bg-blue-50 rounded-xl">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs sm:text-sm text-blue-600">Uploading...</span>
      </div>
    )}

    {/* Input row - ALL BUTTONS VISIBLE */}
    <div className="flex items-center gap-1">
      {/* Image button */}
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        disabled={isDisabled}
        className="p-1.5 sm:p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        title="Send image"
      >
        <FaImage size={14} className="sm:w-4 sm:h-4" />
      </button>
      
      {/* File button - NOW VISIBLE ON ALL SCREENS */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isDisabled}
        className="p-1.5 sm:p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        title="Send file"
      >
        <FaPaperclip size={14} className="sm:w-4 sm:h-4" />
      </button>
      
      {/* Voice button */}
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isUploading || isSending}
        className={`p-1.5 sm:p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 ${
          isRecording 
            ? 'text-red-500 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'
        }`}
        title={isRecording ? 'Stop recording' : 'Record voice'}
      >
        <FaMicrophone size={14} className="sm:w-4 sm:h-4" />
      </button>

      {/* Text input - Flexible width */}
      <input
        type="text"
        placeholder="Message..."
        className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isDisabled}
      />

      {/* Send button - Fixed size */}
      <button
        type="button"
        onClick={() => sendMessage()}
        disabled={!inputMessage.trim() || isDisabled}
        className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        {isSending ? (
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <FaPaperPlane size={12} className="sm:w-3.5 sm:h-3.5" />
        )}
      </button>
    </div>
  </div>
)}
       </div>
      )}
    </>
  )
}