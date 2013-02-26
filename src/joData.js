(function (window) {
    window.joData = function (baseUri) {
        this.baseUri = baseUri;

        this.OrderBySettings = null;
        this.TopSettings = null;
        this.SkipSettings = null;
        this.FilterSettings = null;
        this.SelectSettings = null;
        this.ExpandSettings = null;
        this.FormatSettings = null;
        this.InlineCountSettings = null;

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
        else
            orderByDefaults.Order = 'desc';

        this.defaults.OrderByDefault = orderByDefaults;
        return this;
    };

    joData.prototype.toggleOrderBy = function (property, callback) {

        if (this.OrderBySettings === null || this.OrderBySettings.Order === 'asc')
            this.orderBy(property).desc();
        else
            this.orderBy(property).asc();

        if (callback && typeof callback === 'function')
            callback.call(this);

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

        this.OrderBySettings.toString = function () {
            return orderByToString(this.Property, this.Order);
        };

        return this;
    };

    joData.prototype.resetOrderBy = function () {
        this.OrderBySettings = null;
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

        this.TopSettings.toString = function () {
            return topToString(this.Top);
        };

        return this;
    };

    this.resetTop = function () {
        this.TopSettings = null;
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

        this.SkipSettings.toString = function () {
            return skipToString(this.Skip);
        };

        return this;
    };

    this.resetSkip = function () {
        this.SkipSettings = null;
    };

    function skipToString(skip) {
        return '$skip=' + skip;
    };

    joData.prototype.select = function (select) {
        this.SelectSettings = this.SelectSettings || {};
        this.SelectSettings.Select = select;

        this.SelectSettings.toString = function () {
            return '$select=' + this.Select.join(',');
        };

        return this;
    };
    
    joData.prototype.resetSelect = function () {
    	this.SelectSettings = null;
    	return this;
    };

    joData.prototype.expand = function (expand) {
        this.ExpandSettings = this.ExpandSettings || {};
        this.ExpandSettings.Expand = expand;

        this.resetExpand = function () {
            this.ExpandSettings = null;
            return this;
        };

        this.ExpandSettings.toString = function () {
            return '$expand=' + this.Expand;
        };
    }

    joData.prototype.format = function () {
        this.FormatSettings = this.FormatSettings || {};

        this.Atom = function () {
            this.FormatSettings.Format = 'atom';
            return this;
        };

        this.Xml = function () {
            this.FormatSettings.Format = 'xml';
            return this;
        };

        this.Json = function () {
            this.FormatSettings.Format = 'json';
            return this;
        };

        this.Custom = function (value) {
            this.FormatSettings.Format = value;
            return this;
        };

        this.resetFormat = function () {
            this.FormatSettings = null;
            return this;
        };

        this.FormatSettings.toString = function () {
            return '$format=' + this.Format;
        };

        return this;
    };

    joData.prototype.inlinecount = function () {
        this.InlineCountSettings = this.InlineCountSettings || {};

        this.AllPages = function () {
            this.InlineCountSettings.InlineCount = 'allpages';
            return this;
        };

        this.None = function () {
            this.InlineCountSettings.InlineCount = 'none';
            return this;
        };

        this.resetInlineCount = function () {
            this.InlineCountSettings = null;
            return this;
        };

        this.InlineCountSettings.toString = function () {
            return '$inlinecount=' + this.InlineCount;
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
    };

    joData.PrecedenceGroup = function (filterClause) {
        if (!filterClause instanceof joData.FilterClause)
            throw 'filterClause must be of type joData.FilterClause!';

        this.clauses = [];
        this.clauses.push(new filterObj(filterClause));

        return this;
    };

    joData.PrecedenceGroup.prototype.andFilter = function (filterClause) {
        if (!filterClause instanceof joData.FilterClause)
            throw 'filterClause must be of type joData.FilterClause!';

        this.clauses.push(new filterObj(filterClause, 'and'));
        return this;
    };

    joData.PrecedenceGroup.prototype.orFilter = function (filterClause) {
        if (!filterClause instanceof joData.FilterClause)
            throw 'filterClause must be of type joData.FilterClause!';

        this.clauses.push(new filterObj(filterClause, 'or'));
        return this;
    };

    joData.PrecedenceGroup.prototype.toString = function () {
        var filter = '(';
        for (var i = 0; i < this.clauses.length; i++) {
            filter += writeFilter(this.clauses[i], i);
        }
        filter += ')';

        return filter;
    };

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
    };

    function formatValue(value) {
        if (value.length > 8 && value.substring(0, 8) === 'datetime')
            return value;

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
    };

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

    joData.FilterClause.prototype.Concat = function (concat) {
        this.propertyIncluded = true;
        this.funcReturnType = String();
        var that = this;
        that.components.push(function () {
            return concat.toString();
        });

        return this;
    };

    joData.Concat = function (value1, value2) {
        this.parts = [value1, value2];

        this.toString = function () {
            function writeValue(value) {
                if (typeof value === 'object')
                    return value.toString();
                else
                    return "'" + value.toString() + "'";
            };

            return 'concat(' + writeValue(value1) + ',' + writeValue(value2) + ')';
        };

        return this;
    };

    //Date Functions
    function addDateFunction(filterClause, func) {
        filterClause.propertyIncluded = true;
        filterClause.funcReturnType = Number();
        var that = filterClause;
        filterClause.components.push(function () {
            return func + '(' + that.property + ')';
        });

        return filterClause;
    }

    joData.FilterClause.prototype.Day = function () {
        return addDateFunction(this, 'day');
    };

    joData.FilterClause.prototype.Hour = function () {
        return addDateFunction(this, 'hour');
    };

    joData.FilterClause.prototype.Minute = function () {
        return addDateFunction(this, 'minute');
    };

    joData.FilterClause.prototype.Month = function () {
        return addDateFunction(this, 'month');
    };

    joData.FilterClause.prototype.Second = function () {
        return addDateFunction(this, 'second');
    };

    joData.FilterClause.prototype.Year = function () {
        return addDateFunction(this, 'year');
    };

    //Math Functions
    function addMathFunction(filterClause, func) {
        filterClause.propertyIncluded = true;
        filterClause.funcReturnType = Number();
        var that = filterClause;
        filterClause.components.push(function () {
            return func + '(' + that.property + ')';
        });

        return filterClause;
    }

    joData.FilterClause.prototype.Round = function () {
        return addDateFunction(this, 'round');
    };

    joData.FilterClause.prototype.Floor = function () {
        return addDateFunction(this, 'floor');
    };

    joData.FilterClause.prototype.Ceiling = function () {
        return addDateFunction(this, 'ceiling');
    };

    //toString()
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

        if (this.ExpandSettings !== null)
            components.push(this.ExpandSettings.toString());

        if (this.FormatSettings !== null)
            components.push(this.FormatSettings.toString());

        if (this.InlineCountSettings !== null)
            components.push(this.InlineCountSettings.toString());

        return components.length > 0 ?
            url + '?' + components.join('&') :
            url;
    };

    joData.prototype.saveLocal = function () {
        if (!canSaveLocal())
            return;

        alert(JSON.stringify(this));
    }

    function canSaveLocal() {
        var hasLocalStorage = (window['localStorage'] !== null && window.localStorage !== 'undefined');
        var hasJson = (window['JSON'] !== null && window.localStorage !== 'undefined');

        return hasLocalStorage && hasJson;
    }

    return this;

})(window);