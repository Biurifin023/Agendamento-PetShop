import { loadAppointments, saveAppointments } from './storage.js'

const openModalBtn = document.getElementById('open-modal')
const modalOverlay = document.getElementById('modal-overlay')
const modalBackDrop = document.querySelector('.modal-backdrop')
const dateInput = document.getElementById('date')
const appointmentDate = document.getElementById('appointment-date')
const appointmentHour = document.getElementById('appointment-hour')
const phoneInput = document.getElementById('phone')
const appointmentForm = document.getElementById('appointment-form')
const dailySchedule = document.querySelector('.daily-schedule')
const closeModalBtn = document.getElementById('close-modal')

let appointments = loadAppointments()

function closeModal() {
    modalOverlay.classList.add('hidden')
    modalOverlay.setAttribute('aria-hidden', 'true')
    openModalBtn.focus()
}

openModalBtn.addEventListener('click', function () {
    appointmentDate.value = dateInput.value
    modalOverlay.classList.remove('hidden')
    modalOverlay.setAttribute('aria-hidden', 'false')
})

modalBackDrop.addEventListener('click', closeModal)
closeModalBtn.addEventListener('click', closeModal)

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
        closeModal()
    }
})

const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')
const day = String(today.getDate()).padStart(2, '0')
const formattedDate = `${year}-${month}-${day}`

dateInput.value = formattedDate
dateInput.min = formattedDate
appointmentDate.min = formattedDate
appointmentDate.value = formattedDate

const dateArrow = dateInput
    .closest('.input-icon-wrapper')
    .querySelector('.input-icon--right')

const appointmentDateArrow = appointmentDate
    .closest('.input-icon-wrapper')
    .querySelector('.input-icon--right')

const appointmentHourArrow = appointmentHour
    .closest('.input-icon-wrapper')
    .querySelector('.input-icon--right')

function openPicker(input) {
    input.focus({ preventScroll: true })

    if (typeof input.showPicker === 'function') {
        try {
            input.showPicker()
            return
        } catch (error) {
            // Safari iOS pode não suportar showPicker
        }
    }

    input.click()
}

function openPickerOnArrowClick(input, arrow) {
    function handleOpen(event) {
        event.preventDefault()
        event.stopPropagation()
        openPicker(input)
    }

    arrow.addEventListener('pointerup', handleOpen)
}

openPickerOnArrowClick(dateInput, dateArrow)
openPickerOnArrowClick(appointmentDate, appointmentDateArrow)
openPickerOnArrowClick(appointmentHour, appointmentHourArrow)

dateInput.addEventListener('change', function () {
    renderSchedule(dateInput.value)
})

function formatPhone(value) {
    const numbers = value.replace(/\D/g, '').slice(0, 11)

    if (numbers.length === 0) return ''
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

phoneInput.addEventListener('input', function () {
    this.value = formatPhone(this.value)
})

function normalizeHour(hour) {
    const [h, m] = hour.split(':')
    return `${h.padStart(2, '0')}:${m}`
}

function getPeriod(hourNumber) {
    if (hourNumber >= 9 && hourNumber <= 12) {
        return { name: 'morning', className: 'morning-schedule' }
    }
    if (hourNumber >= 13 && hourNumber <= 18) {
        return { name: 'afternoon', className: 'afternoon-schedule' }
    }
    if (hourNumber >= 19 && hourNumber <= 21) {
        return { name: 'evening', className: 'evening-schedule' }
    }
    return null
}

function isHourTaken(date, hour) {
    const normalizedHour = normalizeHour(hour)

    return appointments.some(function (appointment) {
        return appointment.date === date && normalizeHour(appointment.hour) === normalizedHour
    })
}

function createScheduleCard({ date, hour, petName, tutorName, service, className }) {
    const card = document.createElement('div')
    card.classList.add(className)
    card.dataset.date = date
    card.dataset.hour = normalizeHour(hour)

    card.innerHTML = `
        <span class="hour">${normalizeHour(hour)}</span>
        <div class="client">
            <strong>${petName}</strong>
            <p>/ ${tutorName}</p>
        </div>
        <p class="service">${service}</p>
        <button type="button">Remover agendamento</button>
    `

    return card
}

function addCardInOrder(period, card, hour) {
    const section = document.querySelector(`.${period.name}-header`).parentElement
    const cards = section.querySelectorAll('[class$="-schedule"]')
    const normalizedHour = normalizeHour(hour)

    for (const existingCard of cards) {
        const existingHour = normalizeHour(existingCard.querySelector('.hour').textContent.trim())

        if (normalizedHour < existingHour) {
            section.insertBefore(card, existingCard)
            return
        }
    }

    section.appendChild(card)
}

function renderSchedule(selectedDate) {
    document.querySelectorAll('.daily-schedule [class$="-schedule"]').forEach(function (card) {
        card.remove()
    })

    const dayAppointments = appointments
        .filter(function (appointment) {
            return appointment.date === selectedDate
        })
        .sort(function (a, b) {
            return normalizeHour(a.hour).localeCompare(normalizeHour(b.hour))
        })

    for (const appointment of dayAppointments) {
        const hourNumber = Number(normalizeHour(appointment.hour).split(':')[0])
        const period = getPeriod(hourNumber)

        if (!period) continue

        const card = createScheduleCard({
            date: appointment.date,
            hour: appointment.hour,
            petName: appointment.petName,
            tutorName: appointment.tutorName,
            service: appointment.service,
            className: period.className
        })

        addCardInOrder(period, card, appointment.hour)
    }
}

dailySchedule.addEventListener('click', function (event) {
    const button = event.target.closest('button')

    if (!button || button.textContent.trim() !== 'Remover agendamento') return

    const card = button.closest('[class$="-schedule"]')
    if (!card) return

    const cardDate = card.dataset.date
    const cardHour = card.dataset.hour

    appointments = appointments.filter(function (appointment) {
        return !(appointment.date === cardDate && normalizeHour(appointment.hour) === cardHour)
    })

    saveAppointments(appointments)
    renderSchedule(dateInput.value)
})

appointmentForm.addEventListener('submit', function (event) {
    event.preventDefault()

    const tutorName = document.getElementById('tutor-name').value.trim()
    const petName = document.getElementById('pet-name').value.trim()
    const service = document.getElementById('description').value.trim()
    const phone = phoneInput.value.trim()
    const date = appointmentDate.value
    const hour = normalizeHour(appointmentHour.value)

    if (hour === '00:00') {
        alert('Selecione um horário válido para o agendamento.')
        appointmentHour.focus()
        return
    }

    const hourNumber = Number(hour.split(':')[0])
    const period = getPeriod(hourNumber)

    if (!period) {
        alert('Escolha um horário entre 09h e 21h.')
        return
    }

    if (isHourTaken(date, hour)) {
        alert('Já existe um agendamento neste horário!')
        return
    }

    appointments.push({
        date,
        hour,
        petName,
        tutorName,
        service,
        phone
    })

    saveAppointments(appointments)
    renderSchedule(dateInput.value)

    appointmentForm.reset()
    appointmentDate.value = formattedDate
    appointmentHour.value = '00:00'

    closeModal()
})

renderSchedule(dateInput.value)