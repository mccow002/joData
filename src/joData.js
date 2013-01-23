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

    function orderByToString(property, order) {
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
        return this;
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
        this.FilterSettings.filters.push(new filterObj(filterClause));

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

    joData.FilterClause = function (property) {
        this.property = property;
        this.value = '';

        this.isEmpty = true;
        this.propertyIncluded = false;
        this.usingNot = false;
        this.funcReturnType = null;

        this.components = [];

        return this;
    };

    joData.FilterClause.prototype.toString = function () {
        var strComps = [];
        
        if (!this.propertyIncluded)
            strComps.push(this.property);

        for (var i = 0; i < this.components.length; i++) {
            strComps.push(this.components[i]());
        }
        var filterStr = strComps.join(' ');

        if (!this.usingNot)
            return filterStr;

        if (typeof this.funcReturnType === 'boolean')
            return 'not ' + filterStr;
        else
            return 'not (' + filterStr + ')';
    };

    joData.FilterClause.prototype.isEmpty = function () {
        return this.isEmpty || (this.propertyIncluded && this.usingNot);
    }

    function formatValue(value) {
        if (typeof value === 'string')
            return "'" + value + "'";

        return value;
    };

    function addLogicalOperator(value, operator, filterClause) {
        filterClause.value = value;
        filterClause.isEmpty = false;

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

    joData.FilterClause.prototype.Not = function () {
        this.usingNot = true;
        return this;
    }

    //String Functions
    joData.FilterClause.prototype.Substringof = function (value) {
        this.propertyIncluded = true;
        this.funcReturnType = Boolean();
        var that = this;
        this.components.push(function () {
            return 'substringof(\'' + value + '\',' + that.property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.Endswith = function (value) {
        this.propertyIncluded = true;
        this.funcReturnType = Boolean();
        var that = this;
        this.components.push(function () {
            return 'endswith(' + that.property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Startswith = function (value) {
        this.propertyIncluded = true;
        this.funcReturnType = Boolean();
        var that = this;
        this.components.push(function () {
            return 'startswith(' + that.property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Length = function () {
        this.propertyIncluded = true;
        this.funcReturnType = Number();
        var that = this;
        this.components.push(function () {
            return 'length(' + that.property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.Indexof = function (value) {
        this.propertyIncluded = true;
        this.funcReturnType = Number();
        var that = this;
        this.components.push(function () {
            return 'indexof(' + that.property + ',\'' + value + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Replace = function (find, replace) {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        var that = this;
        this.components.push(function () {
            return 'replace(' + that.property + ',\'' + find + '\',\'' + replace + '\')';
        });

        return this;
    };

    joData.FilterClause.prototype.Substring = function (position, length) {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        var that = this;
        this.components.push(function () {
            var comps = [that.property, position];
            if (typeof length !== 'undefined')
                comps.push(length);

            return 'substring(' + comps.join(',') + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.ToLower = function () {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        var that = this;
        this.components.push(function () {
            return 'tolower(' + that.property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.ToUpper = function () {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        var that = this;
        this.components.push(function () {
            return 'toupper(' + that.property + ')';
        });

        return this;
    };

    joData.FilterClause.prototype.Trim = function () {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        var that = this;
        this.components.push(function () {
            return 'trim(' + that.property + ')';
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

        return components.length > 0 ?
            url + '?' + components.join('&') :
            url;
    };

    return this;

})(window);