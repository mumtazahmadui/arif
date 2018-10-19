angular.module('partyABCreator').factory('partyABCreator.config', [
    'modificationFilter',
    function(
        modificationFilter
    ) {
        return {
        a: {
            steps: [
                {
                    title: 'Select Party A Relationships',
                    promise: '',
                    name: 'Party A (Dealer) Selection',
                    template: '<party-a-dealer-selection input-data="pab.inputData"></party-a-dealer-selection>'
                },
                {
                    title: 'Select Letter Template for Each Party A Selected',
                    name: 'Template Selection',
                    template: '<template-selection input-data="pab.inputData"></template-selection>'
                },
                {
                    title: 'Select Party B Accounts for Addition/Removal',
                    name: 'Party B (Entity) Selection',
                    template: '<party-b-entity-selection input-data="pab.inputData"></party-b-entity-selection>'
                },
                {
                    title: 'Select Modification Type for Party B',
                    name: 'Modification Type Selection',
                    template: '<modification-type-selection input-data="pab.inputData"></modification-type-selection>',
                    showIf: function(data) {
                        var modified = _.filter(data.selectPartyB, modificationFilter.filter);
                        return modified.length;
                    }
                },
                {
                    title: 'Validate Party B Selections',
                    name: 'Validate Selection',
                    template: '<validation-selection input-data="pab.inputData"></validation-selection>'
                },
                {
                    title: 'Requests for Amendment Drafts Saved',
                    name: 'Draft Saved',
                    template: '<draft-saved input-data="pab.inputData"></draft-saved>'
                }
            ]
        },
        editB: {
            steps: [
                {
                    title: 'Select Party B Accounts for Addition/Removal',
                    name: 'Party B (Entity) Selection',
                    template: '<party-b-entity-selection input-data="pab.inputData"></party-b-entity-selection>'
                },
                {
                    title: 'Select Modification Type for Party B',
                    name: 'Modification Type Selection',
                    template: '<modification-type-selection input-data="pab.inputData"></modification-type-selection>',
                    showIf: function(data) {
                        var modified = _.filter(data.selectPartyB, modificationFilter.filter);
                        return modified.length;
                    }
                },
                {
                    name: 'Sleeve Selection',
                    template: '<sleeve-selection input-data="pab.inputData"></sleeve-selection>',
                    showIf: function(data){
                        return data.showSleevesSelection;
                    }
                },
                {
                    title: 'Validate Party B Selections',
                    name: 'Validate Selection',
                    template: '<validation-selection input-data="pab.inputData"></validation-selection>'
                }
            ]
        },
            editSleeve: {
                steps: [
                    {
                        title: 'Select Party B Accounts for Addition/Removal',
                        name: 'Party B (Entity) Selection',
                        template: '<party-b-entity-selection input-data="pab.inputData"></party-b-entity-selection>'
                    },
                    {
                        title: 'Select Modification Type for Party B',
                        name: 'Modification Type Selection',
                        template: '<modification-type-selection input-data="pab.inputData"></modification-type-selection>',
                        showIf: function(data) {
                            var modified = _.filter(data.selectPartyB, modificationFilter.filter);
                            return modified.length;
                        }
                    },
                    {
                        name: 'Sleeve Selection',
                        template: '<sleeve-selection input-data="pab.inputData"></sleeve-selection>'
                    },
                    {
                        title: 'Validate Party B Selections',
                        name: 'Validate Selection',
                        template: '<validation-selection input-data="pab.inputData"></validation-selection>'
                    }
                ]
            },

        linkExhibit: {
            steps: [
                {
                    name: 'exhibitSelection',
                    template: '<exhibit-selection input-data="pab.inputData"></exhibit-selection>'
                },
                {
                    name: 'exhibitLinked',
                    template: '<exhibit-linked input-data="pab.inputData"></exhibit-linked>'
                }
            ]
        },
        b: {
            steps: [
                {
                    title: 'Select Party B Accounts for Addition/Removal',
                    name: 'Party B (Entity) Selection',
                    template: '<party-b-entity-selection input-data="pab.inputData"></party-b-entity-selection>'
                },
                {
                    title: 'Select Modification Type for Party B',
                    name: 'Modification Type Selection',
                    template: '<modification-type-selection input-data="pab.inputData"></modification-type-selection>',
                    showIf: function(data) {
                        var modified = _.filter(data.selectPartyB, function(item) {
                            return item.isModified;
                        });
                        return modified.length;
                    }
                },
                {
                    title: 'Select Party A Relationships',
                    promise: '',
                    name: 'Party A (Dealer) Selection',
                    template: '<party-a-dealer-selection input-data="pab.inputData"></party-a-dealer-selection>'
                },
                {
                    title: 'Select Letter Template for Each Party A Selected',
                    name: 'Template Selection',
                    template: '<template-selection input-data="pab.inputData"></template-selection>'
                },
                {
                    title: 'Validate Party B Selections',
                    name: 'Validate Selection',
                    template: '<validation-selection input-data="pab.inputData"></validation-selection>'
                },
                {
                    title: 'Requests for Amendment Drafts Saved',
                    name: 'Draft Saved',
                    template: '<draft-saved input-data="pab.inputData"></draft-saved>'
                }
            ]

        },
        sleeves: {
            steps: [
                {
                    title: 'Select Party A Relationships',
                    promise: '',
                    name: 'Party A (Dealer) Selection',
                    template: '<party-a-dealer-selection input-data="pab.inputData" sleeves-warning="true"></party-a-dealer-selection>'
                },
                {
                    title: 'Select Letter Template for Each Party A Selected',
                    name: 'Template Selection',
                    template: '<template-selection input-data="pab.inputData"></template-selection>'
                },
                {
                    title: 'Select Party B Accounts for Addition/Removal',
                    name: 'Party B (Entity) Selection',
                    template: '<party-b-entity-selection input-data="pab.inputData"></party-b-entity-selection>'
                },
                {
                    title: 'Select Modification Type for Party B',
                    name: 'Modification Type Selection',
                    template: '<modification-type-selection input-data="pab.inputData"></modification-type-selection>',
                    showIf: function(data) {
                        var modified = _.filter(data.selectPartyB, modificationFilter.filter);
                        return modified.length;
                    }
                },
                {
                    name: 'Sleeve Selection',
                    template: '<sleeve-selection input-data="pab.inputData"></sleeve-selection>'
                },
                {
                    title: 'Validate Party B Selections',
                    name: 'Validate Selection',
                    template: '<validation-selection input-data="pab.inputData"></validation-selection>'
                },
                {
                    title: 'Requests for Amendment Drafts Saved',
                    name: 'Draft Saved',
                    template: '<draft-saved input-data="pab.inputData"></draft-saved>'
                }
            ]
        }
    };
    }]);
