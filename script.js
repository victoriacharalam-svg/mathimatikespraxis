document.addEventListener('DOMContentLoaded', () => {
    
    // Screens
    const selectionScreen = document.getElementById('selection-screen');
    const gameContainer = document.getElementById('game-container');
    const btnTablet = document.getElementById('btn-tablet');
    const btnBoard = document.getElementById('btn-board');
    const btnBack = document.getElementById('btn-back');

    // Player State
    const players = {
        1: { score: 0, answerStr: '' },
        2: { score: 0, answerStr: '' }
    };

    let currentAnswer = 0;
    let isProblemActive = true;

    // Elements
    const getEl = (id) => document.getElementById(id);
    const scoreEls = { 1: getEl('score-p1'), 2: getEl('score-p2') };
    const num1Els = { 1: getEl('num1-p1'), 2: getEl('num1-p2') };
    const num2Els = { 1: getEl('num2-p1'), 2: getEl('num2-p2') };
    const opEls = { 1: getEl('operator-p1'), 2: getEl('operator-p2') };
    const answerEls = { 1: getEl('answer-p1'), 2: getEl('answer-p2') };
    const feedbackEls = { 1: getEl('feedback-p1'), 2: getEl('feedback-p2') };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateAnswerDisplay(player) {
        answerEls[player].textContent = players[player].answerStr;
    }

    function generateProblem() {
        isProblemActive = true;
        players[1].answerStr = '';
        players[2].answerStr = '';
        updateAnswerDisplay(1);
        updateAnswerDisplay(2);

        feedbackEls[1].className = 'feedback';
        feedbackEls[1].textContent = '';
        feedbackEls[2].className = 'feedback';
        feedbackEls[2].textContent = '';

        const isAddition = Math.random() > 0.5;
        let num1, num2;

        if (isAddition) {
            currentAnswer = getRandomInt(2, 20);
            num1 = getRandomInt(1, currentAnswer - 1);
            num2 = currentAnswer - num1;
            opEls[1].textContent = '+';
            opEls[2].textContent = '+';
        } else {
            num1 = getRandomInt(1, 20);
            num2 = getRandomInt(1, num1);
            currentAnswer = num1 - num2;
            opEls[1].textContent = '-';
            opEls[2].textContent = '-';
        }

        // Update both boards
        [1, 2].forEach(p => {
            num1Els[p].textContent = num1;
            num2Els[p].textContent = num2;
            num1Els[p].classList.add('pop-animation');
            num2Els[p].classList.add('pop-animation');
            
            setTimeout(() => {
                num1Els[p].classList.remove('pop-animation');
                num2Els[p].classList.remove('pop-animation');
            }, 400);
        });
    }

    function checkAnswer(player) {
        if (!isProblemActive) return;

        const val = parseInt(players[player].answerStr, 10);
        
        if (isNaN(val)) {
            feedbackEls[player].textContent = 'Γράψε αριθμό!';
            feedbackEls[player].className = 'feedback show wrong';
            return;
        }

        if (val === currentAnswer) {
            // Correct format: this player wins the round
            isProblemActive = false; // Disable further inputs for this round
            players[player].score += 10;
            scoreEls[player].textContent = players[player].score;
            scoreEls[player].parentElement.classList.add('pop-animation');
            setTimeout(() => scoreEls[player].parentElement.classList.remove('pop-animation'), 400);

            feedbackEls[player].textContent = 'Νικητής!';
            feedbackEls[player].className = 'feedback show win';
            
            const otherPlayer = player === 1 ? 2 : 1;
            feedbackEls[otherPlayer].textContent = 'Έχασες αυτήν την φάση!';
            feedbackEls[otherPlayer].className = 'feedback show wrong';

            createConfetti(player);

            // Wait 2 secs, then next problem
            setTimeout(generateProblem, 2500);

        } else {
            // Wrong answer
            feedbackEls[player].textContent = 'Λάθος! 💫';
            feedbackEls[player].className = 'feedback show wrong';
            players[player].answerStr = ''; // clear for retry
            updateAnswerDisplay(player);
        }
    }

    // Numpad logic
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!isProblemActive) return;
            const p = e.target.getAttribute('data-player');
            const val = e.target.textContent;
            if (players[p].answerStr.length < 3) {
                players[p].answerStr += val;
                updateAnswerDisplay(p);
            }
        });
    });

    document.querySelectorAll('.cmd-btn.clear').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!isProblemActive) return;
            const p = e.target.getAttribute('data-player');
            players[p].answerStr = '';
            updateAnswerDisplay(p);
        });
    });

    document.querySelectorAll('.cmd-btn.check').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!isProblemActive) return;
            const p = parseInt(e.target.getAttribute('data-player'));
            checkAnswer(p);
        });
    });

    // Create simple confetti effect originating from winner's side
    function createConfetti(winnerPlayer) {
        // ... (confetti creation code is same, but respect tablet/board mode)
        const isTablet = gameContainer.classList.contains('tablet-mode');
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9D75CB', '#45B7D1'];
        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            if (isTablet) {
                if (winnerPlayer === 1) {
                    confetti.style.top = '-10px';
                    confetti.style.left = Math.random() * 100 + 'vw';
                } else {
                    confetti.style.bottom = '50vh';
                    confetti.style.left = Math.random() * 100 + 'vw';
                }
            } else {
                // Board mode (side by side)
                confetti.style.top = '-10px';
                if (winnerPlayer === 1) {
                    confetti.style.left = Math.random() * 50 + 'vw'; // Left half
                } else {
                    confetti.style.left = (Math.random() * 50 + 50) + 'vw'; // Right half
                }
            }
            
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const duration = Math.random() * 2 + 2;
            confetti.style.animationDuration = duration + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            
            document.body.appendChild(confetti);
            setTimeout(() => { confetti.remove(); }, (duration + 1) * 1000);
        }
    }

    // View Selection Logic
    function startGame(mode) {
        // Reset scores
        players[1].score = 0;
        players[2].score = 0;
        scoreEls[1].textContent = 0;
        scoreEls[2].textContent = 0;

        // Apply mode class
        if (mode === 'tablet') {
            gameContainer.classList.add('tablet-mode');
            gameContainer.classList.remove('board-mode');
        } else {
            gameContainer.classList.add('board-mode');
            gameContainer.classList.remove('tablet-mode');
        }

        // Switch screens
        selectionScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        btnBack.classList.remove('hidden');

        // Start first problem
        generateProblem();
    }

    btnTablet.addEventListener('click', () => startGame('tablet'));
    btnBoard.addEventListener('click', () => startGame('board'));

    btnBack.addEventListener('click', () => {
        isProblemActive = false; // Stop timers/inputs
        gameContainer.classList.add('hidden');
        btnBack.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
    });

});
