document.addEventListener('DOMContentLoaded', function() {
    // Animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeIn = function() {
        fadeElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };
    
    // Initial check on load
    fadeIn();
    
    // Check on scroll
    window.addEventListener('scroll', fadeIn);
    
    // Parallax effect for hero backgrounds
    const parallaxSections = document.querySelectorAll('.parallax-section, .hero-bg');
    if (parallaxSections.length > 0) {
        window.addEventListener('scroll', function() {
            parallaxSections.forEach(section => {
                const distance = window.scrollY;
                if (section.classList.contains('hero-bg')) {
                    section.style.transform = `translateY(${distance * 0.5}px)`;
                }
            });
        });
    }
    
    // Scroll down button
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
    
    // Fix initial scroll position
    window.scrollTo(0, 0);
});