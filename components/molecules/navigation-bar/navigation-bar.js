import { convertRemToPixels } from '@js/_utils.js'

const initNavigationBar = (component) => {

    const menu = component.querySelector('[data-component-part="navigation-bar.menu"]')
    const navItems = component.querySelectorAll('[data-component-part="navigation-bar.menu-item"]')
    const burgerButton = component.querySelector('[data-component-part="navigation-bar.burger-button"]')

    let styles = getComputedStyle(document.documentElement);
    let lgBreakpointRem = styles.getPropertyValue("--breakpoint-lg");

    if (burgerButton) {
        burgerButton.addEventListener('click', () => {
            menu.classList.toggle('hidden')
        })
    }

    navItems.forEach((item) => {

        let timer
        const topLevelButton = item.querySelector('[data-component="atoms.button"]')

        window.addEventListener('click', e => {
            if (!item.contains(e.target)) {
                closeSubmenu(item)
            }
        })

        item.addEventListener('mouseenter', () => {
            if (window.innerWidth < convertRemToPixels(lgBreakpointRem)) {
                return
            }
            timer = setTimeout(() => {
                openSubmenu(item)
            }, 200)
        })
        topLevelButton.addEventListener('click', e => {
            e.preventDefault()
            toggleSubmenu(item)
        })
        item.addEventListener('mouseleave', () => {
            if (window.innerWidth < convertRemToPixels(lgBreakpointRem)) {
                return
            }
            clearTimeout(timer)
            timer = setTimeout(() => {
                closeSubmenu(item)
            }, 200)
        })
    })
}

const toggleFlipIcon = (item) => {
    const icon = item.querySelector('[data-component="atoms.icon"]')
    if (!icon) {
        return
    }
    icon.classList.add('transition-transform')
    icon.classList.toggle('rotate-180')
}

const flipIcon = item => {
    const icon = item.querySelector('[data-component="atoms.icon"]')
    if (!icon) {
        return
    }
    icon.classList.add('transition-transform')
    icon.classList.add('rotate-180')
}

const unflipIcon = item => {
    const icon = item.querySelector('[data-component="atoms.icon"]')
    if (!icon) {
        return
    }
    icon.classList.add('transition-transform')
    icon.classList.remove('rotate-180')
}

const toggleSubmenu = item => {
    const subMenu = item.querySelector('[data-component-part="main-navigation.sub-menu"]')
    if (!subMenu) {
        return
    }
    toggleFlipIcon(item)
    if (subMenu.dataset.state === 'open') {
        subMenu.dataset.state = 'closed'
    } else {
        subMenu.dataset.state = 'open'
    }
}

const openSubmenu = item => {
    const subMenu = item.querySelector('[data-component-part="main-navigation.sub-menu"]')
    if (!subMenu) {
        return
    }
    flipIcon(item)
    subMenu.dataset.state = 'open'
}

const closeSubmenu = item => {
    const subMenu = item.querySelector('[data-component-part="main-navigation.sub-menu"]')
    if (!subMenu) {
        return
    }
    unflipIcon(item)
    subMenu.dataset.state = 'closed'
}

const initNavigationBars = () => {
    document.querySelectorAll('[data-component="molecules.navigation-bar"]')
        .forEach((component) => {
            initNavigationBar(component)
        })
}

export default initNavigationBars
