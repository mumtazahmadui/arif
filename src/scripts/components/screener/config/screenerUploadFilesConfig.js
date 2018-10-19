(function () {
    // @ngInject
    var screenerUploadedFilesConfigs = {
        data: {
            title: 'Uploads',
            tasks: {},
            pages: {},
            table: {
                template: 'uploaded_files',
                desc: true,
                sortBy: 'Name',
                data: {}
            },
            buttons: [
                { label: "Upload File", method: 'uploadFile' }
            ],
            filters: [
                {
                    id: "processing_status",
                    label: "Processing Status",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },
                {
                    id: "uploaded_by",
                    label: "Uploaded By",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                }
            ]
        }
    };

    angular
        .module('app.configs')
        .constant("screenerUploadedFilesConfigs", screenerUploadedFilesConfigs);
})();