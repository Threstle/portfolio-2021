import * as THREE from 'three';
import * as dat from 'dat.gui'
import { Texture, Vector2 } from 'three';

export default class InteractiveTexture {

    protected canvas:HTMLCanvasElement;

    protected ctx:CanvasRenderingContext2D;

    protected size:Vector2;

    protected particleTab:Particle[];

    protected oldMouse:Vector2;

    protected params:{
        maxAge:number;
        size:number;
        maxParticles:number
    };

    public texture:Texture;

	constructor(pSize:Vector2) {

		this.size = pSize;

		this.initTexture();

		this.particleTab = [];

		this.oldMouse = new Vector2(0,0);

        //TODO: passer debug en singleton
		// Debug
		this.params = {
			maxAge:250,
			size:500,
			maxParticles:600
		}

	}

	initTexture() {
		this.canvas = document.createElement('canvas');
		
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.texture = new THREE.Texture(this.canvas);

		this.canvas.id = 'touchTexture';
		this.canvas.style.width = `${this.canvas.width}px`;
		this.canvas.style.height = `${this.canvas.height}px`;
        
        this.canvas.style.position="absolute";
        this.canvas.style.zIndex="11";
		this.canvas.style.bottom="50px";

        document.body.append(this.canvas);
    }

	update(pMouse:Vector2) {
		
		if(!pMouse)return;

		this.ctx.fillStyle = 'rgba(0, 0, 0, .05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.particleTab.forEach((particle,index)=>{
			if(particle.isTooOld()){
				this.particleTab.splice(index,1);
				
			}
			else
			{
					particle.draw(this.ctx);
			}
			
			
		})
		let delta = this.oldMouse.distanceTo(pMouse);
        
		if(this.particleTab.length < this.params.maxParticles && delta > 0){
			this.particleTab.push(new Particle(new Vector2(
			pMouse.x * this.size.width+Math.random()*10,
			pMouse.y * this.size.height+Math.random()*10
		),
		Math.min(this.params.size*delta,10),
		this.params.maxAge
		))};

		this.texture.needsUpdate = true;

        this.oldMouse.set(pMouse.x,pMouse.y);
	}

	clear() {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

}

class Particle {
	
    private size:number;
    private age:number;
    private maxAge:number;
    private position:Vector2;

	constructor (pPosition:Vector2,pSize:number = 10,pMaxAge:number = 250){
		
        this.size = pSize;
		this.age = Date.now();
		this.maxAge = pMaxAge * 2;
		this.position = pPosition;
	}

	draw (pCtx:CanvasRenderingContext2D){

		let ageValue = Date.now() - this.age;
		const ageAmp = Math.abs(Math.sin(ageValue/this.maxAge));

		pCtx.beginPath();
		pCtx.fillStyle = `rgba(255,0,0,${ageAmp*0.05})`;
		pCtx.moveTo(this.position.x, this.position.y);
		pCtx.arc(this.position.x, this.position.y, this.size*ageAmp , 0, Math.PI*2, true);
		pCtx.fill();
	}



	isTooOld(){
		return Date.now() - this.age > this.maxAge * 3
	}

}