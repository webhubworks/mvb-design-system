import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'

const initHeroSlider = component => {
    const nextButton = component.querySelector('[data-component-part="hero-slider.next"]')
    const prevButton = component.querySelector('[data-component-part="hero-slider.prev"]')
    const playButton = component.querySelector('[data-component-part="hero-slider.play"]')
    const playButtonIcon = playButton.querySelector('[data-component="atoms.icon"]')
    const swiper = new Swiper(component, {
        modules: [Navigation],
        a11y: true,
        autoHeight: true,
        loop: true,
        autoplay: {
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
            playButtonIcon.classList.toggle('fa-play-circle')
            playButtonIcon.classList.toggle('fa-pause-circle')
            playButton.setAttribute('aria-label', 'Play slideshow')
            playButton.setAttribute('aria-label', 'Pause slideshow')
            // ToDo: Implement play/pause functionality
        })
    }
}

const initHeroSliders = () => {
    document.querySelectorAll('[data-component="organisms.hero-slider"]').forEach((component) => {
        initHeroSlider(component)
    })
}

export default initHeroSliders
