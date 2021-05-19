import * as dat from 'dat.gui';

const Gui = new dat.GUI();

export const GuiSceneFolder = Gui.addFolder('WebGL Scene');
export const GuiSmokeShader = Gui.addFolder('Smoke Shader');
export const GuiTextShader = Gui.addFolder('Text Shader');
export const GuiDisplacementTexture = Gui.addFolder('Displacement texture');
export default Gui;