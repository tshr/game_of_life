###
Toshiro Ken Sugihara 2013
###

$ ->

  class World

    constructor: (numRows, numColumns, canvasHeight, canvasWidth, aliveColor) ->

      @numRows = numRows
      @numColumns = numColumns
      @aliveColor = aliveColor
      @grid = []
      @fillGrid()
      @createCells canvasWidth, canvasHeight

    fillGrid: ->
      for i in [0...@numRows]
        row = []
        for [0...@numColumns]
          row.push { alive : false }
        @grid.push row

    createCells: (canvasWidth, canvasHeight) ->
      paper = Raphael("canvas", canvasWidth, canvasHeight)
      gridCellHeight = canvasHeight / @numRows
      gridCellWidth = canvasWidth / @numColumns

      createCell = (paper, row, column, height, width, world) ->
        cell = paper.rect(column * width, row * height, width, height)
        cell.node.id = "cell_" + row + "_" + column
        cell.attr(stroke: "#d8d8d8").data("row", row).data("column", column).click ->
          cellData = world.grid[@data("row")][@data("column")]
          cellData.alive = !cellData.alive
          world.colorCell @, cellData.alive

      for j in [0...@numRows]
        for k in [0...@numColumns]
          createCell(paper, j, k, gridCellHeight, gridCellWidth, @)

    colorCell: (cell, alive) ->
      if alive then cell.attr fill: @aliveColor else cell.attr fill: "#ffffff"

    draw: ->
      for j in [0...@numRows]
        for k in [0...@numColumns]
          cellIdString = "cell_" + j + "_" + k
          cell = $("#" + cellIdString)
          @colorCell cell, @grid[j][k].alive

    updateGrid: (resultsGrid) ->
      for j in [0...resultsGrid.length]
        arr = []
        for k in [0...resultsGrid[j].length]
          @grid[j][k].alive = resultsGrid[j][k]

    update: ->
      @draw()
      @updateGrid(@getNextGenerationCellStates())

    getNextGenerationCellStates: ->

      nextGenGrid = []

      for j in [0...@grid.length]
        arr = []
        for k in [0...@grid[j].length]
          arr.push @calculateIfCellAlive(j, k)
        nextGenGrid.push arr

      nextGenGrid

    wrapped: (point, dimensionSize) ->
      switch
        when (point < 0) then dimensionSize - 1
        when (point >= dimensionSize) then 0
        else point

    countNeighbors: (row, column) ->
      count = 0
      relPositions = [-1, 0, 1]

      for rowPosition in relPositions
        for columnPosition in relPositions
          unless rowPosition is 0 and columnPosition is 0
            cellRow = @wrapped(row + rowPosition, @numRows)
            cellColumn = @wrapped(column + columnPosition, @numColumns)
            count += (if @grid[cellRow][cellColumn].alive then 1 else 0)
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

  tickInterval = 50
  paused = false

  setPauseListener = ->
    $(window).keydown (event) ->
      if event.keyCode is 80
        if paused
          paused = false
          run()
        else
          paused = true

  setPauseListener()

  world = new World(30, 48, 300, 480, "#50c0a8")
  world.populate()

  do run = ->
    world.update()
    unless paused
      setTimeout run, tickInterval