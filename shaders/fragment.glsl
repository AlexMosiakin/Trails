uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));

  float a = 1. - smoothstep(0.,0.5, d);

  gl_FragColor = vec4(1.,0.1,0.35,a);
}
