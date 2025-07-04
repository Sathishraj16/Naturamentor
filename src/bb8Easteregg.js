import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let bb8, scene, camera, renderer;

export function createBB8(canvas) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('/models/bb8.glb', (gltf) => {
        bb8 = gltf.scene;
        bb8.scale.set(0.3, 0.3, 0.3);
        bb8.position.set(0, 0, 0);
        scene.add(bb8);
    });

    function animate() {
        requestAnimationFrame(animate);
        if (bb8) bb8.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();

    // Mouse tracking
    window.addEventListener('mousemove', (event) => {
        if (bb8) {
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Scale to screen size and set position
            bb8.position.x = x * 2.5;
            bb8.position.y = y * 1.5;
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
