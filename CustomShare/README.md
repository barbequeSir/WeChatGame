微信小游戏 使用camera+ rendertexture 截屏 生成动态分享图

步骤：
1 cc.Node渲染到cc.RenderTexture
2 cc.RenderTexture 渲染到离屏canvas里
3 使用canvas.toTempFilePath 生成临时文件
4 通过wx.shareAppMessage({imageUrl:imageurl,res.tempFilePath}) 分享

目前有个问题 有透明重叠的地方  颜色会显示异常  估计是在第二步的过程中 出现问题  待解决
