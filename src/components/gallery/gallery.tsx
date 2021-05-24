import React, { useEffect, useRef, useState } from "react";
import { Vector2 } from "three";
import "./gallery.less";
import gsap, { Quint } from "gsap";
import { shuffle } from "../../lib/utils/ArrayUtils";

const experience1Video = require('../../static/videos/experience1.mp4');
const experience2Video = require('../../static/videos/experience2.mp4');
const experience3Video = require('../../static/videos/experience3.mp4');
const experience4Video = require('../../static/videos/experience4.mp4');

interface IProps {
    className?: string;
    animTrigger: boolean,
    isVisible: boolean,
}

const componentName = "Gallery";

/**
 * @name Gallery
 */
function Gallery(props: IProps) {

    const rootRef = useRef<HTMLDivElement>(null);

    const bordersRef = useRef([]);

    const blockRef = useRef([]);

    useEffect(() => {
        if (!props.animTrigger) return;

        const shuffledTab = shuffle(blockRef.current);

        shuffledTab.forEach((pBlock, pIndex) => {
            gsap.to(pBlock, {
                opacity: 1,
                duration: 1,
                delay: (pIndex * 0.1) + 1,
                ease: Quint.easeInOut
            })
        });

        bordersRef.current.forEach((pBorder, pIndex) => {
            gsap.to(pBorder, {
                duration: 0.3,
                scaleX: 1,
                scaleY: 1,
                delay: pIndex * 0.4
            })
        })

    }, [props.animTrigger])

    useEffect(() => {

        if (props.isVisible) return;

        blockRef.current.forEach((pBlock, index) => {
            gsap.set(pBlock, { opacity: 0 });
        })

        bordersRef.current.forEach((pBorder, index) => {

            const borderDirection = index % 2 == 0 ? { scaleY: 0 } : { scaleX: 0 }
            gsap.set(pBorder, borderDirection);
        })

    }, [props.isVisible])

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div
        ref={rootRef}
        className={`${componentName} ${props.className}`}
    >
        <span ref={(r) => bordersRef.current[0] = r} className={`${componentName}_border ${componentName}_border-left`} />
        <span ref={(r) => bordersRef.current[1] = r} className={`${componentName}_border ${componentName}_border-top`} />
        <span ref={(r) => bordersRef.current[2] = r} className={`${componentName}_border ${componentName}_border-right`} />
        <span ref={(r) => bordersRef.current[3] = r} className={`${componentName}_border ${componentName}_border-bottom`} />

        <div className={`${componentName}_container`}>
            <div ref={(r) => blockRef.current[0] = r} className={`${componentName}_galleryItem`} ></div>
            <div ref={(r) => blockRef.current[1] = r} className={`${componentName}_galleryItem`} >
                <video className={`${componentName}_galleryItem`} autoPlay={true} playsInline={true} muted={true} loop={true} src={experience1Video.default} />
            </div>
            <div ref={(r) => blockRef.current[2] = r} className={`${componentName}_galleryItem`} ></div>
            <div ref={(r) => blockRef.current[3] = r} className={`${componentName}_galleryItem`} ></div>
            <div ref={(r) => blockRef.current[4] = r} className={`${componentName}_galleryItem`} ></div>
            <div ref={(r) => blockRef.current[5] = r} className={`${componentName}_galleryItem`} ></div>
            <video ref={(r) => blockRef.current[6] = r} className={`${componentName}_galleryItem`} autoPlay={true} playsInline={true} muted={true} loop={true} src={experience3Video.default} />
            <div ref={(r) => blockRef.current[7] = r} className={`${componentName}_galleryItem`} ></div>
            <video ref={(r) => blockRef.current[8] = r} className={`${componentName}_galleryItem`} autoPlay={true} playsInline={true} muted={true} loop={true} src={experience4Video.default} />
        </div>
    </div>
};

export default Gallery;
