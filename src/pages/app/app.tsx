import React, { useEffect, useRef, useState } from "react";
import * as dat from 'dat.gui'
import { Vector2 } from "three";

import './app.less';

import InteractiveScene from "../../webgl/InteractiveScene";
import TwitterIcon from "../../components/twitterIcon/twitterIcon";
import GithubIcon from "../../components/githubIcon/githubIcon";
import Gui, { GuiSceneFolder } from "../../helpers/Gui";





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

    useEffect(() => {
        GuiSceneFolder.add(webglCanvasRef.current.style,'opacity',0,1,0.01);
    },[]);

    useEffect(() => {

        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }


        setTimeout(() => {
            interactiveSceneRef.current = new InteractiveScene
                (
                    webglCanvasRef.current,
                    new Vector2(window.innerWidth, window.innerHeight),
                    containerRef.current
                );
        }, 1000);

        if (!new URLSearchParams(window.location.search).get('debug')) {
            //@ts-ignore
            dat.GUI.toggleHide();
        }


    }, [])

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE



    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div className={componentName} ref={rootRef}>
        <canvas ref={webglCanvasRef} className={`${componentName}_webglCanvas`} />
        <div ref={containerRef} className={`${componentName}_container`}>
            <span className={`${componentName}_border`} />
            <div className={`${componentName}_textWrapper`}>
                <h1>Etienne Chaumont</h1>
                <h2>creative dev</h2>
                <p>Based in Lyon. Currently looking for freelance jobs.</p>
                <div className={`${componentName}_socialIcons`}>
                    <TwitterIcon />
                    <GithubIcon />
                </div>
            </div>
        </div>
    </div>;
};

export default App;
