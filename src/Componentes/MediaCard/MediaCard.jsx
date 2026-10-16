import "./MediaCard.css";

function MediaCard({ titulo, tipo, ano, imagem}) {
    return(
        <article className="media-card"> {/*representa um item independente da pagina*/}
            <img 
            className="media-card-imagem"   
            src={imagem} 
            alt={titulo} 
            />

            <h3>{titulo}</h3>

            <p>{tipo} • {ano}</p>
        </article>
    )
}

export default MediaCard;