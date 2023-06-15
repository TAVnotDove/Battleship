import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../../contexts/socketContext"
import { useParams } from "react-router-dom"
import GameGrid from "../GameGrid/GameGrid"

const Game = () => {
  const socket = useContext(SocketContext)
  const { gameName } = useParams()
  const [isReady, setIsReady] = useState(false)
  const [players, setPlayers] = useState<string[]>([])
  const [gameStarted, setGameStarted] = useState<string>("")
  const [grids, setGrids] = useState<{ [key: string]: string[][] }>({
    defenseGrid: Array.from(Array(10), () => Array(10).fill("")),
    attackGrid: Array.from(Array(10), () => Array(10).fill("")),
  })

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

  const clickHandler = () => {
    let shipPositions = "-"

    grids.defenseGrid.forEach((row, rowIndex) =>
      row.forEach((column: string, columnIndex: number) => {
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

  const gridUpdateHandler = (gridType: string, row: number, column: number) => {
    setGrids((previousGrids) => {
      if (previousGrids[gridType][row][column] === "") {
        previousGrids[gridType][row][column] = "s"
      } else {
        previousGrids[gridType][row][column] = ""
      }

      return { ...previousGrids }
    })
  }

  return (
    <>
      <h1>Game {gameName}</h1>
      <GameGrid
        currentGrid={
          gameStarted === "" || gameStarted !== socket.id
            ? grids.defenseGrid
            : grids.attackGrid
        }
        currentGridType={
          gameStarted === "" || gameStarted !== socket.id
            ? "defenseGrid"
            : "attackGrid"
        }
        isReady={isReady}
        gridUpdateHandler={gridUpdateHandler}
      />
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
