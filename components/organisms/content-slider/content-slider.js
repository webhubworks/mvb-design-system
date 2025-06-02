import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'

const initContentSlider = component => {
    const nextButton = component.querySelector('[data-component-part="content-slider.next"]')
    const prevButton = component.querySelector('[data-component-part="content-slider.prev"]')
    const playButton = component.querySelector('[data-component-part="content-slider.play"]')
    const playButtonIcon = playButton.querySelector('[data-component="atoms.icon"]')
    const swiper = new Swiper(component, {
        modules: [Navigation],
        a11y: true,
        autoHeight: true,
        loop: true,
        autoplay: {
            delay: 300,
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

            swiper.autoplay.running ? swiper.autoplay.stop() : swiper.autoplay.start()
        })
    }
}

const initContentSliders = () => {
    document.querySelectorAll('[data-component="organisms.content-slider"]').forEach((component) => {
        initContentSlider(component)
    })
}

export default initContentSliders
