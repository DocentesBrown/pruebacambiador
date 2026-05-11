const modal = document.getElementById('customizerModal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');
const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressBar = document.getElementById('progressBar');
const form = document.getElementById('customForm');

let currentStep = 1;
const totalSteps = 7;

// Open/Close Modal
openBtn.onclick = () => modal.style.display = 'block';
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }

// Navigation logic
function updateSteps() {
    steps.forEach((step, idx) => {
        step.classList.toggle('active', idx === currentStep - 1);
    });

    // Update buttons
    prevBtn.disabled = currentStep === 1;
    nextBtn.textContent = currentStep === totalSteps ? 'Finalizar y Pedir' : 'Siguiente';

    // Progress Bar
    const progress = (currentStep / totalSteps) * 100;
    progressBar.style.width = progress + '%';

    updateSummary();
}

nextBtn.onclick = () => {
    if (currentStep < totalSteps) {
        currentStep++;
        updateSteps();
    } else {
        finishOrder();
    }
};

prevBtn.onclick = () => {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
    }
};

// Summary & Image logic
function updateSummary() {
    const formData = new FormData(form);
    const summaryList = document.getElementById('summaryList');
    
    const print = formData.get('print') || '-';
    const cut = formData.get('cut') || '-';
    const size = formData.get('size') || '-';
    const color = formData.get('color') || '-';

    summaryList.innerHTML = `
        <li><strong>Estampa:</strong> ${print}</li>
        <li><strong>Corte:</strong> ${cut}</li>
        <li><strong>Talle:</strong> ${size}</li>
        <li><strong>Color:</strong> ${color}</li>
    `;

    // Actualizar visualización (Simulado)
    const overlay = document.getElementById('printOverlay');
    const selectedPrintInput = document.querySelector('input[name="print"]:checked');
    
    if (selectedPrintInput) {
        overlay.src = selectedPrintInput.dataset.img;
        overlay.style.display = 'block';
    }

    // Lógica para cambiar la remera base según el corte elegido
    const baseImg = document.getElementById('shirtBase');
    if (cut === 'Femenino') {
        baseImg.src = "https://via.placeholder.com/400x500/eee/333?text=Modelo+Femenino";
    } else if (cut === 'Unisex') {
        baseImg.src = "https://via.placeholder.com/400x500/ddd/333?text=Modelo+Unisex";
    }
}

// Escuchar cambios en cualquier input para actualizar vista previa al instante
form.addEventListener('change', updateSummary);

function finishOrder() {
    const formData = new FormData(form);
    let message = "¡Hola Sin Recreo! Quiero encargar una remera personalizada:\n\n";
    
    for (let [key, value] of formData.entries()) {
        message += `* ${key}: ${value}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5491123456789?text=${encodedMessage}`;
    
    alert("¡Pedido generado! Te redirigiremos a WhatsApp para finalizar.");
    window.open(whatsappUrl, '_blank');
    modal.style.display = 'none';
}
