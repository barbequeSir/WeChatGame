//fromNode:cc.Node 需要渲染到RenderTexture Node
public static RenderNodeToRT(fromNode:cc.Node)
{      
    let renderTexture = new cc.RenderTexture();        
    let winSize = cc.view.getVisibleSize();        
    //camera.cullingMask = 0xffffffff;
    //let gl = cc.game._renderContext; 
    renderTexture.initWithSize(winSize.width,winSize.height); 
    let camera = fromNode.addComponent(cc.Camera);
    camera.targetTexture = renderTexture;
    camera.render(fromNode);        
    camera.targetTexture =null;
    fromNode.removeComponent(cc.Camera);
    return renderTexture;            
}

//
//texture:cc.RenderTexture
//startY:截屏Y起始位置
//endY
public static CustomShare(texture,startY,endY)
{ 
    console.log("1:"+startY+" "+ endY);

    //@ts-ignore
    if(window.wx)     
    {
        var width = texture.width;
        var height = texture.height;
        //@ts-ignore
        var customCanvas = wx.createCanvas();//创建canvas  并将texture渲染到canvas里面
        var ctx = customCanvas.getContext('2d');  
        customCanvas.width = width;
        customCanvas.height = height;  

        let data = texture.readPixels();

        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow*width*4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start+i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        customCanvas.toTempFilePath({
        x: 0,
        y: startY,
        width: Math.floor((endY - startY)*1.25) ,
        height: endY - startY,
        destWidth: 500,
        destHeight: 400,
        success: (res) => {                
                console.log("save to temp file:"+JSON.stringify(res));
                GameEngine.instance.gameFight.wxShareShadowFight(res.tempFilePath);
            },
        fail:(res)=>{
                console.error("save to temp file failed:"+JSON.stringify(res));
            },
        complete:(res)=>{
                console.error("save to temp file complete:"+JSON.stringify(res));
            }
        });
    }
}
