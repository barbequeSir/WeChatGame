
//无限滚动的scrollview
const {ccclass, property} = cc._decorator;

@ccclass
export default class SuperScrollView extends cc.Component 
{   
    @property(cc.Node)
    ItemContainer:cc.Node = null;

    @property(cc.Prefab)
    ItemPrefab:cc.Prefab = null;

    @property()
    InitItemPosY:number = -60;

    @property(cc.ScrollView)
    ScrollView:cc.ScrollView = null;

    DisabledMap:Array<cc.Node> = [] ;
    EnabledMap:Array<cc.Node> = []
    public get DataSet()
    { 
        if(this.GetDataSet!=null)
        {
            return this.GetDataSet();            
        }
        return [];
    };
    
    StartIndex = 0;
    EndIndex = 0;

    VisibleCount = 0;
    InitialCount = 0;

    ItemClone:cc.Node = null;
    ItemHeight:number ;
    public OnItemRefresh:Function = null;
    public GetDataSet:Function = null;

    LastY ;
    
    MaskYMax;
    MaskYMin;
    MaskHeight

    Param = null;
    onLoad()
    {   
        let viewNode=    this.node.parent;
        this.MaskHeight = viewNode.getContentSize().height;        
        this.ItemContainer.position =cc.Vec2.ZERO;
        this.ItemClone = cc.instantiate(this.ItemPrefab);
        this.ItemHeight = this.ItemClone.height;
        this.VisibleCount = Math.ceil(this.MaskHeight/this.ItemHeight)
        this.InitialCount =this.VisibleCount+3;
        this.ItemClone.active = false;
        this.ItemClone.parent = this.ItemContainer;

        for(let i = 1;i<this.InitialCount;i++)
        {
            let clone = cc.instantiate(this.ItemClone);
            clone.parent = this.ItemContainer;            
        }

    }

    ResizeViewContent()
    {
        let viewNode=    this.node.parent; 
        this.MaskHeight = viewNode.getContentSize().height; 
        this.VisibleCount = Math.ceil(this.MaskHeight/this.ItemHeight)
        this.InitialCount =this.VisibleCount+3;
    }

    StopAutoScroll()
    {
        if(this.ScrollView!=null)
        {
            this.ScrollView.stopAutoScroll();
        }
    }


    Init(param,func,getDataSet)
    {    
        this.StopAutoScroll();

        let viewNode=    this.node.parent;
        this.MaskYMax = viewNode.convertToWorldSpace(new cc.Vec2(0,this.MaskHeight)).y;        
        this.MaskYMin = viewNode.convertToWorldSpace(new  cc.Vec2(0,0)).y;

        this.Param = param;
        this.OnItemRefresh = func;
        this.GetDataSet = getDataSet;
        
        this.EnabledMap = [];
        for(let i = 0;i<this.ItemContainer.childrenCount;i++)
        {
            this.ItemContainer.children[i].active = false;
            this.DisabledMap.push(this.ItemContainer.children[i]);
        }

        if(param.bottom == null ||param.bottom == 0)
        {
            this.SetIndex(0);
        }
        else
        {
            this.SetIndex(this.DataSet.length-1);
        }
        
        this.RefreshAllItems();     
    }

    update()
    {
        let y = this.ItemContainer.position.y;
        if(y!=this.LastY &&  this.EnabledMap.length!=0)
        {
            this.LastY = y;
            //let target = scrollview.scrollEvents[0].target.getComponent(SuperScrollView);
            let target = this;
            let startNode = target.EnabledMap[0];
            let endNode = target.EnabledMap[target.EnabledMap.length -1];

            let startRect = target.EnabledMap[1].getBoundingBoxToWorld();
            let endRect =  target.EnabledMap[target.EnabledMap.length -2].getBoundingBoxToWorld();       
    //top to bottom
            if(startRect.yMax<target.MaskYMax)
            {
                if(target.StartIndex == 0)
                {
                    return;
                }
                //down   
                target.EndIndex --;
                target.StartIndex --;
                endNode.position = cc.pAdd(startNode.position,new cc.Vec2(0,this.ItemHeight));
                let node = target.EnabledMap.pop();
                target.EnabledMap.unshift(node);           
                if(this.OnItemRefresh!=null)
                {
                    this.OnItemRefresh(node,target.StartIndex);
                }
            }
            else if(endRect.yMin>target.MaskYMin)
            {
                if( target.EndIndex == (target.DataSet.length-1))
                {
                    return;
                }
                //up
                target.EndIndex ++;
                target.StartIndex ++;
                
                startNode.position = cc.pAdd(endNode.position,new cc.Vec2(0,-this.ItemHeight));
                let node = target.EnabledMap.shift();
                target.EnabledMap.push(node);            
                if(this.OnItemRefresh!=null)
                {
                    this.OnItemRefresh(node,target.EndIndex);
                }
            }
        }
       
    }

    SetIndex(index)
    {
        if(this.Param.bottom == null ||this.Param.bottom == 0)
        {
            this.StartIndex = 0;
            this.EndIndex = Math.min(this.GetDataSet().length-1,this.InitialCount-1);  
            
            let rect = this.ItemContainer.getContentSize();
            let max =  Math.max(this.GetDataSet().length-1,this.InitialCount-1); 
            let pos =this.ItemContainer.position; 
            this.SetContentSize(rect.width,(max+1)*this.ItemHeight)                       
            this.ItemContainer.position = new cc.Vec2(pos.x,0);
        }
        else
        {
            this.EndIndex = index;
            this.StartIndex = this.EndIndex - this.InitialCount+1;
            this.StartIndex = Math.max(0,this.StartIndex);
            
            let rect = this.ItemContainer.getContentSize();
            let pos =this.ItemContainer.position;
            this.SetContentSize(rect.width,(this.DataSet.length)*this.ItemHeight) 
            let visible = this.EndIndex +1- this.VisibleCount;
            visible = Math.max(0,visible);
            
            this.ItemContainer.position = new cc.Vec2(pos.x,visible*this.ItemHeight);
        }


        

        
    }


    public Add()
    {
        let dist =  this.EndIndex - this.StartIndex +1;

        if(dist < this.InitialCount)
        {
            this.EndIndex++;
        }
        else
        {
            this.StartIndex++;
            this.EndIndex ++;
        }

        let rect = this.ItemContainer.getContentSize();
        let pos =this.ItemContainer.position;
        this.SetContentSize(rect.width,(this.DataSet.length)*this.ItemHeight)  
        
        let visible = this.EndIndex +1- this.VisibleCount;
        if(visible>0)
        {
            this.ItemContainer.position = new cc.Vec2(pos.x,pos.y+this.ItemHeight);
        }

       

        this.RefreshAllItems();
    }

    RefreshAllItems()
    {        
        this.StartIndex =Math.max(this.StartIndex,0);
        this.EndIndex = Math.min(this.EndIndex,this.DataSet.length-1);

        while(this.EnabledMap.length>0)
        {
            let temp = this.EnabledMap.pop();
            temp.active = false;
            this.DisabledMap.push(temp);
        }

        for(let i = this.StartIndex;i<=this.EndIndex;i++)
        {
            let node = this.DisabledMap.pop();            
            node.active = true;
            node.position =new cc.Vec2(0,-this.InitItemPosY-i*this.ItemHeight);           
            this.EnabledMap.push(node);
            if(this.OnItemRefresh!=null)
            {
                this.OnItemRefresh(node,i);
            }
        }
       
       this.LastY = this.ItemContainer.position.y;
    }

    RefreshSpecialItem(index)
    {
        if(index>= this.StartIndex && index <= this.EndIndex)
        {
             let temp = this.EnabledMap[index-this.StartIndex];
             if(this.OnItemRefresh!=null)
            {
                this.OnItemRefresh(temp,index);
            }
        }
    }

    SetContentSize(width,height)
    {
        let pos =this.ItemContainer.position;
        this.ItemContainer.setContentSize(width,height)       
        this.ItemContainer.position = pos;
    }
}
