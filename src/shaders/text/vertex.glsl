#define PI 3.1415926535897932384626433832795

uniform sampler2D uDisplacementTexture;
uniform sampler2D uDomTexture;
uniform float uDisplacementAmount;
uniform float uPointSize;
varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // On récupère les coordonnées de la texture dom et de la texture interactive    
    vec4 displacementTextCoord = texture2D(uDisplacementTexture,uv);
    vec4 textCoord = texture2D(uDomTexture,uv);

    float randAngle = random(uv)*PI*2.0;
    modelPosition.y += cos(randAngle)*displacementTextCoord.r*uDisplacementAmount;
    modelPosition.x += sin(randAngle)*displacementTextCoord.r*uDisplacementAmount;
    modelPosition.z += sin(randAngle)*displacementTextCoord.r*uDisplacementAmount;

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uPointSize*randAngle;
    
    vUv = uv;

}