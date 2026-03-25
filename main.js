import './style.css';

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const body = document.body;
    const serviceSection = document.getElementById('services');
    const serviceGrid = serviceSection?.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');

    if (serviceSection && serviceGrid) {
        const cards = [];

        serviceGrid.querySelectorAll(':scope > div').forEach((child) => {
            if (child.classList.contains('space-y-16')) {
                child.querySelectorAll(':scope > div').forEach((nestedCard) => cards.push(nestedCard));
            } else {
                cards.push(child);
            }
        });

        const slugify = (value) => value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const serviceShell = document.createElement('div');
        serviceShell.className = 'space-y-10';

        const buttonGrid = document.createElement('div');
        buttonGrid.className = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5';

        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'service-modal-backdrop hidden fixed inset-0 z-[120] opacity-0 transition-opacity duration-300';
        modalBackdrop.setAttribute('aria-hidden', 'true');

        const modalScrim = document.createElement('div');
        modalScrim.className = 'absolute inset-0 bg-white/18 backdrop-blur-xl backdrop-saturate-150';

        const modalViewport = document.createElement('div');
        modalViewport.className = 'relative z-10 flex h-full items-start md:items-center justify-center p-4 sm:p-6 overflow-y-auto';

        const modalCard = document.createElement('div');
        modalCard.className = 'service-panel relative w-full max-w-4xl rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 sm:p-10 shadow-2xl';
        modalCard.hidden = true;

        const modalCardInner = document.createElement('div');
        modalCardInner.className = 'service-panel-inner';

        const modalClose = document.createElement('button');
        modalClose.type = 'button';
        modalClose.className = 'service-modal-close absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-white/90 text-on-surface shadow-md transition-transform duration-200 hover:scale-105';
        modalClose.setAttribute('aria-label', 'Close price list');
        modalClose.innerHTML = '<span class="material-symbols-outlined text-2xl">close</span>';

        let activeServiceId = '';
        let activeServiceButton = null;

        const restartPanelAnimation = (panel) => {
            panel.classList.remove('service-panel-enter');
            void panel.offsetWidth;
            panel.classList.add('service-panel-enter');
        };

        const syncModalBackdrop = () => {
            const navbarHeight = navbar?.getBoundingClientRect().height ?? 0;
            const offset = `${Math.ceil(navbarHeight + 12)}px`;
            modalBackdrop.style.top = offset;
            modalBackdrop.style.left = '0';
            modalBackdrop.style.right = '0';
            modalBackdrop.style.bottom = '0';
        };

        const openModal = (service, button) => {
            if (!service) return;

            syncModalBackdrop();
            modalBackdrop.classList.remove('hidden');
            modalBackdrop.setAttribute('aria-hidden', 'false');
            requestAnimationFrame(() => {
                modalBackdrop.classList.add('opacity-100');
            });

            modalCard.hidden = false;
            modalCard.setAttribute('aria-hidden', 'false');
            modalCardInner.innerHTML = `
                <div class="flex items-center justify-between gap-4 mb-8 pr-14">
                    <div class="flex items-center gap-4">
                        <span class="material-symbols-outlined text-zen-sage text-4xl">${service.icon}</span>
                        <h3 class="font-headline text-3xl font-bold tracking-tight">${service.title}</h3>
                    </div>
                    <span class="font-label text-[10px] uppercase tracking-[0.35rem] text-zen-sage-dark font-bold">Price List</span>
                </div>
            `;
            modalCard.replaceChildren(modalCardInner);
            if (service.bodyContent) {
                modalCard.appendChild(service.bodyContent.cloneNode(true));
            }
            modalCard.appendChild(modalClose);
            restartPanelAnimation(modalCard);

            buttonGrid.querySelectorAll('[aria-pressed="true"]').forEach((pressedButton) => {
                pressedButton.setAttribute('aria-pressed', 'false');
            });
            button.setAttribute('aria-pressed', 'true');
            activeServiceButton = button;

            activeServiceId = service.id;
            body.classList.add('service-modal-open');
            body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modalCard.hidden = true;
            modalCard.setAttribute('aria-hidden', 'true');
            modalCard.classList.remove('service-panel-enter');

            modalBackdrop.classList.remove('opacity-100');
            modalBackdrop.setAttribute('aria-hidden', 'true');
            modalBackdrop.style.top = '';
            modalBackdrop.style.left = '';
            modalBackdrop.style.right = '';
            modalBackdrop.style.bottom = '';
            if (activeServiceButton) {
                activeServiceButton.setAttribute('aria-pressed', 'false');
                activeServiceButton = null;
            }
            body.classList.remove('service-modal-open');
            body.style.overflow = '';

            window.setTimeout(() => {
                modalBackdrop.classList.add('hidden');
            }, 300);
        };

        cards.forEach((card, index) => {
            const header = card.children[0];
            const bodyContent = card.children[1];
            const title = header?.querySelector('h3')?.textContent?.trim() || `Service ${index + 1}`;
            const icon = header?.querySelector('.material-symbols-outlined')?.textContent?.trim() || 'spa';
            const serviceId = slugify(title) || `service-${index + 1}`;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'service-button group flex items-center gap-4 rounded-3xl border border-white/40 bg-white/70 px-5 py-4 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-zen-sage hover:shadow-[0_18px_40px_rgba(110,123,103,0.12)]';
            button.dataset.serviceTrigger = serviceId;
            button.setAttribute('aria-pressed', 'false');
            button.setAttribute('aria-controls', `service-panel-${serviceId}`);
            button.innerHTML = `
                <span class="service-button-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zen-sage/10 text-zen-sage transition-colors duration-300">
                    <span class="material-symbols-outlined text-4xl">${icon}</span>
                </span>
                <span class="min-w-0">
                    <span class="block font-headline text-2xl font-bold tracking-tight">${title}</span>
                    <span class="service-button-kicker block font-label text-[10px] uppercase tracking-[0.25rem] text-on-surface-variant">Tap to view prices</span>
                </span>
            `;

            button.addEventListener('click', () => {
                const isAlreadyOpen = modalBackdrop.classList.contains('opacity-100') && activeServiceId === serviceId;

                if (isAlreadyOpen) {
                    closeModal();
                    button.setAttribute('aria-pressed', 'false');
                    activeServiceId = '';
                    return;
                }

                openModal({
                    id: serviceId,
                    icon,
                    title,
                    bodyContent,
                }, button);
            });

            buttonGrid.appendChild(button);
        });

        serviceShell.appendChild(buttonGrid);
        modalViewport.appendChild(modalCard);
        modalViewport.appendChild(modalClose);
        modalBackdrop.appendChild(modalScrim);
        modalBackdrop.appendChild(modalViewport);
        serviceShell.appendChild(modalBackdrop);
        serviceGrid.insertAdjacentElement('beforebegin', serviceShell);
        serviceGrid.classList.add('hidden');

        modalScrim.addEventListener('click', closeModal);
        modalViewport.addEventListener('click', (event) => event.stopPropagation());
        modalClose.addEventListener('click', closeModal);
        window.addEventListener('resize', () => {
            if (!modalBackdrop.classList.contains('hidden')) {
                syncModalBackdrop();
            }
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Mobile Menu Toggle
    function toggleMenu() {
        if (!mobileMenu || !menuBackdrop) return;

        const isOpening = mobileMenu.classList.contains('hidden');
        
        if (isOpening) {
            mobileMenu.classList.remove('hidden');
            menuBackdrop.classList.remove('hidden');
            
            // Trigger animation
            requestAnimationFrame(() => {
                mobileMenu.classList.remove('translate-y-8', 'opacity-0', 'pointer-events-none');
                menuBackdrop.classList.add('opacity-100');
            });
            body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('translate-y-8', 'opacity-0', 'pointer-events-none');
            menuBackdrop.classList.remove('opacity-100');
            
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                menuBackdrop.classList.add('hidden');
            }, 300);
            body.style.overflow = '';
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', toggleMenu);

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
