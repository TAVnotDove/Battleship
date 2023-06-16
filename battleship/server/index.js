/* eslint-disable @typescript-eslint/no-var-requires */
const http = require("http").createServer()

const io = require("socket.io")(http, {
  cors: { origin: ["http://127.0.0.1:5173"] },
})

const playerShipPositions = {}

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id)

  console.log(io.sockets.adapter.rooms)

  socket.on("join-room", (room) => {
    socket.join(room)

    console.log(`${socket.id} joined room ${room}`)

    console.log(io.sockets.adapter.rooms)
  })

  socket.on("game-ready", (room, shipPositions) => {
    if (!playerShipPositions[room]) {
      playerShipPositions[room] = {}
    }

    playerShipPositions[room][socket.id] = shipPositions

    if (Object.values(playerShipPositions[room]).length === 2) {
      io.to(room).emit(
        "game-start",
        Object.keys(playerShipPositions[room])[Math.floor(Math.random() * 2)]
      )
    }
  })

  socket.on("game-attack", (room, shipPositions) => {
    for (let player in playerShipPositions[room]) {
      if (player !== socket.id) {
        if (playerShipPositions[room][player].includes(shipPositions)) {
          io.to(room).emit("game-attack-hit", player, shipPositions)
        } else {
          io.to(room).emit("game-attack-missed", player, shipPositions)
        }
      }
    }
  })

  socket.on("leave-room", (room) => {
    socket.leave(room)

    console.log(`${socket.id} left room ${room}`)

    console.log(io.sockets.adapter.rooms)
  })

  socket.on("get-room-players", (room) => {
    io.to(room).emit("get-room-players", [
      ...io.sockets.adapter.rooms.get(room).values(),
    ])
  })

  socket.on("get-rooms", () => {
    const roomsArray = [...io.sockets.adapter.rooms.keys()]
    const rooms = roomsArray.filter((room) => room.length < 20)

    socket.emit("get-rooms", rooms)
  })
})

http.listen(8080, () => console.log("listening on http://localhost:8080"))
