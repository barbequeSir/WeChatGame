用法
scrollview组件的anchor 需要调整
目前仅支持top->bottom的滚动方式 需要的时候再扩展
top->bottom  anchor:(0.5,1)
bottom->top anchor:(0.5,0)
letf->right
right->left

    @property(SuperScrollView)
    Warpper:SuperScrollView=null;
    Data :any[] = [];
    
    let inst = this;
    let param = {bottom:0};// scrollview初始滚动到最下方  聊天用
    this.Warpper.Init(param,function(node,index){inst.OnItemRefresh(node,index);},function(){return inst.GetDataSet()});
    
    //scrollview 数据
    GetDataSet():Array<any>
    {
        return this.Data;
    }
    //scrollItem 初始化  刷新 方法
    OnItemRefresh(node:cc.Node,index:number)
    {        
        let comp = node.getComponent(UIRankItem);
        let data = this.Data[index];
        comp.Init(this.RankType,index,data);
    }
