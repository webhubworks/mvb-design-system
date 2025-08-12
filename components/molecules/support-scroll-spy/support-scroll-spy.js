const initScrollSpy = component => {

    const sections = Array.from(document.querySelectorAll('.scroll-spy-target'))
    const navLinks = Array.from(component.querySelectorAll('.scroll-spy-link'))

    if (!sections.length || !navLinks.length) return

    const offsetAttr = component.getAttribute('data-offset')
    const offset = Number.parseInt(offsetAttr, 10)
    const scrollOffset = Number.isNaN(offset) ? 120 : offset

    const onScroll = () => {
        const scrollPos = window.scrollY + scrollOffset
        let current = null

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                current = section.getAttribute('id')
            }
        })

        navLinks.forEach(link => {
            if (current && link.getAttribute('href') === `#${current}`) {
                link.dataset.active = 'true'
            } else {
                delete link.dataset.active
            }
        })
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
}

const initScrollSpies = () => {
    document.querySelectorAll('[data-component="molecules.support-scroll-spy"]').forEach(component => {
        initScrollSpy(component)
    })
}

export default initScrollSpies