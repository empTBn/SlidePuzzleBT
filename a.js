class PuzzleNode {
    constructor(board, emptyCell, moves, parent) {
        this.board = board; // Representación actual del tablero
        this.emptyCell = emptyCell; // Posición de la celda vacía
        this.moves = moves; // Número de movimientos realizados hasta este nodo
        this.parent = parent; // Nodo padre
        this.heuristic = this.calculateHeuristic(); // Valor heurístico (número de fichas mal colocadas)
    }

    // Calcula la heurística (número de fichas mal colocadas)
    calculateHeuristic() {
        let misplacedTiles = 0;
        for (const cell of this.board) {
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

class AStarSolver {
    constructor(board, emptyCell) {
        this.board = board; // Representación actual del tablero
        this.emptyCell = emptyCell; // Posición de la celda vacía
        this.size = Math.sqrt(board.length); // Tamaño del tablero (asumiendo que es cuadrado)
    }

    // Encuentra la posición de una celda en el tablero
    findCellPosition(cell) {
        return cell.x * this.size + cell.y;
    }

    // Genera los movimientos válidos a partir de un estado dado
    generateValidMoves(node) {
        const validMoves = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Movimientos arriba, derecha, abajo, izquierda

        for (const dir of directions) {
            const newX = node.emptyCell.x + dir[0];
            const newY = node.emptyCell.y + dir[1];

            if (newX >= 0 && newX < this.size && newY >= 0 && newY < this.size) {
                const emptyPos = this.findCellPosition(node.emptyCell);
                const newBoard = [...node.board]; // Clonar el tablero actual
                // Intercambiar la celda vacía con la celda adyacente
                [newBoard[emptyPos], newBoard[this.findCellPosition({ x: newX, y: newY })]] =
                    [newBoard[this.findCellPosition({ x: newX, y: newY })], newBoard[emptyPos]];
                validMoves.push(new PuzzleNode(newBoard, { x: newX, y: newY }, node.moves + 1, node));
            }
        }
        return validMoves;
    }

    // Resuelve el rompecabezas utilizando el algoritmo A*
    solve() {
        const startNode = new PuzzleNode(this.board, this.emptyCell, 0, null);
        const openSet = [startNode];
        const closedSet = new Set();

        while (openSet.length > 0) {
            // Ordenar la lista de nodos por el costo total (f = g + h)
            openSet.sort((a, b) => a.getTotalCost() - b.getTotalCost());

            const currentNode = openSet.shift();

            // Verificar si hemos llegado al estado objetivo
            if (currentNode.heuristic === 0) {
                // Reconstruir el camino hacia la solución
                const solutionPath = [];
                let current = currentNode;
                while (current !== null) {
                    solutionPath.push(current.board);
                    current = current.parent;
                }
                solutionPath.reverse();
                console.log('Se encontró una solución:');
                console.log(`Movimientos realizados: ${solutionPath.length - 1}`);
                for (let i = 1; i < solutionPath.length; i++) {
                    console.log(`Movimiento ${i}:`);
                    // Imprimir el tablero en cada paso del camino
                    for (let row = 0; row < this.size; row++) {
                        console.log(solutionPath[i]
                            .slice(row * this.size, (row + 1) * this.size)
                            .map(cell => `(${cell.x},${cell.y})`)
                            .join(' '));
                    }
                }
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

        console.log('No se encontró una solución.');
    }
}

// Event listener para el botón de resolución con A*
aEstrellaButton.addEventListener('click', () => {
    const aStarSolver = new AStarSolver(cellObjets, emptyCell);
    aStarSolver.solve();
});

