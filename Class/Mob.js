class Mob extends Entity{
	/**
	 * @type {Image} Imagen actual del Mob
	 */
	image;
	/**
	 * @type {Image} Imagen que mira a la Izquierda del Mob
	 */
	imageLeft;
	/**
	 * @type {Image} Imagen que mira a la Derecha del Mob
	 */
	imageRight;
	/**
	 * @type {Image} Imagen que mira hacia Arriba del Mob
	 */
	imageUp;
	/**
	 * @type {Image} Imagen que mira hacia Abajo del Mob
	 */
	imageDown;
	/**
	 * @type {Boolean} Establece si estan todas las Imagen del Mob
	 */
	areAllImage = false;
	/**
	 * @type {Boolean} Establece si NO se debe cambiar de Imagen al moverse
	 */
	noChangeImage = false;
	/**
	 * @type {Number} Velocidad de movimiento del Mob
	 */
	speed = 3;
	/**
	 * @type {Number} Pixeles en el eje X que sumaran al dibujar el Mob
	 */
	plusX = 0;
	/**
	 * @type {Number} Pixeles en el eje Y que sumaran al dibujar el Mob
	 */
	plusY = 0;
	/**
	 * @type {Boolean} Establece si el Mob esta Destruido
	 */
	destroyed = false;
	/**
	 * @type {Number} Puntos de vida del Mob
	 */
	lifePoints;
	/**
	 * *Crea un nuevo Mob
	 * @param {Number} iPosX Posicion X en el canvas donde se Dibujara el Mob
	 * @param {Number} iPosY Posicion Y en el canvas donde se Dibujara el Mob
	 * @param {CanvasRenderingContext2D} ctx Contexto del canvas
	 * @param {Image} img Imagen inicial del Mob
	 * @param {Number} lifePoint Puntos de vida del Mob 
	 */
    constructor(iPosX = 0, iPosY = 0, ctx, img, lifePoint = 100){
		super(iPosX, iPosY, ctx, Math.round(img.width / 2), Math.round(img.height / 2));
		this.imageRight = img;
		this.image = img;
		this.lifePoints = lifePoint;
	}
	/**
	 * 
	 * @param {Image} img Imagen que se quiere establecer
	 * @param {String} pos Posicion en que se establecera la Imagen
	 * @description pos = UP - DOWN - LEFT - RIGHT 
	 */
	SetImage(img = new Image(), pos = ""){
		if(!(img instanceof Image))
			throw Error("Debe pasar una imagen cargada");
		if(pos === "LEFT")
			this.imageLeft = img;
		else if(pos === "RIGHT")
			this.imageRight = img;
		else if(pos === "UP")
			this.imageUp = img;
		else if(pos === "DOWN")
			this.imageDown = img;
		else
			throw Error("Debe especificar el tipo");
		if(this.imageLeft instanceof Image && this.imageRight instanceof Image 
			&& this.imageDown instanceof Image && this.imageUp instanceof Image)
			this.areAllImage = true;
	}
	/**
	 * *Dibuja este objeto Mob
	 */
    Draw(){
		if(this.destroyed)
			return;
		if(this.plusY !== 0 || this.plusX !== 0){
			let canvasWidth = this.context.canvas.width;
			let canvasHeight = this.context.canvas.height;
			if((this.posX + this.plusX + this.image.width) > canvasWidth)
				this.plusX = canvasWidth - (this.posX + this.image.width);
			else if((this.posX + this.plusX) < 0)
				this.plusX = -this.posX;
			else if((this.posY + this.plusY + this.image.height) > canvasHeight)
				this.plusY = canvasHeight - (this.posY + this.image.height);
			else if((this.posY + this.plusY) < 0)
				this.plusY = -this.posY;
			if(!this.noChangeImage){
				if(this.areAllImage){
					if(this.plusY > 0)
						this.image = this.imageDown;
					else if(this.plusY < 0)
						this.image = this.imageUp;
					else if(this.plusX > 0)
						this.image = this.imageRight;
					else if(this.plusX < 0)
						this.image = this.imageLeft;
				}
			}
			else
				this.noChangeImage = false;
		}
		this.width = Math.round(this.image.width / 2);
		this.height = Math.round(this.image.height / 2);
		this.context.beginPath();
		this.context.drawImage(this.image, this.posX += this.plusX, this.posY += this.plusY);
		this.context.closePath();
		this.plusX = 0;
		this.plusY = 0;
	}
	/**
	 * *Revisa si hay una Colision
	 * @param {Entity} entity Entidad con la que se comprobara si hay Colision
	 */
	CheckCollision(entity){
		let moveX = this.posX + this.plusX;
		let moveY = this.posY + this.plusY;
		let centroX = this.height;
		let centroY = this.width;
		let totalX = moveX + centroX;
		let totalY = moveY + centroY;
		let limitY = entity.posY + entity.height;
		let limitX = entity.posX + entity.width;
		if(this.plusX !== 0){
			if(totalX > entity.posX && totalX < limitX && ((totalY > entity.posY && totalY < limitY) || (moveY < limitY && moveY > entity.posY))){
				let info = {side:"RIGHT"}
				if(entity instanceof Block){
					this.plusX = entity.posX - (totalX - this.plusX);//colision al moverse a la derecha
					this.noChangeImage = true;
					return new Collision(this, entity, "COLLISION", info);
				}
				else if(entity instanceof Item && !entity.collected){
					if(this instanceof Player)
						return new Collision(this, entity, "COLLECT", info);
					else
						return new Collision(this, entity, "NONE", info);
				}
				else if(entity instanceof Enemy && this instanceof Player || entity instanceof Player && this instanceof Enemy){
					return new Collision(this, entity, "ENEMYCOLLISION", info);
				}
				return false;
			}
			else if(moveX < limitX && moveX > entity.posX && ((totalY > entity.posY && totalY < limitY) || (moveY < limitY && moveY > entity.posY))){
				let info = {side:"LEFT"}
				if(entity instanceof Block){
					this.plusX = limitX - (moveX - this.plusX);//colision al moverse a la izquierda
					this.noChangeImage = true;
					return new Collision(this, entity, "COLLISION", info);
				}
				else if(entity instanceof Item && !entity.collected){
					if(this instanceof Player)
						return new Collision(this, entity, "COLLECT", info);
					else
						return new Collision(this, entity, "NONE", info);
				}
				else if(entity instanceof Enemy && this instanceof Player || entity instanceof Player && this instanceof Enemy){
					return new Collision(this, entity, "ENEMYCOLLISION", info);
				}
				return false;
			}
		}
		else if(this.plusY !== 0){
			if(totalY > entity.posY && totalY < limitY && ((totalX > entity.posX && totalX < limitX) || (moveX < limitX && moveX > entity.posX))){
				let info = {side:"DOWN"}
				if(entity instanceof Block){
					this.plusY = entity.posY - (totalY - this.plusY);//colision al moverse hacia abajo
					this.noChangeImage = true;
					return new Collision(this, entity, "COLLISION", info);
				}
				else if(entity instanceof Item && !entity.collected){
					if(this instanceof Player)
						return new Collision(this, entity, "COLLECT", info);
					else
						return new Collision(this, entity, "NONE", info);
				}
				else if(entity instanceof Enemy && this instanceof Player || entity instanceof Player && this instanceof Enemy){
					return new Collision(this, entity, "ENEMYCOLLISION", info);
				}
				return false;
			}
			else if(moveY < limitY && moveY > entity.posY && ((totalX > entity.posX && totalX < limitX) || (moveX < limitX && moveX > entity.posX))){
				let info = {side:"UP"}
				if(entity instanceof Block){
					this.plusY = limitY - (moveY - this.plusY);//colision al moverse hacia arriba
					this.noChangeImage = true;
					return new Collision(this, entity, "COLLISION", info);
				}
				else if(entity instanceof Item && !entity.collected){
					if(this instanceof Player)
						return new Collision(this, entity, "COLLECT", info);
					else
						return new Collision(this, entity, "NONE", info);
				}
				else if(entity instanceof Enemy && this instanceof Player || entity instanceof Player && this instanceof Enemy){
					return new Collision(this, entity, "ENEMYCOLLISION", info);
				}
				return false;
			}
		}
		return false;
	}
}