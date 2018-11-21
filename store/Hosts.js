Ext.define('PDA.store.Hosts', {
    extend: 'Ext.data.Store',
    model: 'PDA.model.Hosts',
    alias: 'store.hosts',
    requires: ['PDA.JsonrpcProxy'],
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
            rootProperty: 'instances',
            successProperty: 'success',
            totalProperty: 'total_rows'
        }
    }
});
