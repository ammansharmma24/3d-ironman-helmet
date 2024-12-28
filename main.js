import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100
);
camera.position.z = 6;

//light
const al = new THREE.AmbientLight();
scene.add(al);

//gltf loader
var model;
const loader = new GLTFLoader();
loader.load(
  "./model/ironman/scene.gltf",
  (gltf) => {
    model = gltf.scene;
    model.position.y = 0.5;
    model.rotation.x = 0.5;
    model.scale.set(0.029, 0.029, 0.029);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Error: ", error);
  }
);

window.addEventListener("mousemove", (e) => {
  if (model) {
    const rotateX = (e.clientX / window.innerWidth - 0.5) * (Math.PI*0.25);
    const rotateY = (e.clientY / window.innerHeight - 0.5) *( Math.PI*0.25);
    model.rotation.x = rotateY;
    model.rotation.y = rotateX;
  }
});

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

//composer or render pass
const composer = new EffectComposer(renderer);
const rendererPass = new RenderPass(scene, camera);
composer.addPass(rendererPass);

const RGBShift = new ShaderPass(RGBShiftShader);
RGBShiftShader.uniforms["amount"].value = 0.01;
composer.addPass(RGBShift);

//orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

const exrloader = new EXRLoader();
exrloader.load("/light/4k.exr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateMatrixWorld();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

function animation() {
  window.requestAnimationFrame(animation);
  // controls.update();
  // cube.rotation.x +=0.01
  // cube.rotation.y +=0.01
  renderer.render(scene, camera);
  composer.render();
}
animation();




//animation

const navOptions = document.querySelectorAll("h3")
navOptions.forEach((elem)=>{
  elem.addEventListener("mouseenter",()=>{
    gsap.to(elem,{
      color:"red",
    })
  })
  elem.addEventListener("mouseleave",()=>{
    gsap.to(elem,{
      color:"white",
    })
  })
})