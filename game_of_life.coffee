###
Toshiro Ken Sugihara 2013
###

$ ->

  ### Variables ###

  num_rows = 30
  num_columns = 48
  canvas_width = 480
  canvas_height = 300
  paused = false
  tick_interval = 50
  paper = Raphael("canvas", canvas_width, canvas_height)
  alive_color = "#50c0a8"
  world = null

  ### Classes ###

  class World

    constructor: (num_rows, num_columns, canvas_width, canvas_height) ->
      @grid = []
      grid_cell_height = canvas_height / num_rows
      grid_cell_width = canvas_width / num_columns

      createRaphaelCell = (row, column, height, width) ->
        cell = paper.rect(column * width, row * height, width, height)
        cell.node.id = "cell_" + row + "_" + column
        cell.attr(stroke: "#d8d8d8").data("row", row).data("column", column).click ->
          cell_data = world.grid[@data("row")][@data("column")]
          cell_data.alive = !cell_data.alive
          if cell_data.alive then @attr fill: alive_color else @attr fill: "#ffffff"

      for i in [0...num_rows]
        row = []
        row.push({ alive : false }) for [0...num_columns]
        @grid.push(row)

      for j in [0...num_rows]
        createRaphaelCell j, k, grid_cell_height, grid_cell_width for k in [0...num_columns]

    getCellByCoord: (row, column) ->
      cell_id_string = "cell_" + row + "_" + column
      $("#" + cell_id_string)

    drawCell: (row, column, alive) ->
      cell = @getCellByCoord(row, column)
      if alive then cell.attr fill: alive_color else cell.attr fill: "#ffffff"

    draw: ->
      @drawCell(j, k, world.grid[j][k].alive) for k in [0...num_columns] for j in [0...num_rows]

    updateCells: (results_grid) ->
      for j in [0...results_grid.length]
        arr = []
        world.grid[j][k].alive = results_grid[j][k] for k in [0...results_grid[j].length]

  ### Functions ###

  populateWorld = ->

    #GLIDER
    world.grid[0][8].alive = true
    world.grid[1][9].alive = true
    world.grid[2][9].alive = true
    world.grid[2][8].alive = true
    world.grid[2][7].alive = true

    #BEEHIVES
    world.grid[13][22].alive = true
    world.grid[14][21].alive = true
    world.grid[14][23].alive = true
    world.grid[15][21].alive = true
    world.grid[15][23].alive = true
    world.grid[16][22].alive = true
    world.grid[16][23].alive = true

  calculateIfCellAlive = (row, column) ->

    wrapped = (point, dimension_size) ->
      switch
        when (point < 0) then dimension_size - 1
        when (point >= dimension_size) then 0
        else point

    countNeighbors = ->
      count = 0
      rel_positions = [-1, 0, 1]

      for row_position in rel_positions
        for column_position in rel_positions
          unless row_position is 0 and column_position is 0
            cell_row = wrapped(row + row_position, num_rows)
            cell_column = wrapped(column + column_position, num_columns)
            count += (if world.grid[cell_row][cell_column].alive then 1 else 0)
      count

    count = countNeighbors()
    if world.grid[row][column].alive then (2 <= count <= 3) else (count == 3)

  getNextGenerationCellStates = ->

    next_gen_grid = []

    for j in [0...world.grid.length]
      arr = []
      arr.push calculateIfCellAlive(j, k) for k in [0...world.grid[j].length]
      next_gen_grid.push arr

    next_gen_grid

  updateWorld = ->
    world.draw()
    world.updateCells(getNextGenerationCellStates())

  setPauseListener = ->
    $(window).keydown (event) ->
      if event.keyCode is 80
        if paused
          paused = !paused
          runWorld()
        else
          paused = !paused

  ### Main ###

  setPauseListener()
  world = new World num_rows, num_columns, canvas_width, canvas_height
  populateWorld()

  do runWorld = ->
    updateWorld()
    unless paused
      setTimeout runWorld, tick_interval