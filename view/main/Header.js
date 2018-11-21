Ext.define('PDA.view.main.Header', {
    extend: 'Ext.Toolbar',
    xtype: 'pda_header',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    style: {
        'background': '#000000 !important',
        'background-color': '#000000 !important'
    },
    controller: 'main',
    initComponent: function () {
        var me = this;
        var logoutMenu = Ext.create('Ext.menu.Menu', {
            width: 150,
            itemId: 'logout_menu',
            floating: true,
            //animateShadow: true,
            renderTo: Ext.getBody(),
            defaults: {
                cls: 'logout'
            },
            items: [{
                text: 'Change Password',
                handler: 'onChangePassword'
            },{
                text: 'Log Out',
                handler: 'onClickButton'
            }]
        });
        me.items = [{
            cls: 'pda',
            xtype: 'button',
            width: 52,
            iconCls: 'fa fa-bars'
        },{
            xtype: 'image',
            itemId: 'prophetstor_img',
            height: 32,
            width: 133,
            src: 'resources/images/pda/logo_white.png'
        },{
            margin: '5 0 0 10',
            itemId: 'nav_path',
            xtype: 'displayfield',
            value: PDA.Global.PDA_TITLE,
            fieldStyle: {
                'color': '#ffffff',
                'font-size': '18px',
                'font-weight': 'normal'
            },
            width: 650
        }, '->', {
            margin: '0 20 0 0',
            itemId: 'host_list',
            xtype: 'combobox',
            fieldLabel: 'PDA Host',
            editable: false,
            style: {
            },
            required: true,
            labelWidth: 70,
            labelSeparator: '',
            labelStyle:[ 
                'color:white;font-size: 14px'
            ],
            width: 350,
            store: Ext.getStore('host_store'),
            value: '',
            displayField: 'name',
            valueField: 'id',
            queryMode: 'local',
            listeners: {
                change: function (cmp, newval) {
                    if (newval != '') {
                        var host_item = cmp.store.findRecord('id', newval, 0, false, true,true);
                        window.sessionStorage.setItem('host', host_item.get('id'));
                        window.sessionStorage.setItem('application', host_item.get('application'));
                        var title = PDA.Global.PDA_TITLE;
                        if (host_item.get('application') != null && host_item.get('application') != '') {
                            title = PDA.Global.PDA_TITLE + ' for ' + host_item.get('application');
                        }
                        Ext.ComponentQuery.query('#nav_path')[0].setValue(title);
                        if (Math.abs(host_item.data.lastUpdated - host_item.data.LocalTime) > 600) {
                        	Ext.MessageBox.alert('Time difference alert', 'Detect over 10 mins time difference <br/> between agent and server!', function(){});
                        }
                    }
                    if (me.ownerCt && me.ownerCt.down('#pda_container')) {
                        var curPage = me.ownerCt.down('#pda_container').getLayout().getActiveItem();
                        if (curPage.itemId != 'actioncenter_actioncenter') {
                            me.ownerCt.down('#pda_container').getLayout().setActiveItem('actioncenter_actioncenter');
                        }
                        else {
                            me.ownerCt.down('#actioncenter_actioncenter').fireEvent('activate', me.ownerCt.down('#actioncenter_actioncenter'));
                        }
                    }
                    //reload visible pages
                }
            }
        },{
            itemId: 'logout_pnl',
            margin: '0 20 0 0',
            xtype: 'panel',
            layout: 'hbox',
            bodyStyle: {
                'background-color': '#000',
                'color': '#fff'
            },
            width: 160,
            items: [{
                width: 36,
                itemId: 'login_abbr',
                xtype: 'displayfield',
                cls: 'header_login_abbr',
                value: 'Ad',
                listeners: {
                    render: function (cmp) {
                        app = window.sessionStorage.getItem('user');
                        this.setValue(app.substr(0, 2).toUpperCase())
                    }
                }
            },{
                width: 100,
                itemId: 'login_user',
                xtype: 'displayfield',
                fieldStyle: {
                    'margin-top': '0px !important',
                    'padding-top': '10px !important',
                    'padding-left': '10px',
                    'color': '#ffffff',
                    'font-size': '14px',
                },
                value: 'Admin',
                listeners: {
                    render: function (cmp) {
                        app = window.sessionStorage.getItem('user');
                        this.setValue(app)
                    }
                }
            },{
                margin: '10 0 0 0',
                xtype: 'displayfield',
                labelCls: 'x-fa fa-caret-down'
            }],
            isMenuShown: false,
            suspendMouseUp: false,
            listeners: {
                render: function (cmp) {
                    cmp.body.on('mousedown', function (e) {
                        if (cmp.isMenuShown && logoutMenu.isVisible()) {
                            cmp.suspendMouseUp = true;
                        }
                    });
                    cmp.body.on('mouseup', function () {
                        if (cmp.isMenuShown) {
                            if (logoutMenu.isVisible()) {
                                logoutMenu.hide();
                                cmp.isMenuShown = false;
                            }
                            else {
                                if (cmp.suspendMouseUp) {
                                    cmp.suspendMouseUp = false;
                                }
                                else {
                                    logoutMenu.showAt(cmp.getX(), cmp.getY() + cmp.getHeight() + 6);
                                    cmp.isMenuShown = true;
                                }
                            }
                        }
                        else if (!cmp.isMenuShown && !logoutMenu.isVisible()) {
                            logoutMenu.showAt(cmp.getX(), cmp.getY() + cmp.getHeight() + 6);
                            cmp.isMenuShown = true;
                        }
                    });
                }
            }
        }];
        me.listeners = {
            afterrender: function (cmp) {
                PDA.view.main.Utils.loadHost({
                    callback: function (options, success, response) {
                        var host_store = Ext.getStore('host_store');
                        var j_data = Ext.JSON.decode(response.responseText, true) || null;
                        host_store.removeAll();
                        for (var i = 0; i < j_data.res.instances.length; i++) {
                            host_store.add({'id': j_data.res.instances[i].id, 'lastUpdated': j_data.res.instances[i].lastUpdated, 'stats': j_data.res.instances[i].status, 'application': j_data.res.instances[i].application, 'LocalTime': j_data.res.instances[i].LocalTime, 'name': j_data.res.instances[i].id + ' (' + j_data.res.instances[i].application + ')'});
                        }
                        if (host_store.data.items.length > 0) {
                            var host_item = host_store.findRecord('id', window.sessionStorage.getItem('host'), 0, false, true,true)
                            if (window.sessionStorage.getItem('host') && host_item) {
                                me.down('#host_list').setValue(window.sessionStorage.getItem('host'));
                                window.sessionStorage.setItem('application', host_item.get('application'));
                                var title = PDA.Global.PDA_TITLE;
                                if (host_item.get('application') != null && host_item.get('application') != '') {
                                    title = PDA.Global.PDA_TITLE + ' for ' + host_item.get('application');
                                }
                                Ext.ComponentQuery.query('#nav_path')[0].setValue(title);
                            }
                            else {
                                me.down('#host_list').setValue(host_store.getAt(0));
                                window.sessionStorage.setItem('host', host_store.getAt(0).get('id'));
                                window.sessionStorage.setItem('application', host_store.getAt(0).get('application'));
                                var title = PDA.Global.PDA_TITLE;
                                if (host_item.get('application') != null && host_item.get('application') != '') {
                                    title = PDA.Global.PDA_TITLE + ' for ' + host_item.get('application');
                                }
                                Ext.ComponentQuery.query('#nav_path')[0].setValue(title);
                            }
                        }
                        else {
                            me.down('#host_list').clearValue();
                        }
                    }
                });
            }
        };
        me.callParent();
    }
});
