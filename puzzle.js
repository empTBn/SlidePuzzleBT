const boardSizeInput = document.getElementById('board-size');
const startButton = document.getElementById('start-button');
const board = document.getElementById('board');
const imageOptions = document.getElementById('image-options');
let imagePieces = [];

let imageWidth;
let imageHeight;

let emptyCell = {
    
    x: 0,
    y: 0,
    newPositionX: 0,
    newPositionY: 0
};

let cellsList = [];
let currentCellPositions = []; // Variable para guardar las posiciones actuales de las celdas

startButton.addEventListener('click', () => {
    const size = parseInt(boardSizeInput.value);
    const selectedImage = imageOptions.value;
    createPuzzleBoard(size, selectedImage);
});

function createPuzzleBoard(size, selectedImage) {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    const newPosition = 0;
    const image = new Image();
    image.src = selectedImage;

    image.onload = () => {
        imageWidth = image.width;
        imageHeight = image.height;

        cellsList = [];
        currentCellPositions = []; // Limpiar las posiciones actuales antes de crear el nuevo rompecabezas

        const emptyX = Math.floor(Math.random() * size); // Posición X aleatoria para la casilla vacía
        const emptyY = Math.floor(Math.random() * size); // Posición Y aleatoria para la casilla vacía

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.width = `${imageWidth / size}px`;
                cell.style.height = `${imageHeight / size}px`;
                cell.dataset.x = x;
                cell.dataset.y = y;
                const offsetX = (imageWidth / size) * x;
                const offsetY = (imageHeight / size) * y;

                if (x === emptyX && y === emptyY) {
                    // Casilla vacía
                    cell.style.backgroundColor = 'grey';
                    emptyCell.cell = cell;
                    emptyCell.newPositionX = x;
                    emptyCell.newPositionY = y;
                    emptyCell.x = cell.data-x;
                    emptyCell.y = cell.y;
                    
                    emptyCell.cell.addEventListener('click', () => { movePiece(cell, size); });
                    console.log(emptyCell);
                    console.log(emptyCell.cell);
                    console.log(cell);
                    
                } else {
                    cell.style.backgroundImage = `url(${selectedImage})`;
                    cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
                    cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                    console.log(cell);
                    cell.addEventListener('click', () => { movePiece(cell, size); });
                    
                }
                cell.dataset.newPositionX = x;
                cell.dataset.newPositionY = y;
                cellsList.push(cell);
                board.appendChild(cell);
            }
        }
        shuffleArray(cellsList, size); // Reorganizar las celdas aleatoriamente
    };
}

function movePiece(cell, size) {
    console.log('presionada', cell);
    const cellX = parseInt(cell.dataset.newPositionX);
    const cellY = parseInt(cell.dataset.newPositionY);
    console.log('nueva', cellX, cellY);
    const emptyX = emptyCell.newPositionX;
    const emptyY = emptyCell.newPositionY;
    console.log('vacia', emptyX, emptyY);

    // Calcular la diferencia en las coordenadas X e Y entre la celda y la casilla vacía
    const dx = Math.abs(cellX - emptyX);
    const dy = Math.abs(cellY - emptyY);

    const prueba = emptyCell.cell.dataset.x;
    const prueba1 = emptyCell.cell.dataset.y;
    // Verificar si la celda se encuentra adyacente a la casilla vacía
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {

        // Intercambiar la imagen de fondo de la celda y la casilla vacía
        
        emptyCell.cell.style.backgroundColor = 'transparent';
        emptyCell.cell.style.backgroundImage = cell.style.backgroundImage;
        emptyCell.cell.style.backgroundPosition = cell.style.backgroundPosition;
        emptyCell.cell.style.backgroundSize = cell.style.backgroundSize;
        cell.style.backgroundImage = '';
        cell.style.backgroundColor = emptyCell.cell.style.backgroundColor;

        // Cambiar posiciones

        emptyCell.x = cell.dataset.x;
        emptyCell.y = cell.dataset.y;
        emptyCell.cell.dataset.x = cell.dataset.x;
        emptyCell.cell.dataset.y = cell.dataset.y

        console.log(emptyCell.cell.dataset.x, emptyCell.cell.dataset.y);

        console.log("vacia", emptyCell);
        console.log("otra", cell);
        cell.dataset.newPositionX = emptyCell.cell.dataset.newPositionX;
        cell.dataset.newPositionY = emptyCell.cell.dataset.newPositionY;
        cell.dataset.x = emptyCell.cell.dataset.x;
        cell.dataset.y = emptyCell.cell.dataset.y;
        emptyCell = {
            cell: cell,
            x: emptyCell.cell.dataset.x,
            y: emptyCell.cell.dataset.y,
            newPositionX: cellX,
            newPositionY: cellY
        };
        emptyCell.cell.dataset.x = emptyCell.x;
        emptyCell.cell.dataset.y = emptyCell.y;
        emptyCell.cell.dataset.newPositionX = emptyCell.newPositionX;
        emptyCell.cell.dataset.newPositionY = emptyCell.newPositionY;

        console.log('casilla', cell);
        console.log('vacia', emptyCell.cell);

        // Verificar si todas las casillas están en sus posiciones originales
        if (checkPuzzleCompletion(size)) {
            // El rompecabezas está completo, puedes mostrar un mensaje o realizar alguna acción
            console.log('¡Has completado el rompecabezas!');
        }
        } else {
        // La celda no es adyacente a la casilla vacía, no se realiza el movimiento
        console.log('Movimiento inválido');
        }
}



// Función para verificar si se ha completado el rompecabezas
function checkPuzzleCompletion(size) {
    for (let i = 0; i < cellsList.length; i++) {
        const cell = cellsList[i];
        const cellX = parseInt(cell.dataset.x);
        const cellY = parseInt(cell.dataset.y);

        // Verificar si la celda está en su posición original
        if (cellX !== i % size || cellY !== Math.floor(i / size)) {
            return false; // Al menos una celda no está en su posición original
        }
    }

    return true; // Todas las celdas están en sus posiciones originales
}

function shuffleArray(array, size) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];

        // Actualizar las posiciones de las celdas en el dataset y el estilo
        const tempX = array[i].dataset.x;
        const tempY = array[i].dataset.y;
        array[i].dataset.x = array[j].dataset.x;
        array[i].dataset.y = array[j].dataset.y;
        array[i].style.backgroundPosition = `-${(imageWidth / size) * array[j].dataset.x}px -${(imageHeight / size) * array[j].dataset.y}px`;
        array[j].dataset.x = tempX;
        array[j].dataset.y = tempY;
        array[j].style.backgroundPosition = `-${(imageWidth / size) * tempX}px -${(imageHeight / size) * tempY}px`;
    }
}