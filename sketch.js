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

//floor variables(s)
let floor;

//gun variables
let gunText1;
let gunText2;
let revolver;
let revolverEquipped = false;

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
let gameStart = true;
let playerIsDead = false;
let showDeathScreen = false;
let introText1;
let introText2;
let introText3;
let revolverSpawned = false;
let gameWon = false;
let winText;

//enemy variables
let enemy;
let enemies = [];
let startingEnemy;
let enemySpawned;
let enemiesSpawned = 0;

//backgrounds
let bg1x = 0;
let bg2x = 0;


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
    //images
    bg1 = loadImage('assets/1.png');
    bg2 = loadImage('assets/2.png');
    bg3 = loadImage('assets/3.jpeg');
  }

//set up function
function setup(){
    //set up canvas and world settings
    new Canvas(1920,1080);
    noStroke();
    rectMode(CENTER);
    world.gravity.y = 10;

    //game instructions/introduction
    introText1 = new Sprite(500,-450);
    introText1.collider = "none";
    introText1.text = "Welcome To Hellgun";
    introText1.textSize = 75;
    introText1.color = 50;
    introText1.stroke = 50;

    introText2 = new Sprite(150,-200);
    introText2.collider = "none";
    introText2.text = "A and D To Move";
    introText2.textSize = 75;
    introText2.color = 50;
    introText2.stroke = 50;

    introText3 = new Sprite(850,-200);
    introText3.collider = "none";
    introText3.text = "W To Jump";
    introText3.textSize = 75;
    introText3.color = 50;
    introText3.stroke = 50;

    //initialize player
    player = new Sprite(0,200,256/7,200); //hitbox?
    player.collider = "dynamic";   
    player.rotationLock = true;
    player.bounciness = 0;
    
    
    //player arm
    arm = new Sprite(player.x,player.y,20,20);
    arm.collider ="dynamic";
    arm.img = 'assets/arm.png';
    arm.overlaps(player);
    //player animations    
    player.addAni('death', 'assets/death.png',{frameSize: [256,256], frames: 60});
    player.addAni('deathDone', 'assets/deathDone.png',{frameSize: [256,256], frames: 1});
    player.addAni('walkForward', 'assets/walkForward.png',{frameSize: [256,256], frames: 15});
    player.addAni('idle', 'assets/idle.png',{frameSize: [256,256], frames: 30});
    player.addAni('roll', 'assets/roll.png',{frameSize: [256,256], frames: 18});
    player.addAni('rollBack', 'assets/rollBack.png',{frameSize: [256,256], frames: 18});
    player.addAni('jump', 'assets/jump.png',{frameSize: [256,256], frames: 90});
    arm.addAni('revShot', 'assets/revShot.png',{frameSize: [256,256], frames: 9});
    arm.addAni('revIdle', 'assets/revShot.png',{frameSize: [256,256], frames: 1});
    arm.addAni('armIdle', 'assets/arm.png',{frameSize: [256,256], frames: 1});

    arm.anis.frameDelay = -80;

    //initialize floor

    floor = new Sprite(10000,400,200000,300);
    floor.collider = "static";
    floor.bounciness = 0;
    floor.visible = true;
    floor.color = 20;
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

//spawn an enemy
function spawnEnemy(x,y){
    enemy = new Sprite(x,y);        
    enemy.addAni('headshot','assets/headshot.png',{frameSize:[256,256], frames: 25});
    enemy.addAni('headshotDone','assets/headshotdone.png',{frameSize:[256,256], frames: 1});
    enemy.addAni('shoot','assets/revEnemyShootLeft.png',{frameSize:[256,256], frames: 9});
    enemy.addAni('shootUp','assets/revEnemyShootUp.png',{frameSize:[256,256], frames: 9});
    enemy.addAni('idle','assets/revEnemy.png',{frameSize:[256,256], frames: 30});
    enemy.addAni('idleUp','assets/revEnemyUp.png',{frameSize:[256,256], frames: 30});

    //iterate enemy counter
    enemiesSpawned++;
    enemy.rotationLock = true;
    //enemy.collider = "dynamic"; 
    enemy.width = 256/7;
    enemy.height = 150;
    enemy.anis.offset.y=-20;
    enemy.anis.offset.x=0;
    enemy.mirror.x = true;  
    enemy.canShoot = true;
    enemy.isDead = false;

    //player cant push enemy
    arm.overlaps(enemy);
    player.overlaps(enemy);
    
    //enemy animations
    if(player.colliding(floor)){
        enemy.changeAni('idle');  
    } else {
        enemy.changeAni('idleUp');;  
    }

    //push enemy to enemy array
    enemies.push(enemy);
}



//draw function
function draw(){
    clear();
//background
image(bg3,0,0);
image(bg2, bg2x, 0);
image(bg1, bg1x, 0);

bg1x = -player.x / 4
bg2x = -player.x / 8


//UI
textSize(75);
text("Health: " + playerHealth, 100,100);
    // //player hitbox debug (shows hitbox on LMB click)
   //  player.debug = mouse.pressing();
    // arm.debug = mouse.pressing();

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
        introText1.y = -450;
        introText2.y = -200;
        introText3.y = -200;
        //handling jumping 
        if(player.colliding(floor) && kb.pressing('up')){
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
            //animations
        //if(playerMoving == "left" && mouse.x > player.x || kb.presses('right') && mouse.x < player.x){
        //    player.changeAni(['rollBack','idle']); }
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
        player.anis.offset.y=-29;
        player.anis.offset.x=10;

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
        if(player.colliding(floor) == false){
            player.changeAni('jump');
        }
    }

        //gun animations // add extra if statement for gun type

   
        //shooting wherever mouse is clicked
        if(player.ani.name != 'roll'){
            if(revolverEquipped){
                if(mouse.presses() && !player.mouse.hovering() && ((mouse.x > player.x+80 || mouse.x < player.x-80) || (mouse.y<player.y-150))){
                    if (mouse.x > player.x){
                        projectile = new Sprite(arm.x+90,arm.y+15,25);
                        projectile.img = 'assets/bullet.png'
                        //projectile.rotation = mouse.y/8+20;         
                        arm.changeAni(['revShot','revIdle']);  
                        revShot.play(0,1,0.2);
                    } else{
                        projectile = new Sprite(arm.x-90,arm.y+15,25);
                        projectile.img = 'assets/bullet.png'
                        //projectile.rotation = -mouse.y/8+20;
                        arm.changeAni(['revShot','revIdle']);  
                        revShot.play(0,1,0.2);
                    }
                    projectile.mass = 0;
                    projectiles.push(projectile);
                    projectile.moveTowards(mouse.x,mouse.y,50);
                    shakeTheScreen();
                }
            }
    }
        //check for projectile collisions 
        for(let i = 0; i < projectiles.length; i++){
            for(let j = 0; j < enemies.length; j++){
                if(enemySpawned){
                    if(projectiles[i].collides(enemies[j])){
                        killSound.play(0,1,0.5);
                        enemies[j].changeAni(['headshot','headshotDone']);  
                        projectiles[i].remove();
                        enemies[j].isDead = true;
                        //gameWon = true;
                        enemySpawned = false;
                    }
                }
                if(projectiles[i].y<-650 || projectiles[i].y>=750){
                    projectiles[i].remove();
                } 
                if(projectiles[i].collides(floor)){
                    projectiles[i].remove();
                }
            }
        }
    } else {
        introText1.y = 2000;
        introText2.y = 2000;
        introText3.y = 2000;
    }

    //display text if game is won
    if(gameWon){
        textSize(75);
        text("CONGRATS YOU WON!!!", 500,150);
    }

    //spawn revolver when passing a checkpoint
    if(player.x > 2000 && !revolverSpawned){
        gunText1 = new Sprite(2700,-450);
        gunText1.collider = "none";
        gunText1.text = "Walk Over To Pick It Up";
        gunText1.textSize = 75;
        gunText1.color = 50;
        gunText1.stroke = 50;

        gunText2 = new Sprite(2700,-250);
        gunText2.collider = "none";
        gunText2.text = "Left Click To Shoot";
        gunText2.textSize = 75;
        gunText2.color = 50;
        gunText2.stroke = 50;

        revolverSpawned = true;
        revolver = new Sprite(3000,10);
        revolver.img = "assets/revolver.png";
        revolver.scale = 0.5;
        revolver.width = 50;
        revolver.height = 25;
        
    }

    //check if revolver spawned in
    if(revolverSpawned){
        //make revolver unable to move
        if(player.colliding(revolver)){
            revolver.collider = "dynamic";           
            revolverEquipped = true;
            revolver.remove();
            pickup.play(0,1,1);
            arm.img = 'assets/RevolverArm.png';
        } else {
            revolver.collider = "dynamic";
        }

    }

    //spawn in enemy when player reaches checkpoint
    if(player.x > 3000 && !enemySpawned){
        // enemyText1 = new Sprite(4500,-450);
        // enemyText1.collider = "none";
        // enemyText1.text = "Jump Over Bullets With W Or Dodge Them With S";
        // enemyText1.textSize = 75;
        // enemyText1.color = 50;
        // enemyText1.stroke = 50;

        // enemyText2 = new Sprite(4500,-250);
        // enemyText2.collider = "none";
        // enemyText2.text = "Aim At The Enemy And Shoot It To Win";
        // enemyText2.textSize = 75;
        // enemyText2.color = 50;
        // enemyText2.stroke = 50;

        // enemies[0] = new Sprite(4900,145);        
        // enemies[0].addAni('headshot','assets/headshot.png',{frameSize:[256,256], frames: 25});
        // enemies[0].addAni('headshotDone','assets/headshotdone.png',{frameSize:[256,256], frames: 1});
        // enemies[0].addAni('shoot','assets/revEnemyShootLeft.png',{frameSize:[256,256], frames: 9});
        // enemies[0].addAni('shootUp','assets/revEnemyShootUp.png',{frameSize:[256,256], frames: 9});
        // enemies[0].addAni('idle','assets/revEnemy.png',{frameSize:[256,256], frames: 30});
        // enemies[0].addAni('idleUp','assets/revEnemyUp.png',{frameSize:[256,256], frames: 30});



        // enemies[0].rotationLock = true;
        // //enemies[0].collider = "dynamic"; 
        // enemies[0].width = 256/7;
        // enemies[0].height = 150;
        // enemySpawned = true;
        // enemies[0].anis.offset.y=-20;
        // enemies[0].anis.offset.x=0;
        // enemies[0].mirror.x = true;  

        // //player cant push enemy
        // arm.overlaps(enemies[0]);
        // player.overlaps(enemies[0]);
        // //enemies[0].overlaps(projectile);
        // //enemy animations

       // spawnEnemy(4900,145);

       // spawnEnemy(5500,145);

       // enemySpawned = true;

    }

    //check if enemy spawned in
    if(enemySpawned){
        for(let j = 0; j < enemies.length; j++){
            if(player.colliding(floor)){
                enemies[j].changeAni('idle');  
            } else {
                enemies[j].changeAni('idleUp');;  
            }
            //make enemy unable to move
            if(player.colliding(enemies[j])){
                enemies[j].collider = "static";
            } else {
                enemies[j].collider = "static";
            }

            //enemy shoots at player when in distance 
            if(enemies[j].x - player.x <= 1600 && enemies[j].isDead === false && enemies[j].canShoot === true && !gameWon){
                enemyProjectile = new Sprite(enemies[j].x-80,enemies[j].y-50,25)
                enemyProjectile.img = 'assets/bullet.png';
                enemyProjectile.mirror.x = true;
                revShot.play(0,1,0.2);
                enemyProjectile.mass = 0;
                enemyProjectiles.push(enemyProjectile);
                if(player.colliding(floor)){
                    enemies[j].changeAni(['shoot','idle']);  

                    enemyProjectile.moveTo(-1500,200,50);
                } else {
                    enemies[j].changeAni(['shootUp','idleUp']);  
                    enemyProjectile.moveTo(-500,-1000,50);
                }
                
                enemies[j].canShoot = false;
                
                setTimeout(() => {
                    enemies[j].canShoot = true;
                }, 2000);
            }
        }
    }
    
    //enemy projectile collision handling
    for(let i = 0; i < enemyProjectiles.length; i++){
        if(enemySpawned){
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
                    if(playerHealth <= 0){
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
        }
        if(enemyProjectiles[i].y<-650 || enemyProjectiles[i].y>=750){
            enemyProjectiles[i].remove();
        } 
        if(enemyProjectiles[i].collides(floor)){
            enemyProjectiles[i].remove();
        }
    }

    player.collider = "dynamic";




}