/**
 * Representa el elemento HTML para la entrada del tamaño del tablero.
 * @type {HTMLInputElement}
 */
const boardSizeInput = document.getElementById('board-size');

/**
 * Representa el elemento HTML para el botón de inicio.
 * @type {HTMLButtonElement}
 */
const startButton = document.getElementById('start-button');

/**
 * Representa el elemento HTML para el botón de resolver con Backtracking.
 * @type {HTMLButtonElement}
 */
const backTrackingButton = document.getElementById('solve-buttonB');

/**
 * Representa el elemento HTML para el botón de resolver con a estrella.
 * @type {HTMLButtonElement}
 */
const aEstrellaButton = document.getElementById('solve-buttonA');

/**
 * Representa el elemento HTML del tablero.
 * @type {HTMLDivElement}
 */
const board = document.getElementById('board');

/**
 * Representa el elemento HTML para las opciones de imagen.
 * @type {HTMLSelectElement}
 */
const imageOptions = document.getElementById('image-options');

/**
 * Representa el elemento HTML para la visualización de movimientos.
 * @type {HTMLDivElement}
 */
const movements = document.getElementById('movements');

/**
 * Representa el elemento HTML para el mensaje de finalización.
 * @type {HTMLDivElement}
 */
const completion = document.getElementById('message');
completion.classList.add('hidden');

/**
 * Ancho de la imagen del rompecabezas.
 * @type {number}
 */
let imageWidth;

/**
 * Altura de la imagen del rompecabezas.
 * @type {number}
 */
let imageHeight;

/**
 * Representa una instancia de la clase BackTracking utilizada para resolver el rompecabezas.
 * @type {BackTracking}
 */
let backTrackingAlgorithm

/**
 * Número de movimientos realizados en el rompecabezas.
 * @type {number}
 */
var moves;

/**
 * Bandera que indica si el rompecabezas se completó con éxito.
 * @type {boolean}
 */
var success;

/**
 * Objeto que representa la celda vacía en el grid del rompecabezas.
 * @type {{x: number, y: number, newPositionX: number, newPositionY: number, cell: HTMLElement}}
 */
let emptyCell = {
    x: 0,
    y: 0,
    newPositionX: 0,
    newPositionY: 0,
    cell: null
};

/**
 * Array para almacenar las celdas en el tablero del rompecabezas.
 * @type {Array}
 */
let cellsList = [];

/**
 * Array para almacenar las posiciones actuales de las celdas en el tablero del rompecabezas.
 * @type {Array}
 */
let currentCellPositions = []; // Variable para guardar las posiciones actuales de las celdas

/**
 * Array para almacenar los objetos de la celda en el tablero del rompecabezas.
 * @type {Array}
 */
let cellObjets = []

/**
 * La celda especial que representa la posición inicial de la celda vacía y el elemento HTML.
 * @type {{x: number, y: number, cell: HTMLElement, target: {x: number, y: number}}}
 */
let specialCell;

/**
 * Cree un tablero de rompecabezas según el tamaño especificado y la imagen seleccionada.
 * @param {number} size - El tamaño del tablero del rompecabezas.
 * @param {string} selectedImage - La URL de la imagen seleccionada.
 */
function createPuzzleBoard(size, selectedImage) {
    moves = 0;
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
                    //Guardo el objeto casilla
                    cellObjets.push({
                        x:0,
                        y:0,
                        cell:emptyCell.cell,
                        target:{
                            x:emptyX,
                            y:emptyY
                        }
                    })

                    specialCell = cellObjets[cellObjets.length - 1]
                    
                } else {
                    cell.style.backgroundImage = `url(${selectedImage})`;
                    cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
                    cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                    console.log(cell);
                    cell.addEventListener('click', () => { movePiece(cell, size); });
                    //Guardo el objeto casilla
                    cellObjets.push({
                        x:0,
                        y:0,
                        cell,
                        target:{
                            x,
                            y
                        }
                    })
                    
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

/**
 * Hace una copia profunda de un objeto.
 * @param {Object} obj - El objeto que se va a copiar.
 * @returns {Object} - La copia profunda del objeto.
 */
function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        const copyArr = [];
        obj.forEach(item => {
            copyArr.push(deepCopy(item));
        });
        return copyArr;
    }

    const copyObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copyObj[key] = deepCopy(obj[key]);
        }
    }

    return copyObj;
}

/**
 * Mueve una pieza del rompecabezas cuando el usuario hace clic en ella.
 * @param {HTMLElement} cell - La celda que se está moviendo.
 * @param {number} size - El tamaño del tablero del rompecabezas.
 */
function movePiece(cell, size) {
    const emptyCellCopyX = deepCopy(emptyCell.cell.dataset.x);
    const emptyCellCopyY = deepCopy(emptyCell.cell.dataset.y);
    const emptyCellCopyNX = deepCopy(emptyCell.cell.dataset.newPositionX);
    const emptyCellCopyNY = deepCopy(emptyCell.cell.dataset.newPositionY);
    const pp = cell;
    const CellCopyX = deepCopy(cell.dataset.x);
    const CellCopyY = deepCopy(cell.dataset.y);
    const CellCopyNX = deepCopy(cell.dataset.newPositionX);
    const CellCopyNY = deepCopy(cell.dataset.newPositionY);

    // Calcular la diferencia en las coordenadas X e Y entre la celda y la casilla vacía
    const dx = Math.abs(CellCopyNX - emptyCellCopyNX);
    const dy = Math.abs(CellCopyNY - emptyCellCopyNY);

    // Verificar si la celda se encuentra adyacente a la casilla vacía
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {

        // Intercambiar la imagen de fondo de la celda y la casilla vacía
        emptyCell.cell.style.backgroundColor = 'transparent';
        emptyCell.cell.style.backgroundImage = cell.style.backgroundImage;
        emptyCell.cell.style.backgroundPosition = cell.style.backgroundPosition;
        emptyCell.cell.style.backgroundSize = cell.style.backgroundSize;
        cell.style.backgroundImage = '';
        cell.style.backgroundColor = 'grey';

        // Cambiar posiciones en el dataset
        cell = emptyCell.cell;
        cell.dataset.x = CellCopyX;
        cell.dataset.y = CellCopyY;
        cell.dataset.newPositionX = emptyCellCopyNX;
        cell.dataset.newPositionY = emptyCellCopyNY;
        emptyCell = {
            cell: pp,
            x: emptyCellCopyX,
            y: emptyCellCopyY,
            newPositionX: CellCopyNX,
            newPositionY: CellCopyNY
        };
        emptyCell.cell.dataset.x = emptyCell.x;
        emptyCell.cell.dataset.y = emptyCell.y;
        emptyCell.cell.dataset.newPositionX = emptyCell.newPositionX;
        emptyCell.cell.dataset.newPositionY = emptyCell.newPositionY;

        console.log('casilla', cell);
        console.log('vacia', emptyCell.cell);

        moves++;
        movements.textContent = moves; // Actualiza el contenido del elemento HTML con el puntaje
        console.log('Movimientos: ', moves);

        // Verificar si todas las casillas están en sus posiciones originales
        if (checkPuzzleCompletion(size)) {
            // El rompecabezas está completo, puedes mostrar un mensaje o realizar alguna acción
            console.log('¡Has completado el rompecabezas!');
            console.log('Movimientos totales: ', moves);
            completion.classList.remove('hidden');
        }
        } else {
        // La celda no es adyacente a la casilla vacía, no se realiza el movimiento
        console.log('Movimiento inválido');
        }
}

/**
 * Comprueba si el rompecabezas está completo.
 * @param {number} size - El tamaño del tablero del rompecabezas.
 * @returns {boolean} - Verdadero si se completa el rompecabezas; falso en caso contrario.
 */
function checkPuzzleCompletion(size) {
    success = 0;
    for (let i = 0; i < cellsList.length; i++) {
        const cell = cellsList[i];
        const cellX = parseInt(cell.dataset.newPositionX);
        const cellY = parseInt(cell.dataset.newPositionY);

        //console.log(i, cellX, cellY);
        // Verificar si la celda está en su posición original
        if (cellX == parseInt(cell.dataset.x) && cellY == parseInt(cell.dataset.y)) {
            console.log(cellX, cellY, parseInt(cell.dataset.x), parseInt(cell.dataset.y));
            success++;
            if (success == size*size-1){
                return true;
            }
            //return false; // Todas las celdas están en sus posiciones originales
        }
    }

    return false; // Al menos una celda no está en su posición original
}

/**
 * Mezcla el rompecabezas dado.
 * @param {Array} array - El array que se va a mezclar.
 * @param {number} size - El tamaño del tablero del rompecabezas..
 */
function shuffleArray(array, size) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        const tempX = array[i].dataset.x;
        const tempY = array[i].dataset.y; 

        const tempX2 = cellObjets[i].x
        const tempY2 = cellObjets[i].y

        console.log(tempX, tempY)
        console.log(array[j].dataset.x, array[j].dataset.y)

        cellObjets[i].x = parseInt(array[j].dataset.x)
        cellObjets[i].y = parseInt(array[j].dataset.y)

        cellObjets[j].x = parseInt(tempX2)
        cellObjets[j].y = parseInt(tempY2)

        array[i].dataset.x = array[j].dataset.x;
        array[i].dataset.y = array[j].dataset.y;
        array[i].style.backgroundPosition = `-${(imageWidth / size) * array[j].dataset.x}px -${(imageHeight / size) * array[j].dataset.y}px`;
        array[j].dataset.x = tempX;
        array[j].dataset.y = tempY;
        array[j].style.backgroundPosition = `-${(imageWidth / size) * tempX}px -${(imageHeight / size) * tempY}px`;
    }
    
}

//Algoritmo backtracking
//***********************************************************************************************

/**
 * Clase que representa el algoritmo de backtracking para resolver el rompecabezas.
 */
class BackTracking {

    constructor( board, emptyCell ) {
        console.log("Tableroo", board)
        this.updateBoardState(board)
        this.emptyCell = emptyCell;
    }
 
    updateBoardState(newBoard){
        this.board = newBoard;
        this.size = Math.sqrt(this.board.length);
    }

    changePosition(cell) {
        let auxEmptyCell = this.emptyCell
        let auxCell = cell
        cell.x = auxEmptyCell.x
        cell.y = auxEmptyCell.y
        this.emptyCell.x = auxCell.x
        this.emptyCell.y = auxCell.y
    }
 
    verifyValidMove( cell ) {
       const dx = Math.abs(cell.x - this.emptyCell.x)
       const dy = Math.abs(cell.y - this.emptyCell.y)
       return ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
    }
 
    getAllValidMoves() {
        //Se limpia la lista
        this.validMoves = []
        for ( let i = 0; i < this.board.length; i++ ) {
            if ( this.verifyValidMove(this.board[i]) ) {
                //Se agregan las casillas que se pueden mover
                this.validMoves.push(this.board[i])
            }
        }
        return this.validMoves
    }
 
    checkPuzzleCompletion() {
        //Se compara la posicion actual, con la posicion target
        console.log("Tablero", this.board)
        for (let i = 0; i < this.board.length; i++) {
            if (!( (this.board[i].x === this.board[i].target.x) && (this.board[i].y === this.board[i].target.y) ) ) {
                console.log(this.board[i])
                return false
            }
        }
        return true
    }
 
    solve(validMovesLength){
        //Encontramos una solución
        if ( this.checkPuzzleCompletion() ) {
            return true;
        }
 
        for ( let i = 0; i < validMovesLength; i++ ) {
            //Realiza el movimiento, con 100ms de diferencia para que se note
            setTimeout(() => {}, 100)
            this.validMoves[i].cell.click()
            this.changePosition(this.validMoves[i])
            //Calcula los movimientos posibles luego de que se cambie la posicion
            let validMoves = this.getAllValidMoves()
 
            //Llama recursivamente con el nuevo estado, en caso de estar resuelto, nos retornara true
            if ( this.solve(validMoves.length) ) {
                alert("HAZ COMPLETADO EL JUEGO")
                return
            }
            //Se rehace el movimiento
            setTimeout(this.validMoves[i].cell.click(), 100)
        }
        alert("No existe solucion")
 
    }
 }
 //***********************************************************************************************

/**
 * Event Listener para el botón de inicio para crear un nuevo tablero de rompecabezas.
 */
startButton.addEventListener('click', () => {
    const size = parseInt(boardSizeInput.value);
    const selectedImage = imageOptions.value;
    completion.classList.add('hidden');
    movements.textContent = 0;
    createPuzzleBoard(size, selectedImage);
});

/**
 * Event listener para el botón de resolución con backtracking.
 * Llama al algoritmo de backtracking para resolver el rompecabezas.
 */
backTrackingButton.addEventListener('click', () => {
    backTrackingAlgorithm = new BackTracking(cellObjets, specialCell)
    //Se llama la solucion
    backTrackingAlgorithm.solve( backTrackingAlgorithm.getAllValidMoves().length )
})


/**
 * Clase que representa un nodo en el espacio de búsqueda del rompecabezas.
 */
class PuzzleNode {
    constructor(board, emptyCell, moves) {
        this.board = board;
        this.emptyCell = emptyCell;
        this.moves = moves;
        this.heuristic = this.calculateHeuristic();
    }

    // Calcula la heurística (número de fichas mal colocadas)
    calculateHeuristic() {
        let misplacedTiles = 0;
        for (let i = 0; i < this.board.length; i++) {
            const cell = this.board[i];
            if (cell.x !== cell.target.x || cell.y !== cell.target.y) {
                misplacedTiles++;
            }
        }
        return misplacedTiles;
    }

    // Calcula el costo total del nodo (g + h)
    getTotalCost() {
        return this.moves + this.heuristic;
    }
}

/**
 * Resuelve el rompecabezas utilizando el algoritmo A*.
 */
class AStarSolver {

    constructor(board, emptyCell) {
        this.board = board;
        this.emptyCell = emptyCell;
        this.size = Math.sqrt(this.board.length);
    }

    // Encuentra la posición del nodo vacío en el tablero
    findEmptyCellPosition(board) {
        for (let i = 0; i < board.length; i++) {
            const cell = board[i];
            if (cell.x === this.emptyCell.x && cell.y === this.emptyCell.y) {
                return i;
            }
        }
        return -1;
    }

    // Genera los movimientos válidos a partir de un estado dado
    generateValidMoves(node) {
        const validMoves = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Movimientos arriba, derecha, abajo, izquierda

        for (const dir of directions) {
            const newX = node.emptyCell.x + dir[0];
            const newY = node.emptyCell.y + dir[1];

            if (newX >= 0 && newX < this.size && newY >= 0 && newY < this.size) {
                const index = this.findEmptyCellPosition(node.board);
                const newBoard = node.board.slice(); // Clonar el tablero actual
                newBoard[index] = node.board[newX * this.size + newY];
                newBoard[newX * this.size + newY] = this.emptyCell;
                validMoves.push(new PuzzleNode(newBoard, { x: newX, y: newY }, node.moves + 1));
            }
        }
        return validMoves;
    }

    // Resuelve el rompecabezas utilizando el algoritmo A*
    solve() {
        const startNode = new PuzzleNode(this.board, this.emptyCell, 0);
        const openSet = [startNode];
        const closedSet = new Set();

        while (openSet.length > 0) {
            // Ordenar la lista de nodos por el costo total (f = g + h)
            openSet.sort((a, b) => a.getTotalCost() - b.getTotalCost());

            const currentNode = openSet.shift();

            // Verificar si hemos llegado al estado objetivo
            if (currentNode.heuristic === 0) {
                alert("¡Has completado el rompecabezas en ${currentNode.moves} movimientos!");
                return;
            }

            // Marcar el nodo actual como visitado
            closedSet.add(JSON.stringify(currentNode.board));

            // Generar movimientos válidos desde el nodo actual
            const validMoves = this.generateValidMoves(currentNode);

            for (const move of validMoves) {
                const key = JSON.stringify(move.board);
                if (!closedSet.has(key)) {
                    openSet.push(move);
                }
            }
        }

        alert("No existe solución para este rompecabezas.");
    }
}

// Event listener para el botón de resolución con A*
aEstrellaButton.addEventListener('click', () => {
    const aStarSolver = new AStarSolver(cellObjets, specialCell);
    aStarSolver.solve();
});