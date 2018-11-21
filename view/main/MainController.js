/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('PDA.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    requires: ['Ext.window.Toast'],
    alias: 'controller.main',

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    onClickButton: function () {
        //localStorage.removeItem('PDALoggedIn');
        window.sessionStorage.clear();
        this.getView().destroy();
        this.destroy();
        Ext.create({
            xtype: 'login'
        });
    },

    onItemClick: function (cmp, record, item, index, e) {
        console.log('===click on record: ', record);
        var main_container = this.getView().down('#pda_container') || null;
        if (main_container) {
            var object = main_container.down('#' + record.node.raw.name) || null;
            if (object) {
                main_container.getLayout().setActiveItem(object);
                if (record.node.raw.name == 'event_event' || record.node.raw.name == 'action_action' || record.node.raw.name == 'policy_policy') {
                    object.fireEvent('activate', object);
                }
                /*
                if (Ext.isFunction(object.loadData)) {
                    object.loadData();
                }
                */
            }
        }
    },

    onChangePassword: function () {
        var title = "Change Password";
        var default_width = 520;
        var win2 = Ext.create('PDA.view.wizardWindows.BaseSingleWindows', {
            title: false,
            cls: 'fed_win',
            header: false,
            hideCancel: true,
            hidebottomtoolbar: true,
            width: default_width,
            height: 350,
            scope: this,
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
                    items: [
                     '->',{
                        itemId: 'submitbtnitem',
                        xtype: 'button',
                        margin: '0 0 0 0',
                        width: 75,
                        disabled: true,
                        text: "Change",
                        //cls: 'discover_btn_1',
                        cls: 'login-btn1',
                        disabledCls: 'login-btn1-diabled',
                        handler: function () {
                        }
                    },{
                        itemId: 'cancelbtnitem',
                        xtype: 'button',
                        margin: '0 10 0 10',
                        text: "Cancel",
                        cls: 'btn-cancel',
                        handler: function () {
                            win.close();
                        }
                    }]
                }];

                var itemmaxwidth = 450;
                var bodypanel = {
                    width: itemmaxwidth,
                    defaultType: 'textfield',
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    defaults: {
                        margin: '25 0 0 50',
                        labelWidth: 150,
                        labelSeparator: '',
                        cls: 'n_default_font',
                        inputType: 'password',
                        required: true,
                        listeners: {
                            change: function (cmp) {
                                //this.dataValidation();
                                var ret = true;
                                var txtflds = win.query('textfield[xtype=textfield][required=true]') || null;
                                if (txtflds) {
                                    for (var i = 0; i < txtflds.length; i++) {
                                        if (txtflds[i].getValue() == '' || txtflds[i].getValue() == null) {
                                            ret = false;
                                            break;
                                        }
                                    }
                                }
                                win.down('#submitbtnitem').setDisabled(!ret);
                            }
                        }
                    },
                    items: [{
                        itemId: 'username',
                        xtype: 'displayfield',
                        maxWidth: itemmaxwidth,
                        fieldLabel: 'Name',
                        editable: false,
                        value: window.sessionStorage.getItem('user'),
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
                        itemId: 'confirm_new_passwd',
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
                win.mon(win.down('button[itemId=submitbtnitem]'),{
                    click: function () {
                        var isValid = true;
                        var msg = '';
                        if (win.down('#curr_passwd').getValue() != window.sessionStorage.getItem('password')) {
                            msg = 'Current password mismatch!';
                            isValid = false;
                        }
                        if (win.down('#new_passwd').getValue() != win.down('#confirm_new_passwd').getValue()) {
                            msg = 'New password mismatch!';
                            isValid = false;
                        }
                        if (!isValid) {
                            Ext.toast({
                                html: msg,
                                cls: 'pda_toast',
                                bodyCls: 'pda_toast_body',
                                align: 'tr'
                            });
                            return;
                        }
                        var metadata = {
                            "user": {
                            	"oldPassword": win.down('#curr_passwd').getValue(),
                                "newPassword": win.down('#new_passwd').getValue()
                            }
                        };
                        PDA.view.main.Utils_Api.callApi({
                            method: 'PUT',
                            timeout: 120000,
                            title: 'Change Password',
                            apiUrl: ('pda_api/users/' + window.sessionStorage.getItem('user')),
                            reqBody: metadata,
                            scope: this,
                            apiCallback: function (options, success, response) {
                                console.log('===put response: ', response);
                                if (success) {
                                    var j_data = Ext.JSON.decode(response.responseText, true) || null;
                                    if (j_data && j_data.success) {
                                        window.sessionStorage.setItem("password", win.down('#new_passwd').getValue());
                                        win.destroy();
                                        return;
                                    }
                                }
                                Ext.toast({
                                    html: 'Change password failed!',
                                    cls: 'pda_toast',
                                    bodyCls: 'pda_toast_body',
                                    align: 'tr'
                                });
                            }
                        });
                    }
                });

                /*
                function dataValidation () {
                    var ret = true;
                    var txtflds = win.query('textfield[xtype=textfield][required=true]') || null;
                    if (txtflds) {
                        if (txtflds[i].getValue() == '' || txtflds[i].getValue() == null) {
                            ret = false;
                            break;
                        }
                    }
                    win.down('#submitbtnitem').setDisabled(!ret);
                };
                */

                win.mon(win, {
                    destroy:function(){
                    }
                });
            }
        });
        win2.show();
    }
});
