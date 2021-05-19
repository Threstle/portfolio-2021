
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

import { Clock, Mesh, Object3D, PerspectiveCamera, Points, Scene, Texture, Vector2, WebGLRenderer } from 'three';
import InteractiveTexture from './InteractiveTexture';
import Gui, { GuiSceneFolder, GuiSmokeShader, GuiTextShader } from '../helpers/Gui';


export default class InteractiveScene {

    private sizes: Vector2;
    private aspectRatio: number;
    private interactiveTexture: InteractiveTexture;
    private renderer: WebGLRenderer;
    private scene: Scene;
    private mouse: Vector2 = new Vector2(0, 0);
    private camera: PerspectiveCamera;
    private clock: Clock;

    private controls: OrbitControls;

    private smokePlane: Points;
    private domPlane: Mesh;

    private params: {
        backgroundColor: string;
        textColor: string;
        alpha: number;
    }

    constructor(
        pCanvas: HTMLCanvasElement,
        pSizes: Vector2,
        pDom: HTMLElement,
        pPixelRatio: number = Math.min(window.devicePixelRatio, 2),
    ) {
        this.params = {
            backgroundColor: "#FFFFFF",
            alpha: 0,
            textColor: "#7FE519",
        };

        this.sizes = pSizes;
        this.aspectRatio = this.sizes.x / this.sizes.y;

        this.scene = new Scene();

        this.renderer = new WebGLRenderer({
            canvas: pCanvas,
            alpha: true
        });

        this.renderer.setSize(this.sizes.x, this.sizes.y);
        this.renderer.setPixelRatio(pPixelRatio);
        this.renderer.setClearColor(0x000000, this.params.alpha);

        this.camera = new THREE.PerspectiveCamera(75, this.sizes.x / this.sizes.y, 0.1, 100);
        this.camera.position.set(0, 0, 3);
        this.scene.add(this.camera);

        // Controls
        //this.controls = new OrbitControls(this.camera, pCanvas);
        //this.controls.enableDamping = true


        // Listeners
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("touchmove", this.onMouseMove.bind(this));
        window.addEventListener("touchstart", this.onMouseMove.bind(this));
        window.addEventListener("touchend", this.onTouchEnd.bind(this));

        this.interactiveTexture = new InteractiveTexture(new Vector2(
            this.sizes.x / 10,
            this.sizes.y / 10
        ));

        this.smokePlane = this.createSmokePlane();

        this.domPlane = this.createDomPlane(pDom);

        //Launch animation loop
        this.clock = new Clock();

        this.tick();

        this.initDebugPanel();

        document.querySelector('.dg.main.a').append(this.interactiveTexture.canvas);

    }

    // Create objects

    createSmokePlane() {
        const geometry = new THREE.PlaneGeometry(this.sizes.x * 0.004, this.sizes.y * 0.004, 128, 128)

        // Material
        const material = new THREE.ShaderMaterial({
            vertexShader: backgroundVertexShader,
            fragmentShader: backgroundFragmentShader,
            uniforms:
            {
                uTime: { value: 0 },
                uDisplacementAmount: { value: 0.48 },
                uDisplacementTexture: { value: this.interactiveTexture.texture }

            }
        });

        // Mesh
        const mesh = new Points(geometry, material);

        this.scene.add(mesh);

        this.moveMeshInFrontOfCamera(mesh, this.camera, this.sizes.y);

        return mesh;
    }

    createDomPlane(pDomElement: HTMLElement) {
        const domGeometry = new THREE.PlaneGeometry(this.sizes.width * 0.004, this.sizes.height * 0.004, 256, 256);
        // Material
        const domMaterial = new THREE.ShaderMaterial({
            transparent: true,
            vertexShader: textVertexShader,
            fragmentShader: textFragmentShader,
            uniforms:
            {
                uDisplacementTexture: { value: this.interactiveTexture.texture },
                uDomTexture: { value: new Texture() },
                uDisplacedColor: { value: new THREE.Color(this.params.textColor) },
                uDisplacementAmount: { value: 0.311 },
                uTime: { value: 0 }

            }
        })
        const domMesh = new THREE.Mesh(domGeometry, domMaterial);
        this.scene.add(domMesh);

        this.updateDomTexture(pDomElement);

        return domMesh;

    }

    updateDomTexture(pDomElement: HTMLElement) {

        //Hack pour afficher les éléments SVG. Isabella Lopes : https://stackoverflow.com/questions/32481054/svg-not-displayed-when-using-html2canvas
        var svgElements = pDomElement.querySelectorAll('svg');
        svgElements.forEach(function (item: any) {
            item.setAttribute("width", item.getBoundingClientRect().width);
            item.setAttribute("height", item.getBoundingClientRect().height);
            item.style.width = null;
            item.style.height = null;
        });

        html2canvas(pDomElement).then(domCanvas => {

            const domTexture = new THREE.Texture(domCanvas);

            domTexture.needsUpdate = true;
            //  pDomElement.style.display = "none";

            domTexture.magFilter = THREE.NearestFilter;
            //domTexture.generateMipmaps = false;

            //@ts-ignore
            this.domPlane.material.uniforms.uDomTexture.value = domTexture;

            document.querySelector('.dg.main.a').append(domCanvas);

        });
    }

    // Animations

    tick() {
        const elapsedTime = this.clock.getElapsedTime()

        // Update material
        //@ts-ignore
        this.smokePlane.material.uniforms.uTime.value = elapsedTime
        //@ts-ignore
        this.domPlane.material.uniforms.uTime.value = elapsedTime
        this.interactiveTexture.update(this.mouse);

        // Update controls
        //this.controls.update()

        // Render
        this.renderer.render(this.scene, this.camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick.bind(this))
    }

    // Utils

    // By ayamflow https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f
    moveMeshInFrontOfCamera(pMesh: Object3D, pCamera: PerspectiveCamera, pHeight: number) {
        let dist = pCamera.position.z - pMesh.position.z;
        let height = pHeight / 250;
        pCamera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
        pCamera.updateProjectionMatrix();
    }

    initDebugPanel() {



        GuiSceneFolder.addColor(this.params, "backgroundColor").onChange((pColor) => {
            this.renderer.setClearColor(pColor)
            this.renderer.setClearAlpha(this.params.alpha)
        });
        GuiSceneFolder.add(this.params, 'alpha', 0, 1, 0.01).onChange((pAlpha) => {
            this.renderer.setClearAlpha(pAlpha)
        })

        //@ts-ignore
        GuiSmokeShader.add(this.smokePlane.material.uniforms.uDisplacementAmount, 'value', 0.01, 1.0, 0.001).name('displacement');

        GuiTextShader.addColor(this.params, 'textColor').onChange((pColor) => {
            //@ts-ignore
            this.domPlane.material.uniforms.uDisplacedColor.value = new THREE.Color(pColor);
        })

        //@ts-ignore
        GuiTextShader.add(this.domPlane.material.uniforms.uDisplacementAmount, 'value', 0.0, 2.0, 0.001).name('displacement');
    }

    // Handlers

    onMouseMove(e: any) {

        if (!e?.clientX) {
            e.clientX = e?.touches[0]?.clientX;
            e.clientY = e?.touches[0]?.clientY;
        }

        this.mouse.set(
            e?.clientX / this.sizes.x,
            e?.clientY / this.sizes.y
        );

    }

    onTouchEnd() {
        this.mouse.set(0, 0);
    }

    onResize(pSize: Vector2) {

        this.sizes = pSize;
        this.aspectRatio = this.sizes.x / this.sizes.y;

        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(this.sizes.width, this.sizes.height)
    }
}
