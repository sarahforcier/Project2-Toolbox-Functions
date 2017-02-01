uniform vec3 color;
uniform vec3 light;
uniform float layer;
uniform float total;

varying vec3 vPosition;
varying vec3 vNormal;

vec3 lerp(vec3 a, vec3 b, float t) {
  return a * (1.0-t) + b * t;
}

void main() {
  vec3 incoming_ray = normalize(light - vPosition);
  vec3 black = vec3(1.0,1.0,1.0);
  vec3 bcolor = lerp(black, color/255.0, (layer + 1.0)/total );
  float c = dot(vNormal, incoming_ray);
  gl_FragColor = vec4(c * bcolor, 1.0 );

}