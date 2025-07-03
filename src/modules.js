import { gsap } from 'gsap';

export function initModuleAnimations() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach((card, index) => {
        // Hover animations
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Animate the icon
            const icon = card.querySelector('.module-icon');
            gsap.to(icon, {
                scale: 1.2,
                rotation: 10,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });

            // Glow effect
            const glow = card.querySelector('.module-glow');
            gsap.to(glow, {
                opacity: 0.1,
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            const icon = card.querySelector('.module-icon');
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });

            const glow = card.querySelector('.module-glow');
            gsap.to(glow, {
                opacity: 0,
                duration: 0.3
            });
        });

        // Click animation
        card.addEventListener('click', () => {
            gsap.to(card, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        });

        // Idle floating animation with different delays
        gsap.to(card, {
            y: -5,
            duration: 2 + index * 0.2,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1,
            delay: index * 0.1
        });
    });
}