import Swiper from 'swiper'
import {Navigation, Autoplay} from 'swiper/modules'
import 'swiper/css'

const initImageSlider = component => {
    const slider = component.querySelector('[data-component-part="image-slider.slider"]')
    const nextButton = component.querySelector('[data-component-part="image-slider.next"]')
    const prevButton = component.querySelector('[data-component-part="image-slider.prev"]')
    const playButton = component.querySelector('[data-component-part="image-slider.play"]')

    const swiper = new Swiper(slider, {
        modules: [Navigation, Autoplay],
        a11y: true,
        autoHeight: true,
        loop: true,
        autoplay: {
            delay: 7000,
            stopOnLastSlide: true,
            pauseOnMouseEnter: false,
        },
        on: {
            init: function () {
                updateTabindex(this);
            },
            slideChangeTransitionEnd: function () {
                updateTabindex(this);
            }
        }
    })

    function updateTabindex(swiperInstance) {
        // Alle Slides: tabindex -1 für a und button
        swiperInstance.slides.forEach(slide => {
            const focusables = slide.querySelectorAll('a, button');
            focusables.forEach(el => {
                el.setAttribute('tabindex', '-1');
            });
        });

        // Sichtbarer aktiver Slide via Klasse
        const activeSlide = swiperInstance.el.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const activeElements = activeSlide.querySelectorAll('a, button');
            activeElements.forEach(el => {
                el.removeAttribute('tabindex'); // Oder: el.setAttribute('tabindex', '0');
            });
        }
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            swiper.slideNext()
        })
    }
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            swiper.slidePrev()
        })
    }
    if (playButton) {
        playButton.addEventListener('click', () => {
            const playButtonIcon = playButton.querySelector('[data-component="atoms.icon"]')
            playButtonIcon.classList.toggle('fa-play-circle')
            playButtonIcon.classList.toggle('fa-pause-circle')
            playButton.setAttribute('aria-label', 'Play slideshow')
            playButton.setAttribute('aria-label', 'Pause slideshow')
            if (swiper.autoplay.running) {
                swiper.autoplay.stop()
            } else {
                swiper.autoplay.start()
            }
        })
    }
}

const initImageSliders = () => {
    document.querySelectorAll('[data-component="organisms.image-slider"]').forEach((component) => {
        initImageSlider(component)
    })
}

export default initImageSliders
