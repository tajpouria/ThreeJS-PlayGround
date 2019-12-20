import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshLambertMaterial,
  Mesh,
  PointLight,
  Color
} from "three";

import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

let scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  control: TrackballControls;

(() => {
  scene = new Scene();
  scene.background = new Color(0xfafafa);

  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 9;

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  control = new TrackballControls(camera, renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    control.handleResize();
  });
})();

const geometry = new SphereGeometry(1, 10, 20);
const material = new MeshLambertMaterial({ color: 0xffcc00 });

for (let i = 0; i <= 15; i++) {
  const mesh = new Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 1) * 10;

  scene.add(mesh);
}

const light = new PointLight(0xffffff, 1, 500);
light.position.set(1, 0, 5);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  control.update();
  render();
}
animate();

function render() {
  renderer.render(scene, camera);
}

document.body.appendChild(renderer.domElement);
