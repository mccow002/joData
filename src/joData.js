(function (window) {
    window.joData = function (baseUri) {
        this.baseUri = baseUri;

        this.OrderBySettings = null;
        this.TopSettings = null;
        this.SkipSettings = null;
        this.FilterSettings = null;
        this.SelectSettings = null;

        this.defaults = {};
    };

    joData.prototype.baseUri = '';

    joData.prototype.setOrderByDefault = function (property, order) {
        var orderByDefaults = {
            Property: property,
            toString: function () {
                return orderByToString(this.Property, this.Order);
            }
        };

        if (typeof order !== 'undefined')
            orderByDefaults.Order = order;

        this.defaults.OrderByDefault = orderByDefaults;
        return this;
    };

    joData.prototype.orderBy = function (property) {
        this.OrderBySettings = this.OrderBySettings || {};
        this.OrderBySettings.Property = property;
        
        this.desc = function () {
            this.OrderBySettings.Order = 'desc';
            return this;
        };

        this.asc = function () {
            this.OrderBySettings.Order = 'asc';
            return this;
        };

        this.resetOrderBy = function () {
            this.OrderBySettings = null;
        };

        this.OrderBySettings.toString = function () {
            return orderByToString(this.Property, this.Order);
        };

        return this;
    };

    function orderByToString(property, order){
        var qsValue = '$orderby=' + property;
        if (typeof order !== 'undefined')
            qsValue += ' ' + order;

        return qsValue;
    }

    joData.prototype.setTopDefault = function (top) {
        var topDefault = {
            Top: top,
            toString: function () {
                return topToString(this.Top);
            }
        };

        this.defaults.TopDefault = topDefault;
        return this;
    };

    joData.prototype.top = function (top) {
        this.TopSettings = this.TopSettings || {};
        this.TopSettings.Top = top;

        this.resetTop = function () {
            this.TopSettings = null;
        };

        this.TopSettings.toString = function () {
            return topToString(this.Top);
        };

        return this;
    };

    function topToString(top) {
        return '$top=' + top;
    }

    joData.prototype.setSkipDefault = function (skip) {
        var skipDefault = {
            Skip: skip,
            toString: function () {
                return skipToString(this.Skip);
            }
        };

        this.defaults.SkipDefault = skipDefault;
        return this;
    };

    joData.prototype.skip = function (skip) {
        this.SkipSettings = this.SkipSettings || {};
        this.SkipSettings.Skip = skip;

        this.resetSkip = function () {
            this.SkipSettings = null;
        };

        this.SkipSettings.toString = function () {
            return skipToString(this.Skip);
        };

        return this;
    };

    function skipToString(skip) {
        return '$skip=' + skip;
    };

    joData.prototype.select = function (select) {
        this.SelectSettings = this.SelectSettings || {};
        this.SelectSettings.Select = select;

        this.resetSelect = function () {
            this.SelectSettings = null;
        };

        this.SelectSettings.toString = function () {
            return '$select=' + this.Select.join(',');
        };

        return this;
    };

    joData.prototype.resetFilter = function () {
        this.FilterSettings = null;
    };

    var filterObj = function (filterObj, logicalOperator) {
        this.filterObj = filterObj;
        this.logicalOperator = null;
        if (typeof logicalOperator !== 'undefined' || logicalOperator !== null)
            this.logicalOperator = logicalOperator;

        return this;
    };

    joData.prototype.defaultFilter = function (filterClause) {
        this.defaults.FilterDefaults = this.defaults.FilterDefaults || CreateDefaultFilterSettings();
        this.defaults.FilterDefaults.filters.push(new filterObj(filterClause));

        return this;
    };

    joData.prototype.defaultAndFilter = function (filterClause) {
        this.defaults.FilterDefaults = this.defaults.FilterDefaults || CreateDefaultFilterSettings();
        this.defaults.FilterDefaults.filters.push(new filterObj(filterClause, 'and'));

        return this;
    };

    joData.prototype.defaultOrFilter = function (filterClause) {
        this.defaults.FilterDefaults = this.defaults.FilterDefaults || CreateDefaultFilterSettings();
        this.defaults.FilterDefaults.filters.push(new filterObj(filterClause, 'or'));

        return this;
    };

    joData.prototype.filter = function (filterClause) {
        this.FilterSettings = this.FilterSettings || CreateFilterSettings(this.defaults.FilterDefaults);
        settings.filters.push(new filterObj(filterClause));

        return this;
    };

    joData.prototype.andFilter = function (filterClause) {
        this.FilterSettings = this.FilterSettings || CreateFilterSettings(this.defaults.FilterDefaults);
        this.FilterSettings.filters.push(new filterObj(filterClause, 'and'));
        return this;
    };

    joData.prototype.orFilter = function (filterClause) {
        this.FilterSettings = this.FilterSettings || CreateFilterSettings(this.defaults.FilterDefaults);
        this.FilterSettings.filters.push(new filterObj(filterClause, 'or'));
        return this;
    };

    function CreateDefaultFilterSettings() {
        var filterDefaults = { filters: [] };

        filterDefaults.toString = function () {
            var filter = '$filter=';
            for (var i = 0; i < this.filters.length; i++) {
                filter += writeFilter(this.filters[i], i);
            }
            return filter;
        }

        return filterDefaults;
    }

    function CreateFilterSettings(filterDefaults) {
        var filterSettings = { filters: [] };

        filterSettings.toString = function () {
            var allFilters = [];

            if (typeof filterDefaults !== 'undefined') {
                for (var i = 0; i < filterDefaults.filters.length; i++) {
                    allFilters.push(filterDefaults.filters[i]);
                }
            }

            for (var i = 0; i < this.filters.length; i++) {
                allFilters.push(this.filters[i]);
            }

            var filter = '$filter=';

            for (var i = 0; i < allFilters.length; i++) {
                filter += writeFilter(allFilters[i], i)
            }

            return filter;
        };

        return filterSettings;
    }

    var writeFilter = function (filterClause, i) {
        var filter = '';
        if ((typeof filterClause.logicalOperator !== 'undefined' && filterClause.logicalOperator !== null) && i > 0)
            filter += ' ' + filterClause.logicalOperator + ' ';
        else if (i < 0 && (typeof filterClause.logicalOperator === 'undefined' || filterClause.logicalOperator === null))
            filter += ' and ';

        filter += filterClause.filterObj.toString();
        return filter;
    }

    joData.FilterClause = function () { 
        this.property = '';
        this.value = '';
        this.components = [];

        return this;
    };

    joData.FilterClause.prototype.toString = function () {
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

    joData.FilterClause.prototype.Property = function (property) {
        this.property = property;
        this.components.push(function () {
            return property;
        });

        return this;
    };

    //Arithmetic Methods
    joData.FilterClause.prototype.Add = function (amount) {
        return addArithmeticOperator(amount, 'add', this);
    };

    joData.FilterClause.prototype.Sub = function (amount) {
        return addArithmeticOperator(amount, 'sub', this);
    };

    joData.FilterClause.prototype.Mul = function (amount) {
        return addArithmeticOperator(amount, 'mul', this);
    };

    joData.FilterClause.prototype.Div = function (amount) {
        return addArithmeticOperator(amount, 'div', this);
    };

    joData.FilterClause.prototype.Mod = function (amount) {
        return addArithmeticOperator(amount, 'mod', this);
    };

    //Logical Operators
    joData.FilterClause.prototype.Eq = function (value) {
        return addLogicalOperator(value, 'eq', this);
    };

    joData.FilterClause.prototype.Ne = function (value) {
        return addLogicalOperator(value, 'ne', this);
    };

    joData.FilterClause.prototype.Gt = function (value) {
        return addLogicalOperator(value, 'gt', this);
    };

    joData.FilterClause.prototype.Ge = function (value) {
        return addLogicalOperator(value, 'ge', this);
    };

    joData.FilterClause.prototype.Lt = function (value) {
        return addLogicalOperator(value, 'lt', this);
    };

    joData.FilterClause.prototype.Le = function (value) {
        return addLogicalOperator(value, 'le', this);
    };

    //String Functions
    joData.FilterClause.prototype.Substringof = function (value, property) {
        this.components.push(function () {
            return 'substringof(\'' + value + '\',' + property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.Endswith = function (value, property) {
        this.components.push(function () {
            return 'endswith(' + property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Startswith = function (value, property) {
        this.components.push(function () {
            return 'startswith(' + property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Length = function (property) {
        this.components.push(function () {
            return 'length(' + property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.Indexof = function (value, property) {
        this.components.push(function () {
            return 'indexof(' + property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Replace = function (property, find, replace) {
        this.components.push(function () {
            return 'replace(' + property + ',\'' + find + '\',\'' + replace + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Substring = function (property, position, length) {
        this.components.push(function () {
            var comps = [property, position];
            if (typeof length !== 'undefined')
                comps.push(length);

            return 'substring(' + comps.join(',') + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.ToLower = function (property) {
        this.components.push(function () {
            return 'tolower(' + property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.ToUpper = function (property) {
        this.components.push(function () {
            return 'toupper(' + property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.Trim = function (property) {
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
        else if (typeof this.defaults.OrderByDefault !== 'undefined' && this.defaults.OrderByDefault !== null)
            components.push(this.defaults.OrderByDefault.toString());

        if (this.TopSettings !== null)
            components.push(this.TopSettings.toString());
        else if (typeof this.defaults.TopDefault !== 'undefined' && this.defaults.TopDefault !== null)
            components.push(this.defaults.TopDefault.toString());

        if (this.SkipSettings !== null)
            components.push(this.SkipSettings.toString());
        else if (typeof this.defaults.SkipDefault !== 'undefined' && this.defaults.SkipDefault !== null)
            components.push(this.defaults.SkipDefault.toString());

        if (this.SelectSettings !== null)
            components.push(this.SelectSettings.toString());

        if (this.FilterSettings !== null)
            components.push(this.FilterSettings.toString());
        else if (typeof this.defaults.FilterDefaults !== 'undefined' && this.defaults.FilterDefaults !== null)
            components.push(this.defaults.FilterDefaults.toString());

        return url + '?' + components.join('&');
    };

    return this;

})(window);