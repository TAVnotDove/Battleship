import { MutableRefObject, useContext } from "react"
import { useParams } from "react-router-dom"
import { SocketContext } from "../../contexts/socketContext"

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
const shipBoxStyle: { [key: string]: string } = {
  position: "absolute",
  backgroundColor: "white",
  width: "310px",
  height: "410px",
  left: "622px",
  border: "1px solid black",
  display: "flex",
  flexDirection: "column",
}
const shipStyle = {
  backgroundColor: "gray",
  border: "1px solid black",
  height: "50px",
  margin: "25px 25px 0px 25px",
}

const gridColors: { [key: string]: string } = {
  "": "white",
  s: "gray",
  h: "crimson",
  m: "skyblue",
}

const GameGrid = ({
  currentGrid,
  currentGridType,
  isReady,
  canAttack,
  gameOverMessage,
  gridUpdateHandler,
}: {
  currentGrid: string[][]
  currentGridType: string
  isReady: boolean
  canAttack: MutableRefObject<boolean>
  gameOverMessage: string
  gridUpdateHandler: (
    gridType: string,
    row: number,
    column: number,
    type: string
  ) => void
}) => {
  const socket = useContext(SocketContext)
  const { gameName } = useParams()

  return (
    <div style={{ position: "relative" }}>
      <div style={shipBoxStyle}>
        <div style={{ width: "260px", ...shipStyle }}></div>
        <div style={{ width: "208px", ...shipStyle }}></div>
        <div style={{ width: "156px", ...shipStyle }}></div>
        <div style={{ width: "156px", ...shipStyle }}></div>
        <div style={{ width: "104px", ...shipStyle }}></div>
      </div>
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
                  backgroundColor:
                    gridColors[currentGrid[numberIndex - 1][letterIndex - 1]],
                  border: "1px solid black",
                  width: "50px",
                  height: "50px",
                }}
                onClick={(e) => {
                  if (isReady) {
                    if (currentGridType === "attackGrid") {
                      if (
                        e.currentTarget.style.backgroundColor === "crimson" ||
                        e.currentTarget.style.backgroundColor === "skyblue"
                      )
                        return

                      if (gameOverMessage.length === 0) {
                        if (canAttack.current) {
                          canAttack.current = false

                          socket.emit(
                            "game-attack",
                            gameName,
                            `${numberIndex - 1} ${letterIndex - 1}`
                          )
                        }
                      }
                    }

                    return
                  }

                  gridUpdateHandler(
                    currentGridType,
                    numberIndex - 1,
                    letterIndex - 1,
                    ""
                  )
                }}
              ></div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default GameGrid
