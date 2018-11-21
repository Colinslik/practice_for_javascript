Ext.define('PDA.view.wizardWindows.BaseWindows', {
    extend: 'Ext.window.Window',
    shadow: false,
    title: 'baseWindow',
    maskCls:'fed-win-mask',//override ZIndexManager, modal must be set "true"
    modal:true,
    width: 600,
    height: 400,
    maximizable: false,

    resizable: false,

    initComponent: function () {
        this.renderTo = (Ext.get('viewportcontainer') || Ext.getBody());
        this.callParent(arguments);
    }
});
