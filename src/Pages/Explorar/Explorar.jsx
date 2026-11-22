
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Explorar.css";
import { buscarFilmesExplorar } from "../../Services/filmeService";
import { buscarSeriesExplorar } from "../../Services/serieService";
import { buscarLivrosExplorar } from "../../Services/livroService";

const API_TOKEN = import.meta.env.VITE_TMDB_KEY;

export default function Explorar() {
    const [busca, setBusca] = useState("");
    const [generoSelecionado, setGeneroSelecionado] = useState("");
    const [generosFilmes, setGenerosFilmes] = useState([]);
    const [generosSeries, setGenerosSeries] = useState([]);
    const [assuntoSelecionado, setAssuntoSelecionado] = useState("");
    const [filmes, setFilmes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [tipoSelecionado, setTipoSelecionado] = useState("filme");




    // cria os assuntos dos filtros dos livros 
    const assuntosLivros = [
    { valor: "fantasy", nome: "Fantasia" },
    { valor: "romance", nome: "Romance" },
    { valor: "fiction", nome: "Ficção" },
    { valor: "mystery", nome: "Mistério" },
    { valor: "horror", nome: "Terror" },
    { valor: "history", nome: "História" },
    { valor: "biography", nome: "Biografia" },
    { valor: "philosophy", nome: "Filosofia" }
    ];
    // Busca os gêneros disponíveis na TMDB
    useEffect(() => {
    async function buscarGeneros() {
        try {
            const [respostaFilmes, respostaSeries] = await Promise.all([
                fetch(
                    "https://api.themoviedb.org/3/genre/movie/list?language=pt-BR",
                    {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`
                        }
                    }
                ),

                fetch(
                    "https://api.themoviedb.org/3/genre/tv/list?language=pt-BR",
                    {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`
                        }
                    }
                )
            ]);

            if (!respostaFilmes.ok || !respostaSeries.ok) {
                throw new Error("Erro ao buscar gêneros");
            }

            const dadosFilmes = await respostaFilmes.json();
            const dadosSeries = await respostaSeries.json();

            setGenerosFilmes(dadosFilmes.genres || []);
            setGenerosSeries(dadosSeries.genres || []);

        } catch (erro) {
            console.error("Erro ao buscar gêneros:", erro);
        }
    }

    buscarGeneros();
    }, []);

    // Busca filmes populares, por nome ou por gênero
    useEffect(() => {
        const controlador = new AbortController();

        async function buscarMidias() {
            try {
                setCarregando(true);
                setErro(false);

                const termo = busca.trim();

                let resultados = [];

                if (tipoSelecionado === "filme") {
                    resultados = await buscarFilmesExplorar(
                        termo,
                        generoSelecionado,
                        controlador.signal
                    );
                } else if (tipoSelecionado === "serie") {
                    resultados = await buscarSeriesExplorar(
                        termo,
                        generoSelecionado,
                        controlador.signal
                    );
                } else if (tipoSelecionado === "livro") {
                    resultados = await buscarLivrosExplorar(
                        termo,
                        assuntoSelecionado,
                        controlador.signal
                    );
                }

                setFilmes(resultados);

            } catch (erro) {
                if (erro.name !== "AbortError") {
                    console.error("Erro ao buscar mídias:", erro);
                    setErro(true);
                    setFilmes([]);
                }
            } finally {
                if (!controlador.signal.aborted) {
                    setCarregando(false);
                }
            }
        }

        const intervalo = setTimeout(() => {
            buscarMidias();
        }, 400);

        return () => {
            clearTimeout(intervalo);
            controlador.abort();
        };

    }, [busca, generoSelecionado, assuntoSelecionado,tipoSelecionado]);

    function limparFiltros() {
        setBusca("");
        setGeneroSelecionado("");
        setAssuntoSelecionado("");
    }

    return (
        <main className="explorar-pagina">

            <header className="explorar-cabecalho">
                <span className="explorar-etiqueta">
                    DESCUBRA ALGO NOVO
                </span>

                <h1>Explore</h1>

                <p>
                    Encontre sua próxima história favorita.
                </p>
            </header>

            <section className="explorar-conteudo">

                <div className="explorar-categorias">
                    <button
                        className={tipoSelecionado === "filme" ? "categoria-ativa" : ""}
                        onClick={() => setTipoSelecionado("filme")}
                    >
                        Filmes
                    </button>

                    <button
                        className={tipoSelecionado === "serie" ? "categoria-ativa" : ""}
                        onClick={() => setTipoSelecionado("serie")}
                    >
                        Séries
                    </button>

                    <button
                        className={tipoSelecionado === "livro" ? "categoria-ativa" : ""}
                        onClick={() => setTipoSelecionado("livro")}
                    >
                        Livros
                    </button>
                </div>

                <div className="explorar-busca">
                    <span className="explorar-icone-busca">⌕</span>

                    <input
                        type="text"
                        placeholder= {
                            tipoSelecionado === "filme"
                            ? "Pesquise um filme..."
                            : tipoSelecionado === "serie"
                            ? "Pesquise por uma série..."
                            : "Pesquise por um livro..."
                        }
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />

                    {busca && (
                        <button
                            type="button"
                            onClick={() => setBusca("")}
                            aria-label="Limpar pesquisa"
                        >
                            ×
                        </button>
                    )}
                </div>

                <div className="explorar-filtros">

    <div className="explorar-filtro-grupo">

        <label htmlFor="genero">
            {tipoSelecionado === "livro" ? "Assunto" : "Gênero"}
        </label>

        <select
            id="genero"
            value={
                tipoSelecionado === "livro"
                    ? assuntoSelecionado
                    : generoSelecionado
            }
            onChange={(e) => {
                if (tipoSelecionado === "livro") {
                    setAssuntoSelecionado(e.target.value);
                } else {
                    setGeneroSelecionado(e.target.value);
                }
            }}
        >
            <option value="">
                {tipoSelecionado === "livro"
                    ? "Todos os assuntos"
                    : "Todos os gêneros"}
            </option>

            {tipoSelecionado === "filme" &&
                generosFilmes.map((genero) => (
                    <option key={genero.id} value={genero.id}>
                        {genero.name}
                    </option>
                ))
            }

            {tipoSelecionado === "serie" &&
                generosSeries.map((genero) => (
                    <option key={genero.id} value={genero.id}>
                        {genero.name}
                    </option>
                ))
            }

            {tipoSelecionado === "livro" &&
                assuntosLivros.map((assunto) => (
                    <option key={assunto.valor} value={assunto.valor}>
                        {assunto.nome}
                    </option>
                ))
            }

        </select>
    </div>

    {(busca || generoSelecionado || assuntoSelecionado) && (
        <button
            className="explorar-limpar"
            onClick={limparFiltros}
        >
            Limpar filtros
        </button>
    )}

    </div>

                <div className="explorar-resultados-cabecalho">
                    <div>
                        <span className="explorar-etiqueta">
                            CATÁLOGO
                        </span>

                        <h2>
                            {busca
                                ? `Resultados para "${busca}"`
                                : generoSelecionado && tipoSelecionado === "filme"
                                ? "Filmes do gênero selecionado"
                                : tipoSelecionado  === "filme"
                                    ? "Filmes populares"
                                    : tipoSelecionado === "serie"
                                        ? "Séries populares"
                                        : "Livros em destaque"}
                        </h2>
                    </div>

                    {!carregando && (
                        <span className="explorar-contagem">
                            {filmes.length} resultados
                        </span>
                    )}
                </div>

                {carregando ? (
                    <div className="explorar-estado">
                        <div className="explorar-loader"></div>
                        <p>Procurando filmes...</p>
                    </div>
                ) : erro ? (
                    <div className="explorar-estado">
                        <h3>Não foi possível carregar os filmes.</h3>
                        <p>Verifique sua conexão e tente novamente.</p>
                    </div>
                ) : filmes.length > 0 ? (
                    <div className="explorar-grid">
                       {filmes.map((midia) => (
                            <Link
                                to={`/midia/${midia.tipo}/${midia.id}`}
                                className="explorar-card"
                                key={`${midia.tipo}-${midia.id}`}
                            >
                                <div className="explorar-card-imagem">
                                    <img
                                        src={
                                            midia.imagem ||
                                            "https://placehold.co/500x750/181820/F5F5F5?text=Sem+imagem"
                                        }
                                        alt={midia.titulo}
                                        loading="lazy"
                                    />

                                    {midia.nota && (
                                        <div className="explorar-card-nota">
                                            ★ {midia.nota.toFixed(1)}
                                        </div>
                                    )}
                                </div>

                                <h3>{midia.titulo}</h3>

                                <p>{midia.ano}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="explorar-estado explorar-vazio">
                        <span>⌕</span>
                        <h3>Nenhum resultado encontrado.</h3>
                        <p>
                            Tente pesquisar por outro título ou escolher
                            outro gênero.
                        </p>

                        <button onClick={limparFiltros}>
                            Limpar pesquisa
                        </button>
                    </div>
                )}

            </section>
        </main>
    );
}