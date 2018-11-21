Ext.define('PDA.view.main.HeaderController', {
    extend: 'Ext.app.ViewController', 
    alias: 'controller.header',
    requires: ['PDA.view.main.Header'],
    onClickButton: function () {
        //localStorage.removeItem('PDALoggedIn');
        //this.getView().destroy();
        window.sessionStorage.clear();
        var main_obj = Ext.ComponentQuery.query('panel[itemId=main-panel]') || null;
        if (main_obj && main_obj.length > 0) {
            Ext.destroy(main_obj[0]);
        }
        Ext.create({
            xtype: 'login'
        });
    },
    onChangePassword: function () {
        var title = "Change Password";
        var default_width = 520;
        var win2 = Ext.create('Federator.view.wizardWindows.BaseSingleWindows', {
            title: false,
            cls: 'fed_win',
            header: false,
            hideCancel: true,
            hidebottomtoolbar: true,
            width: default_width,
            height: 490,
            initComponent: function () {
                var win = this;
                Ext.getClass(this).prototype.initComponent.apply(this, arguments);

                var header = win.down('container[itemId=baseSingleWinHeader]');
                header.layout = {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                };

                var headeritems = [{
                    xtype: 'label',
                    width: default_width,
                    html: '<div class="popupheader"><div class="popupheadertext">' + title + '</div></div>'
                }];

                var body = win.down('panel[itemId=baseSingleWinBody]');
                body.layout = {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                };

                var dockeditem = [{
                    xtype: 'toolbar',
                    height: 50,
                    margin: '0 0 0 0',
                    dock: 'bottom',
                    items: [{
                        itemId: 'createuser_cancelbtnitem',
                        xtype: 'button',
                        margin: '0 0 0 50',
                        text: "Cancel",
                        cls: 'cancel_btn_1',
                        handler: function () {
                            win.close();
                        }
                    }, '->',{
                        itemId: 'createuser_submitbtnitem',
                        xtype: 'button',
                        margin: '0 50 0 0',
                        width: 55,
                        text: "OK",
                        cls: 'discover_btn_1',
                        handler: function () {
                        }
                    }]
                }];

                var itemmaxwidth = 410;
                var bodypanel = {
                    width: default_width,
                    defaultType: 'textfield',
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    defaults: {
                        margin: '25 0 0 50',
                        labelWidth: 120,
                        labelSeparator: ':',
                        cls: 'n_default_font'
                    },
                    items: [{
                        itemId: 'username',
                        allowBlank: false,
                        maxWidth: itemmaxwidth,
                        fieldLabel: 'Name',
                        editable: false,
                        listeners: {
                            afterrender: function(cmp){
                            }
                        }
                    },{
                        itemId: 'curr_passwd',
                        fieldLabel: 'Current Password*',
                        placeHolder: 'required'
                    },{
                        itemId: 'new_passwd',
                        fieldLabel: 'New Password*',
                        placeHolder: 'required'
                    },{
                        itemId: 'conform_new_passwd',
                        fieldLabel: 'Confirm New Password*',
                        placeHolder: 'required'
                    }]
                };
                var bodyitems = [bodypanel];

                Ext.suspendLayouts();
                header.add(headeritems);
                body.add(bodyitems);
                body.addDocked(dockeditem);
                Ext.resumeLayouts(true);
                win.mon(win.down('button[itemId=createuser_submitbtnitem]'),{
                    click: function () {
                    }
                });

                win.mon(win, {
                    destroy:function(){
                    }
                });
            }
        });
        win2.show();
    }
});
