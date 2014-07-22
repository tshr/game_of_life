// Generated by CoffeeScript 1.6.3
/*
Toshiro Ken Sugihara 2013
*/


(function() {
  $(function() {
    var World, paused, run, setPauseListener, tickInterval, world;
    World = (function() {
      function World(numRows, numColumns, canvasHeight, canvasWidth, aliveColor) {
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.aliveColor = aliveColor;
        this.grid = [];
        this.fillGrid();
        this.createCells(canvasWidth, canvasHeight);
      }

      World.prototype.fillGrid = function() {
        var i, row, _i, _j, _ref, _ref1, _results;
        _results = [];
        for (i = _i = 0, _ref = this.numRows; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          row = [];
          for (_j = 0, _ref1 = this.numColumns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; 0 <= _ref1 ? _j++ : _j--) {
            row.push({
              alive: false
            });
          }
          _results.push(this.grid.push(row));
        }
        return _results;
      };

      World.prototype.createCells = function(canvasWidth, canvasHeight) {
        var createCell, gridCellHeight, gridCellWidth, j, k, paper, _i, _ref, _results;
        paper = Raphael("canvas", canvasWidth, canvasHeight);
        gridCellHeight = canvasHeight / this.numRows;
        gridCellWidth = canvasWidth / this.numColumns;
        createCell = function(paper, row, column, height, width, world) {
          var cell;
          cell = paper.rect(column * width, row * height, width, height);
          cell.node.id = "cell_" + row + "_" + column;
          return cell.attr({
            stroke: "#d8d8d8"
          }).data("row", row).data("column", column).click(function() {
            var cellData;
            cellData = world.grid[this.data("row")][this.data("column")];
            cellData.alive = !cellData.alive;
            return world.colorCell(this, cellData.alive);
          });
        };
        _results = [];
        for (j = _i = 0, _ref = this.numRows; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = this.numColumns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(createCell(paper, j, k, gridCellHeight, gridCellWidth, this));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      World.prototype.colorCell = function(cell, alive) {
        if (alive) {
          return cell.attr({
            fill: this.aliveColor
          });
        } else {
          return cell.attr({
            fill: "#ffffff"
          });
        }
      };

      World.prototype.draw = function() {
        var cell, cellIdString, j, k, _i, _ref, _results;
        _results = [];
        for (j = _i = 0, _ref = this.numRows; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = this.numColumns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              cellIdString = "cell_" + j + "_" + k;
              cell = $("#" + cellIdString);
              _results1.push(this.colorCell(cell, this.grid[j][k].alive));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      World.prototype.updateGrid = function(resultsGrid) {
        var arr, j, k, _i, _ref, _results;
        _results = [];
        for (j = _i = 0, _ref = resultsGrid.length; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          arr = [];
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = resultsGrid[j].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(this.grid[j][k].alive = resultsGrid[j][k]);
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      World.prototype.update = function() {
        this.draw();
        return this.updateGrid(this.getNextGenerationCellStates());
      };

      World.prototype.getNextGenerationCellStates = function() {
        var arr, j, k, nextGenGrid, _i, _j, _ref, _ref1;
        nextGenGrid = [];
        for (j = _i = 0, _ref = this.grid.length; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          arr = [];
          for (k = _j = 0, _ref1 = this.grid[j].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
            arr.push(this.calculateIfCellAlive(j, k));
          }
          nextGenGrid.push(arr);
        }
        return nextGenGrid;
      };

      World.prototype.wrapped = function(point, dimensionSize) {
        switch (false) {
          case !(point < 0):
            return dimensionSize - 1;
          case !(point >= dimensionSize):
            return 0;
          default:
            return point;
        }
      };

      World.prototype.countNeighbors = function(row, column) {
        var cellColumn, cellRow, columnPosition, count, relPositions, rowPosition, _i, _j, _len, _len1;
        count = 0;
        relPositions = [-1, 0, 1];
        for (_i = 0, _len = relPositions.length; _i < _len; _i++) {
          rowPosition = relPositions[_i];
          for (_j = 0, _len1 = relPositions.length; _j < _len1; _j++) {
            columnPosition = relPositions[_j];
            if (!(rowPosition === 0 && columnPosition === 0)) {
              cellRow = this.wrapped(row + rowPosition, this.numRows);
              cellColumn = this.wrapped(column + columnPosition, this.numColumns);
              count += (this.grid[cellRow][cellColumn].alive ? 1 : 0);
            }
          }
        }
        return count;
      };

      World.prototype.calculateIfCellAlive = function(row, column) {
        var count;
        count = this.countNeighbors(row, column);
        if (this.grid[row][column].alive) {
          return (2 <= count && count <= 3);
        } else {
          return count === 3;
        }
      };

      World.prototype.populate = function() {
        this.grid[0][8].alive = true;
        this.grid[1][9].alive = true;
        this.grid[2][9].alive = true;
        this.grid[2][8].alive = true;
        this.grid[2][7].alive = true;
        this.grid[13][22].alive = true;
        this.grid[14][21].alive = true;
        this.grid[14][23].alive = true;
        this.grid[15][21].alive = true;
        this.grid[15][23].alive = true;
        this.grid[16][22].alive = true;
        return this.grid[16][23].alive = true;
      };

      return World;

    })();
    /* Main*/

    tickInterval = 50;
    paused = false;
    setPauseListener = function() {
      return $(window).keydown(function(event) {
        if (event.keyCode === 80) {
          if (paused) {
            paused = false;
            return run();
          } else {
            return paused = true;
          }
        }
      });
    };
    setPauseListener();
    world = new World(30, 48, 300, 480, "#50c0a8");
    world.populate();
    return (run = function() {
      world.update();
      if (!paused) {
        return setTimeout(run, tickInterval);
      }
    })();
  });

}).call(this);
