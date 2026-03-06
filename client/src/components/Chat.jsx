import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Chat.css"

const WS_URL =
  window.location.hostname === "localhost"
    ? "ws://localhost:4000"
    : "wss://chatapp-e6u4.onrender.com"

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function Chat() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [connected, setConnected] = useState(false)

  // Use user's full name or email as their identity
  const userId = user?.id || user?.email
  const displayName = user ? `${user.firstName} ${user.lastName}` : "You"

  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!userId) return

    socketRef.current = new WebSocket(WS_URL)

    socketRef.current.onopen = () => {
      setConnected(true)
      socketRef.current.send(JSON.stringify({ type: "join", userId }))
    }

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "message") {
        setMessages(prev => [...prev, { ...data, time: formatTime() }])
      }
    }

    socketRef.current.onerror = () => setConnected(false)
    socketRef.current.onclose = () => setConnected(false)

    return () => socketRef.current?.close()
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!text.trim() || !socketRef.current) return
    const msg = { from: userId, fromName: displayName, message: text, time: formatTime() }
    socketRef.current.send(JSON.stringify({
      type: "message",
      from: userId,
      fromName: displayName,
      message: text
    }))
    setMessages(prev => [...prev, msg])
    setText("")
    inputRef.current?.focus()
  }

  const handleLogout = () => {
    socketRef.current?.close()
    logout()
    navigate("/login")
  }

  const initials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="chat-root">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="app-logo">
            <div className="logo-icon">💬</div>
            <span className="app-name">NexChat</span>
          </div>
          <div className="status-dot-wrapper">
            <div className={`status-dot ${connected ? "online" : "offline"}`} />
            <span className="status-text">{connected ? "connected" : "offline"}</span>
          </div>
        </div>

        <div className="sidebar-body">
          <div className="sidebar-label">You</div>

          <div className="user-pill active">
            <div className="avatar avatar-me">{initials(displayName)}</div>
            <div className="pill-info">
              <div className="pill-name">{displayName}</div>
              <div className="pill-sub">{user?.email}</div>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="msg-count">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>⇠</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="chat-main">

        <div className="chat-header">
          <div className="header-left">
            <div className="header-avatar">🌐</div>
            <div className="header-info">
              <h3>Global Chat</h3>
              <p>● {connected ? "live" : "disconnected"}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="icon-btn">⋯</div>
          </div>
        </div>

        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <div className="empty-text">
                No messages yet.<br />Say something to start the conversation.
              </div>
            </div>
          ) : (
            <>
              <div className="date-divider">
                <span className="date-label">Today</span>
              </div>

              {messages.map((m, i) => {
                const isMe = m.from === userId
                const senderName = isMe ? displayName : (m.fromName || m.from)
                return (
                  <div key={i} className={`msg-row ${isMe ? "me" : "other"}`}>
                    {!isMe && (
                      <div className="msg-avatar">
                        {initials(senderName)}
                      </div>
                    )}
                    <div className="bubble-wrap">
                      {!isMe && <div className="bubble-sender">{senderName}</div>}
                      <div className={`bubble ${isMe ? "me" : "other"}`}>
                        {m.message}
                      </div>
                      <div className="bubble-time">{m.time}</div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-row">
            <input
              ref={inputRef}
              className="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={sendMessage}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <div className="input-hint">Enter to send</div>
        </div>

      </main>
    </div>
  )
}

export default Chat