class Enemy extends Mob{
	/**
	 * @type {Function} Funcion que ejecuta el ataque de la entidad
	 */
	fnAttack;
	/**
	 * @type {Number} Distancia en pixeles en que ataca el enemigo 
	 */
	attackDistance;
	/**
	 * @type {Boolean} Establece si un jugador esta en el rango de ataque
	 */
	inRange = false;
	/**
	 * @type {Number} Puntos de ataque del enemigo
	 */
	pointsAttack = 100;
	/**
	 * @description RIGHT - LEFT - TOP - DOWN
	 * @type {String} Establece en que lado esta el jugador
	 */
	sidePlayer = "";
	/**
	* *Crea un nuevo enemigo
	* @param {Number} iPosX	Posicion X en que se dibujara el Enemigo
	* @param {Number} iPosY	Posicion Y en que se dibujara el Enemigo
	* @param {CanvasRenderingContext2D} ctx	Contexto del canvas
	* @param {Image} img Imagen inicial del Enemigo
	* @param {Number} speed	Velocidad de movimiento del Enemigo
	* @param {Number} attDis Distancia de Ataque del Enemigo
	*/
	constructor(iPosX = 0, iPosY = 0, ctx, img, speed = 2, attDis = 10){
		super(iPosX, iPosY,ctx, img, 100);
		this.speed = speed;
		this.attackDistance = attDis;
	}
	/**
	* *Ejecuta una accion dada un tipo de Colision 
	* @param {Collision} objCollision Datos de la Colision
	*/
	Collision(objCollision){
		if(this.destroyed) return;
		switch (objCollision.typeCollision) {
			case "ENEMYCOLLISION":
				/*if(typeof this.fnAttack === 'function')
					this.fnAttack(this, objCollision.entity, objCollision.infoCollision.side);*/
				break;
			default:
				return;
		}
	}
	/**
 	* *Sigue a un Jugador
	* @param {Player} player Jugador que seguira este Enemigo
	*/
	ChasePlayer(player) {
		let totalX = this.posX + this.width;
		let totalY = this.posY + this.height;
		let attackY = totalY + this.attackDistance;
		let attackX = totalX + this.attackDistance;
		let leesX = this.posX - this.attackDistance;
		let leesY = this.posY - this.attackDistance;
		let limitY = player.posY + player.height;
		let limitX = player.posX + player.width;
		if(this.posY < limitY && this.posY > player.posY)
		{
			if(this.posX > player.posX)
				this.plusX = -this.speed;
			else
				this.plusX = this.speed;
		}
		else if(this.posY < player.posY && totalY > player.posY)
		{
			if(this.posX > player.posX)
				this.plusX = -this.speed;
			else
				this.plusX = this.speed;
		}
		else if(this.posX < limitX && this.posX > player.posX)
		{
			if(this.posY < player.posY)
				this.plusY = this.speed;
			else
				this.plusY = -this.speed;
		}
		else if(this.posX < player.posX && totalX > player.posX)
		{
			if(this.posY < player.posY)
				this.plusY = this.speed;
			else
				this.plusY = -this.speed;
		}
		if(this.plusX !== 0){
			if(attackX > player.posX && totalX < limitX && ((totalY > player.posY && totalY < limitY) || (this.posY < limitY && this.posY > player.posY))){
				this.inRange = true;
				this.sidePlayer = "RIGHT";
				if(typeof this.fnAttack === 'function' && !this.destroyed)
					this.fnAttack(this, player, this.sidePlayer);
			}
			else if(leesX < limitX && this.posX > player.posX && ((totalY > player.posY && totalY < limitY) || (this.posY < limitY && this.posY > player.posY))){
				this.inRange = true;
				this.sidePlayer = "LEFT";
				if(typeof this.fnAttack === 'function' && !this.destroyed)
					this.fnAttack(this, player, this.sidePlayer);
			}
			else{
				this.inRange = false;
				this.sidePlayer = "";
			}
		}
		else if(this.plusY !== 0){
			if(attackY > player.posY && totalY < limitY && ((totalX > player.posX && totalX < limitX) || (this.posX < limitX && this.posX > player.posX))){
				this.inRange = true;
				this.sidePlayer = "DOWN";
				if(typeof this.fnAttack === 'function' && !this.destroyed)
					this.fnAttack(this, player, this.sidePlayer);
			}
			else if(leesY < limitY && this.posY > player.posY && ((totalX > player.posX && totalX < limitX) || (this.posX < limitX && this.posX > player.posX))){
				this.inRange = true;
				this.sidePlayer = "UP";
				if(typeof this.fnAttack === 'function' && !this.destroyed)
					this.fnAttack(this, player, this.sidePlayer);
			}
			else{
				this.inRange = false;
				this.sidePlayer = "";
			}
		}
		else{
			let difX = player.posX - this.posX;
			let difY = player.posY - this.posY;
			if(difX < 50 && difX > -50 && difY < 50 && difY > -50){
				if(Math.abs(difY) > Math.abs(difX)){
					this.plusY = difY > 0? this.speed : -this.speed;
				}
				else{
					this.plusX = difX > 0? this.speed : -this.speed;
				}
				
			}
			this.inRange = false;
			this.sidePlayer = "";
		}
		return;
	}
	/**
	 * *Calcula los puntos de daño segun la distancia del ataque
	 * @param {Mob} otherMob
	 * @param {Number} minAttack
	 */
	CalculateHurtPoints(otherMob, minAttack = 0){
		var distance = 0;
		switch (this.sidePlayer) {
			case "UP":{
				distance = this.posY - (otherMob.posY + otherMob.height);
				distance = distance < 0? (this.posY - otherMob.posY) : distance;
				break;
			}
			case "DOWN":{
				distance = otherMob.posY  -  (this.posY + this.height);
				distance = distance < 0? (otherMob.posY - this.posY) : distance;
				break;
			}
			case "RIGHT":{
				distance = otherMob.posX - (this.posX + this.width);
				distance = distance < 0? (otherMob.posX - this.posX) : distance;
				break;
			}
			case "LEFT":{
				distance = this.posX - (otherMob.posX + otherMob.width);
				distance = distance < 0? (this.posX - otherMob.posX) : distance;
				break;
			}
		}
		distance = distance === 0 || distance < 0? 1 : distance;
		let attack = this.pointsAttack - minAttack;
		let lessPoints = (attack /100)*(distance * 100 / this.attackDistance);
		let hurtPoints = this.pointsAttack - lessPoints;
		if(hurtPoints >= 100 || hurtPoints < 0){
			debugger;
		}
		return hurtPoints;
	}
}