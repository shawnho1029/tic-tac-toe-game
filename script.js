// 初始 DOM 元素抓取
const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const btnReset = document.getElementById('reset');
const btnResetAll = document.getElementById('reset-all');
const turnEl = document.getElementById('turn');
const stateEl = document.getElementById('state');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

// 遊戲狀態變數
let board;
let current;
let active;

// 計分變數
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

// 勝利條件 (8種連線)
const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// 初始化函式
function init() {
    board = Array(9).fill('');
    current = 'X';
    active = true;
    
    cells.forEach(c => {
        c.textContent = '';
        c.className = 'cell';
        c.disabled = false;
    });
    
    turnEl.textContent = current;
    stateEl.textContent = '';
}

// 下棋動作
function place(idx) {
    if (!active || board[idx]) return;
    
    board[idx] = current;
    const cell = cells[idx];
    cell.textContent = current;
    cell.classList.add(current.toLowerCase());
    
    const result = evaluate();
    if (result.finished) {
        endGame(result);
    } else {
        switchTurn();
    }
}

// 換手函式
function switchTurn() {
    current = current === 'X' ? 'O' : 'X';
    turnEl.textContent = current;
}

// 判斷勝負邏輯
function evaluate() {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { finished: true, winner: board[a], line };
        }
    }
    if (board.every(v => v)) return { finished: true, winner: null };
    return { finished: false };
}

// 遊戲結束處理
function endGame({ winner, line }) {
    active = false;
    if (winner) {
        stateEl.textContent = `${winner} 勝利!`;
        line.forEach(i => cells[i].classList.add('win'));
        if (winner === 'X') scoreX++; else scoreO++;
    } else {
        stateEl.textContent = '平手';
        scoreDraw++;
    }
    updateScoreboard();
    cells.forEach(c => c.disabled = true);
}

// 更新計分板
function updateScoreboard() {
    scoreXEl.textContent = scoreX;
    scoreOEl.textContent = scoreO;
    scoreDrawEl.textContent = scoreDraw;
}

// 事件監聽
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const idx = +cell.getAttribute('data-idx');
        place(idx);
    });
});

btnReset.addEventListener('click', init);

btnResetAll.addEventListener('click', () => {
    scoreX = scoreO = scoreDraw = 0;
    updateScoreboard();
    init();
});

// 啟動遊戲
init();