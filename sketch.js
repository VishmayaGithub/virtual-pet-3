//Create variables here
var dog,database,foodStock,foodS,fedTime,lastFed,foodObj,changeState,readState
var garden,bathroom,bedroom
function preload()
{
  //load images here
  dogimage = loadImage("virtual pet images/dogImg1.png")
  dha = loadImage("virtual pet images/dogImg.png")
  garden = loadImage("virtual pet images/Garden.png")
  bedroom = loadImage("virtual pet images/Bed Room.png")
  bathroom = loadImage("virtual pet images/Wash Room.png")
  died = loadImage("virtual pet images/deadDog.png")
}

function setup() {
  createCanvas(500, 500);
  database = firebase.database()
 
  foodStock = database.ref("Food")
  foodStock.on("value",readStock)

 

  dog = createSprite(450,250,20,20)
  dog.shapeColor = "red"
  dog.addImage("im",dha)
  dog.scale = 0.2
  foodObj = new Food()
  feed = createButton("feed Rowan")
  feed.position(450,95)
  feed.mousePressed(feedDog)

  addFood = createButton("add more food")
  addFood.position(350,95)
  addFood.mousePressed(addFoods)
 

}


function draw() {
  background(46,139,87);
 // foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  readState = database.ref("GameState")
  readState.on("value",function(data){
   GameState = data.val()
  })
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   currentTime= hour()
   if(currentTime==(lastFed+1)){
     if(foodS<6&& foodS<=10){
     update("Playing")
     foodObj.garden()
     feed.hide()
     addFood.hide()
     dog.visible = false
     t = createElemnt('h2')
     t.position(550,400)
     t.html("Rowan is Playing")
     }
   }else if(currentTime==(lastFed+2)){
     update("Sleeping")
     foodObj.bedroom()
     feed.hide()
     addFood.hide()
     dog.visible = false
     t = createElemnt('h2')
     t.position(550,400)
     t.html("Rowan is sleeping")

   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
     update("Bathing")
     foodObj.bathroom()
     feed.hide()
     addFood.hide()
     dog.visible = false
     s = createElemnt('h2')
     s.position(550,400)
     s.html("Rowan is bathing")
   }else{
    update("Hungry")
   foodObj.display()
  
  feed.show()
  addFood.show()
 
   dog.addImage(dha)
  }
  if(currentTime>(lastFed+3)&& currentTime<=(lastFed+6)){
    update("Died")
    foodObj.died()
    dog.visible = false
    feed.hide()
     addFood.hide()
  }
  
  drawSprites();
 
 

  
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.x = 330
dog.addImage(dogimage)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
} 

//function to add food in stock
function addFoods(){
  foodS++;
  
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    GameState:state
  })

}