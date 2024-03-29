import { useEffect } from "react";
import * as THREE from "three";

const vshader = `
varying vec3 v_position;

void main() {	
  v_position = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fshader = `
uniform float u_time;
varying vec3 v_position;

mat2 getRotationMatrix(float theta) {
  float s = sin(theta);
  float c = cos(theta);
  return mat2(c,-s,s,c);
}

mat2 getScaleMatrix(float scale){
  return mat2(scale,0,0,scale);
}

float rect(vec2 pt , vec2 size , vec2 center ) {
    vec2 p = pt - center;
    vec2 halfSize = size * 0.5;
    float horz = step(-halfSize.x , p.x) - step(halfSize.x , p.x);
    float vert = step(-halfSize.y , p.y) - step(halfSize.y , p.y);

    return horz * vert;
}

void main (void)
{
  vec2 center = vec2(0.0);
  mat2 matr = getRotationMatrix(u_time);
  mat2 mats = getScaleMatrix((sin(u_time)+1.0)/3.0 + 0.5);
  vec2 pt = matr * v_position.xy;
  pt = mats * matr * pt;
  pt += center;
  float inRect = rect(pt , vec2(0.3) , center);
  float inCircle = 1.0 - step(0.4, length(v_position.xy));
  vec3 color = vec3(1.0,1.0,0.0) * inRect + vec3(0.3,0.3,0.5) * inCircle;
  gl_FragColor = vec4(color,1.0);
}
`;

//SEPERATE COLORS MULTIPLE RECTANGLES
//float inRect2 = rect(v_position.xy , vec2(0.4) , vec2(-0.4 , 0.5));
//vec3 color = vec3(1.0,1.0,0.0) * inRect + vec3(0.5,0.5,0.0) * inRect2;

function Shapes() {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  useEffect(() => {
    document.body.appendChild(renderer.domElement);
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const clock = new THREE.Clock();

  const uniforms = {
    u_time: { value: 0.0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vshader,
    fragmentShader: fshader,
  });

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 1;

  animate();

  function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value += clock.getDelta();
    renderer.render(scene, camera);
  }

  return (
    <div className="shader-code">
      <div className="shader">
        Vertex Shader:
        <br />
        {vshader} <br /> <br />
        Fragment Shader:
        <br /> {fshader}{" "}
      </div>
    </div>
  );
}

export default Shapes;
