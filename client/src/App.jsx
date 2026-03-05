import { useState } from "react"
import Chat from "./Chat"

function App() {

  const [inputUser, setInputUser] = useState("")
  const [user, setUser] = useState("")

  if (!user) {
    return (
      <div>

        <h2>Enter Username</h2>

        <input
          placeholder="Enter user (user1 / user2)"
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
        />

        <button onClick={() => setUser(inputUser)}>
          Join Chat
        </button>

      </div>
    )
  }

  return (
    <div>
      <h1>Realtime Chat</h1>
      <Chat user={user}/>
    </div>
  )
}

export default App