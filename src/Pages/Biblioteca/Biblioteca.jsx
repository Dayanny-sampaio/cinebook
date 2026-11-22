import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Biblioteca.css";
import { buscarFilmePorId } from "../../Services/filmeService";
import { buscarSeriePorId } from "../../Services/serieService";
import { buscarLivroPorId } from "../../Services/livroService";

export default function Biblioteca() {
  const [midias, setMidias] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  useEffect(() => {
    async function buscarBiblioteca() {
      try {
        const registros = [];

        // Procura os midias salvos no LocalStorage
        for (let i = 0; i < localStorage.length; i++) {
          const chave = localStorage.key(i);

          if (
            chave &&
            (chave.startsWith("meu-filme-") ||
              chave.startsWith("meu-serie-") ||
              chave.startsWith("meu-livro-"))
          ) {
            const dados = JSON.parse(localStorage.getItem(chave));

            if (dados.favorito || dados.status || dados.nota > 0) {
              const partes = chave.split("-");
              const tipo = partes[1];
              const id = partes.slice(2).join("-");

              registros.push({
                id,
                tipo,
                ...dados,
              });
            }
          }
        }

        // Busca as informações completas de cada mídia
        const resultados = await Promise.all(
          registros.map(async (registro) => {
            try {
              let midia;

              if (registro.tipo === "filme") {
                midia = await buscarFilmePorId(registro.id);
              } else if (registro.tipo === "serie") {
                midia = await buscarSeriePorId(registro.id);
              } else if (registro.tipo === "livro") {
                midia = await buscarLivroPorId(registro.id);
              }

              return {
                ...midia,
                ...registro,
              };
            } catch (erro) {
              console.error(`Erro ao buscar ${registro.tipo}:`, erro);
              return null;
            }
          }),
        );
        setMidias(resultados.filter(Boolean));
      } catch (erro) {
        console.error("Erro ao carregar biblioteca:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarBiblioteca();
  }, []);

  const midiasFiltradas = midias.filter((midia) => {
    if (tipoFiltro !== "todos" && midia.tipo !== tipoFiltro) {
      return false;
    }

    if (filtro === "favoritos") return midia.favorito;
    if (filtro === "quero_ver") return midia.status === "quero_ver";
    if (filtro === "assistidos") return midia.status === "assistido";

    return true;
  });

  const totalFavoritos = midias.filter((midia) => midia.favorito).length;

  const totalFilmes = midias.filter((midia) => midia.tipo === "filme").length;

  const totalSeries = midias.filter((midia) => midia.tipo === "serie").length;

  const totalLivros = midias.filter((midia) => midia.tipo === "livro").length;

  const totalQueroConsumir = midias.filter(
    (midia) => midia.status === "quero_ver",
  ).length;

  const totalConcluidas = midias.filter(
    (midia) => midia.status === "assistido",
  ).length;

  if (carregando) {
    return (
      <main className="biblioteca-pagina">
        <p className="biblioteca-mensagem">Organizando sua biblioteca...</p>
      </main>
    );
  }

  return (
    <main className="biblioteca-pagina">
      <header className="biblioteca-cabecalho">
        <span className="biblioteca-etiqueta">SEU UNIVERSO PARTICULAR</span>
        <h1>Minha biblioteca</h1>
        <p>Todas as histórias que fazem parte da sua coleção.</p>
      </header>

      <section className="biblioteca-resumo">
        <div className="biblioteca-resumo-item">
          <span>{midias.length}</span>
          <p>Na coleção</p>
        </div>

        <div className="biblioteca-resumo-item">
          <span>{totalFilmes}</span>
          <p>Filmes</p>
        </div>

        <div className="biblioteca-resumo-item">
          <span>{totalSeries}</span>
          <p>Séries</p>
        </div>

        <div className="biblioteca-resumo-item">
          <span>{totalLivros}</span>
          <p>Livros</p>
        </div>

        <div className="biblioteca-resumo-item">
          <span>{totalFavoritos}</span>
          <p>Favoritos</p>
        </div>

        <div className="biblioteca-resumo-item">
          <span>{totalQueroConsumir}</span>
          <p>Quero assistir/ler</p>
        </div>

        <div className="biblioteca-resumo-item">
          <span>{totalConcluidas}</span>
          <p>Já assisti/li</p>
        </div>
      </section>

      <section className="biblioteca-colecao">
        <div className="biblioteca-colecao-cabecalho">
          <div>
            <span className="biblioteca-etiqueta">SUA COLEÇÃO</span>
            <h2>Suas mídias</h2>
          </div>

          <Link to="/explorar" className="biblioteca-explorar">
            Explorar mídias →
          </Link>
        </div>

        <div className="biblioteca-filtros">
          <button
            className={tipoFiltro === "todos" ? "selecionado" : ""}
            onClick={() => setTipoFiltro("todos")}
          >
            Todos
          </button>

          <button
            className={tipoFiltro === "filme" ? "selecionado" : ""}
            onClick={() => setTipoFiltro("filme")}
          >
            Filmes
          </button>

          <button
            className={tipoFiltro === "serie" ? "selecionado" : ""}
            onClick={() => setTipoFiltro("serie")}
          >
            Séries
          </button>

          <button
            className={tipoFiltro === "livro" ? "selecionado" : ""}
            onClick={() => setTipoFiltro("livro")}
          >
            Livros
          </button>
        </div>

        <div className="biblioteca-filtros">
          <button
            className={filtro === "todos" ? "selecionado" : ""}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </button>

          <button
            className={filtro === "favoritos" ? "selecionado" : ""}
            onClick={() => setFiltro("favoritos")}
          >
            Favoritos
          </button>

          <button
            className={filtro === "quero_ver" ? "selecionado" : ""}
            onClick={() => setFiltro("quero_ver")}
          >
            Quero assistir
          </button>

          <button
            className={filtro === "assistidos" ? "selecionado" : ""}
            onClick={() => setFiltro("assistidos")}
          >
            Já assisti
          </button>
        </div>

        {midiasFiltradas.length > 0 ? (
          <div className="biblioteca-grid">
            {midiasFiltradas.map((midia) => {
              // Identifica o título de cada tipo de mídia
              const titulo = midia.title || midia.name || "Sem título";

              // Identifica a imagem
              const capaLivro = midia.edicao?.covers?.[0] || midia.covers?.[0];

              const imagem = midia.poster_path
                ? `https://image.tmdb.org/t/p/w500${midia.poster_path}`
                : capaLivro
                  ? `https://covers.openlibrary.org/b/id/${capaLivro}-L.jpg`
                  : "https://placehold.co/500x750/181820/F5F5F5?text=Sem+imagem";

              // Identifica o ano
              const data =
                midia.release_date ||
                midia.first_air_date ||
                midia.edicao?.publish_date ||
                "";

              const ano = data.match(/\d{4}/)?.[0] || "Ano não informado";

              return (
                <Link
                  to={`/midia/${midia.tipo}/${midia.id}`}
                  className="biblioteca-card"
                  key={`${midia.tipo}-${midia.id}`}
                >
                  <div className="biblioteca-imagem-container">
                    <img src={imagem} alt={titulo} />

                    {midia.favorito && (
                      <span className="biblioteca-favorito">♥</span>
                    )}
                  </div>

                  <h3>{titulo}</h3>

                  <p>{ano}</p>

                  <div className="biblioteca-card-rodape">
                    <span>
                      {midia.status === "assistido"
                        ? midia.tipo === "livro"
                          ? "✓ Já li"
                          : "✓ Assistido"
                        : midia.status === "quero_ver"
                          ? midia.tipo === "livro"
                            ? "Quero ler"
                            : "Quero assistir"
                          : "Na coleção"}
                    </span>

                    {midia.nota > 0 && (
                      <span className="biblioteca-nota">★ {midia.nota}/5</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="biblioteca-vazia">
            <span>✦</span>
            <h3>
              {midias.length === 0
                ? "Sua coleção começa aqui."
                : "Nenhum mídia encontrada."}
            </h3>

            <p>
              {midias.length === 0
                ? "Explore novas mídias e adicione seus favoritos à biblioteca."
                : "Ainda não há mídias nesta categoria."}
            </p>

            <Link to="/explorar">Explorar mídias</Link>
          </div>
        )}
      </section>
    </main>
  );
}
