
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import html2canvas from 'html2canvas';

//@ts-ignore
import backgroundFragmentShader from '../shaders/background/fragment.glsl';
//@ts-ignore
import backgroundVertexShader from '../shaders/background/vertex.glsl';

//@ts-ignore
import textFragmentShader from '../shaders/text/fragment.glsl';

//@ts-ignore
import textVertexShader from '../shaders/text/vertex.glsl';

import { Clock, Object3D, PerspectiveCamera, Points, Scene, Vector2, WebGLRenderer } from 'three';
import InteractiveTexture from './InteractiveTexture';


export default class InteractiveScene {

    private sizes:Vector2;
    private aspectRatio:number;
    private interactiveTexture:InteractiveTexture;
    private renderer:WebGLRenderer;
    private scene:Scene;
    private mouse:Vector2 = new Vector2(0,0);
    private camera:PerspectiveCamera;
    private clock:Clock;

    private controls:OrbitControls;

    private cloudPlane:Points;

    constructor(
        pCanvas:HTMLCanvasElement,
        pSizes:Vector2,
        pDom:HTMLElement,
        pPixelRatio:number = Math.min(window.devicePixelRatio, 2)
    )
    {
        this.sizes = pSizes;
        this.aspectRatio = this.sizes.x/this.sizes.y;
        
        this.scene = new Scene();
 
        this.renderer = new WebGLRenderer({
            canvas: pCanvas
        })

        this.renderer.setSize(this.sizes.x, this.sizes.y)
        this.renderer.setPixelRatio(pPixelRatio)
        this.renderer.setClearColor(new THREE.Color( 0xFFFFFF ));

        this.camera = new THREE.PerspectiveCamera(75, this.sizes.x / this.sizes.y, 0.1, 100)
        this.camera.position.set(0, 0, 3);
        this.scene.add(this.camera);
        
        // Controls
        this.controls = new OrbitControls(this.camera, pCanvas);
        this.controls.enableDamping = true

        
        // Listeners
        window.addEventListener("mousemove",this.onMouseMove.bind(this));

        this.interactiveTexture = new InteractiveTexture(new Vector2(
            this.sizes.x/10,
            this.sizes.y/10
        ));

        this.cloudPlane = this.createCloudPlane();

        this.createDomPlane(pDom)

        //Launch animation loop
        this.clock = new Clock();

        this.tick();

    }

    // Create objects

    createCloudPlane()
    {
        const geometry = new THREE.PlaneGeometry(this.sizes.x*0.004, this.sizes.y*0.004, 512, 512)

        // Material
        const material = new THREE.ShaderMaterial({
            vertexShader: backgroundVertexShader,
            fragmentShader: backgroundFragmentShader,
            uniforms:
            {
                uTime: { value: 0 },
                uMouse: {value:new THREE.Vector2(0,0)},
                uSpherePosition:{value: new THREE.Vector3(0,0,0)},
                uHorizontalDisplacementIntensity:{value:0.019},
                uVerticalDisplacementIntensity:{value:0.1},
                uDisplacementTexture:{value:this.interactiveTexture.texture}
                
            }
        });

        // Mesh
        const mesh = new THREE.Points(geometry, material);

        this.scene.add(mesh);

        this.moveMeshInFrontOfCamera(mesh,this.camera,this.sizes.y);

        return mesh;
    }

    createDomPlane(pDomElement:HTMLElement)
    {
            html2canvas(pDomElement).then(domCanvas => {
                const domTexture = new THREE.Texture(domCanvas);
                domTexture.needsUpdate = true;
                //document.body.append(domCanvas);
                setTimeout(()=>pDomElement.style.display = "none",1000);
                //document.querySelector(".Content").remove();
                
                const domGeometry = new THREE.PlaneGeometry(this.sizes.width*0.004, this.sizes.height*0.004, 256, 256);
                // Material
                const domMaterial = new THREE.ShaderMaterial({
                    transparent:true,
                    vertexShader: textVertexShader,
                    fragmentShader: textFragmentShader,
                    uniforms:
                    {
                        uTime: { value: 0 },
                        uMouse: {value:new THREE.Vector2(0,0)},
                        uDisplacementTexture:{value:this.interactiveTexture.texture},
                        uDomTexture:{value:domTexture}
                        
                    }
                })
        
                const domMesh = new THREE.Points(domGeometry,domMaterial);
                this.scene.add(domMesh);
            });
    }

    // Animations

    tick()
    {
        const elapsedTime = this.clock.getElapsedTime()
    
        // Update material
       // this.cloudPlane.material.uniforms.uTime.value = elapsedTime
        this.interactiveTexture.update(this.mouse);
    
        // Update controls
        this.controls.update()
    
        // Render
        this.renderer.render(this.scene, this.camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick.bind(this))
    }

    // Utils

    // By ayamflow https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f
    moveMeshInFrontOfCamera(pMesh:Object3D,pCamera:PerspectiveCamera,pHeight:number)
    {
        let dist = pCamera.position.z - pMesh.position.z;
        let height = pHeight/250;
        pCamera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
        pCamera.updateProjectionMatrix();
    }

    // Handlers

    onMouseMove(e:any){

        this.mouse.set(
            e.clientX/this.sizes.x,
            e.clientY/this.sizes.y
        );

    }

    onResize(pSize:Vector2){

        this.sizes = pSize;
        this.aspectRatio = this.sizes.x/this.sizes.y;

        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(this.sizes.width, this.sizes.height)
    }
}

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


/*
setTimeout(()=>{
    html2canvas(document.querySelector(".Content")).then(domCanvas => {
        const domTexture = new THREE.Texture(domCanvas);
        domTexture.needsUpdate = true;
        //document.body.append(domCanvas);
        document.querySelector(".Content").remove();
        
        const domGeometry = new THREE.PlaneGeometry(sizes.width*0.004, sizes.height*0.004, 256, 256);
        // Material
        const domMaterial = new THREE.ShaderMaterial({
            transparent:true,
            vertexShader: textVertexShader,
            fragmentShader: textFragmentShader,
            uniforms:
            {
                uTime: { value: 0 },
                uMouse: {value:new THREE.Vector2(0,0)},
                uDisplacementTexture:{value:interactiveTexture.texture},
                uDomTexture:{value:domTexture}
                
            }
        })

        const domMesh = new THREE.Points(domGeometry,domMaterial);
        scene.add(domMesh);
    });
},1000);*/


