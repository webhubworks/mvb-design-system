const initLightboxGallery = (component) => {

    const galleryItems = Array.from(component.querySelectorAll('.gallery-item'))

    const nextBtn = component.querySelector('[data-component-part="lightbox-gallery.next"]')
    const prevBtn = component.querySelector('[data-component-part="lightbox-gallery.prev"]')
    const closeBtn = component.querySelector('[data-component-part="lightbox-gallery.close"]')

    const lightbox = component.querySelector('[data-component-part="lightbox-gallery.lightbox"]')

    const figure = lightbox.querySelector('[data-component-part="lightbox-gallery.figure"]')
    const imageEl = lightbox.querySelector('[data-component-part="lightbox-gallery.image"]')
    const captionEl = lightbox.querySelector('[data-component-part="lightbox-gallery.caption"]')

    let currentIndex = 0
    let lastFocusedElement = null

    // Alle Bildinformationen aus den data-Attributen sammeln
    const images = galleryItems.map((btn) => {
        return {
            src: btn.getAttribute('data-image'),
            alt: btn.getAttribute('data-alt') || '',
            caption: btn.getAttribute('data-caption') || '',
            copyright: btn.getAttribute('data-copyright') || ''
        }
    })

    const fadeIn = (el, duration = 300) => {
        el.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration,
            fill: 'forwards',
            easing: 'ease-in-out'
        })
    }

    const fadeOut = (el, duration = 300) => {
        return el.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration,
            fill: 'forwards',
            easing: 'ease-in-out'
        }).finished
    }

    const updateLightbox = async () => {
        const { src, alt, caption, copyright } = images[currentIndex]

        // Parallel Caption & Bild ausblenden
        await Promise.all([
            fadeOut(imageEl),
            fadeOut(captionEl)
        ])

        // Vorbereitung für neuen Bildwechsel
        imageEl.style.opacity = 0
        captionEl.style.opacity = 0

        // Neues Bild setzen und auf "load" warten
        const imageLoaded = new Promise((resolve) => {
            imageEl.onload = () => resolve()
            imageEl.src = src
            imageEl.alt = alt
        })

        let captionHtml = ''
        if (caption) {
            captionHtml += `<span>${caption}</span>`
        }
        if (copyright) {
            captionHtml += `<span class="block text-xs text-gray-400 mt-1">© ${copyright}</span>`
        }

        captionEl.innerHTML = captionHtml || alt

        // Bild muss vollständig geladen sein, bevor eingeblendet wird

        await imageLoaded

        // Neu einblenden
        fadeIn(imageEl)
        fadeIn(captionEl)
    }

    const openLightbox = (index) => {
        currentIndex = index
        updateLightbox()
        lastFocusedElement = document.activeElement
        lightbox.classList.remove('hidden')
        imageEl.focus()
        document.body.classList.add('overflow-hidden')
    }

    const closeLightbox = () => {
        lightbox.classList.add('hidden')
        document.body.classList.remove('overflow-hidden')
        if (lastFocusedElement) {
            lastFocusedElement.focus()
        }
    }

    const showNext = () => {
        currentIndex = (currentIndex + 1) % images.length
        updateLightbox()
    }

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length
        updateLightbox()
    }

    // Fokusfalle – gültige Fokusziele sammeln
    const getFocusableElements = (container) => {
        return Array.from(
            container.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))
    }

    // Event-Handling

    galleryItems.forEach((btn, index) => {
        btn.addEventListener('click', () => openLightbox(index))
    })

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox)
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', showNext)
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', showPrev)
    }

    lightbox.addEventListener('keydown', (e) => {
        const focusableEls = getFocusableElements(lightbox)
        const firstEl = focusableEls[0]
        const lastEl = focusableEls[focusableEls.length - 1]

        if (e.key === 'Tab') {
            if (focusableEls.length === 0) return

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault()
                    lastEl.focus()
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault()
                    firstEl.focus()
                }
            }
        }

        if (e.key === 'Escape') {
            e.preventDefault()
            closeLightbox()
        }

        if (e.key === 'ArrowRight') {
            e.preventDefault()
            showNext()
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault()
            showPrev()
        }
    })
}

const initLightboxGalleries = () => {
    document.querySelectorAll('[data-component="organisms.lightbox-gallery"]').forEach((component) => {
        initLightboxGallery(component)
    })
}

export default initLightboxGalleries