class Player extends Mob{
	/**
	 * @type {Array} Inventarios de Items colectados
	 */
	inventary=[];
	keyUp;
	keyDown;
	keyLeft;
	keyRight;
	keyAttack;
	keyUtility;
	keyDownListener;
	keyUpListener;
	direction = "";
	/**
	 * *Crea un nuevo Jugador
	 * @param {Number} iPosX Posicion X del Jugador
	 * @param {Number} iPosY Posicion Y del Jugador
	 * @param {CanvasRenderingContext2D} ctx Contexto del Canvas
	 * @param {Image} img Imagen inicial del Jugador
	 */
    constructor(iPosX = 0, iPosY = 0, ctx = new CanvasRenderingContext2D(), img = new Image()){
		super(iPosX, iPosY, ctx, img, 100);
	}
	/**
	 * *Colecta un item y lo guarda en el Inventario Correspondiente
	 * @param {Item} item Item que se Colectara 
	 */
	CollectItem(item){
		if(item instanceof Item){
			item.collected = true;
			let itemInInventary = this.inventary.find(x => x.type === item.type);
			if(itemInInventary instanceof Inventary)
				itemInInventary.cant++;
			else
				this.inventary.push(new Inventary(item, 1));
		}
		else
			throw new Error("El parametro 'item' debe ser una instancia de la clase Item o alguna derivada de esta.");
	}
	/**
	 * *Ejecuta una Accion segun la colision dada
	 * @param {Collision} objCollision Datos de la Colision
	 */
	Collision(objCollision){
		switch (objCollision.typeCollision) {
			case "COLLECT":
				this.CollectItem(objCollision.entity);
				break;
			default:
				return;
		}
	}
	/**
	 * *Recibe un daño y le resta la vida correspondiente
	 * @param {Number} hurtPoints Puntos de daño que recibio el Jugador
	 */
	ReceiveHurt(hurtPoints){
		this.lifePoints -= hurtPoints;
		if(this.lifePoints <= 0)
			this.destroyed = true;
		let lifeBar = document.getElementById("lifebar");
		lifeBar.style.width = this.lifePoints + "%";
	}
	ActivateKeys(){
		if(this.keyDownListener){
			document.removeEventListener('keydown', this.keyDownListener);
			document.removeEventListener('keyup', this.keyUpListener);
			this.keyDownListener = null;
			this.keyUpListener = null;
		}
		this.keyUpListener = e =>{
			switch(e.keyCode)
			{	
				case this.keyUp:
					this.direction = this.direction === "UP"? "":this.direction;
					break;
				case this.keyLeft: 
					this.direction = this.direction === "LEFT"? "":this.direction;
					break;
				case this.keyRight:
					this.direction = this.direction === "RIGHT"? "":this.direction;
					break;
				case this.keyDown:
					this.direction = this.direction === "DOWN"? "":this.direction;
					break;
			}
		}
		this.keyDownListener = e =>{
			switch(e.keyCode)
			{	
				case this.keyUp:
					this.direction = "UP";
					break;
				case this.keyLeft:
					this.direction = "LEFT";
					break;
				case this.keyRight:
					this.direction = "RIGHT";
					break;
				case this.keyDown:
					this.direction = "DOWN";
					break;
			}
		}
		document.addEventListener('keydown', this.keyDownListener);
		document.addEventListener('keyup', this.keyUpListener);
	}
	Move(){
		switch (this.direction) {
			case "UP":
				this.plusY = -this.speed;
				break;
			case "LEFT":
				this.plusX = -this.speed;
				break;
			case "RIGHT":
				this.plusX = this.speed;
				break;
			case "DOWN":
				this.plusY = this.speed;
				break;
			default:
				break;
		}
	}
	SetKeys(up, down, left, right, attack, utility){
		this.keyUp = up;
		this.keyDown = down;
		this.keyLeft = left;
		this.keyRight = right;
		this.keyAttack = attack;
		this.keyUtility = utility;
		this.ActivateKeys();
	}
}