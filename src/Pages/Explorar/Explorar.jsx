import "./Explorar.css"
import MediaCard from "../../Componentes/MediaCard/MediaCard";

function Explorar() {
  const Midia = [
    {
      titulo: "Interestelar",
      tipo: "Filme",
      ano: "2014",
      imagem: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" 
    },
    {
      titulo: "O pequeno principe",
      tipo: "Livro",
      ano:"1943",
      imagem:  "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg"
    },
    {
      
      titulo:"Oppenheimer",
      tipo: "Filme",
      ano:"2023",
      imagem: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"
    }
  ]
  return (

    <main>

      <section>

        <h1>Explorar</h1>
        <p>Econtre sua próxima mídia</p>
      
      </section>

      <section>
        <h2>Pesquisar Mídia</h2>

        <input type="text"
        placeholder="Digite aqui." 
        />
      </section>

      <section>
        <h2>Bla bla</h2>
        <div className="resultado-pesquisa">
          {Midia.map}
        </div>
      </section>


    </main>
  );
}

export default Explorar;