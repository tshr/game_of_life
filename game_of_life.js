// Generated by CoffeeScript 1.6.3
/*
Toshiro Ken Sugihara 2013
*/


(function() {
  $(function() {
    var World, calculateIfCellAlive, getNextGenerationCellStates, paused, populateWorld, runWorld, setPauseListener, tick_interval, updateWorld, world;
    tick_interval = 50;
    paused = false;
    World = (function() {
      function World(num_rows, num_columns, canvas_height, canvas_width, alive_color) {
        this.num_rows = num_rows;
        this.num_columns = num_columns;
        this.alive_color = alive_color;
        this.grid = [];
        this.fillGrid();
        this.createRaphaelCells(canvas_width, canvas_height);
      }

      World.prototype.fillGrid = function() {
        var i, row, _i, _j, _ref, _ref1, _results;
        _results = [];
        for (i = _i = 0, _ref = this.num_rows; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          row = [];
          for (_j = 0, _ref1 = this.num_columns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; 0 <= _ref1 ? _j++ : _j--) {
            row.push({
              alive: false
            });
          }
          _results.push(this.grid.push(row));
        }
        return _results;
      };

      World.prototype.createRaphaelCells = function(canvas_width, canvas_height) {
        var grid_cell_height, grid_cell_width, j, k, paper, _i, _ref, _results;
        paper = Raphael("canvas", canvas_width, canvas_height);
        grid_cell_height = canvas_height / this.num_rows;
        grid_cell_width = canvas_width / this.num_columns;
        _results = [];
        for (j = _i = 0, _ref = this.num_rows; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = this.num_columns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(this.createRaphaelCell(paper, j, k, grid_cell_height, grid_cell_width));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      World.prototype.createRaphaelCell = function(paper, row, column, height, width) {
        var cell, world;
        cell = paper.rect(column * width, row * height, width, height);
        cell.node.id = "cell_" + row + "_" + column;
        world = this;
        return cell.attr({
          stroke: "#d8d8d8"
        }).data("row", row).data("column", column).click(function() {
          var cell_data;
          cell_data = world.grid[this.data("row")][this.data("column")];
          cell_data.alive = !cell_data.alive;
          return world.colorCell(this, cell_data.alive);
        });
      };

      World.prototype.getCellByCoord = function(row, column) {
        var cell_id_string;
        cell_id_string = "cell_" + row + "_" + column;
        return $("#" + cell_id_string);
      };

      World.prototype.drawCell = function(row, column, alive) {
        var cell;
        cell = this.getCellByCoord(row, column);
        return this.colorCell(cell, alive);
      };

      World.prototype.colorCell = function(cell, alive) {
        if (alive) {
          return cell.attr({
            fill: this.alive_color
          });
        } else {
          return cell.attr({
            fill: "#ffffff"
          });
        }
      };

      World.prototype.draw = function() {
        var j, k, _i, _ref, _results;
        _results = [];
        for (j = _i = 0, _ref = this.num_rows; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = this.num_columns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(this.drawCell(j, k, world.grid[j][k].alive));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      World.prototype.updateCells = function(results_grid) {
        var arr, j, k, _i, _ref, _results;
        _results = [];
        for (j = _i = 0, _ref = results_grid.length; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          arr = [];
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = results_grid[j].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(world.grid[j][k].alive = results_grid[j][k]);
            }
            return _results1;
          })());
        }
        return _results;
      };

      return World;

    })();
    populateWorld = function() {
      world.grid[0][8].alive = true;
      world.grid[1][9].alive = true;
      world.grid[2][9].alive = true;
      world.grid[2][8].alive = true;
      world.grid[2][7].alive = true;
      world.grid[13][22].alive = true;
      world.grid[14][21].alive = true;
      world.grid[14][23].alive = true;
      world.grid[15][21].alive = true;
      world.grid[15][23].alive = true;
      world.grid[16][22].alive = true;
      return world.grid[16][23].alive = true;
    };
    calculateIfCellAlive = function(row, column) {
      var count, countNeighbors, wrapped;
      wrapped = function(point, dimension_size) {
        switch (false) {
          case !(point < 0):
            return dimension_size - 1;
          case !(point >= dimension_size):
            return 0;
          default:
            return point;
        }
      };
      countNeighbors = function() {
        var cell_column, cell_row, column_position, count, rel_positions, row_position, _i, _j, _len, _len1;
        count = 0;
        rel_positions = [-1, 0, 1];
        for (_i = 0, _len = rel_positions.length; _i < _len; _i++) {
          row_position = rel_positions[_i];
          for (_j = 0, _len1 = rel_positions.length; _j < _len1; _j++) {
            column_position = rel_positions[_j];
            if (!(row_position === 0 && column_position === 0)) {
              cell_row = wrapped(row + row_position, world.num_rows);
              cell_column = wrapped(column + column_position, world.num_columns);
              count += (world.grid[cell_row][cell_column].alive ? 1 : 0);
            }
          }
        }
        return count;
      };
      count = countNeighbors();
      if (world.grid[row][column].alive) {
        return (2 <= count && count <= 3);
      } else {
        return count === 3;
      }
    };
    getNextGenerationCellStates = function() {
      var arr, j, k, next_gen_grid, _i, _j, _ref, _ref1;
      next_gen_grid = [];
      for (j = _i = 0, _ref = world.grid.length; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
        arr = [];
        for (k = _j = 0, _ref1 = world.grid[j].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
          arr.push(calculateIfCellAlive(j, k));
        }
        next_gen_grid.push(arr);
      }
      return next_gen_grid;
    };
    updateWorld = function() {
      world.draw();
      return world.updateCells(getNextGenerationCellStates());
    };
    setPauseListener = function() {
      return $(window).keydown(function(event) {
        if (event.keyCode === 80) {
          if (paused) {
            paused = !paused;
            return runWorld();
          } else {
            return paused = !paused;
          }
        }
      });
    };
    /* Main*/

    setPauseListener();
    world = new World(30, 48, 300, 480, "#50c0a8");
    populateWorld();
    return (runWorld = function() {
      updateWorld();
      if (!paused) {
        return setTimeout(runWorld, tick_interval);
      }
    })();
  });

}).call(this);
