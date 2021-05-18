uniform sampler2D uDisplacementTexture;
uniform sampler2D uDomTexture;

varying float vHeight;
varying vec2 vUv;


void main()
{
     vec4 textCoord = texture2D(uDomTexture,vUv);
     vec4 displacementTextCoord = texture2D(uDisplacementTexture,vUv);

     textCoord.x +=displacementTextCoord.r*0.5;
     textCoord.y +=displacementTextCoord.r*0.9;
     textCoord.z +=displacementTextCoord.r*0.1;

     //vec4 finalColor = mix(vec4(1.0),textCoord,displacementTextCoord.r);

     gl_FragColor = textCoord;

}