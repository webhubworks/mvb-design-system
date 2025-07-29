import { DataTable } from 'simple-datatables'

const getDataLabel = (el, key, fallback) => {
    return el.dataset[`datatableLabel${key}`] || fallback
}

const randomId = (prefix = 'id') => `${prefix}-${Math.random().toString(36).substring(2, 9)}`

const initDatatable = (component) => {
    const tableElement = component.querySelector('table')
    if (!tableElement) return

    const labels = {
        placeholder: getDataLabel(component, 'Placeholder', 'Search...'),
        perPage: getDataLabel(component, 'PerPage', '{select} entries per page'),
        noRows: getDataLabel(component, 'NoRows', 'No entries found'),
        info: getDataLabel(component, 'Info', 'Showing {start}–{end} of {rows} entries'),
    }

    const options = {
        searchable: true,
        sortable: true,
        labels,
        perPageSelect: false,
        paging: false,
    }

    const datatable = new DataTable(tableElement, options)

    const searchInput = component.querySelector('.dataTable-input')
    if (searchInput) {
        const label = document.createElement('label')
        label.setAttribute('for', 'datatable-search')
        label.classList.add('sr-only')
        label.textContent = getDataLabel(component, 'SearchLabel', 'Search table')
        searchInput.id = 'datatable-search'
        searchInput.setAttribute('aria-label', label.textContent)
        searchInput.parentNode.insertBefore(label, searchInput)
    }

    const filterDefinitionRaw = component.dataset.filter
    if (!filterDefinitionRaw) return

    let filterDefinition = []
    try {
        filterDefinition = JSON.parse(filterDefinitionRaw)
    } catch (e) {
        console.error('Invalid data-filter JSON:', e)
        return
    }

    const thead = tableElement.querySelector('thead')
    const ths = Array.from(thead.querySelectorAll('th'))
    const columnIndexMap = {}
    ths.forEach((th, index) => {
        const group = th.dataset.filterGroup
        if (group) {
            columnIndexMap[group] = index
        }
    })

    const datatableTop = component.querySelector('.datatable-top')
    if (!datatableTop) return

    const filterContainer = document.createElement('div')
    filterContainer.classList.add('datatable-filters')
    filterContainer.setAttribute('role', 'region')
    filterContainer.setAttribute('aria-label', 'Table filter options')
    filterContainer.tabIndex = -1
    datatableTop.appendChild(filterContainer)

    const setupPopover = (button, panel) => {
        button.setAttribute('aria-expanded', 'false')
        button.setAttribute('aria-controls', panel.id)
        panel.setAttribute('role', 'dialog')
        panel.setAttribute('aria-hidden', 'true')
        panel.tabIndex = -1
        panel.hidden = true

        const closePopover = () => {
            panel.hidden = true
            panel.setAttribute('aria-hidden', 'true')
            button.setAttribute('aria-expanded', 'false')
            button.focus()
        }

        button.addEventListener('click', () => {
            const isOpen = !panel.hidden
            panel.hidden = isOpen
            panel.setAttribute('aria-hidden', isOpen)
            button.setAttribute('aria-expanded', !isOpen)
            if (!isOpen) {
                panel.querySelector('input')?.focus()
            }
        })

        panel.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                closePopover()
            }
        })
    }

    filterDefinition.forEach(filter => {
        const colIndex = columnIndexMap[filter.group]
        if (typeof colIndex !== 'number') return

        const wrapper = document.createElement('div')
        wrapper.classList.add('filter-group')

        const popoverId = randomId('popover')
        const buttonId = randomId('button')

        const popoverButton = document.createElement('button')
        popoverButton.type = 'button'
        popoverButton.id = buttonId
        popoverButton.classList.add('popover-toggle')

        const icon = document.createElement('i')
        icon.className = 'fa-solid fa-angle-down'
        icon.setAttribute('aria-hidden', 'true')

        popoverButton.textContent = filter.group + ' '
        popoverButton.appendChild(icon)

        const popover = document.createElement('div')
        popover.id = popoverId
        popover.classList.add('popover-content')

        setupPopover(popoverButton, popover)

        const checkboxList = document.createElement('ul')
        checkboxList.classList.add('checkbox-list')

        filter.items.forEach((value) => {
            const id = `filter-${filter.group}-${value}`.replace(/\s+/g, '-')

            const li = document.createElement('li')

            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.value = value
            checkbox.name = `filter-${filter.group}`
            checkbox.dataset.group = filter.group
            checkbox.dataset.column = colIndex
            checkbox.id = id

            const label = document.createElement('label')
            label.setAttribute('for', id)
            label.textContent = ' ' + value

            li.appendChild(checkbox)
            li.appendChild(label)
            checkboxList.appendChild(li)
        })

        popover.appendChild(checkboxList)
        wrapper.appendChild(popoverButton)
        wrapper.appendChild(popover)
        filterContainer.appendChild(wrapper)
    })

    const resetText = getDataLabel(component, 'Resetfilters', 'Reset filters')
    const resetWrapper = document.createElement('div')
    resetWrapper.classList.add('filter-reset')

    const resetButton = document.createElement('button')
    resetButton.type = 'button'
    resetButton.textContent = resetText
    resetButton.classList.add('reset-filters-button')
    resetButton.setAttribute('aria-label', 'Reset all filters')
    resetButton.disabled = true

    resetButton.addEventListener('click', () => {
        const checkboxes = filterContainer.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach(cb => (cb.checked = false))

        const rows = Array.from(tableElement.querySelector('tbody').rows)
        rows.forEach(row => {
            row.style.display = ''
        })

        const noRowsEl = component.querySelector('.dataTable-empty')
        if (noRowsEl) noRowsEl.style.display = 'none'

        resetButton.disabled = true
    })

    resetWrapper.appendChild(resetButton)
    filterContainer.appendChild(resetWrapper)

    const checkResetButton = () => {
        const anyChecked = filterContainer.querySelector('input[type="checkbox"]:checked')
        resetButton.disabled = !anyChecked
    }

    filterContainer.addEventListener('change', checkResetButton)
    filterContainer.addEventListener('input', checkResetButton)

    filterContainer.addEventListener('change', () => {
        const activeFilters = {}

        const checkboxes = filterContainer.querySelectorAll('input[type="checkbox"]:checked')
        checkboxes.forEach(cb => {
            const group = cb.dataset.group
            if (!activeFilters[group]) {
                activeFilters[group] = []
            }
            activeFilters[group].push(cb.value.toLowerCase())
        })

        const rows = Array.from(tableElement.querySelector('tbody').rows)
        let visibleCount = 0

        rows.forEach(row => {
            let show = true
            for (const [group, values] of Object.entries(activeFilters)) {
                const colIndex = columnIndexMap[group]
                const cell = row.cells[colIndex]
                const cellText = cell?.textContent?.trim().toLowerCase() || ''

                const match = values.some(val => cellText.includes(val))
                if (!match) {
                    show = false
                    break
                }
            }
            row.style.display = show ? '' : 'none'
            if (show) visibleCount++
        })

        const noRowsEl = component.querySelector('.dataTable-empty')
        if (noRowsEl) {
            noRowsEl.style.display = visibleCount === 0 ? '' : 'none'
        }
    })
}

const initDatatables = () => {
    document.querySelectorAll('[data-component="molecules.datatable"]').forEach((component) => {
        initDatatable(component)
    })
}

export default initDatatables
