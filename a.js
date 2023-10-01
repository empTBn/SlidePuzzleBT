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

        for (const [newX, newY] of valList) {
            const child = this.shuffle(this.data, x, y, newX, newY);
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
        if (x2 >= 0 && x2 < puz.length && y2 >= 0 && y2 < puz.length) {
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
            const t = row.slice();
            temp.push(t);
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
        return [-1, -1];
    }
}

/**
 * Implementación del algoritmo A* para resolver el rompecabezas.
 */
class Puzzle {
    constructor(size) {
        this.n = size;
        this.open = [];
        this.closed = [];
    }

    accept() {
        const puz = [];
        for (let i = 0; i < this.n; i++) {
            const temp = prompt().split(" ");
            puz.push(temp);
        }
        return puz;
    }

    /**
     * Calcula el valor f(x) utilizado en el algoritmo A* (f(x) = h(x) + g(x)).
     */
    f(start, goal) {
        return this.h(start.data, goal) + start.level;
    }
    
    /**
     * Calcula la heurística h(x) que representa la diferencia entre el rompecabezas actual y el objetivo.
     */

    h(start, goal) {
        let temp = 0;
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (start[i][j] !== goal[i][j] && start[i][j] !== '_') {
                    temp++;
                }
            }
        }
        return temp;
    }

    /**
     * Resuelve el rompecabezas utilizando el algoritmo A*.
     */
    process() {
        console.log("Empieza el rompecabezas\n");
        const start = this.accept();
        console.log("Termino el rompezabezas\n");
        const goal = this.accept();

        const startNode = new Node(start, 0, 0);
        startNode.fval = this.f(startNode, goal);
        this.open.push(startNode);
        console.log("\n\n");

        while (true) {
            const cur = this.open[0];
            console.log("");
            console.log("  | ");
            console.log("  | ");
            console.log(" \\\'/ \n");
            for (const row of cur.data) {
                console.log(row.join(" "));
            }

            if (this.h(cur.data, goal) === 0) {
                break;
            }

            for (const childNode of cur.generateChild()) {
                childNode.fval = this.f(childNode, goal);
                this.open.push(childNode);
            }

            this.closed.push(cur);
            this.open.shift();

            this.open.sort((a, b) => a.fval - b.fval);
        }
    }
}

