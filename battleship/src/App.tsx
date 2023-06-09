import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SocketContextProvider } from "./contexts/socketContext"
import Home from "./components/Home/Home"
import Play from "./components/Play/Play"
import Single from "./components/Single/Single"
import Multi from "./components/Multi/Multi"
import Create from "./components/Create/Create"
import Join from "./components/Join/Join"
import Game from "./components/Game/Game"
import Settings from "./components/Settings/Settings"
import RouteNotFound from "./components/RouteNotFound/RouteNotFound"

const App = () => (
  <BrowserRouter>
    <SocketContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/play/single" element={<Single />} />
        <Route path="/play/multi" element={<Multi />} />
        <Route path="/play/multi/create" element={<Create />} />
        <Route path="/play/multi/join" element={<Join />} />
        <Route path="/play/multi/:gameName" element={<Game />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/*" element={<RouteNotFound />} />
      </Routes>
    </SocketContextProvider>
  </BrowserRouter>
)

export default App
