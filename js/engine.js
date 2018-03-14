/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on  player and enemy objects (defined in app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook. When your player moves across the screen, it may look like
  * just that image/character is moving or being drawn but that is not the case.
  * What's really happening is the entire "scene" is being drawn over and over,
  * presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);
    startNow = false;
     /**
      *@description: starts the main engine of the game, after character is
      * selected, handles calling the update and rendor methods.
     */
    function main() {
         /**
         *@description: gets time delta information
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        /**
        *@description: checks for game start(after player clicks on a character).
        * Passes along time delta to update function, renders character and enemies.
        */
        if (startNow == true) {
            update(dt);
            render();
            player.render();

            allEnemies.forEach(function(enemy) {
                enemy.render();
            });

            gameOver();
        }
        /**
         *@description:sets lastTime variable to update time delta when function
         *is called next.
         */
        lastTime = now;
         /**
          *@description: Uses browser's requestAnimationFrame function for as
          *soon as browser is able to draw another frame.
          */
        win.requestAnimationFrame(main);
    }

     /**
      *@description: initial setup, is only called 1 time.  Sets lastTime variable
      * required for game loop.
      */
    function init() {
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);

    }
  /**
   *@description:Called by update function.  Loops through all update() methodes
   * foreach enemy, then calls update() method of player object.
   */
 function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt, player);
    });
    player.update();
 }
     /**
      *@description: draws the "game level" and is called every loop of the
      *game engine.
      */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /**
         *@description:loops through number of rows and columns using rowImages
         *array and draws the correct image for that portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                 /**
                  *@description:
                  *@param:rowImages[row]: image to draw; col * 101: x coordinate
                  *to start drawing; row * 83: y coordinate to start drawing.
                  */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

    }

     /**
      *@description: loads all images used to draw the game level, then sets
      * init as callback method.
      */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
