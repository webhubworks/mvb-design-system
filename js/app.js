import '@css/app.css'
import initTooltips from '@components/atoms/tooltip/tooltip.js'
import initNavigationBars from '@components/molecules/navigation-bar/navigation-bar.js'
import initHeroSliders from '@components/organisms/hero-slider/hero-slider.js'
import initLanguageSwitchers from '@components/molecules/language-switcher/language-switcher.js'
import initTestimonialSliders from "@components/organisms/testimonial-slider/testimonial-slider.js";

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitchers();
    initTooltips();
    initNavigationBars();
    initHeroSliders();
    initTestimonialSliders()
})
