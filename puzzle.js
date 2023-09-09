const boardSizeInput = document.getElementById('board-size');
const startButton = document.getElementById('start-button');
const board = document.getElementById('board');
const imageOptions = document.getElementById('image-options');
let imagePieces = [];

startButton.addEventListener('click', () => {
    const size = parseInt(boardSizeInput.value);
    const selectedImage = imageOptions.value;
    createPuzzleBoard(size, selectedImage);
});

function createPuzzleBoard(size, selectedImage) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const image = new Image();
    image.src = selectedImage;

    image.onload = () => {
        const imageWidth = image.width;
        const imageHeight = image.height;

        // Genera una posición aleatoria para el espacio en blanco
        const emptyCellX = Math.floor(Math.random() * size);
        const emptyCellY = Math.floor(Math.random() * size);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.width = `${imageWidth / size}px`;
                cell.style.height = `${imageHeight / size}px`;

                const offsetX = (imageWidth / size) * x;
                const offsetY = (imageHeight / size) * y;

                if (x === emptyCellX && y === emptyCellY) {
                    // Crea un espacio vacío en la posición aleatoria
                    cell.style.backgroundColor = 'transparent';
                } else {
                    cell.style.backgroundImage = `url(${selectedImage})`;
                    cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
                    cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                }

                board.appendChild(cell);
            }
        }

        // Llama a la función shuffleArray para mezclar las celdas aleatoriamente
        shuffleArray(Array.from(board.querySelectorAll('.grid-cell')));
    };
}

// Función para mezclar un array aleatoriamente (shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        array[i].parentNode.insertBefore(array[j], array[i]);
    }
}
