// ============================================
// CONFIGURAZIONE: Mappa i profili agli URL WordPress
// ============================================
const MAP_PAGINE_RISULTATO = {
  'ormoni': 'https://nutripop.altervista.org/digiuno-intermittente-donne-pcos-la-guida-scientifica-per-ritrovare-lequilibrio-ormonale/',
  'grasso-viscerale': 'https://nutripop.altervista.org/digiuno-intermittente-per-perdere-grasso-viscerale-e-insulino-resistenza-il-reset-che-il-tuo-corpo-chiede/',
  'performance': ' https://nutripop.altervista.org/digiuno-intermittente-per-performance-sportiva-e-massa-magra-ottimizzazione-e-recupero/',
  'cervello': 'https://nutripop.altervista.org/digiuno-intermittente-per-focus-mentale-come-liberare-il-cervello-dalla-nebbia/',
  'liberta': 'https://nutripop.altervista.org/digiuno-intermittente-senza-contare-calorie-la-guida-alla-liberta-mentale/'
};

// Variabile per tracciare lo step corrente
let currentStep = 'hero';
let stepHistory = [];

// ============================================
// FUNZIONI DI NAVIGAZIONE
// ============================================

function startQuiz() {
  document.querySelector('.hero').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';
  showStep('step-safety');
  updateProgress(33);
}

function showStep(stepId) {
  // Nascondi tutti gli step
  document.querySelectorAll('.step').forEach(step => {
    step.style.display = 'none';
  });
  
  // Mostra lo step richiesto
  document.getElementById(stepId).style.display = 'block';
  
  // Salva nella cronologia
  if (currentStep !== stepId) {
    stepHistory.push(currentStep);
  }
  currentStep = stepId;
  
  // Scroll in alto
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  if (stepHistory.length > 0) {
    const previousStep = stepHistory.pop();
    showStep(previousStep);
    
    // Aggiorna la barra di progresso
    if (previousStep === 'step-safety') {
      updateProgress(33);
    } else if (previousStep === 'step-profile') {
      updateProgress(66);
    }
  } else {
    // Torna alla hero
    document.querySelector('.hero').style.display = 'block';
    document.getElementById('quizContainer').style.display = 'none';
    currentStep = 'hero';
  }
}

function updateProgress(percent) {
  document.getElementById('progress').style.width = percent + '%';
}

// ============================================
// STEP 1: Verifica Sicurezza
// ============================================

function checkSafety() {
  const safe1 = document.querySelector('input[name="safe1"]:checked').value;
  const safe2 = document.querySelector('input[name="safe2"]:checked').value;
  const safe3 = document.querySelector('input[name="safe3"]:checked').value;
  const safe4 = document.querySelector('input[name="safe4"]:checked').value;
  
  // Se almeno una risposta è "yes", blocca
  if (safe1 === 'yes' || safe2 === 'yes' || safe3 === 'yes' || safe4 === 'yes') {
    showStep('step-safety-fail');
    updateProgress(33);
  } else {
    // Tutti "no", procedi alla Fase 2
    showStep('step-profile');
    updateProgress(66);
  }
}

// ============================================
// STEP 2: Mostra Form Email (INVECE del risultato diretto)
// ============================================

function showProfile() {
  const selectedProfile = document.querySelector('input[name="profile"]:checked');
  
  if (!selectedProfile) {
    alert('Per favore, seleziona un profilo per continuare.');
    return;
  }
  
  const profiloScelto = selectedProfile.value;
  
  // Salva il profilo nel campo nascosto del form
  document.getElementById('hidden-profilo').value = profiloScelto;
  
  // Mostra il form email (NON il risultato diretto)
  showStep('step-email-form');
  updateProgress(100);
}

// ============================================
// STEP 2.5: Gestione Invio Form Email
// ============================================

document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  console.log('✅ Step 1: Form email intercettato!');
  
  const form = event.target;
  const submitBtn = document.getElementById('submitBtn');
  const profilo = document.getElementById('hidden-profilo').value;
  const email = document.getElementById('emailInput').value;
  
  console.log('✅ Step 2: Profilo:', profilo);
  console.log('✅ Step 3: Email:', email);
  
  // Disabilita il bottone
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Elaborazione in corso...';
  submitBtn.style.backgroundColor = '#9ca3af';
  
  // Nascondi messaggi precedenti
  document.getElementById('form-success').style.display = 'none';
  document.getElementById('form-error').style.display = 'none';
  
  // Invio a Formspree
  fetch('https://formspree.io/f/xjgqdykq', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      profilo: profilo,
      privacy_consent: document.getElementById('privacy-consent').checked
    })
  })
  .then(response => {
    console.log('✅ Step 4: Risposta Formspree:', response.status);
    
    if (response.ok) {
      console.log('✅ Step 5: Email inviata!');
      
      // Mostra messaggio di successo
      document.getElementById('form-success').style.display = 'block';
      
      // Determina l'URL di destinazione
      const urlDestinazione = MAP_PAGINE_RISULTATO[profilo] || MAP_PAGINE_RISULTATO['liberta'];
      
      console.log('🚀 Step 6: Redirect a:', urlDestinazione);
      
      // Redirect dopo 800ms
      setTimeout(() => {
        window.location.href = urlDestinazione;
      }, 800);
      
    } else {
      console.error('❌ Errore Formspree:', response.status);
      
      document.getElementById('form-error').style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = '📩 Mostra il mio profilo e sblocca la guida';
      submitBtn.style.backgroundColor = '#22c55e';
    }
  })
  .catch(error => {
    console.error(' Errore di rete:', error);
    
    document.getElementById('form-error').style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = '📩 Mostra il mio profilo e sblocca la guida';
    submitBtn.style.backgroundColor = '#22c55e';
  });
});