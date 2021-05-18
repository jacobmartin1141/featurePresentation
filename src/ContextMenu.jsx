import React, {
    useState,
    useRef,
} from 'react';

import createValidator from './findValidContainer';

const validTargets = [
    "work-space",
    "box",
];
const findValidContainer = createValidator(validTargets);

function ContextMenuGenerator({buttons, active}) {
    const [menus, setMenus] = useState([]);
    const menusRef = useRef({});
    menusRef.current = menus;

    function findMenuIndexById(id) {
        return menusRef.current.findIndex((menu) => {
            return (menu.props.id === id);
        });
    }

    const expandMenuHandler = (event, func, id, target) => {
        const foundMenu = findMenuIndexById(id);

        if(foundMenu === -1) {
            setMenus([
                ...menusRef.current,
                <ContextMenu
                    key={menusRef.current.length}
                    target={target}
                    id={menusRef.current.length}
                    buttons={func}
                    xPos={event.pageX + 10}
                    yPos={event.pageY}
                    event={event}
                />
            ]);
        
        } else {
            const newMenus = menusRef.current.reduce((acc, menu, index) => {
                if(index === foundMenu) {
                    return acc;
                }
                return [...acc, menu];
            }, []);

            setMenus([...newMenus]);
        }
    }
    
    function BasicButton({target, origin, id, text, func, expandMenuHandler}) {
        if(typeof(func) == "function") {
            const clickFunction = (event) => {
                setMenus([]);
                func(origin, target, event);
            }

            return(<button className="MenuButton" onClick={clickFunction}>{text}</button>);
        }

        const subMenuId = menusRef.current.length;
            
        return(<button className="MenuButton" onClick={(event) => expandMenuHandler(event, func, subMenuId, target)}>
            {text}
        </button>
        );
    }
        
    function ContextMenu({target, id, buttons, xPos, yPos, expandMenuHandler, event}) {
        const buttonsArray = buttons.map((button) => {
            return <><BasicButton target={target} origin={event} id={id} text={button.text} func={button.function} expandMenuHandler={expandMenuHandler} /><br/></>
        });
            
        return(<div
            id={"menu_" + id}
            className="ContextMenu"
            style={{
                position: 'absolute',
                left: xPos + 'px',
                top: yPos + 'px',
                zIndex: 10,
            }}
            >            
            {buttonsArray}
        </div>);
    }

    window.addEventListener("DOMContentLoaded", () => {
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();

            const target = findValidContainer(event.target);

            const workSpace = document.getElementById('0');

            if(target) {
                setMenus([<ContextMenu
                    key={menusRef.current.length}
                    id={menusRef.current.length}
                    buttons={buttons[target.className]}
                    xPos={event.pageX + workSpace.scrollLeft}
                    yPos={event.pageY + workSpace.scrollTop}
                    expandMenuHandler={expandMenuHandler}
                    event={event}
                    target={target}
                />]);
            }
        });
        document.addEventListener('click', (event) => {
            if(!["ContextMenu","MenuButton",].includes(event.target.className)) {
                setMenus([]);
            }
        });
    });

    return(<>{menus}</>);
}

export default ContextMenuGenerator;