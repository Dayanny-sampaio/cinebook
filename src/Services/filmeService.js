
const API_TOKEN = import.meta.env.VITE_TMDB_KEY;

export async function buscarFilmesDestaque() {
    const resposta = await fetch(
        "https://api.themoviedb.org/3/trending/movie/week?language=pt-BR",
        {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`
            }
        }
    );

    if (!resposta.ok) {
        throw new Error("Falha ao buscar filmes");
    }

    const dados = await resposta.json();

    return dados.results.slice(0, 10).map((filme) => ({
        id: filme.id,
        titulo: filme.title,
        tipo: "filme",
        ano: filme.release_date
            ? filme.release_date.slice(0, 4)
            : "-",
        imagem: filme.poster_path
            ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
            : ""
    }));
}


export async function buscarFilmePorId(id) {
    const resposta = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=pt-BR&append_to_response=credits`,
        {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`
            }
        }
    );

    if (!resposta.ok) {
        throw new Error("Falha ao buscar filme");
    }

    return await resposta.json();
}

export async function buscarFilmesExplorar(termo, generoSelecionado, signal) {
    let url;

    if (termo) {
        url = `https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${encodeURIComponent(termo)}&include_adult=false`;
    } else if (generoSelecionado) {
        url = `https://api.themoviedb.org/3/discover/movie?language=pt-BR&with_genres=${generoSelecionado}&sort_by=popularity.desc`;
    } else {
        url = "https://api.themoviedb.org/3/movie/popular?language=pt-BR";
    }

    const resposta = await fetch(url, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        },
        signal
    });

    if (!resposta.ok) {
        throw new Error("Falha ao buscar filmes");
    }

    const dados = await resposta.json();

    let resultados = dados.results || [];

    if (termo && generoSelecionado) {
        resultados = resultados.filter((filme) =>
            filme.genre_ids?.includes(Number(generoSelecionado))
        );
    }

    return resultados.map((filme) => ({
        id: filme.id,
        titulo: filme.title,
        tipo: "filme",
        ano: filme.release_date
            ? filme.release_date.slice(0, 4)
            : "-",
        imagem: filme.poster_path
            ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
            : "",
        nota: filme.vote_average
    }));
}
