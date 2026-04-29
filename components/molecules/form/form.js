const initForms = () => {
    let forms = document.querySelectorAll('[data-freeform-tailwind]')
    forms.forEach(function(formElement) {
        formElement.addEventListener('freeform-ready', function(event) {
            let t = event.freeform
            console.log(t)
            t.setOption('errorClassList', ['mt-1', 'text-base', 'font-semibold', 'text-monza-600'])
            t.setOption('errorClassField', ['outline-2', '-outline-offset-1', 'outline-monza-600'])
        })
        formElement.addEventListener('freeform-render-success', function(t) {
            t.preventDefault()
            formElement.querySelector('.freeform-error-banner').classList.add('hidden')
            formElement.querySelector('.freeform-success-banner').classList.remove('hidden');
        })
        formElement.addEventListener('freeform-render-form-errors', function(t) {
            t.preventDefault()
            formElement.querySelector('.freeform-success-banner').classList.add('hidden');
            formElement.querySelector('.freeform-error-banner').classList.remove('hidden')
        })
        formElement.addEventListener('freeform-on-submit', function(e) {
            let t = e.form.getAttribute('data-id')
            forms.forEach(function(e) {
                let r = e.getAttribute('data-id')
                t !== r && (e.querySelectorAll('[data-field-errors]').forEach((e) => e.remove()), e.querySelectorAll('.freeform-input').forEach((e) => e.classList.remove('border-monza-500')))
            })
        })
    })
    // document.querySelectorAll('.freeform-file-upload-container').forEach((container) => {
    //     const input = container.querySelector('.freeform-file-upload-input')
    //     const display = container.querySelector('.freeform-file-name-display')
    //     if (!input || !display) return
    //     input.addEventListener('change', function() {
    //         if (input.files.length > 0) {
    //             const names = Array.from(input.files).map((f) => f.name).join(', ')
    //             display.textContent = `Selected files: ${names}`
    //         } else {
    //             display.textContent = 'No files selected'
    //         }
    //     })
    // })
}

export default initForms
