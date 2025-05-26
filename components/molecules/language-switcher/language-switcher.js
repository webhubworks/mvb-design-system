const initLanguageSwitcher = component => {
    const trigger = component.querySelector('[data-component-part="language-switcher.trigger"]')
    const subMenu = component.querySelector('[data-component-part="language-switcher.sub-menu"]')

    if (trigger && subMenu) {

        let timer

        window.addEventListener('click', e => {
            if (!component.contains(e.target)) {
                subMenu.dataset.state = 'closed'
            }
        })

        trigger.addEventListener('click', () => {
            if (subMenu.dataset.state === 'open') {
                subMenu.dataset.state = 'closed'
            } else {
                subMenu.dataset.state = 'open'
            }
        })

        // item.addEventListener('mouseenter', () => {
        //     if (window.innerWidth < convertRemToPixels(lgBreakpointRem)) {
        //         return
        //     }
        //     timer = setTimeout(() => {
        //         openSubmenu(item)
        //     }, 200)
        // })
    }
}

const initLanguageSwitchers = () => {
    document.querySelectorAll('[data-component="language-switcher"]').forEach(component => {
        initLanguageSwitcher(component)
    })
}

export default initLanguageSwitchers
