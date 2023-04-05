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
      time: { value: 0 },
      distortion: { value: 2.0 },
      noiseTexture: { value: null },
      flameTexture: { value: null }, // define the flame texture uniform
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
      uniform sampler2D noiseTexture;
      uniform sampler2D flameTexture;
      
      void main() {
        vec3 yellow = vec3(1.0, 0.9, 0.1);
        vec3 orange = vec3(1.0, 0.5, 0.1);
        vec3 red = vec3(1.0, 0.2, 0.1);
  
        float flameShape = sin(vUv.y * 10.0 + time) * distortion;
        flameShape += (texture2D( noiseTexture, vUv * 10.0 + time * 0.5 ).r - 0.5) * 0.3;
  
        vec4 flameColor = texture2D(flameTexture, vUv);
  
        gl_FragColor = vec4(flameColor.rgb * flameShape, flameColor.a);
      }
    `,
  };

  const noiseTexture = new THREE.TextureLoader().load(
    "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
  );
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;

  const textureLoader = new THREE.TextureLoader();
  const flameTexture = textureLoader.load(
    "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
  );

  const material = new THREE.ShaderMaterial({
    uniforms: flameShader.uniforms,
    vertexShader: flameShader.vertexShader,
    fragmentShader: flameShader.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  material.uniforms.noiseTexture = { value: noiseTexture };
  material.uniforms.flameTexture = { value: flameTexture };

  const geometry = new THREE.PlaneGeometry(1, 1);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = 3;
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
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
