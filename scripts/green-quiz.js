document.addEventListener("DOMContentLoaded", () => {
    let quizData = null;
    let dailyQuestions = [];
    let currentQuestionIndex = 0;
    let totalXpGained = 0;

    // HTML Elements
    const xpPointsDisplay = document.getElementById("xp-points");
    const resetTimeDisplay = document.getElementById("reset-time");
    const progressDisplay = document.querySelector(".progress-card span:last-child");
    
    const categoryBadge = document.getElementById("category-badge");
    const questionText = document.getElementById("question-text");
    const optionContainer = document.getElementById("option-container");
    
    const explanationBox = document.getElementById("explanation-box");
    const explanationText = document.getElementById("explanation-text");
    const nextBtn = document.getElementById("next-btn");
    
    const greenQuizContainer = document.querySelector(".green-quiz-container");
    const resultScreen = document.querySelector(".result-screen");
    const finalXpDisplay = document.getElementById("final-xp");

    // Seeded Random Logic
    function seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    function shuffleWithSeed(array, seed) {
        let m = array.length, t, i;
        let s = seed;
        while (m) {
            i = Math.floor(seededRandom(s++) * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    // ယနေ့ရက်စွဲကို String ပုံစံရယူခြင်း (ဥပမာ - "2026-6-20")
    function getTodayDateString() {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    }

    function getTodaySeed() {
        const today = new Date();
        return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    }

    // နေ့စဉ် ညသန်းခေါင်ယံအထိ ကျန်ရှိချိန် Countdown တိုင်မာ
    function startResetTimer() {
        function updateTimer() {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const diff = tomorrow - now;

            const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

            if(resetTimeDisplay) {
                resetTimeDisplay.innerText = `${hours}:${minutes}:${seconds}`;
            }
        }
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // App Initialization
    async function initQuiz() {
        startResetTimer();
        
        const todayStr = getTodayDateString();
        const hasCompletedToday = localStorage.getItem(`quiz_completed_${todayStr}`);
        
        // အကယ်၍ အသုံးပြုသူသည် ယနေ့အတွက် ဖြေဆိုပြီးသားဖြစ်ပါက
        if (hasCompletedToday === "true") {
            const savedScore = localStorage.getItem(`quiz_score_${todayStr}`) || 0;
            showFinalScores(savedScore);
            return; // အောက်က ကုဒ်တွေကို ဆက်မလုပ်တော့ဘဲ ဒီတင်ရပ်လိုက်မည်
        }

        try {
            const response = await fetch('../data/quiz-data.json');
            quizData = await response.json();
            
            const seed = getTodaySeed();
            const categories = Object.keys(quizData);
            let combinedQuiz = [];

            categories.forEach((category, index) => {
                let categoryQuestions = [...quizData[category]];
                let shuffled = shuffleWithSeed(categoryQuestions, seed + index);
                let selected = shuffled.slice(0, 2).map(q => ({
                    ...q,
                    categoryName: category.replace('_', ' ')
                }));
                combinedQuiz = combinedQuiz.concat(selected);
            });

            dailyQuestions = shuffleWithSeed(combinedQuiz, seed + 99);
            loadQuestion();
        } catch (error) {
            console.error("Error fetching quiz setup:", error);
            questionText.innerText = "ဒေတာယူဆောင်ခြင်း မအောင်မြင်ပါ။";
        }
    }

    // Load Question View
    function loadQuestion() {
        resetUIState();
        const currentQuestion = dailyQuestions[currentQuestionIndex];
        
        progressDisplay.innerText = `${currentQuestionIndex}/8`;
        categoryBadge.innerText = currentQuestion.categoryName;
        questionText.innerText = currentQuestion.question;
        
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.classList.add("option-row-btn");
            
            button.innerHTML = `
                <span>${option}</span>
                <span class="xp-indicator">+10 Xp</span>
            `;
            
            button.addEventListener("click", () => verifyAnswer(index, button));
            optionContainer.appendChild(button);
        });
    }

    function resetUIState() {
        nextBtn.classList.add("disabled");
        nextBtn.disabled = true;
        explanationBox.classList.add("hidden");
        optionContainer.innerHTML = "";
    }

    // Verify Choice
    function verifyAnswer(selectedIndex, selectedButton) {
        const currentQuestion = dailyQuestions[currentQuestionIndex];
        const allButtons = document.querySelectorAll(".option-row-btn");
        
        allButtons.forEach(btn => btn.classList.add("disabled-state"));

        if (selectedIndex === currentQuestion.answer) {
            selectedButton.classList.add("correct-choice");
            totalXpGained += 10;
            xpPointsDisplay.innerText = totalXpGained;
        } else {
            selectedButton.classList.add("wrong-choice");
            allButtons[currentQuestion.answer].classList.add("correct-choice");
        }

        explanationText.innerText = currentQuestion.explanation;
        explanationBox.classList.remove("hidden");

        nextBtn.classList.remove("disabled");
        nextBtn.disabled = false;
    }

    // Next Step Action
    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < 8) {
            loadQuestion();
        } else {
            progressDisplay.innerText = "8/8";
            
            // မေးခွန်းအားလုံးဖြေဆိုပြီးချိန်တွင် LocalStorage ထဲ၌ အချက်အလက်သိမ်းဆည်းခြင်း
            const todayStr = getTodayDateString();
            localStorage.setItem(`quiz_completed_${todayStr}`, "true");
            localStorage.setItem(`quiz_score_${todayStr}`, totalXpGained);
            
            showFinalScores(totalXpGained);
        }
    });

    // ရလဒ်မျက်နှာပြင်ကို ပြသခြင်း
    function showFinalScores(scoreToShow) {
        greenQuizContainer.classList.add("hidden");
        resultScreen.classList.remove("hidden");
        finalXpDisplay.innerText = scoreToShow;
        
        // Header ပေါ်က Score ဘုတ်တွင်လည်း ရမှတ်အမှန်ကို တင်ပေးထားခြင်း
        if(xpPointsDisplay) xpPointsDisplay.innerText = scoreToShow;
        if(progressDisplay) progressDisplay.innerText = "8/8";
    }

    initQuiz();
});