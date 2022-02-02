Matter.use('matter-wrap');

let ball;
let polygon;
let ground;

let aufzugImg;
let ballImg;

let ebene01;
let ebene02;
let wolke;

let posAufzug01Unten = true;
let posAufzug02Unten = false;
let ballVisible = true;
let endSequenz = false;
let spielStart = false;

let kanoneSound;
let jumpSound;

function preload() {
  // load sound
  kanoneSound = loadSound('./kanoneSound.m4a');
  kanoneSound.playMode('sustain');
  jumpSound = loadSound('./schneeSound.mp3');
  jumpSound.playMode('sustain');

  //load image
  aufzugImg = loadImage('Aufzug.png');
  ballImg = loadImage('Schneekugel.png');
}

function setup() {
  createCanvas(4480, 720);

  //create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  ebene01 = 0;
  ebene02 = 0;
  wolke = 320;

  preload();

  //Bahn
  strecke01 = new PolygonFromSVG(world,
    { x: 280, y: 500, fromFile: './Bahn1.svg', scale: 1.2, color: 'red' },
    { isStatic: true, friction: 0.0 }
  );

  strecke02 = new PolygonFromSVG(world,
    { x: 900, y: 520, fromFile: './Bahn2.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  strecke03 = new PolygonFromSVG(world,
    { x: 1476, y: 620, fromFile: './Bahn3.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  strecke04 = new PolygonFromSVG(world,
    { x: 3020, y: 550, fromFile: './Bahn4.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  strecke05 = new PolygonFromSVG(world,
    { x: 3600, y: 604, fromFile: './Bahn5.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  // Ball
  const wrap = {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  };

  mouse = new Mouse(engine, canvas);

  ball = new SpriteBall(world,
    { x: 30, y: 50, r: 26, image: ballImg },
    { friction: 0.25, plugin: { wrap: wrap } }
  );

  //Hindernisse
  stein = new Block(world,
    { x: 850, y: 510, w: 60, h: 40, color: 'grey' },
    { isStatic: true, angle: 0 }
  );
  holzstapel = new PolygonFromPoints(world,
    { x: 1544, y: 600, points: [ { x: 45, y: 0 }, { x: 90 ,y: 90 }, { x: 0, y: 90 }],
    color: 'grey'}, { isStatic: true });
  iglu = new PolygonFromSVG(world,
    { x: 2010, y: 600, fromFile: './IgluForm.svg', scale: 1, color: 'white' },
    { isStatic: true, friction: 0.0 }
  );

  //Aufzuege
  aufzug01 = new SpriteBlock(world,
    { x: 2300, y: 200, w: 198, h: 61, image: aufzugImg },
    { isStatic: true, angle: 0  }
  );
  aufzug02 = new SpriteBlock(world,
    { x: 2600, y: 620, w: 198, h: 61, image: aufzugImg },
    { isStatic: true, angle: 0  }
  );

  //Begrenzung Horizont
  begrenzungHorizont01 = new Block(world,
    { x: 0, y: 2, w: 1000, h: 2, color: 'blue' },
    { isStatic: true }
  );
  begrenzungHorizont02 = new Block(world,
    { x: 1000, y: 2, w: 1000, h: 2, color: 'blue' },
    { isStatic: true }
  );
  begrenzungHorizont03 = new Block(world,
    { x: 2000, y: 2, w: 1000, h: 2, color: 'blue' },
    { isStatic: true }
  );
  begrenzungHorizont04 = new Block(world,
    { x: 3000, y: 2, w: 1000, h: 2, color: 'blue' },
    { isStatic: true }
  );

  frameRate(60);

  //run the engine
  Matter.Runner.run(engine);
  spielStart = true;
}

function draw() {
  clear();

  //Ball und Maus draw
  if (ballVisible == true) {
    ball.draw();
  }
  mouse.draw();

  //Aufzug draw
  aufzug01.draw();
  aufzug02.draw();

  //Spielmechanismus
  scrollFollow(ball);
  eis(ball);
  gameover(ball);
  aufzug01Steuerung(aufzug01);
  aufzug02Steuerung(aufzug02);

  //Anzeigen der FrameRate in der Konsole
  // let frameRateValue = getFrameRate();
  // console.log("Framerate: " + frameRateValue);
}

//Kamera
function scrollFollow(object) {
  if (endSequenz == false) {
  if (insideViewport(object) == false) {
    const $element = $('html, body');
    if ($element.is(':animated') == false) {
      $element.animate({
        scrollLeft: object.body.position.x - (1280 * 0.3) ,
      }, 720);
      //Parallax effect
      ebene01 = ebene01;
      ebene02 = ebene02 + 3;
      document.getElementById("ebene01").style.left = ebene01;
      document.getElementById("ebene02").style.left = ebene02;
      }
    }
  }
}

function insideViewport(object) {
  const x = object.body.position.x;
  const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;
  if (x >= pageXOffset && x <= pageXOffset + windowWidth * 0.3) {
    return true;
  } else {
    return false;
  }
}

//Löst aus wenn der Ball auf Eis ist bzw. beschleunigt wird oder positionsbedingte Operationen ausgeführt werden
function eis(object) {
  const x = object.body.position.x;
  const y = object.body.position.y;
  const engine = Matter.Engine.create();

  //Startschwung
  if (x >= 300 && x < 400 && y >=480) {
    object.body.position.x = object.body.position.x +1;
    engine.timing.timeScale = 1.5;
  }
  //eis01
  if (x >= 900 && x < 1100 && y >=480) {
    object.body.position.x = object.body.position.x +1;
    engine.timing.timeScale = 1.5;
  }
  //eis02
  if (x >= 1600 && x < 1900 && y >=620) {
    object.body.position.x = object.body.position.x +1;
    engine.timing.timeScale = 1.5;
  }
  //rampe
  if (x >= 3000 && x < 3300 && y >=520) {
    object.body.position.x = object.body.position.x +1.2;
  }
  //Ende01
  if (x >= 3400 && x < 3600 && y >=520) {
    object.body.position.x = object.body.position.x +0.5;
    engine.timing.timeScale = 1.2;
  }
  //FabrikWolke
  if (x >= 3000) {
      wolke = wolke - 0.3;
      document.getElementById("fabrikWolke").style.top = wolke;
    //Ende02
    if (x >= 3700 && x < 3900 && y >=530) {
      object.body.position.x = object.body.position.x +0.5;
      engine.timing.timeScale = 1.2;
    }
    //Ende03
    if (x >= 4100 && x < 4180) {
      object.body.position.x = object.body.position.x +0.2;
    }
    //Endsequenz
    if (x >= 4180 && endSequenz == false) {
      endSequenz = true;
      ballVisible = false;
      gameEnd(ball);
    }
  }
  else
  {
    object.body.position.x = object.body.position.x;
    engine.timing.timeScale = 1.0;
  }
}

//Führt Endsequenz aus und stoppt das Spiel
function gameEnd (object){
  Matter.Body.setPosition(object.body, {x:4295,y:470});
  ballVisible = true;
    Matter.Body.applyForce(
      ball.body,
      {x: ball.body.position.x, y: ball.body.position.y},
      {x: 0 , y: -0.2  });
      kanoneSound.play();
}

//Löst das Game Over aus und resetet den Ball
function gameover(object) {
  const y = object.body.position.y;
  if (y >= 720) {
    Matter.Body.setPosition(object.body, {x:30,y:50});
  }
}

//Steuerung Aufzug01
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

//Steuerung Aufzug 02
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
      {x: 0.004 , y: -0.035}
    );
    jumpSound.play();
  }
}
