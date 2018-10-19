function MUFETools_NavigateTo(token, args) {
    var that = window.parent;

    while (that) {
        if (that.MUFEClientBase_NavigateTo) {
            that.MUFEClientBase_NavigateTo(token, args);

            return;
        }
        if (that === window.top) {
            return;
        }
        that = that.parent;
    }
}
function MUFETools_RegisterPage(token) {
    var that = window.parent;

    if (window.location.href.indexOf('crosssite') !== -1) {
        return;
    }

    while (that) {
        if (that.MUFEClientBase_RegisterPage) {
            that.MUFEClientBase_RegisterPage(token, window.document.title);
            return;
        }
        if (that === window.top) {
            return;
        }
        that = that.parent;
    }
}
function MUFETools_SwitchApp(token) {
    var that = window.parent;

    while (that) {
        if (that.MUFEClientBase_SwitchApp) {
            that.MUFEClientBase_SwitchApp(token);

            return;
        }
        if (that === window.top) {
            return;
        }
        that = that.parent;
    }
}
