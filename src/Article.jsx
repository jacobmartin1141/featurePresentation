import React from 'react';

import { useParams } from 'react-router';

function Article({ updates }) {
    const { updateId } = useParams();

    const displayText = updates[updateId - 1].text.map((text) => {
        return <p>{text}</p>
    });

    return(<>
        <div class="container-xl">
            <div class="row">
                <article>
                    <div class="container-xl">
                        <img
                            src={updates[updateId - 1].src}
                            class="col-6"
                            align="right"
                            alt={updates[updateId - 1].imgAlt}
                        />
                        <h3>{updates[updateId - 1].title}</h3>
                        {displayText}
                    </div>
                </article>
            </div>
        </div>
    </>);
}

export default Article;