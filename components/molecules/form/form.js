const initForms = () => {
    let forms = document.querySelectorAll('[data-freeform-tailwind]')
    forms.forEach(function(e) {
        e.addEventListener('freeform-ready', function(e) {
            let t = e.freeform
            console.log(t)
            t.setOption('errorClassList', ['mt-1', 'text-sm', 'text-red-600'])
            t.setOption('errorClassField', ['outline-1', '-outline-offset-1', 'outline-red-600'])
        })
        e.addEventListener('freeform-render-success', function(t) {
            t.preventDefault()
            const r = document.createElement('div')
            r.classList.add('freeform-success-banner', 'rounded-md', 'bg-green-50', 'p-4', 'mb-10')
            const o = document.createElement('div')
            o.classList.add('flex')
            const n = document.createElement('div')
            n.classList.add('shrink-0')
            const d = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            d.setAttribute('class', 'size-6 text-green-400')
            d.setAttribute('viewBox', '0 0 20 20')
            d.setAttribute('fill', 'currentColor')
            d.setAttribute('aria-hidden', 'true')
            const a = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            a.setAttribute('fill-rule', 'evenodd')
            a.setAttribute('d', 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z')
            a.setAttribute('clip-rule', 'evenodd')
            d.appendChild(a)
            n.appendChild(d)
            const s = document.createElement('div')
            s.classList.add('ml-2')
            const i = document.createElement('h3'),
                l = e.getAttribute('data-success-message') || 'Form submitted successfully!'
            i.classList.add('text-md', 'font-medium', 'text-green-800'), (i.textContent = l), s.appendChild(i), o.appendChild(n), o.appendChild(s), r.appendChild(o), e.insertBefore(r, e.firstChild)
        })
        e.addEventListener('freeform-render-form-errors', function(t) {
            t.preventDefault()
            const r = e.querySelector('.freeform-error-banner')
            r && r.remove()
            const o = document.createElement('div')
            o.classList.add('freeform-error-banner', 'rounded-md', 'bg-red-50', 'p-4', 'mb-10')
            const n = document.createElement('div')
            n.classList.add('flex')
            const d = document.createElement('div')
            d.classList.add('shrink-0')
            const a = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            a.setAttribute('viewBox', '0 0 20 20'), a.setAttribute('fill', 'currentColor'), a.setAttribute('aria-hidden', 'true'), a.classList.add('size-6', 'text-red-400')
            const s = document.createElementNS('http://www.w3.org/2000/svg', 'path')
            s.setAttribute('fill-rule', 'evenodd'),
                s.setAttribute(
                    'd',
                    'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z',
                ),
                s.setAttribute('clip-rule', 'evenodd'),
                a.appendChild(s),
                d.appendChild(a)
            const i = document.createElement('div')
            i.classList.add('ml-3')
            const l = e.getAttribute('data-error-message') || 'There were errors in your submission',
                c = document.createElement('h3')
            c.classList.add('text-md', 'font-medium', 'text-red-800'), (c.textContent = l)
            const m = document.createElement('div')
            m.classList.add('mt-2', 'text-sm', 'text-red-700')
            const u = document.createElement('ul')
            u.setAttribute('role', 'list'),
                u.classList.add('list-disc', 'space-y-1', 'pl-5'),
                t.errors.forEach((e) => {
                    const t = document.createElement('li');
                    (t.textContent = e), u.appendChild(t)
                }),
            u.children.length > 0 && (m.appendChild(u), i.appendChild(m)),
                i.prepend(c),
                n.append(d, i),
                o.appendChild(n),
                e.insertBefore(o, e.firstChild)
        })
        e.addEventListener('freeform-on-submit', function(e) {
            let t = e.form.getAttribute('data-id')
            forms.forEach(function(e) {
                let r = e.getAttribute('data-id')
                t !== r && (e.querySelectorAll('[data-field-errors]').forEach((e) => e.remove()), e.querySelectorAll('.freeform-input').forEach((e) => e.classList.remove('border-red-500')))
            })
        })
    })
    document.querySelectorAll('.freeform-file-upload-container').forEach((e) => {
        const t = e.querySelector('.freeform-file-upload-input'),
            r = e.querySelector('.freeform-file-name-display')
        e.querySelector('.freeform-upload-btn').addEventListener('click', function() {
            t.click()
        })
        t.addEventListener('change', function() {
            if (t.files.length > 0) {
                const e = Array.from(t.files)
                    .map((e) => e.name)
                    .join(', ')
                r.textContent = `Selected files: ${e}`
            } else r.textContent = 'No files selected'
        })
    })
}

export default initForms