import React from 'react';

function Header() {
    return(<>
        <header
            class="container-fluid primary-color"
            style={{
                position: 'fixed',
                zIndex: 2,
                left: 0,
                top: 0,
            }}>
            <div class="container-xl">
                <nav class="navbar navbar-expand-lg navbar-light justify-content-between">
                    <a class="navbar-brand shadow-2" href="/"><h1>Feature Presentation</h1></a>
                    <div class="navbar-nav">
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <button class="btn btn-primary" type="button" onClick={() => window.location.href="/app"}>Go to App</button>
                    </div>
                    <div class="collapse navbar-collapse shadow-2" id="navbarText">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/updates">Updates</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
        <div style={{height: '90px'}}></div>
    </>);
}

export default Header;