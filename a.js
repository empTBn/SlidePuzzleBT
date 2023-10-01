/**
 * Representa un nodo en el algoritmo A*.
 */
class Node {
    constructor(data, level, fval) {
        this.data = data;
        this.level = level;
        this.fval = fval;
    }

    /**
     * Genera los nodos hijos del nodo actual moviendo el espacio en blanco en las cuatro direcciones.
     */
    generateChild() {
        const [x, y] = this.find(this.data, '_');
        const valList = [
            [x, y - 1],
            [x, y + 1],
            [x - 1, y],
            [x + 1, y]
        ];
        const children = [];
        for (const [i, j] of valList) {
            const child = this.shuffle(this.data, x, y, i, j);
            if (child !== null) {
                const childNode = new Node(child, this.level + 1, 0);
                children.push(childNode);
            }
        }
        return children;
    }

    /**
     * Mueve el espacio en blanco en la dirección especificada y devuelve el nuevo estado del rompecabezas.
     */
    shuffle(puz, x1, y1, x2, y2) {
        if (x2 >= 0 && x2 < puz.length && y2 >= 0 && y2 < puz[0].length) {
            const tempPuz = this.copy(puz);
            const temp = tempPuz[x2][y2];
            tempPuz[x2][y2] = tempPuz[x1][y1];
            tempPuz[x1][y1] = temp;
            return tempPuz;
        } else {
            return null;
        }
    }

    /**
     * Realiza una copia profunda de una matriz.
     */
    copy(root) {
        const temp = [];
        for (const row of root) {
            temp.push([...row]);
        }
        return temp;
    }

    /**
     * Encuentra la posición del espacio en blanco en el rompecabezas.
     */
    find(puz, x) {
        for (let i = 0; i < puz.length; i++) {
            for (let j = 0; j < puz[i].length; j++) {
                if (puz[i][j] === x) {
                    return [i, j];
                }
            }
        }
    }
}

/**
 * Implementación del algoritmo A* para resolver el rompecabezas.
 */
class PuzzleSolver {
    constructor(size) {
        this.size = size;
        this.open = [];
        this.closed = [];
    }

    /**
     * Calcula la heurística h(x) que representa la diferencia entre el rompecabezas actual y el objetivo.
     */
    h(start, goal) {
        let temp = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (start[i][j] !== goal[i][j] && start[i][j] !== '_') {
                    temp += 1;
                }
            }
        }
        return temp;
    }

    /**
     * Calcula el valor f(x) utilizado en el algoritmo A* (f(x) = h(x) + g(x)).
     */
    f(start, goal) {
        return this.h(start, goal) + start.level;
    }

    /**
     * Resuelve el rompecabezas utilizando el algoritmo A*.
     */
    solve(start, goal) {
        start = new Node(start, 0, 0);
        start.fval = this.f(start, goal);
        this.open.push(start);

        while (true) {
            const cur = this.open[0];

            if (this.h(cur.data, goal) === 0) {
                break;
            }

            for (const child of cur.generateChild()) {
                child.fval = this.f(child, goal);
                this.open.push(child);
            }

            this.closed.push(cur);
            this.open.shift();

            this.open.sort((a, b) => a.fval - b.fval);
        }
    }
}

