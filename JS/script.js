/**
 * js/script.js
 * FINAL VERSION: Pure JavaScript Friendly Chatbot (using Gemini API).
 * All logic, including Auth, Quiz, and Dashboard functions, is contained here.
 */

// --- GLOBAL CONFIGURATION ---

// Use a placeholder key; the environment securely provides the actual key during runtime.
const API_KEY = "AIzaSyCNIdjESLMBgS25b6dxJw8Wwk8rvfnuBrw"; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" + API_KEY;

// --- Global Constants & State ---
let quizQuestions = [];
let userScore = { Vata: 0, Pitta: 0, Kapha: 0 };
const totalQuestions = 12; 
let answeredQuestions = new Set(); 
const currentPage = window.location.pathname.split('/').pop();

// --- Initialization and Page Routing ---
document.addEventListener('DOMContentLoaded', () => {
    switch (currentPage) {
        case 'auth.html':
            initAuthPage();
            break;
        case 'quiz.html':
            initQuizPage();
            break;
        case 'dashboard.html':
            initDashboardPage();
            break;
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    // Initialize the chat feature on all relevant pages
    initChatFeature();
});

// --------------------------------------------------------------------------
// AUTHENTICATION (auth.html) LOGIC
// --------------------------------------------------------------------------

function initAuthPage() {
    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    const tabSignIn = document.getElementById('tab-signin');
    const tabSignUp = document.getElementById('tab-signup');

    tabSignIn.addEventListener('click', () => {
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
        signInForm.classList.remove('hidden');
        signUpForm.classList.add('hidden');
    });

    tabSignUp.addEventListener('click', () => {
        tabSignUp.classList.add('active');
        tabSignIn.classList.remove('active');
        signUpForm.classList.remove('hidden');
        signInForm.classList.add('hidden');
    });

    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        
        if (name && email) {
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            if (document.getElementById('ai-chat-window')) { 
                document.getElementById('ai-chat-window').classList.add('hidden');
            }
            window.location.href = 'quiz.html';
        }
    });

    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value.trim();
        
        if (localStorage.getItem('userEmail') === email) {
            localStorage.setItem('isLoggedIn', 'true');
            
            if (document.getElementById('ai-chat-window')) { 
                document.getElementById('ai-chat-window').classList.add('hidden');
            }
            
            if (localStorage.getItem('userDosha')) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'quiz.html';
            }
        } else {
            if (document.getElementById('ai-chat-window')) { 
                document.getElementById('ai-chat-window').classList.add('hidden');
            }
        }
    });
}

// --------------------------------------------------------------------------
// QUIZ (quiz.html) LOGIC
// --------------------------------------------------------------------------

async function initQuizPage() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'auth.html';
        return;
    }

    userScore = { Vata: 0, Pitta: 0, Kapha: 0 };
    answeredQuestions.clear();

    await loadQuizData();
    const quizForm = document.getElementById('dosha-quiz-form');
    quizForm.addEventListener('submit', handleSubmitQuiz);
}

async function loadQuizData() {
    try {
        const response = await fetch('Dosha_quiz.json'); 
        quizQuestions = await response.json();
        
        if (quizQuestions.length > 0) {
            displayQuestions();
        } else {
            document.getElementById('questions-area').innerHTML = '<p>Error: Could not load quiz questions.</p>';
        }
    } catch (error) {
        console.error('Error loading quiz data:', error);
    }
}

function displayQuestions() {
    const questionsArea = document.getElementById('questions-area');
    questionsArea.innerHTML = quizQuestions.map(q => `
        <div class="question-card" data-id="${q.id}">
            <h3>${q.question}</h3>
            ${q.options.map((option, index) => `
                <label class="option-label">
                    <input type="radio" 
                           name="question-${q.id}" 
                           value="${option.dosha}" 
                           data-question-id="${q.id}">
                    <span>${option.text}</span>
                </label>
            `).join('')}
        </div>
    `).join('');
    
    document.querySelectorAll('#questions-area input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', handleAnswer);
    });
}

function handleAnswer(event) {
    const radio = event.target;
    const questionId = radio.dataset.questionId;
    
    if (!answeredQuestions.has(questionId)) {
        answeredQuestions.add(questionId);
    }
    
    const submitButton = document.getElementById('submit-quiz-btn');
    if (answeredQuestions.size === totalQuestions) {
        submitButton.disabled = false;
    }
}

function calculateFinalScore() {
    let finalScore = { Vata: 0, Pitta: 0, Kapha: 0 };
    
    quizQuestions.forEach(q => {
        const selectedRadio = document.querySelector(`input[name="question-${q.id}"]:checked`);
        if (selectedRadio) {
            finalScore[selectedRadio.value]++;
        }
    });
    return finalScore;
}

function calculateDominantDosha(scores) {
    let maxScore = -1;
    let tieDoshas = [];

    for (const dosha in scores) {
        if (scores[dosha] > maxScore) {
            maxScore = scores[dosha];
            tieDoshas = [dosha]; 
        }
    }
    return tieDoshas.join('-');
}

function handleSubmitQuiz(e) {
    e.preventDefault();
    if (answeredQuestions.size !== totalQuestions) {
        console.error("Please answer all questions before submitting.");
        return;
    }

    const finalScores = calculateFinalScore();
    const dominantDosha = calculateDominantDosha(finalScores);

    localStorage.setItem('userDosha', dominantDosha);
    localStorage.setItem('doshaScores', JSON.stringify(finalScores));
    
    window.location.href = 'dashboard.html'; 
}

// --------------------------------------------------------------------------
// DASHBOARD (dashboard.html) LOGIC
// --------------------------------------------------------------------------

function initDashboardPage() {
    // Requires DOSHA_PROFILES to be loaded from data.js
    if (localStorage.getItem('isLoggedIn') !== 'true' || !localStorage.getItem('userDosha')) {
        window.location.href = 'quiz.html'; 
        return;
    }

    const userName = localStorage.getItem('userName') || 'Wellness Seeker';
    const userDosha = localStorage.getItem('userDosha');
    
    document.getElementById('welcome-message').textContent = `Hello, ${userName}!`;
    displayDoshaProfile(userDosha);
}

function displayDoshaProfile(doshaKey) {
    const primaryDosha = doshaKey.split('-')[0];
    const profile = DOSHA_PROFILES[primaryDosha]; 
    
    if (!profile) {
        document.getElementById('dominant-dosha').textContent = 'Error';
        return;
    }

    document.getElementById('dominant-dosha').textContent = doshaKey.toUpperCase();
    document.getElementById('dominant-dosha').style.color = profile.color; 
    
    // --- EDITED LOGIC: Apply Markdown to the summary text ---
    const summaryText = profile.summary;
    // Use non-greedy quantifier (.*?) for robust matching across lines/text
    const htmlSummary = summaryText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    document.getElementById('dosha-summary').innerHTML = htmlSummary;
    // ----------------------------------------------------------
    
    document.getElementById('diet-recommendations').innerHTML = profile.diet.map(item => `<li>${item}</li>`).join('');
    document.getElementById('lifestyle-recommendations').innerHTML = profile.lifestyle.map(item => `<li>${item}</li>`).join('');
    document.getElementById('stress-recommendations').innerHTML = profile.stress.map(item => `<li>${item}</li>`).join('');
}

// --------------------------------------------------------------------------
// UNIVERSAL LOGIC
// --------------------------------------------------------------------------

function handleLogout() {
    if (window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'auth.html'; 
    }
}

// --------------------------------------------------------------------------
// AI CHAT FEATURE LOGIC (PURE JAVASCRIPT / GEMINI API)
// --------------------------------------------------------------------------

function initChatFeature() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatToggleBtn) return; 

    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus(); 
        }
    });
    chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
            e.preventDefault(); 
        }
    });

    // --- UPDATED: ADDMESSAGE FUNCTION WITH MARKDOWN CONVERSION ---
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'user' ? 'user' : 'ai'}`;
        
        // Convert Markdown **bold** syntax to HTML <strong> tags
        const htmlContent = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Use innerHTML to render the bold tags
        messageDiv.innerHTML = htmlContent;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message ai typing-indicator';
        loadingMessage.id = 'ai-typing-indicator';
        loadingMessage.textContent = 'AI is typing...';
        chatMessages.appendChild(loadingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const indicator = document.getElementById('ai-typing-indicator');
        if (indicator) {
            chatMessages.removeChild(indicator);
        }
    }

    function sendMessage() {
        const userText = chatInput.value.trim();
        if (userText === '') return;

        addMessage(userText, 'user');
        chatInput.value = ''; 
        showTypingIndicator();
        
        // --- GEMINI API CALL (PURE JS) ---
        
        const userDosha = localStorage.getItem('userDosha') || 'Unknown';
        
        // 1. Define the AI's persona and goal (System Instruction)
        const systemInstructionText = "You are an empathetic, knowledgeable, and concise Ayurvedic Wellness Assistant. Your goal is to provide simple, actionable advice to help the user balance their dominant dosha. Do not mention your model name.";
        
        // 2. Define the User's query, including personalization context
        const fullPrompt = `The user's dominant dosha is ${userDosha}. They are asking: ${userText}`;

        const payload = {
            contents: [{ 
                parts: [{ text: fullPrompt }] 
            }],
            systemInstruction: {
                parts: [{ text: systemInstructionText }]
            }
        };

        fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gemini API Error! Status: ${response.status}.`);
            }
            return response.json();
        })
        .then(data => {
            removeTypingIndicator();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that response.";
            addMessage(text, 'ai');
        })
        .catch(error => {
            console.error('Chat API Error:', error);
            removeTypingIndicator();
            addMessage(`Error: Could not connect to the AI service.`, 'ai');
        });
    }
}
