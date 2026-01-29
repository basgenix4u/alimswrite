// app/admin/chat/page.jsx
'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  FiSend, FiUser, FiRefreshCw, FiMic, FiImage, 
  FiFile, FiPlay, FiPause, FiSquare, FiPaperclip 
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminChatPage() {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingVoice, setPlayingVoice] = useState(null)
  const [uploading, setUploading] = useState(false)

  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const audioPlayerRef = useRef(null)
  const selectedIdRef = useRef(null)

  // Track selected session
  useEffect(() => {
    selectedIdRef.current = selectedSession?.id
  }, [selectedSession?.id])

  // Fetch sessions
  const fetchSessions = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      
      const res = await fetch('/api/chat?status=all')
      if (!res.ok) return
      
      const data = await res.json()
      
      if (data.sessions) {
        setSessions(data.sessions)
        
        if (selectedIdRef.current) {
          const updated = data.sessions.find(s => s.id === selectedIdRef.current)
          if (updated) {
            setSelectedSession(updated)
          }
        }
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  // Polling with visibility check
  useEffect(() => {
    const startPolling = () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      pollingRef.current = setInterval(() => fetchSessions(true), 5000)
    }

    const stopPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling()
      } else {
        startPolling()
      }
    }

    startPolling()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibility)
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
    }
  }, [fetchSessions])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedSession?.messages])

  // Send reply (text, file, voice)
  const sendReply = async (
    text = replyMessage,
    messageType = 'text',
    fileUrl = null,
    fileName = null,
    fileDuration = null
  ) => {
    const messageText = (text || '').trim()
    if ((!messageText && !fileUrl) || !selectedSession || sending) return

    setSending(true)
    setReplyMessage('')

    // Optimistic update
    const tempId = `temp_${Date.now()}`
    const tempMsg = {
      id: tempId,
      sender: 'admin',
      message: messageText,
      messageType,
      fileUrl,
      fileName,
      fileDuration,
      createdAt: new Date().toISOString(),
      pending: true,
    }

    setSelectedSession(prev => ({
      ...prev,
      messages: [...(prev.messages || []), tempMsg]
    }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          message: messageText,
          sender: 'admin',
          messageType,
          fileUrl,
          fileName,
          fileDuration,
        }),
      })

      const data = await res.json()

      if (data.success) {
        // Replace temp message
        setSelectedSession(prev => ({
          ...prev,
          messages: prev.messages.map(m => 
            m.id === tempId 
              ? { ...(data.message || m), pending: false }
              : m
          )
        }))
        toast.success('Sent')
      } else {
        throw new Error('Failed')
      }
    } catch (error) {
      toast.error('Failed to send')
      setSelectedSession(prev => ({
        ...prev,
        messages: prev.messages.filter(m => m.id !== tempId)
      }))
    } finally {
      setSending(false)
    }
  }

  // File upload
  const handleFileUpload = async (file, type) => {
    if (!file || uploading || !selectedSession) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      
      if (data.success) {
        const msgText = type === 'image' ? 'Image sent' : file.name
        await sendReply(msgText, type, data.url, data.fileName)
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch (e) {
      toast.error('Upload error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  // Voice recording
  const startRecording = async () => {
    if (isRecording || !selectedSession) return
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      
      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach(track => track.stop())
        
        if (audioChunksRef.current.length === 0) return
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const file = new File([audioBlob], `voice_admin_${Date.now()}.webm`, { type: 'audio/webm' })
        
        const duration = recordingTime
        
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'voice')
        
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: formData })
          const data = await res.json()
          
          if (data.success) {
            await sendReply('Voice message', 'voice', data.url, null, duration)
          } else {
            toast.error('Voice upload failed')
          }
        } catch (error) {
          toast.error('Voice upload failed')
        } finally {
          setUploading(false)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      recordingTimerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000)
    } catch (e) {
      toast.error('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return
    
    if (mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
  }

  // Voice playback
  const playVoice = (url, id) => {
    if (playingVoice === id) {
      audioPlayerRef.current?.pause()
      setPlayingVoice(null)
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
      }
      audioPlayerRef.current = new Audio(url)
      audioPlayerRef.current.onended = () => setPlayingVoice(null)
      audioPlayerRef.current.play()
      setPlayingVoice(id)
    }
  }

  const formatDuration = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendReply()
    }
  }

  // Render message
  const renderMessage = (msg) => {
    switch (msg.messageType) {
      case 'image':
        return (
          <a href={msg.fileUrl} target="_blank" rel="noreferrer">
            <img src={msg.fileUrl} alt="attachment" className="max-w-[200px] rounded-lg mt-1" />
          </a>
        )
      case 'voice':
        return (
          <div className="flex items-center gap-2 mt-1 min-w-[150px]">
            <button 
              type="button"
              onClick={() => playVoice(msg.fileUrl, msg.id)} 
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              {playingVoice === msg.id ? <FiPause size={14} /> : <FiPlay size={14} />}
            </button>
            <span className="text-xs">{formatDuration(msg.fileDuration || 0)}</span>
          </div>
        )
      case 'file':
        return (
          <a href={msg.fileUrl} target="_blank" className="flex items-center gap-2 mt-1 text-blue-600 underline">
            <FiFile size={14} /> {msg.fileName || 'Download'}
          </a>
        )
      default:
        return <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      {/* Hidden inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'file')} 
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')} 
      />

      {/* Sessions List */}
      <div className="w-80 bg-white rounded-xl shadow-sm border flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Chats ({sessions.length})</h2>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => fetchSessions()}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading && sessions.length === 0 && (
            <p className="p-4 text-gray-500 text-center">Loading...</p>
          )}
          
          {!loading && sessions.length === 0 && (
            <p className="p-4 text-gray-500 text-center">No chats yet</p>
          )}
          
          {sessions.map(session => {
            const lastMsg = session.messages?.[session.messages.length - 1]
            const unread = session.messages?.filter(m => m.sender === 'visitor' && !m.isRead).length || 0
            
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => setSelectedSession(session)}
                className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                  selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {session.visitorName || 'Visitor'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(session.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate flex-1">
                    {lastMsg?.message || 'Started chat'}
                  </p>
                  {unread > 0 && (
                    <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border flex flex-col">
        {selectedSession ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">{selectedSession.visitorName || 'Anonymous'}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedSession.visitorPhone || 'No phone provided'}
                  </p>
                </div>
              </div>
              
              {selectedSession.visitorPhone && (
                <a 
                  href={`https://wa.me/${selectedSession.visitorPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600 p-2"
                >
                  <FaWhatsapp size={24} />
                </a>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {selectedSession.messages?.length === 0 && (
                <p className="text-center text-gray-400">No messages yet</p>
              )}
              
              {selectedSession.messages?.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'admin' 
                      ? `bg-blue-600 text-white ${msg.pending ? 'opacity-50' : ''}`
                      : msg.sender === 'visitor'
                      ? 'bg-white text-gray-900 border'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {renderMessage(msg)}
                    <span className={`text-[10px] block mt-1 text-right ${
                      msg.sender === 'admin' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {msg.pending && ' • Sending...'}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              {/* Recording indicator */}
              {isRecording && (
                <div className="mb-2 flex items-center gap-2 text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Recording: {formatDuration(recordingTime)}
                </div>
              )}
              
              {/* Uploading indicator */}
              {uploading && (
                <div className="mb-2 flex items-center gap-2 text-blue-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </div>
              )}
              
              <div className="flex gap-2">
                {/* Image button */}
                <button 
                  type="button"
                  onClick={() => imageInputRef.current?.click()} 
                  disabled={uploading || isRecording || sending}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50"
                  title="Send image"
                >
                  <FiImage size={18} />
                </button>
                
                {/* File button */}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploading || isRecording || sending}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50"
                  title="Send file"
                >
                  <FiPaperclip size={18} />
                </button>
                
                {/* Voice button */}
                <button 
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={uploading || sending}
                  className={`p-2 rounded disabled:opacity-50 ${
                    isRecording ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Record voice'}
                >
                  {isRecording ? <FiSquare size={18} /> : <FiMic size={18} />}
                </button>
                
                {/* Text input */}
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a reply..."
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isRecording || uploading || sending}
                />
                
                {/* Send button */}
                <Button 
                  onClick={() => sendReply()} 
                  disabled={!replyMessage.trim() || sending || isRecording || uploading}
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiSend />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FiUser size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a chat to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}