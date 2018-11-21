/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('PDA.view.main.Main', {
    //extend: 'Ext.tab.Panel',
    extend: 'Ext.container.Container',
    layout: 'fit',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Ext.data.TreeStore',
        'PDA.view.main.MainController',
        'PDA.view.main.MainModel',
        'PDA.view.main.List',
        'PDA.view.main.Utils_Api',
        'PDA.store.Event_Severity'
    ],

    controller: 'main',
    viewModel: 'main',
    plugins: 'viewport',

    ui: 'navigation',
/*
    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: '{name}'
            },
            flex: 0
        },
        iconCls: 'fa-th-list',
        items: [{
            xtype: 'button',
            text: 'Logout',
            margin: '10 0',
            handler: 'onClickButton'
        }]
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },
*/

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },

    initComponent: function () {
        var me = this;
        var event_store = Ext.create('PDA.store.Event', {
            storeId: 'event_store',
            listeners: {
                beforeload: function (store, operation, e) {
                    var params = store.getProxy().extraParams;
                    params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/events';
                    params.user = window.sessionStorage.getItem('user');
                    params.password = window.sessionStorage.getItem('password');
                }
            }
        });
        var action_store = Ext.create('PDA.store.Action', {
            storeId: 'action_store',
            listeners: {
                beforeload: function (store, operation, e) {
                    var params = store.getProxy().extraParams;
                    params.Urls = PDA.Global.FED_PUT_URL + 'pda_api/' + window.sessionStorage.getItem('host') + '/actions';
                    params.user = window.sessionStorage.getItem('user');
                    params.password = window.sessionStorage.getItem('password');
                }
            }
        });
        /*
        var event_host_store = Ext.create('PDA.store.Hosts', {
            storeId: 'event_host_store'
        });
        */
        me.items = [{
            layout: 'border',
            itemId: 'main-panel',
            xtype: 'panel',
            items: [{
                region: 'north',
                xtype: 'pda_header',
                height: 50,
            },{
                region: 'west',
                xtype: 'treelist',
                cls: 'pda_tree',
                bodyCls: 'pda_tree',
                width: 215,
                bodyStyle: {
                    'background-color': '#000000 !important',
                    'color': '#fff !important'
                },
                style: {
                    'background-color': '#000000 !important',
                    'color': '#fff !important'
                },
                listeners: {
                    itemclick: 'onItemClick' 
                },
                store: {
                    root: {
                        expanded: true,
                        children: [{
                            text: 'PDA',
                            expanded: true,
                            iconCls: 'x-fa fa-cloud pda_tree_item',
                            children: [{
                                text: 'Notification Center',
                                leaf: true,
                                name: 'actioncenter_actioncenter',
                                cls: 'test',
                                over: 2,
                                iconCls: 'x-fa fa-asterisk pda_tree_item'
                            },{
                                text: 'Impact Map',
                                leaf: true,
                                name: 'impactmap_impactmap',
                                iconCls: 'x-fa fa-sitemap pda_tree_item'
                            },{
                                text: 'Event',
                                leaf: true,
                                name: 'event_event',
                                iconCls: 'x-fa fa-tag pda_tree_item'
                            },{
                                text: 'Action',
                                leaf: true,
                                name: 'action_action',
                                iconCls: 'x-fa fa-cogs pda_tree_item'
                            },{
                                text: 'Policy',
                                leaf: true,
                                name: 'policy_policy',
                                iconCls: 'x-fa fa-magic pda_tree_item'
                                /*
                            },{
                                text: 'Report',
                                leaf: true,
                                name: 'report_report',
                                iconCls: 'x-fa fa-list pda_tree_item'
                                */
                            },{
                                text: 'Settings',
                                leaf: true,
                                name: 'settings_settings',
                                iconCls: 'x-fa fa-gear pda_tree_item'
                            }]
                        }]
                    }
                }
            },{
                itemId: 'pda_container',
                region: 'center',
                xtype: 'container',
                height: 700,
                width: 1000,
                //scrollable: "y",
                //html: 'this is center',
                style: {
                    'background-color': '#f1f1f1'
                },
                layout: 'card',
                items: [{
                    itemId: 'actioncenter_actioncenter',
                    xtype: 'actioncenter_actioncenter'
                },{
                    itemId: 'impactmap_impactmap',
                    xtype: 'impactmap_impactmap'
                },{
                    itemId: 'policy_policy',
                    xtype: 'policy_policy'
                },{
                    itemId: 'event_event',
                    xtype: 'event_event'
                },{
                    itemId: 'action_action',
                    xtype: 'action_action'
                },{
                    itemId: 'report_report',
                    xtype: 'report_report'
                },{
                    itemId: 'settings_settings',
                    xtype: 'settings_settings'
                }]
            }]
        }];
        me.listeners = {
            afterrender: function (cmp) {
                console.log('===main afterrender===');
                cmp.down('#pda_container').getLayout().setActiveItem(0);
                /*
                var a_store = Ext.create('PDA.store.Hosts');
                a_store.on('beforeload', function (store, operation, e) {
                    var params = store.getProxy().extraParams;
                    params.start = 10;
                    params.offset = 10;
                });
                a_store.load({
                    callback: function (records, operation, success) {
                        console.log('==host store: ', records);
                    }
                });
                */
            },
            destroy: function (cmp) {
                window.sessionStorage.clear();
            }
        };
        me.callParent(arguments);
    }
});
