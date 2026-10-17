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
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    const [livros, setLivros] = useState([]);
    const [carregandoLivros, setCarregandoLivros] = useState(true);
    const [erroLivros, setErroLivros] = useState(false);

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
            try{ //tente fazer isso
                const token = import.meta.env.VITE_TMDB_KEY;

                const resposta = await fetch (
                    "https://api.themoviedb.org/3/trending/movie/week?language=pt-BR",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!resposta.ok) {
                    throw new Error("Falha ao buscar filmes")
                }

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
            } catch (e) {// se der errado
                setErro(true);
            } finally {// indepedente se deu certo ou errado o carregando tem que encerrar
                setCarregando(false)
            }
        }
            buscarFilmes();
    }, []);

    useEffect(() => {
        async function buscarLivros() {
            try{
                const resposta = await fetch(
                    "https://openlibrary.org/trending/weekly.json"    
                );

                if (!resposta.ok) {
                    throw new Error("Falha ao buscar livros");
                }
            
                const dados = await resposta.json();
                
                const livrosTraduzidos = dados.works.slice(0, 12).map((livro) => ({
                    id: livros.key,
                    titulo: livros.title,
                    tipo: "Livro",
                    ano: livro.first_publish_year ? String(livro.first_publish_year) : "-",
                    imagem: livro.cover_i ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg` : ""
                }));

                setLivros(livrosTraduzidos);
        } catch (e) {
            setErroLivros(true);
        }finally{
            setCarregandoLivros(false);
        }

        }
        buscarLivros();
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
                            key={midia.titulo}
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

                {carregando && <p>Carregando filmes...</p>} {/* se estiver carregando*/}
                {erro && <p>Não foi possível carregar os filmes. Tente novamente mais tarde</p>}{/*se houver algum erro no carregamento*/}
                {!carregando && !erro && filmes.length === 0 && (
                    <p>Nenhum filme encontrado</p>
                )}

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

                {carregandoLivros && <p>Carregando livros...</p>}
                {erroLivros && <p>Não foi possível carregar os livros</p>}
                {!carregandoLivros &&!erroLivros && livros.length === 0 && (
                    <p>Nenhum livro encontrado</p>
                )}

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