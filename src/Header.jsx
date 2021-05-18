import React from 'react';

function Header() {
    const openAppHandler = () => {
        window.location.href='/app'
    }

    return(<div
        style={{
        height: '2.5em',
    }}>
        <header
            class="container-fluid"
            style={{
                position: 'fixed',
                zIndex: 2,
                left: 0,
            }}
        >
            <div class="container-xl">
                <div class="row d-flex justify-content-between">
                    <div onClick={() => window.location.href='/'} class="shadow-2">
                        <h1>Feature Presentation</h1>
                    </div>
                    <div>
                        <button class='shadow-2'
                            onClick={openAppHandler}
                            style={{
                                padding: '0.25em',
                                fontSize: '20px',
                            }}>
                                Open App
                        </button>
                    </div>
                </div>

            </div>
        </header>
    </div>);
}

export default Header;