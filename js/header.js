document.addEventListener('DOMContentLoaded', function() {
    // Load header with error handling
    if (document.getElementById('header-placeholder')) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
                
                // Set active nav link based on current page
                const currentPage = window.location.pathname.split('/').pop();
                if (currentPage === 'people.html') {
                    document.getElementById('people-link')?.classList.add('active');
                } else if (currentPage === 'publications.html') {
                    document.getElementById('publications-link')?.classList.add('active');
                } else if (currentPage === 'research.html') {
                    document.getElementById('research-link')?.classList.add('active');
                } else if (currentPage === 'contact.html') {
                    document.getElementById('contact-link')?.classList.add('active');
                }

                // Add content-header class for specific pages
                const contentPages = ['people.html', 'publications.html', 'research.html', 'contact.html'];
                if (contentPages.includes(currentPage)) {
                    document.querySelector('header')?.classList.add('content-header');
                }

                // Apply initial header state after it's loaded
                initializeHeaderState();
                
                // Mobile menu toggle
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (mobileMenuBtn) {
                    mobileMenuBtn.addEventListener('click', function() {
                        const navLinks = document.querySelector('.nav-links');
                        if (navLinks) {
                            navLinks.classList.toggle('show');
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }
    
    // Initialize header state based on current scroll position
    function initializeHeaderState() {
        const headers = document.querySelectorAll('header, .transparent-header');
        if (headers.length) {
            if (window.scrollY > 50) {
                headers.forEach(header => header.classList.add('scrolled'));
            } else {
                headers.forEach(header => header.classList.remove('scrolled'));
            }
        }
    }
    
    // Header scroll effect for all headers (both regular and transparent)
    window.addEventListener('scroll', function() {
        const headers = document.querySelectorAll('header, .transparent-header');
        if (headers.length) {
            if (window.scrollY > 50) {
                headers.forEach(header => header.classList.add('scrolled'));
            } else {
                headers.forEach(header => header.classList.remove('scrolled'));
            }
        }
    });

    // Setup mutation observer to detect when header is added to DOM
    const observeHeaderChanges = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const headers = document.querySelectorAll('header, .transparent-header');
                    if (headers.length) {
                        initializeHeaderState();
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    };
    
    observeHeaderChanges();
});