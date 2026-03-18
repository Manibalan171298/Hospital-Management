const API_URL = '/api/appointments';

const appointmentsList = document.getElementById('appointmentsList');
const bookBtn = document.getElementById('bookBtn');
const bookModal = document.getElementById('bookModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const bookForm = document.getElementById('bookForm');

let appointments = [];
const mockAppointments = [
    { id: 1, patient: 'Alice Williams', doctor: 'Dr. Sarah Smith', date: '2025-10-25', time: '09:00', type: 'Checkup', status: 'Scheduled' },
    { id: 2, patient: 'Bob Jones', doctor: 'Dr. James Wilson', date: '2025-10-25', time: '11:00', type: 'Consultation', status: 'Completed' },
    { id: 3, patient: 'Charlie Davis', doctor: 'Dr. Emily Brown', date: '2025-10-26', time: '14:30', type: 'Surgery', status: 'Scheduled' }
];

document.addEventListener('DOMContentLoaded', fetchAppointments);

bookBtn.addEventListener('click', () => bookModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => {
    bookModal.classList.remove('active');
    bookForm.reset();
});

bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newAppt = {
        patient: document.getElementById('aPatient').value,
        doctor: document.getElementById('aDoctor').value,
        date: document.getElementById('aDate').value,
        time: document.getElementById('aTime').value,
        type: document.getElementById('aType').value,
        status: 'Scheduled'
    };

    // UI Update
    appointments.push({ ...newAppt, id: Date.now() });
    renderAppointments();
    bookModal.classList.remove('active');

    // API
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAppt)
        });
    } catch (e) { console.error(e); }
});

async function fetchAppointments() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("API not found");
        appointments = await response.json();
    } catch (e) {
        console.warn("Using mock appointments", e);
        appointments = mockAppointments;
    }
    renderAppointments();
}

function renderAppointments() {
    appointmentsList.innerHTML = '';

    // Sort by date/time
    appointments.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

    appointments.forEach(app => {
        const card = document.createElement('div');
        card.className = `appointment-card status-${app.status}`;

        card.innerHTML = `
            <div class="time-col">
                <div class="time">${app.time}</div>
                <div class="date">${new Date(app.date).toLocaleDateString()}</div>
            </div>
            <div class="details-col">
                <h3>${app.patient} with ${app.doctor}</h3>
                <p>
                    <span><i class="fa-solid fa-stethoscope"></i> ${app.type}</span>
                    <span><i class="fa-solid fa-note-sticky"></i> ID: #${app.id}</span>
                </p>
            </div>
            <div class="actions">
                <span class="status-badge status-${app.status}">${app.status}</span>
                <button class="btn-action delete" onclick="cancelAppointment(${app.id})"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
        appointmentsList.appendChild(card);
    });
}

async function cancelAppointment(id) {
    if (!confirm("Cancel this appointment?")) return;
    try {
        // UI
        const app = appointments.find(a => a.id === id);
        if (app) app.status = 'Cancelled';
        renderAppointments();

        await fetch(`${API_URL}/${id}/cancel`, { method: 'PUT' });
    } catch (e) { }
}

window.cancelAppointment = cancelAppointment;
