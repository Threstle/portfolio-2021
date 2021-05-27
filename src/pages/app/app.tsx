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

    const socialIconsRef = useRef([]);

    const subtitleRef = useRef<HTMLHeadingElement>(null);

    const textRef = useRef<HTMLParagraphElement>(null);

    const webglCanvasRef = useRef<HTMLCanvasElement>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const headerRef = useRef<HTMLDivElement>(null);

    const interactiveSceneRef = useRef<InteractiveScene>();

    const interactiveTextureRef = useRef<InteractiveTexture>();

    const resizedFinishedRef = useRef<number>()

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

            interactiveTextureRef.current = new InteractiveTexture(new Vector2(size.x / 50, size.y / 50));

            interactiveSceneRef.current = new InteractiveScene
                (
                    webglCanvasRef.current,
                    size,
                    containerRef.current,
                    interactiveTextureRef.current,
                    onDomTextureUpdated
                );
        }, 500);

        if (!new URLSearchParams(window.location.search).get('debug')) {
            //@ts-ignore
            dat.GUI.toggleHide();
        }


    }, [])

    const onDomTextureUpdated = () => {

        const offset = EnvUtils.getDeviceType() === EDeviceType.DESKTOP ? "4rem" : "2rem";

        setIsLoaded(true);
        gsap.set(titleRef.current, { x: "-100%" });
        gsap.set(subtitleRef.current, { x: "-100%" });
        wrapperRef.current.style.transform = `translateY(calc(100% - ${headerRef.current.getBoundingClientRect().height}px - ${offset}))`

        socialIconsRef.current.forEach((socialIcon) => {
            gsap.set(socialIcon, { x: "500%" });
        })

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

                gsap.to(wrapperRef.current, {
                    y: "0%",
                    duration: 1.1,
                    delay: 2,
                    ease: Quint.easeInOut,
                    onComplete: () => {
                        interactiveSceneRef.current.setMustRender(true);
                    }
                })

                socialIconsRef.current.forEach((socialIcon, index) => {
                    gsap.to(socialIcon, {
                        x: "0%",
                        duration: 2,
                        ease: Quint.easeInOut,
                        delay: 3 + (index * 0.3)
                    });
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

        interactiveSceneRef.current.setMustRender(false); 
        clearTimeout(resizedFinishedRef.current);
        resizedFinishedRef.current = setTimeout(() => {
             const size = new Vector2(window.innerWidth, window.innerHeight);
            interactiveTextureRef?.current?.resize(new Vector2(size.x / 50, size.y / 50))
            interactiveSceneRef?.current?.updateDomTexture(containerRef.current, () => {
                interactiveSceneRef?.current?.onResize(size);
                interactiveSceneRef.current.setMustRender(true);

            });

        }, 250);

    }



    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div className={componentName} ref={rootRef}>
        <canvas ref={webglCanvasRef} className={`${componentName}_webglCanvas`} />
        <span ref={veilRef} className={`${componentName}_veil`} />
        <div ref={containerRef} className={`${componentName}_container`}>
            <div ref={wrapperRef} className={`${componentName}_wrapper`}>
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
                    <p ref={textRef} className={`${componentName}_introText`}> Based in Lyon, France and currently available for freelance jobs, I am a Gobelins Paris graduate with a 5 year experience as a creative developer for <FocusedElement onFocusChange={onFocus} className={`${componentName}_link ${componentName}_link-cherAmi`}><a href="https://cher-ami.tv" target="_blank">Cher Ami.</a></FocusedElement> I like <i>NodeJs, ThreeJs, Pixi, Phaser Unity, Gsap, React, GLSL and free jazz.</i> Want to meet? Drop me a message <FocusedElement onFocusChange={onFocus} className={`${componentName}_link`}><a href="mailto:etienne.chaumont@gmail.com">here.</a></FocusedElement></p>
                </div>

            </div>
            <div className={`${componentName}_socialIcons`}>
                <span ref={(r) => socialIconsRef.current[0] = r} className={`${componentName}_socialIcon`}>
                    <FocusedElement onFocusChange={onFocus} className={`${componentName}_link`}>
                        <a href="https://github.com/Threstle" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                    </FocusedElement>
                </span>

                <span ref={(r) => socialIconsRef.current[1] = r} className={`${componentName}_socialIcon`}>
                    <FocusedElement onFocusChange={onFocus} className={`${componentName}_link`}>
                        <a href="https://twitter.com/threstle" target="_blank">
                            <svg viewBox="328 355 335 276" xmlns="http://www.w3.org/2000/svg"><path d="M 630, 425 A 195, 195 0 0 1 331, 600 A 142, 142 0 0 0 428, 570 A  70,  70 0 0 1 370, 523 A  70,  70 0 0 0 401, 521 A  70,  70 0 0 1 344, 455 A  70,  70 0 0 0 372, 460 A  70,  70 0 0 1 354, 370 A 195, 195 0 0 0 495, 442 A  67,  67 0 0 1 611, 380 A 117, 117 0 0 0 654, 363 A  65,  65 0 0 1 623, 401 A 117, 117 0 0 0 662, 390 A  65,  65 0 0 1 630, 425 Z" /></svg>
                        </a>
                    </FocusedElement>
                </span>

                <span ref={(r) => socialIconsRef.current[2] = r} className={`${componentName}_socialIcon`}>
                    <FocusedElement onFocusChange={onFocus} className={`${componentName}_link`}>
                        <a href="https://www.linkedin.com/in/etienne-chaumont-56175951/" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                    </FocusedElement>
                </span>
            </div>
        </div>
    </div>;
};

export default App;

