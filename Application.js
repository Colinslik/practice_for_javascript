/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('PDA.Application', {
    extend: 'Ext.app.Application',

    name: 'PDA',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        Ext.apply(Ext.form.field.VTypes, {
            EAPname: function (val, field) {
                var EAPnameVal = /[\w.\-]/;
                return EAPnameVal.test(val);
            },
            EAPnameText: 'Invalid Data',
            EAPnameMask: /[\w.\-]/
        });
        // TODO - Launch the application

        var loggedIn;
        loggedIn = window.sessionStorage.getItem("PDALoggedIn");
        console.log("loggedIn: ", loggedIn);
        Ext.create({
            xtype: loggedIn ? 'app-main' : 'login'
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
