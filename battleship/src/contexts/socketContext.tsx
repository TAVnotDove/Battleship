import { createContext } from "react"
import { io } from "socket.io-client"

const socket = io("http://localhost:8080")

export const SocketContext = createContext(socket)

export const SocketContextProvider = ({
  children,
}: {
  children: JSX.Element
}) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
