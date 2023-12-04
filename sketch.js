//player variable(s)
let player;
let canDodge = true;
let arm;

//floor variables(s)
let floor;


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
//Player stats (HP, roll speed, current gun, etc.)
let playerSpeed = 7;
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
    floor = new Sprite(600,400,2000,300);
    floor.collider = "static";
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
        //check for projectile collisions 
        for(let i = 0; i < projectiles.length; i++){
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

}