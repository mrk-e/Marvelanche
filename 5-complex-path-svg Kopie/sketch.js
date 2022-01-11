// Benno Stäbler, Benedikt Groß
// additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

Matter.use('matter-wrap');

let ball;
let polygon;
let ground;
let boxImg;

function setup() {
  createCanvas(2800, 720);

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // use svg file to create the corresponding polygon
  //polygon = new PolygonFromSVG(world,
  //  { x: 145, y: 400, fromFile: './path.svg', scale: 0.8, color: 'white' },
  //  { isStatic: true, friction: 0.0 }
  //);

  // use svg file to create the corresponding polygon
  polygon = new PolygonFromSVG(world,
    { x: 150, y: 400, fromFile: './element2.svg', scale: 1, color: 'red' },
    { isStatic: true, friction: 0.0 }
  );

  polygonTwo = new PolygonFromSVG(world,
    { x: 900, y: 520, fromFile: './element4.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  // ball and ground
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };
  ball = new Ball(world,
    { x: 30, y: 50, r: 26, color: 'white' },
    { friction: 0.0, plugin: { wrap: wrap } }
  );
  
  startpunkt = new Block(world,
    { x: 0, y: 122, w: 100, h: 25, color: 'grey' },
    { isStatic: true, angle: PI * 0.1  }
  );

  boxImg = loadImage('element4.png');

  box = new SpriteBlock(world, { x: 900, y: 200, w: 64, h: 64, image: boxImg, isStatic: true});
  

  // setup mouse
  mouse = new Mouse(engine, canvas);

  // run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  startpunkt.draw();
  polygon.draw();
  polygonTwo.draw();
  ball.draw();
  mouse.draw();
  box.draw();
   // follow the ball by scrolling the window
scrollFollow(ball);
  
}

function scrollFollow(object) {
  if (insideViewport(object) == false) {
    const $element = $('html, body');
    if ($element.is(':animated') == false) {
      $element.animate({
        scrollLeft: object.body.position.x,
        scrollTop: object.body.position.y
      }, 720);
    }
  }
}

function insideViewport(object) {
  const x = object.body.position.x;
  const y = object.body.position.y;
  const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;
  const pageYOffset  = window.pageYOffset || document.documentElement.scrollTop;
  if (x >= pageXOffset && x <= pageXOffset + windowWidth &&
      y >= pageYOffset && y <= pageYOffset + windowHeight) {
    return true;
  } else {
    return false;
  }
}


function keyPressed() {
  // is SPACE pressed?
  if (keyCode === 32) {
    let direction = 1; // ball runs left to right ->
    if ((ball.body.position.x - ball.body.positionPrev.x) < 0) {
      direction = -1; // ball runs right to left <-
    }
    // use current direction and velocity for the jump
    Matter.Body.applyForce(
      ball.body,
      {x: ball.body.position.x, y: ball.body.position.y},
      {x: (0.001 * direction) + ball.body.velocity.x / 100, y: -0.07}
    );
  }
}