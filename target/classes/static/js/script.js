const API_URL = '/api/patients';

// DOM Elements
const patientTableBody = document.getElementById('patientTableBody');
const totalPatientsEl = document.getElementById('totalPatients');
const addPatientBtn = document.getElementById('addPatientBtn');
const patientModal = document.getElementById('patientModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addPatientForm = document.getElementById('addPatientForm');

// State
let patients = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchPatients);
addPatientBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
patientModal.addEventListener('click', (e) => {
    if (e.target === patientModal) closeModal();
});
addPatientForm.addEventListener('submit', handleFormSubmit);

// Functions
async function fetchPatients() {
    try {
        const response = await fetch(API_URL);
        patients = await response.json();
        renderPatients();
        updateStats();
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

function renderPatients() {
    patientTableBody.innerHTML = '';

    if (patients.length === 0) {
        patientTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No patients found. Add one!</td></tr>';
        return;
    }

    patients.forEach(patient => {
        const tr = document.createElement('tr');

        // Status Class Logic
        let statusClass = 'status-Under';
        if (patient.status === 'Admitted') statusClass = 'status-Admitted';
        else if (patient.status === 'Discharged') statusClass = 'status-Discharged';
        // 'Under Observation' fallback uses status-Under logic partially

        tr.innerHTML = `
            <td>#${patient.id}</td>
            <td>
                <div style="font-weight: 500;">${patient.name}</div>
                <div style="font-size: 0.8rem; color: #64748B;">${patient.contactNumber || 'N/A'}</div>
            </td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.disease}</td>
            <td><span class="status-badge ${statusClass}">${patient.status}</span></td>
            <td>
                <button class="btn-action delete" onclick="deletePatient(${patient.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </td>
        `;
        patientTableBody.appendChild(tr);
    });
}

function updateStats() {
    totalPatientsEl.textContent = patients.length;
}

function openModal() {
    patientModal.classList.add('active');
}

function closeModal() {
    patientModal.classList.remove('active');
    addPatientForm.reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const newPatient = {
        name: document.getElementById('pName').value,
        age: parseInt(document.getElementById('pAge').value),
        gender: document.getElementById('pGender').value,
        disease: document.getElementById('pDisease').value,
        contactNumber: document.getElementById('pContact').value,
        status: document.getElementById('pStatus').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPatient)
        });

        if (response.ok) {
            closeModal();
            fetchPatients();
        } else {
            alert('Failed to save patient');
        }
    } catch (error) {
        console.error('Error saving patient:', error);
    }
}

async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchPatients();
        } else {
            alert('Failed to delete patient');
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
    }
}

// Global scope for delete wrapper
window.deletePatient = deletePatient;


/* Search Logic */
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        try {
            const [patientsRes, doctorsRes] = await Promise.all([
                fetch(`/api/patients/search?name=${encodeURIComponent(query)}`),
                fetch(`/api/doctors/search?name=${encodeURIComponent(query)}`)
            ]);

            const patients = patientsRes.ok ? await patientsRes.json() : [];
            const doctors = doctorsRes.ok ? await doctorsRes.json() : [];

            renderSearchResults(patients, doctors);
        } catch (error) {
            console.error('Search error:', error);
        }
    }, 300));

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

function renderSearchResults(patients, doctors) {
    searchResults.innerHTML = '';

    if (patients.length === 0 && doctors.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item"><span>No results found</span></div>';
        searchResults.classList.add('active');
        return;
    }

    searchResults.classList.add('active');

    if (patients.length > 0) {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'search-result-category';
        categoryHeader.textContent = 'Patients';
        searchResults.appendChild(categoryHeader);

        patients.forEach(p => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<strong>${p.name}</strong><span>${p.disease || 'N/A'} - ${p.status}</span>`;
            div.addEventListener('click', () => {
                alert(`Selected Patient: ${p.name}\nID: ${p.id}\nDisease: ${p.disease}`);
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
            searchResults.appendChild(div);
        });
    }

    if (doctors.length > 0) {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'search-result-category';
        categoryHeader.textContent = 'Doctors';
        searchResults.appendChild(categoryHeader);

        doctors.forEach(d => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<strong>Dr. ${d.name}</strong><span>${d.specialization}</span>`;
            div.addEventListener('click', () => {
                alert(`Selected Doctor: Dr. ${d.name}\nSpecialty: ${d.specialization}\nContact: ${d.contactInfo || 'N/A'}`);
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
            searchResults.appendChild(div);
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
