describe('textEditorFilterOut: ', function () {
    var textEditorFilterOut,
        EditorTypes,
        base64,
        CredentialsService;
    beforeEach(function () {
        EditorTypes = {
            linked: 'linked',
            exhibit: 'exhibit'
        };
        base64 = {
            encode: function (data) {
                return data;
            }
        };
        CredentialsService = {
            userId: sinon.stub().returns(999)
        };

        module('ui.router', 'app.services');
        module(function ($provide) {
            $provide.value('textEditorTypesConfig', EditorTypes);
            $provide.value('$base64', base64);
            $provide.value('CredentialsService', CredentialsService);
        });
    });

    beforeEach(inject(function ($injector) {
        textEditorFilterOut = $injector.get('textEditorFilterOut');
    }));
    it('empty template should just return encoded data', function () {
        var params = {
            template: '<div></div>'
        };
        expect(textEditorFilterOut(params).data.content).toEqual(encodeURIComponent('<div></div>'));
    });
    it('empty template also should remove close br tags', function () {
        var params = {
            template: '<div><br></div>'
        };
        expect(textEditorFilterOut(params).data.content).toEqual(encodeURIComponent('<div><br/></div>'));
    });
    it('empty there is name or preparedData in params, should copy it', function () {
        var params = {
            template: '<div><br></div>',
            name: 'foo',
            preparedData: 'bar'
        };
        expect(textEditorFilterOut(params).data.content).toEqual(encodeURIComponent('<div><br/></div>'));
        expect(textEditorFilterOut(params).data.name).toEqual(params.name);
        expect(textEditorFilterOut(params).preparedData).toEqual(params.preparedData);
    });
    it('empty there is smth in data, should copy it', function () {
        var params = {
            template: '<div><br></div>',
            name: 'foo',
            preparedData: 'bar',
            data: {
                neededFlagFroBE: true,
                userRole: 'MAIN'
            }
        };
        expect(textEditorFilterOut(params).data.content).toEqual(encodeURIComponent('<div><br/></div>'));
        expect(textEditorFilterOut(params).data.name).toEqual(params.name);
        expect(textEditorFilterOut(params).preparedData).toEqual(params.preparedData);
        expect(textEditorFilterOut(params).data.neededFlagFroBE).toBeTruthy();
        expect(textEditorFilterOut(params).data.userRole).toBe('MAIN');
    });
    describe('linked or exhibit: ', function () {
        var params;
        beforeEach(function () {
            params = {
                type: 'linked',
                tableData: {
                    rows: []
                },
                template: '<div></div>'
            };
        });
        it('initially should create send table with tr for every row', function () {
            params.tableData.rows = [[]];
            var result = textEditorFilterOut(params);
            expect(result.data.columns).toEqual([]);
            expect(result.data.htmlContent).toEqual(encodeURIComponent('<table><tbody><tr></tr></tbody></table>'));
            expect(result.data.textContent).toEqual(encodeURIComponent('<div></div>'));
        });
        it('should build table and save it', function () {
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                deleted: 0,
                order: 0
            }, {
                columnName: 'Party B',
                name: 'Party B',
                controlColumn: false,
                deleted: 0,
                order: 1
            }], [{
                controlColumn: false,
                order: 0,
                name: 'hello'
            }, {
                controlColumn: false,
                order: 1,
                name: 'smth new'
            }]];
            var resultString = '<table><tbody><tr><td>Sleeve Client Identifier</td><td>Party B</td></tr><tr><td>hello</td><td>smth new</td></tr></tbody></table>';
            params.content = {};
            var result = textEditorFilterOut(params);
            expect(result.data.columns[0].columnName).toEqual("Sleeve Client Identifier");
            expect(result.data.columns[0].createdBy).toEqual(999);
            expect(result.data.columns[0].cells[0].value).toEqual("hello");
            expect(result.data.htmlContent).toEqual(encodeURIComponent(resultString));
        });
        it('if anything deleted, should skip it', function(){
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                deleted: 0,
                order: 0
            }, {
                columnName: 'Party B',
                name: 'Party B',
                controlColumn: false,
                deleted: 1,
                order: 1
            }], [{
                controlColumn: false,
                order: 0,
                name: 'hello'
            }, {
                controlColumn: false,
                deleted: 1,
                order: 1,
                name: 'smth new'
            }]];
            var resultString = '<table><tbody><tr><td>Sleeve Client Identifier</td></tr><tr><td>hello</td></tr></tbody></table>';
            params.content = {};
            var result = textEditorFilterOut(params);
            expect(result.data.columns[0].columnName).toEqual("Sleeve Client Identifier");
            expect(result.data.columns[0].createdBy).toEqual(999);
            expect(result.data.columns[0].cells[0].value).toEqual("hello");
            expect(result.data.htmlContent).toEqual(encodeURIComponent(resultString));
        });
        it('is parent have styles, should remove ng styles and send them', function() {
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                style: 'ng-valid some-style ng-pristine',
                deleted: 0,
                order: 0
            }], [{
                controlColumn: false,
                order: 0,
                name: 'hello',
                id: 78000
            }]];
            params.content = {};
            var result = textEditorFilterOut(params);
            expect(result.data.columns[0].columnStyle).toEqual("some-style");
        });
        it('is cannot find children, cell should be empty object', function() {
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                style: 'ng-valid some-style ng-pristine',
                deleted: 0,
                order: 0
            }], []];
            params.content = {};
            var result = textEditorFilterOut(params);
            expect(result.data.columns[0].cells[0]).toEqual({});
        });
        it('for exhibit we don\'t need to send deleted columns', function() {
            params.type = 'exhibit';
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                style: 'ng-valid some-style ng-pristine',
                deleted: 1,
                order: 0
            }], []];
            params.content = {};
            var result = textEditorFilterOut(params);
            expect(result.data.columns).toEqual([]);
        });
        it('if selectControlColumn and type exhibit, should set controlColumn for parent and same for children', function () {
            params.data = {
                columns: []
            };
            params.type = 'exhibit';
            params.selectControlColumn = true;
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                deleted: 0,
                order: 0
            }, {
                columnName: 'Party B',
                name: 'Party B',
                deleted: 0,
                order: 1
            }], [{
                controlColumn: false,
                order: 0,
                name: 'hello'
            }, {
                controlColumn: false,
                order: 1,
                name: 'smth new'
            }]];
            params.content = {
            };
            params.contentId = 'new';
            var result = textEditorFilterOut(params);
            expect(result.data.columns[1].controlColumn).toEqual(false);
        });
        it('if selectControlColumn and type exhibit, should set controlColumn for parent and same for children', function () {
            params.data = {
                columns: []
            };
            params.type = 'exhibit';
            params.selectControlColumn = true;
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                deleted: 0,
                order: 0
            }, {
                columnName: 'Party B',
                name: 'Party B',
                deleted: 0,
                order: 1
            }], [{
                controlColumn: false,
                order: 0,
                name: 'hello'
            }, {
                controlColumn: false,
                order: 1,
                name: 'smth new'
            }]];
            params.content = {
            };
            params.contentId = 'new';
            var result = textEditorFilterOut(params);
            expect(result.data.columns[1].controlColumn).toEqual(false);
        });
        it('if there are labels and order, should set correct html', function () {
            params.tableData.rows = [[{
                columnName: 'Sleeve Client Identifier',
                name: 'Sleeve Client Identifier',
                controlColumn: false,
                label: 'SLV LABEL',
                deleted: 0,
                order: 1
            }, {
                columnName: 'Party B',
                name: 'Party B',
                label: 'EXTRAORDINARY LABEL',
                controlColumn: false,
                deleted: 0,
                order: 0
            }], [{
                controlColumn: false,
                order: 1,
                name: 'hello'
            }, {
                controlColumn: false,
                order: 0,
                name: 'smth new'
            }]];
            var resultString = '<table><tbody><tr><td>EXTRAORDINARY LABEL</td><td>SLV LABEL</td></tr><tr><td>smth new</td><td>hello</td></tr></tbody></table>';
            params.content = {};
            var result = textEditorFilterOut(params);
            expect(result.data.htmlContent).toEqual(encodeURIComponent(resultString));
        });
    });
});
