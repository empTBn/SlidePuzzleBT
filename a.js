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

