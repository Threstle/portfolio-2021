uniform float uTime;
uniform sampler2D uDisplacementTexture;
uniform sampler2D uDomTexture;

varying float vHeight;
varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    vec4 displacementTextCoord = texture2D(uDisplacementTexture,uv);
    vec4 textCoord = texture2D(uDisplacementTexture,uv);


    modelPosition.z += displacementTextCoord.r*0.5;
    //modelPosition.y += textCoord.r*0.2;
    //modelPosition.z += textCoord.r*0.2;

    float pointSize = mix(0.5,2.0+displacementTextCoord.r*10.0,textCoord.r);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
         gl_PointSize = pointSize;

    vHeight = modelPosition.z;

    vUv = uv;
}