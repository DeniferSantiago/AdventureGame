class Game{
	/**
	 * @type {Object} Contiene llaves con un array de funciones que escuchan los eventos que describen dichas llaves
	 */
	_triggers = {};
	/**
	 * @type {Number} Intervalo de tiempo en milisegundos del ciclo del juego
	 */
	interval = 0;
	/**
	 * @type {Array} Todas las entidades que hay dentro del juego
	 */
	entities = [];
	/**
	 * @type {CanvasRenderingContext2D} Contexto del Canvas del Juego
	 */
	context;
	/**
	 * @type {Number} Id del Intervalo que produce el ciclo del juego
	 */
	idInterval;
	/**
	 * @type {Array} Recursos del juego
	 * @description resource = {value:{File},url:{String},type:{String}}
	 */
	resources=[];
	/**
	 * *Crea el entorno del Juego
	 * @param {CanvasRenderingContext2D} ctx Contexto del Canvas del Juego
	 * @param {Number} interval Milisegundos de tiempo de cada ciclo del Juego
	 */
	constructor(ctx, interval){
		this.interval = interval;
		this.context = ctx;
	}
	/**
	 * *Agrega el recurso para luego ser cargado
	 * @param {String} url Url del recurso que se agregará
	 * @param {String} type Tipo del recurso que se agregará
	 */
	AddResource(url, type){
		if(this.resources.findIndex(v => v.url === url) === -1){
			this.resources.push({value:null, url, type});
		}
	}
	/**
	 * *Inicia el Juego
	 */
	async Start(){
		for (let index = 0; index < this.resources.length; index++) {
			const res = this.resources[index];
			res.value = await this.LoadResource(res.url, res.type);
		}
		this.idInterval = setInterval(() => this.Loop(this), this.interval);
		this.TriggerHandler("Start");
		return;
	}
	/**
	 * *Detiene el Juego
	 */
	Stop(){
		clearInterval(this.idInterval);
		this.TriggerHandler("Stop");
	}
	/**
	 * *Reinicia el Juego
	 */
	Restart(){
		this.idInterval = setInterval(() => this.Loop(this), this.interval);
		this.TriggerHandler("Restart");
	}
	/**
	 * *Funcion que controla el ciclo del Juego
	 * @param {Game} that Instancia del Juego
	 */
	Loop(that){//!this no existe en una funcion utilizada como intervalo por eso le pasamos el contexto como 'that'
		that.Clear();
		that.TriggerHandler("LoopStart");
		that.entities.forEach(obj => {
			that.TriggerHandler("IterateEntities",obj);
		});
		that.TriggerHandler("LoopEnd");
	}
	/**
	 * *Limpia el canvas
	 */
	Clear(){
		let ctx = this.context;
		ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);
		this.TriggerHandler("Clear");
	}
	/**
	 * *Agrega un listener a un evento
	 * @param {String} event Evento que se quiere escuchar
	 * @param {Function} callback Funcion que escuchara el evento
	 */
	On(event,callback) {
		if(!this._triggers[event])
			this._triggers[event] = [];
		this._triggers[event].push(callback);
	}
	/**
	 * *Elimina un listener de un evento
	 * @param {String} event Evento que se quiere dejar de escuchar
	 * @param {Function} callback Funcion que se quiere desvincular
	 */
	Off(event, callback){
		if(this._triggers[event])
			this._triggers[event] = this._triggers[event].filter(fn => fn !== callback);
	}
	/**
	 * *Emite un Evento (Solo uso Interno)
	 * @param {String} event Evento que se quiere emitir
	 * @param {...} params Parametros que se le envian a los listeners
	 */
	TriggerHandler(event,params) {
		if(this._triggers[event] ) {
			this._triggers[event].forEach(fn => fn(params));
		}
	}
	/**
	 * *Carga un recurso asincronamente
	 * @param {String} url Url del Recurso que se cargará
	 * @param {String} type Tipo del Archivo que se cargará
	 */
	async LoadResource(url, type){
		if(type === "IMAGE"){
			return new Promise( (resolve, reject) => {
				var image = new Image();
				image.src = url;
				image.onload = () => resolve(image);
				image.onerror = () => reject(new Error('could not load image'));
			});
		}
		else if(type === "JSON"){
			return new Promise( (resolve, reject) => {
				var resp = '';
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.onreadystatechange = function(){
					if(xmlhttp.status === 200 && xmlhttp.readyState === 4){
						resp = xmlhttp.response;
						resolve(JSON.parse(resp));
					}
				};
				xmlhttp.open("GET",url,true);
				xmlhttp.send();
			});
			
		}
	}
}