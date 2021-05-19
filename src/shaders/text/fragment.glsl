uniform sampler2D uDisplacementTexture;
uniform sampler2D uDomTexture;
uniform vec3 uDisplacedColor;

varying vec2 vUv;


void main()
{
     vec4 textCoord = texture2D(uDomTexture,vUv);
     vec4 displacementTextCoord = texture2D(uDisplacementTexture,vUv);

     // Pas sur que la transparence soit un gain de performance
          float alpha = step(0.99,textCoord.r);

     // On modifie la couleur en fonction du displacement
     textCoord.x +=displacementTextCoord.r*uDisplacedColor.r;
     textCoord.y +=displacementTextCoord.r*uDisplacedColor.g;
     textCoord.z +=displacementTextCoord.r*uDisplacedColor.b;

     gl_FragColor = vec4(textCoord.xyz,1.0-alpha);

}