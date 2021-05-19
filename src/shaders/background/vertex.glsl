uniform sampler2D uDisplacementTexture;
uniform float uDisplacementAmount;

varying float vHeight;
varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    vec4 textCoord = texture2D(uDisplacementTexture,uv);


    modelPosition.z += textCoord.r*uDisplacementAmount;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    //Don't display white vertices
    textCoord.r = 1.0-step(0.95,1.0 - textCoord.r);

    gl_Position = projectedPosition;
    gl_PointSize =4.0*textCoord.r;

    vHeight = modelPosition.z;

    vUv = uv;
}