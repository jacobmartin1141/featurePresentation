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
    return(<div
            id={id}
            key={id.toString()}
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
        <h3>New Container</h3>
    </div>);
}

function Home() {
    const connectionsInit = [
        {root: 1, connects: 2},
        {root: 1, connects: 3},
        {root: 2, connects: 3},
        {root: 3, connects: 4},
        {root: 4, connects: 1},
    ];
    const [connections, setConnections] = useState([]);
    const connectionsRef = useRef({});
    connectionsRef.current = connections;

    function deleteConnections(ID) {
        const newConnections = connectionsRef.current.reduce((acc, conn) => {
            if ([conn.root, conn.connects].includes(ID)) {
                return acc;
            }
            return [...acc, conn];
        }, []);

        setConnections([...newConnections])
    }
    function createConnection(ID, targetID) {
        
        let found = false;
        const newConnections = connectionsRef.current.filter((conn) => {
            const filter = (!([ID, targetID].includes(conn.root) && [ID, targetID].includes(conn.connects)));
            if(!filter) found = true;
            return filter;
        });

        if(!found) {
            const newConnection = {
                root: ID,
                connects: targetID
            };
    
            setConnections([ ...connectionsRef.current, newConnection]);
        } else {
            setConnections([...newConnections]);
        }
    }
    function drawConnections() {
        const canvasElement = document.getElementById("myCanvas");
        const ctx = canvasElement.getContext("2d");

        ctx.lineWidth = 4;
        
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
        connections.forEach((connection) => {
            const rootEl = document.getElementById(connection.root);    

            const rootPos = findParentPos(rootEl);

            const connEl = document.getElementById(connection.connects);

            const connPos = findParentPos(connEl);

            ctx.beginPath();
            ctx.moveTo(
                rootPos.left + (parseInt(rootEl.style.width,10) / 2),
                rootPos.top + (parseInt(rootEl.style.height,10) / 2),
            );
            ctx.lineTo(
                connPos.left + (parseInt(connEl.style.width,10) / 2),
                connPos.top + (parseInt(connEl.style.height,10) / 2),
            );
            ctx.stroke();
        });
    }

    useEffect(() => {
        drawConnections();
    });

    const [history, setHistory] = useState([]);

    const createNewEvent = (newEvent) => {
        setHistory([...history, newEvent]);
    }

    function removeTargetConnections(id, targetId) {
        const newConnections = connections.map((conn) => {
            if(conn.root === id || conn.root === targetId) {
                
                return {
                    root: conn.root,
                    connects: conn.connects.reduce((acc, connEl) => {
                        if(connEl === id || connEl === targetId) {
                            return acc;
                        } else {
                            return [...acc, connEl];
                        }
                    }, [])
                }
                
            } else {
                return conn;
            }
        });

        setConnections([...newConnections]);
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
            
        container.style.left = Math.max( (xPos - pOffset.left) , 0) + 'px';
        container.style.top = Math.max( (yPos - pOffset.top) , 0) + 'px';
        
        container.style.zIndex = pOffset.depth;

        if(container.children.length < 2) {
            container.style.height = (50 / pOffset.depth) * 3 + 'px';
            container.style.width = (50 / pOffset.depth) * 6 + 'px';
        }
        
        container.remove();
        target.appendChild(container);
    
        drawConnections();
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

            if(childRightPos > parseInt(dropTarget.style.width,10)) {
                dropTarget.style.width = childRightPos + 15 + 'px';
            }

            const childBottomPos = parseInt(child.style.top,10) + parseInt(child.style.height, 10);

            if(childBottomPos > parseInt(dropTarget.style.height,10)) {
                dropTarget.style.height = childBottomPos + 15 + 'px'
            }
        }

        event.preventDefault();
        return false;
    }

    
    const containersInit = [...Array(4).keys()].map((num, index) => {
        return <BasicContainer id={index + 1} xPos={index * 300} yPos={index * 10 + 25} />;
    });

    const [containers, setContainers] = useState([]);
    const containersRef = useRef({});
    containersRef.current = containers;

    const [availableIDs, setAvailableIDs] = useState([]);
    const availableIDsRef = useRef({});
    availableIDsRef.current = availableIDs;

    const createContainer = (origin, target, event) => {
        let containerId
        if(availableIDsRef.current.length > 0) {
            containerId = availableIDsRef.current[0];

            const newAvailableIDs = availableIDsRef.current.slice(1);

            setAvailableIDs([...newAvailableIDs]);

        } else {
            containerId = containersRef.current.length + 1;
        }
 
        const newEvent = {
            eventType: "create",
            container: containerId,
            xPos: origin.pageX,
            yPos: origin.pageY,
        }
        createNewEvent(newEvent);

        const newContainer = <BasicContainer id={containerId} xPos={origin.pageX} yPos={origin.pageY} />

        setContainers([...containersRef.current, newContainer]);
    }

    const deleteContainer = (origin, target, event) => {
        const targetId = parseInt(target.id,10);

        if(targetId !== containers.length) {
            setAvailableIDs([...availableIDsRef.current, targetId]);
        }

        const newContainers = containersRef.current.filter((cont) => {
            return (cont.props.id !== targetId);
        });

        setContainers([...newContainers]);

        deleteConnections(targetId);
    }

    const setToolHandler = (origin, target, event) => {
        setCurrentTool({tool: event.target.innerText, data: null});
    }

    const connectionsTool = (event, target) => {
        if(currentToolRef.current.data !== null) {
            
            if(currentToolRef.current.data === target) {
                currentToolRef.current.data.style.backgroundColor = '';
                
                setCurrentTool({tool: 'Create/ Delete Connections', data: null});

            } else {
                currentToolRef.current.data.style.backgroundColor = '';

                createConnection(parseInt(target.id, 10), parseInt(currentToolRef.current.data.id, 10));

                setCurrentTool({tool: 'Create/ Delete Connections', data: null});
            }
        } else {
            setCurrentTool({tool: 'Create/ Delete Connections', data: target});
            target.style.backgroundColor = 'white';
        }
    }

    const [currentTool, setCurrentTool] = useState({tool: "None", data: null});
    const currentToolRef = useRef({});
    currentToolRef.current = currentTool;

    window.addEventListener("DOMContentLoaded", () => {
        document.addEventListener('keydown', (event) => {
            console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
        });

        document.addEventListener('click', (event) => {
            const target = findValidContainer(event.target);

            if(target) {
                switch(currentToolRef.current.tool) {
                    case 'Create/ Delete Connections':
                        connectionsTool(event, target);
                        break;
                    case 'Create Containers':
                        console.log('Create Containers');
                        break;
                    case 'Delete':
                        console.log('Delete');
                        break;
                }
            }

        });
    });

    const buttons = 
        {"work-space": [
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
                }
            ]},
        ],
        "container": [
            {text: "Delete Container", function: deleteContainer},
            {text: "Edit Container >", function: [
                {text: "Edit Text",
                function: () => {console.log("Edit Container Text")}
                },
                {text: "Edit Colors",
                function: () => {console.log("Edit Container Colors")}
                }
            ]},
            {text: "Edit Connections", function: () => console.log("Edit Connections")},
            {text: "Create Container", function: () => {console.log("Create Embedded Container")}}
        ]};

    return(
        <section id='0' className="work-space"
            style={{
                left: '0px',
                top: '0px',
                height: '1500px',
                width: '1500px',}}
            onDrop={drop}
            onDragOver={drag_over}>

            {/*  Use this to set cursor for different tools*/}
            {/* <style></style> */}

            <ContextMenuGenerator buttons={buttons} />
            {containers}
            <canvas id="myCanvas" width="1500px" height="1500px"/>

        </section>);
}

export default Home;
