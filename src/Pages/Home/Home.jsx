import "./Home.css";
import {Link} from "react-router-dom";
import MediaCard from "../../Componentes/MediaCard/MediaCard";
import { useEffect, useState } from "react";

function Home(){

    const destaques = [
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
            titulo: "Random Aces Memories",
            tipo: "Album",
            ano:"2013",
            imagem: "https://www.theaudiodb.com/images/media/album/thumb/random-access-memories-51c8c1b7d9a2f.jpg"

        }
    ];

    const [filmes, setFilmes] = useState([]);

    const livros =[
        {
            titulo: "O pequeno Principe",
            tipo: "Livro",
            ano: "1943",
            imagem: "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg"
        },

        {
            titulo: "Dom casmurro",
            tipo: "Livro",
            ano: "1899",
            imagem: "https://covers.openlibrary.org/b/isbn/9788535910663-L.jpg"
        },

        {
            titulo: "1984",
            tipo: "Livro",
            ano: "1949",
            imagem: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg"
        }
    ];

    const albuns = [
        {
            titulo: "Random Access Memories",
            tipo: "Álbum",
            ano:"2013",
            imagem:"https://share.google/lsoPiBmSLLkIzhK5n"
        },

        {
            titulo: "Thriller",
            tipo: "Álbum",
            ano:"1982",
            imagem:"https://www.theaudiodb.com/images/media/album/thumb/thriller-4f4f6b1e6c1f5d4.jpg"
        },

        {
            titulo: "Abbed Road",
            tipo: "Álbum",
            ano:"1969",
            imagem:"https://www.theaudiodb.com/images/media/album/thumb/abbey-road-4e1f1c5a2e3b4d6.jpg"
        }

    ];

    useEffect(() => {
        async function buscarFilmes(){
            const token = import.meta.env.VITE_TMDB_KEY;

            const resposta = await fetch (
                "https://api.themoviedb.org/3/trending/movie/week?language=pt-BR",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const dados = await resposta.json();
            
            const filmesTraduzidos = dados.results.map((filme) => ({
                id: filme.id,
                titulo: filme.title,
                tipo: "Filme",
                ano: filme.release_date ? filme.release_date.slice(0 , 4): "-",
                imagem: filme.poster_path 
                    ? "https://image.tmdb.org/t/p/w500" + filme.poster_path 
                    : ""
            }));

            setFilmes(filmesTraduzidos);
        }

        buscarFilmes();
    }, []);

    return (
        <main>
            <section>
                <h1>Descubra o que você ama</h1>

                <p>
                    Filmes, livros e músicas em um só lugar.
                </p>

                <Link to="/explorar">Explorar</Link>
                
            </section>

            <section>
                <h2>Destaques</h2>

                <div className="destaques">
                    {destaques.map((midia) => (
                        <MediaCard
                            key={midia.id}
                            titulo={midia.titulo}
                            tipo={midia.tipo}
                            ano={midia.ano}
                            imagem={midia.imagem}    
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2>Filmes em destaque</h2>

                <div className="destaques">
                    {filmes.map((filme)=> (
                        <MediaCard
                            key={filme.id}
                            titulo={filme.titulo}
                            tipo={filme.tipo}
                            ano={filme.ano}
                            imagem={filme.imagem}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2>Livros em Destaques</h2>

                <div className="destaques">
                    {livros.map((livros) => (
                        <MediaCard
                            key={livros.titulo}
                            titulo={livros.titulo}
                            tipo={livros.tipo}
                            ano={livros.ano}
                            imagem={livros.imagem}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h2>Álbuns em Destaques</h2>

                <div className="destaques">
                    {albuns.map((albuns) => (
                        <MediaCard
                            key={albuns.titulo}
                            titulo={albuns.titulo}
                            tipo={albuns.tipo}
                            ano={albuns.ano}
                            imagem={albuns.imagem}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Home