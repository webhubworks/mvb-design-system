import Swiper from 'swiper'
import {Navigation, Autoplay} from 'swiper/modules'
import 'swiper/css'

const initHeroSlider = component => {
    const nextButton = component.querySelector('[data-component-part="hero-slider.next"]')
    const prevButton = component.querySelector('[data-component-part="hero-slider.prev"]')
    const playButton = component.querySelector('[data-component-part="hero-slider.play"]')

    const swiper = new Swiper(component, {
        modules: [Navigation, Autoplay],
        a11y: true,
        autoHeight: true,
        loop: true,
        autoplay: {
            delay: 7000,
            stopOnLastSlide: true,
            pauseOnMouseEnter: false,
        },
    })
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

const initHeroSliders = () => {
    document.querySelectorAll('[data-component="organisms.hero-slider"]').forEach((component) => {
        initHeroSlider(component)
    })
}

export default initHeroSliders
