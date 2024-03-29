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
uniform vec2 u_resolution;
varying vec2 v_uv;
void main (void)
{
  vec3 color = vec3(v_uv.x,v_uv.y,0.0);
  gl_FragColor = vec4(color, 1.0); 
}
`;

function BlendingColors() {
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

  const clock = new THREE.Clock();

  const geometry = new THREE.PlaneGeometry(2, 2);
  const uniforms = {
    u_color_a: { value: new THREE.Color(0xff0000) },
    u_color_b: { value: new THREE.Color(0x00ffff) },
    u_time: { value: 0.0 },
    u_mouse: { value: { x: 0.0, y: 0.0 } },
    u_resolution: { value: { x: 0, y: 0 } },
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vshader,
    fragmentShader: fshader,
  });

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 1;

  onWindowResize();
  if ("ontouchstart" in window) {
    document.addEventListener("touchmove", move);
  } else {
    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", move);
  }

  function move(evt) {
    uniforms.u_mouse.value.x = evt.touches
      ? evt.touches[0].clientX
      : evt.clientX;
    uniforms.u_mouse.value.y = evt.touches
      ? evt.touches[0].clientY
      : evt.clientY;
  }

  animate();

  function onWindowResize(event) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let width, height;
    if (aspectRatio >= 1) {
      width = 1;
      height = (window.innerHeight / window.innerWidth) * width;
    } else {
      width = aspectRatio;
      height = 1;
    }
    camera.left = -width;
    camera.right = width;
    camera.top = height;
    camera.bottom = -height;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;
  }

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

export default BlendingColors;
