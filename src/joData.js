(function (window) {
    "use strict";
    var jo, FilterObj, Helpers;

    jo = function (baseUri) {
        if (!Array.remove) {
            Array.prototype.remove = function (from, to) {
                if (typeof from !== 'number' || typeof to !== 'number')
                    return this;

                var rest = this.slice((to || from) + 1 || this.length);
                this.length = from < 0 ? this.length + from : from;
                return this.push.apply(this, rest);
            };
        }

        this.baseUri = baseUri;

        this.OrderBySettings = {
            Property: null,
            Order: null,
            DefaultProperty: null,
            DefaultOrder: null,
            toString: function () {
                var qsValue = '$orderby=' + (this.Property || this.DefaultProperty);
                if (this.DefaultOrder !== null || this.Order !== null) {
                    qsValue += ' ' + (this.Order || this.DefaultOrder);
                }

                return qsValue;
            },
            reset: function () {
                this.Property = null;
                this.Order = null;
            },
            isSet: function () {
                return this.Property !== null || this.DefaultProperty !== null;
            }
        };

        this.TopSettings = {
            Top: null,
            DefaultTop: null,
            toString: function () {
                return '$top=' + (this.Top !== null ? this.Top : this.DefaultTop);
            },
            reset: function () {
                this.Top = null;
            },
            isSet: function () {
                return this.Top !== null || this.DefaultTop !== null;
            }
        };

        this.SkipSettings = {
            Skip: null,
            DefaultSkip: null,
            toString: function () {
                return '$skip=' + (this.Skip !== null ? this.Skip : this.DefaultSkip);
            },
            reset: function () {
                this.Skip = null;
            },
            isSet: function () {
                return this.Skip !== null || this.DefaultSkip !== null;
            }
        };

        this.SelectSettings = {
            Select: null,
            DefaultSelect: null,
            toString: function () {
                var selectArray = (this.Select || this.DefaultSelect);
                return '$select=' + selectArray.join(',');
            },
            reset: function () {
                this.Select = null;
            },
            isSet: function () {
                return this.Select !== null || this.DefaultSelect !== null;
            }
        };

        this.ExpandSettings = {
            Expand: null,
            DefaultExpand: null,
            toString: function () {
                return '$expand=' + (this.Expand || this.DefaultExpand);
            },
            reset: function () {
                this.Expand = null;
            },
            isSet: function () {
                return this.Expand !== null || this.DefaultExpand !== null;
            }
        };

        this.FormatSettings = {
            Format: null,
            DefaultFormat: null,
            toString: function () {
                return '$format=' + (this.Format || this.DefaultFormat);
            },
            reset: function () {
                this.Format = null;
            },
            isSet: function () {
                return this.Format !== null || this.DefaultFormat !== null;
            }
        };

        this.InlineCountSettings = {
            InlineCount: null,
            DefaultInlineCount: null,
            toString: function () {
                return '$inlinecount=' + (this.InlineCount || this.DefaultInlineCount);
            },
            reset: function () {
                this.InlineCount = null;
            },
            isSet: function () {
                return this.InlineCount !== null || this.DefaultInlineCount !== null;
            }
        };

        this.FilterSettings = {
            Filters: [],
            DefaultFilters: [],
            CapturedFilter: [],
            toString: function () {
                var allFilters, i, filter;

                allFilters = [];
                filter = '$filter=';

                if (this.DefaultFilters.length > 0) {
                    for (i = 0; i < this.DefaultFilters.length; i++) {
                        allFilters.push(this.DefaultFilters[i]);
                    }
                }

                for (i = 0; i < this.Filters.length; i++) {
                    allFilters.push(this.Filters[i]);
                }

                for (i = 0; i < allFilters.length; i++) {
                    filter += allFilters[i].toString(i);
                }

                return filter;
            },
            reset: function () {
                this.Filters = [];
                if (this.CapturedFilter.length > 0) {
                    for (var i = 0; i < this.CapturedFilter.length; i++) {
                        this.Filters.push(this.CapturedFilter[i]);
                    }
                }
            },
            fullReset: function () {
                this.Filters = [];
                this.CapturedFilter = [];
            },
            isSet: function () {
                return this.Filters.length > 0 || this.DefaultFilters.length > 0;
            },
            loadFromJson: function (filterSettings) {
                var i, filter, newFilterClause, loadPrecedenceGroup, loadFilterObj;

                loadPrecedenceGroup = function (precedenceGroup) {
                    var j, group, currentClause;

                    group = new jo.PrecedenceGroup();

                    for (j = 0; j < precedenceGroup.clauses.length; j++) {
                        currentClause = precedenceGroup.clauses[j];
                        group.clauses.push(new FilterObj(loadFilterObj(currentClause.filterObj), currentClause.logicalOperator));
                    }

                    return group;
                };

                loadFilterObj = function (currentFilter) {
                    if (currentFilter.clauses !== undefined) {
                        return loadPrecedenceGroup(currentFilter);
                    }

                    var key;

                    newFilterClause = new jo.FilterClause();

                    for (key in currentFilter) {
                        if (currentFilter.hasOwnProperty(key)) {
                            newFilterClause[key] = currentFilter[key];
                        }
                    }

                    return newFilterClause;
                };

                for (i = 0; i < filterSettings.Filters.length; i++) {
                    filter = filterSettings.Filters[i];
                    this.Filters.push(new FilterObj(loadFilterObj(filter.filterObj), filter.logicalOperator));
                }

                for (i = 0; i < filterSettings.DefaultFilters.length; i++) {
                    filter = filterSettings.DefaultFilters[i];
                    this.DefaultFilters.push(new FilterObj(loadFilterObj(filter.filterObj), filter.logicalOperator));
                }
            }
        };
    };

    jo.prototype = {
        baseUri: '',
        currentHashRoute: '',
        updateHashRoute: function (hashRoute) {
            this.currentHashRoute = hashRoute;
        },
        setOrderByDefault: function (property, order) {
            this.OrderBySettings.DefaultProperty = property;
            this.OrderBySettings.DefaultOrder = order === undefined ? 'desc' : order;
            return this;
        },
        toggleOrderBy: function (property, callback) {
            var useDesc = (this.OrderBySettings.Property === null || this.OrderBySettings.Order === 'asc');
            this.orderBy(property)[useDesc ? 'desc' : 'asc']();

            if (callback && typeof callback === 'function') {
                callback.call(this);
            }

            return this;
        },
        orderBy: function (property) {
            this.OrderBySettings.Property = property;
            return this;
        },
        desc: function () {
            this.OrderBySettings.Order = 'desc';
            return this;
        },
        asc: function () {
            this.OrderBySettings.Order = 'asc';
            return this;
        },
        resetOrderBy: function () {
            this.OrderBySettings.reset();
            return this;
        },
        setTopDefault: function (top) {
            this.TopSettings.DefaultTop = top;
            return this;
        },
        top: function (top) {
            this.TopSettings.Top = top;
            return this;
        },
        resetTop: function () {
            this.TopSettings.reset();
            return this;
        },
        setSkipDefault: function (skip) {
            this.SkipSettings.DefaultSkip = skip;
            return this;
        },
        skip: function (skip) {
            this.SkipSettings.Skip = skip;
            return this;
        },
        resetSkip: function () {
            this.SkipSettings.reset();
            return this;
        },
        setSelectDefault: function (select) {
            this.SelectSettings.DefaultSelect = select;
            return this;
        },
        select: function (select) {
            this.SelectSettings.Select = select;
            return this;
        },
        resetSelect: function () {
            this.SelectSettings.reset();
            return this;
        },
        setExpandDefault: function (expand) {
            this.ExpandSettings.DefaultExpand = expand;
            return this;
        },
        expand: function (expand) {
            this.ExpandSettings.Expand = expand;
            return this;
        },
        resetExpand: function () {
            this.ExpandSettings.reset();
        },
        formatDefault: function () {
            var that = this;

            this.atom = function () {
                that.FormatSettings.DefaultFormat = 'atom';
                return that;
            };

            this.xml = function () {
                that.FormatSettings.DefaultFormat = 'xml';
                return that;
            };

            this.json = function () {
                that.FormatSettings.DefaultFormat = 'json';
                return that;
            };

            this.custom = function (value) {
                that.FormatSettings.DefaultFormat = value;
                return that;
            };

            return that;
        },
        format: function () {
            var that = this;

            this.atom = function () {
                that.FormatSettings.Format = 'atom';
                return that;
            };

            this.xml = function () {
                that.FormatSettings.Format = 'xml';
                return that;
            };

            this.json = function () {
                that.FormatSettings.Format = 'json';
                return that;
            };

            this.custom = function (value) {
                that.FormatSettings.Format = value;
                return that;
            };

            return this;
        },
        resetFormat: function () {
            this.FormatSettings.reset();
        },
        inlineCountDefault: function () {
            var that = this;

            this.allPages = function () {
                that.InlineCountSettings.DefaultInlineCount = 'allpages';
                return that;
            };

            this.none = function () {
                that.InlineCountSettings.DefaultInlineCount = 'none';
                return that;
            };

            return this;
        },
        inlineCount: function () {
            var that = this;

            this.allPages = function () {
                that.InlineCountSettings.InlineCount = 'allpages';
                return that;
            };

            this.none = function () {
                that.InlineCountSettings.InlineCount = 'none';
                return that;
            };

            return this;
        },
        resetInlineCount: function () {
            this.InlineCountSettings.reset();
            return this;
        },
        captureFilter: function () {
            this.FilterSettings.CapturedFilter = [];
            for (var i = 0; i < this.FilterSettings.Filters.length; i++) {
                this.FilterSettings.CapturedFilter.push(this.FilterSettings.Filters[i]);
            }
        },
        resetFilter: function () {
            this.FilterSettings.fullReset();
            return this;
        },
        resetToCapturedFilter: function () {
            this.FilterSettings.reset();
            return this;
        },
        removeFilter: function (property) {
            var i;

            if (!this.FilterSettings.isSet()) {
                return this;
            }

            for (i = 0; i < this.FilterSettings.Filters.length; i++) {
                if (this.FilterSettings.Filters[i].filterObj.Property === property) {
                    this.FilterSettings.Filters.splice(i, 1);
                }
            }

            return this;
        },
        defaultFilter: function (filterClause) {
            this.FilterSettings.DefaultFilters.push(new FilterObj(filterClause));
            return this;
        },
        defaultAndFilter: function (filterClause) {
            this.FilterSettings.DefaultFilters.push(new FilterObj(filterClause, 'and'));
            return this;
        },
        defaultOrFilter: function (filterClause) {
            this.FilterSettings.DefaultFilters.push(new FilterObj(filterClause, 'or'));
            return this;
        },
        filter: function (filterClause) {
            this.FilterSettings.Filters.push(new FilterObj(filterClause));
            return this;
        },
        andFilter: function (filterClause) {
            this.FilterSettings.Filters.push(new FilterObj(filterClause, 'and'));
            return this;
        },
        orFilter: function (filterClause) {
            this.FilterSettings.Filters.push(new FilterObj(filterClause, 'or'));
            return this;
        },
        //toString()
        toString: function () {
            var url, components;

            url = this.baseUri;
            components = [];

            if (this.OrderBySettings.isSet()) {
                components.push(this.OrderBySettings.toString());
            }

            if (this.TopSettings.isSet()) {
                components.push(this.TopSettings.toString());
            }

            if (this.SkipSettings.isSet()) {
                components.push(this.SkipSettings.toString());
            }

            if (this.SelectSettings.isSet()) {
                components.push(this.SelectSettings.toString());
            }

            if (this.FilterSettings.isSet()) {
                components.push(this.FilterSettings.toString());
            }

            if (this.ExpandSettings.isSet()) {
                components.push(this.ExpandSettings.toString());
            }

            if (this.FormatSettings.isSet()) {
                components.push(this.FormatSettings.toString());
            }

            if (this.InlineCountSettings.isSet()) {
                components.push(this.InlineCountSettings.toString());
            }

            return components.length > 0 ? url + '?' + components.join('&') : url;
        },
        toJson: function () {
            var jsonObj = {};

            jsonObj.baseUri = this.baseUri;
            jsonObj.currentHashRoute = this.currentHashRoute;

            jsonObj.OrderBySettings = null;
            jsonObj.TopSettings = null;
            jsonObj.SkipSettings = null;
            jsonObj.SelectSettings = null;
            jsonObj.ExpandSettings = null;
            jsonObj.FormatSettings = null;
            jsonObj.InlineCountSettings = null;
            jsonObj.FilterSettings = null;

            jsonObj.defaults = this.defaults;

            if (this.OrderBySettings.isSet()) {
                jsonObj.OrderBySettings = this.OrderBySettings;
            }

            if (this.TopSettings.isSet()) {
                jsonObj.TopSettings = this.TopSettings;
            }

            if (this.SkipSettings.isSet()) {
                jsonObj.SkipSettings = this.SkipSettings;
            }

            if (this.SelectSettings.isSet()) {
                jsonObj.SelectSettings = this.SelectSettings;
            }

            if (this.ExpandSettings.isSet()) {
                jsonObj.ExpandSettings = this.ExpandSettings;
            }

            if (this.FormatSettings.isSet()) {
                jsonObj.FormatSettings = this.FormatSettings;
            }

            if (this.InlineCountSettings.isSet()) {
                jsonObj.InlineCountSettings = this.InlineCountSettings;
            }

            if (this.FilterSettings.isSet()) {
                jsonObj.FilterSettings = this.FilterSettings;
            }

            return JSON.stringify(jsonObj);
        },
        saveLocal: function (key) {
            var json, storageKey;

            json = this.toJson();
            storageKey = key || 'joData.StorageKey';

            localStorage.setItem(storageKey, json);
        }
    };

    jo.loadLocal = function (storageKey) {
        var actualKey, jsonStr, json, joDataObj, key;

        actualKey = storageKey || 'joData.StorageKey';

        jsonStr = localStorage.getItem(actualKey);
        if (jsonStr === null) {
            console.log('Nothing was found in localStorage');
            return null;
        }

        json = JSON.parse(jsonStr);
        joDataObj = new jo(json.baseUri);
        joDataObj.currentHashRoute = json.currentHashRoute;

        if (json.OrderBySettings !== null) {
            for (key in json.OrderBySettings) {
                if (json.OrderBySettings.hasOwnProperty(key)) {
                    joDataObj.OrderBySettings[key] = json.OrderBySettings[key];
                }
            }
        }

        if (json.TopSettings !== null) {
            for (key in json.TopSettings) {
                if (json.TopSettings.hasOwnProperty(key)) {
                    joDataObj.TopSettings[key] = json.TopSettings[key];
                }
            }
        }

        if (json.SkipSettings !== null) {
            for (key in json.SkipSettings) {
                if (json.SkipSettings.hasOwnProperty(key)) {
                    joDataObj.SkipSettings[key] = json.SkipSettings[key];
                }
            }
        }

        if (json.SelectSettings !== null) {
            for (key in json.SelectSettings) {
                if (json.SelectSettings.hasOwnProperty(key)) {
                    joDataObj.SelectSettings[key] = json.SelectSettings[key];
                }
            }
        }

        if (json.ExpandSettings !== null) {
            for (key in json.ExpandSettings) {
                if (json.ExpandSettings.hasOwnProperty(key)) {
                    joDataObj.ExpandSettings[key] = json.ExpandSettings[key];
                }
            }
        }

        if (json.FormatSettings !== null) {
            for (key in json.FormatSettings) {
                if (json.FormatSettings.hasOwnProperty(key)) {
                    joDataObj.FormatSettings[key] = json.FormatSettings[key];
                }
            }
        }

        if (json.InlineCountSettings !== null) {
            for (key in json.InlineCountSettings) {
                if (json.InlineCountSettings.hasOwnProperty(key)) {
                    joDataObj.InlineCountSettings[key] = json.InlineCountSettings[key];
                }
            }
        }

        if (json.FilterSettings !== null) {
            joDataObj.FilterSettings.loadFromJson(json.FilterSettings);
        }

        return joDataObj;
    };

    FilterObj = function (filterObj, logicalOperator) {
        this.filterObj = filterObj;
        this.logicalOperator = null;
        if (logicalOperator !== undefined && logicalOperator !== null) {
            this.logicalOperator = logicalOperator;
        }

        return this;
    };

    FilterObj.prototype = {
        filterObj: null,
        logicalOperator: null,
        toString: function (i) {
            var filter = '';
            if (this.logicalOperator !== null && i > 0) {
                filter += ' ' + this.logicalOperator + ' ';
            } else if (i > 0 && this.logicalOperator === null) {
                filter += ' and ';
            }

            filter += this.filterObj.toString();
            return filter;
        }
    };

    jo.PrecedenceGroup = function (filterClause) {
        if (!filterClause instanceof jo.FilterClause) {
            throw 'filterClause must be of type jo.FilterClause!';
        }

        this.clauses = [];

        if (filterClause !== undefined) {
            this.clauses.push(new FilterObj(filterClause));
        }

        return this;
    };

    jo.PrecedenceGroup.prototype = {
        clauses: [],
        isEmpty: function () {
            return this.clauses.length === 0;
        },
        andFilter: function (filterClause) {
            if (!filterClause instanceof jo.FilterClause) {
                throw 'filterClause must be of type jo.FilterClause!';
            }

            this.clauses.push(new FilterObj(filterClause, 'and'));
            return this;
        },
        orFilter: function (filterClause) {
            if (!filterClause instanceof jo.FilterClause) {
                throw 'filterClause must be of type jo.FilterClause!';
            }

            this.clauses.push(new FilterObj(filterClause, 'or'));
            return this;
        },
        toString: function () {
            var filter, i;
            filter = '(';
            for (i = 0; i < this.clauses.length; i++) {
                filter += this.clauses[i].toString(i);
            }
            filter += ')';

            return filter;
        }
    };

    jo.literal = function (stringLiteral) {
        return "'" + stringLiteral.toString() + "'";
    };

    jo.datetime = function (datetime) {
        return "datetime'" + datetime + "'";
    };

    jo.decimal = function (decimal) {
        return decimal + 'm';
    };

    jo.guid = function (guid) {
        return "guid'" + guid + "'";
    };

    jo.single = function (single) {
        return single + 'f';
    };

    jo.double = function (double) {
        return double + 'd';
    };

    jo.Concat = function (value1, value2) {
        this.LeftSide = value1;
        this.RightSide = value2;
        return this;
    };

    jo.Concat.prototype = {
        LeftSide: null,
        RightSide: null,
        toString: function () {
            var that = this;

            function writeValue(value) {
                if (typeof value === 'object') {
                    return value.toString();
                }
                if (typeof value === 'function') {
                    return value.call(that);
                }
                return value.toString();
            }

            return 'concat(' + writeValue(this.LeftSide) + ',' + writeValue(this.RightSide) + ')';
        }
    };

    jo.FilterClause = function (property) {
        this.Property = property;
        this.Components = [];
        return this;
    };

    jo.FilterClause.prototype = {
        Property: null,
        Value: null,
        IsClauseEmpty: true,
        PropertyIncluded: false,
        UsingNot: false,
        FuncReturnType: null,
        transformFunc: null,
        Components: [],
        toString: function () {
            var strComps, i, filterStr;
            strComps = [];

            if (!this.PropertyIncluded) {
                strComps.push(this.Property);
            }

            for (i = 0; i < this.Components.length; i++) {
                strComps.push(this.Components[i]);
            }
            filterStr = strComps.join(' ');

            if (!this.UsingNot) {
                return filterStr;
            }

            return typeof this.FuncReturnType === 'boolean' ? 'not ' + filterStr : 'not (' + filterStr + ')';
        },
        isEmpty: function () {
            return this.IsClauseEmpty || (this.PropertyIncluded && this.UsingNot);
        },
        //Arithmetic Methods
        add: function (amount) {
            return Helpers.addArithmeticOperator(amount, 'add', this);
        },
        sub: function (amount) {
            return Helpers.addArithmeticOperator(amount, 'sub', this);
        },
        mul: function (amount) {
            return Helpers.addArithmeticOperator(amount, 'mul', this);
        },
        div: function (amount) {
            return Helpers.addArithmeticOperator(amount, 'div', this);
        },
        mod: function (amount) {
            return Helpers.addArithmeticOperator(amount, 'mod', this);
        },
        //Logical Operators
        eq: function (value) {
            return Helpers.addLogicalOperator(value, 'eq', this);
        },
        ne: function (value) {
            return Helpers.addLogicalOperator(value, 'ne', this);
        },
        gt: function (value) {
            return Helpers.addLogicalOperator(value, 'gt', this);
        },
        ge: function (value) {
            return Helpers.addLogicalOperator(value, 'ge', this);
        },
        lt: function (value) {
            return Helpers.addLogicalOperator(value, 'lt', this);
        },
        le: function (value) {
            return Helpers.addLogicalOperator(value, 'le', this);
        },
        not: function () {
            this.UsingNot = true;
            return this;
        },
        //String Functions
        substringof: function (value) {
            this.PropertyIncluded = true;
            this.FuncReturnType = Boolean();
            var that = this;

            var property = this.Property;
            if (this.transformFunc !== null) {
                property = this.Components[this.Components.length - 1];
                this.Components.splice(this.Components.length - 1, 1);
            }

            this.Components.push('substringof(\'' + value + '\',' + property + ')');

            return this;
        },
        endswith: function (value) {
            this.PropertyIncluded = true;
            this.FuncReturnType = Boolean();
            var that = this;
            this.Components.push('endswith(' + that.Property + ',\'' + value + '\')');

            return this;
        },
        startswith: function (value) {
            this.PropertyIncluded = true;
            this.FuncReturnType = Boolean();
            var that = this;
            this.Components.push('startswith(' + that.Property + ',\'' + value + '\')');

            return this;
        },
        length: function () {
            this.PropertyIncluded = true;
            this.FuncReturnType = Number();
            var that = this;
            this.Components.push('length(' + that.Property + ')');

            return this;
        },
        indexof: function (value) {
            this.PropertyIncluded = true;
            this.FuncReturnType = Number();
            var that = this;
            this.Components.push('indexof(' + that.Property + ',\'' + value + '\')');

            return this;
        },
        replace: function (find, replace) {
            this.PropertyIncluded = true;
            this.FuncReturnType = String();
            var that = this;
            this.Components.push('replace(' + that.Property + ',\'' + find + '\',\'' + replace + '\')');

            return this;
        },
        substring: function (position, length) {
            this.PropertyIncluded = true;
            this.FuncReturnType = String();

            var comps = [this.Property, position];
            if (length !== undefined) {
                comps.push(length);
            }

            this.Components.push('substring(' + comps.join(',') + ')');

            return this;
        },
        toLower: function () {
            this.PropertyIncluded = true;
            this.FuncReturnType = String();
            var that = this;

            this.transformFunc = this.toLower;
            this.Components.push('tolower(' + that.Property + ')');

            return this;
        },
        toUpper: function () {
            this.PropertyIncluded = true;
            this.FuncReturnType = String();
            var that = this;

            this.transformFunc = this.toUpper;
            this.Components.push('toupper(' + that.Property + ')');

            return this;
        },
        trim: function () {
            this.PropertyIncluded = true;
            this.FuncReturnType = String();
            var that = this;

            this.transformFunc = this.trim;
            this.Components.push('trim(' + that.Property + ')');

            return this;
        },
        Concat: function (concat) {
            this.PropertyIncluded = true;
            this.FuncReturnType = String();
            var that = this;
            that.Components.push(concat.toString());

            return this;
        },
        //Date/Time Functions
        day: function () {
            return Helpers.addMethodWrapper(this, 'day');
        },
        hour: function () {
            return Helpers.addMethodWrapper(this, 'hour');
        },
        minute: function () {
            return Helpers.addMethodWrapper(this, 'minute');
        },
        month: function () {
            return Helpers.addMethodWrapper(this, 'month');
        },
        second: function () {
            return Helpers.addMethodWrapper(this, 'second');
        },
        year: function () {
            return Helpers.addMethodWrapper(this, 'year');
        },
        //Math Functions
        round: function () {
            return Helpers.addMethodWrapper(this, 'round');
        },
        floor: function () {
            return Helpers.addMethodWrapper(this, 'floor');
        },
        ceiling: function () {
            return Helpers.addMethodWrapper(this, 'ceiling');
        }
    };

    Helpers = {
        formatValue: function (value) {
            if (value.length > 8 && value.substring(0, 8) === 'datetime') {
                return value;
            }

            if (value.length > 4 && value.substring(0, 4) === 'guid') {
                return value;
            }

            if (typeof value === 'string') {
                var numberSuffixes = ['m', 'f', 'd'];
                for (var i = 0; i < numberSuffixes.length; i++) {
                    var suffix = numberSuffixes[i];
                    if (value.indexOf(suffix, value.length - suffix.length) !== -1) {
                        var numberValue = value.substring(0, value.length - 1);
                        if (!isNaN(numberValue)) {
                            return value;
                        }
                    }
                }

                return "'" + value + "'";
            }

            return value;
        },
        addLogicalOperator: function (value, operator, filterClause) {
            filterClause.Value = value;
            filterClause.IsClauseEmpty = false;

            filterClause.Components.push(operator + ' ' + this.formatValue(value));

            return filterClause;
        },
        addArithmeticOperator: function (amount, operator, filterClause) {
            filterClause.Components.push(operator + ' ' + amount);
            return filterClause;
        },
        addMethodWrapper: function (filterClause, func) {
            filterClause.PropertyIncluded = true;
            filterClause.FuncReturnType = Number();
            var that = filterClause;
            filterClause.Components.push(func + '(' + that.Property + ')');

            return filterClause;
        }
    };

    window.jo = jo;

} (window));