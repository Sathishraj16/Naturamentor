import * as THREE from 'three';

export function createStarfield(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: currentTheme === 'light' ? 0x64748b : 0xf8fafc,
        size: 2,
        transparent: true,
        opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create moving stars for depth effect
    const movingStarsGeometry = new THREE.BufferGeometry();
    const movingStarsMaterial = new THREE.PointsMaterial({
        color: currentTheme === 'light' ? 0x0ea5e9 : 0x38bdf8,
        size: 1,
        transparent: true,
        opacity: 0.6
    });

    const movingStarsVertices = [];
    for (let i = 0; i < 500; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        movingStarsVertices.push(x, y, z);
    }

    movingStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(movingStarsVertices, 3));
    const movingStars = new THREE.Points(movingStarsGeometry, movingStarsMaterial);
    scene.add(movingStars);

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate stars slowly
        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.0005;

        // Move the moving stars
        movingStars.rotation.x += 0.001;
        movingStars.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    return { scene, camera, renderer, stars, movingStars };
}