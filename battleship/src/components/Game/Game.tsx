import { useContext } from "react"
import { SocketContext } from "../../contexts/socketContext"
import { useParams } from "react-router-dom"

const numbers = ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const gridBoxStyle = {
  backgroundColor: "white",
  border: "1px solid black",
  width: "50px",
  height: "50px",
  color: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
}

const Game = () => {
  const socket = useContext(SocketContext)
  const { gameName } = useParams()

  const clickHandler = () => {
    socket.emit("join-room", "Test")
  }

  // const grid = [[], [], [], [], [], [], [], [], [], []]

  return (
    <>
      <h1>Game {gameName}</h1>
      <div>
        {numbers.map((number, numberIndex) => (
          <div key={number} style={{ display: "flex" }}>
            {letters.map((letter, letterIndex) => {
              if (numberIndex === 0) {
                return (
                  <div key={letter} style={gridBoxStyle}>
                    {letter}
                  </div>
                )
              }

              if (letterIndex === 0) {
                return (
                  <div key={letter} style={gridBoxStyle}>
                    {number}
                  </div>
                )
              }

              return (
                <div
                  key={letter}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid black",
                    width: "50px",
                    height: "50px",
                  }}
                ></div>
              )
            })}
          </div>
        ))}
      </div>
      <button onClick={clickHandler}>Join Test</button>
    </>
  )
}

export default Game
