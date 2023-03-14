import { useEffect } from "react";
import * as THREE from "three";

function Flame() {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  camera.position.z = 1;

  const scene = new THREE.Scene();

  const flameShader = {
    uniforms: {
      time: { value: 0 }, // time uniform for animation
      distortion: { value: 2.0 }, // distortion uniform for adjusting flame shape
      noiseTexture: { value: null }, // new uniform for the noise texture
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time;
      uniform float distortion;
      uniform sampler2D noiseTexture; // define the noise texture uniform
    
      void main() {
        vec3 yellow = vec3(1.0, 0.9, 0.1);
        vec3 orange = vec3(1.0, 0.5, 0.1);
        vec3 red = vec3(1.0, 0.2, 0.1);
  
        float flameShape = sin(vUv.y * 10.0 + time) * distortion;
        flameShape += (texture2D( noiseTexture, vUv * 10.0 + time * 0.5 ).r - 0.5) * 0.3;
  
        vec3 color = mix(yellow, orange, vUv.y);
        color = mix(color, red, max(0.0, vUv.y - 0.8) * 5.0);
  
        gl_FragColor = vec4(color * flameShape, 1.0);
      }
    `,
  };

  const noiseTexture = new THREE.TextureLoader().load(
    "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
  );
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;

  const material = new THREE.ShaderMaterial({
    uniforms: flameShader.uniforms,
    vertexShader: flameShader.vertexShader,
    fragmentShader: flameShader.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  material.uniforms.noise = { value: noiseTexture };

  const geometry = new THREE.SphereGeometry(0.2, 0.2, 0.2);

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.rotation.y = 200;
  mesh.rotation.x = -100;

  const geometry2 = new THREE.SphereGeometry(15, 32, 16);
  const material2 = new THREE.MeshBasicMaterial({ color: 0xababab });
  const sphere = new THREE.Mesh(geometry2, material2);
  scene.add(sphere);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);

  useEffect(() => {
    document.body.appendChild(renderer.domElement);

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  // animation

  function animation(time) {
    material.uniforms.time.value = time / 1000; // update time uniform for animation

    renderer.render(scene, camera);
  }
}

export default Flame;
