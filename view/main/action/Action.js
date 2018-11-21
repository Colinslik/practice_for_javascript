Ext.define('PDA.view.main.action.Action', {
    extend: 'Ext.container.Container',
    xtype: 'action_action',
    bodyPadding: 10,
    padding: 10,
    scrollable: true,
    actionParam: {
        action: null,
        record: null
    },
    bodyStyle: {
        'background-color': '#f1f1f1'
    },
    style: {
        'background-color': '#f1f1f1'
    },
    initComponent: function () {
        var me = this;
        //me.html = "this is action";
        me.layout = 'card';
        me.items = [{
            height: 500,
            itemId: 'action_grid',
            xtype: 'action_grid'
        },{
            height: 500,
            itemId: 'action_edit',
            xtype: 'action_edit'
        }];
        me.listeners = {
            afterrender: function (cmp) {
                me.setActiveItem(me.down('#action_grid'));
            },
            activate: function (cmp) {
                console.log('===action_action activate===');
                me.setActiveItem(me.down('#action_grid'));
                me.down('#action_grid').fireEvent('activate', me.down('#action_grid'));
            },
            deactivate: function (cmp) {
                console.log('===action_action deactivate===');
            }
        };
        me.callParent();
    }
});
