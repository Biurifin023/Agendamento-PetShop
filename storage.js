const STORAGE_KEY = 'petshop-appointments'

export function loadAppointments() {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
        return []
    }

    try {
        return JSON.parse(saved)
    } catch {
        return []
    }
}

export function saveAppointments(appointments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
}
