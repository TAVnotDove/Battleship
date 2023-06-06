const http = require("http").createServer()

const io = require("socket.io")(http, {
  cors: { origin: ["http://127.0.0.1:5173"] },
})

io.on("connection", () => {
  console.log("a user connected")
})

http.listen(8080, () => console.log("listening on http://localhost:8080"))
