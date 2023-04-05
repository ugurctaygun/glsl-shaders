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
varying vec3 v_position;

float rect(vec2 pt , vec2 size , vec2 center ) {
    vec2 p = pt - center;
    vec2 halfSize = size * 0.5;
    float horz = step(-halfSize.x , p.x) - step(halfSize.x , p.x);
    float vert = step(-halfSize.y , p.y) - step(halfSize.y , p.y);

    return horz * vert;
}

void main (void)
{
  float inRect = rect(v_position.xy , vec2(0.3) , vec2(0.0));
  float inRect2 = rect(v_position.xy , vec2(0.4) , vec2(-0.4 , 0.5));
  //SEPERATE COLORS MULTIPLE RECTANGLES
  vec3 color = vec3(1.0,1.0,0.0) * inRect + vec3(0.5,0.5,0.0) * inRect2;
  gl_FragColor = vec4(color,1.0);
}
`;

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

  const material = new THREE.ShaderMaterial({
    vertexShader: vshader,
    fragmentShader: fshader,
  });

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 1;

  animate();

  function animate() {
    requestAnimationFrame(animate);
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
