angular
    .module('app.filters')
    .filter('decodeUri', decodeUri);

function decodeUri() {
    return function(value) {
        if (!value) {
            return value;
        }
        try {
            return decodeURIComponent(value);
        }catch (err) {
            return value;
        }
    };
}
