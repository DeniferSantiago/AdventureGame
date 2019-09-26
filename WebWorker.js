var i = 0;

function timedCount() {
  i = i + 1;
  postMessage({type:"Number", value: i});
  setTimeout(timedCount,500);
}
onmessage = ({data}) => {
    if(data.type === "Collision"){
        ComprobarColision(data);
    }
};
function ComprobarColision(data) {
    const {player, blocks, plusX, plusY} = data;
    blocks.forEach(b => {
        let moveX = player.posX + plusX;
        let moveY = player.posY + plusY;
        let centroX = player.image.width / 2;
        let centroY = player.image.height / 2;
        let limitY = b.posY + b.height;
        let limitX = b.posX + b.width;
        if((moveX + centroX > b.posX && moveX < limitX) && 
            (player.posY + centroY > b.posY && player.posY < limitY)){
            if(player.posX + centroX <= b.posX)
                plusX = b.posX - (player.posX + centroX);
            else if(player.posX >= limitX)
                plusX = player.posX - limitX;
        }
        else if((moveY + centroY > b.posY && moveY < limitY) && 
            (player.posX + centroX > b.posX && player.posX < limitX)){
            if(player.posY + centroY <= b.posY)
                plusY = b.posY - (player.posY + centroY);
            else if(player.posY >= limitY)
                plusY = player.posY - limitY;
        }
    });
    postMessage({type:"Draw", value: data});
}
timedCount();