import React, { useEffect, useRef, useState } from "react";
import * as dat from 'dat.gui'
import { Vector2 } from "three";

import './app.less';

import InteractiveScene from "../../webgl/InteractiveScene";
import { GuiSceneFolder } from "../../helpers/Gui";
import FocusedElement from "../../components/focusedElement/focusedElement";
import InteractiveTexture from "../../webgl/InteractiveTexture";
import Gallery from "../../components/gallery/gallery";
import gsap, { Quint } from "gsap";
import { EDeviceType, EnvUtils } from "../../lib/utils/EnvUtils";

interface IProps { }

const componentName = "App";

/**
 * @name HomePage
 */
function App(props: IProps) {

    // get root ref
    const rootRef = useRef<HTMLDivElement>(null);

    const veilRef = useRef<HTMLSpanElement>(null);
    
    const wrapperRef = useRef<HTMLDivElement>(null);

    const titleRef = useRef<HTMLHeadingElement>(null);
    

    const subtitleRef = useRef<HTMLHeadingElement>(null);

    const textRef = useRef<HTMLParagraphElement>(null);

    const webglCanvasRef = useRef<HTMLCanvasElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const headerRef = useRef<HTMLDivElement>(null);

    const interactiveSceneRef = useRef<InteractiveScene>();

    const interactiveTextureRef = useRef<InteractiveTexture>();

    // States
    const [isLandscape, setIsLandscape] = useState<boolean>(false);

    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [animTrigger, setAnimTrigger] = useState<boolean>(false);



    useEffect(() => {

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);

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
                    interactiveTextureRef.current,
                    onDomTextureUpdated
                );
        }, 1000);

        if (!new URLSearchParams(window.location.search).get('debug')) {
            //@ts-ignore
            dat.GUI.toggleHide();
        }


    }, [])

    const onDomTextureUpdated = () => {

        const offset = EnvUtils.getDeviceType() === EDeviceType.DESKTOP?"4rem":"2rem";

        setIsLoaded(true);
        gsap.set(titleRef.current, { x: "-100%" });
        gsap.set(subtitleRef.current, { x: "-100%" });
        wrapperRef.current.style.transform = `translateY(calc(100% - ${headerRef.current.getBoundingClientRect().height}px - ${offset}))`

        
        gsap.to(veilRef.current, {
            opacity: 0,
            ease: Quint.easeInOut,
            duration: 0.5,
            onComplete: () => {
                setAnimTrigger(true);

                gsap.to(titleRef.current, {
                    x: "0%",
                    duration: 1.5,
                    delay: 1,
                    ease: Quint.easeInOut
                })

                gsap.to(subtitleRef.current, {
                    x: "0%",
                    duration: 1.5,
                    delay: 1.1,
                    ease: Quint.easeInOut
                })

                gsap.to(wrapperRef.current,{
                    y:"0%",
                    duration:1.1,
                    delay:2,
                    ease:Quint.easeInOut
                })

            }
        });

    };

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

    // -------------------–-------------------–-------------------–--------------- HANBLERS

    const onFocus = (pFocus: boolean) => {
        interactiveTextureRef?.current?.setFocus(pFocus)
    }

    const onResize = () => {

        const size = new Vector2(window.innerWidth, window.innerHeight);

        interactiveTextureRef.current.resize(new Vector2(size.x / 10, size.y / 10))
        interactiveSceneRef.current.onResize(size);
        interactiveSceneRef.current.updateDomTexture(containerRef.current);
    }



    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div className={componentName} ref={rootRef}>
        <canvas ref={webglCanvasRef} className={`${componentName}_webglCanvas`} />
        <span ref={veilRef} className={`${componentName}_veil`} />
        <div ref={containerRef} className={`${componentName}_container`}>
            <div  ref={wrapperRef} className={`${componentName}_wrapper`}>
                <div ref={headerRef} className={`${componentName}_header`}>
                    {<Gallery
                        className={`${componentName}_gallery`}
                        isVisible={!isLoaded}
                        animTrigger={animTrigger}
                    />}
                    <div className={`${componentName}_titleWrapper`}>
                        <h1 ref={titleRef} className={`${componentName}_title`}>Etienne<br /> Chaumont</h1>
                        <h2 ref={subtitleRef} className={`${componentName}_subtitle`}>creative dev</h2>
                    </div>
                </div>
                    <div className={`${componentName}_textWrapper`}>
                        <p ref={textRef} className={`${componentName}_introText`}>Graduated from Gobelins Paris. I worked for 5 years at <FocusedElement onFocusChange={onFocus} className={`${componentName}_link ${componentName}_link-cherAmi`}><a href="https://cher-ami.tv" target="_blank">Cher Ami.</a></FocusedElement> as a creative developer. Based in Lyon, France. currently available for freelance jobs. I like <i>NodeJs, ThreeJs, Pixi, Phaser Unity, Gsap, React, GLSL and free jazz.</i> Want to to meet? You can contact me <FocusedElement onFocusChange={onFocus} className={`${componentName}_link`}><a href="mailto:etienne.chaumont@gmail.com">here</a></FocusedElement>. You may also find me around here : </p>
                    </div>

            </div>
            
        </div>
    </div>;
};

export default App;

