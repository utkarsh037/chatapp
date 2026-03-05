import { useEffect, useRef, useState } from "react"
import "./Chat.css"

function Chat({ user }) {

  const [messages,setMessages] = useState([])
  const [text,setText] = useState("")

  const receiver = user === "user1" ? "user2" : "user1"

  const socketRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(()=>{

    const WS_URL =
      window.location.hostname === "localhost"
        ? "ws://localhost:4000"
        : "wss://chatapp-e6u4.onrender.com"

    socketRef.current = new WebSocket(WS_URL)

    socketRef.current.onopen = ()=>{
      console.log("Connected to websocket")

      socketRef.current.send(JSON.stringify({
        type:"join",
        userId:user
      }))
    }

    socketRef.current.onmessage = (event)=>{
      const data = JSON.parse(event.data)

      if(data.type === "message"){
        setMessages(prev=>[...prev,data])
      }
    }

    socketRef.current.onerror = (err)=>{
      console.log("WebSocket error", err)
    }

    return ()=>{
      socketRef.current.close()
    }

  },[user])


  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])


  const sendMessage = ()=>{

    if(!text.trim()) return

    socketRef.current.send(JSON.stringify({
      type:"message",
      from:user,
      to:receiver,
      message:text
    }))

    setMessages(prev=>[
      ...prev,
      {from:user,message:text}
    ])

    setText("")
  }


  return(

    <div className="chat-container">

      <div className="sidebar">

        <h2>Chat App</h2>

        <div className="user-card">
          <strong>You</strong>
          <p>{user}</p>
        </div>

        <div className="user-card">
          <strong>Chatting with</strong>
          <p>{receiver}</p>
        </div>

      </div>


      <div className="chat-window">

        <div className="chat-header">
          Chat with {receiver}
        </div>

        <div className="messages">

          {messages.map((m,i)=>(

            <div
            key={i}
            className="message-row"
            style={{
              justifyContent:
              m.from === user ? "flex-end" : "flex-start"
            }}
            >

              {m.from !== user && (
                <div className="avatar">
                  {m.from[0].toUpperCase()}
                </div>
              )}

              <div
              className={`message ${
                m.from === user ? "me" : "other"
              }`}
              >
                {m.message}
              </div>

            </div>

          ))}

          <div ref={bottomRef}></div>

        </div>


        <div className="input-box">

          <input
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              sendMessage()
            }
          }}
          placeholder="Type message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>

  )

}

export default Chat