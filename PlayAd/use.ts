//banner广告

public PlayBanner(adUnitId : string)
{
    if(window['wxPlayBannerAd'])
    {
        window['wxPlayBannerAd'](adUnitId);
    }
}

public HideBanner()
{
    if(window['wxHideBannerAd'])
    {
        window['wxHideBannerAd']();
    }
}

//激励广告
public LoadAd(adUnitId : string, errFunc : Function, loadFunc : Function) : boolean
{
    if(window['wxLoadAd'])
    {
        return window['wxLoadAd'](adUnitId, errFunc, loadFunc) ? true : false;
    }
    return false;
}

public PlayAd(adUnitId : string, callback : Function, errorFunc : Function)
{
    if(window['wxPlayAd'])
    {
        window['wxPlayAd'](adUnitId, function(res)
        {
            if(res && res.isEnded || res === undefined)
            {
                callback();
            }
        }, errorFunc)
    }
    else
    {
        callback()
    }
}

//广告id  :如 adunit-492494518f729e3e
public WatchAD(aduuid : string)
{
    let errFunc = function(err)
    {
        cc.error(err.errMsg);
        let ext = WXInterface.getInstance().GetCommonBIExt();
        ext['error'] = err.errMsg;
        WX_Interface.SendBIByExt("WatchADVideoError",1100,ext);
    }
    let callback = function(res)
    {
        //广告播放完成
        if(res && res.isEnded || res === undefined)
        {
            
        }
    }
    this.PlayAd(aduuid, callback, errFunc);
}
   
