function startQuiz() {
    // Nasconde la hero section
    document.querySelector('.hero').style.display = 'none';
    
    // Mostra il quiz container
    document.getElementById('quizContainer').style.display = 'block';
    
    // Mostra il primo step del quiz
    document.getElementById('step-safety').classList.add('active');
    
    // Scroll in alto
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let currentStep = 0;
let stepHistory = []; // ✅ QUESTA RIGA MANCAVA!

function updateProgress() {
    const progress = document.getElementById('progress');
    if (currentStep === 0) progress.style.width = '0%';
    else if (currentStep === 1) progress.style.width = '33%';
    else if (currentStep === 2) progress.style.width = '50%';
    else if (currentStep === 3) progress.style.width = '66%';
    else if (currentStep === 4) progress.style.width = '100%';
}

function nextStep(stepId) {
    // Salva lo step corrente nello stack (prima di cambiarlo)
    const currentActive = document.querySelector('.step.active');
    if (currentActive && currentActive.id !== stepId) {
        stepHistory.push(currentActive.id);
    }
    
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
    
    if (stepId === 'step-safety') currentStep = 1;
    if (stepId === 'step-safety-fail') currentStep = 2;
    if (stepId === 'step-profile') currentStep = 3;
    if (stepId === 'step-result') currentStep = 4;
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    if (stepHistory.length === 0) {
        // Se non c'è cronologia, torna alla hero
        document.querySelector('.hero').style.display = 'block';
        document.getElementById('quizContainer').style.display = 'none';
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        stepHistory = [];
        currentStep = 0;
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    const previousStep = stepHistory.pop();
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(previousStep).classList.add('active');
    
    // Aggiorna currentStep in base allo step precedente
    if (previousStep === 'step-safety') currentStep = 1;
    if (previousStep === 'step-safety-fail') currentStep = 2;
    if (previousStep === 'step-profile') currentStep = 3;
    if (previousStep === 'step-result') currentStep = 4;
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkSafety() {
    const dangerFlags = ['safe1', 'safe2', 'safe3', 'safe4'];
    let isSafe = true;
    
    dangerFlags.forEach(name => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        if (selected && selected.value === 'yes') {
            isSafe = false;
        }
    });

    if (!isSafe) {
        nextStep('step-safety-fail');
    } else {
        nextStep('step-profile');
    }
}

function showProfile() {
    const selected = document.querySelector('input[name="profile"]:checked');
    if (!selected) {
        alert('Per favore, seleziona il tuo obiettivo principale per continuare.');
        return;
    }

    const profiles = {
        women: {
            title: "🌸 Profilo: Sincronizzazione Femminile",
            desc: "Il tuo corpo è governato da un'orchestra ormonale complessa (estrogeni, progesterone, grelina). Un protocollo rigido potrebbe stressare la tua tiroide o bloccare l'ovulazione. Il tuo approccio deve essere <strong>ciclico e rispettoso delle tue fasi</strong>.",
            chapters: ["Cap 2: Il Digiuno al Femminile", "Cap 7: Nutrire il Digiuno (Focus Ormoni)", "Cap 8: Ostacoli e Sostenibilità"]
        },
        metabolic: {
            title: "🔥 Profilo: Reset Metabolico",
            desc: "Il tuo obiettivo è abbassare i livelli di insulina a riposo per permettere al corpo di accedere finalmente alle riserve di grasso viscerale. Il digiuno sarà la tua chiave per spegnere l'infiammazione cronica e riattivare il metabolismo.",
            chapters: ["Cap 1: La Macchina del Corpo", "Cap 3: Riavviare il Metabolismo", "Cap 7: Cosa Mettere nel Piatto"]
        },
        athlete: {
            title: "🏋️ Profilo: Performance & Ricomposizione",
            desc: "Vuoi perdere grasso mantenendo (o aumentando) la massa magra e la forza. Il segreto non è il digiuno in sé, ma il <strong>timing dei nutrienti</strong> e la gestione strategica delle proteine attorno al tuo allenamento.",
            chapters: ["Cap 4: Oltre i Limiti (Sportivi)", "Cap 1: Switch Metabolico e Chetoni", "Cap 7: Timing dei Nutrienti"]
        },
        biohacker: {
            title: "🧠 Profilo: Biohacking & Longevità",
            desc: "Non cerchi solo l'estetica, ma l'ottimizzazione. Vuoi sfruttare l'autofagia, il BDNF e la riduzione della neuroinfiammazione per proteggere il tuo cervello e rallentare l'orologio biologico.",
            chapters: ["Cap 5: Biohacking e Longevità", "Cap 1: Autofagia e Corpi Chetonici", "Cap 8: Sostenibilità a Lungo Termine"]
        },
        simplicity: {
            title: "🧘‍♀️ Profilo: Libertà Mentale",
            desc: "Sei esausto dalle diete restrittive e dal conteggio ossessivo. Il tuo percorso ti insegnerà a usare l'orologio come unica regola, riducendo lo stress psicologico e ritrovando il piacere di mangiare senza sensi di colpa.",
            chapters: ["Cap 6: Liberi dal Conteggio", "Cap 8: Vita Sociale e Digiuno", "Cap 7: Il Codice delle Bevande"]
        }
    };

    const data = profiles[selected.value];
    document.getElementById('result-title').innerText = data.title;
    document.getElementById('result-desc').innerHTML = data.desc;
    
    const chapContainer = document.getElementById('result-chapters');
    chapContainer.innerHTML = '';
    data.chapters.forEach(chap => {
        const tag = document.createElement('span');
        tag.className = 'chapter-tag';
        tag.innerText = chap;
        chapContainer.appendChild(tag);
    });

    // NUOVO: Aggiungi messaggio pre-acquisto
    const preBuyMessage = document.createElement('div');
    preBuyMessage.style.marginTop = '20px';
    preBuyMessage.style.padding = '15px';
    preBuyMessage.style.background = '#FFF3E0';
    preBuyMessage.style.borderLeft = '4px solid #FFA726';
    preBuyMessage.style.borderRadius = '0 8px 8px 0';
    preBuyMessage.innerHTML = `
        <strong>🎯 Il tuo profilo è stato identificato!</strong><br>
        I capitoli chiave per te sono stati selezionati. 
        Vuoi accedere al protocollo completo con tutti gli 8 capitoli, 
        le tabelle operative e gli action plan personalizzati?
    `;
    document.getElementById('step-result').appendChild(preBuyMessage);

    // NUOVO: Aggiungi pulsante di acquisto
    const buyButton = document.createElement('button');
    buyButton.className = 'btn';
    buyButton.style.marginTop = '20px';
    buyButton.style.background = '#FFA726';
    buyButton.innerText = 'Ottieni il Protocollo Completo — Solo €37';
    buyButton.onclick = () => {
        // Salva il profilo selezionato (opzionale)
        localStorage.setItem('selected_profile', selected.value);
        
        // ⚠️ SOSTITUISCI con il tuo link Gumroad reale!
        window.location.href = 'https://marberto.gumroad.com/l/ksbxkm';
    };
    
    document.getElementById('step-result').appendChild(buyButton);

    nextStep('step-result');
}

// Scorciatoie da tastiera
document.addEventListener('keydown', (e) => {
    // Ignora se l'utente sta scrivendo in un input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Solo se il quiz è visibile
    const quizVisible = document.getElementById('quizContainer').style.display !== 'none';
    if (!quizVisible) return;
    
    if (e.key === 'Escape' || e.key === 'ArrowLeft') {
        // Indietro solo se non siamo nel risultato
        const activeStep = document.querySelector('.step.active');
        if (activeStep && activeStep.id !== 'step-result' && activeStep.id !== 'step-safety-fail') {
            goBack();
        }
    }
});