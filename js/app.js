import '@css/app.css'
import initTooltips from '@components/atoms/tooltip/tooltip.js'
import initNavigationBars from '@components/molecules/navigation-bar/navigation-bar.js'
import initHeroSliders from '@components/organisms/hero-slider/hero-slider.js'
import initLanguageSwitchers from '@components/molecules/language-switcher/language-switcher.js'
import initContentSliders from '@components/organisms/content-slider/content-slider.js'
import initImageSliders from '@components/organisms/image-slider/image-slider.js'
import initLightboxGalleries from '@components/organisms/lightbox-gallery/lightbox-gallery.js'
import initForms from '@components/molecules/form/form.js'
import initSupportNavigations from '@components/molecules/support-navigation/support-navigation.js'
import initDataTables from '@components/molecules/data-table/data-table.js'
import initScrollSpy from '@components/molecules/support-scroll-spy/support-scroll-spy.js'

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitchers();
    initTooltips();
    initNavigationBars();
    initHeroSliders();
    initContentSliders();
    initLightboxGalleries();
    initImageSliders();
    initForms();
    initSupportNavigations();
    initDataTables();
    initScrollSpy();
})
