Ext.define('PDA.store.Jobs', {
    extend: 'Ext.data.Store',
    model: 'PDA.model.BackupInfo',
    proxy: {
        type: 'ajax',
        url: 'rest/couchdbproxy/index.php',
        extraParams: {
            url: window.location.origin + '/pda_api/instances',
            username: window.sessionStorage.getItem('user'), 
            password: window.sessionStorage.getItem('password'),
        },
        reader: {
            type: 'json',
            rootProperty: 'res.jobs',
            successProperty: 'success',
            totalProperty: 'total'
        }
    }
});
