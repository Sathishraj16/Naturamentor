import * as THREE from 'three';

export function createHeroScene(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xff6b35,
        size: 2,
        transparent: true,
        opacity: 0.6
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create main spaceship (X-Wing inspired)
    const spaceshipGroup = new THREE.Group();

    // Main body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    body.castShadow = true;
    spaceshipGroup.add(body);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(3, 0.2, 0.8);
    const wingMaterial = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        shininess: 80
    });

    // Top wings
    const topLeftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    topLeftWing.position.set(0, 1.2, 0.5);
    topLeftWing.castShadow = true;
    spaceshipGroup.add(topLeftWing);

    const topRightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    topRightWing.position.set(0, -1.2, 0.5);
    topRightWing.castShadow = true;
    spaceshipGroup.add(topRightWing);

    // Bottom wings
    const bottomLeftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    bottomLeftWing.position.set(0, 1.2, -0.5);
    bottomLeftWing.castShadow = true;
    spaceshipGroup.add(bottomLeftWing);

    const bottomRightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    bottomRightWing.position.set(0, -1.2, -0.5);
    bottomRightWing.castShadow = true;
    spaceshipGroup.add(bottomRightWing);

    // Engines
    const engineGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.6, 8);
    const engineMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666,
        shininess: 120
    });

    // Engine positions for X-Wing configuration
    const enginePositions = [
        { x: -1.8, y: 1.2, z: 0.5 },
        { x: -1.8, y: -1.2, z: 0.5 },
        { x: -1.8, y: 1.2, z: -0.5 },
        { x: -1.8, y: -1.2, z: -0.5 }
    ];

    enginePositions.forEach(pos => {
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.set(pos.x, pos.y, pos.z);
        engine.rotation.z = Math.PI / 2;
        engine.castShadow = true;
        spaceshipGroup.add(engine);

        // Engine glow
        const glowGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.8
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(pos.x - 0.4, pos.y, pos.z);
        spaceshipGroup.add(glow);
    });

    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(0.4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.7,
        shininess: 150
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(1.5, 0, 0.3);
    cockpit.castShadow = true;
    spaceshipGroup.add(cockpit);

    scene.add(spaceshipGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff6b35, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Camera position
    camera.position.set(8, 3, 5);
    camera.lookAt(0, 0, 0);

    // Animation variables
    let time = 0;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Rotate stars slowly
        stars.rotation.x += 0.0002;
        stars.rotation.y += 0.0003;

        // Animate spaceship
        spaceshipGroup.rotation.y += 0.003;
        spaceshipGroup.position.y = Math.sin(time * 0.5) * 0.3;
        spaceshipGroup.position.x = Math.cos(time * 0.3) * 0.2;

        // Animate engine glows
        spaceshipGroup.children.forEach(child => {
            if (child.material && child.material.color && child.material.color.getHex() === 0xff6b35) {
                child.material.opacity = 0.6 + Math.sin(time * 8) * 0.3;
            }
        });

        // Camera orbit
        const radius = 8;
        camera.position.x = Math.cos(time * 0.1) * radius;
        camera.position.z = Math.sin(time * 0.1) * radius;
        camera.lookAt(0, 0, 0);

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

    return { scene, camera, renderer, spaceshipGroup };
}