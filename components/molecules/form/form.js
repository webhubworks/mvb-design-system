const initForms = () => {
    let forms = document.querySelectorAll('[data-freeform-tailwind]')
    forms.forEach(function(e) {
        e.addEventListener('freeform-ready', function(e) {
            let t = e.freeform
            console.log(t)
            t.setOption('errorClassList', ['mt-1', 'text-base', 'text-monza-600'])
            t.setOption('errorClassField', ['outline-1', '-outline-offset-1', 'outline-monza-600'])
        })
        e.addEventListener('freeform-render-success', function(t) {
            t.preventDefault()
            e.querySelector('.freeform-error-banner').classList.add('hidden')
            e.querySelector('.freeform-success-banner').classList.remove('hidden');
        })
        e.addEventListener('freeform-render-form-errors', function(t) {
            t.preventDefault()
            e.querySelector('.freeform-success-banner').classList.add('hidden');
            e.querySelector('.freeform-error-banner').classList.remove('hidden')
        })
        e.addEventListener('freeform-on-submit', function(e) {
            let t = e.form.getAttribute('data-id')
            forms.forEach(function(e) {
                let r = e.getAttribute('data-id')
                t !== r && (e.querySelectorAll('[data-field-errors]').forEach((e) => e.remove()), e.querySelectorAll('.freeform-input').forEach((e) => e.classList.remove('border-monza-500')))
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