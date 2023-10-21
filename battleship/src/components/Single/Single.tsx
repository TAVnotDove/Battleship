import { useRef, useState } from "react"
import GameGrid from "../GameGrid/GameGrid"

const Single = () => {
  const computerShips: string[] = []

  while (computerShips.length < 17) {
    const str = `${Math.floor(Math.random() * 10)} ${Math.floor(
      Math.random() * 10
    )}`

    if (!computerShips.includes(str)) {
      computerShips.push(str)
    }
  }

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
      setGameState((previousGameState) => {
        return { ...previousGameState, isReady: true }
      })
    }
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
      <h1>Single</h1>
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
      {!gameState.gameStarted && gameState.gameOverMessage ? (
        <h2>{gameState.gameOverMessage}</h2>
      ) : (
        <h2>
          {gameState.currentTurn === "player" ? "Your turn" : "Opponent's turn"}
        </h2>
      )}
      {!gameState.isReady && (
        <>
          <p>Battleships left: {battleshipsLeft.current}</p>
          <button onClick={clickHandler} disabled={battleshipsLeft.current > 0}>
            Ready
          </button>
        </>
      )}
    </>
  )
}

export default Single
