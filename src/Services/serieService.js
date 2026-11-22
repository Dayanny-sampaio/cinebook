
const API_TOKEN = import.meta.env.VITE_TMDB_KEY;

export async function buscarSeriesDestaque() {
    const resposta = await fetch(
        "https://api.themoviedb.org/3/trending/tv/week?language=pt-BR",
        {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`
            }
        }
    );

    if (!resposta.ok) {
        throw new Error("Falha ao buscar séries");
    }

    const dados = await resposta.json();

    return dados.results.slice(0, 10).map((serie) => ({
        id: serie.id,
        titulo: serie.name,
        tipo: "serie",
        ano: serie.first_air_date
            ? serie.first_air_date.slice(0, 4)
            : "-",
        imagem: serie.poster_path
            ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
            : ""
    }));
}



export async function buscarSeriePorId(id) {
    const resposta = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?language=pt-BR&append_to_response=credits`,
        {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`
            }
        }
    );

    if (!resposta.ok) {
        throw new Error("Falha ao buscar série");
    }

    return await resposta.json();
}



export async function buscarSeriesExplorar(termo, generoSelecionado, signal) {
    let url;

    if (termo) {
        url = `https://api.themoviedb.org/3/search/tv?language=pt-BR&query=${encodeURIComponent(termo)}`;
    } else if (generoSelecionado) {
        url = `https://api.themoviedb.org/3/discover/tv?language=pt-BR&with_genres=${generoSelecionado}&sort_by=popularity.desc`;
    } else {
        url = "https://api.themoviedb.org/3/tv/popular?language=pt-BR";
    }

    const resposta = await fetch(url, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        },
        signal
    });

    if (!resposta.ok) {
        throw new Error("Falha ao buscar séries");
    }

    // Transforma a resposta em JSON
    const dados = await resposta.json();

    let resultados = dados.results || [];

    // Se houver pesquisa e gênero, filtra os resultados
    if (termo && generoSelecionado) {
        resultados = resultados.filter((serie) =>
            serie.genre_ids?.includes(Number(generoSelecionado))
        );
    }

    return resultados.map((serie) => ({
        id: serie.id,
        titulo: serie.name,
        tipo: "serie",
        ano: serie.first_air_date
            ? serie.first_air_date.slice(0, 4)
            : "-",
        imagem: serie.poster_path
            ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
            : "",
        nota: serie.vote_average
    }));
}
