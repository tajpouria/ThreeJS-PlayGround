import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader
} from "three";

let scene: Scene,
  camera: PerspectiveCamera,
  cube: Mesh,
  rendered: WebGLRenderer;

(() => {
  scene = new Scene();

  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  rendered = new WebGLRenderer({ antialias: true });

  rendered.setSize(window.innerWidth, window.innerHeight);

  const root = document.getElementById("root");
  root.appendChild(rendered.domElement);

  const geometry = new BoxGeometry(2, 2, 2);

  // const texture = new TextureLoader().load("/texture.jpg");
  // const material = new MeshBasicMaterial({ map: texture });

  const material = new MeshBasicMaterial({ color: 0x0000ff });

  cube = new Mesh(geometry, material);

  scene.add(cube);

  camera.position.z = 5;
})();

const animate = () => {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  rendered.render(scene, camera);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  rendered.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", onWindowResize, false);

animate();
