import React from 'react';

import UpdatesRevolver from './UpdatesRevolver';

const bulletPoints = {
    what: [
        "As you develop your ideas, the program will intelligently recommend articles, essays, videos and tutorials from across the web, tailored to fit your game's vision. These include programming and implementation tutorials by veteran developers, and design pitfalls to beware from world class designers!",
        "Feature presentation is a game design planning and documentation program based on intuitive graphical interfaces and spacial organization.",
        "It's designed to work on broad and granular scales, to define your ideas, to define the relationships between them, and to plan out the development process effortlessly.",
    ],
    how: [
        "It includes a suite of intuitive tools which allow you to quickly plan out, organize, and iterate on your game's design however you need.",
        "As you develop your ideas, the program will intelligently recommend articles, essays, videos and tutorials from across the web, tailored to fit your game's vision.",
        "These include programming and implementation tutorials by veteran developers, and design pitfalls to beware from world class designers!",
    ],
}

function BulletPoint({ text }) {
    return(<div class="col-md text-center shadow-2 bullet-point">
        <p style={{
            fontSize:'20px',
            justifyContent: 'center',
        }}>
            {text}
        </p>
    </div>);
}

function About({ updates }) {
    const displayWhat = bulletPoints.what.map((point) => {
        return <BulletPoint text={point} />;
    });

    const displayHow = bulletPoints.how.map((point) => {
        return <BulletPoint text={point} />;
    })

    return(<>
        <UpdatesRevolver updates={updates}/>
        <div class="container-xl">
            <article class="container-xl">
                <h3>
                    <b>What is Feature Presentation?</b>
                </h3>
                <div class="row">
                    {displayWhat}
                    <div class="col-md-8 shadow-2">
                        <div class="embed-responsive embed-responsive-16by9 col-xs-12"
                            style={{
                                margin: '5px',
                                marginLeft: '-10px',
                                marginTop: '0',
                                marginBottom: '17px',
                            }}>
                            <iframe class="embed-responsive-item"  
                                src="https://www.youtube.com/embed/Bazei8Lh2j0" 
                                align="center" id="videothumbnail" title="videothumbnail"/>
                        </div>
                    </div>
                </div>
            </article>
            <article class="container-xl">
                <h3>
                    <b>How does it work?</b>
                </h3>
                <div class="row">
                    {displayHow}
                </div>
            </article>
        </div>
    </>);
}

export default About;