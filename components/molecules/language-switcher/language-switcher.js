import { convertRemToPixels } from '@js/_utils.js'

const initLanguageSwitcher = component => {
    const trigger = component.querySelector('[data-component-part="language-switcher.trigger"]')
    const subMenu = component.querySelector('[data-component-part="language-switcher.sub-menu"]')

    let styles = getComputedStyle(document.documentElement)
    let lgBreakpointRem = styles.getPropertyValue('--breakpoint-lg')

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

        trigger.addEventListener('mouseenter', () => {
            if (window.innerWidth < convertRemToPixels(lgBreakpointRem)) {
                return
            }
            timer = setTimeout(() => {
                subMenu.dataset.state = 'open'
            }, 200)
        })

        trigger.addEventListener('mouseleave', () => {
            if (window.innerWidth < convertRemToPixels(lgBreakpointRem)) {
                return
            }
            clearTimeout(timer)
            timer = setTimeout(() => {
                subMenu.dataset.state = 'closed'
            }, 200)
        })
    }
}

const initLanguageSwitchers = () => {
    document.querySelectorAll('[data-component="language-switcher"]').forEach(component => {
        initLanguageSwitcher(component)
    })
}

export default initLanguageSwitchers
