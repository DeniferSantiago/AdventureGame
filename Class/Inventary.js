class Inventary extends Item{
	/**
	 * @type {Number} Cantidad de items que se ha colectado
	 */
	cant;
	/**
	 * *Crea un inventario para un item
	 * @param {Item} item Item que se colectara
	 * @param {Number} cant Cantidad de Items que se colecto
	 */
	constructor(item, cant = 1){
		super(item.posX, item.posY, item.context, item.image, item.type, item.value);
		this.cant = cant;
	}
}