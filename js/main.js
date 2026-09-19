/**
 * main.js - Professional Web & App Development Agency
 * Vanilla JS, Mobile-First, Secure, and Performant.
 */

'use strict';

(function() {
    // 12. SECURITY UTILITIES
    // Prevent malicious scripts by warning users who open DevTools
    console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold; text-shadow: 1px 1px 5px black;');
    console.log('%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a feature or "hack" someone\'s account, it is a scam and will give them access to your account.', 'font-size: 16px;');

    // HTML Sanitization utility
    const escapeHtml = (unsafe) => {
        return (unsafe || '').toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Performance utilities
    const debounce = (func, wait, immediate) => {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {

        // 14. PRELOADER
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                preloader.style.opacity = '0';
                preloader.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            });
        }

        // 1. NAVBAR SCROLL EFFECT
        const navbar = document.querySelector('.navbar');
        let isScrolled = false;

        const handleScroll = () => {
            if (window.scrollY > 50 && !isScrolled) {
                navbar.classList.add('scrolled');
                isScrolled = true;
            } else if (window.scrollY <= 50 && isScrolled) {
                navbar.classList.remove('scrolled');
                isScrolled = false;
            }
        };

        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(handleScroll);
        }, { passive: true });


        // 2. MOBILE MENU TOGGLE
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            const toggleMenu = () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            };

            navToggle.addEventListener('click', toggleMenu);

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) {
                        toggleMenu();
                    }
                });
            });

            document.addEventListener('click', (e) => {
                if (navMenu.classList.contains('active') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    toggleMenu();
                }
            });
        }


        // 3. SMOOTH SCROLL
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });


        // 4. SCROLL CINEMA ANIMATION
        const scrollCinema = document.querySelector('.scroll-cinema');
        const frames = document.querySelectorAll('.scroll-cinema .frame');
        const progressBar = document.querySelector('.cinema-progress-bar');
        const overlayTexts = document.querySelectorAll('.scroll-cinema .overlay-text');

        if (scrollCinema && frames.length > 0) {
            const handleCinemaScroll = () => {
                const rect = scrollCinema.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Calculate progress: 0 when top enters, 1 when bottom leaves
                const start = rect.top;
                const end = rect.bottom - windowHeight;
                
                if (start <= 0 && end >= 0) {
                    const progress = Math.abs(start) / (rect.height - windowHeight);
                    const clampedProgress = Math.min(Math.max(progress, 0), 1);
                    
                    // Frames update
                    const frameIndex = Math.min(Math.floor(clampedProgress * frames.length), frames.length - 1);
                    
                    frames.forEach((frame, idx) => {
                        if (idx === frameIndex) {
                            frame.classList.add('active');
                        } else {
                            frame.classList.remove('active');
                        }
                    });

                    // Progress bar
                    if (progressBar) {
                        progressBar.style.width = `${clampedProgress * 100}%`;
                    }

                    // Overlay texts
                    if (overlayTexts.length > 0) {
                        overlayTexts.forEach(text => text.classList.remove('active'));
                        if (clampedProgress >= 0 && clampedProgress < 0.2 && overlayTexts[0]) {
                            overlayTexts[0].classList.add('active');
                        } else if (clampedProgress >= 0.2 && clampedProgress < 0.6 && overlayTexts[1]) {
                            overlayTexts[1].classList.add('active');
                        } else if (clampedProgress >= 0.6 && clampedProgress <= 1 && overlayTexts[2]) {
                            overlayTexts[2].classList.add('active');
                        }
                    }
                }
            };

            window.addEventListener('scroll', () => {
                window.requestAnimationFrame(handleCinemaScroll);
            }, { passive: true });
        }


        // 5. SCROLL ANIMATIONS & 9. PROCESS STEPS ANIMATION
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        const processSection = document.querySelector('.process');
        
        const animationObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Handle stagger delay
                    if (el.dataset.delay) {
                        el.style.transitionDelay = `${el.dataset.delay}ms`;
                    }
                    
                    el.classList.add('visible');
                    observer.unobserve(el);

                    // 9. PROCESS STEPS
                    if (el.classList.contains('process')) {
                        const steps = el.querySelectorAll('.step-number');
                        steps.forEach((step, index) => {
                            setTimeout(() => {
                                step.classList.add('active');
                            }, index * 300);
                        });
                    }
                }
            });
        }, animationObserverOptions);

        animateElements.forEach(el => animationObserver.observe(el));
        if (processSection) animationObserver.observe(processSection);


        // 6. COUNTER ANIMATION
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const easeOutQuad = t => t * (2 - t);

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target, 10);
                    const duration = 2000;
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;

                    const animateCounter = () => {
                        frame++;
                        const progress = easeOutQuad(frame / totalFrames);
                        const currentCount = Math.round(target * progress);
                        
                        counter.textContent = currentCount + '+';

                        if (frame < totalFrames) {
                            requestAnimationFrame(animateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };
                    
                    requestAnimationFrame(animateCounter);
                    observer.unobserve(counter);
                }
            });
        }, counterObserverOptions);

        counters.forEach(counter => counterObserver.observe(counter));


        // 11. ACTIVE NAV LINK HIGHLIGHT
        const sections = document.querySelectorAll('section[id]');
        
        const sectionObserverOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is around middle of viewport
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => sectionObserver.observe(section));


        // 10. PARALLAX EFFECTS
        const hero = document.querySelector('.hero');
        const parallaxElements = document.querySelectorAll('.parallax-el');

        if (hero && parallaxElements.length > 0) {
            hero.addEventListener('mousemove', throttle((e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
                const y = (e.clientY / window.innerHeight - 0.5) * 2;

                parallaxElements.forEach(el => {
                    const speed = el.dataset.speed || 10;
                    const xOffset = x * speed;
                    const yOffset = y * speed;
                    el.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
                });
            }, 1000 / 60)); // 60fps throttle
        }


        // 8. COOKIE CONSENT
        const cookieBanner = document.querySelector('.cookie-banner');
        const acceptBtn = document.querySelector('.cookie-accept');
        const declineBtn = document.querySelector('.cookie-decline');

        if (cookieBanner) {
            const consent = localStorage.getItem('cookieConsent');
            if (!consent) {
                setTimeout(() => {
                    cookieBanner.classList.remove('hidden');
                }, 2000);
            } else {
                cookieBanner.classList.add('hidden');
            }

            const hideBanner = () => {
                cookieBanner.classList.add('hidden');
            };

            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    localStorage.setItem('cookieConsent', 'accepted');
                    hideBanner();
                });
            }

            if (declineBtn) {
                declineBtn.addEventListener('click', () => {
                    localStorage.setItem('cookieConsent', 'declined');
                    hideBanner();
                });
            }
        }


        // 7. FORM VALIDATION & SECURITY
        const contactForm = document.getElementById('contact-form');
        let isSubmitting = false;

        if (contactForm) {
            const validateEmail = (email) => {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            };

            const validatePhone = (phone) => {
                // Allows generic Brazilian formats: (xx) xxxxx-xxxx, xx xxxxx xxxx, etc.
                const re = /^\(?[1-9]{2}\)?\s?(?:[2-8]|9[1-9])[0-9]{3}\-?\s?[0-9]{4}$/;
                return re.test(phone.replace(/\s+/g, '')); // Basic validation
            };

            const showError = (input, message) => {
                const formControl = input.parentElement;
                const errorDisplay = formControl.querySelector('.form-error');
                input.classList.add('error');
                if (errorDisplay) {
                    errorDisplay.innerText = message;
                    errorDisplay.style.display = 'block';
                }
            };

            const setSuccess = (input) => {
                const formControl = input.parentElement;
                const errorDisplay = formControl.querySelector('.form-error');
                input.classList.remove('error');
                if (errorDisplay) {
                    errorDisplay.innerText = '';
                    errorDisplay.style.display = 'none';
                }
            };

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (isSubmitting) return;

                const nameInput = document.getElementById('nome');
                const emailInput = document.getElementById('email');
                const phoneInput = document.getElementById('telefone');
                const projectInput = document.getElementById('projeto') || document.getElementById('tipo-projeto');
                const messageInput = document.getElementById('mensagem');
                
                const submitBtn = contactForm.querySelector('button[type="submit"]');

                let isValid = true;

                // Validate Name
                const nameValue = nameInput.value.trim();
                if (nameValue === '') {
                    showError(nameInput, 'Nome é obrigatório');
                    isValid = false;
                } else if (nameValue.length < 2) {
                    showError(nameInput, 'Nome deve ter pelo menos 2 caracteres');
                    isValid = false;
                } else if (!/^[a-zA-Z\sÀ-ÿ]+$/.test(nameValue)) {
                    showError(nameInput, 'Nome deve conter apenas letras e espaços');
                    isValid = false;
                } else {
                    setSuccess(nameInput);
                }

                // Validate Email
                const emailValue = emailInput.value.trim();
                if (emailValue === '') {
                    showError(emailInput, 'Email é obrigatório');
                    isValid = false;
                } else if (!validateEmail(emailValue)) {
                    showError(emailInput, 'Email inválido');
                    isValid = false;
                } else {
                    setSuccess(emailInput);
                }

                // Validate Phone
                const phoneValue = phoneInput.value.trim();
                if (phoneValue === '') {
                    showError(phoneInput, 'Telefone é obrigatório');
                    isValid = false;
                } else if (!validatePhone(phoneValue)) {
                    showError(phoneInput, 'Formato de telefone inválido');
                    isValid = false;
                } else {
                    setSuccess(phoneInput);
                }

                // Validate Project Type
                const projectValue = projectInput ? projectInput.value : '';
                if (!projectValue || projectValue === '') {
                    showError(projectInput, 'Selecione um tipo de projeto');
                    isValid = false;
                } else {
                    setSuccess(projectInput);
                }

                // Validate Message
                const messageValue = messageInput.value.trim();
                if (messageValue === '') {
                    showError(messageInput, 'Mensagem é obrigatória');
                    isValid = false;
                } else if (messageValue.length < 10) {
                    showError(messageInput, 'Mensagem deve ter pelo menos 10 caracteres');
                    isValid = false;
                } else {
                    setSuccess(messageInput);
                }

                if (isValid) {
                    isSubmitting = true;
                    if (submitBtn) submitBtn.disabled = true;

                    // Sanitize outputs
                    const sName = escapeHtml(nameValue);
                    const sEmail = escapeHtml(emailValue);
                    const sPhone = escapeHtml(phoneValue);
                    const sProject = escapeHtml(projectValue);
                    const sMessage = escapeHtml(messageValue);

                    // Show success
                    const successDiv = document.querySelector('.form-success');
                    if (successDiv) {
                        successDiv.style.display = 'block';
                    }

                    // Prepare WhatsApp Message
                    const waPhone = '5532998433266';
                    const waText = `Olá Allyson (DOMINGOS // STUDIO)!\nMe chamo *${sName}*.\n\n📌 *Tipo de Projeto:* ${sProject}\n💬 *Mensagem:* ${sMessage}\n\n📧 *Email:* ${sEmail}\n📱 *Telefone:* ${sPhone}`;
                    const encodedText = encodeURIComponent(waText);
                    const waUrl = `https://wa.me/${waPhone}?text=${encodedText}`;

                    // Open WhatsApp
                    setTimeout(() => {
                        window.open(waUrl, '_blank', 'noopener,noreferrer');
                        
                        // Reset form
                        contactForm.reset();
                        if (successDiv) successDiv.style.display = 'none';
                        isSubmitting = false;
                        if (submitBtn) submitBtn.disabled = false;
                    }, 2000);
                }
                
                // Rate limiting fallback clear
                setTimeout(() => {
                    isSubmitting = false;
                    if (submitBtn) submitBtn.disabled = false;
                }, 5000);
            });
        }

    });
})();
