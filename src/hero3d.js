import * as THREE from 'three';

export function createHero3D(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const hologramColor = currentTheme === 'light' ? 0x0ea5e9 : 0x38bdf8;

    // Create holographic material
    const hologramMaterial = new THREE.MeshBasicMaterial({
        color: hologramColor,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });

    // Create star cruiser geometry (simplified representation)
    const cruiserGroup = new THREE.Group();

    // Main hull
    const hullGeometry = new THREE.CylinderGeometry(0.3, 0.8, 4, 8);
    const hull = new THREE.Mesh(hullGeometry, hologramMaterial);
    hull.rotation.z = Math.PI / 2;
    cruiserGroup.add(hull);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(3, 0.2, 1);
    const leftWing = new THREE.Mesh(wingGeometry, hologramMaterial);
    leftWing.position.set(0, 1, 0);
    cruiserGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, hologramMaterial);
    rightWing.position.set(0, -1, 0);
    cruiserGroup.add(rightWing);

    // Bridge
    const bridgeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.8);
    const bridge = new THREE.Mesh(bridgeGeometry, hologramMaterial);
    bridge.position.set(1.5, 0, 0.5);
    cruiserGroup.add(bridge);

    // Engines
    const engineGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 6);
    const engine1 = new THREE.Mesh(engineGeometry, hologramMaterial);
    engine1.position.set(-1.8, 0.8, 0);
    engine1.rotation.z = Math.PI / 2;
    cruiserGroup.add(engine1);

    const engine2 = new THREE.Mesh(engineGeometry, hologramMaterial);
    engine2.position.set(-1.8, -0.8, 0);
    engine2.rotation.z = Math.PI / 2;
    cruiserGroup.add(engine2);

    scene.add(cruiserGroup);

    // Add holographic grid effect
    const gridHelper = new THREE.GridHelper(10, 20, hologramColor, hologramColor);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(hologramColor, 0.5);
    scene.add(ambientLight);

    // Add point light for glow effect
    const pointLight = new THREE.PointLight(currentTheme === 'light' ? 0x10b981 : 0x34d399, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.set(5, 2, 5);
    camera.lookAt(0, 0, 0);

    // Animation variables
    let time = 0;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Rotate the cruiser slowly
        cruiserGroup.rotation.y += 0.005;
        cruiserGroup.rotation.x = Math.sin(time) * 0.1;
        cruiserGroup.position.y = Math.sin(time * 0.5) * 0.3;

        // Pulse the hologram effect
        const opacity = 0.5 + Math.sin(time * 2) * 0.2;
        hologramMaterial.opacity = opacity;

        // Rotate the grid
        gridHelper.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function handleResize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    return { scene, camera, renderer, cruiserGroup, hologramMaterial };
}