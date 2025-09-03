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

// ✅ prüft jetzt auch das ITEM SELBST auf active/aria-current
const isItemSelfActive = (item) => {
    // 1) Item selbst (z. B. <li class="active"> …)
    if (
        item.classList?.contains('active') ||
        item.getAttribute?.('aria-current') === 'page'
    ) return true

    // 2) Direktes Label/Link im Item
    const directActiveEl = item.querySelector(
        ':scope > .active, :scope > a.active, :scope > [aria-current="page"], :scope > a[aria-current="page"]'
    )
    return !!directActiveEl
}

const initSupportNavigation = (component) => {
    const supportNav    = component
    const toggleButtons = document.querySelectorAll('[data-component-part="support-navigation.toggle-button"]')
    const navItems      = component.querySelectorAll('[data-component-part="support-navigation.menu-item"]')

    if (!supportNav || !toggleButtons.length) return

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const isOpen = supportNav.hasAttribute('data-open')
            if (isOpen) {
                supportNav.removeAttribute('data-open')
            } else {
                supportNav.setAttribute('data-open', 'true')
                const focusTarget = supportNav.querySelector('[data-component-part="support-navigation.toggle-button"]')
                if (focusTarget) window.requestAnimationFrame(() => focusTarget.focus())
            }
        })
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && supportNav.hasAttribute('data-open')) {
            supportNav.removeAttribute('data-open')
        }
    })

    document.addEventListener('click', (event) => {
        const isClickInside =
            supportNav.contains(event.target) ||
            [...toggleButtons].some((btn) => btn.contains(event.target))
        if (!isClickInside && supportNav.hasAttribute('data-open')) {
            supportNav.removeAttribute('data-open')
        }
    })

    navItems.forEach((item) => {
        const toggleButton = item.querySelector('button[data-toggles-submenu="true"]')
        const subMenu      = item.querySelector('[data-component-part="support-navigation.menu"]')
        if (!toggleButton || !subMenu) return

        const selfActive     = isItemSelfActive(item)
        const hasActiveChild = !!subMenu.querySelector('.active, [aria-current="page"]')
        const shouldOpen     = selfActive || hasActiveChild

        if (shouldOpen) {
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
            const isToggle      = toggleButton.contains(e.target)
            const isInMenu      = item.contains(e.target)
            const hasActiveItem = !!subMenu.querySelector('.active, [aria-current="page"]')
            const selfIsActive  = isItemSelfActive(item)
            if (!isToggle && !isInMenu && subMenu.dataset.state === 'open' && !hasActiveItem && !selfIsActive) {
                closeSubmenu(item, toggleButton, subMenu)
            }
        })
    })
}

const initSupportNavigations = () => {
    document
        .querySelectorAll('[data-component="molecules.support-navigation"]')
        .forEach((component) => initSupportNavigation(component))
}

export default initSupportNavigations