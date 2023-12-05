//player variable(s)
let player;
let canDodge = true;
let arm;

//floor variables(s)
let floor;

//gun variables
let gunText1;
let gunText2;
let revolver;
let revolverEquipped = false;

//projectile variables
let projectile;
let projectiles = [];

//camera variable(s)
let shakeScreen = false;

//game variables
let playerIsDead = false;
let showDeathScreen = false;
let introText1;
let introText2;
let introText3;
let revolverSpawned = false;
//Player stats (HP, roll speed, current gun, etc.)
let playerSpeed = 7;

//enemy variables
let startingEnemy;
let enemySpawned;

//respawn the player at start point function
function respawnPlayer(){
    //delete floating objects if existing
    if(projectiles.length!=0){
        projectiles = [];
    }

    player.x = 256/7;
    player.y = 200;

    playerIsDead = false;
    showDeathScreen = false;
}

//sounds
function preload() {
    revShot = loadSound('assets/revShot.wav');

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
    introText1.text = "Point And Click To Shoot";
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
    player.addAni('walkForward', 'assets/walkForward.png',{frameSize: [256,256], frames: 15});
    player.addAni('idle', 'assets/idle.png',{frameSize: [256,256], frames: 30});

    player.addAni('roll', 'assets/roll.png',{frameSize: [256,256], frames: 18});
    player.addAni('jump', 'assets/jump.png',{frameSize: [256,256], frames: 90});
    arm.addAni('revShot', 'assets/revShot.png',{frameSize: [256,256], frames: 9});
    arm.addAni('revIdle', 'assets/revShot.png',{frameSize: [256,256], frames: 1});

    arm.anis.frameDelay = -80;

    //initialize floor
    floor = new Sprite(2000,400,6000,300);
    floor.collider = "static";
    floor.bounciness = 0;
}

function moveCamera(){
    camera.x = random(player.x+597,player.x+604);
    camera.y = random(player.y-247,player.y-254);
}

function shakeTheScreen(){
    shakeScreen = true;
    setTimeout(stopShakingScreen,100);
}

function stopShakingScreen(){
    shakeScreen = false;
}



//draw function
function draw(){
    clear();
    background(50);

    // //player hitbox debug (shows hitbox on LMB click)
    // player.debug = mouse.pressing();
    // arm.debug = mouse.pressing();

    //shake the screen
    //shake the camera when true
    if(shakeScreen){
        moveCamera();
    } else{
        if(player.y > 1080/2+200 || playerIsDead){
            //handle player death
            playerIsDead = true;
            setTimeout(() => {
                //reset camera when player falls off level
                camera.x = 600;
                camera.y = -200;
                showDeathScreen = true;
            }, 1000);
            if(showDeathScreen){
                textSize(125);
                text("You Have Died",500,150);
                textSize(75);
                text("Press R To Restart",600,250);
            }   
            if(kb.presses("r")){
                respawnPlayer();
            }
        } else{
            //adjust camera to follow player
            camera.x = player.x+600;
            camera.y = player.y-250;
            
        }
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
            player.moveTo(player.x,player.y-200,8);
        }

        //handling movement
        if (kb.pressing('left')) {
            player.vel.x = -playerSpeed;
        } else if (kb.pressing('right')) {
            player.vel.x = playerSpeed; 
        } else {
            player.vel.x = 0;
        } 

        //dodge left and right mechanic
        if(canDodge && kb.presses('down') ) {
            player.changeAni(['roll','idle']);
                console.log("dodge");
                canDodge = false;
             
                //after roll
                setTimeout(() => {
                    canDodge = true;          
                    arm.scale = 1;
                    playerSpeed = 7;

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
                        projectile = new Sprite(arm.x+80,arm.y+50,25);
                        projectile.img = 'assets/bullet.png'
                        projectile.rotation = mouse.y/8+20;         
                        arm.changeAni(['revShot','revIdle']);  
                        revShot.play(0,1,0.2);
                    } else{
                        projectile = new Sprite(arm.x-80,arm.y+50,25);
                        projectile.img = 'assets/bullet.png'
                        projectile.rotation = -mouse.y/8+20;
                        arm.changeAni(['revShot','revIdle']);  
                        revShot.play(0,1,0.2);
                    }
                    projectile.mass = 0;
                    projectiles.push(projectile);
                    projectile.moveTowards(mouse.x,mouse.y,75);
                    shakeTheScreen();
                }
            }
    }
        //check for projectile collisions 
        for(let i = 0; i < projectiles.length; i++){
            if(enemySpawned){
                if(projectiles[i].collides(startingEnemy)){
                    startingEnemy.remove();
                    enemyText1.remove();
                    enemyText2.remove();
                    let winText = new Sprite(4750,-350);
                    winText.text = "CONGRATS, YOU WIN!!!";
                    winText.collider = "none";
                    winText.textSize = 100;
                    winText.color = 50;
                    winText.stroke = 50;
                }
            }
            if(projectiles[i].y<-650 || projectiles[i].y>=750){
                projectiles[i].remove();
            } 
            if(projectiles[i].collides(floor)){
                projectiles[i].remove();
            }
        }
    } else {
        introText1.y = 2000;
        introText2.y = 2000;
        introText3.y = 2000;
    }

    //spawn revolver when passing a checkpoint
    if(player.x > 2000 && !revolverSpawned){
        gunText1 = new Sprite(2700,-450);
        gunText1.collider = "none";
        gunText1.text = "This Is Your Gun";
        gunText1.textSize = 75;
        gunText1.color = 50;
        gunText1.stroke = 50;

        gunText2 = new Sprite(2700,-250);
        gunText2.collider = "none";
        gunText2.text = "Click Right Click To Pick It Up";
        gunText2.textSize = 75;
        gunText2.color = 50;
        gunText2.stroke = 50;

        revolver = new Sprite(3000,100);
        revolver.img = "assets/revolver.png";
        revolver.width = 100;
        revolver.height = 50;
        revolverSpawned = true;
    }

    //check if revolver spawned in
    if(revolverSpawned){
        //make revolver unable to move
        if(player.colliding(revolver)){
            revolver.collider = "none";
        } else {
            revolver.collider = "dynamic";
        }
        
        //right click revolver to pick it up 
        if(revolver.mouse.hovering() && mouse.right > 1 && mouse.right < 10){
            revolverEquipped = true;
            revolver.remove();
        }
    }

    //spawn in enemy when player reaches checkpoint
    if(player.x > 4000 && !enemySpawned){
        enemyText1 = new Sprite(4500,-450);
        enemyText1.collider = "none";
        enemyText1.text = "This Is An Enemy";
        enemyText1.textSize = 75;
        enemyText1.color = 50;
        gunText1.stroke = 50;

        enemyText2 = new Sprite(4500,-250);
        enemyText2.collider = "none";
        enemyText2.text = "Aim At Enemy And Shoot It To Win";
        enemyText2.textSize = 75;
        enemyText2.color = 50;
        enemyText2.stroke = 50;

        startingEnemy = new Sprite(4900,100);
        startingEnemy.rotationLock = true;
        startingEnemy.collider = "dynamic";
        startingEnemy.width = 256/7;
        startingEnemy.height = 200;
        enemySpawned = true;
    }
    
    //enemy collision
    

}