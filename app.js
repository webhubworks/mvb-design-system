import './css/app.css'
import initTooltips from './components/atoms/tooltip/tooltip.js'
import initNavigationBars from './components/molecules/navigation-bar/navigation-bar.js'

document.addEventListener('DOMContentLoaded', () => {
    initNavigationBars();
    initTooltips();
})
