//player variable(s)
let player;

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
    floor = new Sprite(0,400,2000,300);
    floor.collider = "static";

}

//draw function
function draw(){
    background(150);

    //adjust camera to follow player
    camera.x = player.x;
    camera.y = player.y-250;

    //handling movement and jumping 
    if (kb.pressing('left')) {
        player.vel.x = -7;
    } else if (kb.pressing('right')) {
        player.vel.x = 7;
    } else if(player.colliding(floor) && kb.presses('up')){
        //jump only when touching floor
        player.moveTo(player.x,player.y-200,8);
    }
    else {
        player.vel.x = 0;
    }

}