Ext.define('PDA.view.main.settings.Settings', {
    extend: 'Ext.tab.Panel',
    xtype: 'settings_settings',
    cls: 'pda_tab',
    requires: ['PDA.view.main.settings.DiskProphetSettings'],
    padding: 10,
    //bodyPadding: 10,
    scrollable: true,
    tabBar: {
        style: {
            'border-bottom': '2px solid #ddd !important'
        }
    },
    bodyStyle: {
        'background-color': '#f1f1f1'
    },
    style: {
        'background-color': '#f1f1f1'
    },
    initComponent: function () {
        var me = this;
        me.items = [{
            title: 'Disk Prophet',
            itemId: 'dp_setting',
            xtype: 'settings_diskprophet'
        },{
            title: 'ArcServe',
            xtype: 'settings_arcserver',
            itemId: 'settings_arcserver',
        },{
            title: 'DRProphet',
            xtype: 'settings_drpserver',
            itemId: 'settings_drpserver',
        },{
            title: 'SMTP',
            xtype: 'settings_smtp'
        },{
            title: 'SMS',
            xtype: 'settings_smstwilio'
        },{
            title: 'PDA Host',
            xtype: 'settings_pdahost'
        }];
        me.listeners = {
            activate: function (cmp) {
                app = window.sessionStorage.getItem('application');
                if (app == PDA.Global.APPLICATION_ARCSERVE) {
                    me.getTabBar().down('tab[text=ArcServe]').setVisible(true)
                    me.getTabBar().down('tab[text=DRProphet]').setVisible(false)
                }
                if (app == PDA.Global.APPLICATION_DRPROPHET) {
                    me.getTabBar().down('tab[text=ArcServe]').setVisible(false)
                    me.getTabBar().down('tab[text=DRProphet]').setVisible(true)
                }

                var a_item = cmp.getLayout().getActiveItem() || null;
                if (a_item) {
                    a_item.fireEvent('activate', a_item);
                }
                me.setActiveTab('dp_setting');
            }
        };
        me.callParent();
    }
});
