Ext.define('PDA.store.Windows_Hosts', {
    extend: 'Ext.data.Store',
    model: 'PDA.model.Windows_Hosts',
    requires: ['PDA.JsonrpcProxy'],
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],
    proxy: {
        type: 'jsonrpc',
        method: 'get',
        //url: PDA.Global.FED_PUT_URL + 'pda_api/instances',
        url: window.location.origin + '/pda_api/instances',
        extraParams: {
            "params": {}
        },
        reader: {
            type: 'json',
            rootProperty: 'hosts',
            successProperty: 'success',
            totalProperty: 'total_rows'
        }
    }
});
