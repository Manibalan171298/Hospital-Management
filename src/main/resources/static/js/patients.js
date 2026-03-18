const API_URL = '/api/patients';
const PAST_API_URL = '/api/patients/history'; // New endpoint

// DOM
const patientTableBody = document.getElementById('patientTableBody');
const addPatientBtn = document.getElementById('addPatientBtn');
const patientModal = document.getElementById('patientModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const addPatientForm = document.getElementById('addPatientForm');
const tabActive = document.getElementById('tabActive');
const tabHistory = document.getElementById('tabHistory');

let currentTab = 'active'; // 'active' or 'history'
let patients = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchPatients();
});

function switchTab(tab) {
    currentTab = tab;
    if (tab === 'active') {
        tabActive.classList.add('active');
        tabHistory.classList.remove('active');
        addPatientBtn.style.display = 'flex'; // Can add new patients
        fetchPatients();
    } else {
        tabHistory.classList.add('active');
        tabActive.classList.remove('active');
        addPatientBtn.style.display = 'none'; // Cannot add directly to history
        fetchHistory();
    }
}

async function fetchPatients() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch");
        patients = await response.json();
    } catch (e) {
        console.warn("Using mock data", e);
        // Mock data
        patients = []
    }
    renderPatients();
}

async function fetchHistory() {
    try {
        const response = await fetch(PAST_API_URL);
        if (!response.ok) throw new Error("Failed to fetch history");
        patients = await response.json();
    } catch (e) {
        console.warn("History API failed or not impl.", e);
        patients = [];
    }
    renderPatients();
}

function renderPatients() {
    patientTableBody.innerHTML = '';

    if (patients.length === 0) {
        patientTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #aaa;">No records found in ${currentTab}</td></tr>`;
        return;
    }

    patients.forEach(p => {
        const tr = document.createElement('tr');

        let statusClass = 'status-Under';
        if (p.status === 'Admitted') statusClass = 'status-Admitted';
        if (p.status === 'Discharged') statusClass = 'status-Discharged';

        // If history, maybe no delete button or different actions
        let actionsHtml = '';
        if (currentTab === 'active') {
            actionsHtml = `
                <button class="btn-action" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-action delete" title="Delete & Archive" onclick="deletePatient(${p.id || p.originalPatientId})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
        } else {
            actionsHtml = `<span style="color: #aaa; font-size: 0.8rem;">Archived on ${p.movedAt ? new Date(p.movedAt).toLocaleDateString() : 'N/A'}</span>`;
        }

        tr.innerHTML = `
            <td>#${p.id}</td>
            <td>
                <div style="font-weight: 600;">${p.name}</div>
            </td>
            <td>${p.age} / ${p.gender}</td>
            <td>${p.disease}</td>
            <td><span class="status-badge ${statusClass}">${p.status}</span></td>
            <td>${p.contactNumber || '-'}</td>
            <td>${actionsHtml}</td>
        `;
        patientTableBody.appendChild(tr);
    });
}

// Modal Logic
addPatientBtn.addEventListener('click', () => patientModal.classList.add('active'));
closeModalBtn.addEventListener('click', () => {
    patientModal.classList.remove('active');
    addPatientForm.reset();
});
addPatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newP = {
        name: document.getElementById('pName').value,
        age: document.getElementById('pAge').value,
        gender: document.getElementById('pGender').value,
        disease: document.getElementById('pDisease').value,
        contactNumber: document.getElementById('pContact').value,
        status: document.getElementById('pStatus').value
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newP)
        });
        patientModal.classList.remove('active');
        addPatientForm.reset();
        fetchPatients();
    } catch (e) { console.error(e); }
});

async function deletePatient(id) {
    if (!confirm("Delete this patient? Record will be moved to Past Patients.")) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchPatients(); // Refresh to see it gone
    } catch (e) { console.error(e); }
}

// Expose
window.deletePatient = deletePatient;
window.switchTab = switchTab;
