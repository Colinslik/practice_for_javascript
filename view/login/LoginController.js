Ext.define('PDA.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function() {
        // This would be the ideal location to verify the user's credentials via
        // a server-side lookup. We'll just move forward for the sake of this example.

        // Set the localStorage value to true
        if (this.getView()) {
            window.sessionStorage.setItem("user", this.getView().down('#username').getValue());
            window.sessionStorage.setItem("password", this.getView().down('#password').getValue());
            PDA.view.main.Utils_Api.callApi({
                method: 'GET',
                timeout: 120000,
                title: 'Log In',
                apiUrl: ('pda_api/users/' + this.getView().down('#username').getValue()),
                scope: this,
                apiCallback: function (options, success, response) {
                    if (success && response) {
                        var j_data = Ext.JSON.decode(response.responseText, true) || null;
                        if (j_data && j_data.success) {
                            window.sessionStorage.setItem("PDALoggedIn", true);
                            window.sessionStorage.setItem("user", this.getView().down('#username').getValue());
                            window.sessionStorage.setItem("password", this.getView().down('#password').getValue());
                            window.sessionStorage.setItem("host", this.getView().down('#host_list').getValue());
                            window.sessionStorage.setItem("application", this.getView().down('#application_list').getValue());

                            // Remove Login Window
                            this.getView().down('#login_msg_pnl').setVisible(false);
                            this.getView().destroy();

                            // Add the main view to the viewport
                            Ext.create({
                                xtype: 'app-main'
                            });
                            return;
                        }
                    }
                    window.sessionStorage.clear();
                    this.getView().down('#login_msg_pnl').setVisible(true);
                }
            });
        }
    },

    onHostComboClick: function (cmp, newval, oldval) {
        var view = this.getView() || null;
        this.setBtns(view);
    },

    onTextFieldChange: function (cmp, newval, oldval) {
        var view = this.getView() || null;
        this.setBtns(view);
    },

    setBtns: function (view) {
        var ret = false;
        if (view) {
            if (view.down('#username') && view.down('#username').getValue() != '' && view.down('#password') && view.down('#password').getValue() != '' && view.down('#host_list').getValue() !='' && view.down('#host_list').getValue() != null) {
                ret = true;
            }
            view.down('#login_btn') && view.down('#login_btn').setDisabled(!ret);
        }
    }
});
