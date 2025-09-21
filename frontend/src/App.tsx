import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Lobbies from "./pages/Lobbies.tsx";
import LobbyDetails from "./pages/LobbyDetails.tsx";

function App() {
  return(
    <BrowserRouter>
      <nav>
        <Link to='/login'>Login</Link>
        <Link to='/register'>Register</Link>
        <Link to='/lobbies'>Lobbies</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobbies" element={<Lobbies />} />
        <Route path="/lobbies/:id" element={<LobbyDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;