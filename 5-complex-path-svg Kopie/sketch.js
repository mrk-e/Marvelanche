// Benno Stäbler, Benedikt Groß
// additional dependencies
// pathseg.js https://github.com/progers/pathseg
// decomp.js https://github.com/schteppe/poly-decomp.js/

Matter.use('matter-wrap');

let ball;
let polygon;
let ground;

let aufzugImg;
let ballImg;

let ebene01;
let ebene02;
let ebene03;
let ebene04;

let posAufzug01Unten = true;
let posAufzug02Unten = false;

function setup() {
  createCanvas(4480, 720); //1280

  //create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  aufzugImg = loadImage('Aufzug.png');
  ballImg = loadImage('Schneekugel.png');

  ebene01 = 0;
  ebene02 = 100;
  ebene03 = 200;
  ebene04 = 300;

  //Strecke und Böden
  startpunkt = new Block(world,
    { x: 0, y: 62, w: 100, h: 25, color: 'grey' },
    { isStatic: true, angle: PI * 0.1  }
  );

  strecke01 = new PolygonFromSVG(world,
    { x: 150, y: 400, fromFile: './element2-1.svg', scale: 1, color: 'red' },
    { isStatic: true, friction: 0.0 }
  );

  strecke02 = new PolygonFromSVG(world,
    { x: 900, y: 520, fromFile: './element5-1.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  strecke03 = new PolygonFromSVG(world,
    { x: 1476, y: 620, fromFile: './element8-1.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  strecke04 = new PolygonFromSVG(world,
    { x: 3020, y: 550, fromFile: './element9-1.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  strecke05 = new PolygonFromSVG(world,
    { x: 3600, y: 604, fromFile: './element10-1.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  // Ball und Maus
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };

  mouse = new Mouse(engine, canvas);

  ball = new SpriteBall(world,
    { x: 30, y: 50, r: 26, image: ballImg },
    { friction: 0.25, plugin: { wrap: wrap } }
  );

  //Hindernisse und Spielmechanismen
  stein01 = new Block(world,
    { x: 850, y: 510, w: 60, h: 40, color: 'grey' },
    { isStatic: true, angle: 0  }
  );

  holzstapeltest01 = new Block(world,
    { x: 1550, y: 620, w: 40, h: 40, color: 'grey' },
    { isStatic: true, angle: 0  }
  );

  eis01 = new Block(world,
    { x: 1000, y: 546, w: 200, h: 10, color: 'blue' },
    { isStatic: true, angle: 0, friction: 1  }
  );

  eis02 = new Block(world,
    { x: 1800, y: 660, w: 200, h: 10, color: 'blue' },
    { isStatic: true, angle: 0, friction: 1  }
  );

  rampe01 = new Block(world,
    { x: 3100, y: 660, w: 200, h: 10, color: 'blue' },
    { isStatic: true, angle: 0, friction: 1  }
  );

  iglu01 = new PolygonFromSVG(world,
    { x: 2000, y: 620, fromFile: './igluKontur.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  aufzug01 = new SpriteBlock(world,
    { x: 2300, y: 620, w: 198, h: 61, image: aufzugImg },
    { isStatic: true, angle: 0  }
  );

  aufzug02 = new SpriteBlock(world,
    { x: 2600, y: 200, w: 198, h: 61, image: aufzugImg },
    { isStatic: true, angle: 0  }
  );

  frameRate(60);

  //run the engine
  Matter.Runner.run(engine);
}

function draw() {
  background('black');

  //Strecke und Böden draw
  startpunkt.draw();
  strecke01.draw();
  strecke02.draw();
  strecke03.draw();
  strecke04.draw();
  strecke05.draw();


  //Ball und Maus draw
  ball.draw();
  mouse.draw();

  //Hindernisse und Spielmechanismen draw
  eis01.draw();
  eis02.draw();
  holzstapeltest01.draw();
  iglu01.draw();
  rampe01.draw();
  aufzug01.draw();
  aufzug02.draw();

  //Spielmechanismus
  scrollFollow(ball);
  eis(ball);
  gameover(ball);
  aufzug01Steuerung(aufzug01);
  aufzug02Steuerung(aufzug02);

  //Anzeigen der FrameRate in der Konsole
  let frameRateValue = getFrameRate();
  console.log("Framerate: " + frameRateValue);
}

//Kamera
function scrollFollow(object) {
  if (insideViewport(object) == false) {
    const $element = $('html, body');
    if ($element.is(':animated') == false) {
      $element.animate({
        scrollLeft: object.body.position.x - (1280 * 0.3) ,
      }, 720);

      //Parallax effect
      ebene01 = ebene01 + 1;
      ebene02 = ebene02 + 5;
      ebene03 = ebene03 + 50;
      ebene04 = ebene04 + 10;
      document.getElementById("ebene01").style.left = ebene01;
      document.getElementById("ebene02").style.left = ebene02;
      document.getElementById("ebene03").style.left = ebene03;
      document.getElementById("ebene04").style.left = ebene04;
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
  //eis02
  if (x >= 1650 && x < 1900 && y >=620) {
    object.body.position.x = object.body.position.x +1;
    engine.timing.timeScale = 1.5;
  }
  //rampe01
  if (x >= 3100 && x < 3300 && y >=520) {
    object.body.position.x = object.body.position.x +1.5;
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

function aufzug01Steuerung (object) {
  const x = object.body.position.x;
  const y = object.body.position.y;

  if(posAufzug01Unten == true) {
    Matter.Body.setPosition(object.body, {x,y: y -1});
    //y = y - 1 ;
    if (y < 200)
    {
      posAufzug01Unten = false;
    }
  }
  if(posAufzug01Unten == false) {
    Matter.Body.setPosition(object.body, {x,y: y +1});
   // y = y + 1 ;
    if (y > 620)
    {
      posAufzug01Unten = true;
    }
  }
}

function aufzug02Steuerung (object) {
  const x = object.body.position.x;
  const y = object.body.position.y;

  if(posAufzug02Unten == true) {
    Matter.Body.setPosition(object.body, {x,y: y -1});
    //y = y - 1 ;
    if (y < 200)
    {
      posAufzug02Unten = false;
    }
  }
  if(posAufzug02Unten == false) {
    Matter.Body.setPosition(object.body, {x,y: y +1});
   // y = y + 1 ;
    if (y > 620)
    {
      posAufzug02Unten = true;
    }
  }
}

//Sprung
function keyPressed() {
  // is SPACE pressed?
  if (keyCode === 32) {
    Matter.Body.applyForce(
      ball.body,
      {x: ball.body.position.x, y: ball.body.position.y},
      {x: 0.005 , y: -0.05}
    );
  }
}
