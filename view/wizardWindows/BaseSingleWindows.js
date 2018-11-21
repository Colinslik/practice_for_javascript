Ext.define('PDA.view.wizardWindows.BaseSingleWindows', {
    extend: 'PDA.view.wizardWindows.BaseWindows',
    alias: 'widget.basesinglewin',
    requires:['PDA.view.wizardWindows.CloseButton', 'PDA.view.main.Utils'],
    title: '',
    headerDesc: '',
    headerHeight: 50, 
    imageSrc: '',
    imageWidth: 120,
    bodyDesc: '',
    layout: 'border',
    hideBackBtn: true,
    backBtnText: '',//MSG.Back_Btn,
    hideNextBtn: true,
    nextBtnText: '',//MSG.Next_Btn,
    hideCancelBtn: false,
    cancelBtnText: '',//MSG.Cancel_Btn,
    hidebottomtoolbar: false,
    hideHeader: false,
    enterOK: true,
    closeBtnId:null,
    customizedRenderTo: null,
    constrain:false,
    myMaskId:null,
    initComponent: function () {

        var me  = this;
        me.backBtnText = "Back";
        me.nextBtnText = "Next";
        me.cancelBtnText = "Cancel";

        var dockedItem = {
            xtype: 'toolbar',
            dock: 'bottom',
            hidden: me.hidebottomtoolbar,
            style: {
                'background-color': '#ffffff',
                'margin-top': '0px'
            },
            items: [ '->',{
                xtyep: 'button',
                text: me.backBtnText,
                action: 'back',
                hidden: me.hideBackBtn,
                cls: 'discover_btn_1'
            },{
                xtyep: 'button',
                itemId: 'next_btn',
                text: me.nextBtnText,
                action: 'next',
                hidden: me.hideNextBtn,
                cls: 'discover_btn_1'
            },{
                xtyep: 'button',
                text: me.cancelBtnText,
                action: 'cancel',
                hidden: me.hideCancelBtn,
                cls: 'cancel_btn_1'
            }]
        };
        this.items = [{
            itemId: 'baseSingleWinHeader',
            hidden: me.hideHeader,
            region: 'north',
            collapsible: false,
            maxHeight: me.headerHeight,
            xtype: 'panel',
            cls: 'singleWinHeader',
            html: me.headerDesc
        },{
            itemId: 'baseSingleWinBody',
            region: 'center',
            xtype: 'panel',//use panel for docked items
            cls: 'singleWinBody',
            dockedItems: [ dockedItem ],
            html: me.bodyDesc,
            items:[]
        }];
        this.callParent(arguments);
        this.mon(this, {
            close: function(obj){
                Ext.destroy(Ext.getCmp(obj.closeBtnId), Ext.get(me.myMaskId));
                if(Ext.getCmp('viewport') != undefined){
                    Ext.getCmp('viewport').setViewportOverflow();
                }
                me.removeAnchor();
            },
            hide: function(cmp){
                Ext.getCmp(cmp.closeBtnId).hide();
            },
            resize: function(){
                this.adjustCloseBtnPosition();
            },
            show: function(cmp){
                if(Ext.getCmp('viewport')){
                    Ext.getCmp('viewport').setViewportScrollbar();
                }

                if(Ext.get(Ext.Element.getActiveElement()) != undefined){
                    Ext.get(Ext.Element.getActiveElement()).blur();
                }
                var dockedBottomToolEles = Ext.dom.Query.select('.x-toolbar-docked-bottom',cmp.getEl().dom);
                var realToolEle = dockedBottomToolEles[dockedBottomToolEles.length-1];
                var dockedToolBtns = Ext.dom.Query.select('a[role=button]',realToolEle);
                var okBtn = dockedToolBtns[dockedToolBtns.length-1];
/*
                var map2 = new Ext.util.KeyMap(document, {
                    key: 27,//Ext.EventObject.ESC,
                    fn: function (keyCode, e) {
                        if(!cmp.isHidden()){
                            cmp.close();
                        }
                    }
                });
*/
                if(Ext.getCmp('viewport')){
                    Ext.getCmp('viewport').adjustPopWindowMask();
                }
            },
            move: function (cmp, eOpts) {
                var me2 = this;
                me2.adjustCloseBtnPosition();
            },
            beforeshow: function (cmp, eOpts) {
                var closeBtn = Ext.getCmp(cmp.closeBtnId);
                closeBtn && closeBtn.isHidden() && closeBtn.show();
                PDA.view.main.Utils.showWindow(cmp);
            },
            beforerender: function(cmp){
                var closeBtnCmp = Ext.widget('fed_closebtn',{
                    hidden: true,
                    floating: true,
                    renderTo: Ext.get('viewportcontainer') || Ext.getBody(),
                    listeners: {
                        render: function(c) {
                            c.mon(c.getEl(),{
                                click: function(){
                                    if (me.getEl().dom.lastChild.previousSibling)
                                        return '';
                                    if (Ext.isFunction(me.closeBtnClickFun)) {
                                        me.closeBtnClickFun();
                                    }
                                    me.close();
                                },
                                mousedown: function(){
                                    try{
                                        Ext.getCmp('viewport').setViewportScrollbar();
                                    }catch(ex){}
                                }
                            });
                        }
                    }
                });
                cmp.closeBtnId = closeBtnCmp.getId();
            },
            afterrender: function(cmp, eOpts){
                var me2 = this;
                cmp.mon(cmp.getEl(),'click', function(){ 
                    if(Ext.getCmp('viewport')){
                        Ext.getCmp('viewport').setViewportScrollbar(); 
                    }
                });
                me2.adjustCloseBtnPosition();
                if(Ext.getCmp('viewport') != undefined){
                    Ext.getCmp('viewport').setViewportOverflow();
                }
    /*
                if(Ext.getCmp('viewportcontainer') != undefined){
                    try{
                        this.anchorTo(Ext.getCmp('viewportcontainer') || Ext.getBody(),'t-c',[0,0],false,false,
                            function(){
                                me2.adjustCloseBtnPosition();
                        });
                    }catch(err){    
                        console.log(err);
                    }
                }
    */
            }
        });
        this.overideInitComponent();
    },
    overideInitComponent: Ext.emptyFn,
    show: function(){
        this.callParent(arguments);
        if(Ext.getCmp(this.closeBtnId)){
            this.adjustCloseBtnPosition();
            document.getElementById(this.closeBtnId).scrollIntoView();
        }
    },
    onDestroy: function(){
        Ext.destroy(Ext.getCmp(this.closeBtnId));
        this.mun(this, 'close');
        this.mun(this, 'show');
        this.mun(this, 'hide');
        this.mun(this, 'beforeshow');
        this.mun(this, 'afterrender');
        this.mun(this, 'afterlayout');
        this.callParent();
    },
    adjustCloseBtnPosition:function() {
        var me = this;
        var btn = Ext.getCmp(me.closeBtnId);
        if(btn){
            var closeBtnWidth = btn.closeBtnWidth;
            var closeBtnHeight = btn.closeBtnHeight;
            //btn.setXY([me.getX() + me.getWidth() - closeBtnWidth/2, me.getY() - closeBtnHeight/2]);
            btn.setXY([me.getX() + me.getWidth() - 25, me.getY() + 10]);
        }
    }
});
