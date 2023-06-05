import { Link } from "react-router-dom"

const Play = () => (
  <>
    <h1>Play</h1>
    <div>
      <Link to="/play/single">Singleplayer</Link>
    </div>
    <div>
      <Link to="/play/multi">Multiplayer</Link>
    </div>
  </>
)

export default Play
