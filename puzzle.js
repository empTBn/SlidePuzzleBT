
var rows = 3;
var columns = 3; // remember to change later to let the user set the size

var currTile; // selected tile
var otherTile; // blank tile

var turns = 0;

//var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] // need to adjust according to the size
var imgOrder = ["8", "1", "5", "2", "9", "3", "6", "8", "blank"] // also to make a function so that the order can be random and not preset

window.onload = function() {
    for (let r=0; r<rows; r++) {
        for (let c=0; c<columns; c++) {
            
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString(); // tile coordinates
            tile.src = imgOrder.shift() + ".jpg"; // pop the image from the array
            
            // DRAG FUNCTION
            
            tile.addEventListener("dragstart", dragStart); // click an image
            tile.addEventListener("dragover", dragOver); // moving the image while clicked
            tile.addEventListener("dragenter", dragEnter); //dragging image onto another one
            tile.addEventListener("dragleave", dragLeave); // leaves another image
            tile.addEventListener("drop", dragDrop); // drop the image
            tile.addEventListener("dragend", dragEnd); // swap the two tiles

            document.getElementById("board").append(tile);

        }
    }
}

function dragStart() {
    currTile = this; // img tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; // img tile being dropped on
}

function dragEnd() {
    if (!otherTile.src.includes("blank.jpg")) {
        return;
    }

    let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c-1;
    let moveRight = r == r2 && c2 == c+1;

    let moveUp = c == c2 && r2 == r-1;
    let moveDown = c == c2 && r2 == r+1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;
    }
}