Ext.define('PDA.view.main.Utils', {
    statics: {
        poolCounter: 0,
        updatePoolFailed: [],
        errMsg: '',
        isRowExpanded: function(rowexpander, rowIdx){
            var view = rowexpander.view,
            rowNode = view.getNode(rowIdx),
            row = Ext.fly(rowNode, '_rowExpander');
            if(row == null){
                return false;
            }
            var nextBd = row.down(rowexpander.rowBodyTrSelector, true),
            isCollapsed = row.hasCls(rowexpander.rowCollapsedCls);
            return !isCollapsed;
        },
        getColorForStatus: function (stat) {
            var ret = '#404040';
            if (stat.toLowerCase().indexOf('failed') >= 0) {
                ret = '#ff0000';
            }
            else if (stat.toLowerCase() == 'started' || stat.toLowerCase() == 'ended' || stat.toLowerCase() == 'completed') {
                ret = '#007e33';
            }
            return ret;
        },
        isEmpty: function (obj) {
            if (obj == null)
                return true;
            if (obj.length && obj.length > 0)
                return false;
            if (obj.length === 0)
                return true;
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key))
                    return false;
            }
            return true;
        },
        getSuppressionUnit: function (unit) {
            var ret = 0;
            switch (unit) {
                case "week":
                    ret = 604800;
                    break;
                case "day":
                    ret = 86400;
                    break;
                case "hour":
                    ret = 3600;
                    break;
                case "minute":
                default:
                    ret = 60;
                    break;
            }
            return ret;
        },
        suppressionUnit: function (value) {
            value = parseInt(value);
            var val = 0, unit = 'hour';
            if (value >= 604800 && (value % 604800 == 0)) {
                val = (value / 604800);
                unit = 'week';
            }
            else if (value > 86400 && (value % 86400 == 0)) {
                val = (value / 86400);
                unit = 'day';
            }
            else if (value > 3600 && (value % 3600 == 0)) {
                val = (value / 3600);
                unit = 'hour';
            }
            else {
                val = Math.floor(value / 60);
                unit = 'minute';
            }
            return {value: val, unit: unit};
        },
        toSizeString: function (value) {
            if (value < 0) {
                return '--';
            }
            if (value == 0) {
                return 0;
            }
            else if (value < 1024)
                return Math.round(value * 1.0) + "\u00a0B";
            else if (value / 1024 < 1024)
                return Math.round(value * 100 / 1024) / 100 + "\u00a0KB";
            else if (value / 1024 / 1024 < 1024)
                return Math.round(value * 100 / 1024 / 1024) / 100 + "\u00a0MB";
            else if (value / 1024 / 1024 / 1024 < 1024)
                return Math.round(value * 100 / 1024 / 1024 / 1024) / 100 + "\u00a0GB";
            else
                return Math.round(value * 100 / 1024 / 1024 / 1024 / 1024) / 100 + "\u00a0TB";
        },
        sleep: function (milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) 
                    break;
            }
        },

        arr_sort: function (arr, key) {
            arr.sort(function (a, b) {
                return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
            });
        },

        loadHost: function (param) {
            var me = this;
            PDA.view.main.Utils_Api.callApi({
                method: 'GET',
                timeout: 120000,
                title: 'Host',
                apiUrl: 'pda_api/instances',
                apiCallback: function (options, success, response) {
                    console.log('===instances: ', response);
                    var host_store = Ext.getStore('host_store');
                    var event_host_store = Ext.getStore('event_host_store');
                    host_store.removeAll();
                    event_host_store.removeAll();
                    var j_data = Ext.JSON.decode(response.responseText, true) || null;
                    if (success && j_data && j_data.res && j_data.success) {
                        if (j_data.res.instances) {
                            event_host_store.add({'id': '*'});
                            for (var i = 0; i < j_data.res.instances.length; i++) {
                                host_store.add({'id': j_data.res.instances[i].id, 'application': j_data.res.instances[i].application, 'lastUpdated': j_data.res.instances[i].lastUpdated, 'stats': j_data.res.instances[i].status, 'name': j_data.res.instances[i].id + ' (' + j_data.res.instances[i].application + ')', 'LocalTime': j_data.res.instances[i].LocalTime, 'TimeZone': j_data.res.instances[i].TimeZone});
                                event_host_store.add({'id': j_data.res.instances[i].id, 'application': j_data.res.instances[i].application, 'lastUpdated': j_data.res.instances[i].lastUpdated, 'stats': j_data.res.instances[i].status, 'name': j_data.res.instances[i].id + ' (' + j_data.res.instances[i].application + ')', 'LocalTime': j_data.res.instances[i].LocalTime, 'TimeZone': j_data.res.instances[i].TimeZone});
                            }
                            if (param && param.callback && Ext.isFunction(param.callback)) {
                                param.callback(options, success, response);
                            }
                        }
                    }
                    console.log('===host store: ', host_store);
                }
            });
        },

        getHeaderLocation: function (header) {
            var ret = '';
            var header_arr = header.split('\n');
            for (var i = 0; i < header_arr.length; i++) {
                var n_h_arr = header_arr[i].split(':');
                if (n_h_arr[0] == 'Location') {
                    ret = header_arr[i].substr(n_h_arr[0].length + 2);
                }
            }
            return Ext.String.trim(ret);
        },
        splitQueryUrl: function(url){
            if(url && url.split(PDA.Global.FED_PUT_URL).length > 0){
                return url.split(PDA.Global.FED_PUT_URL)[1];
            }
            return '';
        },       
        array_find: function(ary, in_key, in_value) {
            var index = new Array();

            for (var i = 0; i < ary.length; i++) {
                for (var key in ary[i]) {
                    if (key == in_key && ary[i][key] == in_value)
                        index.push(i)
                }
            }
            return index;
        },
    
        meta_get: function(meta, key) {
            var metaArr = (Ext.String.trim(meta)).split("\n");
            for (var i = 0; i < metaArr.length; i++) {
                var val = (Ext.String.trim(metaArr[i])).split('=');
                if (val[0] == key)
                    return val[1];
            }
            return '';
        },

        subguid: function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        },
    
        generateUUID: function () {
            return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c =='x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        generatePoolUUID: function () {
            return 'zxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xyz]/g, function (c) {
                var ca = [0xa, 0xb, 0xd, 0xe, 0xf];
                var r = Math.random() * 16 | 0;
                var n = Math.random() * 5 | 0;
                var v = 0;
                if (c == 'x') {
                    v = r;
                }
                else if (c == 'y') {
                    v = (r&0x3|0x8);
                }
                else {
                    v = ca[n];
                }
                return v.toString(16);
            });
        },

        updateCtLayout:function(ct){
            if(ct){
                Ext.AbstractComponent.updateLayout(ct);
            }
        },

        cancelStoreLoading: function(store, times){
            var iterates = (Ext.isNumber(times) && times > 0) ? times : 1; 
            for(var itr = 0; itr < iterates; itr++){
                if (store.loading && store.lastOperation) {
                    var requests = Ext.Ajax.requests;
                    for (id in requests) {
                        if (requests.hasOwnProperty(id) && requests[id].options == store.lastOperation.request) {
                            Ext.Ajax.abort(requests[id]);
                        }
                    }
                }
            }
        },

        showWindow: function(newWin){
            newWin.hide();
            var win = Ext.ComponentQuery.query('basesinglewin'); 
            for(var i = 0; i < win.length; i++){
                if(!win[i].isHidden()){
                    win[i].hide();
                    newWin.mon(newWin, 'close', function () { 
                        if(win[i].isDestroyed != true){
                            try{
                                win[i].show(); 
                            }catch(ex){
                                console.log(win[i], ex);
                            }
                        }
                    }); 
                    break;
                }
            }
        },

        showSessionWindow: function(newWin){
            newWin.hide();
            var win = Ext.ComponentQuery.query('basesinglewin');
            for(var i = 0; i < win.length; i++){
                if(!win[i].isHidden()){
                    win[i].hide();
                    newWin.mon(newWin, 'hide', function () {
                        if(win[i].isDestroyed != true){
                            try{
                                win[i].show();
                            }catch(ex){
                                console.log(win[i], ex);
                            }
                        }
                    });
                    break;
                }
            }
        },
        msgCt:null,
        msgbox: function (title, format) {
            if(!this.msgCt){
                this.msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(this.msgCt, '<div class="msg"><h3>' + title + '</h3><p>' + s + '</p></div>', true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 5000, remove: true});
        },
        langDetect: function(){    
            var arr = document.URL.split('#')[0].split('?');
            var lang = 'en';
            if(Ext.isArray(arr) && arr.length > 1){
                var queryStr = Ext.Object.fromQueryString(arr[1]);
                if(queryStr.lang != null){
                    lang = queryStr.lang;
                }else{
                    lang = 'en';
                }
            }else{
                lang = 'en';
            }
            return lang;
        },
        daysInMonth: function(year, month){
            return new Date(year, month, 0).getDate();
        },
        daysInYear: function(year){
            var days = 0;
            for(var month = 1; month <= 12; month++){
                days += Federator.utils.Utils.daysInMonth(year, month);
            }
            return days;
        },
        adjGridRowNumber: function(pageCombo, pageToolbar, value, metaData, record, rowIndex, colIndex, store, view){
            var rowNum = store.pageSize * (pageToolbar.getPageData().currentPage - 1) + rowIndex + 1;
            return (rowNum <= 0 && pageCombo) ? rowNum + pageCombo.getValue() : rowNum;
        },
        IPnumber: function (ip) {
            var n_ip = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
            if (n_ip) {
                return (+n_ip[1]<<24) + (+n_ip[2]<<16) + (+n_ip[3]<<8) + (+n_ip[4]);
            }
            return null;
        },
        IPmask: function (maskSize) {
            return -1<<(32-maskSize);
        },
        subnetCheck: function (source_ip, target_ip, netmask) {
            return (this.IPnumber(source_ip) & this.IPnumber(netmask)) == (this.IPnumber(target_ip) & this.IPnumber(netmask));
        },
        checkIPDuplicated: function (ip) {
           return (ip.length == (Ext.Array.unique(ip).length)) ? true : false;
        },
        trimNullEleArray: function(array){
            var arr = [];
            for(var i = 0; i < array.length; i++){
                if(array[i] != null){
                    arr.push(array[i]);
                }
            }
            return arr;
        },
    }
});
