import { convertRemToPixels } from '@js/_utils.js'

const toggleFlipIcon = (item) => {
    const icon = item.querySelector('[data-component="atoms.icon"]')
    if (!icon) return
    icon.classList.add('transition-transform')
    icon.classList.toggle('rotate-180')
}

const flipIcon = (item) => {
    const icon = item.querySelector('[data-component="atoms.icon"]')
    if (!icon) return
    icon.classList.add('transition-transform')
    icon.classList.add('rotate-180')
}

const unflipIcon = (item) => {
    const icon = item.querySelector('[data-component="atoms.icon"]')
    if (!icon) return
    icon.classList.add('transition-transform')
    icon.classList.remove('rotate-180')
}

const toggleSubmenu = (item, button, subMenu) => {
    const isOpen = subMenu.dataset.state === 'open'
    subMenu.dataset.state = isOpen ? 'closed' : 'open'
    subMenu.classList.toggle('hidden')
    button.setAttribute('aria-expanded', String(!isOpen))
    toggleFlipIcon(item)
}

const closeSubmenu = (item, button, subMenu) => {
    subMenu.dataset.state = 'closed'
    subMenu.classList.add('hidden')
    button.setAttribute('aria-expanded', 'false')
    unflipIcon(item)
}

const initSupportNavigation = (component) => {
    const navItems = component.querySelectorAll('[data-component-part="support-navigation.menu-item"]')

    navItems.forEach((item) => {
        const toggleButton = item.querySelector('button[data-toggles-submenu="true"]')
        const subMenu = item.querySelector('[data-component-part="support-navigation.menu"]')

        if (!toggleButton || !subMenu) return

        // 🔍 Check: Gibt es im Submenü ein aktives Element?
        const hasActiveChild = subMenu.querySelector('.active') !== null

        if (hasActiveChild) {
            subMenu.dataset.state = 'open'
            subMenu.classList.remove('hidden')
            toggleButton.setAttribute('aria-expanded', 'true')
            flipIcon(item)
        } else {
            subMenu.dataset.state = 'closed'
            subMenu.classList.add('hidden')
            toggleButton.setAttribute('aria-expanded', 'false')
        }

        toggleButton.addEventListener('click', (e) => {
            e.preventDefault()
            toggleSubmenu(item, toggleButton, subMenu)
        })

        document.addEventListener('click', (e) => {
            const isToggle = toggleButton.contains(e.target)
            const isInMenu = item.contains(e.target)
            const hasActiveItem = subMenu.querySelector('.active')

            // Nur schließen, wenn nicht aktiv
            if (!isToggle && !isInMenu && subMenu.dataset.state === 'open' && !hasActiveItem) {
                closeSubmenu(item, toggleButton, subMenu)
            }
        })
    })
}

const initSupportNavigations = () => {
    document.querySelectorAll('[data-component="molecules.support-navigation"]').forEach(component => {
        initSupportNavigation(component)
    })
}

export default initSupportNavigations