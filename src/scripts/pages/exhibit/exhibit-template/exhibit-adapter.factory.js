(function() {
    angular.module('rfa.exhibit-template-editor').factory('exhibitAdapter', function($base64) {
       return function(data) {
           var tableData = {
               rows: [[]]
           };
           var content = '';
           var newData = angular.copy(data.data);

           if (newData.columns) {
               for (var i = 0; i < newData.columns.length; i++) {
                   newData.columns[i].cells = _.uniq(newData.columns[i].cells, 'partyBEntityId');
               }
           }
           var source = newData.textContent || newData.content;

           if (source) {
               content = decodeURIComponent($base64.decode(source));
               var values = /value="((?!\<)[a-zA-Z0-9\s\[\]]*(?!\<))"/g;
               content = content.replace(values, 'value="&lt; $1 &gt;"');
           }
           if (!$(content).html()) {
               content = '<div>' + content + '</div>';
           }

           if (angular.isArray(newData.columns)) {
               newData.columns = newData.columns.sort(function(a, b) {
                   return a.columnIndex - b.columnIndex || a.id - b.id;
               });

               for (var index = 0; index < newData.columns.length; index++) {
                   var col = newData.columns[index];

                   tableData.rows[0][index] = {
                       style: col.columnStyle,
                       name: col.columnName,
                       controlColumn: col.controlColumn,
                       id: col.id,
                       deleted: col.deleted
                   };
               }
           }

         return {
             tableData: tableData,
             data: newData,
             content: content
         };
       };
    });
})();