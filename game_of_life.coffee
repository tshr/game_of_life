###
Toshiro Ken Sugihara 2013
###

$ ->

  class World

    constructor: (num_rows, num_columns, canvas_height, canvas_width, alive_color) ->

      @num_rows = num_rows
      @num_columns = num_columns
      @alive_color = alive_color
      @grid = []
      @fillGrid()
      @createCells(canvas_width, canvas_height)

    fillGrid: ->
      for i in [0...@num_rows]
        row = []
        for [0...@num_columns]
          row.push({ alive : false })
        @grid.push(row)

    createCells: (canvas_width, canvas_height) ->
      paper = Raphael("canvas", canvas_width, canvas_height)
      grid_cell_height = canvas_height / @num_rows
      grid_cell_width = canvas_width / @num_columns

      createCell = (paper, row, column, height, width, world) ->
        cell = paper.rect(column * width, row * height, width, height)
        cell.node.id = "cell_" + row + "_" + column
        cell.attr(stroke: "#d8d8d8").data("row", row).data("column", column).click ->
          cell_data = world.grid[@data("row")][@data("column")]
          cell_data.alive = !cell_data.alive
          world.colorCell(@, cell_data.alive)

      for j in [0...@num_rows]
        for k in [0...@num_columns]
          createCell(paper, j, k, grid_cell_height, grid_cell_width, @)

    colorCell: (cell, alive) ->
      if alive then cell.attr fill: @alive_color else cell.attr fill: "#ffffff"

    draw: ->
      for j in [0...@num_rows]
        for k in [0...@num_columns]
          cell_id_string = "cell_" + j + "_" + k
          cell = $("#" + cell_id_string)
          @colorCell(cell, @grid[j][k].alive)

    updateGrid: (results_grid) ->
      for j in [0...results_grid.length]
        arr = []
        for k in [0...results_grid[j].length]
          @grid[j][k].alive = results_grid[j][k]

    update: ->
      @draw()
      @updateGrid(@getNextGenerationCellStates())

    getNextGenerationCellStates: ->

      next_gen_grid = []

      for j in [0...@grid.length]
        arr = []
        for k in [0...@grid[j].length]
          arr.push @calculateIfCellAlive(j, k)
        next_gen_grid.push arr

      next_gen_grid

    countNeighbors: (row, column) ->
      count = 0
      rel_positions = [-1, 0, 1]

      wrapped = (point, dimension_size) ->
        switch
          when (point < 0) then dimension_size - 1
          when (point >= dimension_size) then 0
          else point

      for row_position in rel_positions
        for column_position in rel_positions
          unless row_position is 0 and column_position is 0
            cell_row = wrapped(row + row_position, @num_rows)
            cell_column = wrapped(column + column_position, @num_columns)
            count += (if @grid[cell_row][cell_column].alive then 1 else 0)
      count

    calculateIfCellAlive: (row, column) ->

      count = @countNeighbors(row, column)
      if @grid[row][column].alive then (2 <= count <= 3) else (count == 3)

    populate: ->

      #GLIDER
      @grid[0][8].alive = true
      @grid[1][9].alive = true
      @grid[2][9].alive = true
      @grid[2][8].alive = true
      @grid[2][7].alive = true

      #BEEHIVES
      @grid[13][22].alive = true
      @grid[14][21].alive = true
      @grid[14][23].alive = true
      @grid[15][21].alive = true
      @grid[15][23].alive = true
      @grid[16][22].alive = true
      @grid[16][23].alive = true

  ### Main ###

  tick_interval = 50
  paused = false

  setPauseListener = ->
    $(window).keydown (event) ->
      if event.keyCode is 80
        if paused
          paused = !paused
          run()
        else
          paused = !paused

  setPauseListener()

  world = new World(30, 48, 300, 480, "#50c0a8")
  world.populate()

  do run = ->
    world.update()
    unless paused
      setTimeout run, tick_interval