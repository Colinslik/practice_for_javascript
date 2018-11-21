Ext.define('PDA.store.Action', {
    extend: 'Ext.data.Store',
    model: 'PDA.model.Action',
    sorters: [{
        property: 'id',
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
            rootProperty: 'res.actions',
            successProperty: 'success',
            totalProperty: 'total'
        }
    }
});
