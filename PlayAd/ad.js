//banner广告
let wxBannerAd = null;
  let winSize = wx.getSystemInfoSync();
  
  window.wxPlayBannerAd = function(adUnitId)
  {
    if(!wxBannerAd)
    {
      wxBannerAd = wx.createBannerAd({
        adUnitId: adUnitId,
        style: {
            left: 0,
            top:  winSize.screenHeight * 0.87,
            width: winSize.windowWidth * 0.9,
        }
      });

      wxBannerAd.onResize(function() {
        if(wxBannerAd)
        {
          wxBannerAd.style.left = winSize.screenWidth / 2 - wxBannerAd.style.realWidth / 2 + 0.1;
          wxBannerAd.style.top = winSize.screenHeight - wxBannerAd.style.realHeight + 0.1;
        }
      })
    }
    wxBannerAd.show()
  }
  
  window.wxHideBannerAd = function()
  {
    if(wxBannerAd)
    {
      wxBannerAd.destroy();
      wxBannerAd = null;
    }
  }



//激励广告

let _videoErrorCallback;
let onVideoError = function(err)
{
    console.error('video ad error, code : ' + err.errCode + ', message : ' + err.errMsg);
    if(_videoErrorCallback)
    {
        _videoErrorCallback();
        _videoErrorCallback = null;
    }
}

let _videoCloseCallback;
let onVideoClose = function(obj)
{
    console.error('video ad close, obj ' + JSON.stringify(obj));
    if(_videoCloseCallback)
    {
        _videoCloseCallback(obj);
    }
}

let _videoLoadCallback;
let onVideoLoad = function(obj)
{
    console.error('video ad load, obj ' + JSON.stringify(obj));
    if(_videoLoadCallback)
    {
        _videoLoadCallback();
    }
}

let videoAd = null;
let getVideo = function(adUnitId)
{
    if(videoAd)
    {
        return wx.createRewardedVideoAd(  { adUnitId: adUnitId });
    }
    videoAd = wx.createRewardedVideoAd(  { adUnitId: adUnitId });
    videoAd.onError(onVideoError);
    videoAd.onClose(onVideoClose);
    videoAd.onLoad(onVideoLoad);
    return videoAd;
}



window.wxLoadAd = function (adUnitId, errorCallback, loadCallback) 
{
    let videoAd         = getVideo(adUnitId);
    _videoErrorCallback = errorCallback;
    _videoLoadCallback  = loadCallback;
    videoAd.load();
}

window.wxPlayAd = function (adUnitId, success, errorFunc) 
{
    console.log('watch ad ' + adUnitId);
    let videoAd = getVideo(adUnitId);
    _videoCloseCallback = success;
    _videoErrorCallback = errorFunc;

    videoAd.load()
    .then(() => videoAd.show())
    .catch(err => console.log('error code: ' + err.errCode + ", error message :" + err.errMsg));
}
