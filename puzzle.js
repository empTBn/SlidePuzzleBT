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

const emptyCell = {
    cell:{},
    x:0,
    y:0
}

const cellsList = []

function createPuzzleBoard(size, selectedImage) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const image = new Image();
    image.src = selectedImage;

    image.onload = () => {
        const imageWidth = image.width;
        const imageHeight = image.height;

        // Genera una posición aleatoria para el espacio en blanco
        emptyCell.x = Math.floor(Math.random() * size);
        emptyCell.y = Math.floor(Math.random() * size);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.width = `${imageWidth / size}px`;
                cell.style.height = `${imageHeight / size}px`;

                const offsetX = (imageWidth / size) * x;
                const offsetY = (imageHeight / size) * y;

                if (x === emptyCell.x && y === emptyCell.y) {
                    // Crea un espacio vacío en la posición aleatoria
                    cell.style.backgroundColor = 'transparent';
                } else {
                    cell.style.backgroundImage = `url(${selectedImage})`;
                    cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
                    cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                    cell.addEventListener('click', () => movePiece(cell, size));
                }
                cellsList.push({cell, x, y})

                board.appendChild(cell);
            }
        }

        // Llama a la función shuffleArray para mezclar las celdas aleatoriamente
        shuffleArray(Array.from(board.querySelectorAll('.grid-cell')));
    };
}

function movePiece(cell, size) {
    const emptyCellX = emptyCell.x;
    const emptyCellY = emptyCell.y;


    let cellInfo = {}

    for(let i = 0; i < cellsList.length; i++){
        if(cellsList[i].cell == cell){
            cellInfo = cellsList[i]
        }
    }

    console.log(cellInfo)

    if ((Math.abs(cellInfo.x - emptyCellX) === 1 && cellInfo.y === emptyCellY) ||
        (Math.abs(cellInfo.y - emptyCellY) === 1 && cellInfo.X === emptyCellX)) {
        // Intercambia la posición de la celda clicada y la celda vacía
        const offsetX = (imageWidth / size) * emptyCellX;
        const offsetY = (imageHeight / size) * emptyCellY;
        

        emptyCell.x = cellInfo.x
        emptyCell.y = cellInfo.y
        // Verifica si se ha completado el rompecabezas
        if (isPuzzleComplete(size)) {
            alert('¡Felicidades! Has completado el rompecabezas.');
        }
    }
}


// Función para verificar si se ha completado el rompecabezas
function isPuzzleComplete(size) {
    const cells = board.querySelectorAll('.grid-cell');
    let correct = true;

    cells.forEach((cell, index) => {
        const cellX = parseInt(cell.style.gridColumn);
        const cellY = parseInt(cell.style.gridRow);

        if (cellX !== (index % size) + 1 || cellY !== Math.floor(index / size) + 1) {
            correct = false;
        }
    });

    return correct;
}

// Función para mezclar un array aleatoriamente (shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        array[i].parentNode.insertBefore(array[j], array[i]);
    }
}
