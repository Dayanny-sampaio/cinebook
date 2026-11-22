
export async function buscarLivrosDestaque() {
    const resposta = await fetch(
        "https://openlibrary.org/trending/weekly.json"
    );

    if (!resposta.ok) {
        throw new Error("Falha ao buscar livros");
    }

    const dados = await resposta.json();

    return dados.works.slice(0, 10).map((livro) => ({
        id: livro.key.split("/").pop(),
        titulo: livro.title,
        tipo: "livro",
        ano: livro.first_publish_year
            ? String(livro.first_publish_year)
            : "-",
        imagem: livro.cover_i
            ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg`
            : ""
    }));
}


export async function buscarLivroPorId(id) {
    const resposta = await fetch(
        `https://openlibrary.org/works/${id}.json`
    );

    if (!resposta.ok) {
        throw new Error("Falha ao buscar livro");
    }

    const livro = await resposta.json();

    // Buscar os nomes dos autores
    const autores = await Promise.all(
        (livro.authors || []).map(async (item) => {
            const chave = item.author?.key;

            if (!chave) return null;

            const respostaAutor = await fetch(
                `https://openlibrary.org${chave}.json`
            );

            if (!respostaAutor.ok) return null;

            const dadosAutor = await respostaAutor.json();
            return dadosAutor.name;
        })
    );

    // Buscar dados de uma edição
    const respostaEdicoes = await fetch(
        `https://openlibrary.org/works/${id}/editions.json?limit=1`
    );

    const dadosEdicoes = respostaEdicoes.ok
        ? await respostaEdicoes.json()
        : { entries: [] };

    return {
        ...livro,
        autor: autores.filter(Boolean).join(", ") || "Não informado",
        edicao: dadosEdicoes.entries?.[0] || null
    };
}


export async function buscarLivrosExplorar(termo, assuntoSelecionado, signal) {
    let url;

    if (termo || assuntoSelecionado) {
        const parametros = new URLSearchParams();

        if (termo) {
            parametros.set("q", termo);
        }

        if (assuntoSelecionado) {
            parametros.set("subject", assuntoSelecionado);
        }

        parametros.set("limit", "20");

        url = `https://openlibrary.org/search.json?${parametros.toString()}`;
    } else {
        url = "https://openlibrary.org/trending/weekly.json";
    }

    const resposta = await fetch(url, {signal});

    if (!resposta.ok) {
        throw new Error("Falha ao buscar livros");
    }

    const dados = await resposta.json();

    const resultados = (termo || assuntoSelecionado) 
        ? dados.docs || [] 
        : dados.works || [];

    return resultados.map((livro) => ({
        id: livro.key.split("/").pop(),
        titulo: livro.title,
        tipo: "livro",
        ano: livro.first_publish_year
            ? String(livro.first_publish_year)
            : "-",
        imagem: livro.cover_i
            ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg`
            : "",
        nota: null
    }));
}