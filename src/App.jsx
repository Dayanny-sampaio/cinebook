import { BrowserRouter, Routes, Route } from "react-router-dom";


import Navbar from "./Componentes/Navbar";

import Home from "./Pages/Home/Home";
import Explorar from "./Pages/Explorar/Explorar";
import Detalhes from "./Pages/Detalhes/Detalhes";
import Biblioteca from "./Pages/Biblioteca/Biblioteca";
import Perfil from "./Pages/Perfil/Perfil";

function App() {
  return(
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/explorar" element={<Explorar />}/>
        <Route path="/midia/:tipo/:id" element={<Detalhes />}/>
        <Route path="/biblioteca" element={< Biblioteca />}/>
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App