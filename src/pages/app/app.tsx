import React, { useEffect, useRef, useState } from "react";
import * as dat from 'dat.gui'
import { Vector2 } from "three";

import './app.less';

import InteractiveScene from "../../webgl/InteractiveScene";
import { GuiSceneFolder } from "../../helpers/Gui";
import FocusedElement from "../../components/focusedElement/focusedElement";
import InteractiveTexture from "../../webgl/InteractiveTexture";
import Gallery from "../../components/gallery/gallery";

interface IProps { }

const componentName = "App";

/**
 * @name HomePage
 */
function App(props: IProps) {

    // get root ref
    const rootRef = useRef<HTMLDivElement>(null);

    const webglCanvasRef = useRef<HTMLCanvasElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const interactiveSceneRef = useRef<InteractiveScene>();

    const interactiveTextureRef = useRef<InteractiveTexture>();

    // States
    const [isLandscape,setIsLandscape] = useState<boolean>(false);

    

    useEffect(() => {

        window.addEventListener('resize',()=>{
        
         const size = new Vector2(window.innerWidth, window.innerHeight);

         interactiveTextureRef.current.resize(new Vector2(size.x / 10, size.y / 10))
         interactiveSceneRef.current.onResize(size);
         interactiveSceneRef.current.updateDomTexture(containerRef.current);
        });

        GuiSceneFolder.add(webglCanvasRef.current.style, 'opacity', 0, 1, 0.01);
    }, []);

    useEffect(() => {

        setTimeout(() => {

            const size = new Vector2(window.innerWidth, window.innerHeight);

            interactiveTextureRef.current = new InteractiveTexture(new Vector2(size.x / 10, size.y / 10));

            interactiveSceneRef.current = new InteractiveScene
                (
                    webglCanvasRef.current,
                    size,
                    containerRef.current,
                    interactiveTextureRef.current
                );
        }, 1000);

        if (!new URLSearchParams(window.location.search).get('debug')) {
            //@ts-ignore
            dat.GUI.toggleHide();
        }


    }, [])

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

    // -------------------–-------------------–-------------------–--------------- HANBLERS

    const onFocus = (pFocus: boolean) => {
        interactiveTextureRef.current.setFocus(pFocus)
    }



    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div className={componentName} ref={rootRef}>
        <canvas ref={webglCanvasRef} className={`${componentName}_webglCanvas`} />
        <div ref={containerRef} className={`${componentName}_container`}>
            <div className={`${componentName}_wrapper`}>
            {!isLandscape && <Gallery/>}
                <div className={`${componentName}_textWrapper`}>
                    <p className={`${componentName}_introText`}>Based in Lyon. Currently looking for freelance jobs. I like lorem ipsum bla bla bla. I just left a position at <FocusedElement onFocusChange={onFocus} className={`${componentName}_link ${componentName}_link-cherAmi`}><a href="https://cher-ami.tv" target="_blank">Cher Ami.</a></FocusedElement> Please <FocusedElement onFocusChange={onFocus} className={`${componentName}_link`}><a href="mailto:etienne.chaumont@gmail.com">contact me</a></FocusedElement> if you want us to work together.</p>
                </div>
                <div className={`${componentName}_titleWrapper`}>
                    <h1>Etienne Chaumont</h1>
                    <h2>creative dev</h2>
                </div>
            </div>
           
        </div>
    </div>;
};

export default App;

