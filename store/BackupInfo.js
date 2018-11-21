Ext.define('PDA.store.BackupInfo', {
    extend: 'Ext.data.Store',
    model: 'PDA.model.BackupInfo',
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],
    proxy: {
        type: 'ajax',
        url: 'rest/couchdbproxy/index.php',
        extraParams: {
            url: window.location.origin + '/pda_api/instances',
            user: window.sessionStorage.getItem('user'),
            password: window.sessionStorage.getItem('password'),
        },
        reader: {
            type: 'json',
            rootProperty: 'res.backups',
            successProperty: 'success',
            totalProperty: 'total'
        }
    }
});
