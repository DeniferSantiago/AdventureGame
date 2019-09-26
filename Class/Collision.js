class Collision{
	/**
	 * @type {Mob} Mob que tuvo la Colision
	 */
	mob;
	/**
	 * @type {Entity} Entidad con la que a Colisionado
	 */
	entity;
	/**
	 * @type {String} Tipo de la Colision
	 * @description NONE - ENEMYCOLISION - COLLISION - COLLECT
	 */
	typeCollision;
	/**
	 * @type {Object} Objeto con datos de la Colision 
	 * @description Props: side:{String}
	 */
	infoCollision;
	/**
	 * *Crea un Objeto con datos de una Colision
	 * @param {Mob} mob Mob que tuvo la Colision
	 * @param {Entity} ent Entidad con la que a Colisionado
	 * @param {String} type Tipo de la Colision
	 * @param {Object} info Objeto con datos de la Colision
	 */
	constructor(mob, ent, type = "NONE", info = {}){
		if(mob instanceof Mob)
			this.mob = mob;
		else
			throw new Error("El parametro 'mob' no es una instancia de clase Mob ni de una clase derivada de esta.");
		if(ent instanceof Entity)
			this.entity = ent;
		else{
			throw new Error("El parametro 'ent' no es una instancia de la clase Entity ni de una clase derivada de esta.")
		}
		this.typeCollision = type;
		this.infoCollision = info;
	}
}