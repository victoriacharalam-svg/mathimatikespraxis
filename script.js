document.addEventListener('DOMContentLoaded', () => {
    
    // Screens
    const selectionScreen = document.getElementById('selection-screen');
    const gameContainer = document.getElementById('game-container');
    const btnSingle = document.getElementById('btn-single');
    const btnTablet = document.getElementById('btn-tablet');
    const btnBoard = document.getElementById('btn-board');
    const btnBack = document.getElementById('btn-back');

    // Player State
    const players = {
        1: { score: 0, answerStr: '', currentAnswer: 0, isActive: false },
        2: { score: 0, answerStr: '', currentAnswer: 0, isActive: false }
    };

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

    function generateProblem(p) {
        players[p].isActive = true;
        players[p].answerStr = '';
        updateAnswerDisplay(p);

        feedbackEls[p].className = 'feedback';
        feedbackEls[p].textContent = '';

        const isAddition = Math.random() > 0.5;
        let num1, num2, answer;

        if (isAddition) {
            answer = getRandomInt(2, 20);
            num1 = getRandomInt(1, answer - 1);
            num2 = answer - num1;
            opEls[p].textContent = '+';
        } else {
            num1 = getRandomInt(1, 20);
            num2 = getRandomInt(1, num1);
            answer = num1 - num2;
            opEls[p].textContent = '-';
        }
        
        players[p].currentAnswer = answer;

        num1Els[p].textContent = num1;
        num2Els[p].textContent = num2;
        num1Els[p].classList.add('pop-animation');
        num2Els[p].classList.add('pop-animation');
        
        setTimeout(() => {
            num1Els[p].classList.remove('pop-animation');
            num2Els[p].classList.remove('pop-animation');
        }, 400);
    }

    function checkAnswer(player) {
        if (!players[player].isActive) return;

        const val = parseInt(players[player].answerStr, 10);
        
        if (isNaN(val)) {
            feedbackEls[player].textContent = 'Γράψε αριθμό!';
            feedbackEls[player].className = 'feedback show wrong';
            return;
        }

        if (val === players[player].currentAnswer) {
            // Correct format: this player wins the round
            players[player].isActive = false; // Disable further inputs for this round
            players[player].score += 10;
            scoreEls[player].textContent = players[player].score;
            scoreEls[player].parentElement.classList.add('pop-animation');
            setTimeout(() => scoreEls[player].parentElement.classList.remove('pop-animation'), 400);

            feedbackEls[player].textContent = 'Σωστά! 🎉';
            feedbackEls[player].className = 'feedback show win';

            createConfetti(player);

            // Wait a bit, then next problem just for them
            setTimeout(() => generateProblem(player), 2000);

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
        const handler = (e) => {
            e.preventDefault(); // allow multi-touch to work instantly
            const p = e.target.getAttribute('data-player');
            if (!players[p].isActive) return;
            const val = e.target.textContent;
            if (players[p].answerStr.length < 3) {
                players[p].answerStr += val;
                updateAnswerDisplay(p);
            }
        };
        btn.addEventListener('touchstart', handler, {passive: false});
        btn.addEventListener('mousedown', handler);
    });

    document.querySelectorAll('.cmd-btn.clear').forEach(btn => {
        const handler = (e) => {
            e.preventDefault();
            const p = e.target.getAttribute('data-player');
            if (!players[p].isActive) return;
            players[p].answerStr = '';
            updateAnswerDisplay(p);
        };
        btn.addEventListener('touchstart', handler, {passive: false});
        btn.addEventListener('mousedown', handler);
    });

    document.querySelectorAll('.cmd-btn.check').forEach(btn => {
        const handler = (e) => {
            e.preventDefault();
            const p = parseInt(e.target.getAttribute('data-player'), 10);
            if (!players[p].isActive) return;
            checkAnswer(p);
        };
        btn.addEventListener('touchstart', handler, {passive: false});
        btn.addEventListener('mousedown', handler);
    });

    // Create simple confetti effect originating from winner's side
    function createConfetti(winnerPlayer) {
        // ... (confetti creation code is same, but respect tablet/board mode)
        const isTablet = gameContainer.classList.contains('tablet-mode');
        const isSingle = gameContainer.classList.contains('single-mode');
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9D75CB', '#45B7D1'];
        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            if (isSingle) {
                confetti.style.top = '-10px';
                confetti.style.left = Math.random() * 100 + 'vw';
            } else if (isTablet) {
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
        gameContainer.className = 'split-screen'; // Reset classes
        if (mode === 'tablet') {
            gameContainer.classList.add('tablet-mode');
        } else if (mode === 'board') {
            gameContainer.classList.add('board-mode');
        } else if (mode === 'single') {
            gameContainer.classList.add('single-mode');
        }

        // Switch screens
        selectionScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        btnBack.classList.remove('hidden');

        // Start first problem
        generateProblem(1);
        if (mode !== 'single') {
            generateProblem(2);
        } else {
            players[2].isActive = false;
        }
    }

    btnSingle.addEventListener('click', () => startGame('single'));
    btnTablet.addEventListener('click', () => startGame('tablet'));
    btnBoard.addEventListener('click', () => startGame('board'));

    btnBack.addEventListener('click', () => {
        players[1].isActive = false;
        players[2].isActive = false;
        gameContainer.classList.add('hidden');
        btnBack.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
    });

});
