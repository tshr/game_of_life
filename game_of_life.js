// Crockford's object creation method

function setupObjectCreationMethod(){
	if(typeof Object.create !== 'function') {
		Object.create = function (o) {
			var F = function() {};
			F.prototype = o;
			return new F();
		};
	}
}

function initAndRunConway() {
	window.CONWAY = {};
	CONWAY.num_rows = 30;
	CONWAY.num_columns = 48;
	CONWAY.canvas_width = 480;
	CONWAY.canvas_height = 300;
	CONWAY.paused = false;
	CONWAY.interval_reference = null;
	CONWAY.paper = Raphael("canvas", CONWAY.canvas_width, CONWAY.canvas_height);
	CONWAY.alive_color = "#50c0a8";

	runConway();
}

function runConway() {

	setupObjectCreationMethod();
	setPauseKeyListener();
	generateWorld();
	populateWorld();
	runWorld();
}

function setPauseKeyListener() {
	$(window).keydown(function(event){
    	if (event.keyCode === 80) CONWAY.paused = !CONWAY.paused;
	});
}

function runWorld(){

	updateWorld();

	if (!CONWAY.paused) {
		setTimeout(runWorld, 50);
	} else {
		CONWAY.interval_reference = setInterval("if (!CONWAY.paused) restartWorld()", 100);
	}

}

function restartWorld() {
	clearInterval(CONWAY.interval_reference);
	CONWAY.interval_reference = null;
	runWorld();
}

function createRaphaelGrid() {
	var grid_cell_height = CONWAY.canvas_height/CONWAY.num_rows;
	var grid_cell_width = CONWAY.canvas_width/CONWAY.num_columns;

	for (var j = 0; j < CONWAY.num_rows; j++) {
		for (var k = 0; k < CONWAY.num_columns; k++) {
			createRaphaelCell(j, k, grid_cell_height, grid_cell_width);
		}
	}
}

function createRaphaelCell(row, column, height, width) {
	var cell = CONWAY.paper.rect(column*width, row*height, width, height);

	cell.attr({stroke:"#d8d8d8"});
	cell.node.id = 'cell_' + row + "_" + column;
	cell.data("row", row);
	cell.data("column", column);
	cell.click(function () {
		var cell_data = CONWAY.world[this.data("row")][this.data("column")];
    	cell_data.alive = cell_data.alive === true ? false : true;
		if (cell_data.alive) {
			this.attr({fill: CONWAY.alive_color});
		} else {
			this.attr({fill:"#ffffff"});
		}
 	});
}

function generateWorld(){

	var cell_template = {
		alive : false
	};

	var grid = [];

	for (var j = 0; j < CONWAY.num_rows; j++) {
		var arr = [];
		for (var k = 0; k < CONWAY.num_columns; k++) {	
			var cell = Object.create(cell_template);
			arr.push(cell);
		}
		grid.push(arr);
	}

	grid.draw = function(){
		for (var j = 0; j < CONWAY.num_rows; j++) {
			for (var k = 0; k < CONWAY.num_columns; k++) {
				grid[j][k].alive ? drawCell(j, k, true) : drawCell(j, k, false);
			}
		}
	}
	CONWAY.world = grid;

	createRaphaelGrid();
}

function drawCell(row, column, alive) {
	var cell = getCellByCoord(row, column);

	if (alive) {
		cell.attr({fill: CONWAY.alive_color});
	} else {
		cell.attr({fill:"#ffffff"});
	}
}

function getCellByCoord(row, column) {
	var cell_id_string = "cell_" + row + "_" + column;
	return $("#" + cell_id_string);
}

function populateWorld() {

	//GLIDER 1
	CONWAY.world[0][8].alive = true;
	CONWAY.world[1][9].alive = true;
	CONWAY.world[2][9].alive = true;
	CONWAY.world[2][8].alive = true;
	CONWAY.world[2][7].alive = true;

	//BEEHIVES
	CONWAY.world[13][22].alive = true;
	CONWAY.world[14][21].alive = true;
	CONWAY.world[14][23].alive = true;
	CONWAY.world[15][21].alive = true;
	CONWAY.world[15][23].alive = true;
	CONWAY.world[16][22].alive = true;
	CONWAY.world[16][23].alive = true;
}

function updateWorld() {

	CONWAY.world.draw();
	var results_grid = determineNextGenerationCellStates();
	updateCells(results_grid);
}

function determineNextGenerationCellStates() {

	var grid = [];
	for (var j = 0; j < CONWAY.world.length; j++) {
		var arr = [];
		for (var k = 0; k < CONWAY.world[j].length; k++) {
			arr.push(calculateIfCellAlive(j,k));
		}
		grid.push(arr);
	}
	return grid;
}

function calculateIfCellAlive(row, column) {
	var count = countNeighbors();

	if (CONWAY.world[row][column].alive) {
		if (count < 2) return false;
		if (count <= 3) return true;
		if (count > 3) return false;
	} else {
		return (count === 3) ? true : false;
	}

	function countNeighbors() {
		var count = 0;

		count += CONWAY.world[wrappedRow(row - 1)][wrappedColumn(column - 1)].alive ? 1 : 0;
		count += CONWAY.world[wrappedRow(row - 1)][column].alive ? 1 : 0;
		count += CONWAY.world[wrappedRow(row - 1)][wrappedColumn(column + 1)].alive ? 1 : 0;
		count += CONWAY.world[wrappedRow(row + 1)][wrappedColumn(column - 1)].alive ? 1 : 0;
		count += CONWAY.world[wrappedRow(row + 1)][column].alive ? 1 : 0;
		count += CONWAY.world[wrappedRow(row + 1)][wrappedColumn(column + 1)].alive ? 1 : 0;
		count += CONWAY.world[row][wrappedColumn(column - 1)].alive ? 1 : 0;
		count += CONWAY.world[row][wrappedColumn(column + 1)].alive ? 1 : 0;

		return count;
	}
}

function wrappedRow(row) {
	if (row < 0) {
		return CONWAY.num_rows - 1
	} else if (row >= CONWAY.num_rows) {
		return 0;
	} else {
		return row;
	}
}

function wrappedColumn(column) {
	if (column < 0) {
		return CONWAY.num_columns - 1
	} else if (column >= CONWAY.num_columns) {
		return 0;
	} else {
		return column;
	}
}

function updateCells(results_grid) {
	for (var j = 0; j < results_grid.length; j++) {
		var arr = [];
		for (var k = 0; k < results_grid[j].length; k++) {
			CONWAY.world[j][k].alive = results_grid[j][k];
		}
	}
}