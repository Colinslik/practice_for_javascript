Ext.define('PDA.store.Event', {
    extend: 'Ext.data.Store',
    model: 'PDA.model.Event',
    sorters: [{
        property: 'display',
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
            rootProperty: 'res.events',
            successProperty: 'success',
            totalProperty: 'total'
        }
    }
});
