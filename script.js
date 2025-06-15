// Utility to shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Lista de imágenes originales (sin la C) detectada en carpeta
const images = [
  'A2.JPG',
  'A3.JPG',
  'A4.png', // Esta no tiene copia física
  'A5.jpg',
  'A6.jpg',
  'A7.JPG',
  'A8.jpg',
  'A9.jpg',
  'A10.jpg',
  'A11.jpg'
];

// Generar duplicados usando la MISMA imagen (no versión con C)
function buildPairs(imgList) {
  return imgList.flatMap(img => [img, img]);
}

let cardsArray = shuffle(buildPairs(images));

// Evitar que dos cartas iguales queden juntas (horizontal) tras el shuffle.
// Si ocurre, rebarajamos hasta 10 intentos.
function hasAdjacentDuplicates(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) return true;
  }
  return false;
}

let attempts = 0;
while (hasAdjacentDuplicates(cardsArray) && attempts < 10) {
  shuffle(cardsArray);
  attempts++;
}

const game = document.getElementById('game');
let firstCard = null;
let lock = false;
let matchedPairs = 0;

function createCard(src) {
  const card = document.createElement('div');
  card.classList.add('card');

  const inner = document.createElement('div');
  inner.classList.add('card-inner');

  const front = document.createElement('div');
  front.classList.add('card-front');
  const img = document.createElement('img');
  img.src = `memorama/${src}`;
  front.appendChild(img);

  const back = document.createElement('div');
  back.classList.add('card-back');

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', () => handleFlip(card, src));

  return card;
}

function handleFlip(card, src) {
  if (lock || card.classList.contains('flip')) return;
  card.classList.add('flip');

  if (!firstCard) {
    firstCard = { card, src };
  } else {
    lock = true;
    if (isMatch(firstCard.src, src)) {
      matchedPairs++;
      firstCard = null;
      lock = false;
      if (matchedPairs === images.length) {
        setTimeout(showFinalMessage, 600);
      }
    } else {
      setTimeout(() => {
        card.classList.remove('flip');
        firstCard.card.classList.remove('flip');
        firstCard = null;
        lock = false;
      }, 800);
    }
  }
}

function isMatch(src1, src2) {
  // Remove possible C before extension and compare
  const clean = s => s.replace(/C(?=\.[a-zA-Z]+$)/, '');
  return clean(src1) === clean(src2);
}

function showFinalMessage() {
  const final = document.getElementById('finalMessage');
  final.style.display = 'flex';
  final.classList.add('visible');
  
  // Prevent background scrolling
  document.body.style.overflow = 'hidden';
  
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.body.style.overflow = ''; // Restore scrolling
      location.reload();
    });
  }
}

document.getElementById('showPlaylist').addEventListener('click', () => {
  window.open('https://open.spotify.com/playlist/5IBCexXLdhI4xcmn2Mgks7?si=BNNyBh6QS0GOdJgNcTU0Nw&pi=LyV9xsazSeWYw', '_blank');
});

// DEBUG: presiona la tecla 'd' para simular victoria
document.addEventListener('keydown', (e) => {
  if (e.key === 'd') {
    showFinalMessage();
  }
});

// Debug button click
const dbg = document.getElementById('debugWin');
if (dbg) dbg.addEventListener('click', showFinalMessage);

// Render the board
cardsArray.forEach(src => {
  game.appendChild(createCard(src));
});
