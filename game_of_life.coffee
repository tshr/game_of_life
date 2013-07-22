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
  world = []

  ### Functions ###

  generateWorld = ->

    world.getCellByCoord = (row, column) ->
      cell_id_string = "cell_" + row + "_" + column
      $("#" + cell_id_string)

    world.drawCell = (row, column, alive) ->
      cell = @getCellByCoord(row, column)
      if alive then cell.attr fill: alive_color else cell.attr fill: "#ffffff"

    world.draw = ->
      for r in [0...num_rows]
        for c in [0...num_columns]
          @drawCell(r, c, world[r][c].alive)

    createRaphaelCell = (row, column, height, width) ->
      cell = paper.rect(column * width, row * height, width, height)
      cell.node.id = "cell_" + row + "_" + column
      cell.attr(stroke: "#d8d8d8").data("row", row).data("column", column).click ->
        cell_data = world[@data("row")][@data("column")]
        cell_data.alive = !cell_data.alive
        if cell_data.alive then @attr fill: alive_color else @attr fill: "#ffffff"

    for i in [0...num_rows]
      row = []
      row.push({ alive : false }) for [0...num_columns]
      world.push(row)

    do createRaphaelGrid = ->
      grid_cell_height = canvas_height / num_rows
      grid_cell_width = canvas_width / num_columns

      for j in [0...num_rows]
        for k in [0...num_columns]
          createRaphaelCell j, k, grid_cell_height, grid_cell_width

  populateWorld = ->

    #GLIDER
    world[0][8].alive = true
    world[1][9].alive = true
    world[2][9].alive = true
    world[2][8].alive = true
    world[2][7].alive = true

    #BEEHIVES
    world[13][22].alive = true
    world[14][21].alive = true
    world[14][23].alive = true
    world[15][21].alive = true
    world[15][23].alive = true
    world[16][22].alive = true
    world[16][23].alive = true

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
            count += (if world[cell_row][cell_column].alive then 1 else 0)
      count

    count = countNeighbors()
    if world[row][column].alive then (2 <= count <= 3) else (count == 3)

  determineNextGenerationCellStates = ->

    grid = []

    for j in [0...world.length]
      arr = []
      for k in [0...world[j].length]
        arr.push calculateIfCellAlive(j, k)
      grid.push arr

    grid

  updateCells = (results_grid) ->

    for j in [0...results_grid.length]
      arr = []
      for k in [0...results_grid[j].length]
        world[j][k].alive = results_grid[j][k]

  updateWorld = ->
    world.draw()
    results_grid = determineNextGenerationCellStates()
    updateCells(results_grid)

  ### Main ###

  # Set up pause listener on the "p" key
  $(window).keydown (event) ->
    if event.keyCode is 80
      if paused
        paused = !paused
        runWorld()
      else
        paused = !paused

  generateWorld()
  populateWorld()

  do runWorld = ->
    updateWorld()
    unless paused
      setTimeout runWorld, tick_interval