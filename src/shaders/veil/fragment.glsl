varying float vDisplacement;

void main()
{
     float alpha = step(0.1,vDisplacement);
     gl_FragColor = vec4(alpha*20.0);

}