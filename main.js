import './style.css';

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    // Mobile Menu Toggle
    function toggleMenu() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            // Trigger animation
            requestAnimationFrame(() => {
                mobileMenu.classList.remove('opacity-0', 'translate-y-10');
            });
            body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('opacity-0', 'translate-y-10');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            body.style.overflow = '';
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);

    // Close menu on link click
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/90', 'py-3');
            navbar.classList.remove('bg-white/10', 'py-5');
        } else {
            navbar.classList.add('bg-white/10', 'py-5');
            navbar.classList.remove('bg-white/90', 'py-3');
        }
    });
});

console.log("App Initialized successfully!");
