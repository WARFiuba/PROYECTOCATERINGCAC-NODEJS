function validate() {
    event.preventDefault();

    const motiveSelect = document.getElementById('motive');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const telInput = document.getElementById('tel');
    const emailInput = document.getElementById('email');
    const messageTextarea = document.getElementById('message');
    const privacyCheckbox = document.getElementById('privacity');

    clearErrors();

    if (motiveSelect.value === '') {
        showError('motive', 'Selecciona un motivo');
    }

    if (nameInput.value === '') {
        showError('name', 'Ingresa tu nombre');
    }

    if (surnameInput.value === '') {
        showError('surname', 'Ingresa tu apellido');
    }

    if (telInput.value === '') {
        showError('tel', 'Ingresa tu número de teléfono');
    } else if (!validatePhone(telInput.value)) {
        showError('tel', 'Ingresa un número de teléfono válido');
    }

    if (emailInput.value === '') {
        showError('email', 'Ingresa tu correo electrónico');
    } else if (!validateEmail(emailInput.value)) {
        showError('email', 'Ingresa un correo electrónico válido');
    }

    if (messageTextarea.value === '') {
        showError('message', 'Ingresa tu mensaje o consulta');
    }

    if (!privacyCheckbox.checked) {
        showError('privacity', 'Debes aceptar la política de privacidad');
    }

    const hasErrors = document.querySelectorAll('.error-message').length > 0;

    if (!hasErrors) {
        alert('¡Formulario enviado correctamente!, Muchas gracias');
    }
}

function validatePhone(phoneNumber) {
    const regex = /^[0-9\-\+\s]+$/;
    return regex.test(phoneNumber);
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(fieldId, errorMessage) {
    const errorElement = document.getElementById(`error-${fieldId}`);
    if (!errorElement) {
        const errorDiv = document.createElement('div');
        errorDiv.id = `error-${fieldId}`;
        errorDiv.classList.add('error-message');
        errorDiv.textContent = errorMessage;
        const fieldElement = document.getElementById(fieldId);
        fieldElement.parentNode.insertBefore(errorDiv, fieldElement.nextSibling);
    } else {
        errorElement.textContent = errorMessage;
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
}