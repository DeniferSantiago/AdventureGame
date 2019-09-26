class Entity{
    posX;
	posY;
	width;
	height;
	context;
	/**
	 * @param {Number} iPosX Posicion X en que se dibujara la entidad
	 * @param {Number} iPosY Posicion Y en que se dibujara la entidad
	 * @param {CanvasRenderingContext2D} ctx Contexto del canvas
	 * @param {Number} wdt Ancho de la entidad
	 * @param {Number} hgt Alto de la entidad
	 */
    constructor(iPosX, iPosY, ctx, wdt, hgt){
        this.posX = iPosX;
        this.posY = iPosY;
		this.context = ctx;
		this.width = wdt;
		this.height = hgt;
	}
}