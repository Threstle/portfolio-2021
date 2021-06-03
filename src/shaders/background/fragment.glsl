varying float vHeight;
varying vec2 vUv;
uniform float uTime;

void main()
{
 
     float normalizedHeight = vHeight*5.0; 

     gl_FragColor = vec4(1.0-normalizedHeight*vUv.y*sin(uTime),1.0-normalizedHeight*1.0*vUv.x*sin(uTime*0.7),1.0-normalizedHeight*vUv.y*sin(0.4),normalizedHeight);

}