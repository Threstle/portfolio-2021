import React, { useEffect, useRef, useState } from "react";
import "./splittedText.less";
import gsap, { Quint } from "gsap";


interface IProps {
    className?: string;
    text:string;
    isVisible:boolean;
}

const componentName = "SplittedText";

/**
 * @name SplittedText
 */
function SplittedText(props: IProps) {

    const rootRef = useRef<HTMLDivElement>(null);

    const lettersRef = useRef([]);

    const [letters,setLetters] = useState<string[]>([]);

    useEffect(()=>{

        setLetters(props.text.split(""));

    },[props.text])

    useEffect(()=>{
        if(props.isVisible)
        {
            setTimeout(()=>{
                console.log(letters,lettersRef);
                lettersRef.current.forEach((pLetter,index)=>{
                    console.log(pLetter)
                    gsap.fromTo(pLetter,{
                        y:"110%"
                    },{
                        y:"0%",
                        duration:1,
                        delay:index*0.1,
                        ease:Quint.easeInOut
                    })
                })
        
            },3000);
        }


    },[props.isVisible])

    // -------------------–-------------------–-------------------–--------------- REGISTER PAGE

    // -------------------–-------------------–-------------------–--------------- RENDER

    return <div
        ref={rootRef}
        className={`${componentName} ${props.className}`}
    >
        {
            letters.map((letter,index)=>{
                return <span ref={(r) => lettersRef.current[index] = r} key={index}>{letter}</span>
            })
        }
    </div>
};

export default SplittedText;
