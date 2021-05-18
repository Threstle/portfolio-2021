import React, {useEffect, useRef, useState} from "react";
import './app.less';

interface IProps {}

const componentName = "App";

/**
 * @name HomePage
 */
function App (props: IProps) {

    // get root ref
    const rootRef = useRef<HTMLDivElement>(null);


    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE



    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div className={componentName} ref={rootRef}>
        <h1>Webpack base</h1>
    </div>;
};

export default App;
