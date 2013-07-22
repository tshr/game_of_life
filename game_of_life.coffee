$ ->
  num_rows = 30
  num_columns = 48
  canvas_width = 480
  canvas_height = 300
  paused = false
  paper = Raphael("canvas", canvas_width, canvas_height)
  alive_color = "#50c0a8"
  world = []

  # Set up pause listener
  $(window).keydown (event) ->
    if event.keyCode is 80
      if paused
        paused = !paused
        runWorld()
      else
        paused = !paused

  generateWorld = ->
    for i in [0...num_rows]
      row = []
      row.push({ alive : false }) for [0...num_columns]
      world.push(row)

    world.getCellByCoord = (row, column) ->
      cell_id_string = "cell_" + row + "_" + column
      $ "#" + cell_id_string

    world.drawCell = (row, column, alive) ->

      cell = @getCellByCoord(row, column)
      if alive
        cell.attr fill: alive_color
      else
        cell.attr fill: "#ffffff"

    world.draw = ->
      for r in [0...num_rows]
        for c in [0...num_columns]
          @drawCell(r, c, world[r][c].alive)

    createRaphaelCell = (row, column, height, width) ->
      cell = paper.rect(column * width, row * height, width, height)
      cell.attr stroke: "#d8d8d8"
      cell.node.id = "cell_" + row + "_" + column
      cell.data "row", row
      cell.data "column", column
      cell.click ->
        cell_data = world[@data("row")][@data("column")]
        cell_data.alive = !cell_data.alive
        if cell_data.alive
          @attr fill: alive_color
        else
          @attr fill: "#ffffff"

    do createRaphaelGrid = ->
      grid_cell_height = canvas_height / num_rows
      grid_cell_width = canvas_width / num_columns

      for j in [0...num_rows]
        for k in [0...num_columns]
          createRaphaelCell j, k, grid_cell_height, grid_cell_width

  populateWorld = ->

    #GLIDER 1
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
      if point < 0
        dimension_size - 1
      else if point >= dimension_size
        0
      else
        point

    countNeighbors = ->
      count = 0
      rel_positions = [-1, 0, 1]
      rel_positions.forEach (row_position) ->
        rel_positions.forEach (column_position) ->
          unless row_position is 0 and column_position is 0
            cell_row = wrapped(row + row_position, num_rows)
            cell_column = wrapped(column + column_position, num_columns)
            count += (if world[cell_row][cell_column].alive then 1 else 0)
      count

    count = countNeighbors()
    if world[row][column].alive
      return false  if count < 2
      return true  if count <= 3
      return false  if count > 3
    else
      return (count is 3)

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

  generateWorld()
  populateWorld()

  do runWorld = ->
    updateWorld()
    unless paused
      setTimeout runWorld, 50