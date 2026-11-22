
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Perfil.css";

import { buscarFilmePorId } from "../../Services/filmeService";
import { buscarSeriePorId } from "../../Services/serieService";
import { buscarLivroPorId } from "../../Services/livroService";

export default function Perfil() {
  const [nome, setNome] = useState(
    () => localStorage.getItem("nome-usuario") || "Meu perfil",
  );

  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeTemporario, setNomeTemporario] = useState(nome);

  const [midias, setMidias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarMidias() {
      try {
        const registros = [];

        // Encontra filmes, séries e livros salvos no navegador
        for (let i = 0; i < localStorage.length; i++) {
          const chave = localStorage.key(i);

          let tipo;

          if (chave && chave.startsWith("meu-filme-")) {
            tipo = "filme";
          } else if (chave && chave.startsWith("meu-serie-")) {
            tipo = "serie";
          } else if (chave && chave.startsWith("meu-livro-")) {
            tipo = "livro";
          }

          if (tipo) {
            const dados = JSON.parse(localStorage.getItem(chave));

            if (dados.favorito || dados.status || dados.nota > 0) {
              const prefixo = `meu-${tipo}-`;
              const id = chave.slice(prefixo.length);

              registros.push({
                id,
                tipo,
                ...dados,
              });
            }
          }
        }

        // Busca os dados completos de cada mídia
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
              console.error(
                `Erro ao buscar ${registro.tipo}:`,
                erro,
              );
              return null;
            }
          }),
        );

        setMidias(resultados.filter(Boolean));
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarMidias();
  }, []);

  function salvarNome() {
    const nomeFinal = nomeTemporario.trim() || "Meu perfil";

    setNome(nomeFinal);
    localStorage.setItem("nome-usuario", nomeFinal);
    setEditandoNome(false);
  }

  // Estatísticas das mídias
  const concluidas = midias.filter(
    (midia) => midia.status === "assistido",
  );

  const favoritos = midias.filter(
    (midia) => midia.favorito,
  );

  const queroConsumir = midias.filter(
    (midia) => midia.status === "quero_ver",
  );

  const avaliadas = midias.filter(
    (midia) => midia.nota > 0,
  );

  const mediaNotas =
    avaliadas.length > 0
      ? (
          avaliadas.reduce(
            (total, midia) => total + midia.nota,
            0,
          ) / avaliadas.length
        ).toFixed(1)
      : "—";

  // Seleciona as quatro mídias com maiores notas
  const melhoresMidias = [...avaliadas]
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
                onChange={(e) => setNomeTemporario(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") salvarNome();
                }}
                autoFocus
              />

              <button onClick={salvarNome}>Salvar</button>

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
            {carregando ? "—" : concluidas.length}
          </span>
          <p>Concluídas</p>
        </div>

        <div className="perfil-estatistica">
          <span className="perfil-numero">
            {carregando ? "—" : favoritos.length}
          </span>
          <p>Favoritos</p>
        </div>

        <div className="perfil-estatistica">
          <span className="perfil-numero">
            {carregando ? "—" : queroConsumir.length}
          </span>
          <p>Quero consumir</p>
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
            <h2>Obras que marcaram você</h2>
          </div>

          <Link to="/biblioteca">Ver biblioteca →</Link>
        </div>

        {carregando ? (
          <p className="perfil-mensagem">
            Carregando suas informações...
          </p>
        ) : melhoresMidias.length > 0 ? (
          <div className="perfil-filmes">
            {melhoresMidias.map((midia) => {
              const titulo = midia.title || midia.name || "Sem título";

              const capaLivro =
                midia.edicao?.covers?.[0] ||
                midia.covers?.[0];

              const imagem = midia.poster_path
                ? `https://image.tmdb.org/t/p/w500${midia.poster_path}`
                : capaLivro
                  ? `https://covers.openlibrary.org/b/id/${capaLivro}-L.jpg`
                  : "https://placehold.co/500x750/181820/F5F5F5?text=Sem+imagem";

              return (
                <Link
                  to={`/midia/${midia.tipo}/${midia.id}`}
                  className="perfil-filme"
                  key={`${midia.tipo}-${midia.id}`}
                >
                  <img
                    src={imagem}
                    alt={titulo}
                    loading="lazy"
                  />

                  <h3>{titulo}</h3>

                  <span>★ {midia.nota}/5</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="perfil-vazio">
            <span>✦</span>
            <h3>Sua história está começando.</h3>
            <p>
              Avalie seus filmes, séries e livros favoritos
              para eles aparecerem aqui.
            </p>
            <Link to="/explorar">Explorar mídias</Link>
          </div>
        )}
      </section>

      <section className="perfil-resumo">
        <div>
          <span className="perfil-etiqueta">SUA JORNADA</span>
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
