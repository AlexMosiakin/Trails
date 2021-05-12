uniform float time;
varying vec2 vUv;
varying vec2 vUv1;
varying vec4 vPosition;
varying float vAlpha;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;
uniform vec2 uMouse;

attribute float angle;
attribute float life;
attribute float offset;

void main(){
 vUv = uv;

 float current = mod(offset + time/5.,life);
 float percent = current/life;

 vec3 newpos = position;

 vAlpha = smoothstep(0.,0.05,percent);

 vAlpha -= smoothstep(0.85,1.,percent);

 float dir = angle + sin(time/100.);

 newpos.x += cos(dir)*current*0.2;
 newpos.y += sin(dir)*current*0.2;

 //vec3 curpos = newpos;
 //float mouseRadius = .3;
 //float dist = distance(curpos.xy,uMouse);
 //float strength = dist/mouseRadius;
 //strength = 1. - smoothstep(0.,1., strength);
 //float dx = uMouse.x - curpos.x;
 //float dy = uMouse.y - curpos.y;
 //float angleangle = atan(dy, dx);

 //newpos.x + cos(angleangle)*strength*0.2;
 //newpos.y + sin(angleangle)*strength*0.2;

 vec4 mvPosition = modelViewMatrix * vec4( newpos, 1. );
 gl_PointSize = 20. * (1. / - mvPosition.z);
 gl_Position = projectionMatrix * mvPosition;
}
