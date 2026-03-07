document.addEventListener('DOMContentLoaded', () => {
    const num1El = document.getElementById('num1');
    const num2El = document.getElementById('num2');
    const operatorEl = document.getElementById('operator');
    const answerInput = document.getElementById('answer');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');

    let currentAnswer = 0;
    let score = 0;

    // Generate a random number between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate a new math problem
    function generateProblem() {
        // Reset UI
        answerInput.value = '';
        answerInput.focus();
        feedbackEl.className = 'feedback';
        feedbackEl.textContent = '';
        checkBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');

        // Randomly choose addition or subtraction
        const isAddition = Math.random() > 0.5;

        let num1, num2;

        if (isAddition) {
            // For addition, keep total up to 20
            // Since numbers span from 1 to 20, we can pick the sum first, then the parts.
            currentAnswer = getRandomInt(2, 20); // The answer should be up to 20
            num1 = getRandomInt(1, currentAnswer - 1);
            num2 = currentAnswer - num1;
            operatorEl.textContent = '+';
        } else {
            // For subtraction, keep numbers between 1 and 20, and answer >= 0
            num1 = getRandomInt(1, 20);
            num2 = getRandomInt(1, num1); // Ensure no negative answers
            currentAnswer = num1 - num2;
            operatorEl.textContent = '-';
        }

        // Animate numbers appearing
        num1El.textContent = num1;
        num1El.classList.add('pop-animation');
        num2El.textContent = num2;
        num2El.classList.add('pop-animation');
        
        setTimeout(() => {
            num1El.classList.remove('pop-animation');
            num2El.classList.remove('pop-animation');
        }, 400);
    }

    // Check the answer
    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value, 10);

        if (isNaN(userAnswer)) {
            feedbackEl.textContent = 'Please enter a number! 🤔';
            feedbackEl.className = 'feedback show wrong';
            return;
        }

        if (userAnswer === currentAnswer) {
            // Correct answer
            score += 10;
            scoreEl.textContent = score;
            scoreEl.parentElement.classList.add('pop-animation');
            setTimeout(() => scoreEl.parentElement.classList.remove('pop-animation'), 400);

            feedbackEl.textContent = 'Awesome! Correct! 🎉';
            feedbackEl.className = 'feedback show correct';
            
            createConfetti();

            checkBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
            nextBtn.focus();
        } else {
            // Wrong answer
            feedbackEl.textContent = 'Oops! Try again! 💫';
            feedbackEl.className = 'feedback show wrong';
            answerInput.value = '';
            answerInput.focus();
        }
    }

    // Create simple confetti effect
    function createConfetti() {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9D75CB', '#45B7D1'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.top = '-10px';
            
            // Randomize fall duration and delay
            const duration = Math.random() * 2 + 2;
            confetti.style.animationDuration = duration + 's';
            confetti.style.animationDelay = Math.random() * 1 + 's';
            
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, (duration + 1) * 1000);
        }
    }

    // Event Listeners
    checkBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', generateProblem);

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (!checkBtn.classList.contains('hidden')) {
                checkAnswer();
            } else {
                generateProblem();
            }
        }
    });

    // Initialize first problem
    generateProblem();
});
