import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home/Home"
import Play from "./components/Play/Play"
import Single from "./components/Single/Single"
import Multi from "./components/Multi/Multi"
import Settings from "./components/Settings/Settings"
import RouteNotFound from "./components/RouteNotFound/RouteNotFound"
import { io } from "socket.io-client"
import Create from "./components/Create/Create"

io("http://localhost:8080")

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play" element={<Play />} />
      <Route path="/play/single" element={<Single />} />
      <Route path="/play/multi" element={<Multi />} />
      <Route path="/play/multi/create" element={<Create/>} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/*" element={<RouteNotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App