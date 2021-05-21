import React, { useEffect, useRef, useState } from "react";
import { Vector2 } from "three";
import "./gallery.less";

const experience1Video = require('../../static/videos/experience1.mp4');
const experience2Video = require('../../static/videos/experience2.mp4');
const experience3Video = require('../../static/videos/experience3.mp4');
const experience4Video = require('../../static/videos/experience4.mp4');

interface IProps {
    className?: string;
}

const componentName = "Gallery";

/**
 * @name Gallery
 */
function Gallery(props: IProps) {

    const rootRef = useRef<HTMLDivElement>(null);

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div
        ref={rootRef}
        className={`${componentName} ${props.className}`}
        >
            <span className={`${componentName}_galleryItem`} />
            <video className={`${componentName}_galleryItem`} autoPlay={true} playsInline={true} muted={true} loop={true} src={experience1Video.default} />
            <span className={`${componentName}_galleryItem`} />
            <span className={`${componentName}_galleryItem`} />
            <span className={`${componentName}_galleryItem`} />
            <span className={`${componentName}_galleryItem`} />
            <video className={`${componentName}_galleryItem`} autoPlay={true} playsInline={true} muted={true} loop={true} src={experience2Video.default} />
            <span className={`${componentName}_galleryItem`} />
            <video className={`${componentName}_galleryItem`} autoPlay={true} playsInline={true} muted={true} loop={true} src={experience3Video.default} />
            <span className={`${componentName}_galleryItem`} />
            <span className={`${componentName}_galleryItem`} />
            <video className={`${componentName}_galleryItem`} autoPlay={true} playsInline={true} muted={true} loop={true} src={experience4Video.default} />
    </div>
};

export default Gallery;
