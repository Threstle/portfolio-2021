uniform sampler2D uDisplacementTexture;
uniform float uDisplacementAmount;

varying float vDisplacement;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    
    vec4 textCoord = texture2D(uDisplacementTexture,uv);

    modelPosition.z += textCoord.r*uDisplacementAmount;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vDisplacement = modelPosition.z;

}