import * as THREE from 'three';
import * as dat from 'dat.gui'
import { Texture, Vector2 } from 'three';
import Gui, { GuiDisplacementTexture } from '../helpers/Gui';

export default class InteractiveTexture {

	public canvas: HTMLCanvasElement;

	protected ctx: CanvasRenderingContext2D;

	protected size: Vector2;

	protected particleTab: Particle[];

	protected oldMouse: Vector2;

	protected debugPanel: boolean;

	protected isFocused:boolean = false;

	protected params: {
		maxAge: number;
		size: number;
		maxSize: number
		maxParticles: number;
		velocityInfluence: number;
		intensity: number;
	};

	public texture: Texture;

	constructor(pSize: Vector2) {

		this.size = pSize;

		this.initTexture();

		this.particleTab = [];

		this.oldMouse = null;

		// Debug
		this.params = {
			maxAge: 109,
			size: 500,
			maxSize: 10,
			maxParticles: 600,
			velocityInfluence: 0.6,
			intensity: 0.164
		}

		GuiDisplacementTexture.add(this.params, "maxAge", 5, 500, 1);
		GuiDisplacementTexture.add(this.params, "size", 10, 2000, 1);
		GuiDisplacementTexture.add(this.params, "maxSize", 0.1, 50, 1);
		GuiDisplacementTexture.add(this.params, "maxParticles", 50, 1500, 1);
		GuiDisplacementTexture.add(this.params, "velocityInfluence", 0, 2, 0.01);
		GuiDisplacementTexture.add(this.params, "intensity", 0.01, 1, 0.001);

	}

	initTexture() {
		this.canvas = document.createElement('canvas');

		this.resize(this.size);

		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.texture = new THREE.Texture(this.canvas);

		this.canvas.id = 'touchTexture';

		this.canvas.style.float = "right";
		this.canvas.style.marginTop = "20px";


	}

	update(pMouse: Vector2) {

		if (!pMouse) return;

		this.ctx.fillStyle = 'rgba(0, 0, 0, .05)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
		this.processParticleArray(this.particleTab);

		let delta = this.oldMouse?.distanceTo(pMouse) || 0;
		if (this?.oldMouse?.x == 0 && this?.oldMouse?.y == 0 || pMouse.x == 0 && pMouse.y == 0) delta = 0;

		if(this.isFocused)delta += 0.001;

		if (this.particleTab.length < this.params.maxParticles && delta > 0) {
			
			this.particleTab.push(this.createParticle(pMouse,delta));
		};

		this.texture.needsUpdate = true;
		if (!this.oldMouse) this.oldMouse = new Vector2(0, 0);
		this.oldMouse.set(pMouse.x, pMouse.y);
	}

	public resize(pSize:Vector2){
		this.size = pSize;

		this.canvas.width = this.size.width;
		this.canvas.height = this.size.height;
		this.canvas.style.width = `${this.canvas.width}px`;
		this.canvas.style.height = `${this.canvas.height}px`;
	}

	processParticleArray(pArray:Particle[]){
		pArray.forEach((particle, index) => {
			if (particle.isTooOld()) {
				pArray.splice(index, 1);

			}
			else {
				particle.draw(this.ctx);
			}


		})
	}

	createParticle(pPosition:Vector2,pDelta:number){
		return new Particle(
			new Vector2(
				pPosition.x * this.size.width + Math.random() * 10,
				pPosition.y * this.size.height + Math.random() * 10
			),
			Math.min(this.params.size * Math.min(pDelta * this.params.velocityInfluence, 0.1),this.params.maxSize),
			this.params.maxAge,
			this.params.intensity
		)
	}

	clear() {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	public setFocus(pBoolean:boolean)
	{
		this.isFocused = pBoolean;
	}

}

class Particle {

	private size: number;
	private age: number;
	private maxAge: number;
	private position: Vector2;
	private intensity: number;

	constructor(pPosition: Vector2, pSize: number = 10, pMaxAge: number = 250, pIntensity: number = 0.01) {

		this.size = pSize;
		this.age = Date.now();
		this.maxAge = pMaxAge * 2;
		this.position = pPosition;
		this.intensity = pIntensity;
	}

	draw(pCtx: CanvasRenderingContext2D) {

		let ageValue = Date.now() - this.age;
		const ageAmp = Math.abs(Math.sin(ageValue / this.maxAge));

		pCtx.beginPath();
		pCtx.fillStyle = `rgba(255,0,0,${ageAmp * this.intensity})`;
		pCtx.moveTo(this.position.x, this.position.y);
		pCtx.arc(this.position.x, this.position.y, this.size * ageAmp, 0, Math.PI * 2, true);
		pCtx.fill();
	}



	isTooOld() {
		return Date.now() - this.age > this.maxAge * 3
	}

}