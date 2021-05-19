uniform sampler2D uDisplacementTexture;
uniform sampler2D uDomTexture;
uniform float uDisplacementAmount;

varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // On récupère les coordonnées de la texture dom et de la texture interactive    
    vec4 displacementTextCoord = texture2D(uDisplacementTexture,uv);
    vec4 textCoord = texture2D(uDomTexture,uv);

    // On displace les vertex en fonction de la texture de displacement et on cache les points sur les zones blanches
    modelPosition.z += displacementTextCoord.r*uDisplacementAmount;
    modelPosition.x += displacementTextCoord.r*uDisplacementAmount*0.4;
    modelPosition.y -= displacementTextCoord.r*uDisplacementAmount*0.2;

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}