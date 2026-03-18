const API_URL = '/api/doctors';

const doctorsGrid = document.getElementById('doctorsGrid');
const totalDoctorsEl = document.getElementById('totalDoctors');
const addDoctorBtn = document.getElementById('addDoctorBtn');
const doctorModal = document.getElementById('doctorModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addDoctorForm = document.getElementById('addDoctorForm');

let doctors = [];

// Sample Mock Data if API fails (for immediate UI testing)
const mockDoctors = [
    { id: 1, name: 'Dr. Sarah Smith', specialization: 'Cardiologist', experience: 10, status: 'Available' },
    { id: 2, name: 'Dr. James Wilson', specialization: 'Neurologist', experience: 15, status: 'Busy' },
    { id: 3, name: 'Dr. Emily Brown', specialization: 'Pediatrician', experience: 8, status: 'Available' },
    { id: 4, name: 'Dr. Michael Chen', specialization: 'Surgeon', experience: 12, status: 'On Leave' }
];

document.addEventListener('DOMContentLoaded', fetchDoctors);

addDoctorBtn.addEventListener('click', () => doctorModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => {
    doctorModal.classList.remove('active');
    addDoctorForm.reset();
});
doctorModal.addEventListener('click', (e) => {
    if (e.target === doctorModal) doctorModal.classList.remove('active');
});

addDoctorForm.addEventListener('submit', handleFormSubmit);

async function fetchDoctors() {
    try {
        const response = await fetch(API_URL);
        if(!response.ok) throw new Error("API not found");
        doctors = await response.json();
    } catch (error) {
        console.warn('Backend API not ready, using mock data for doctors.');
        doctors = mockDoctors;
    }
    renderDoctors();
    updateStats();
}

function renderDoctors() {
    doctorsGrid.innerHTML = '';
    
    doctors.forEach(doc => {
        // Generate a deterministic avatar color based on name length
        const card = document.createElement('div');
        card.className = 'doctor-card';
        
        card.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=random" class="doctor-img" alt="${doc.name}">
            <h3 class="doctor-name">${doc.name}</h3>
            <span class="doctor-specialty">${doc.specialization}</span>
            
            <div class="doctor-info">
                <span class="info-item"><i class="fa-solid fa-briefcase"></i> ${doc.experience} Years</span>
                <span class="info-item"><i class="fa-solid fa-clock"></i> ${doc.status}</span>
            </div>
            
            <div class="doc-actions">
                <button class="btn-outline" onclick="deleteDoctor(${doc.id})"><i class="fa-solid fa-trash"></i></button>
                <button class="btn-outline"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Profile</button>
            </div>
        `;
        doctorsGrid.appendChild(card);
    });
}

function updateStats() {
    totalDoctorsEl.innerText = doctors.length;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const newDoc = {
        name: document.getElementById('dName').value,
        specialization: document.getElementById('dSpec').value,
        experience: parseInt(document.getElementById('dExp').value),
        status: document.getElementById('dStatus').value
    };
    
    // Optimistic UI update
    doctors.push({ ...newDoc, id: Date.now() });
    renderDoctors();
    updateStats();
    doctorModal.classList.remove('active');
    addDoctorForm.reset();

    // Actual API call
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newDoc)
        });
    } catch (e) {
        console.error("Failed to save to backend (mock mode?)", e);
    }
}

async function deleteDoctor(id) {
    if(!confirm("Start deletion?")) return;
    
    // UI Remove
    doctors = doctors.filter(d => d.id !== id);
    renderDoctors();
    updateStats();

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
}
