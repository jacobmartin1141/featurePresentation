import React from 'react';

function ContainerSetup({update}) {
    if(update !== undefined){

    return(<div style={{
        height: '40vh',
        overflow: 'hidden',
        maxHeight: '450px',
    }}>
        <img
            class="d-block w-100 darkened-image"
            src={update.src}
            style={{
                minHeight: '40vh',
                borderRadius: '25px',
            }}
            alt={update.alt}
        />
    </div>);
    }
    return <div></div>;
}

function UpdateContainer({ updateInfo, id }) {
    return(<div class="carousel-item">
            <ContainerSetup update={updateInfo} />
            <div class="carousel-caption d-md-block">
                <h5>[{id}] {updateInfo.title}</h5>
                <p>{updateInfo.text.join(" ").slice(0, 45)}... <a href={`/updates/${id}`}>[Read more]</a></p>
            </div>
        </div>);
}

function UpdatesRevolver({ updates }) {
    let updatesLength = updates.length;
    if(updatesLength < 5) {
        updatesLength += (5 - updatesLength);
    }

    const displayUpdates = updates.slice(updatesLength - 4, updatesLength).map((update, index) => {
        return(<UpdateContainer updateInfo={update} id={index + (updatesLength - 3)}/>);
    });

    const displayIndicators = updates.slice(updatesLength - 4, updatesLength).map((update, index) => {
        return(<li data-target="#carouselExampleIndicators" data-slide-to={index + 1}></li>);
    });

    return(<section class="container-xl shadow-1">
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                {displayIndicators}
            </ol>
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <ContainerSetup update={updates[updatesLength - 5]} />
                    <div class="carousel-caption d-md-block">
                        <h5>[{updatesLength - 4}] {updates[updatesLength - 5].title}</h5>
                        <p>{updates[updatesLength - 5].text.join(" ").slice(0, 45)}... <a href={`/updates/${updatesLength - 4}`}>[Read more]</a></p>
                    </div>
                </div>
                {displayUpdates}
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    </section>);
}

export default UpdatesRevolver;