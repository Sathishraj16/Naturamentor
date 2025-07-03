import * as THREE from 'three';

export function createAnalytics3D(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Create dark holographic material
    const darkHologramMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    // Create hooded figure geometry (simplified representation)
    const figureGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.2, 3, 8);
    const body = new THREE.Mesh(bodyGeometry, darkHologramMaterial);
    body.position.y = 0;
    figureGroup.add(body);

    // Hood
    const hoodGeometry = new THREE.SphereGeometry(1, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const hood = new THREE.Mesh(hoodGeometry, darkHologramMaterial);
    hood.position.y = 2;
    figureGroup.add(hood);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 6);
    const leftArm = new THREE.Mesh(armGeometry, darkHologramMaterial);
    leftArm.position.set(-1, 0.5, 0);
    leftArm.rotation.z = Math.PI / 6;
    figureGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, darkHologramMaterial);
    rightArm.position.set(1, 0.5, 0);
    rightArm.rotation.z = -Math.PI / 6;
    figureGroup.add(rightArm);

    // Cape effect
    const capeGeometry = new THREE.PlaneGeometry(3, 4);
    const capeMaterial = new THREE.MeshBasicMaterial({
        color: 0x2d2d2d,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    const cape = new THREE.Mesh(capeGeometry, capeMaterial);
    cape.position.set(0, 0, -0.5);
    figureGroup.add(cape);

    scene.add(figureGroup);

    // Add data visualization elements
    const dataPoints = [];
    for (let i = 0; i < 50; i++) {
        const pointGeometry = new THREE.SphereGeometry(0.05, 4, 4);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xff6b6b : 0xee5a24,
            transparent: true,
            opacity: 0.8
        });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        
        point.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 8
        );
        
        dataPoints.push(point);
        scene.add(point);
    }

    // Add connecting lines between data points
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.3
    });

    const connections = [];
    for (let i = 0; i < 20; i++) {
        const points = [];
        const point1 = dataPoints[Math.floor(Math.random() * dataPoints.length)];
        const point2 = dataPoints[Math.floor(Math.random() * dataPoints.length)];
        
        points.push(point1.position);
        points.push(point2.position);
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        connections.push(line);
        scene.add(line);
    }

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0xff6b6b, 0.3);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xee5a24, 1, 100);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    camera.position.set(4, 2, 6);
    camera.lookAt(0, 0, 0);

    // Animation variables
    let time = 0;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Animate the hooded figure
        figureGroup.rotation.y += 0.003;
        figureGroup.position.y = Math.sin(time * 0.8) * 0.2;

        // Animate cape
        cape.rotation.x = Math.sin(time * 2) * 0.1;
        cape.rotation.z = Math.sin(time * 1.5) * 0.05;

        // Animate data points
        dataPoints.forEach((point, index) => {
            point.position.y += Math.sin(time + index) * 0.01;
            point.rotation.x += 0.02;
            point.rotation.y += 0.01;
            
            // Pulse opacity
            point.material.opacity = 0.5 + Math.sin(time * 3 + index) * 0.3;
        });

        // Pulse the hologram effect
        const opacity = 0.6 + Math.sin(time * 2) * 0.2;
        darkHologramMaterial.opacity = opacity;

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

    return { scene, camera, renderer, figureGroup };
}