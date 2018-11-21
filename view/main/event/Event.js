Ext.define('PDA.view.main.event.Event', {
    extend: 'Ext.container.Container',
    xtype: 'event_event',
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
        //me.html = "this is event";
        me.layout = 'card';
        me.items = [{
            height: 500,
            itemId: 'event_grid',
            xtype: 'event_grid'
        },{
            height: 500,
            itemId: 'event_edit',
            xtype: 'event_edit'
        }];
        me.listeners = {
            afterrender: function (cmp) {
                me.setActiveItem(me.down('#event_grid'));
            },
            activate: function (cmp) {
                console.log('===event_event activate===');
                me.setActiveItem(me.down('#event_grid'));
                me.down('#event_grid').fireEvent('activate', me.down('#event_grid'));
            },
            deactivate: function (cmp) {
                console.log('===event_event deactivate===');
            }
        };
        me.callParent();
    }
});
