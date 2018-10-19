describe('service: exhibitsLinkedAdapter', function(){
    var $base64,
        exhibitsLinkedAdapter;
    beforeEach(function(){
        module('ui.router');
        module('rfa.exhibits-linked');
        module(function($provide){
            $base64 = {decode: sinon.spy(function(){return 'content';})};
            $provide.service('$base64', function(){return $base64;});
        });
    });
    beforeEach(inject(function(_exhibitsLinkedAdapter_){
        exhibitsLinkedAdapter = _exhibitsLinkedAdapter_;
    }));
    it('should put string decoded by $base64 dependency from second argument to content field', function(){
        var data = {columns:[], rows:[]},
            result = exhibitsLinkedAdapter(data,'base64string');
        expect($base64.decode.args[0][0]).toEqual('base64string');
        expect(result.content).toEqual('content');
    });
    it('should transform columns and rows fields of first argument to 2-dimensional array in tableData.rows field of returned object with first row for headers', function(){
        var data = {
                columns:[{NAME:'Column 1'}, {NAME:'Column 2'}], 
                rows:[{'Column 1':'column 1 value', 'Column 2':'column 2 value'}]
            },
            result = exhibitsLinkedAdapter(data,'base64string');
        
        expect(result.tableData.rows[0][1].name).toEqual(data.columns[1].NAME);
        expect(result.tableData.rows[1][1].name).toEqual(data.rows[0]['Column 2']);
    });
    it('should set isSleeve for cells in sleeve rows in tableData.rows', function(){
        var data = {
                columns:[{NAME:'Column 1'}], 
                rows:[{'Column 1':'column 1 value', IS_SLEEVE:'1'}]
            },
            result = exhibitsLinkedAdapter(data,'base64string');
        expect(result.tableData.rows[1][0].isSleeve).toBe(true);
    });
});