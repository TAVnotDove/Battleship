import { useContext, useEffect, useState } from "react"
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
  const [isReady, setIsReady] = useState(false)
  const [players, setPlayers] = useState<string[]>([])
  const [gameStarted, setGameStarted] = useState<string>("")

  useEffect(() => {
    socket.emit("get-room-players", gameName)

    socket.on("get-room-players", setPlayersHandler)
    socket.on("game-start", gameStartHandler)

    return () => {
      socket.off("get-room-players", setPlayersHandler)
      socket.off("game-start", gameStartHandler)

      socket.emit("leave-room", gameName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const grid = [
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]

  const clickHandler = () => {
    let shipPositions = "-"

    grid.forEach((row, rowIndex) =>
      row.forEach((column, columnIndex) => {
        if (column === "s") {
          shipPositions += `${rowIndex} ${columnIndex}-`
        }
      })
    )

    if (shipPositions.length === 69) {
      socket.emit("game-ready", gameName, shipPositions)

      setIsReady(true)
    }
  }

  const setPlayersHandler = (players: string[]) => {
    setPlayers(players)
  }

  const gameStartHandler = (firstPlayer: string) => {
    setGameStarted(firstPlayer)
  }

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
                  onClick={(e) => {
                    if (isReady) return

                    if (e.currentTarget.style.backgroundColor === "white") {
                      e.currentTarget.style.backgroundColor = "gray"
                      grid[numberIndex - 1][letterIndex - 1] = "s"
                    } else {
                      e.currentTarget.style.backgroundColor = "white"
                      grid[numberIndex - 1][letterIndex - 1] = ""
                    }
                  }}
                ></div>
              )
            })}
          </div>
        ))}
      </div>
      {!gameStarted ? (
        <div>
          {players.map((playerName) => (
            <h2 key={playerName}>
              {playerName}
              {playerName === socket.id && " (You)"}
            </h2>
          ))}
        </div>
      ) : (
        <h2>{gameStarted === socket.id ? "Your turn" : "Opponent's turn"}</h2>
      )}
      {!isReady && <button onClick={clickHandler}>Ready</button>}
    </>
  )
}

export default Game
