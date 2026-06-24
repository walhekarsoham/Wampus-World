/* ── Constants ──────────────────────────────────────── */
const SIZE      = 4;
const PIT_COUNT = 3;

/* ── DOM refs ───────────────────────────────────────── */
const boardEl     = document.getElementById('board');
const statusEl    = document.getElementById('statusText');
const perceptEl   = document.getElementById('perceptRow');
const inventEl    = document.getElementById('inventoryText');
const scoreEl     = document.getElementById('scoreValue');
const grabBtn     = document.getElementById('grabButton');
const resetBtn    = document.getElementById('resetButton');
const moveButtons = {
  up:    document.getElementById('moveUp'),
  down:  document.getElementById('moveDown'),
  left:  document.getElementById('moveLeft'),
  right: document.getElementById('moveRight'),
};

/* ── Game state ─────────────────────────────────────── */
let state = null;

/* ── Helpers ────────────────────────────────────────── */
function serialize(r, c) { return r + ',' + c; }

function getNeighbors(r, c) {
  return [[r-1,c],[r+1,c],[r,c-1],[r,c+1]]
    .filter(([nr, nc]) => nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE);
}

function currentCell() {
  return state.grid[state.player.row][state.player.col];
}

function getPercepts(r, c) {
  const p = [];
  const nb = getNeighbors(r, c).map(([nr, nc]) => state.grid[nr][nc]);
  if (nb.some(x => x.pit))                        p.push('Breeze');
  if (nb.some(x => x.wumpus))                     p.push('Stench');
  if (state.grid[r][c].gold && !state.hasGold)    p.push('Glitter');
  return p;
}

/* ── World creation ─────────────────────────────────── */
function createWorld() {
  const grid = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => ({
      row: r, col: c,
      pit: false, wumpus: false, gold: false, visited: false,
    }))
  );

  const start = { row: SIZE - 1, col: 0 };
  const occ   = new Set([serialize(start.row, start.col)]);

  function placeRandom(count, key) {
    let placed = 0;
    while (placed < count) {
      const r  = Math.floor(Math.random() * SIZE);
      const c  = Math.floor(Math.random() * SIZE);
      const id = serialize(r, c);
      if (occ.has(id)) continue;
      occ.add(id);
      grid[r][c][key] = true;
      placed++;
    }
  }

  placeRandom(PIT_COUNT, 'pit');
  placeRandom(1, 'wumpus');
  placeRandom(1, 'gold');

  grid[start.row][start.col].visited = true;

  return {
    grid,
    player:   { ...start },
    hasGold:  false,
    gameOver: false,
    win:      false,
    message:  'You enter the cave cautiously…',
    score:    0,
    moves:    0,
  };
}

/* ── Move ───────────────────────────────────────────── */
function movePlayer(dir) {
  if (state.gameOver) return;

  const deltas = { up: [-1,0], down: [1,0], left: [0,-1], right: [0,1] };
  const [dr, dc] = deltas[dir];
  const nr = state.player.row + dr;
  const nc = state.player.col + dc;

  if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) {
    state.message = 'A solid wall blocks that direction.';
    render();
    return;
  }

  state.player = { row: nr, col: nc };
  state.moves++;
  state.score -= 1;

  const cell = currentCell();
  cell.visited = true;

  if (cell.pit) {
    state.gameOver = true;
    state.score   -= 1000;
    state.message  = 'You fell into a pit! Game over.';
  } else if (cell.wumpus) {
    state.gameOver = true;
    state.score   -= 1000;
    state.message  = 'The Wumpus devoured you! Game over.';
  } else if (state.hasGold && nr === SIZE - 1 && nc === 0) {
    state.gameOver = true;
    state.win      = true;
    state.score   += 1000;
    state.message  = 'You escaped with the gold! Victory!';
  } else {
    state.message = 'You move carefully through the passage…';
  }

  render();
}

/* ── Grab ───────────────────────────────────────────── */
function grabGold() {
  if (state.gameOver) return;
  const cell = currentCell();
  if (!cell.gold || state.hasGold) {
    state.message = 'There is no gold here to grab.';
    render();
    return;
  }
  cell.gold    = false;
  state.hasGold = true;
  state.score  += 500;
  state.message = 'Gold secured! Now return to the entrance (4,1).';
  render();
}

/* ── Render board ───────────────────────────────────── */
function renderBoard() {
  boardEl.innerHTML = '';

  state.grid.forEach(rowCells => {
    rowCells.forEach(cell => {
      const isPlayer  = cell.row === state.player.row && cell.col === state.player.col;
      const isVisible = cell.visited || isPlayer || state.gameOver;

      const el = document.createElement('div');

      // Base classes
      let cls = 'cell';
      if (!isVisible) cls += ' hidden';
      else            cls += ' visited';
      if (isPlayer)              cls += ' player';
      if (state.gameOver && cell.pit)    cls += ' pit-reveal';
      if (state.gameOver && cell.wumpus) cls += ' wump-reveal';
      if (state.gameOver && cell.gold)   cls += ' gold-reveal';
      el.className = cls;

      // Percepts & icons
      const percepts = isVisible ? getPercepts(cell.row, cell.col) : [];
      const icons = [];

      if (isVisible && percepts.includes('Breeze'))  icons.push(['BR',  'icon-br']);
      if (isVisible && percepts.includes('Stench'))  icons.push(['ST',  'icon-st']);
      if (isVisible && percepts.includes('Glitter')) icons.push(['GL',  'icon-gl']);
      if (state.gameOver && cell.pit)                icons.push(['PIT', 'icon-pit']);
      if (state.gameOver && cell.wumpus)             icons.push(['W',   'icon-w']);
      if (state.gameOver && cell.gold)               icons.push(['G',   'icon-g']);

      const coordLabel  = isVisible ? `(${cell.row + 1},${cell.col + 1})` : '';
      const spriteHtml  = isPlayer
        ? `<div class="player-sprite" aria-hidden="true">&#128064;</div>`
        : '';
      const iconsHtml   = icons.map(([t, c]) =>
        `<span class="icon-badge ${c}">${t}</span>`
      ).join('');

      el.innerHTML = `
        <span class="cell-coord">${coordLabel}</span>
        <div class="cell-bottom">
          ${spriteHtml}
          <div class="cell-icons">${iconsHtml}</div>
        </div>
      `;

      boardEl.appendChild(el);
    });
  });
}

/* ── Render status ──────────────────────────────────── */
function renderStatus() {
  const percepts = getPercepts(state.player.row, state.player.col);

  // Status text + colour
  let cls = 'card-value';
  if (state.win)              cls += ' state-win';
  else if (state.gameOver)    cls += ' state-dead';
  else if (state.hasGold)     cls += ' state-gold';
  statusEl.className  = cls;
  statusEl.textContent = state.message;

  // Percepts
  if (percepts.length === 0) {
    perceptEl.innerHTML = '<span class="no-percept">None</span>';
  } else {
    const tagMap = { Breeze: 'p-br', Stench: 'p-st', Glitter: 'p-gl' };
    perceptEl.innerHTML = percepts
      .map(p => `<span class="p-tag ${tagMap[p] || ''}">${p}</span>`)
      .join('');
  }

  // Inventory
  inventEl.textContent = state.hasGold ? '🪙 Gold secured' : 'Empty-handed';
  inventEl.style.color  = state.hasGold ? 'var(--glitter-text)' : '';
  inventEl.style.fontWeight = state.hasGold ? '700' : '';

  // Score
  scoreEl.textContent = state.score;

  // Buttons
  const disabled = state.gameOver;
  grabBtn.disabled = disabled;
  Object.values(moveButtons).forEach(b => b.disabled = disabled);
}

/* ── Render (full) ──────────────────────────────────── */
function render() {
  renderBoard();
  renderStatus();
}

/* ── Events ─────────────────────────────────────────── */
Object.entries(moveButtons).forEach(([dir, btn]) => {
  btn.addEventListener('click', () => movePlayer(dir));
});

grabBtn.addEventListener('click', grabGold);
resetBtn.addEventListener('click', startGame);

window.addEventListener('keydown', e => {
  const keyMap = {
    ArrowUp: 'up', ArrowDown: 'down',
    ArrowLeft: 'left', ArrowRight: 'right',
  };
  if (keyMap[e.key]) {
    e.preventDefault();
    movePlayer(keyMap[e.key]);
  }
  if (e.key.toLowerCase() === 'g') grabGold();
});

/* ── Bootstrap ──────────────────────────────────────── */
function startGame() {
  state = createWorld();
  render();
}

startGame();
