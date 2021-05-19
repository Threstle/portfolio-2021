import React, { useEffect, useRef, useState } from "react";
import "./twitterIcon.less";

interface IProps { }

const componentName = "TwitterIcon";

/**
 * @name TwitterIcon
 */
function TwitterIcon(props: IProps) {

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE



    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div className={componentName}>
        <svg viewBox="328 355 335 276" xmlns="http://www.w3.org/2000/svg">
            <path d="
            M 630, 425
            A 195, 195 0 0 1 331, 600
            A 142, 142 0 0 0 428, 570
            A  70,  70 0 0 1 370, 523
            A  70,  70 0 0 0 401, 521
            A  70,  70 0 0 1 344, 455
            A  70,  70 0 0 0 372, 460
            A  70,  70 0 0 1 354, 370
            A 195, 195 0 0 0 495, 442
            A  67,  67 0 0 1 611, 380
            A 117, 117 0 0 0 654, 363
            A  65,  65 0 0 1 623, 401
            A 117, 117 0 0 0 662, 390
            A  65,  65 0 0 1 630, 425
            Z"/>
        </svg>
    </div>;
};

export default TwitterIcon;
