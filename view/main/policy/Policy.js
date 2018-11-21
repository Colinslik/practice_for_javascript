Ext.define('PDA.view.main.policy.Policy', {
    extend: 'Ext.container.Container',
    xtype: 'policy_policy',
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
        //me.html = "this is polciy";
        me.layout = 'card';
        me.items = [{
            height: 500,
            itemId: 'policy_grid',
            xtype: 'policy_grid'
        },{
            height: 500,
            itemId: 'policy_edit',
            xtype: 'policy_edit'
        }];
        me.listeners = {
            afterrender: function (cmp) {
                me.setActiveItem(me.down('#policy_grid'));
            },
            activate: function (cmp) {
                console.log('===policy_policy activate===');
                me.setActiveItem(me.down('#policy_grid'));
                me.down('#policy_grid').fireEvent('activate', me.down('#policy_grid'));
            },
            deactivate: function (cmp) {
                console.log('===policy_policy deactivate===');
            }
        };
        me.callParent();
    }
});
