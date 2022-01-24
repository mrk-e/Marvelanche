// Benno Stäbler, Benedikt Groß
// additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

Matter.use('matter-wrap');

let ball;
let polygon;
let ground;

function setup() {
  createCanvas(2800, 720);

  //create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  //Strecke und Böden
  startpunkt = new Block(world,
    { x: 0, y: 62, w: 77, h: 25, color: 'grey' },
    { isStatic: true, angle: PI * 0.1  }
  );

  strecke01 = new PolygonFromSVG(world,
    { x: 150, y: 400, fromFile: './element2.svg', scale: 1, color: 'red' },
    { isStatic: true, friction: 0.0 }
  );

  strecke02 = new PolygonFromSVG(world,
    { x: 800, y: 520, fromFile: './element4.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  bodenTest = new Block(world,
    { x: 1500, y: 520, w: 800, h: 10, color: 'green' },
    { isStatic: true, angle: 0, friction: 1  }
  );


  // Ball und Maus
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };

  mouse = new Mouse(engine, canvas);

  ball = new Ball(world,
    { x: 30, y: 50, r: 26, color: 'white' },
    { friction: 0.25, plugin: { wrap: wrap } }
  );

  //Hindernisse und Spielmechanismen
  stein01 = new Block(world,
    { x: 850, y: 510, w: 40, h: 40, color: 'grey' },
    { isStatic: true, angle: 0  }
  );

  eis01 = new Block(world,
    { x: 1000, y: 516, w: 200, h: 10, color: 'blue' },
    { isStatic: true, angle: 0, friction: 1  }
  );

  //run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  //Strecke und Böden draw
  startpunkt.draw();
  strecke01.draw();
  strecke02.draw();
  bodenTest.draw();

  //Ball und Maus draw
  ball.draw();
  mouse.draw();

  //Hindernisse und Spielmechanismen draw
  stein01.draw();
  eis01.draw();

  //Spielmechanismus
  scrollFollow(ball);
  eis(ball);
  gameover(ball);

}

//Kamera
function scrollFollow(object) {
  if (insideViewport(object) == false) {
    const $element = $('html, body');
    if ($element.is(':animated') == false) {
      $element.animate({
        scrollLeft: object.body.position.x - (1280 * 0.3) ,
      }, 720);
    }
  }
}

function insideViewport(object) {
  const x = object.body.position.x;
  const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;
  if (x >= pageXOffset && x <= pageXOffset + windowWidth * 0.6) {
    return true;
  } else {
    return false;
  }
}

//Löst aus wenn der Ball auf Eis ist
function eis(object) {
  const x = object.body.position.x;
  const y = object.body.position.y;
  const engine = Matter.Engine.create();

  //eis01
  if (x >= 900 && x < 1100 && y >=480) {
    object.body.position.x = object.body.position.x +1;
    engine.timing.timeScale = 1.5;
  }
  else
  {
    object.body.position.x = object.body.position.x;
    engine.timing.timeScale = 1.0;
  }
}

//Löst das Game Over aus und resetet den Ball
function gameover(object) {
  const y = object.body.position.y;
  if (y >= 720) {
    Matter.Body.setPosition(object.body, {x:30,y:50});
  }
}

//Sprung
function keyPressed() {
  // is SPACE pressed?
  if (keyCode === 32) {
    Matter.Body.applyForce(
      ball.body,
      {x: ball.body.position.x, y: ball.body.position.y},
      {x: 0.01 , y: -0.07}
    );
  }
}
