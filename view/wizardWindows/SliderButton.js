Ext.define('PDA.view.wizardWindows.SliderButton', {
    extend: 'Ext.Component',
    xtype: 'sliderbutton',
    height: 34,
    width: 80,
    checked: false,
    initComponent: function () {
        var me = this;
        var isChked = me.checked ? "checked" : "";
        me.html = '<label class="switch" height="' + me.height + '" width="' + me.width + '"><input type="checkbox" ' + isChked + '><span class="slider round"></span></label>'; 
        me.callParent(arguments);
    }
});
