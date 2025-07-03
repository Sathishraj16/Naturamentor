import { gsap } from 'gsap';

export function initBB8Animation() {
    const bb8 = document.querySelector('.bb8');
    if (!bb8) return;

    // Create floating animation
    gsap.to(bb8, {
        y: -10,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
    });

    // Add interaction on hover
    bb8.addEventListener('mouseenter', () => {
        gsap.to(bb8, {
            scale: 1.2,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });

    bb8.addEventListener('mouseleave', () => {
        gsap.to(bb8, {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });

    // Add click interaction
    bb8.addEventListener('click', () => {
        gsap.to(bb8, {
            rotation: '+=360',
            duration: 1,
            ease: 'power2.out'
        });
    });
}