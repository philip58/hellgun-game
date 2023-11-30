//player variable(s)
let player;
let canDodge = true;

//floor variables(s)
let floor;

//set up function
function setup(){
    //set up canvas and world settings
    new Canvas(1920,1080);
    noStroke();
    rectMode(CENTER);
    world.gravity.y = 10;

    //initialize player
    player = new Sprite(0,0,256/4,512/4);
    player.collider = "dynamic";
    
    //initialize floor
    floor = new Sprite(600,400,2000,300);
    floor.collider = "static";

}

//draw function
function draw(){
    background(150);

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

}