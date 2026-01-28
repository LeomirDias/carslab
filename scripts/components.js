/**
 * Components JavaScript
 * Handles component-specific functionality
 */

/**
 * Initialize all components
 */
function initComponents() {
    initHeader();
    initHero();
    initCourseContent();
    initTestimonials();
}

/**
 * Initialize Header component
 */
function initHeader() {
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.getElementById('headerNav');
    
    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', () => {
            headerNav.classList.toggle('header__nav--active');
            menuToggle.classList.toggle('header__menu-toggle--active');
        });

        // Close menu when clicking on a link
        const navLinks = headerNav.querySelectorAll('.header__nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                headerNav.classList.remove('header__nav--active');
                menuToggle.classList.remove('header__menu-toggle--active');
            });
        });
    }
}

/**
 * Initialize Hero component - Video lazy loading
 */
function initHero() {
    const playButton = document.getElementById('playButton');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoEmbed = document.getElementById('videoEmbed');
    const videoIframe = document.getElementById('videoIframe');
    const videoOverlay = document.getElementById('videoOverlay');
    
    // YouTube video ID - Replace with your actual video ID
    const videoId = 'bZaisBNOTgA';
    
    let player = null;
    let isPlaying = false;
    
    if (playButton && videoThumbnail && videoEmbed && videoIframe) {
        playButton.addEventListener('click', () => {
            // Hide thumbnail and show embed
            videoThumbnail.style.display = 'none';
            videoEmbed.classList.remove('hidden');
            
            // Load YouTube video with parameters to prevent redirects and enable JS API
            videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&fs=1&iv_load_policy=3`;
            
            // Mark as played to prevent reloading
            playButton.setAttribute('data-played', 'true');
            
            // Initialize YouTube Player API after iframe loads
            videoIframe.onload = function() {
                initYouTubePlayerAPI();
            };
        });
        
        // Add click event to the video overlay to toggle play/pause
        if (videoOverlay) {
            videoOverlay.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (player && typeof player.getPlayerState === 'function') {
                    const state = player.getPlayerState();
                    // 1 = playing, 2 = paused
                    if (state === 1) {
                        player.pauseVideo();
                    } else if (state === 2 || state === -1 || state === 0 || state === 5) {
                        player.playVideo();
                    }
                }
            });
        }
    }
    
    // Initialize YouTube Player API
    function initYouTubePlayerAPI() {
        // Load YouTube IFrame API if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // Wait for API to load
            window.onYouTubeIframeAPIReady = function() {
                createPlayer();
            };
        } else {
            createPlayer();
        }
    }
    
    function createPlayer() {
        player = new YT.Player('videoIframe', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
    
    function onPlayerStateChange(event) {
        // Update playing state
        isPlaying = event.data === YT.PlayerState.PLAYING;
    }
}

/**
 * Initialize Course Content component - Accordion functionality
 */
function initCourseContent() {
    const moduleToggles = document.querySelectorAll('.course-content__module-toggle');
    
    moduleToggles.forEach(toggle => {
        // Set initial state
        toggle.setAttribute('aria-expanded', 'false');
        const moduleNumber = toggle.getAttribute('data-module');
        const details = document.querySelector(`[data-module-details="${moduleNumber}"]`);
        if (details) {
            details.setAttribute('aria-hidden', 'true');
        }
        
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            
            if (details) {
                if (isExpanded) {
                    // Close
                    toggle.setAttribute('aria-expanded', 'false');
                    details.setAttribute('aria-hidden', 'true');
                    toggle.querySelector('.course-content__toggle-text').textContent = 'Ver mais';
                } else {
                    // Open
                    toggle.setAttribute('aria-expanded', 'true');
                    details.setAttribute('aria-hidden', 'false');
                    toggle.querySelector('.course-content__toggle-text').textContent = 'Ver menos';
                }
            }
        });
    });
}

/**
 * Initialize Testimonials component - Swiper carousel
 */
function initTestimonials() {
    const testimonialsCarousel = document.querySelector('.testimonials__carousel');
    
    if (testimonialsCarousel) {
        // Wait for Swiper to be available and DOM to be ready
        const initSwiper = () => {
            if (typeof Swiper !== 'undefined') {
                // Destroy existing instance if any
                if (testimonialsCarousel.swiper) {
                    testimonialsCarousel.swiper.destroy(true, true);
                }
                
                new Swiper('.testimonials__carousel', {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    autoplay: {
                        delay: 2500,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                    },
                });
            } else {
                // Retry if Swiper is not loaded yet
                setTimeout(initSwiper, 100);
            }
        };
        
        // Start initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSwiper);
        } else {
            setTimeout(initSwiper, 100);
        }
    }
}

// Export for use in main.js
window.initComponents = initComponents;
