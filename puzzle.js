const boardSizeInput = document.getElementById('board-size');
const startButton = document.getElementById('start-button');
const board = document.getElementById('board');
const boardContainer = document.getElementById('board-container');
const imageOptions = document.getElementById('image-options');
const fullImage = document.getElementById('full-image');
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

        const cellSize = Math.min(imageWidth / size, imageHeight / size);

        const emptyCellX = size - 1;
        const emptyCellY = size - 1;

        imagePieces = [];
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const canvas = document.createElement('canvas');
                canvas.width = cellSize;
                canvas.height = cellSize;
                const ctx = canvas.getContext('2d');

                if (x === emptyCellX && y === emptyCellY) {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, cellSize, cellSize);
                } else {
                    ctx.drawImage(
                        image,
                        x * (imageWidth / size),
                        y * (imageHeight / size),
                        imageWidth / size,
                        imageHeight / size,
                        0,
                        0,
                        cellSize,
                        cellSize
                    );
                }
                imagePieces.push(canvas.toDataURL());
            }
        }

        shuffleArray(imagePieces); // Mezcla aleatoriamente las partes

        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';

            const puzzleImage = new Image();
            puzzleImage.src = imagePieces[i];

            cell.appendChild(puzzleImage);
            board.appendChild(cell);
        }

    };
}

// Función para mezclar un array aleatoriamente (shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}