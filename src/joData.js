(function () {
    this.joData = function (baseUri) {
        this.baseUri = baseUri;
    };

    joData.prototype.baseUri = '';

    joData.prototype.orderBy = function (property) {
        var settings = this.OrderBySettings || {};
        settings.Property = property;
        this.OrderBySettings = settings;

        this.desc = function () {
            settings.Order = 'desc';
            return this;
        };

        this.asc = function () {
            settings.Order = 'asc';
            return this;
        };

        return this;
    };

    joData.prototype.top = function (top) {
        var settings = this.TopSettings || {};
        settings.Top = top;
        this.TopSettings = settings;

        return this;
    };

    joData.prototype.skip = function (skip) {
        var settings = this.SkipSettings || {};
        settings.Skip = skip;
        this.SkipSettings = settings;

        return this;
    };

    joData.prototype.filter = function (property) {
        var settings = this.FilterSettings || { filters: [] };        
    }

    joData.prototype.toString = function () {
        alert(this.OrderBySettings.Property + ' ' + this.OrderBySettings.Order);
    };

    return this;

})(window);