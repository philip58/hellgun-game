//player variable(s)
//Player stats (HP, roll speed, current gun, etc.)
let player;
let canDodge = true;
let arm;
let playerSpeed = 7;
let playerHealth = 3;
let currentGun = "";
let playerMovingLeft = false;
let playerMovingRight = false;
let playerHurt = false;

//floor variables(s)
let floor;

//gun variables
let revolver;
let revolverEquipped = false;
let swordEquipped = true;
let thrownRev;
let ammo = 6;

//player projectile variables
let projectile;
let projectiles = [];

//enemy projectile variables
let enemyProjectile;
let enemyProjectiles = [];
let enemyCanShoot = true;

//camera variable(s)
let shakeScreen = false;

//game variables
let gameStart = false;
let playerIsDead = false;
let showDeathScreen = false;
let revolverSpawned = false;
let gameWon = false;

//enemy variables
let enemy;
let enemies = [];
let startingEnemy;
let enemySpawned;
let enemiesSpawned = 0;

//justin experimenting
let runnerImg;
let floorTile;
let walkable;
let tileSize = 200;
let groundSensor;

//backgrounds
let bg1x = 0;
let bg2x = 0;
let tutorialOverlay = false;
//fonts
let helsing;
let testa;

//respawn the player at start point function
function respawnPlayer(){
    //delete floating objects if existing
    if(projectiles.length!=0){
        projectiles = [];
    }

    player.x = 256/7;
    player.y = 200;
    arm.scale = 1;
    playerIsDead = false;
    showDeathScreen = false;
    revolverSpawned = false;
    revolverEquipped = false;
    enemySpawned = false;
    gameWon = false;
    arm.img = "assets/Arm.png";
}

function preload() {
    //sounds
    revShot = loadSound('assets/revShot.wav');
    pickup = loadSound('assets/pickup.wav');
    killSound = loadSound('assets/killSound.wav');
    damaged = loadSound('assets/damageRecieved.wav');
    swing = loadSound('assets/swing.flac');
    swordImpact = loadSound('assets/swordimpact.wav');
    deflect1 = loadSound('assets/deflect1.wav');
    deflect2 = loadSound('assets/deflect1.wav');
    menuMusic = loadSound('assets/menu.mp3');
    roll = loadSound('assets/roll.wav');
    healthPickup = loadSound('assets/healthpack.wav');


    //images
    bg1 = loadImage('assets/1.png');
    bg2 = loadImage('assets/2.png');
    bg3 = loadImage('assets/3.jpeg');
    tutIMG = loadImage('assets/tutorial.png');
    healthIMG = loadImage('assets/health.png');
    floorIMG = loadImage('assets/floor.png');
    healthPackIMG = loadImage('assets/HealthPickup.png');
    boxIMG = loadImage('assets/box.png');

    //fonts
    helsing = loadFont('assets/vanhelsing.ttf');
    testa = loadFont('assets/Testamento-Jed@.ttf');

    //runner
    runnerImg = loadImage('assets/enemyRun.png');

    //shooter
    //shooterIdle = loadImage('assets/revEnemyIdle.png');

    //pickups
    healthPack = new Group();
    healthPack.w = 32;
    healthPack.h = 32;
    healthPack.spriteSheet = healthPackIMG;
    healthPack.addAnis({
        hover:{frameSize: [32,32], frames:4}
    })
    healthPack.tile = 'h'
    healthPack.collider = 'static';
    healthPack.rotationLock = true;
    healthPack.anis.offset.y=29

  }

//set up function
function setup(){
    //music
    //menuMusic.play(0,1,0.2);
    //set up canvas and world settings
    new Canvas(1920,1080, 'pixelated x1');
    noStroke();
    rectMode(CENTER);

     world.gravity.y = 10;
     
    //health pack
    healthPack.w = 32;
    healthPack.h = 32;
    healthPack.scale = 2;


    //runner enemy
    runner = new Group();
    runner.debug = true;
    runner.dead = false;
    runner.w = 60;
    runner.h = 199;        
    runner.tile = "r";
    runner.rotationLock = true;
    runner.friction = 0;
    runner.drag = 0;
    runner.spriteSheet = runnerImg;
    runner.addAnis({
    run:{frameSize: [256,256], frames: 16}
    })
    runner.addAni('headshot','assets/headshot.png',{frameSize:[256,256], frames: 25});
    runner.addAni('headshotDone','assets/headshotdone.png',{frameSize:[256,256], frames: 1});
    runner.anis.offset.y=-27

    //shooter enemy
    shooter = new Group();
    shooter.debug = true;
    shooter.rotationLock = true;
    shooter.collider = "dynamic"; 
    shooter.width = 60;
    shooter.height = 199;
    shooter.dead = false;  
    shooter.canShoot = true;   
    shooter.tile = "s";
    shooter.friction = 0;
    shooter.drag = 0;
    shooter.addAnis({
        
    })
    //shooter animations
    shooter.addAni('shoot','assets/revEnemyShootLeft.png',{frameSize:[256,256], frames: 9});
    shooter.addAni('shootUp','assets/revEnemyShootUp.png',{frameSize:[256,256], frames: 9});
    shooter.addAni('shooterIdle','assets/revEnemyIdle.png',{frameSize:[256,256], frames: 30});   
    shooter.addAni('idleUp','assets/revEnemyUp.png',{frameSize:[256,256], frames: 30});   
    shooter.addAni('headshot','assets/headshot.png',{frameSize:[256,256], frames: 25});
    shooter.addAni('headshotDone','assets/headshotdone.png',{frameSize:[256,256], frames: 1});  


    //enemySpawned = true;


    //player cant push enemy
    // arm.overlaps(shooter);
    // player.overlaps(shooter);

    //revolver group
    rev = new Group();
    rev.img = "assets/revolver.png";
    rev.scale = 0.5;
    rev.width = 50;
    rev.height = 25;
    rev.ammo = 6;
    rev.tile = "g";

    walkable = new Group();
    walkable.layer =1;

    floorTile = new walkable.Group();
    floorTile.w = 200
    floorTile.h = 150;
    floorTile.tile = "a";
    floorTile.collider = 'static';
    floorTile.bounciness = 0;
    floorTile.image = floorIMG;

    boxTile = new walkable.Group()
    boxTile.w = tileSize
    boxTile.h = 150;
    boxTile.tile = "b";
    boxTile.collider = 'static';
    boxTile.bounciness = 0;
    boxTile.image = boxIMG;

    tileMap = new Tiles(
        [
        'aa.................................................................................................................................................',
        'aa.................................................................................................................................................',
        'aa.................................................................................................................................................',
        'aa.................................................................................................................................................',
        'aa.h.h.b....r.....g......s.....................b......................b.b..........................................................................',
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ], -700,
        -380,
        floorTile.w,
        floorTile.h,
    );
    console.log(runner);
     
     //initialize player
    player = new Sprite(0,200,256/7,200); //hitbox?
    player.collider = "dynamic";   
    player.rotationLock = true;
    player.bounciness = 0;        
    player.friction = 0;
    //player.debug = true;
        //movement fix
    groundSensor = new Sprite(player.x, player.y + player.y/2, player.w,1)
    groundSensor.visible = false;
    groundSensor.mass = 0.1;
    let joint = new GlueJoint(player,groundSensor);
    joint.visible = false;
        //removes healthpacks
    player.overlaps(healthPack, (p,c) =>{
        c.remove();
        playerHealth++;
        healthPickup.play(0,1,0.2);

    })

    //player arm
    arm = new Sprite(player.x,player.y,20,20);
    arm.collider ="dynamic";
    arm.img = 'assets/arm.png';
    arm.overlaps(player);

    //player animations    
    player.addAni('death', 'assets/death.png',{frameSize: [256,256], frames: 60});
    player.addAni('deathDone', 'assets/deathDone.png',{frameSize: [256,256], frames: 1});
    player.addAni('walkForward', 'assets/walkForward.png',{frameSize: [256,256], frames: 15});
    player.addAni('roll', 'assets/roll.png',{frameSize: [256,256], frames: 18});
    player.addAni('rollBack', 'assets/rollBack.png',{frameSize: [256,256], frames: 18});
    player.addAni('jump', 'assets/jump.png',{frameSize: [256,256], frames: 90});    
    player.addAni('idle', 'assets/idle.png',{frameSize: [256,256], frames: 30});
    player.anis.offset.y=-25;
    player.anis.offset.x=10;

    arm.addAni('revShot', 'assets/revShot.png',{frameSize: [256,256], frames: 9});
    arm.addAni('revIdle', 'assets/revShot.png',{frameSize: [256,256], frames: 1});
    arm.addAni('melee', 'assets/melee.png',{frameSize: [256,256], frames: 16});
    arm.addAni('armIdle', 'assets/arm.png',{frameSize: [256,256], frames: 1});


    arm.anis.frameDelay = -80;

    //initialize floor

    //floor = new Sprite(10000,400,200000,300);
    //floor.collider = "static";
    //floor.bounciness = 0;
    //floor.visible = true;
   //floor.color = 20;
}

function moveCamera(){
    camera.x = random(player.x+597,player.x+604);
    camera.y = random(-103,-94);
}

function shakeTheScreen(){
    shakeScreen = true;
    setTimeout(stopShakingScreen,100);
}

function stopShakingScreen(){
    shakeScreen = false;
}

//main menu buttons
function isMouseInsideText(message, messageX, messageY) {
    const messageWidth = textWidth(message);
    const messageTop = messageY - textAscent();
    const messageBottom = messageY + textDescent();
  
    return mouseX > messageX && mouseX < messageX + messageWidth &&
      mouseY > messageTop && mouseY < messageBottom;
  }
  function mouseClicked() {
    if (isMouseInsideText(play, playX, playY)) {
    if(gameStart == false){  pickup.play(0,1,0.5,0.2);}
      gameStart = true;
      
    }
    if (isMouseInsideText(tut, tutX, tutY)) {
        tutorialOverlay = true;
        if(gameStart == false){ pickup.play(0,1,0.5,0.2);}
  }
}
  
//main menu text
const play = 'PLAY';
const playX = 150;
const playY = 475;
const tut = 'TUTORIAL';
const tutX = 150;
const tutY = 575;


//draw function
function draw(){
    clear();
//background
image(bg3,0,0);
image(bg2, bg2x, 0);
image(bg1, bg1x, 0);

if (gameStart == false){
    //main menu
    camera.x = player.x+600;
    camera.y = -100;
    arm.x = player.x + 2;
    arm.y = player.y - 53;

    //text
    drawingContext.shadowColor = color(252, 0, 3);
    drawingContext.shadowBlur = 50;
    fill(252, 186, 3);
    stroke(0);
    strokeWeight(10);  
    textFont('helsing');
    textSize(300);
    text("HELLGUN", 100,300);
    textSize(75);
    strokeWeight(5);  

    if (isMouseInsideText(play, playX, playY)) {
        cursor(HAND);
        drawingContext.shadowColor = color(252, 160, 3);
        fill(252, 250, 3);
        stroke(100);
      } else {
        cursor(ARROW);
        drawingContext.shadowColor = color(252, 0, 3);

        fill(252, 186, 3);
        stroke(0);
      }
    text(play, playX, playY);
    if (isMouseInsideText(tut, tutX, tutY)) {
        cursor(HAND);
        drawingContext.shadowColor = color(252, 160, 3);
        fill(252, 250, 3);
        stroke(100);
      } else {
        cursor(ARROW);
        drawingContext.shadowColor = color(252, 0, 3);
        fill(252, 186, 3);
        stroke(0);
      }
  
    text(tut,tutX,tutY); 
stroke(0);
drawingContext.shadowBlur = 0;

if (tutorialOverlay == true){
    image(tutIMG,0,0,width,height);
    floorTile.visible = false;
    player.visible = false;
    arm.visible = false;
    if(mouse.presses()){
        tutorialOverlay = false;
    }
    
} else {
   floorTile.visible = true;
    player.visible = true;
    arm.visible = true;
}

} else if (gameStart == true){



bg1x = -player.x / 4
bg2x = -player.x / 8


    //shake the screen
    //shake the camera when true
    if(shakeScreen){
        moveCamera();
    } else{
        if(player.y > 1080/2+200 || playerIsDead){
            //handle player death
            playerIsDead = true;
            gameWon = false;
            setTimeout(() => {
                //reset camera when player falls off level
                //camera.x = 600;
                //camera.y = -200;
                showDeathScreen = true;
            }, 1000);
            if(showDeathScreen){
                textSize(125);
                text("You Have Died",500,150);
                textSize(75);
                text("Press R To Restart",600,250);
            }   
        } else{
            //adjust camera to follow player
            camera.x = player.x+600;
            camera.y = -100;
            
        }
    }

    //respawn/restart
    if(kb.presses("r")){
        respawnPlayer();
        playerHealth = 3;
    }

    //Player Arm
    arm.x = player.x + 2;
    arm.y = player.y - 53;

    //check if player is dead
    if(!playerIsDead){
        -450, -200, -200
        //handling jumping 
        if(groundSensor.overlapping(walkable) && kb.pressing('up')){
            //jump only when touching floor
            player.moveTo(player.x + 50,player.y-200,8);
        }

        //handling movement
        if (kb.pressing('left')) {
            player.vel.x = -playerSpeed;
            playerMovingLeft = true;
        } else if (kb.pressing('right')) {
            player.vel.x = playerSpeed; 
                        playerMovingRight = false;

        } else {
            player.vel.x = 0;
            playerMovingLeft = false;
            playerMovingRight = false;

        } 

        //dodge left and right mechanic
        if(canDodge && kb.presses('down')) {                            
             player.changeAni(['roll','idle']);
                roll.play(0,1,0.3,0.2);
                console.log("dodge");
                canDodge = false;
                //after roll
                setTimeout(() => {
                    canDodge = true;          
                    arm.scale = 1;
                    playerSpeed = 7;
                    player.changeAni(['idle']);

                }, 1200);
            //during roll
            playerSpeed = 15;
            arm.scale = 0;
        } 

        //aiming
        //flipping player and arm model based on mouse orientation
        if (mouse.x > player.x){
            player.mirror.x = false;
            arm.mirror.x = false;
            arm.rotation = (mouse.y/8) - 20
        } else if (mouse.x < player.x){
            player.mirror.x = true;
            arm.mirror.x = true;
            arm.x-=0;
            arm.rotation = -mouse.y/8 + 20
        }

        //animations


    if(canDodge && kb.presses('down')) {
        player.changeAni('roll');
        if(kb.pressing('left')){
            player.changeAni('roll'); }
        if(kb.pressing('right')){
            player.changeAni('roll');
        }
    }

        if(player.ani.name != 'roll'){     
        if (kb.pressing('left')) {
            player.changeAni('walkForward');
     

        } else if (kb.pressing('right')) {
        

            player.changeAni('walkForward');
        } else {
        //play idle animation if movement stops
            player.changeAni('idle');
        }
        if(groundSensor.overlapping(walkable) == false){
            player.changeAni('jump');
        }
    }

        //gun animations // add extra if statement for gun type

   
        //shooting wherever mouse is clicked, melee
        if(player.ani.name != 'roll'){

            if(revolverEquipped){
                if(mouse.presses() && ammo > 0 && !player.mouse.hovering() && ((mouse.x > player.x+80 || mouse.x < player.x-80) || (mouse.y<player.y-150))){
                    if (mouse.x > player.x){
                        projectile = new Sprite(arm.x+90,arm.y+15,25);
                        projectile.img = 'assets/bullet.png'
                        //projectile.rotation = -mouse.y/8+20;         
                        arm.changeAni(['revShot','revIdle']);  
                        revShot.play(0,1,0.2);
                    } else{
                        projectile = new Sprite(arm.x-90,arm.y+15,25);
                        projectile.img = 'assets/bullet.png'
                       // projectile.rotation = -mouse.y/8+20;
                        arm.changeAni(['revShot','revIdle']);  
                        revShot.play(0,1,0.2);
                    }
                    projectile.mass = 0;
                    ammo--;
                    projectiles.push(projectile);
                    projectile.moveTowards(mouse.x,mouse.y,10);
                    shakeTheScreen();
                }
            } else {
            //melee
            if(mouse.presses() && !player.mouse.hovering() && ((mouse.x > player.x+80 || mouse.x < player.x-80) || (mouse.y<player.y-150))){
                arm.changeAni(['melee', 'armIdle']);
                swing.play(0,1,0.2);
                //check if player hits enemy
                for(let i = 0; i < runner.length; i++){
                    if(player.x - runner[i].x <= 200 && player.x - runner[i].x >= -200 && player.y >= runner[i].y-30){
                        killSound.play(0,1,0.5);
                        runner[i].changeAni(['headshot','headshotDone']);
                        setTimeout(() => {
                            runner[i].remove();
                        }, 1000);
                    }
                }
                for(let i = 0; i < shooter.length; i++){
                    if(player.x - shooter[i].x <= 200 && player.x - shooter[i].x >= -200 && player.y >= shooter[i].y-30){
                        killSound.play(0,1,0.5);
                        shooter[i].changeAni(['headshot','headshotDone']);
                        setTimeout(() => {
                            shooter[i].remove();
                        }, 1000);
                    }
                }
                arm.changeAni(['melee', 'armIdle']);
                swing.play(0,1,0.2);

                //melee an enemy
               // if(arm.collides()){
               //     swing.play(0,1,0.2);}

                //deflect bullet
                //if(arm.collides(projectiles[i])){
                 //   deflect1.play(0,1,0.2);
                 //   deflect2.play(0,1,0.2);}
            }
        }
    }
        
    } 
    
    //enemy projectile collision handling
    for(let i = 0; i < enemyProjectiles.length; i++){
        if(enemyProjectiles[i].collides(player)){
            if(player.ani.name === 'roll'){
                player.collider = "none";
                arm.collider = "none";
                enemyProjectiles[i].x = player.x - 100;
                enemyProjectiles[i].vel.x = -50; 
            } else {
                player.collider = "dynamic";
                arm.collider = "dynamic";
                shakeTheScreen();
                enemyProjectiles[i].remove();
                if(playerHealth <= 1){
                    damaged.play(0,1,0.5);
                    arm.scale = 0;
                    player.changeAni(['death', 'deathDone']);
                    playerIsDead = true;
                } else{
                    playerHealth--;
                    damaged.play(0,1,0.5);

                }
            }
        }
        if(enemyProjectiles[i].y<-650 || enemyProjectiles[i].y>=750){
            enemyProjectiles[i].remove();
        } 
        if(enemyProjectiles[i].collides(floorTile)){
            enemyProjectiles[i].remove();
        }
        if(enemyProjectiles[i].overlapping(walkable)){
            enemyProjectiles[i].remove();
        }
    }

    player.collider = "dynamic";
 
    //UI  
  
    //text properties    
    textSize(50);
    stroke(0);
    strokeWeight(4);  
    textFont('helsing');

    //debug text
    //text("player X: " + int(player.x) + " player Y: " + int(player.y), 100,40)

    //health 
    if(playerIsDead == false){
    image(healthIMG,75,75,128,128);
    text(playerHealth, 125,175);
    }

   //runner enemy runs to player when in range
   for(let i = 0; i < runner.length; i++){
    if(!runner.dead && (runner[i].x - player.x <= 1600 || player.x - runner[i].x <= 1600)){
        runner[i].moveTo(player.x,194,3);  
        if(runner[i].x > player.x){
            runner[i].mirror.x = true;
        } else {
            runner[i].mirror.x = false;
        }
    } 



    
    //deal with player and runner collision
    //decrement health and give 1 second grace period before next hit
    if(!runner.dead && runner[i].collides(player) && !playerHurt){
        playerHurt = true;
        shakeTheScreen();
        damaged.play(0,1,0.5);
        
        setTimeout(() => {
            playerHurt = false;
        }, 1000);
        if(playerHealth <= 1){
            damaged.play(0,1,0.5);
            arm.scale = 0;
            player.changeAni(['death', 'deathDone']);
            playerIsDead = true;
        } else{
            playerHealth--;
        }
    }
   }

   //runner and player projectile collisions
   for(let i = 0; i < runner.length; i++){
    for(let j = 0; j < projectiles.length; j++){
        if(projectiles[j].collides(runner[i])){
            //runner death
            runner.dead = true;
            projectiles[j].remove();
            killSound.play(0,1,0.5);
            runner[i].changeAni(['headshot','headshotDone']);
            setTimeout(() => {
                runner[i].remove();
            }, 1000);
        }
    }
   }


   //enemy shooting
   for(let i = 0; i < shooter.length; i++){
    //shooter shoots at player when in range
    if(shooter[i].x - player.x <= 1600 && shooter[i].dead === false && shooter[i].canShoot === true && !playerIsDead){
          if (shooter[i].canShoot === false){
          if(groundSensor.overlapping(walkable)){
          shooter[i].changeAni('shooterIdle');
      } else {
          shooter[i].changeAni('idleUp');}} 

        //handling bullet
        enemyProjectile = new Sprite(shooter[i].x-80,shooter[i].y-50,25)
        enemyProjectile.img = 'assets/bullet.png';
        enemyProjectile.mirror.x = true;
        revShot.play(0,1,0.2);
        enemyProjectile.mass = 0;
        enemyProjectiles.push(enemyProjectile);

         //Shooting animations
        if(groundSensor.overlapping(walkable)){
            shooter[i].changeAni(['shoot','shooterIdle']);  

            enemyProjectile.moveTo(-1500,200,50);
        } else {
            shooter[i].changeAni(['shootUp','idleUp']);  
            enemyProjectile.moveTo(-500,-1000,50);
        }
        
        shooter[i].canShoot = false;
        
        setTimeout(() => {
            shooter[i].canShoot = true;
        }, 2000);
    }
   }
   //enemy animations
    shooter.mirror.x = true;
    shooter.anis.offset.y=-30;


   //player projectiles hit shooter
   for(let i = 0; i < projectiles.length; i++){
    for(let j = 0; j < shooter.length; j++){
        if(projectiles[i].collides(shooter[j])){
            //runner death
            shooter.dead = true;
            projectiles[i].remove();
            killSound.play(0,1,0.5);
            shooter[j].changeAni(['headshot','headshotDone']);
            setTimeout(() => {
                shooter[j].remove();
            }, 1000);
        }
        if(projectiles[i].y<-650 || projectiles[i].y>=750){
            projectiles[i].remove();
        } 
        if(projectiles[i].collides(floorTile)){
            projectiles[i].remove();
        }
    }
}

    //pick up revolver when touched
    for(let i = 0; i < rev.length; i++){
        if(!revolverEquipped && player.colliding(rev)){
            ammo = 6;
            rev.collider = "dynamic";           
            revolverEquipped = true;
            swordEquipped = false;
            rev[i].remove();
            pickup.play(0,1,1);
            arm.img = 'assets/RevolverArm.png';
        } else {
            rev.collider = "dynamic";
        }
    }

    //drop gun when right mouse button clicked
    if(revolverEquipped && mouse.right > 1 && mouse.right < 10){
        thrownRev = new Sprite(player.x+50,player.y-50);
        thrownRev.collider = "dynamic";
        thrownRev.img = "assets/revolver.png";
        arm.img = "assets/Arm.png";
        thrownRev.scale = 0.5;
        thrownRev.width = 50;
        thrownRev.height = 25;
        thrownRev.moveTowards(mouse.x,mouse.y,25);
        revolverEquipped = false;
        
    }
    
    if(thrownRev){
        if(thrownRev.overlapping(walkable)){
            thrownRev.remove();
        }
        for(let i = 0; i < runner.length; i++){
            if(thrownRev.collides(runner[i])){
                killSound.play(0,1,0.5);
                runner[i].changeAni(['headshot','headshotDone']);
                setTimeout(() => {
                    runner[i].remove();
                }, 1000);
                thrownRev.remove();
            }
        }
        for(let i = 0; i < shooter.length; i++){
            if(thrownRev.collides(shooter[i])){
                killSound.play(0,1,0.5);
                shooter[i].changeAni(['headshot','headshotDone']);
                setTimeout(() => {
                    shooter[i].remove();
                }, 1000);
                thrownRev.remove();
            }
        }
    }

    if(revolverEquipped){
        textSize(60);
        textStyle(BOLD);
        text(ammo + "/6", 250,180);
    }

}
}