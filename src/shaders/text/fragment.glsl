uniform sampler2D uDisplacementTexture;
uniform vec3 uDisplacedColor;
uniform float uTime;

varying vec2 vUv;
varying vec3 vColor;


void main()
{
     vec4 textCoord = vec4(vColor,1.0);
     vec4 displacementTextCoord = texture2D(uDisplacementTexture,vUv);

     // Si c'est blanc on affiche pas
     //float alpha = step(0.999,textCoord.r);
     float alpha = step(0.1,displacementTextCoord.r);
     // On modifie la couleur en fonction du displacement
     textCoord.x +=displacementTextCoord.r*uDisplacedColor.r;
     textCoord.y +=displacementTextCoord.r*uDisplacedColor.g;
     textCoord.z +=displacementTextCoord.r*uDisplacedColor.b;


     gl_FragColor = vec4(textCoord.xyz,alpha);

}