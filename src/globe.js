import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function mountInteractiveGlobe(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 3.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 6;

  const globeGeometry = new THREE.SphereGeometry(1.1, 64, 64);
  const globeMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a4f75,
    metalness: 0.15,
    roughness: 0.7,
    emissive: 0x2a0a15,
    emissiveIntensity: 0.35,
  });

  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.16, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x8f1d33, transparent: true, opacity: 0.12 })
  );
  scene.add(atmosphere);

  const lightA = new THREE.DirectionalLight(0xffffff, 1.0);
  lightA.position.set(4, 2, 4);
  scene.add(lightA);
  scene.add(new THREE.AmbientLight(0xc78a94, 0.45));

  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xf05a72 });
  const markerGeometry = new THREE.SphereGeometry(0.02, 12, 12);
  const markerGroup = new THREE.Group();

  const markerPoints = [
    [40.7, -74.0],
    [51.5, -0.1],
    [35.7, 139.7],
    [-33.8, 151.2],
    [30.0, 31.2],
    [1.3, 103.8],
  ];

  markerPoints.forEach(([lat, lon]) => {
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const r = 1.12;
    marker.position.set(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    markerGroup.add(marker);
  });

  scene.add(markerGroup);

  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', handleResize);

  let rafId = 0;
  const animate = () => {
    globe.rotation.y += 0.0015;
    markerGroup.rotation.y += 0.0015;
    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
    controls.dispose();
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
