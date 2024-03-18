let frames = 0;

const hitSound = new Audio();
hitSound.src = './files/sounds/hit.wav';

const jumpSound = new Audio();
jumpSound.src = './files/sounds/jump.wav';

const downSound = new Audio();
downSound.src = './files/sounds/down.wav';

const sprites = new Image();
sprites.src = './files/sprites/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      background.x, background.y,
      background.width, background.height,
    );

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      (background.x + background.width), background.y,
      background.width, background.height,
    );
  },
};

function createFloor() {
  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const floorMoviment = 1;
      const repetIn = floor.width / 2;
      const moviment = floor.x - floorMoviment;

      floor.x = moviment % repetIn;
    },
    draw() {
      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        floor.x, floor.y,
        floor.width, floor.height,
      );

      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        (floor.x + floor.width), floor.y,
        floor.width, floor.height,
      );
    },
  };
  return floor;
}

function birdCollide(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const floorY = floor.y;

  if (flappyBirdY >= floorY) {
    return true;
  }

  return false;
}

function createFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    jumpHeight: 4.6,
    jump() {
      flappyBird.speed = - flappyBird.jumpHeight;
      jumpSound.play();
    },
    gravidade: 0.25,
    speed: 0,
    update() {
      if (birdCollide(flappyBird, globals.floor)) {
        downSound.play();

        changeToScreen(screen.gameOver);
        return;
      }

      flappyBird.speed = flappyBird.speed + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.speed;
    },
    moviments: [
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio 
    ],
    frameAtual: 0,
    updateActualFrame() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      // console.log('passouOIntervalo', passouOIntervalo)

      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.moviments.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }
      // console.log('[incremento]', incremento);
      // console.log('[baseRepeticao]',baseRepeticao);
      // console.log('[frame]', incremento % baseRepeticao);
    },
    draw() {
      flappyBird.updateActualFrame();
      const { spriteX, spriteY } = flappyBird.moviments[flappyBird.frameAtual];

      context.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.width, flappyBird.height, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height,
      );
    }
  }
  return flappyBird;
}

const messageGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      messageGetReady.sX, messageGetReady.sY,
      messageGetReady.w, messageGetReady.h,
      messageGetReady.x, messageGetReady.y,
      messageGetReady.w, messageGetReady.h
    );
  }
}

const messageGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      messageGameOver.sX, messageGameOver.sY,
      messageGameOver.w, messageGameOver.h,
      messageGameOver.x, messageGameOver.y,
      messageGameOver.w, messageGameOver.h
    );
  }
}

function createPipe() {
  const canos = {
    width: 52,
    height: 400,
    floor: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    draw() {
      canos.pares.forEach(function (par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        // [Cano do Céu]
        context.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.width, canos.height,
          canoCeuX, canoCeuY,
          canos.width, canos.height,
        )

        // [Cano do Chão]
        const canofloorX = par.x;
        const canofloorY = canos.height + espacamentoEntreCanos + yRandom;
        context.drawImage(
          sprites,
          canos.floor.spriteX, canos.floor.spriteY,
          canos.width, canos.height,
          canofloorX, canofloorY,
          canos.width, canos.height,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.height + canoCeuY
        }
        par.canofloor = {
          x: canofloorX,
          y: canofloorY
        }
      })
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globals.flappyBird.y;
      const peDoFlappy = globals.flappyBird.y + globals.flappyBird.height;

      if ((globals.flappyBird.x + globals.flappyBird.width) >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if (peDoFlappy >= par.canofloor.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    update() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }



      canos.pares.forEach(function (par) {
        par.x = par.x - 2;

        if (canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu!')
          hitSound.play();
          changeToScreen(screen.gameOver);
        }

        if (par.x + canos.width <= 0) {
          canos.pares.shift();
        }
      });

    }
  }

  return canos;
}

function createScoreboard() {
  const placar = {
    pontuacao: 0,
    draw() {
      context.font = '35px "VT323"';
      context.textAlign = 'right';
      context.fillStyle = 'white';
      context.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
    },
    update() {
      const intervaloDeFrames = 20;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        placar.pontuacao = placar.pontuacao + 1;
      }
    }
  }
  return placar;
}


// 
// [screen]
// 
const globals = {};
let activeScreen = {};

function changeToScreen(novaTela) {
  activeScreen = novaTela;

  if (activeScreen.initiate) {
    activeScreen.initiate();
  }
}

const screen = {
  start: {
    initiate() {
      globals.flappyBird = createFlappyBird();
      globals.floor = createFloor();
      globals.canos = createPipe();
    },
    draw() {
      background.draw();
      globals.flappyBird.draw();

      globals.floor.draw();
      messageGetReady.draw();
    },
    click() {
      changeToScreen(screen.game);
    },
    update() {
      globals.floor.update();
    }
  },
  game: {
    initiate() {
      globals.placar = createScoreboard();
    },
    draw() {
      background.draw();
      globals.canos.draw();
      globals.floor.draw();
      globals.flappyBird.draw();
      globals.placar.draw();
    },
    click() {
      globals.flappyBird.jump();
    },
    update() {
      globals.canos.update();
      globals.floor.update();
      globals.flappyBird.update();
      globals.placar.update();
    }
  },
  gameOver: {
    draw() {
      messageGameOver.draw();
    },
    update() {

    },
    click() {
      changeToScreen(screen.start);
    }
  }
};

function loop() {
  activeScreen.draw();
  activeScreen.update();

  frames = frames + 1;
  requestAnimationFrame(loop);
}


window.addEventListener('click', function () {
  if (activeScreen.click) {
    activeScreen.click();
  }
});

changeToScreen(screen.start);
loop();