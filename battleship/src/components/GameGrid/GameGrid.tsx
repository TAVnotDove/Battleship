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

const GameGrid = ({
  currentGrid,
  currentGridType,
  isReady,
  gridUpdateHandler,
}: {
  currentGrid: string[][]
  currentGridType: string
  isReady: boolean
  gridUpdateHandler: (gridType: string, row: number, column: number) => void
}) => {
  return (
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
                  backgroundColor:
                    currentGrid[numberIndex - 1][letterIndex - 1] === ""
                      ? "white"
                      : "gray",
                  border: "1px solid black",
                  width: "50px",
                  height: "50px",
                }}
                onClick={(e) => {
                  if (isReady) return

                  if (e.currentTarget.style.backgroundColor === "white") {
                    e.currentTarget.style.backgroundColor = "gray"
                  } else {
                    e.currentTarget.style.backgroundColor = "white"
                  }

                  gridUpdateHandler(
                    currentGridType,
                    numberIndex - 1,
                    letterIndex - 1
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
