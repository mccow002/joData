describe('joData', function () {
    it('exists', function () {
        expect(joData).toBeDefined();
    });

    describe('the constructor', function () {
        it('sets the baseUri', function () {
            var j = new joData('http://foo.bar');
            expect(j.baseUri).toEqual('http://foo.bar');
        });
    });

    describe('Order By', function () {
        it('should cause an $orderby query string parameter to appear upon toString', function () {
            var j = new joData('http://foo.bar');
            j.orderBy('baz');

            expect(j.toString()).toEqual('http://foo.bar?$orderby=baz');
        });

        it('allows for desc', function () {
            var j = new joData('http://foo.bar');
            j.orderBy('baz').desc();

            expect(j.toString()).toEqual('http://foo.bar?$orderby=baz desc');
        });

        it('allows for asc', function () {
            var j = new joData('http://foo.bar');
            j.orderBy('baz').asc();

            expect(j.toString()).toEqual('http://foo.bar?$orderby=baz asc');
        });

        it('toggles between orders', function () {
            var j = new joData('http://foo.bar');
            j.toggleOrderBy('baz');
            expect(j.toString()).toEqual('http://foo.bar?$orderby=baz desc');

            j.toggleOrderBy('baz');
            expect(j.toString()).toEqual('http://foo.bar?$orderby=baz asc');
        });

        describe('resets to default', function () {
            it('without default order', function () {
                var j = new joData('http://foo.bar');
                j.setOrderByDefault('CustomerName');

                j.orderBy('OtherValue').asc();
                expect(j.toString()).toEqual('http://foo.bar?$orderby=OtherValue asc');

                j.resetOrderBy();
                expect(j.toString()).toEqual('http://foo.bar?$orderby=CustomerName desc');
            });

            it('with default order', function () {
                var j = new joData('http://foo.bar');
                j.setOrderByDefault('CustomerName', 'asc');

                j.orderBy('OtherValue').desc();
                expect(j.toString()).toEqual('http://foo.bar?$orderby=OtherValue desc');

                j.resetOrderBy();
                expect(j.toString()).toEqual('http://foo.bar?$orderby=CustomerName asc');
            });
        });

        describe('multiple calls', function () {
            it('only keeps the latest of asc or desc', function () {
                var j = new joData('http://foo.bar');
                j.orderBy('baz').desc().asc().desc().asc();

                expect(j.toString()).toEqual('http://foo.bar?$orderby=baz asc');
            });

            it('only keeps the latest of property names', function () {
                var j = new joData('http://foo.bar');
                j.orderBy('baz').orderBy('two');

                expect(j.toString()).toEqual('http://foo.bar?$orderby=two');
            });
        });
    });

    describe('Top', function () {
        it('should cause a $top query string parameter to appear upon toString', function () {
            var j = new joData('http://foo.bar');
            j.top(20);

            expect(j.toString()).toEqual('http://foo.bar?$top=20');
        });

        it('has a default', function () {
            var j = new joData('http://foo.bar');
            j.setTopDefault(10);

            expect(j.toString()).toEqual('http://foo.bar?$top=10');
        });

        it('is reset to default', function () {
            var j = new joData('http://foo.bar');
            j.setTopDefault(10);

            j.top(20);
            expect(j.toString()).toEqual('http://foo.bar?$top=20');

            j.resetTop();
            expect(j.toString()).toEqual('http://foo.bar?$top=10');
        });

        describe('multiple calls', function () {
            it('only keeps the latest top value', function () {
                var j = new joData('http://foo.bar');
                j.top(10).top(20);

                expect(j.toString()).toEqual('http://foo.bar?$top=20');
            });
        });
    });

    describe('Skip', function () {
        it('should cause a $skip query string parameter to appear upon toString', function () {
            var j = new joData('http://foo.bar');
            j.skip(20);

            expect(j.toString()).toEqual('http://foo.bar?$skip=20');
        });

        it('has a default', function () {
            var j = new joData('http://foo.bar');
            j.setSkipDefault(10);

            expect(j.toString()).toEqual('http://foo.bar?$skip=10');
        });

        it('is reset to default', function () {
            var j = new joData('http://foo.bar');
            j.setSkipDefault(10);

            j.skip(20);
            expect(j.toString()).toEqual('http://foo.bar?$skip=20');

            j.resetSkip();
            expect(j.toString()).toEqual('http://foo.bar?$skip=10');
        });

        describe('multiple calls', function () {
            it('only keeps the latest skip value', function () {
                var j = new joData('http://foo.bar');
                j.skip(10).skip(20);

                expect(j.toString()).toEqual('http://foo.bar?$skip=20');
            });
        });
    });

    describe('Select', function () {
        it('joins an array into a $select parameter upon toString', function () {
            var j = new joData('http://foo.bar');
            j.select(['prop1', 'prop2']);

            expect(j.toString()).toEqual('http://foo.bar?$select=prop1,prop2');
        });

        it('is reset', function () {
            var j = new joData('http://foo.bar');
            j.select(['prop1', 'prop2']);

            expect(j.toString()).toEqual('http://foo.bar?$select=prop1,prop2');

            j.resetSelect();
            expect(j.toString()).toEqual('http://foo.bar');
        });

        describe('multiple calls', function () {
            it('only uses the latest array', function () {
                var j = new joData('http://foo.bar');
                j.select(['prop1', 'prop2']);
                j.select(['prop3', 'prop4']);

                expect(j.toString()).toEqual('http://foo.bar?$select=prop3,prop4');
            });
        });
    });

    describe('Expand', function () {
        it('should cause an $expand parameter on toString', function () {
            var j = new joData('http://foo.bar');
            j.expand('Customer');
            expect(j.toString()).toEqual('http://foo.bar?$expand=Customer');
        });

        it('is reset', function () {
            var j = new joData('http://foo.bar');
            j.expand('Customer');
            expect(j.toString()).toEqual('http://foo.bar?$expand=Customer');

            j.resetExpand();
            expect(j.toString()).toEqual('http://foo.bar');
        });
    });

    describe('Format', function () {
        it('Atom', function () {
            var j = new joData('http://foo.bar')
	            .format()
	            .atom();

            expect(j.toString()).toEqual('http://foo.bar?$format=atom');
        });

        it('Xml', function () {
            var j = new joData('http://foo.bar')
	            .format()
	            .xml();

            expect(j.toString()).toEqual('http://foo.bar?$format=xml');
        });

        it('Json', function () {
            var j = new joData('http://foo.bar')
	            .format()
	            .json();

            expect(j.toString()).toEqual('http://foo.bar?$format=json');
        });

        it('Custom', function () {
            var j = new joData('http://foo.bar')
	            .format()
	            .custom('text/csv');

            expect(j.toString()).toEqual('http://foo.bar?$format=text/csv');
        });

        it('is reset', function () {
            var j = new joData('http://foo.bar')
	            .format()
	            .json();

            expect(j.toString()).toEqual('http://foo.bar?$format=json');

            j.resetFormat();
            expect(j.toString()).toEqual('http://foo.bar');
        });
    });

    describe('Inline Count', function () {
        it('allpages', function () {
            var j = new joData('http://foo.bar').inlinecount().allPages();
            expect(j.toString()).toEqual('http://foo.bar?$inlinecount=allpages');
        });

        it('none', function () {
            var j = new joData('http://foo.bar').inlinecount().none();
            expect(j.toString()).toEqual('http://foo.bar?$inlinecount=none');
        });

        it('is reset', function () {
            var j = new joData('http://foo.bar').inlinecount().allPages();
            expect(j.toString()).toEqual('http://foo.bar?$inlinecount=allpages');

            j.resetInlineCount();
            expect(j.toString()).toEqual('http://foo.bar');
        });

        describe('multiple calls', function () {
            it('uses only the latest value', function () {
                var j = new joData('http://foo.bar')
                    .inlinecount()
                    .allPages()
	                .none();

                expect(j.toString()).toEqual('http://foo.bar?$inlinecount=none');
            });
        });
    });

    describe('Filter', function () {
        describe('Building and/or Filters', function () {
            it('single filter', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerId').eq(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId eq 1");
            });

            it('multiple and filters', function () {
                var j = new joData('http://foo.bar');
                j.andFilter(new joData.FilterClause('Property1').eq(5))
                    .andFilter(new joData.FilterClause('Property2').eq(10));

                expect(j.toString()).toEqual("http://foo.bar?$filter=Property1 eq 5 and Property2 eq 10");
            });

            it('multiple or filters', function () {
                var j = new joData('http://foo.bar');
                j.orFilter(new joData.FilterClause('Property1').eq(5))
                    .orFilter(new joData.FilterClause('Property2').eq(10));

                expect(j.toString()).toEqual("http://foo.bar?$filter=Property1 eq 5 or Property2 eq 10");
            });

            it('mixing and/or filters', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('p1').eq(1))
                    .andFilter(new joData.FilterClause('p2').eq(5))
                    .orFilter(new joData.FilterClause('p3').eq(10));

                expect(j.toString()).toEqual("http://foo.bar?$filter=p1 eq 1 and p2 eq 5 or p3 eq 10");
            });

            describe('Default Filters', function () {
                it('single default filter', function () {
                    var j = new joData('http://foo.bar');
                    j.defaultFilter(new joData.FilterClause('CustomerId').eq(1));
                    expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId eq 1");
                });

                it('multiple and filters', function () {
                    var j = new joData('http://foo.bar');
                    j.defaultAndFilter(new joData.FilterClause('Property1').eq(5))
                        .defaultAndFilter(new joData.FilterClause('Property2').eq(10));

                    expect(j.toString()).toEqual("http://foo.bar?$filter=Property1 eq 5 and Property2 eq 10");
                });

                it('multiple or filters', function () {
                    var j = new joData('http://foo.bar');
                    j.defaultOrFilter(new joData.FilterClause('Property1').eq(5))
                        .defaultOrFilter(new joData.FilterClause('Property2').eq(10));

                    expect(j.toString()).toEqual("http://foo.bar?$filter=Property1 eq 5 or Property2 eq 10");
                });

                it('mixing and/or filters', function () {
                    var j = new joData('http://foo.bar');
                    j.defaultFilter(new joData.FilterClause('p1').eq(1))
                        .defaultAndFilter(new joData.FilterClause('p2').eq(5))
                        .defaultOrFilter(new joData.FilterClause('p3').eq(10));

                    expect(j.toString()).toEqual("http://foo.bar?$filter=p1 eq 1 and p2 eq 5 or p3 eq 10");
                });

                it('mixing defaults and normal filters', function () {
                    var j = new joData('http://foo.bar');
                    j.defaultFilter(new joData.FilterClause('Id').eq(1))
                        .filter(new joData.FilterClause('Name').eq('bob'));

                    expect(j.toString()).toEqual("http://foo.bar?$filter=Id eq 1 and Name eq 'bob'");
                });

                it('reset to default filters', function () {
                    var j = new joData('http://foo.bar');
                    j.defaultFilter(new joData.FilterClause('Id').eq(1))
                        .filter(new joData.FilterClause('Name').eq('bob'));

                    expect(j.toString()).toEqual("http://foo.bar?$filter=Id eq 1 and Name eq 'bob'");

                    j.resetFilter();
                    expect(j.toString()).toEqual("http://foo.bar?$filter=Id eq 1");
                });
            });
        });

        describe('Removing Single Filters', function () {
            it('removing a logical operator filter that is the only filter', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').eq('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob'");

                j.removeFilter('CustomerName');
                expect(j.toString()).toEqual("http://foo.bar");
            });

            it('removing a logical operator filter', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').eq('bob'))
                    .andFilter(new joData.FilterClause('CustomerId').eq(1));

                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob' and CustomerId eq 1");

                j.removeFilter('CustomerName');
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId eq 1");
            });

            it('removing a arithmetic method filter', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').eq('bob'))
                    .andFilter(new joData.FilterClause('Price').add(5).eq(1));

                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob' and Price add 5 eq 1");

                j.removeFilter('Price');
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob'");
            });

            it('removing string function filter', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').eq('bob'))
                    .andFilter(new joData.FilterClause('Title').substringof('bob').eq(true));

                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob' and substringof('bob',Title) eq true");

                j.removeFilter('Title');
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob'");
            });

            it('removing date function filter', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').eq('bob'))
                    .andFilter(new joData.FilterClause('Birthday').day().eq(2));

                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob' and day(Birthday) eq 2");

                j.removeFilter('Birthday');
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob'");
            });

            it('removing math function filter', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').eq('bob'))
                    .andFilter(new joData.FilterClause('Price').round().eq(2));

                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob' and round(Price) eq 2");

                j.removeFilter('Price');
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob'");
            });
        });

        describe('Filter Clause', function () {
            it('filter is empty', function () {
                var filter = new joData.FilterClause('CustomerId');
                expect(filter.isEmpty()).toBe(true);
            });

            it('filter not is empty', function () {
                var filter = new joData.FilterClause('CustomerId').eq(1);
                expect(filter.isEmpty()).toBe(false);
            });
        });

        describe('Logical Operators', function () {
            it('Equals - string', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').eq('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName eq 'bob'");
            });

            it('Equals - number', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerId').eq(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId eq 1");
            });

            it('Equals - boolean', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('IsCustomer').eq(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=IsCustomer eq true");
            });

            it('Not Equals - string', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').ne('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName ne 'bob'");
            });

            it('Not Equals - number', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerId').ne(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId ne 1");
            });

            it('Not Equals - boolean', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('IsCustomer').ne(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=IsCustomer ne true");
            });

            it('Greater Than - string', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').gt('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName gt 'bob'");
            });

            it('Greater Than - number', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerId').gt(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId gt 1");
            });

            it('Greater Than - boolean', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('IsCustomer').gt(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=IsCustomer gt true");
            });

            it('Greater Than or Equal - string', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').ge('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName ge 'bob'");
            });

            it('Greater Than or Equal - number', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerId').ge(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId ge 1");
            });

            it('Greater Than or Equal - boolean', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('IsCustomer').ge(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=IsCustomer ge true");
            });

            it('Less Than - string', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').lt('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName lt 'bob'");
            });

            it('Less Than - number', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerId').lt(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId lt 1");
            });

            it('Less Than - boolean', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('IsCustomer').lt(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=IsCustomer lt true");
            });

            it('Less Than or Equal - string', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').le('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerName le 'bob'");
            });

            it('Less Than or Equal - number', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerId').le(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=CustomerId le 1");
            });

            it('Less Than or Equal - boolean', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('IsCustomer').le(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=IsCustomer le true");
            });

            it('Not - non boolean statement', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').not().eq('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=not (CustomerName eq 'bob')");
            });

            it('Not - boolean statement', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('CustomerName').not().endswith('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=not endswith(CustomerName,'bob')");
            });
        });

        describe('Precedence Groups', function () {
            it('creating a precedence group', function () {
                var j = new joData('http://foo.bar');
                var group = new joData.PrecedenceGroup(new joData.FilterClause('Name').eq('Bob'));
                j.filter(group);
                expect(j.toString()).toEqual("http://foo.bar?$filter=(Name eq 'Bob')");
            });

            it('and/or with precedence groups', function () {
                var j = new joData('http://foo.bar');
                var group = new joData.PrecedenceGroup(new joData.FilterClause('Name').eq('Bob'))
                    .orFilter(new joData.FilterClause('Name').eq('George'));
                j.filter(group);

                expect(j.toString()).toEqual("http://foo.bar?$filter=(Name eq 'Bob' or Name eq 'George')");
            });

            it('mixing precedence groups', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Id').eq(1))
                    .andFilter(new joData.PrecedenceGroup(new joData.FilterClause('Name').startswith('a').eq(true))
                        .orFilter(new joData.FilterClause('Name').startswith('b').eq(true)));

                expect(j.toString()).toEqual("http://foo.bar?$filter=Id eq 1 and (startswith(Name,'a') eq true or startswith(Name,'b') eq true)");
            });
        });

        describe('Arithmetic Methods', function () {
            it('Add', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').add(5).eq(10));
                expect(j.toString()).toEqual("http://foo.bar?$filter=Price add 5 eq 10");
            });

            it('Sub', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').sub(5).eq(10));
                expect(j.toString()).toEqual("http://foo.bar?$filter=Price sub 5 eq 10");
            });

            it('Mul', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').mul(5).eq(10));
                expect(j.toString()).toEqual("http://foo.bar?$filter=Price mul 5 eq 10");
            });

            it('Div', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').div(5).eq(10));
                expect(j.toString()).toEqual("http://foo.bar?$filter=Price div 5 eq 10");
            });

            it('Mod', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').mod(5).eq(10));
                expect(j.toString()).toEqual("http://foo.bar?$filter=Price mod 5 eq 10");
            });
        });

        describe('String Functions', function () {
            it('Substringof', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').substringof('test').eq(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=substringof('test',PropertyName) eq true");
            });

            it('Endswith', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').endswith('test').eq(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=endswith(PropertyName,'test') eq true");
            });

            it('Startswith', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').startswith('test').eq(true));
                expect(j.toString()).toEqual("http://foo.bar?$filter=startswith(PropertyName,'test') eq true");
            });

            it('Length', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').length().eq(10));
                expect(j.toString()).toEqual("http://foo.bar?$filter=length(PropertyName) eq 10");
            });

            it('Indexof', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').indexof('test').eq(1));
                expect(j.toString()).toEqual("http://foo.bar?$filter=indexof(PropertyName,'test') eq 1");
            });

            it('Replace', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').replace('test', 'bob').eq('bob'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=replace(PropertyName,'test','bob') eq 'bob'");
            });

            it('Substring - without length', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').substring(1).eq('test'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=substring(PropertyName,1) eq 'test'");
            });
            it('Substring - with length', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').substring(1, 2).eq('test'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=substring(PropertyName,1,2) eq 'test'");
            });

            it('To Lower', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').toLower().eq('test'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=tolower(PropertyName) eq 'test'");
            });

            it('To Upper', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').toUpper().eq('TEST'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=toupper(PropertyName) eq 'TEST'");
            });

            it('Trim', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('PropertyName').trim().eq('test'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=trim(PropertyName) eq 'test'");
            });
        });

        describe('Concatenation', function () {
            it('with nesting', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause().Concat(new joData.Concat('FirstName', 'LastName')).eq('BobSmith'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=concat(FirstName,LastName) eq 'BobSmith'");
            });

            it('with nesting', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause().Concat(new joData.Concat(new joData.Concat('City', literal(', ')), 'State')).eq('Birmingham, Alabama'));
                expect(j.toString()).toEqual("http://foo.bar?$filter=concat(concat(City,', '),State) eq 'Birmingham, Alabama'");
            });
        });

        describe('Date Functions', function () {
            it('Day', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Birthday').day().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=day(Birthday) eq 2");
            });

            it('Hour', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Birthday').hour().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=hour(Birthday) eq 2");
            });

            it('Minute', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Birthday').minute().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=minute(Birthday) eq 2");
            });

            it('Month', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Birthday').month().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=month(Birthday) eq 2");
            });

            it('Second', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Birthday').second().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=second(Birthday) eq 2");
            });

            it('Year', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Birthday').year().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=year(Birthday) eq 2");
            });
        });

        describe('Math Functions', function () {
            it('Round', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').round().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=round(Price) eq 2");
            });

            it('Floor', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').floor().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=floor(Price) eq 2");
            });

            it('Ceiling', function () {
                var j = new joData('http://foo.bar');
                j.filter(new joData.FilterClause('Price').ceiling().eq(2));
                expect(j.toString()).toEqual("http://foo.bar?$filter=ceiling(Price) eq 2");
            });
        });
    });

    
});
