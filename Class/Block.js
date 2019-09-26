class Block extends Entity{
	/**
	 * *Crea un bloque Invisible que funciona como limites del mapa
	 * @param {Number} iPosX Posicion X en que se dibujara el Bloque
	 * @param {Number} iPosY Posicion Y en que se dibujara el Bloque
	 * @param {CanvasRenderingContext2D} ctx Contexto del canvas
	 * @param {Number} wdt Ancho del Bloque
	 * @param {Number} hgt Alto del Bloque
	 */
    constructor(iPosX, iPosY, ctx, wdt, hgt){
        super(iPosX, iPosY, ctx, wdt, hgt);
	}
	/**
	 * *Dibuja el Bloque actual (solo para pruebas)
	 */
    Draw(){
		this.context.beginPath();
		this.context.fillRect(this.posX, this.posY, this.width, this.height);
		this.context.closePath();
    }
}