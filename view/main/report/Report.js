Ext.define('PDA.view.main.report.Report', {
    extend: 'Ext.panel.Panel',
    xtype: 'report_report',
    cls: 'reload',
    bodyPadding: 10,
    initComponent: function () {
        var me = this;
        me.html = "this is report";
        me.listeners = {
            afterrender: function (cmp) {
            },
            activate: function (cmp) {
                console.log('===activate event==');
            }
        };
        me.callParent();
    }
});
