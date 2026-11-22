import "./Home.css";
import {Link} from "react-router-dom";
import MediaCard from "../../Componentes/MediaCard/MediaCard";
import { buscarFilmesDestaque } from "../../Services/filmeService";
import { buscarLivrosDestaque } from "../../Services/livroService";
import { buscarSeriesDestaque } from "../../Services/serieService";
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

    const [series, setSeries] = useState([]);
    const [carregandoSerie, setCarregandoSerie] = useState(true);
    const [erroSerie, setErroSerie] = useState(false);

    
useEffect(() => {
    async function buscarDestaques() {
        try {
            const [dadosFilmes, dadosSeries, dadosLivros] =
                await Promise.all([
                    buscarFilmesDestaque(),
                    buscarSeriesDestaque(),
                    buscarLivrosDestaque()
                ]);

            setFilmes(dadosFilmes);
            setSeries(dadosSeries);
            setLivros(dadosLivros);

        } catch (erro) {
            console.error("Erro ao buscar destaques:", erro);
            setErro(true);
            setErroSerie(true);
            setErroLivros(true);

        } finally {
            setCarregando(false);
            setCarregandoSerie(false);
            setCarregandoLivros(false);
        }
    }

    buscarDestaques();
}, []);


    return (
        <main>
            <section>
                <h1>Descubra o que você ama</h1>

                <p>
                    Filmes, séries e livros em um só lugar.
                </p>

                <Link to="/explorar" className="botao-explorar">Explorar</Link>
                
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
                        <Link to={`/midia/filme/${filme.id}`} key={filme.id}>
                            <MediaCard
                                titulo={filme.titulo}
                                tipo={filme.tipo}
                                ano={filme.ano}
                                imagem={filme.imagem}
                            />
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2>Séries em destaque</h2>

                {carregandoSerie && <p>Carregando séries...</p>} {/* se estiver carregando*/}
                {erroSerie && <p>Não foi possível carregar as séries. Tente novamente mais tarde</p>}{/*se houver algum erro no carregamento*/}
                {!carregandoSerie && !erroSerie && series.length === 0 && (
                    <p>Nenhuma série encontrada</p>
                )}

                <div className="destaques">
                    {series.map((serie)=> (
                        <Link to={`/midia/serie/${serie.id}`} key={serie.id}>
                            <MediaCard
                                titulo={serie.titulo}
                                tipo={serie.tipo}
                                ano={serie.ano}
                                imagem={serie.imagem}
                            />
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2>Livros em destaque</h2>

                {carregandoLivros && <p>Carregando livros...</p>}
                {erroLivros && <p>Não foi possível carregar os livros. Tente novamente mais tarde</p>}
                {!carregandoLivros && !erroLivros && livros.length === 0 && (
                    <p>Nenhum livro encontrado</p>
                )}

                <div className="destaques">
                    {livros.map((livro) => (
                        <Link to={`/midia/livro/${livro.id}`} key={livro.id}>
                            <MediaCard
                                titulo={livro.titulo}
                                tipo={livro.tipo}
                                ano={livro.ano}
                                imagem={livro.imagem}
                            />
                        </Link>
                    ))}
                </div>
            </section>


        </main>
    )
}

export default Home