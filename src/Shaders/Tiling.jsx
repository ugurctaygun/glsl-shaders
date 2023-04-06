import { useEffect } from "react";
import * as THREE from "three";

const vshader = `
varying vec2 v_uv;

void main() {	
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fshader = `
uniform float u_time;
varying vec2 v_uv;

mat2 getRotationMatrix(float theta) {
  float s = sin(theta);
  float c = cos(theta);
  return mat2(c,-s,s,c);
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
    float tilecount = 4.0;
  vec2 center = vec2(0.5);
  mat2 mat = getRotationMatrix(u_time);
  vec2 p = fract(v_uv * tilecount);
  vec2 pt = (mat * (p-center)) + center;
  float inRect = rect(pt , vec2(0.3) , center);
  vec3 color = vec3(1.0,1.0,0.0) * inRect;
  gl_FragColor = vec4(color,1.0);
}
`;

function Tiling() {
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

export default Tiling;
