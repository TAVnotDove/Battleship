import { useContext, useRef } from "react"
import { SocketContext } from "../../contexts/socketContext"
import { useNavigate } from "react-router-dom"

const Create = () => {
  const socket = useContext(SocketContext)
  const inputRef: any = useRef()
  const selectRef: any = useRef()
  const navigate = useNavigate()

  const clickHandler = () => {
    if (inputRef.current.value.trim().length !== 0) {
      socket.emit("join-room", inputRef.current.value.trim())

      navigate(`/play/multi/${inputRef.current.value.trim()}`)
    }
  }

  return (
    <>
      <h1>Create</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="game-name">Name:</label>
          <input ref={inputRef} id="game-name" placeholder="Test" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label htmlFor="game-visibility">Visibility:</label>
          <select ref={selectRef} id="game-visibility">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button type="button" onClick={clickHandler}>
          Create Room
        </button>
      </div>
    </>
  )
}

export default Create
