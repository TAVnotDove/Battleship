import { Link } from "react-router-dom"

const Home = () => (
  <>
    <h1>Home</h1>
    <div>
      <Link to="/play">Play</Link>
    </div>
    <div>
      <Link to="/settings">Settings</Link>
    </div>
  </>
)

export default Home
