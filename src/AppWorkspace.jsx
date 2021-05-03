import React, {
    useState,
    useEffect,
    useRef,
} from 'react';

import ContextMenuGenerator from './ContextMenu';

import createValidator from './findValidContainer';

const validTargets = [
    "container",
    "work-space",
];
const findValidContainer = createValidator(validTargets);

var offset_data; //Global variable as Chrome doesn't allow access to event.dataTransfer in dragover
var dm;
var dropTarget;

function findParentPos(target) {
    let result = {
        left: 0,
        top: 0,
        depth: 0,
    };
    var p = target;
    for(let x = 1; validTargets.includes(p.className); x++) {
        result.depth = x;
        
        result.left += parseInt(p.style.left,10);
        result.top += parseInt(p.style.top,10);

        p = p.parentElement;
    }

    return result;
}

function drag_start(event) {
    dm = event.target;
    
    let pOffset = findParentPos(dm);

    offset_data = (
        (pOffset.left 
            - event.pageX
        ) +
        ',' +
        (pOffset.top
            - event.pageY
        )
    );
    event.dataTransfer.setData("text/plain",offset_data);
}
function drag_over(event) {
    dropTarget = findValidContainer(event.target);

    if(dropTarget) {
        // dm.style.display = "none";

        if(dropTarget !== dm) {
            event.preventDefault(); 
            return false;
        }
    } else {
        dm.style.display = '';
    }
}

function BasicContainer({id, xPos = 0, yPos = 0}) {
    const displayForm = () => {
        setDisplay({element: <form onClick={displayName}>
            <textarea
                id='name'
                name='name'
                onChange={changeHandler}
                autoFocus='true'
                required='true'
                placeholder='Click to save text'
            ></textarea>
        </form>, text: displayRef.current.text});
    }

    const displayInit = {element: <h3 onClick={displayForm}>New Container</h3>, text: "New Container"}
    const [display, setDisplay] = useState(displayInit);
    const displayRef = useRef({});
    displayRef.current = display;

    const changeHandler = (event) => {
        if(event.target.value) {
            setDisplay({element: displayRef.current.element, text: event.target.value});
        } else {
            setDisplay({element: displayRef.current.element, text: "New Container"});
        }
    }

    const displayName = (event) => {
        setDisplay({element: <h3 onClick={displayForm}>{displayRef.current.text}</h3>, text: displayRef.current.text});
    }
    
    return(<div
            id={id}
            className="container"
            style={{
                position: 'absolute',
                left: xPos + 'px',
                top: yPos + 'px',
                height: '150px',
                width: '300px',
                zIndex: '0',
            }}
            draggable="true"
            onDragStart={drag_start}>
        {displayRef.current.element}
    </div>);
}

function Home() {
    const stateInit = {
        history: [],
        availableIDs: [],
        containers: [],
        connections: [],
        lines: [],
        tool: {
            selected: 'Create/ Delete Connections',
            data: null,
            cursor: 'cell',
        },
    }

    const [state, setState] = useState(stateInit);
    const stateRef = useRef({});
    stateRef.current = state;

    useEffect(() => {
        generateLines();
    }, [stateRef.current.connections]);
    
    function deleteConnections(ID) {
        const newConnections = stateRef.current.connections.reduce((acc, conn) => {
            if ([conn.root, conn.connects].includes(ID)) {
                return acc;
            }
            return [...acc, conn];
        }, []);

        setState({...stateRef.current, connections: [...newConnections] } );
    }
    function createConnection(ID, targetID) {
        let found = false;
        const newConnections = stateRef.current.connections.filter((conn) => {
            const filter = (!([ID, targetID].includes(conn.root) && [ID, targetID].includes(conn.connects)));
            if(!filter) found = true;
            return filter;
        });

        if(!found) {
            const newConnection = {
                root: ID,
                connects: targetID
            };
    
            setState({...stateRef.current, connections: [...stateRef.current.lines, newConnection] } );
        } else {
            setState({...stateRef.current, connections: [...newConnections] } );
        }
    }
    // function drawConnections() {
    //     const canvasElement = document.getElementById("myCanvas");
    //     const ctx = canvasElement.getContext("2d");

    //     ctx.lineWidth = 4;
        
    //     ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    //     stateRef.current.connections.forEach((connection) => {
    //         const rootEl = document.getElementById(connection.root);    

    //         const rootPos = findParentPos(rootEl);

    //         const connEl = document.getElementById(connection.connects);

    //         const connPos = findParentPos(connEl);

    //         ctx.beginPath();
    //         ctx.moveTo(
    //             rootPos.left + (parseInt(rootEl.style.width,10) / 2),
    //             rootPos.top + (parseInt(rootEl.style.height,10) / 2),
    //         );
    //         ctx.lineTo(
    //             connPos.left + (parseInt(connEl.style.width,10) / 2),
    //             connPos.top + (parseInt(connEl.style.height,10) / 2),
    //         );
    //         ctx.stroke();
    //     });
    // }

    function generateLines() {
        const newLines = stateRef.current.connections.map((connection) => {

            const rootEl = document.getElementById(connection.root);    

            const rootPos = findParentPos(rootEl);

            const connEl = document.getElementById(connection.connects);

            const connPos = findParentPos(connEl);

            return(<line
                x1={rootPos.left + (parseInt(rootEl.style.width,10) / 2)}
                y1={rootPos.top + (parseInt(rootEl.style.height,10) / 2)}
                x2={connPos.left + (parseInt(connEl.style.width,10) / 2)}
                y2={connPos.top + (parseInt(connEl.style.height,10) / 2)}
                stroke="black"
                z-axis="5"
            />);
        });

        setState({...stateRef.current, lines: newLines});
    }

    function createNewEvent(newEvent) {
        setState({...stateRef.current, history: [...stateRef.current.history, newEvent], });
    }

    // function removeTargetConnections(id, targetId) {
    //     const newConnections = connections.map((conn) => {
    //         if(conn.root === id || conn.root === targetId) {
                
    //             return {
    //                 root: conn.root,
    //                 connects: conn.connects.reduce((acc, connEl) => {
    //                     if(connEl === id || connEl === targetId) {
    //                         return acc;
    //                     } else {
    //                         return [...acc, connEl];
    //                     }
    //                 }, [])
    //             }
                
    //         } else {
    //             return conn;
    //         }
    //     });

    //     setConnections([...newConnections]);
    // }

    function moveContainer(container, target, xPos, yPos, manual = true) {
        if(manual) {
            const newEvent = {
                eventType: "move",
                container,
                target,
                xPos: container.style.left,
                yPos: container.style.top,
                parent: container.parentElement,
            }

            createNewEvent(newEvent);
        }
        
        let pOffset = findParentPos(target);
            
        container.style.left = Math.max( (xPos - pOffset.left) , 11) + 'px';
        container.style.top = Math.max( (yPos - pOffset.top) , 11) + 'px';
        
        container.style.zIndex = pOffset.depth;

        if(container.children.length === 1) {
            container.style.height = (50 / pOffset.depth) * 3 + 'px';
            container.style.width = (50 / pOffset.depth) * 6 + 'px';
        }
        
        container.remove();
        target.appendChild(container);
        
        generateLines();
        // drawConnections();
    }

    function drop(event) {
        var offset;
        try {
            offset = event.dataTransfer.getData("text/plain").split(',');
        }
        catch(e) {
            offset = offset_data.split(',');
        }
        
        moveContainer(dm, dropTarget, (event.pageX + parseInt(offset[0],10)), (event.pageY + parseInt(offset[1],10)));

        dm.style.display = "";
        
        for(let child of dropTarget.children) {
            
            const childRightPos = parseInt(child.style.left,10) + parseInt(child.style.width,10);

            if(childRightPos + 15 > parseInt(dropTarget.style.width,10)) {
                dropTarget.style.width = childRightPos + 15 + 'px';
            }

            const childBottomPos = parseInt(child.style.top,10) + parseInt(child.style.height, 10);

            if(childBottomPos + 15 > parseInt(dropTarget.style.height,10)) {
                dropTarget.style.height = childBottomPos + 15 + 'px'
            }
        }

        event.preventDefault();
        return false;
    }

    const createContainer = (origin, target, event) => {
        let containerId
        if(stateRef.current.availableIDs.length > 0) {
            containerId = stateRef.current.availableIDs[0];

            const newAvailableIDs = stateRef.current.availableIDs.slice(1);

            setState({...stateRef.current, availableIDs: [...newAvailableIDs],});

        } else {
            containerId = stateRef.current.containers.length + 1;
        }
 
        const newEvent = {
            eventType: "create",
            container: containerId,
            xPos: origin.pageX,
            yPos: origin.pageY,
        }
        createNewEvent(newEvent);

        let newContainer = <BasicContainer id={containerId} xPos={origin.pageX} yPos={origin.pageY} />

        setState({ ...stateRef.current, containers: [...stateRef.current.containers, newContainer]});
    }

    const deleteContainer = (origin, target, event) => {
        const targetId = parseInt(target.id,10);

        if(targetId !== state.containers.length) {
            setState({...stateRef.current, availableIDs: [...stateRef.current.availableIDs, targetId], });
        }

        const newContainers = stateRef.current.containers.filter((cont) => {
            for(let p = document.getElementById(cont.props.id);
                validTargets.includes(p.className);
                p = p.parentElement) {

                if(p.id === targetId) {
                    return true;
                }
            }
            return false;
        });
        console.log(newContainers);

        setState({ ...stateRef.current, containers: newContainers });

        deleteConnections(targetId);
    }

    const editContainerText = (origin, target, event) => {
        for(let child of target.children) {
            if(child.tagName.toLowerCase() === "h3") {
                
            }
        }

        // console.log(origin, target, event);
    }

    const setToolHandler = (origin, target, event) => {
        setState({...stateRef.current, tool: {...stateRef.current.tool, selected: event.target.innerText, data: null}});
    }

    useEffect(() => {
        // console.log(stateRef.current);
        
    }, [stateRef.current]);

    const connectionsTool = (origin, target, event) => {
        if(stateRef.current.tool.data !== null) {    
            if(stateRef.current.tool.data !== target) {
                console.log(stateRef.current.tool)
                console.log("creating connection!");
                createConnection(parseInt(target.id, 10), parseInt(stateRef.current.tool.data.id, 10));
                
            }
            stateRef.current.tool.data.style.backgroundColor = '';
            target.style.backgroundColor = '';

            const newState = {
                ...stateRef.current,
                tool: {
                    ...stateRef.current.tool,
                    data: null
                },
            }
            setState(newState);

        } else {
            console.log("selecting first element!")
            setState({
                ...stateRef.current,
                tool: {
                    ...stateRef.current.tool,
                    selected: 'Create/ Delete Connections',
                    data: target},
                });
            target.style.backgroundColor = 'white';
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        document.addEventListener('keydown', (event) => {
            console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
        });

        document.addEventListener('mouseover', (event) => {
            const target = findValidContainer(event.target);

            let newCursor = '';
            switch(stateRef.current.tool.selected) {
                case 'Create/ Delete Connections':
                    newCursor = 'cell';
                    break;
                case 'Create Containers':
                    newCursor = 'copy';
                    break;
                case 'Delete':
                    newCursor = 'alias';
                    break;
            }

            setState({
                ...stateRef.current,
                tool: {
                    ...stateRef.current.tool,
                    cursor: newCursor,
                }
            });
        });

        document.addEventListener('click', (event) => {
            const target = findValidContainer(event.target);

            if(target) {
                switch(stateRef.current.tool.selected) {
                    case 'Create/ Delete Connections':
                        connectionsTool(event, target);
                        break;
                    case 'Create Containers':
                        createContainer(event, target);
                        break;
                    case 'Delete':
                        deleteContainer(event, target);
                        break;
                    default:
                        console.log("No tool selected!");
                }
            }

        });
    });

    const buttons = {"work-space": [
            {text: 'Select Tool >', function: [
                {text: 'None', function: setToolHandler},
                {text: 'Create/ Delete Connections', function: setToolHandler},
                {text: 'Create Containers', function: setToolHandler},
                {text: 'Delete', function: setToolHandler},
            ]},
            {text: 'Create Container', function: createContainer},
            {text: 'Edit Design >', function: [
                {text: "Edit Colors",
                function: () => {console.log("Edit WorkSpace Colors")}
                },
            ]},
        ],
        "container": [
            {text: "Delete Container", function: deleteContainer},
            {text: "Edit Container >", function: [
                {text: "Edit Text",
                function: editContainerText},
                {text: "Edit Colors",
                function: () => {console.log("Edit Container Colors")}
                },
            ]},
            {text: "Create Container", function: createContainer}
        ]};

    return(<section id='0' className="work-space"
            style={{
                left: '0px',
                top: '0px',
                cursor: stateRef.current.tool.cursor,
            }}
            onDrop={drop}
            onDragOver={drag_over}>

                <svg zAxis="5">
                    {state.lines}
                </svg>
        
                <button
                    class="download-button"
                    href="../public/index.html"
                    download>
                        Download Layout
                </button>

                <ContextMenuGenerator buttons={buttons} />
                {state.containers}
                {/* <canvas id="myCanvas" zIndex='3' /> */}

            </section>);
}

export default Home;