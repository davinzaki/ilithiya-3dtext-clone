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

// Watermark
const watermark = document.createElement("a");
watermark.className = "watermark";
watermark.innerText = "made by @davinzaki";
watermark.href = "https://github.com/davinzaki";
watermark.target = "_blank";
watermark.rel = "noopener noreferrer";

document.body.appendChild(watermark);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Font
const textGroup = new THREE.Group();
scene.add(textGroup);

const fontLoader = new FontLoader();
fontLoader.load("/fonts/Poppins_Regular.json", (font) => {
  const textGeometry = new TextGeometry("creative", {
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

  const textGeometry2 = new TextGeometry("development", {
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

  const textGeometry3 = new TextGeometry("enthusiast", {
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

  scene.add(text);

  text.position.y = 1.5;
  text2.position.y = 0;
  text3.position.y = -1.5;

  textGroup.add(text, text2, text3);

  const box = new THREE.Box3().setFromObject(textGroup);

  const center = new THREE.Vector3();
  box.getCenter(center);

  textGroup.children.forEach((child) => {
    child.position.x -= center.x;
    child.position.y -= center.y;
    child.position.z -= center.z;
  });

  textGroup.position.set(0, 0, -6);
});

/**
 * Textures
 */

const randomNumber = Math.floor(Math.random() * (11 - 9)) + 9;
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(`./textures/matcaps/${randomNumber}.jpeg`);
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */

const variantGroup = new THREE.Group();
scene.add(variantGroup);

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;

// textGeometry.translate(
//   -(textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
//   -(textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
//   -(textGeometry.boundingBox.max.z - 0.03) * 0.5, // Subtract bevel thickness
// );

const scale = Math.random();

for (let i = 0; i < 100; i++) {
  const torusGeometry = new THREE.TorusGeometry(1, 0.5, 28, 45);

  const torus = new THREE.Mesh(torusGeometry, material);

  torus.position.x = (Math.random() - 0.5) * 80;
  torus.position.y = (Math.random() - 0.5) * 80;
  torus.position.z = (Math.random() - 0.5) * 80;

  torus.rotation.x = Math.random() * Math.PI;
  torus.rotation.y = Math.random() * Math.PI;

  scene.add(torus);

  variantGroup.add(torus);
}

for (let i = 0; i < 100; i++) {
  const boxGeometry = new THREE.BoxGeometry(1);

  const boxMesh = new THREE.Mesh(boxGeometry, material);

  boxMesh.position.x = (Math.random() - 0.5) * 80;
  boxMesh.position.y = (Math.random() - 0.5) * 80;
  boxMesh.position.z = (Math.random() - 0.5) * 80;

  boxMesh.rotation.x = Math.random() * Math.PI;
  boxMesh.rotation.y = Math.random() * Math.PI;

  scene.add(boxMesh);

  variantGroup.add(boxMesh);
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
camera.position.z = 20;
camera.lookAt(textGroup.position);
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
let isMoving = false;
let idleTimer;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  //   cursor.y = -(event.clientY / sizes.width - 0.5);
  cursor.y = event.clientY / sizes.height - 0.5;

  isMoving = true;

  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    isMoving = false;
  }, 500);
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  textGroup.rotation.z = Math.sin(elapsedTime * 0.3);
  variantGroup.rotation.z = -Math.sin(elapsedTime * 0.3);

  smoothCursor.x += (cursor.x - smoothCursor.x) * 0.05;
  smoothCursor.y += (cursor.y - smoothCursor.y) * 0.05;

  // Hitung jarak kursor dari titik tengah (0,0)
  // Math.sqrt(x*x + y*y)
  const distanceFromCenter = Math.sqrt(
    smoothCursor.x ** 2 + smoothCursor.y ** 2,
  );

  // Nilai 6 adalah jarak terdekat (saat di tengah)
  // Nilai 15 adalah tambahan jarak saat di pojok layar
  const baseZoom = 6;
  const zoomIntensity = 15;

  camera.position.z = baseZoom + distanceFromCenter * zoomIntensity;

  // rotasi dan posisi X, Y agar smooth
  textGroup.rotation.x = smoothCursor.y * 0.8;
  textGroup.rotation.y = smoothCursor.x * 0.8;
  variantGroup.rotation.x = smoothCursor.y * 0.8;
  variantGroup.rotation.y = smoothCursor.x * 0.8;

  camera.position.x = smoothCursor.x * 5;
  camera.position.y = -smoothCursor.y * 5;

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  // camera.position.y = cursor.y * 2;

  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
