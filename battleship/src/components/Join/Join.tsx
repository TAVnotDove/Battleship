import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../contexts/socketContext"
import { useNavigate } from "react-router-dom"

const Join = () => {
  const [rooms, setRooms] = useState([])
  const socket = useContext(SocketContext)
  const navigate = useNavigate()

  useEffect(() => {
    getRoomsHandler()
  }, [])

  const joinRoomHandler = (roomName: string) => {
    socket.emit("join-room", roomName)

    navigate(`/play/multi/${roomName}`)
  }

  const getRoomsHandler = () => {
    socket.emit("get-rooms")

    socket.once("get-rooms", (rooms) => {
      setRooms(rooms)
    })
  }

  return (
    <>
      <h1>Join</h1>
      {rooms.length > 0 ? (
        <div>
          {rooms.map((room, i) => (
            <button key={room + i} onClick={() => joinRoomHandler(room)}>
              {room}
            </button>
          ))}
        </div>
      ) : (
        <h2>No rooms available.</h2>
      )}
      <button onClick={getRoomsHandler}>Refresh</button>
    </>
  )
}

export default Join
