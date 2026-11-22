
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Perfil.css";

const API_TOKEN = import.meta.env.VITE_TMDB_KEY;

export default function Perfil() {
    const [nome, setNome] = useState(
        () => localStorage.getItem("nome-usuario") || "Meu perfil"
    );

    const [editandoNome, setEditandoNome] = useState(false);
    const [nomeTemporario, setNomeTemporario] = useState(nome);

    const [filmes, setFilmes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function buscarFilmes() {
            try {
                const registros = [];

                // Encontra os filmes salvos no navegador
                for (let i = 0; i < localStorage.length; i++) {
                    const chave = localStorage.key(i);

                    if (chave && chave.startsWith("meu-filme-")) {
                        const dados = JSON.parse(
                            localStorage.getItem(chave)
                        );

                        if (
                            dados.favorito ||
                            dados.status ||
                            dados.nota > 0
                        ) {
                            const id = chave.replace("meu-filme-", "");

                            registros.push({
                                id,
                                ...dados
                            });
                        }
                    }
                }

                // Busca os dados de cada filme na TMDB
                const resultados = await Promise.all(
                    registros.map(async (registro) => {
                        const resposta = await fetch(
                            `https://api.themoviedb.org/3/movie/${registro.id}?language=pt-BR`,
                            {
                                headers: {
                                    Authorization: `Bearer ${API_TOKEN}`
                                }
                            }
                        );

                        if (!resposta.ok) return null;

                        const filme = await resposta.json();

                        return {
                            ...filme,
                            ...registro
                        };
                    })
                );

                setFilmes(resultados.filter(Boolean));
            } catch (erro) {
                console.error("Erro ao carregar perfil:", erro);
            } finally {
                setCarregando(false);
            }
        }

        buscarFilmes();
    }, []);

    function salvarNome() {
        const nomeFinal = nomeTemporario.trim() || "Meu perfil";

        setNome(nomeFinal);
        localStorage.setItem("nome-usuario", nomeFinal);
        setEditandoNome(false);
    }

    const assistidos = filmes.filter(
        (filme) => filme.status === "assistido"
    );

    const favoritos = filmes.filter(
        (filme) => filme.favorito
    );

    const queroAssistir = filmes.filter(
        (filme) => filme.status === "quero_ver"
    );

    const avaliados = filmes.filter(
        (filme) => filme.nota > 0
    );

    const mediaNotas = avaliados.length > 0
        ? (
            avaliados.reduce((total, filme) => total + filme.nota, 0) /
            avaliados.length
        ).toFixed(1)
        : "—";

    const melhoresFilmes = [...avaliados]
        .sort((a, b) => b.nota - a.nota)
        .slice(0, 4);

    return (
        <main className="perfil-pagina">

            <header className="perfil-cabecalho">
                <div className="perfil-avatar">
                    {nome.charAt(0).toUpperCase()}
                </div>

                <div className="perfil-identidade">
                    <span className="perfil-etiqueta">
                        SEU ESPAÇO PESSOAL
                    </span>

                    {editandoNome ? (
                        <div className="perfil-editar-nome">
                            <input
                                type="text"
                                value={nomeTemporario}
                                onChange={(e) =>
                                    setNomeTemporario(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") salvarNome();
                                }}
                                autoFocus
                            />

                            <button onClick={salvarNome}>
                                Salvar
                            </button>

                            <button
                                onClick={() => {
                                    setNomeTemporario(nome);
                                    setEditandoNome(false);
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div className="perfil-nome">
                            <h1>{nome}</h1>

                            <button
                                onClick={() => {
                                    setNomeTemporario(nome);
                                    setEditandoNome(true);
                                }}
                                aria-label="Editar nome"
                                title="Editar nome"
                            >
                                ✎
                            </button>
                        </div>
                    )}

                    <p>Um universo de histórias e descobertas.</p>
                </div>
            </header>

            <section className="perfil-estatisticas">
                <div className="perfil-estatistica">
                    <span className="perfil-numero">
                        {carregando ? "—" : assistidos.length}
                    </span>
                    <p>Filmes assistidos</p>
                </div>

                <div className="perfil-estatistica">
                    <span className="perfil-numero">
                        {carregando ? "—" : favoritos.length}
                    </span>
                    <p>Favoritos</p>
                </div>

                <div className="perfil-estatistica">
                    <span className="perfil-numero">
                        {carregando ? "—" : queroAssistir.length}
                    </span>
                    <p>Quero assistir</p>
                </div>

                <div className="perfil-estatistica">
                    <span className="perfil-numero">
                        {carregando ? "—" : mediaNotas}
                    </span>
                    <p>Média das avaliações</p>
                </div>
            </section>

            <section className="perfil-colecao">
                <div className="perfil-secao-cabecalho">
                    <div>
                        <span className="perfil-etiqueta">
                            SUAS ESCOLHAS
                        </span>
                        <h2>Filmes que marcaram você</h2>
                    </div>

                    <Link to="/biblioteca">
                        Ver biblioteca →
                    </Link>
                </div>

                {carregando ? (
                    <p className="perfil-mensagem">
                        Carregando suas informações...
                    </p>
                ) : melhoresFilmes.length > 0 ? (
                    <div className="perfil-filmes">
                        {melhoresFilmes.map((filme) => (
                            <Link
                                to={`/midia/${filme.id}`}
                                className="perfil-filme"
                                key={filme.id}
                            >
                                <img
                                    src={
                                        filme.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                                            : "https://placehold.co/500x750/181820/F5F5F5?text=Sem+imagem"
                                    }
                                    alt={filme.title}
                                    loading="lazy"
                                />

                                <h3>{filme.title}</h3>

                                <span>
                                    ★ {filme.nota}/5
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="perfil-vazio">
                        <span>✦</span>
                        <h3>Sua história está começando.</h3>
                        <p>
                            Avalie seus filmes favoritos para eles aparecerem aqui.
                        </p>
                        <Link to="/explorar">
                            Explorar filmes
                        </Link>
                    </div>
                )}
            </section>

            <section className="perfil-resumo">
                <div>
                    <span className="perfil-etiqueta">
                        SUA JORNADA
                    </span>
                    <h2>Cada história conta.</h2>
                    <p>
                        Continue descobrindo novas obras, registrando suas
                        experiências e construindo sua coleção.
                    </p>
                </div>

                <Link to="/explorar">
                    Descobrir novas histórias →
                </Link>
            </section>

        </main>
    );
}
