angular
    .module('app.filters')
    .filter('log', log);

function log(){
	return function(){
		var args = Array.prototype.slice.call(arguments);
		args.unshift("LOG:");
		console['log'] && console.log.apply(console, args);
	};
}