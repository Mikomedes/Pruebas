const images = [
    'images/image1.png',
    'images/image2.png',
    'images/image3.png',
    'images/image4.png',
    'images/image5.png',
    'images/image6.png',
    'images/image7.png',
    'images/image8.png',
    // Agrega más imágenes si es necesario
];

document.getElementById('start-game').addEventListener('click', function() {
    document.querySelector('h1').style.display = 'none'; // Ocultar el título
    document.querySelector('h2').style.display = 'none'; // Ocultar el subtítulo
    //document.querySelector('.controls').style.display = 'none'; // Ocultar los controles
    //document.getElementById('attempts').style.display = 'block'; // Asegurarse de que el contador de intentos esté visible
});


let level = 0;
let attempts = 0; // Intentos del nivel actual
let totalAttempts = 0; // Total de intentos a través de todos los niveles
let cardsFlipped = [];
let matchedCards = [];
let totalCards = 6;

const levelConfig = [
    { cards: 6, name: 'Fácil' },
    { cards: 12, name: 'Medio' },
    { cards: 16, name: 'Difícil' }
];

document.getElementById('start-game').addEventListener('click', startGame);

function startGame() {
    resetGame();
    totalCards = levelConfig[level].cards;

    document.getElementById('start-game').style.display = 'none';

    const gameBoard = document.getElementById('game-board');
    gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(totalCards)}, 1fr)`;
    createCards();
}

function createCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    const cardImages = images.slice(0, totalCards / 2);
    const cardArray = [...cardImages, ...cardImages].sort(() => Math.random() - 0.5);

    cardArray.forEach((imgSrc) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.img = imgSrc; // Guardar la ruta de la imagen en un atributo data
        card.innerHTML = `<img src="images/frontal.png" alt="Card front">`;
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (matchedCards.includes(card) || cardsFlipped.length >= 2) return;

    card.classList.add('flipped');
    card.innerHTML = `<img src="${card.dataset.img}" alt="Card image">`; // Muestra la imagen al girar
    cardsFlipped.push(card);

    if (cardsFlipped.length === 2) {
        attempts++;
        totalAttempts++;
        document.getElementById('attempts').innerText = `Intentos: ${attempts}`;
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = cardsFlipped;

    if (firstCard.dataset.img === secondCard.dataset.img) {
        matchedCards.push(firstCard, secondCard);
        cardsFlipped = [];
        
        firstCard.innerHTML = `<img src="${firstCard.dataset.img}" alt="Card image">`;
        secondCard.innerHTML = `<img src="${secondCard.dataset.img}" alt="Card image">`;

        if (matchedCards.length === totalCards) {
            alert(`Felicidades! Has completado el nivel en ${attempts} intentos. Total de intentos: ${totalAttempts}`);
            level++;
            if (level < levelConfig.length) {
                startGame();
            } else {
                alert(`¡Has completado todos los niveles! Total de intentos: ${totalAttempts}`);
                enableRestart();
            }
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            firstCard.innerHTML = '<img src="images/frontal.png" alt="Card front">';
            secondCard.classList.remove('flipped');
            secondCard.innerHTML = '<img src="images/frontal.png" alt="Card front">';
            cardsFlipped = [];
        }, 1000);
    }
}

function resetGame() {
    attempts = 0;
    matchedCards = [];
    cardsFlipped = [];
    document.getElementById('attempts').innerText = 'Intentos: 0'; // Reinicia el contador de intentos
    document.getElementById('attempts').style.display = 'block'; // Asegúrate de que el contador de intentos esté visible
}

let clickCount = 0;

function enableRestart() {
    clickCount = 0;

    document.addEventListener('click', handleRestart);

    function handleRestart() {
        clickCount++;
        if (clickCount === 2) {
            location.reload(); // Recargar la página al segundo clic
        }
    }
}
