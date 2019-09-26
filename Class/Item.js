class Item extends Entity{
	/**
	 * @type {Image} Imagen del Item
	 */
	image;
	/**
	 * @type {String} Tipo del Item (En Mayusculas)
	 */
	type;
	/**
	 * @type {Number} Valor del item o cantidad que se sumara al colectarlo
	 */
	value;
	/**
	 * @type {Number} Posicion Y Inicial del Item
	 */
	inictY;
	/**
	 * @type {Number} Pixeles que se le sumara en cada animacion
	 */
	plus = 1;
	/**
	 * @type {Number} Contador para controlar cuando se dibujara el Item
	 */
	cont = 0;
	/**
	 * @type {Boolean} Establece si se ha recogido el Item o no
	 */
	collected = false;
	/**
	 * *Crea un nuevo Item
	 * @param {Number} iPosX Posicion X donde se dibujara el Item
	 * @param {Number} iPosY Posicion Y donde se dibujara el Item
	 * @param {CanvasRenderingContext2D} ctx	Contexto del canvas
	 * @param {Image} img Imagen del Item
	 * @param {String} type Tipo del Item
	 * @param {Number} value Valor del Item o Cantidad 
	 */
	constructor(iPosX, iPosY, ctx, img, type, value){
		super(iPosX, iPosY, ctx, img.width, img.height / 2);
		this.inictX = iPosX;
		this.inictY = iPosY;
		this.image = img;
		this.type = type;
		this.value = value;
	}
	/**
	 * *Ejecuta la animacion del Item
	 */
	Animate(){
		if(this.collected)
			return;
		if(this.cont === 2){
			this.cont = 0;
			if(this.posY + this.plus === this.inictY + 10 || this.posY + this.plus === this.inictY)
				this.plus = -this.plus;
			else if(this.posY < this.inictY + 10 || this.posY > this.inictY)
				this.context.drawImage(this.image,this.posX, this.posY += this.plus);
		}
		else
			this.cont++;
			this.context.drawImage(this.image,this.posX, this.posY);
	}
}