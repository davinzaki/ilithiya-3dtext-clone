import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

/**
 * Base
 */
// Debug
// const gui = new GUI();

// Font
const fontLoader = new FontLoader();
const font = await fontLoader.loadAsync("/fonts/Poppins_Regular.json");

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial(),
// );

const group = new THREE.Group();
scene.add(group);

const largeGroup = new THREE.Group();
scene.add(largeGroup);

const material = new THREE.MeshNormalMaterial();
material.flatShading = true;
// textGeometry.translate(
//   -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
//   -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
//   -(textGeometry.boundingBox.max.z - 0.03) * 0.5, // Subtract bevel thickness
// );

const textGeometry = new TextGeometry("aspiring", {
  font: font,
  size: 1,
  depth: 0.8,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.06,
  bevelOffset: 0,
  bevelSegments: 5,
});
const text = new THREE.Mesh(textGeometry, material);

const textGeometry2 = new TextGeometry("creative", {
  font: font,
  size: 1,
  depth: 0.8,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.06,
  bevelOffset: 0,
  bevelSegments: 5,
});
const text2 = new THREE.Mesh(textGeometry2, material);

const textGeometry3 = new TextGeometry("developer", {
  font: font,
  size: 1,
  depth: 0.8,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.06,
  bevelOffset: 0,
  bevelSegments: 5,
});
const text3 = new THREE.Mesh(textGeometry3, material);

scene.add(text)

text.position.y = 1.5;
text2.position.y = 0;
text3.position.y = -1.5;

group.add(text, text2, text3);

const box = new THREE.Box3().setFromObject(group);

const center = new THREE.Vector3();
box.getCenter(center);

group.children.forEach((child) => {
  child.position.x -= center.x;
  child.position.y -= center.y;
  child.position.z -= center.z;
});

group.position.set(0, 0, 0);

const scale = Math.random();

for (let i = 0; i < 80; i++) {
  const torusGeometry = new THREE.TorusGeometry(1, 0.5, 28, 45);

  const torus = new THREE.Mesh(torusGeometry, material);

  torus.position.x = (Math.random() - 0.5) * 50;
  torus.position.y = (Math.random() - 0.5) * 50;
  torus.position.z = (Math.random() - 0.5) * 50;

  torus.rotation.x = Math.random() * Math.PI;
  torus.rotation.y = Math.random() * Math.PI;

  scene.add(torus);

  largeGroup.add(torus);
}

for (let i = 0; i < 80; i++) {
  const boxGeometry = new THREE.BoxGeometry(1);

  const box = new THREE.Mesh(boxGeometry, material);

  box.position.x = (Math.random() - 0.5) * 50;
  box.position.y = (Math.random() - 0.5) * 50;
  box.position.z = (Math.random() - 0.5) * 50;

  box.rotation.x = Math.random() * Math.PI;
  box.rotation.y = Math.random() * Math.PI;

  scene.add(box);

  largeGroup.add(box);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 8;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const cursor = {
  x: 0,
  y: 0,
};

const smoothCursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  //   cursor.y = -(event.clientY / sizes.width - 0.5);
  cursor.y = event.clientY / sizes.height - 0.5;
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // group.rotation.z = Math.sin();

  smoothCursor.x += (cursor.x - smoothCursor.x) * 0.015;
  smoothCursor.y += (cursor.y - smoothCursor.y) * 0.015;

  // Hitung jarak kursor dari titik tengah (0,0)
  // Math.sqrt(x*x + y*y)
  const distanceFromCenter = Math.sqrt(
    smoothCursor.x ** 2 + smoothCursor.y ** 2,
  );

  // Nilai 6 adalah jarak terdekat (saat di tengah)
  // Nilai 15 adalah tambahan jarak saat di pojok layar
  const baseZoom = 10;
  const zoomIntensity = 10;

  camera.position.z = baseZoom + distanceFromCenter * zoomIntensity;

  // Perbaikan rotasi dan posisi X, Y agar tetap smooth
  group.rotation.x = smoothCursor.y * 0.8;
  group.rotation.y = smoothCursor.x * 0.8;
  largeGroup.rotation.x = smoothCursor.y * 0.8;
  largeGroup.rotation.y = smoothCursor.x * 0.8;

  camera.position.x = smoothCursor.x * 5;
  camera.position.y = -smoothCursor.y * 5; 

  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
