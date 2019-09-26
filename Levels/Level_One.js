//icons and sprites
/*https://opengameart.org/content/2d-art-iconsitemsweapons */
let canvas = document.getElementById('game'); // Reciber los Valores de la interaciones que se producen en el canvas
let ctx = canvas.getContext('2d'); // se define los valores recibidos del Canvas en la variable, contexto 2D
canvas.width = 1008; // Dimension del ancho del Mapa
canvas.height = 600; // Dimension del alto del Mapa

var player;
var enemy;
var blocks = [];
var items = [];

let inictialPosX = 70; /* toma las coordenadas del plano  el punto de inicio*/
let inictialPosY = 60;

var game = new Game(ctx, 20);

let resources = [{url:"Sprites/sprite1.png",type:"IMAGE"},{url:"Sprites/bombi0.png",type:"IMAGE"},{url:"Sprites/Explosion.png",type:"IMAGE"},{url:"Items/apple.png",type:"IMAGE"},{url:"Sprites/sprite2.png",type:"IMAGE"},{url:"Sprites/sprite4.png",type:"IMAGE"},{url:"Sprites/sprite3.png",type:"IMAGE"},{url:"Sprites/bombi.png",type:"IMAGE"},{url:"Sprites/bombi3.png",type:"IMAGE"},{url:"Sprites/bombi2.png",type:"IMAGE"},{url:"ObjectsWord1.json",type:"JSON"}]; 
resources.forEach(r => {
	game.AddResource(r.url,r.type);
});

game.On("Start",() =>{
	player = new Player(inictialPosX, inictialPosY, ctx, game.resources.find(x => x.url === "Sprites/sprite1.png").value);
	player.Draw();
	player.SetImage(game.resources.find(x => x.url === "Sprites/sprite2.png").value, "LEFT");
	player.SetImage(game.resources.find(x => x.url === "Sprites/sprite3.png").value, "DOWN");
	player.SetImage(game.resources.find(x => x.url === "Sprites/sprite4.png").value, "UP");
	player.SetKeys(38,40,37,39,0,0);

	enemy = new Enemy(inictialPosX + 400, inictialPosY + 100, ctx, game.resources.find(x => x.url === "Sprites/bombi0.png").value, undefined, 20);
	enemy.fnAttack = attackEnemy;
	enemy.Draw();
	enemy.SetImage(game.resources.find(x => x.url === "Sprites/bombi.png").value, "LEFT");
	enemy.SetImage(game.resources.find(x => x.url === "Sprites/bombi2.png").value, "DOWN");
	enemy.SetImage(game.resources.find(x => x.url === "Sprites/bombi3.png").value, "UP");

	let imgItem = game.resources.find(x => x.url === "Items/apple.png").value;
	items.push(new Item(inictialPosX,inictialPosY,ctx, imgItem, "APPLE", 1));
	items.push(new Item(inictialPosX + 400, inictialPosY + 100,ctx, imgItem, "APPLE", 1));
	items.push(new Item(inictialPosX + 400, inictialPosY + 300,ctx, imgItem, "APPLE", 1));
	items.push(new Item(inictialPosX + 300, inictialPosY,ctx, imgItem, "APPLE", 1));
	items.push(new Item(inictialPosX + 500, inictialPosY,ctx, imgItem, "APPLE", 1));

	let objJson = game.resources.find(x => x.url === "ObjectsWord1.json").value;
	objJson.forEach(obj => blocks.push(new Block(obj.x, obj.y, ctx, obj.width, obj.height)));
	game.entities.push(...items,enemy,player,...blocks);
});
game.On("LoopStart", () => {
	items.forEach(x => x.Animate());
	player.Move();
	enemy.ChasePlayer(player);
});
game.On("IterateEntities", b => {
	let result = player.CheckCollision(b);
	if(result){
		player.Collision(result);
	}
	let result2 = enemy.CheckCollision(b);
	if(result2){
		enemy.Collision(result2);
	}
});
game.On("LoopEnd", () => {
	player.Draw();
	enemy.Draw();
});
game.Start();

const attackEnemy = (that, player, side) => {
	that.destroyed = true;
	let destroy = false;
	let interactions = 0;
	let delay = 0;
	let imgExplosion = game.resources.find(x => x.url === "Sprites/Explosion.png").value;
	let toggle = false;
	game.On("LoopEnd", function Attack () {//function para hacer Off luego
		if(that.inRange){
			if(delay < 20){
				if(toggle){
					that.context.beginPath();
					that.context.drawImage(that.image, that.posX, that.posY);
					that.context.closePath();
				}
				delay++;
				toggle = !toggle;
			}
		}
		else{
			if(!destroy){
				that.destroyed = false;
				game.Off("LoopEnd", Attack);
			}
		}
		if(delay === 20){
			if(interactions === 8){
				game.Off("LoopEnd", Attack);
				player.ReceiveHurt(that.CalculateHurtPoints(player, 30));
			}
			else{
				that.image = imgExplosion;
				that.context.beginPath();
				that.context.drawImage(that.image, that.posX, that.posY);
				that.context.closePath();
				destroy = true;
				interactions++;
			}
		}
	});
}