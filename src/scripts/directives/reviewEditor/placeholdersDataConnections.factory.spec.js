describe('placeholdersDataConnections: ', function () {
    var placeholdersDataConnections;
    beforeEach(function () {
        module('ui.router');
        module('app.services');
    });
    beforeEach(inject(function ($injector) {
        placeholdersDataConnections = $injector.get('placeholdersDataConnections');
    }));
    it('setRows: should set hidden prop', function () {
        placeholdersDataConnections.setRows('PARTY B PLACEHOLDER', [1, 2]);
        expect(placeholdersDataConnections['PARTY B PLACEHOLDER']).toBeUndefined();
    });
    it('getRows: should return hidden prop', function () {
        placeholdersDataConnections.setRows('PARTY B PLACEHOLDER', [1, 2]);
        expect(placeholdersDataConnections.getRows('PARTY B PLACEHOLDER')).toEqual([1, 2]);
    });
    describe('isChildResponseAvailable: ', function () {
        var parentRows = [{
                'Party B True Legal Name': 'Zuckerberg Co.'
            }, {
                'Party B True Legal Name': 'Steve Jobs Inc.'
            }],
            sleeveRows = [{
                'Party B True Legal Name': 'Microsoft inc.'
            }, {
                'Party B True Legal Name': 'Steve Jobs Inc.'
            }];

        it('should return true, if there is no parent rows', function () {
            expect(placeholdersDataConnections.isChildResponseAvailable('SOME_PLACEHOLDER_WHICH_NOT_EXIST', sleeveRows[0], 'Accepted')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_REMOVAL_TABLE', sleeveRows[0], 'Accepted')).toBeTruthy();
        });

        it('should return true, if this sleeve don\'t have parent', function () {
            placeholdersDataConnections.setRows('PARTYB_REMOVAL_TABLE', parentRows);
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_REMOVAL_TABLE', sleeveRows[0], 'Accepted')).toBeTruthy();
        });

        it('should return true, if this sleeve parent exist, but hes parent don\'t have response', function () {
            placeholdersDataConnections.setRows('PARTYB_ADDITION_TABLE', parentRows);
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Accepted')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Rejected')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Pending')).toBeTruthy();
        });

        it('should return true for all responses, if this sleeve parent exist, and he is accepted', function () {
            parentRows[1]['Sell Side Response'] = 'Accepted';
            placeholdersDataConnections.setRows('PARTYB_ADDITION_TABLE', parentRows);
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Accepted')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Rejected')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Pending')).toBeTruthy();
        });

        it('should return true for reject and pending, if this sleeve parent exist, and he is Reject', function () {
            parentRows[1]['Sell Side Response'] = 'Rejected';
            placeholdersDataConnections.setRows('PARTYB_ADDITION_TABLE', parentRows);
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Accepted')).toBeFalsy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Rejected')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Pending')).toBeFalsy();
        });

        it('should return true for pending, if this sleeve parent exist, and he is Pending', function () {
            parentRows[1]['Sell Side Response'] = 'Pending';
            placeholdersDataConnections.setRows('PARTYB_ADDITION_TABLE', parentRows);
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Accepted')).toBeFalsy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Rejected')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_ADDITION_TABLE', sleeveRows[1], 'Pending')).toBeTruthy();
        });

        it('should return true for accepted, if this sleeve parent exist, and he is accepted', function () {
            parentRows[1]['Sell Side Response'] = 'Accepted';
            placeholdersDataConnections.setRows('PARTYB_REMOVAL_TABLE', parentRows);
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_REMOVAL_TABLE', sleeveRows[1], 'Accepted')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_REMOVAL_TABLE', sleeveRows[1], 'Rejected')).toBeFalsy();
        });

        it('should return true for both, if this sleeve parent exist, and he is rejected', function () {
            parentRows[1]['Sell Side Response'] = 'Rejected';
            placeholdersDataConnections.setRows('PARTYB_REMOVAL_TABLE', parentRows);
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_REMOVAL_TABLE', sleeveRows[1], 'Accepted')).toBeTruthy();
            expect(placeholdersDataConnections.isChildResponseAvailable('SLEEVE_REMOVAL_TABLE', sleeveRows[1], 'Rejected')).toBeTruthy();
        });


    });
    describe('changeChildrenValues: ', function () {
        var parentRows = [{
                'Party B True Legal Name': 'Zuckerberg Co.'
            }, {
                'Party B True Legal Name': 'Steve Jobs Inc.'
            }],
            sleeveRows = [{
                'Party B True Legal Name': 'Microsoft inc.',
                'Sell Side Response': 'Accepted'
            }, {
                'Party B True Legal Name': 'Steve Jobs Inc.',
                'Sell Side Response': 'Accepted'
            }];

        it('should change data for children with callback fn', function () {
            var inputVal = "Some text as reason";
            var transformFn = function (item) {
                item['Sell Side Response'] = 'Pending';
                item['Reason for Rejection/Pending'] = inputVal;
            };
            placeholdersDataConnections.setRows('SLEEVE_REMOVAL_TABLE', sleeveRows);
            placeholdersDataConnections.changeChildrenValues('PARTYB_REMOVAL_TABLE', parentRows[1], transformFn);
            expect(sleeveRows[1]['Sell Side Response']).toEqual('Pending');
            expect(sleeveRows[1]['Reason for Rejection/Pending']).toEqual("Some text as reason");
            expect(sleeveRows[0]['Sell Side Response']).toEqual('Accepted');
            expect(sleeveRows[0]['Reason for Rejection/Pending']).toBeUndefined();
        });
    });
});
