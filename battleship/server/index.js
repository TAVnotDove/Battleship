/* eslint-disable @typescript-eslint/no-var-requires */
const http = require("http").createServer()

const io = require("socket.io")(http, {
  cors: { origin: ["http://127.0.0.1:5173"] },
})

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id)

  console.log(io.sockets.adapter.rooms)

  socket.on("join-room", (room) => {
    socket.join(room)

    console.log(`${socket.id} joined room ${room}`)

    console.log(io.sockets.adapter.rooms)
  })

  socket.on("game-ready", (room) => {
    io.to(room).emit("game-ready", `user ${socket.id} is ready`)

    console.log(`user ${socket.id} is ready`)
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
    const array = [...io.sockets.adapter.rooms.keys()]

    socket.emit("get-rooms", array)
  })
})

http.listen(8080, () => console.log("listening on http://localhost:8080"))
