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

let orderList = [];

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
                    
                    cellObjets.push({cell:cell, empty:true, x:x, y:y})

                    specialCell = cellObjets[cellObjets.length - 1]
                    
                } else {
                    cell.style.backgroundImage = `url(${selectedImage})`;
                    cell.style.backgroundSize = `${imageWidth}px ${imageHeight}px`;
                    cell.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
                    console.log(cell);
                    cell.addEventListener('click', () => { movePiece(cell, size); });
                    //Agrego este objeto a la lista
                    cellObjets.push({cell:cell, empty:false, x:x, y:y})
                    
                }
                cell.dataset.newPositionX = x;
                cell.dataset.newPositionY = y;
                cellsList.push(cell);
                board.appendChild(cell);
            }
        }
        emptyCell.x = emptyCell.cell.dataset.x;
        emptyCell.y = emptyCell.cell.dataset.y;
        orderList = cellsList;
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
        console.log("x", cellX, "y", cellY, "esperadox", parseInt(cell.dataset.x), "esperadoY", parseInt(cell.dataset.y))
        //console.log(i, cellX, cellY);
        // Verificar si la celda está en su posición original
        if (cellX == parseInt(cell.dataset.x) && cellY == parseInt(cell.dataset.y)) {
            console.log(cellX, cellY, parseInt(cell.dataset.x), parseInt(cell.dataset.y));
            console.log(cellX, cellY);
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
 * Comprueba si el rompecabezas está completo.
 * @param {number} size - El tamaño del tablero del rompecabezas.
 * @returns {boolean} - Verdadero si se completa el rompecabezas; falso en caso contrario.
 */
function checkPuzzleCompletion2(size, cellsList2) {
    success = 0;
    for (let i = 0; i < cellsList2.length; i++) {
        const cell = cellsList2[i];
        const cellX = parseInt(cell.dataset.newPositionX);
        const cellY = parseInt(cell.dataset.newPositionY);
        console.log("x", cellX, "y", cellY, "esperadox", parseInt(cell.dataset.x), "esperadoY", parseInt(cell.dataset.y))
        //console.log(i, cellX, cellY);
        // Verificar si la celda está en su posición original
        if (cellX == parseInt(cell.dataset.x) && cellY == parseInt(cell.dataset.y)) {
            console.log(cellX, cellY, parseInt(cell.dataset.x), parseInt(cell.dataset.y));
            console.log(cellX, cellY);
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



//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Define a Puzzle State Class
class PuzzleState {
    constructor(board, moves, heuristic) {
        this.board = board;          // Current puzzle board configuration
        this.moves = moves;          // Number of moves taken to reach this state
        this.heuristic = heuristic;  // Heuristic value (e.g., Manhattan distance)
        this.parent = null;          // Parent state (for tracing back the solution)
    }

    // Define a method to calculate the total cost of a state (f(n) = g(n) + h(n))
    getTotalCost() {
        return this.moves + this.heuristic;
    }

    getAllValidMoves(currentNode) {
        let size = parseInt(boardSizeInput.value);
        const validMoves = [];
    
        // Find the position of the empty cell
        const emptyCellX = parseInt(emptyCell.x);
        const emptyCellY = parseInt(emptyCell.y);
        console.log("emptyCell", emptyCellX, emptyCellY);
    
        // Define the possible directions (up, down, left, right)
        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 },  // Right
        ];
    
        // Check each direction
        for (const direction of directions) {
            const newX = emptyCellX + direction.dx;
            const newY = emptyCellY + direction.dy;
            //console.log("newX", newX, "newY", newY, "emptyCellX", emptyCellX, "emptyCellY", emptyCellY);
            // Check if the new position is within bounds
            if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
                // Create a copy of the current board
                const newBoard = currentNode.board.slice();
                /*onsole.log("newBoard", newBoard);
                // Swap the empty cell with the neighboring cell
                const emptyIndex = emptyCellY * size + emptyCellX;
                const neighborIndex = newY * size + newX;
                console.log("emptyIndex", emptyIndex, "neighborIndex", neighborIndex);
                [newBoard[emptyIndex], newBoard[neighborIndex]] = [newBoard[neighborIndex], newBoard[emptyIndex]];
                console.log("nose", [newBoard[emptyIndex]]);

                newBoard[emptyIndex].dataset.x = newX;
                newBoard[emptyIndex].dataset.y = newY;
                console.log("newBoard", newBoard[emptyIndex]);
                // Add the new board configuration to the valid moves*/
                const emptyIndex = buscarposicion(newBoard, emptyCellX, emptyCellY);
                console.log("emptyIndex", emptyIndex);
                const neighborIndex = buscarposicion(newBoard, newX, newY);
                console.log("neighbor", neighborIndex);
                console.log("indice", newBoard);
                const copia = newBoard[neighborIndex];
                newBoard[neighborIndex] = newBoard[emptyIndex];
                newBoard[emptyIndex] = copia;
                
                validMoves.push(newBoard);
            }
        }
        console.log("validMoves", validMoves);
        return validMoves;
    }
}

function buscarposicion(newBoard, newX, newY){
    var i = 0;
    for (const cell of newBoard){
        i++;
        var x = parseInt(cell.dataset.newPositionX);
        var y = parseInt(cell.dataset.newPositionY);
        
        //console.log("x", x, "y", y);
        if(x == newX && y == newY){
            return i-1;
        }
    }
}

// A* Algorithm
function solveWithAStar() {
    let size = parseInt(boardSizeInput.value);
    let ciclo = 0;
    // Create the initial puzzle state
    const initialNode = new PuzzleState(cellsList, 0, calculateHeuristic(cellsList));
    console.log(initialNode);
    const openSet = [initialNode];
    const visited = new Set();

    // Define the heuristic function (Manhattan distance)
    function calculateHeuristic(board) {
        let heuristic = 0;
        // Calculate the Manhattan distance for each til
        for (let i = 0; i < board.length; i++) {
            const targetX = i % size;
            //console.log(targetX);
            const targetY = Math.floor(i / size);
            //console.log(targetY);
            //console.log("posicion i", board[i]);
            const currentX = board[i].dataset.newPositionX;
            //console.log("currentx", currentX);
            const currentY = board[i].dataset.newPositionY;
            //console.log("currenty", currentY);
            heuristic += Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
        }
        return heuristic;
    }

    while (ciclo < size*100000 && openSet.length > 0) {
        console.log("openSet Length", openSet.length);
        // Select the state with the lowest total cost (f(n)) from the open set
        
        openSet.sort((a, b) => a.getTotalCost() - b.getTotalCost());
        //console.log("openSet", openSet);
        const currentNode = openSet.shift();
        //console.log("currentNode", currentNode);
        // Mark the current state as visited
        visited.add(JSON.stringify(currentNode.board));

        // Check if the current state is the goal state
        if (checkPuzzleCompletion2(currentNode.board.length, currentNode.board)) {
            // Trace back the solution
            const solutionPath = [];
            let current = currentNode;
            while (current !== null) {
                solutionPath.unshift(current);
                current = current.parent;
            }

            // Apply the moves to the game board (you'll need to implement this)
            applyMovesToGameBoard(solutionPath);

            alert("Puzzle solved!");
            return;
        }

        // Generate neighboring states
        const validMoves = currentNode.getAllValidMoves(currentNode);
        console.log("validMoves", validMoves);
        for (const move of validMoves) {
            console.log("move", move);
            const newState = new PuzzleState(move, currentNode.moves + 1, calculateHeuristic(move));
            console.log("newState", newState);
            newState.parent = currentNode;

            // Check if the state has not been visited
            if (!visited.has(JSON.stringify(newState))) {
                //console.log("entra holaaqui");
                openSet.push(newState);
            }
        }
        ciclo++;
    }

    alert("No solution found.");
}


// Event listener for the "Solve with A*" button
aEstrellaButton.addEventListener('click', () => {
    console.log("celllits", cellsList);
    solveWithAStar();
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Algoritmo backtracking
//***********************************************************************************************
class BackTracking {

    constructor( board, cellObjects ) {
        this.moves = []
        this.updateBoardState(board, cellObjects)
        this.setNewCords()
    }
 
    updateBoardState(newBoard, cellObjects){
        this.board = newBoard;
        this.cellObjects = cellObjects // Corregido aquí
        this.size = Math.sqrt(this.board.length);
    }

    setNewCords() {
        let matriz = []
        //La raiz para hacerlo por filas y columnas
        for (let i = 0; i < Math.sqrt(this.board.length); i++) {
            const subarray = this.board.slice(i * Math.sqrt(this.board.length), (i + 1) * Math.sqrt(this.board.length));
            matriz.push(subarray);
        }
        //Esto es para asignar como propiedad, las coordenadas originales en que estaba
        //Asi tenemos las coordenadas actuales y las que queremos llegar
        for(let i = 0; i < this.cellObjects.length; i++){
            for(let j = 0; j < matriz.length; j++){
                for(let k = 0; k < matriz[j].length; k++){
                    if (this.cellObjects[i].cell == matriz[j][k]) { // Corregido aquí
                        this.cellObjects[i].targetX = k // Corregido aquí
                        this.cellObjects[i].targetY = j // Corregido aquí
                    }
                }
            }
            
        }
        //Para declarar nuestra celda vacia como propiedad de la clase
        this.setEmptyCell()
    }

    //Para guardar como propiedad la celda vacia
    setEmptyCell() {
        for(let i = 0; i < this.cellObjects.length; i++){
            if (this.cellObjects[i].empty) { // Corregido aquí
                this.emptyCell = this.cellObjects[i] // Corregido aquí
            }
        }
    }

    //Para obtener el objeto de cada celda
    getObjectByCell(cell) {
        for(let i = 0; i < this.cellObjects.length; i++){
            if (this.cellObjects[i].cell == cell) { // Corregido aquí
                return this.cellObjects[i] // Corregido aquí
            }
        }
    }
 
    verifyValidMove( cellObject ) {
        const dx = Math.abs(cellObject.x - this.emptyCell.x)
        const dy = Math.abs(cellObject.y - this.emptyCell.y)
        return ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
    }

    cleanList(cellObject) {
        const auxList = []
        for(let i = 0; i < this.cellObjects.length; i++) {
            if (cellObject.cell == this.cellObjects[i].cell) {
                auxList.push(cellObject)
            } else if (this.cellObjects[i].empty) {
                auxList.push(this.emptyCell)
            } else {
                auxList.push(this.cellObjects[i])
            }
        }
        this.cellObjects = auxList
    }

    makeMove(cellObject) {
        for(let i = 0; i < this.cellObjects.length; i++) {
            if (cellObject == this.cellObjects[i]) {
                let auxEmptyCell = this.emptyCell
                let auxCell = cellObject
                this.emptyCell.x = auxCell.x
                this.emptyCell.y = auxCell.y
                let newCellObject = {
                    cell:cellObject.cell,
                    targetX:cellObject.targetX,
                    targetY:cellObject.targetY,
                    x:auxEmptyCell.x,
                    y:auxEmptyCell.y
                }
                this.cleanList(newCellObject)
            }
        }
    }
 
    getAllValidMoves() {
        //Se limpia la lista
        this.validMoves = []
        for ( let i = 0; i < this.cellObjects.length; i++ ) {
            if ( this.verifyValidMove(this.cellObjects[i])) {
                console.log("posible", this.cellObjects[i])
                //Se agregan las casillas que se pueden mover
                this.validMoves.push(this.cellObjects[i])
            }
        }
        return this.validMoves
    }

    verifyWin() {
        for(let i = 0; i < this.cellObjects.length; i++) {
            //Si la posicion actual de las casillas con foto es la misma que el target
            let condition = (this.cellObjects[i].x == this.cellObjects[i].targetX) && (this.cellObjects[i].y == this.cellObjects[i].targetY) && (!this.cellObjects[i].empty)
            if (!condition) {
                //Si alguna no lo cumple retorna false
                return false
            }
        }
        return true
    }
 
    solve(validMoves){
        //Encontramos una solución
        if ( this.verifyWin()) {
            //Hace los movimientos en el tablero cada medio segundo para que se note
            for (let i = 0; i < this.moves.length; i++) {
                setTimeout(() => {this.moves[i].cell.click()}, 500)
            }
            alert("HAZ COMPLETADO EL JUEGO")
            return true;
        }
        for (let i = 0; i < validMoves.length; i++ ) {
            console.log("Mueve", validMoves[i])
            //Se cambia la posicion de forma logica
            this.makeMove(validMoves[i])
            //Se agrega a la pila de movimientos
            this.moves.push(validMoves[i])
            //Se actualiza el estado
            let validMovesUpdate = this.getAllValidMoves()
            console.log("Validos", validMovesUpdate)
            //Llama recursivamente con el nuevo estado, en caso de estar resuelto, nos retornara true
            if ( this.solve(validMovesUpdate) ) {
                return
            }
            //Se devuelve este movimiento
            //Se saca de la lista de movimientos
            console.log("Devuelve", validMoves[i])
            this.moves.pop()
        }
    }
 }

backTrackingButton.addEventListener('click', () => {
    backTrackingAlgorithm = new BackTracking(orderList, cellObjets)
    //Se llama la solucion
    backTrackingAlgorithm.solve( backTrackingAlgorithm.getAllValidMoves() )
})



