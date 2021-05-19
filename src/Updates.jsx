import React from "react";

function ArticleContainer({update, id}) {
    return(<article>
        <div class="container-xl">
            <img
                src={update.src}
                class="col-6"
                align="right"
                alt={update.imgAlt}
            />
            <h3>{update.title}</h3>
            <p>{update.text[0]}</p>
            <a href={`/updates/${id}`}>[Read More]</a>
        </div>
    </article>);
}

function Updates({updates}) {
    const displayUpdates = updates.map((update, index) => {
        return <ArticleContainer update={update} id={index + 1} />;
    })

    return(<div class="container-xl">
        <div class="row">
            {displayUpdates}
        </div>
    </div>)
}

export default Updates;