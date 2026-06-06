//Capturando os elementos para usa-los.
const openModalBtn = document.getElementById('open-modal')
const modalOverlay = document.getElementById('modal-overlay')
const modalBackDrop = document.querySelector('.modal-backdrop')
const dateInput = document.getElementById('date')
const appointmentDate = document.getElementById('appointment-date')
const appointmentHour = document.getElementById('appointment-hour')

//Abrir o modal ao clicar em novo agendamento.
openModalBtn.addEventListener('click', function () {
    modalOverlay.classList.remove('hidden')
    modalOverlay.setAttribute('aria-hidden', 'false')
})
//Fechar modal ao clicar no backdrop.
modalBackDrop.addEventListener('click', function () {
    modalOverlay.classList.add('hidden')
    modalOverlay.setAttribute('aria-hidden', 'true')
})
//Aplicando o dia atual nos calendarios.
const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')
const day = String(today.getDate()).padStart(2, '0')

const formattedDate = `${year}-${month}-${day}`

dateInput.value = formattedDate
dateInput.min = formattedDate 
appointmentDate.min = formattedDate
appointmentDate.value = formattedDate

//Adicionando o comportamento de abrir o calendario ao clicar na seta
const dateArrow = dateInput
    .closest('.input-icon-wrapper')
    .querySelector('.input-icon--right')

const appointmentDateArrow = appointmentDate
    .closest('.input-icon-wrapper')
    .querySelector('.input-icon--right')

const appointmentHourArrow = appointmentHour
    .closest('.input-icon-wrapper')
    .querySelector('.input-icon--right')

function openPickerOnArrowClick(input, arrow) {
    arrow.addEventListener('click', function () {
        input.showPicker()
    })
}

openPickerOnArrowClick(dateInput, dateArrow)
openPickerOnArrowClick(appointmentDate, appointmentDateArrow)
openPickerOnArrowClick(appointmentHour, appointmentHourArrow)



