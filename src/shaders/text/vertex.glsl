uniform float uTime;
uniform sampler2D uDisplacementTexture;

varying float vHeight;
varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    vec4 textCoord = texture2D(uDisplacementTexture,uv);


    modelPosition.z += textCoord.r*0.2;
    //modelPosition.y += textCoord.r*0.2;
    //modelPosition.z += textCoord.r*0.2;

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
         gl_PointSize = 2.0;

    vHeight = modelPosition.z;

    vUv = uv;
}