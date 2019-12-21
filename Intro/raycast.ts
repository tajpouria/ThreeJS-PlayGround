import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Raycaster,
  Vector2,
  Matrix4,
  PerspectiveCamera,
  Scene,
  HemisphereLight,
  SphereBufferGeometry,
  MeshPhongMaterial,
  InstancedMesh,
  Object3D,
  WebGLRenderer
} from "three";

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  rayCaster: Raycaster,
  stats: Stats,
  mesh: InstancedMesh;

const amount = parseInt(window.location.search.substr(1), 10) || 10;
const count = Math.pow(amount, 3);

rayCaster = new Raycaster();
const mouse = new Vector2(1, 1);

const rotationTheta = 0.1;
const rotationMatrix = new Matrix4().makeRotationY(rotationTheta);
const instanceMatrix = new Matrix4();
const matrix = new Matrix4();

init();
animate();

function init() {
  camera = new PerspectiveCamera(
    60,
    window.innerHeight / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(30, 20, 20);
  camera.lookAt(0, 0, 0);

  scene = new Scene();

  let light = new HemisphereLight(0xffffff, 0x000008);
  light.position.set(-1, -1.5, -1);
  scene.add(light);

  light = new HemisphereLight(0xffffff, 0x000008, 0.5);
  light.position.set(-1, -1.5, -1);
  scene.add(light);

  const geometry = new SphereBufferGeometry(0.5);
  const material = new MeshPhongMaterial({ flatShading: true });

  mesh = new InstancedMesh(geometry, material, count);

  let i = 0;
  let offset = (amount - 1) / 2;

  let transform = new Object3D();

  for (let x = 0; x < amount; x++) {
    for (let y = 0; y < amount; y++) {
      for (let z = 0; z < amount; z++) {
        transform.position.set(offset - x, offset - y, offset - z);
        transform.updateMatrix();

        mesh.setMatrixAt(i++, transform.matrix);
      }
    }
  }

  scene.add(mesh);

  const gui = new GUI();
  gui.add(mesh, "count", 0, count);

  renderer = new WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  new OrbitControls(camera, renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMosueMove, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMosueMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  rayCaster.setFromCamera(mouse, camera);

  const intersection = rayCaster.intersectObject(mesh) as any;

  if (intersection.length > 0) {
    mesh.getMatrixAt(intersection[0].instanceId, instanceMatrix);
    matrix.multiplyMatrices(instanceMatrix, rotationMatrix);

    mesh.setMatrixAt(intersection[0].instanceId, matrix);
    mesh.instanceMatrix.needsUpdate = true;
  }
  renderer.render(scene, camera);

  stats.update();
}
