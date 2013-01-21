(function () {
    this.joData = function (baseUri) {
        this.baseUri = baseUri;

        this.OrderBySettings = null;
        this.TopSettings = null;
        this.SkipSettings = null;
        this.FilterSettings = null;
        this.SelectSettings = null;
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

        this.OrderBySettings.toString = function () {
            var qsValue = '$orderby=' + this.Property;
            if (typeof this.Order !== 'undefined')
                qsValue += ' ' + this.Order;

            return qsValue;
        };

        return this;
    };

    joData.prototype.top = function (top) {
        var settings = this.TopSettings || {};
        settings.Top = top;
        this.TopSettings = settings;

        this.TopSettings.toString = function () {
            return '$top=' + this.Top;
        };

        return this;
    };

    joData.prototype.skip = function (skip) {
        var settings = this.SkipSettings || {};
        settings.Skip = skip;
        this.SkipSettings = settings;

        this.SkipSettings.toString = function () {
            return '$skip=' + this.Skip;
        };

        return this;
    };

    joData.prototype.select = function (select) {
        this.SelectSettings = this.SelectSettings || {};
        this.SelectSettings.Select = select;

        this.SelectSettings.toString = function () {
            return '$select=' + this.Select.join(',');
        };

        return this;
    }

    var filterObj = function (filterObj, logicalOperator) {
        this.filterObj = filterObj;
        this.logicalOperator = null;
        if (typeof logicalOperator !== 'undefined' || logicalOperator !== null)
            this.logicalOperator = logicalOperator;

        return this;
    }

    joData.prototype.filter = function (filterClause) {
        this.FilterSettings = this.FilterSettings || CreateFilterSettings();
        settings.filters.push(new filterObj(filterClause));

        return this;
    };

    joData.prototype.andFilter = function (filterClause) {
        this.FilterSettings = this.FilterSettings || CreateFilterSettings();
        this.FilterSettings.filters.push(new filterObj(filterClause, 'and'));
        return this;
    };

    joData.prototype.orFilter = function (filterClause) {
        this.FilterSettings = this.FilterSettings || CreateFilterSettings();
        this.FilterSettings.filters.push(new filterObj(filterClause, 'or'));
        return this;
    };

    function CreateFilterSettings() {
        var filterSettings = { filters: [] };

        filterSettings.toString = function () {
            var filter = '$filter=';
            for (var i = 0; i < this.filters.length; i++) {
                var filterClause = this.filters[i];
                if ((typeof filterClause.logicalOperator !== 'undefined' && filterClause.logicalOperator !== null) && i > 0)
                    filter += ' ' + filterClause.logicalOperator + ' ';

                filter += filterClause.filterObj.toString();
            }

            return filter;
        };

        return filterSettings;
    }

    joData.filterClause = function () { 
        this.property = '';
        this.value = '';
        this.components = [];

        return this;
    };

    joData.filterClause.prototype.toString = function () {
        var strComps = [];
        for (var i = 0; i < this.components.length; i++) {
            strComps.push(this.components[i]());
        }
        return strComps.join(' ');
    };

    function formatValue(value) {
        if (typeof value === 'string')
            return "'" + value + "'";

        return value;
    };

    function addLogicalOperator(value, operator, filterClause) {
        filterClause.value = value;

        filterClause.components.push(function () {
            return operator + ' ' + formatValue(value);
        });

        return filterClause;
    }

    function addArithmeticOperator(amount, operator, filterClause) {
        filterClause.components.push(function () {
            return operator + ' ' + amount;
        });

        return filterClause;
    }

    joData.filterClause.prototype.Property = function (property) {
        this.property = property;
        this.components.push(function () {
            return property;
        });

        return this;
    };

    //Arithmetic Methods
    joData.filterClause.prototype.Add = function (amount) {
        return addArithmeticOperator(amount, 'add', this);
    };

    joData.filterClause.prototype.Sub = function (amount) {
        return addArithmeticOperator(amount, 'sub', this);
    };

    joData.filterClause.prototype.Mul = function (amount) {
        return addArithmeticOperator(amount, 'mul', this);
    };

    joData.filterClause.prototype.Div = function (amount) {
        return addArithmeticOperator(amount, 'div', this);
    };

    joData.filterClause.prototype.Mod = function (amount) {
        return addArithmeticOperator(amount, 'mod', this);
    };

    //Logical Operators
    joData.filterClause.prototype.Eq = function (value) {
        return addLogicalOperator(value, 'eq', this);
    };

    joData.filterClause.prototype.Ne = function (value) {
        return addLogicalOperator(value, 'ne', this);
    };

    joData.filterClause.prototype.Gt = function (value) {
        return addLogicalOperator(value, 'gt', this);
    };

    joData.filterClause.prototype.Ge = function (value) {
        return addLogicalOperator(value, 'ge', this);
    };

    joData.filterClause.prototype.Lt = function (value) {
        return addLogicalOperator(value, 'lt', this);
    };

    joData.filterClause.prototype.Le = function (value) {
        return addLogicalOperator(value, 'le', this);
    };

    //String Functions
    joData.filterClause.prototype.Substringof = function (value, property) {
        this.components.push(function () {
            return 'substringof(\'' + value + '\',' + property + ')';
        });

        return this;
    };

    joData.filterClause.prototype.Endswith = function (value, property) {
        this.components.push(function () {
            return 'endswith(' + property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.filterClause.prototype.Startswith = function (value, property) {
        this.components.push(function () {
            return 'startswith(' + property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.filterClause.prototype.Length = function (property) {
        this.components.push(function () {
            return 'length(' + property + ')';
        });

        return this;
    };

    joData.filterClause.prototype.Indexof = function (value, property) {
        this.components.push(function () {
            return 'indexof(' + property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.filterClause.prototype.Replace = function (property, find, replace) {
        this.components.push(function () {
            return 'replace(' + property + ',\'' + find + '\',\'' + replace + '\')';
        });

        return this;
    };

    joData.filterClause.prototype.Substring = function (property, position, length) {
        this.components.push(function () {
            var comps = [property, position];
            if (typeof length !== 'undefined')
                comps.push(length);

            return 'substring(' + comps.join(',') + ')';
        });

        return this;
    };

    joData.filterClause.prototype.ToLower = function (property) {
        this.components.push(function () {
            return 'tolower(' + property + ')';
        });

        return this;
    };

    joData.filterClause.prototype.ToUpper = function (property) {
        this.components.push(function () {
            return 'toupper(' + property + ')';
        });

        return this;
    };

    joData.filterClause.prototype.Trim = function (property) {
        this.components.push(function () {
            return 'trim(' + property + ')';
        });

        return this;
    };

    joData.prototype.toString = function () {
        var url = this.baseUri;
        var components = [];
        
        if (this.OrderBySettings !== null)
            components.push(this.OrderBySettings.toString());

        if (this.TopSettings !== null)
            components.push(this.TopSettings.toString());

        if (this.SkipSettings !== null)
            components.push(this.SkipSettings.toString());

        if (this.SelectSettings !== null)
            components.push(this.SelectSettings.toString());

        if (this.FilterSettings !== null)
            components.push(this.FilterSettings.toString());

        return url + '?' + components.join('&');
    };

    return this;

})(window);