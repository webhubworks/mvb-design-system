import { arrow, autoPlacement, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'

const initTooltip = (component) => {
    const triggerElement = component.querySelector('[data-component="tooltip.trigger"]')
    const contentElement = component.querySelector('[data-component="tooltip.content"]')
    const arrowElement = component.querySelector('[data-component="tooltip.arrow"]')
    const arrowSize = 12;

    let cleanup

    const show = () => {
        contentElement.classList.remove('hidden')

        cleanup = autoUpdate(triggerElement, contentElement, () => {
            computePosition(triggerElement, contentElement, {
                middleware: [
                    offset(arrowSize),
                    shift({ padding: 5 }),
                    autoPlacement(),
                    arrow({ element: arrowElement }),
                ],
            }).then(({ x, y, middlewareData, placement }) => {
                Object.assign(contentElement.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                })

                const side = placement.split('-')[0]

                const staticSide = {
                    top: 'bottom',
                    right: 'left',
                    bottom: 'top',
                    left: 'right',
                }[side]

                if (middlewareData.arrow) {
                    const { x, y } = middlewareData.arrow
                    Object.assign(arrowElement.style, {
                        left: x != null ? `${x}px` : '',
                        top: y != null ? `${y}px` : '',
                        // Ensure the static side gets unset when
                        // flipping to other placements' axes.
                        right: '',
                        bottom: '',
                        [staticSide]: `${-arrowSize / 2}px`,
                        transform: 'rotate(45deg)',
                        position: 'absolute',
                        width: `${arrowSize}px`,
                        height: `${arrowSize}px`,
                    })
                }

            })
        })
    }

    const hide = () => {
        contentElement.classList.add('hidden')
        cleanup && cleanup()
    };

    [
        ['mouseenter', show],
        ['mouseleave', hide],
        ['focus', show],
        ['blur', hide],
    ].forEach(([event, listener]) => {
        triggerElement.addEventListener(event, listener)
    })
}

const initTooltips = () => {
    document.querySelectorAll('[data-component="tooltip"]').forEach((component) => {
        initTooltip(component)
    })
}

export default initTooltips
