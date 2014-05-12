// Generated by CoffeeScript 1.6.3
/*
Toshiro Ken Sugihara 2013
*/


(function() {
  $(function() {
    var World, paused, run, setPauseListener, tick_interval, world;
    World = (function() {
      function World(num_rows, num_columns, canvas_height, canvas_width, alive_color) {
        this.num_rows = num_rows;
        this.num_columns = num_columns;
        this.alive_color = alive_color;
        this.grid = [];
        this.fillGrid();
        this.createCells(canvas_width, canvas_height);
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

      World.prototype.createCells = function(canvas_width, canvas_height) {
        var createCell, grid_cell_height, grid_cell_width, j, k, paper, _i, _ref, _results;
        paper = Raphael("canvas", canvas_width, canvas_height);
        grid_cell_height = canvas_height / this.num_rows;
        grid_cell_width = canvas_width / this.num_columns;
        createCell = function(paper, row, column, height, width, world) {
          var cell;
          cell = paper.rect(column * width, row * height, width, height);
          cell.node.id = "cell_" + row + "_" + column;
          return cell.attr({
            stroke: "#d8d8d8"
          }).data("row", row).data("column", column).click(function() {
            var cell_data;
            cell_data = world.grid[this.data("row")][this.data("column")];
            cell_data.alive = !cell_data.alive;
            return world.colorCell(this, cell_data.alive);
          });
        };
        _results = [];
        for (j = _i = 0, _ref = this.num_rows; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = this.num_columns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(createCell(paper, j, k, grid_cell_height, grid_cell_width, this));
            }
            return _results1;
          }).call(this));
        }
        return _results;
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
        var cell, cell_id_string, j, k, _i, _ref, _results;
        _results = [];
        for (j = _i = 0, _ref = this.num_rows; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = this.num_columns; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              cell_id_string = "cell_" + j + "_" + k;
              cell = $("#" + cell_id_string);
              _results1.push(this.colorCell(cell, this.grid[j][k].alive));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      World.prototype.updateGrid = function(results_grid) {
        var arr, j, k, _i, _ref, _results;
        _results = [];
        for (j = _i = 0, _ref = results_grid.length; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          arr = [];
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (k = _j = 0, _ref1 = results_grid[j].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(this.grid[j][k].alive = results_grid[j][k]);
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
        var arr, j, k, next_gen_grid, _i, _j, _ref, _ref1;
        next_gen_grid = [];
        for (j = _i = 0, _ref = this.grid.length; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
          arr = [];
          for (k = _j = 0, _ref1 = this.grid[j].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; k = 0 <= _ref1 ? ++_j : --_j) {
            arr.push(this.calculateIfCellAlive(j, k));
          }
          next_gen_grid.push(arr);
        }
        return next_gen_grid;
      };

      World.prototype.wrapped = function(point, dimension_size) {
        switch (false) {
          case !(point < 0):
            return dimension_size - 1;
          case !(point >= dimension_size):
            return 0;
          default:
            return point;
        }
      };

      World.prototype.countNeighbors = function(row, column) {
        var cell_column, cell_row, column_position, count, rel_positions, row_position, _i, _j, _len, _len1;
        count = 0;
        rel_positions = [-1, 0, 1];
        for (_i = 0, _len = rel_positions.length; _i < _len; _i++) {
          row_position = rel_positions[_i];
          for (_j = 0, _len1 = rel_positions.length; _j < _len1; _j++) {
            column_position = rel_positions[_j];
            if (!(row_position === 0 && column_position === 0)) {
              cell_row = this.wrapped(row + row_position, this.num_rows);
              cell_column = this.wrapped(column + column_position, this.num_columns);
              count += (this.grid[cell_row][cell_column].alive ? 1 : 0);
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

    tick_interval = 50;
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
        return setTimeout(run, tick_interval);
      }
    })();
  });

}).call(this);
