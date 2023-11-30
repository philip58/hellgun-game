//player variable(s)
let player;
let canDodge = true;
let arm;
//floor variables(s)
let floor;

//animation variables
let idleAni;
let walkAni;



//set up function
function setup(){
    //set up canvas and world settings
    new Canvas(1920,1080);
    noStroke();
    rectMode(CENTER);
    world.gravity.y = 10;

    //initialize player
    player = new Sprite(0,0,256/7,200); //hitbox?
    player.collider = "dynamic";   
    
    
    //player arm
    arm = new Sprite(player.x,player.y,20,20);
    arm.collider ="none";
    arm.img = 'assets/arm.png';
    //player animations    
    player.addAni('idle', 'assets/idle.png',{frameSize: [256,256], frames: 30});
    player.addAni('walkForward', 'assets/walkForward.png',{frameSize: [256,256], frames: 30});

    //initialize floor
    floor = new Sprite(600,400,2000,300);
    floor.collider = "static";

}

//draw function
function draw(){
    clear();
    background(150);

//player hitbox debug (shows hitbox on LMB click)
player.debug = mouse.pressing();
arm.debug = mouse.pressing();

//Player Arm

arm.x = player.x + 12;
arm.y = player.y - 17;

    //adjust camera to follow player
    camera.x = player.x+600;
    camera.y = player.y-250;

    player.rotation = 0;

    //handling jumping 
    if(player.colliding(floor) && kb.pressing('up')){
        //jump only when touching floor
        player.moveTo(player.x,player.y-200,8);
    }

    //handling movement
    if (kb.pressing('left')) {
        player.vel.x = -7;
    } else if (kb.pressing('right')) {
        player.vel.x = 7; 
    } else {
        player.vel.x = 0;
    } 

    //dodge left and right mechanic
    if(canDodge && kb.presses('down') ) {
        if(kb.pressing('left')){
            player.x = player.x - 300;
            console.log("dodge left");
            canDodge = false;
            setTimeout(() => {
                canDodge = true;
            }, 1000);
        }
        if(kb.pressing('right')){
            player.x = player.x + 300;
            console.log("dodge right");
            canDodge = false;
            setTimeout(() => {
                canDodge = true;
            }, 1000);
        }

    }  


    //aiming
    //flipping player model based on mouse orientation
    if (mouse.x > player.x){
        player.mirror.x = false;
    } else if (mouse.x < player.x)
    player.mirror.x = true;

    //animations
    player.anis.offset.y=-29;
    player.anis.offset.x=10;


    if (kb.pressing('left')) {
		player.changeAni('walkForward');
	} else if (kb.pressing('right')) {
		player.changeAni('walkForward');
	} else {
                //play idle animation if movement stops
		player.changeAni('idle');
	}

}