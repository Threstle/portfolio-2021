varying float vHeight;
varying vec2 vUv;


void main()
{
 
     float normalizedHeight = vHeight*5.0; 

     gl_FragColor = vec4(1.0-normalizedHeight*vUv.y,1.0-normalizedHeight*1.0*vUv.x,1.0-normalizedHeight*vUv.y,1.0);

}