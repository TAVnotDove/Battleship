import { useContext } from "react"
import { SocketContext } from "../../contexts/socketContext"

const Join = () => {
  const socket = useContext(SocketContext)

  const clickHandler = () => {
    socket.emit("join-room", "Test")
  }

  return (
    <>
      <h1>Join</h1>
      <button onClick={clickHandler}>Join Test</button>
    </>
  )
}

export default Join
