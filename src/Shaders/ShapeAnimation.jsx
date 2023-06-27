import { useEffect } from "react";
import * as THREE from "three";

const vshader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fshader = `
varying vec2 vUv;
uniform float iTime;
uniform vec2 iResolution;

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b * cos(6.28318 * (c * t + d));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i * 0.4 + iTime * 0.4);

        d = sin(d * 8.0 + iTime) / 8.0;
        d = abs(d);

        d = pow(0.01 / d, 1.2);

        finalColor += col * d;
    }

    fragColor = vec4(finalColor, 1.0);
}

void main(void) {
    vec4 fragColor;
    mainImage(fragColor, vUv * iResolution.xy);
    gl_FragColor = fragColor;
}
`;


function ShapeAnimation() {
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

  window.addEventListener("resize", () => {
    uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
  });

  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2() }
};

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vshader,
    fragmentShader: fshader
});

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.z = 1;

  animate();

  function animate() {
    requestAnimationFrame(animate);
    uniforms.iTime.value += 0.05;
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

export default ShapeAnimation;
