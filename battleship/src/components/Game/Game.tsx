import { useContext, useEffect, useRef, useState } from "react"
import { SocketContext } from "../../contexts/socketContext"
import { useParams } from "react-router-dom"
import GameGrid from "../GameGrid/GameGrid"

const Game = () => {
  const socket = useContext(SocketContext)
  const { gameName } = useParams()
  const [gameState, setGameState] = useState<{
    isReady: boolean
    players: string[]
    currentTurn: "player" | "opponent"
    gameStarted: boolean
    gameOverMessage: string
  }>({
    isReady: false,
    players: [],
    currentTurn: "opponent",
    gameStarted: false,
    gameOverMessage: "",
  })
  const canAttack = useRef(true)
  const battleshipsLeft = useRef(17)
  const [grids, setGrids] = useState<{ [key: string]: string[][] }>({
    defenseGrid: Array.from(Array(10), () => Array(10).fill("")),
    attackGrid: Array.from(Array(10), () => Array(10).fill("")),
  })

  useEffect(() => {
    socket.emit("get-room-players", gameName)

    socket.on("get-room-players", setPlayersHandler)
    socket.on("game-start", gameStartHandler)
    socket.on("game-attack-hit", attackHitHandler)
    socket.on("game-attack-missed", attackMissedHandler)

    return () => {
      socket.off("get-room-players", setPlayersHandler)
      socket.off("game-start", gameStartHandler)
      socket.off("game-attack-hit", attackHitHandler)
      socket.off("game-attack-missed", attackMissedHandler)

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

      setGameState((previousGameState) => {
        return { ...previousGameState, isReady: true }
      })
    }
  }

  const setPlayersHandler = (players: string[]) => {
    setGameState((previousGameState) => {
      return { ...previousGameState, players }
    })
  }

  const gameStartHandler = (firstPlayer: "string") => {
    setGameState((previousGameState) => {
      return {
        ...previousGameState,
        currentTurn: firstPlayer === socket.id ? "player" : "opponent",
        gameStarted: true,
      }
    })
  }

  const attackHitHandler = (player: string, shipPositions: string) => {
    attackHandler(player, shipPositions, "h")
  }
  const attackMissedHandler = (player: string, shipPositions: string) => {
    attackHandler(player, shipPositions, "m")
  }

  const attackHandler = (
    player: string,
    shipPositions: string,
    type: string
  ) => {
    const [row, column] = shipPositions.split(" ")

    if (player === socket.id) {
      gridUpdateHandler("defenseGrid", Number(row), Number(column), type)
    } else {
      gridUpdateHandler("attackGrid", Number(row), Number(column), type)
    }

    setTimeout(() => {
      canAttack.current = true

      if (document.querySelectorAll("div[style*=crimson]").length === 17) {
        setGameState((previousGameState) => {
          return {
            ...previousGameState,
            gameOverMessage: player === socket.id ? "You lost!" : "You won!",
          }
        })
      } else {
        setGameState((previousGameState) => {
          if (previousGameState.currentTurn === "player") {
            return { ...previousGameState, currentTurn: "opponent" }
          }

          return { ...previousGameState, currentTurn: "player" }
        })
      }
    }, 2000)
  }

  const gridUpdateHandler = (
    gridType: string,
    row: number,
    column: number,
    type: string
  ) => {
    setGrids((previousGrids) => {
      if (type !== "") {
        previousGrids[gridType][row][column] = type
      } else {
        if (previousGrids[gridType][row][column] === type) {
          if (battleshipsLeft.current > 0) {
            previousGrids[gridType][row][column] = "s"

            battleshipsLeft.current--
          }
        } else {
          previousGrids[gridType][row][column] = type

          battleshipsLeft.current++
        }
      }

      return { ...previousGrids }
    })
  }

  return (
    <>
      <h1>Game {gameName}</h1>
      <GameGrid
        currentGrid={
          gameState.currentTurn === "opponent"
            ? grids.defenseGrid
            : grids.attackGrid
        }
        currentGridType={
          gameState.currentTurn === "opponent" ? "defenseGrid" : "attackGrid"
        }
        isReady={gameState.isReady}
        canAttack={canAttack}
        gameOverMessage={gameState.gameOverMessage}
        gridUpdateHandler={gridUpdateHandler}
      />
      {!gameState.gameStarted ? (
        <div>
          {gameState.players.map((playerName) => (
            <h2 key={playerName}>
              {playerName}
              {playerName === socket.id && " (You)"}
            </h2>
          ))}
        </div>
      ) : gameState.gameOverMessage ? (
        <h2>{gameState.gameOverMessage}</h2>
      ) : (
        <h2>
          {gameState.currentTurn === "player" ? "Your turn" : "Opponent's turn"}
        </h2>
      )}
      {!gameState.isReady && (
        <>
          <p>Battleships left: {battleshipsLeft.current}</p>
          <button onClick={clickHandler}>Ready</button>
        </>
      )}
    </>
  )
}

export default Game
