import React, {
    useState,
    useEffect,
    useRef,
} from 'react';

import ContextMenuGenerator from './ContextMenu';

import createValidator from './findValidContainer';

const validTargets = [
    "box",
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
        
        // console.log(p);
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
        dm.style.display = "none";

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
                width="300px"
                height="150px"
                id='name'
                name='name'
                onChange={changeHandler}
                autoFocus={true}
                required={true}
                placeholder='Click to Save'
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
            className="box"
            style={{
                position: 'absolute',
                left: xPos + 'px',
                top: yPos + 'px',
                height: '150px',
                width: '300px',
                zIndex: '1',
            }}
            draggable={true}
            onDragStart={drag_start}>
        {displayRef.current.element}
    </div>);
}

function BasicLine({rootEl, connEl}) {
    const rootPos = findParentPos(rootEl);   
    const connPos = findParentPos(connEl);

    return(<line
        x1={rootPos.left + (parseInt(rootEl.style.width,10) / 2)}
        y1={rootPos.top + (parseInt(rootEl.style.height,10) / 2)}
        x2={connPos.left + (parseInt(connEl.style.width,10) / 2)}
        y2={connPos.top + (parseInt(connEl.style.height,10) / 2)}
        stroke="black"
        strokeWidth='0.2vh'
    />);
}

function Home() {
    const stateInit = {
        history: [],
        availableIDs: [],
        containers: [
            <BasicContainer id={1} xPos={100} yPos={120}/>,
            <BasicContainer id={2} xPos={200} yPos={400}/>,
        ],
        connections: [
            {root: 1,
            connects: 2,},
        ],
        lines: [],
        displayLines: [],
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
        const newConnections = stateRef.current.connections.filter((conn) => {
            console.log(ID, conn, [conn.root, conn.connects].includes(ID));
            if ([conn.root, conn.connects].includes(ID)) {
                return false;
            }
            return true;
        }, []);

        setState({...stateRef.current, connections: [...newConnections] } );
        generateLines();
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
            
            setState({...stateRef.current, connections: [...stateRef.current.connections, newConnection] } );
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
        let newLines = [];

        stateRef.current.connections.forEach((connection) => {
            
            const rootEl = document.getElementById(connection.root);
            const connEl = document.getElementById(connection.connects);

            const newLine = <BasicLine rootEl={rootEl} connEl={connEl}/>

            
            const rootPos = findParentPos(rootEl);   
            const connPos = findParentPos(connEl);

            const bottom = Math.max(
                connPos.top + (parseInt(connEl.style.height,10) / 2),
                rootPos.top + (parseInt(rootEl.style.height,10) / 2)
            );
            const right = Math.max(
                connPos.left + (parseInt(connEl.style.width,10) / 2),
                rootPos.left + (parseInt(rootEl.style.width,10) / 2)
            );

            const layer = parseInt(rootEl.style.zIndex,10) - 1;
            if(newLines[layer] !== undefined) {

                newLines[layer] = {
                    right: Math.max(right, newLines[layer].right),
                    height: Math.max(bottom, newLines[layer].height),
                    lines: [...newLines[layer].lines, newLine],
                };
            } else {
                
                newLines = [...newLines, {lines: [newLine], height: bottom, right: right }];
            }
        });

        const displayLines = newLines.map((layer, index) => {
            return <svg
            style={{
                position: 'absolute',
                zIndex: (index * 2),
                width: layer.right + 'px',
                height: layer.height + 'px',
                left: '0px',
                top: '0px',
            }}>
                {layer.lines}
            </svg>
        });
        
        setState({...stateRef.current, displayLines: displayLines});
    }

    function createNewEvent(newEvent) {
        setState({...stateRef.current, history: [...stateRef.current.history, newEvent], });
    }

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
        
        container.style.zIndex = (pOffset.depth * 2) - 1;

        // console.log(container.style.zIndex);

        if(container.children.length === 1) {
            container.style.height = (50 / pOffset.depth) * 3 + 'px';
            container.style.width = (50 / pOffset.depth) * 6 + 'px';
            container.style.fontSize = (5 / pOffset.depth) * 4 + 'px';
        }
        
        
        const childRightPos = parseInt(container.style.left,10) + parseInt(container.style.width,10);
        if(childRightPos + 15 > parseInt(target.style.width,10)) {
            target.style.width = childRightPos + 15 + 'px';
        }

        const childBottomPos = parseInt(container.style.top,10) + parseInt(container.style.height, 10);
        if(childBottomPos + 15 > parseInt(target.style.height,10)) {
            target.style.height = childBottomPos + 15 + 'px'
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

        event.preventDefault();
        return false;
    }

    const createContainer = (origin, target, event) => {
        let newAvailableIDs = [];
        let containerId
        if(stateRef.current.availableIDs.length > 0) {
            containerId = stateRef.current.availableIDs[0];

            newAvailableIDs = stateRef.current.availableIDs.slice(1);

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

        setState({
            ...stateRef.current,
            containers: [...stateRef.current.containers, newContainer],
            availableIDs: newAvailableIDs,
        });
    }

    const deleteContainer = (origin, target, event) => {
        const targetId = parseInt(target.id,10);

        const newContainers = stateRef.current.containers.filter((cont) => {
            for(let p = document.getElementById(cont.props.id);
            validTargets.includes(p.className);
            p = p.parentElement) {

                if(p.id === targetId) {
                    return false;
                }
            }
            return true;
        });

        const newConnections = stateRef.current.connections.filter((conn) => {
            if ([conn.root, conn.connects].includes(targetId)) {
                return false;
            }
            return true;
        }, []);

        
        if(targetId !== stateRef.current.containers.length) {
            setState({
                ...stateRef.current,
                availableIDs: [...stateRef.current.availableIDs, targetId],
                containers: newContainers,
                connections: [...newConnections] 
            });
        } else {
            setState({
                ...stateRef.current,
                containers: newContainers,
                connections: [...newConnections]
            });
        }
    }

    const editContainerText = (origin, target, event) => {
        for(let child of target.children) {
            if(child.tagName.toLowerCase() === "h3") {
                
            }
        }

        // console.log(origin, target, event);
    }

    const setToolHandler = (origin, target, event) => {
        let newCursor;
            switch(event.target.innerText) {
                case 'Create/ Delete Connections':
                    newCursor = 'cell';
                    break;
                case 'Create Containers':
                    newCursor = 'copy';
                    break;
                case 'Delete':
                    newCursor = 'alias';
                    break;
                default:
                    newCursor = '';
        }

        setState({...stateRef.current, tool: {...stateRef.current.tool, selected: event.target.innerText, data: null, cursor: newCursor}});
    }

    const connectionsTool = (origin, target, event) => {
        if(target.className === 'box') {
            if(stateRef.current.tool.data !== null) {   
                if(stateRef.current.tool.data !== target) {
                    console.log(stateRef.current.tool)
                    console.log("creating connection!");
                    createConnection(parseInt(target.id, 10), parseInt(stateRef.current.tool.data.id, 10));
                    
                }
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
    }

    window.addEventListener("DOMContentLoaded", () => {
        document.addEventListener('keydown', (event) => {
            console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
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
        "box": [
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
    
    const exitHandler = (event) => {
        if(window.confirm("Are you sure you want to exit? All unsaved progress will be lost!")) {
            window.location.href='/';
        }
    }

    return(<div id='0' className="work-space"
        style={{
            left: '0px',
            top: '0px',
            cursor: stateRef.current.tool.cursor,
        }}
        onDrop={drop}
        onDragOver={drag_over}>

            <div className="scb bottom container-fluid">
                {/* <div class="container-xl"> */}
                    <div class="row d-flex justify-content-between">
                        <button
                            href="../public/index.html"
                            download
                            class="col-3">
                                Download Layout
                        </button>
                        <button
                            href="../public/index.html"
                            download
                            class="col-3">
                                Save Layout
                        </button>
                        <div class="col-3"/>
                        <button
                            onClick={exitHandler}
                            class="col-2">
                            Exit App
                        </button>
                    </div>
                {/* </div> */}
            </div>
    
            {state.displayLines}
            {state.containers}
            
            <ContextMenuGenerator buttons={buttons} />

            {/* <canvas id="myCanvas" zIndex='3' /> */}
    </div>);
}

export default Home;
