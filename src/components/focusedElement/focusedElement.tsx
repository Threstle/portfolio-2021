import React, { useEffect, useRef, useState } from "react";
import { Vector2 } from "three";
import "./focusedElement.less";

interface IProps {
    children: React.ReactNode;
    className?:string;
    onFocusChange?: (pFocus: boolean, pPosition?: Vector2) => void
}

const componentName = "FocusedElement";

/**
 * @name FocusedElement
 */
function FocusedElement(props: IProps) {

    const rootRef = useRef<HTMLDivElement>(null);

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

    // -------------------–-------------------–-------------------–--------------- RENDER

    return <span
        ref={rootRef}
        className={`${componentName} ${props.className}`}
        onMouseEnter={
            () => {
                const boundingBox = rootRef.current.getBoundingClientRect()
                const pos = new Vector2(boundingBox.x, boundingBox.y);
                props.onFocusChange(true, pos);
            }
        }
        onMouseLeave={
            () => {
                props.onFocusChange(false);
            }
        }>
        {props.children}
    </span>;
};

export default FocusedElement;
