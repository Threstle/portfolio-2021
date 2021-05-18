import React, {useEffect, useRef, useState} from "react";
import * as THREE from 'three';
import * as dat from 'dat.gui'
import './app.less';
import html2canvas from 'html2canvas';
import { Vector2 } from "three";
import InteractiveTexture from "../../webgl/InteractiveTexture";
import InteractiveScene from "../../webgl/InteractiveScene";

interface IProps {}

const componentName = "App";

/**
 * @name HomePage
 */
function App (props: IProps) {

    // get root ref
    const rootRef = useRef<HTMLDivElement>(null);

    const webglCanvasRef = useRef<HTMLCanvasElement>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{

        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        
        const interactiveScene = new InteractiveScene
        (
                webglCanvasRef.current,
                new Vector2(window.innerWidth,window.innerHeight),
                containerRef.current
        );

    })

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE



    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div className={componentName} ref={rootRef}>
        <canvas ref={webglCanvasRef} className={`${componentName}_webglCanvas`}/>
        <div ref={containerRef} className={`${componentName}_container`}>
            <h1>Etienne Chaumont</h1>
            <h2>creative dev</h2>
        </div>
    </div>;
};

export default App;
