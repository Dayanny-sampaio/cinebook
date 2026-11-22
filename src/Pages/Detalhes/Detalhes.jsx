
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { buscarFilmePorId } from "../../Services/filmeService";
import { buscarSeriePorId } from "../../Services/serieService";
import { buscarLivroPorId } from "../../Services/livroService";
import "./Detalhes.css";

const padrao = {
    favorito: false,
    status: null,
    nota: 0,
    critica: ""
};

function formatarDuracao(minutos) {
    if (!minutos) return "—";

    return `${Math.floor(minutos / 60)}h ${minutos % 60}min`;
}

export default function Detalhes() {
    const { tipo, id } = useParams();

    // Identifica a mídia e cria uma chave própria no LocalStorage
    const chave = `meu-${tipo}-${id}`;

    // Dados da mídia
    const [midia, setMidia] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    // Dados do usuário
    const [meu, setMeu] = useState(padrao);
    const [hover, setHover] = useState(0);
    const [rascunho, setRascunho] = useState("");

    // BUSCAR A MÍDIA
    useEffect(() => {
        async function buscarMidia() {
            try {
                setCarregando(true);
                setErro(false);
                setMidia(null);

                let dados;

                if (tipo === "filme") {
                    dados = await buscarFilmePorId(id);
                } else if (tipo === "serie") {
                    dados = await buscarSeriePorId(id);
                } else if (tipo === "livro") {
                    dados = await buscarLivroPorId(id);
                } else {
                    throw new Error("Tipo de mídia inválido");
                }

                setMidia(dados);

            } catch (e) {
                console.error("Erro ao buscar mídia:", e);
                setErro(true);

            } finally {
                setCarregando(false);
            }
        }

        buscarMidia();
    }, [tipo, id]);

    // CARREGAR DADOS SALVOS
    useEffect(() => {
        try {
            const salvo = localStorage.getItem(chave);
            const dados = salvo ? JSON.parse(salvo) : padrao;
            const usuario = { ...padrao, ...dados };

            setMeu(usuario);
            setRascunho(usuario.critica);

        } catch {
            setMeu(padrao);
            setRascunho("");
        }
    }, [chave]);

    // ATUALIZAR E SALVAR
    function atualizar(campo, valor) {
        const novo = { ...meu, [campo]: valor };

        setMeu(novo);
        localStorage.setItem(chave, JSON.stringify(novo));
    }

    function alternarFavorito() {
        atualizar("favorito", !meu.favorito);
    }

    function alternarStatus(novoStatus) {
        atualizar(
            "status",
            meu.status === novoStatus ? null : novoStatus
        );
    }

    function avaliar(estrela) {
        atualizar("nota", meu.nota === estrela ? 0 : estrela);
    }

    function salvarCritica() {
        atualizar("critica", rascunho.trim());
    }

    // CARREGAMENTO E ERRO
    if (carregando) {
        return (
            <main className="detalhes-estado">
                <div className="detalhes-loader"></div>
                <p>Carregando informações...</p>
            </main>
        );
    }

    if (erro || !midia) {
        return (
            <main className="detalhes-estado">
                <h2>Não foi possível carregar esta mídia.</h2>
                <Link to="/explorar">Voltar para explorar</Link>
            </main>
        );
    }

    // IDENTIFICAR OS DADOS DE CADA TIPO
    const ehFilme = tipo === "filme";
    const ehSerie = tipo === "serie";
    const ehLivro = tipo === "livro";

    const titulo = ehFilme
        ? midia.title
        : ehSerie
            ? midia.name
            : midia.title;

    const tituloOriginal = ehFilme
        ? midia.original_title
        : midia.original_name;

    const dataLancamento = ehFilme
        ? midia.release_date
        : ehSerie
            ? midia.first_air_date
            : midia.first_publish_date;

    const ano = dataLancamento
        ? dataLancamento.slice(0, 4)
        : "—";

    const descricao = typeof midia.description === "object"
        ? midia.description?.value
        : midia.description;

    const sinopse = ehLivro
        ? descricao
        : midia.overview;

    const generos = ehLivro
        ? (midia.subjects || []).slice(0, 8).map((nome, index) => ({
            id: index,
            name: nome
        }))
        : midia.genres || [];

    const equipe = midia.credits?.crew || [];
    const elenco = midia.credits?.cast?.slice(0, 8) || [];

    const diretores = equipe
        .filter((p) => p.job === "Director")
        .map((p) => p.name)
        .join(", ") || "Não informado";

    const roteiristas = equipe
        .filter((p) => p.job === "Screenplay" || p.job === "Writer")
        .map((p) => p.name)
        .filter((nome, i, lista) => lista.indexOf(nome) === i)
        .slice(0, 3)
        .join(", ") || "Não informado";

    const criadores = midia.created_by
        ?.map((p) => p.name)
        .join(", ") || "Não informado";

    const capaLivro = midia.edicao?.covers?.[0] || midia.covers?.[0];

    const imagemPoster = ehLivro
        ? capaLivro
            ? `https://covers.openlibrary.org/b/id/${capaLivro}-L.jpg`
            : ""
        : midia.poster_path
            ? `https://image.tmdb.org/t/p/w500${midia.poster_path}`
            : "";

    const imagemBanner = midia.backdrop_path
        ? `https://image.tmdb.org/t/p/original${midia.backdrop_path}`
        : imagemPoster;

    const autor = midia.autor || "Não informado";
    const editora = midia.edicao?.publishers?.join(", ") || "Não informada";
    const paginas = midia.edicao?.number_of_pages || "Não informado";

    // TEXTOS QUE MUDAM CONFORME O TIPO
    const nomeTipo = ehFilme ? "FILME" : ehSerie ? "SÉRIE" : "LIVRO";

    const textoSobre = ehFilme
        ? "SOBRE O FILME"
        : ehSerie
            ? "SOBRE A SÉRIE"
            : "SOBRE O LIVRO";

    const textoStatusQuero = ehLivro
        ? "Quero ler"
        : "Quero assistir";

    const textoStatusConcluido = ehLivro
        ? "Já li"
        : "Já assisti";

    return (
        <main className="detalhes-pagina">

            {/* CAPA PRINCIPAL */}
            <section
                className="detalhes-banner"
                style={{
                    backgroundImage: imagemBanner
                        ? `linear-gradient(to right, #0F0F14 25%, rgba(15,15,20,0.8), #0F0F14), url(${imagemBanner})`
                        : "none"
                }}
            >
                <div className="detalhes-banner-conteudo">

                    <img
                        className="detalhes-poster"
                        src={
                            imagemPoster ||
                            "https://placehold.co/500x750/181820/F5F5F5?text=Sem+imagem"
                        }
                        alt={titulo}
                    />

                    <div className="detalhes-introducao">

                        <span className="detalhes-categoria">
                            {nomeTipo}
                        </span>

                        <h1>{titulo}</h1>

                        {tituloOriginal && tituloOriginal !== titulo && (
                            <p className="detalhes-titulo-original">
                                {tituloOriginal}
                            </p>
                        )}

                        <div className="detalhes-metadados">
                            <span>{ano}</span>

                            {ehFilme && (
                                <span>{formatarDuracao(midia.runtime)}</span>
                            )}

                            {ehSerie && (
                                <>
                                    <span>
                                        {midia.number_of_seasons || "—"} temporadas
                                    </span>
                                    <span>
                                        {midia.number_of_episodes || "—"} episódios
                                    </span>
                                </>
                            )}

                            {ehLivro && (
                                <span>{paginas} páginas</span>
                            )}

                            {ehFilme && (
                                <span>{midia.adult ? "18+" : "Livre"}</span>
                            )}
                        </div>

                        <div className="detalhes-generos">
                            {generos.map((genero) => (
                                <span key={genero.id}>
                                    {genero.name}
                                </span>
                            ))}
                        </div>

                        {!ehLivro && (
                            <div className="detalhes-nota-tmdb">
                                <div className="detalhes-nota-icone">
                                    ★
                                </div>

                                <div>
                                    <strong>
                                        {midia.vote_average?.toFixed(1) || "—"}
                                        <small>/10</small>
                                    </strong>

                                    <span>
                                        Nota TMDB · {midia.vote_count || 0} avaliações
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* CONTEÚDO */}
            <div className="detalhes-conteudo">

                {/* SINOPSE E INFORMAÇÕES */}
                <section className="detalhes-secao">

                    <div className="detalhes-secao-cabecalho">
                        <span>01 — {textoSobre}</span>
                        <h2>Conheça a obra</h2>
                    </div>

                    <p className="detalhes-sinopse">
                        {sinopse || "Descrição não disponível."}
                    </p>

                    <div className="detalhes-ficha">

                        {ehFilme && (
                            <>
                                <div>
                                    <span>Direção</span>
                                    <strong>{diretores}</strong>
                                </div>

                                <div>
                                    <span>Roteiro</span>
                                    <strong>{roteiristas}</strong>
                                </div>

                                <div>
                                    <span>Data de lançamento</span>
                                    <strong>{midia.release_date || "Não informada"}</strong>
                                </div>

                                <div>
                                    <span>Idioma original</span>
                                    <strong>
                                        {midia.original_language?.toUpperCase() || "—"}
                                    </strong>
                                </div>
                            </>
                        )}

                        {ehSerie && (
                            <>
                                <div>
                                    <span>Criadores</span>
                                    <strong>{criadores}</strong>
                                </div>

                                <div>
                                    <span>Temporadas</span>
                                    <strong>{midia.number_of_seasons || "—"}</strong>
                                </div>

                                <div>
                                    <span>Primeira exibição</span>
                                    <strong>{midia.first_air_date || "Não informada"}</strong>
                                </div>

                                <div>
                                    <span>Idioma original</span>
                                    <strong>
                                        {midia.original_language?.toUpperCase() || "—"}
                                    </strong>
                                </div>
                            </>
                        )}

                        {ehLivro && (
                            <>
                                <div>
                                    <span>Autor</span>
                                    <strong>{autor}</strong>
                                </div>

                                <div>
                                    <span>Editora</span>
                                    <strong>{editora}</strong>
                                </div>

                                <div>
                                    <span>Primeira publicação</span>
                                    <strong>{midia.first_publish_date || "Não informada"}</strong>
                                </div>

                                <div>
                                    <span>Páginas</span>
                                    <strong>{paginas}</strong>
                                </div>
                            </>
                        )}

                    </div>
                </section>

                {/* EXPERIÊNCIA DO USUÁRIO */}
                <section className="detalhes-secao">

                    <div className="detalhes-secao-cabecalho">
                        <span>02 — SUA EXPERIÊNCIA</span>
                        <h2>O que você achou?</h2>
                    </div>

                    <div className="detalhes-experiencia">

                        <div className="detalhes-acoes">

                            <button
                                className={`detalhes-botao ${meu.favorito ? "ativo" : ""}`}
                                onClick={alternarFavorito}
                            >
                                {meu.favorito ? "♥ Favoritado" : "♡ Favoritar"}
                            </button>

                            <button
                                className={`detalhes-botao ${meu.status === "quero_ver" ? "ativo" : ""}`}
                                onClick={() => alternarStatus("quero_ver")}
                            >
                                {meu.status === "quero_ver"
                                    ? `✓ ${textoStatusQuero}`
                                    : `+ ${textoStatusQuero}`}
                            </button>

                            <button
                                className={`detalhes-botao ${meu.status === "assistido" ? "ativo" : ""}`}
                                onClick={() => alternarStatus("assistido")}
                            >
                                {meu.status === "assistido"
                                    ? `✓ ${textoStatusConcluido}`
                                    : textoStatusConcluido}
                            </button>

                        </div>

                        <div className="detalhes-minha-nota">

                            <div>
                                <h3>Minha avaliação</h3>
                                <p>Sua opinião sobre esta obra.</p>
                            </div>

                            <div className="detalhes-estrelas">
                                {[1, 2, 3, 4, 5].map((estrela) => (
                                    <button
                                        key={estrela}
                                        type="button"
                                        className={
                                            estrela <= (hover || meu.nota)
                                                ? "estrela-selecionada"
                                                : ""
                                        }
                                        onClick={() => avaliar(estrela)}
                                        onMouseEnter={() => setHover(estrela)}
                                        onMouseLeave={() => setHover(0)}
                                        aria-label={`${estrela} estrelas`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <span className="detalhes-nota-pessoal">
                                {meu.nota > 0
                                    ? `${meu.nota}/5`
                                    : "Não avaliado"}
                            </span>

                        </div>
                    </div>
                </section>

                {/* ELENCO: SOMENTE FILMES E SÉRIES */}
                {!ehLivro && (
                    <section className="detalhes-secao">

                        <div className="detalhes-secao-cabecalho">
                            <span>03 — QUEM FAZ PARTE</span>
                            <h2>Elenco principal</h2>
                        </div>

                        <div className="detalhes-elenco">

                            {elenco.map((ator) => (
                                <article className="detalhes-ator" key={ator.id}>

                                    {ator.profile_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${ator.profile_path}`}
                                            alt={ator.name}
                                        />
                                    ) : (
                                        <div className="detalhes-ator-sem-foto">
                                            {ator.name?.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <h3>{ator.name}</h3>
                                        <p>
                                            {ator.character || "Personagem não informado"}
                                        </p>
                                    </div>

                                </article>
                            ))}

                        </div>
                    </section>
                )}

                {/* CRÍTICA */}
                <section className="detalhes-secao">

                    <div className="detalhes-secao-cabecalho">
                        <span>04 — SEU ESPAÇO</span>
                        <h2>Minha crítica</h2>
                    </div>

                    <div className="detalhes-critica">

                        <p>
                            Registre suas impressões, opiniões e momentos favoritos.
                        </p>

                        <textarea
                            value={rascunho}
                            onChange={(e) => setRascunho(e.target.value)}
                            placeholder="Escreva sua crítica..."
                            rows={6}
                        />

                        <div className="detalhes-critica-rodape">

                            <span>
                                {meu.critica && rascunho === meu.critica
                                    ? "Crítica salva ✓"
                                    : "Sua crítica é privada."}
                            </span>

                            <button onClick={salvarCritica}>
                                Salvar crítica
                            </button>

                        </div>
                    </div>
                </section>

                <Link to="/explorar" className="detalhes-voltar">
                    ← Voltar para explorar
                </Link>

            </div>
        </main>
    );
}
