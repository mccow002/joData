joData
======

[![Build Status](https://travis-ci.org/mccow002/joData.png?branch=master)](https://travis-ci.org/mccow002/joData)

A pure javascript library to help you query jo data.

joData creates a javascript object that represents an oData query. This allows you to easily modify parts of your oData query without effecting the rest of it.

All methods in joData are chainable.

##NOTE:

As of version 1.1, the joData object has been renamed jo. Also, all cast methods such as datetime or decimal are no attached to the jo object instead of the window object.

##Getting Started

###Creating a joData object

To create a joData query object, you instantiate it by passing your base uri into the constructor.

	var query = new jo('http://test.com');
	var query = new jo('http://test.com');

###.baseUri

The base uri passed in through the constructor can be accessed by calling

	query.baseUri;

###.toString()

To get the query in oData format, call toString off of your query object.

	query.toString();

###OrderBy

####.orderBy(property)

Order by is a singleton property, so you can call .orderBy as many times as you like and the result will always be the last one.

	query.orderBy('PropertyName');

Output: 

	$orderby=PropertyName

####.asc(), .desc()

You can add ascending or descending with the following:

	query.orderBy('PropertyName').asc();
	query.orderBy('PropertyName').desc();

Which ever order is called last will be the one that wins, so writing

	query.orderBy('PropertyName').asc().desc()

will result in 

	$orderby=PropertyName desc

####.resetOrderBy()

All OrderBy settings can be removed by calling:

	query.resetOrderBy();

####.setOrderByDefault(property, \[optional\] order)

	query.setOrderByDefault('PropertyName');

Output:

	$orderby=PropertyName

Setting .orderBy will override the default. Calling .resetOrderBy() will restore the default.

	query
		.setOrderByDefault('p1', 'desc')
		.orderBy('p2')
		.asc();

Output:

	$orderby=p2 asc

Then, resetting will restore the default:

	query.resetOrderBy();

Output:

	$orderby=p1 desc

####.toggleOrderBy(property, \[optional\] callback)

Toggles the order by value on a given property between desc and asc. If the orderby property has not been set yet, it will default to desc.

	query.orderBy('CustomerId');

Output:

	$orderby=CustomerName desc

If called again, the result would be

	$orderby=CustomerName asc.

The callback is an optional parameter and will be called after the order property has been set.

###Top

####.top(number)

Top is a singleton property, so you can call .top as many times as you like and the result will always be the last one.

	query.top(10);

Output: 

	$top=10

####.resetTop()

All Top settings can be removed by calling:

	query.resetTop();

####.setTopDefault(top)

	query.setTopDefault(5);

Output:

	$top=5

Setting .top will override the default. Calling .resetTop() will restore the default.

	query
		.setTopDefault(5)
		.top(10);

Output:

	$top=10

Then, resetting will restore the default:

	query.resetTop()

Output:

	$top=5

###Skip

####.skip(number)

Skip is a singleton property, so you can call .skip as many times as you like and the result will always be the last one.

	query.skip(5);

Output: 

	$skip=5

####.resetSkip()

All Skip settings can be removed by calling:

	query.resetSkip();

####.setSkipDefault(skip)

	query.setSkipDefault(5);

Output:

	$skip=5

Setting .skip will override the default. Calling .resetSkip() will restore the default.

	query
		.setSkipDefault(5)
		.skip(10);

Output:

	$skip=10

Then, resetting will restore the default:

	query.resetSkip();

Output:

	$skip=5

###Select

####.select(array)

Select is a singleton property, so you can call .select as many times as you like and the result will always be the last one.

select takes in an array of property names.

	query.select(['Property1', 'Property2]);

Output: 

	$select=Property1,Property2

####.resetSelect()

All Select settings can be removed by calling:

	query.resetSelect();

####.setSelectDefault(array)

	query.setSelectDefault(['CustomerId', 'CustomerName']);

Output:

	$select=CustomerId,CustomerName

Setting .select will override the default. Calling .resetSelect() will restore the default.

	query
		.setSelectDefault(['CustomerId', 'CustomerName'])
		.select(['CustomerId', 'CustomerName', 'Address']);

Output:

	$select=CustomerId,CustomerName,Address

Then, resetting will restore the default:

	query.resetSelect();

Output:

	$select=CustomerId,CustomerName

###Expand

####.expand(property)

Expand is a singleton property, so you can call .expand as many times as you like and the result will always be the last one.

	query.expand('Customer');

Output: 

	$expand=Customer

####.resetExpand()

The Expand settings can be removed by calling:

	query.resetExpand();

####.setExpandDefault(property)

	query.setExpandDefault('Customer');

Output:

	$expand=Customer

Setting .expand will override the default. Calling .resetExpand() will restore the default.

	query
		.setExpandDefault('Customer')
		.skip('Product');

Output:

	$expand=Product

Then, resetting will restore the default:

	query.resetExpand();

Output:

	$expand=Customer

###Format

####.format()

Format is a singleton property, so you can call .format as many times as you like and the result will always be the last one.

You must follow .format with a format method. The methods are:

#####.atom()

	query.format().atom();

Output:
	
	$format=atom

#####.xml()

	query.format().xml();

Output:
	
	$format=xml

#####.json()

	query.format().json();

Output:
	
	$format=json

#####.custom(value)

	query.format().custom('text/csv');

Output:
	
	$format=text/csv

####.resetFormat()

calling .resetFormat() will remove any format settings or restore the default.

####.formatDefault()

Just like .format(), one of the 4 different format methods need to be called after calling .formatDefault()

	query.formatDefault().atom();

Output:

	$format=atom

Setting .format() will override the default. Calling .resetFormat() will restore the default.

	query
		.formatDefault()
		.atom()
		.format()
		.json();

Output:

	$format=json

Then, resetting will restore the default:

	query.resetFormat();

Output:

	$format=atom

###Inlinecount

####.inlineCount()

Inlinecount is a singleton property, so you can call .inlinecount as many times as you like and the result will always be the last one.

You must follow .inlineCount with an inlinecount method. The methods are:

#####.allPages()

	query.inlineCount().allPages();

Output:
	
	$inlinecount=allpages

#####.none()

	query.inlineCount().none();

Output:
	
	$inlinecount=none

####.resetInlineCount()

calling .resetInlineCount() will remove any inline count settings or restore the defaults.

####.inlineCountDefault()

Just like .inlineCount(), one of the 2 inline count methods need to be called after calling .inlineCountDefault()

	query.inlineCountDefault().allPages();

Output:

	$inlinecount=allpages

Setting .inlineCount() will override the default. Calling .resetInlineCount() will restore the default.

	query
		.inlineCountDefault()
		.allPages()
		.inlineCount()
		.none();

Output:

	$inlinecount=none

Then, resetting will restore the default:

	query.resetInlineCount();

Output:

	$inlinecount=none

###Filter

####.filter(clause)

Filter is not singleton, which allows you to add as many filter clauses as you would like.

.filter takes in a [jo.FilterClause](#filter-clause) object.

.filter works best for single filter clauses. If you need multiple filter clauses seperated by 'or' or 'and', see below.

To create a filer clause, use the jo.FilterClause object and pass in the proeprty the clause applies to.

	var clause = new jo.FilterClause('PropertyName');

Next, add your desires operator (for complete list of supported operators, see below)

	clause.eq(5);

Lastly, to add it to the query:

	query.filter(clause);

Output: 

	$filter=PropertyName eq 5

####.andFilter(clause)

Adds a filter clause using the 'and' operator. joData is smart enough to know that if this is the first clause in the filter, don't use the operator. This way you can loop through properties and not have to worry about using .filter for the first item and .addFilter for the rest.

.andFilter takes in a [jo.FilterClause](#filter-clause) object.

	query
		.andFilter(new jo.FilterClause('Property1').eq(5))
		.andFilter(new jo.FilterClause('Property2').eq(10));

Output: 

	$filter=Property1 eq 5 and Property2 eq 10

####.orFilter(clause)

Same as andFilter, except seperates the clauses with 'or'.

.orFilter takes in a [jo.FilterClause](#filter-clause) object.

	query
		.orFilter(new jo.FilterClause('Property1').eq(5))
		.orFilter(new jo.FilterClause('Property2').eq(10));

Output: 

	$filter=Property1 eq 5 or Property2 eq 10
			
####Mixing filter methods

You can mix the filter methods as you like.

	query
		.filter(new jo.FilterClause('p1').eq(1))
		.andFilter(new jo.FilterClause('p2').eq(5))
		.orFilter(new jo.FilterClause('p3').eq(10));

Output: 

	$filter=p1 eq 1 and p2 eq 5 or p3 eq 10

####Removing a Single Filter

####.removeFilter(property)

If you wish to remove a single filter, call .removeFilter and pass in the name of the property whose filter you wish to remove. Currently, this will only work with FilterClause. It does not work with Precedence Groups 
or Conat.

	query.removeFilter('CustomerName')

####<a id="filter-clause"></a>jo.FilterClause(property) ##

The jo.FilterClause object represents an oData filter clause. It's constructor takes in the property name the clause will be for.

 Note: The only time a parameter is not required for a FilterClause is for a concat clause.

	new jo.FilterClause('CustomerName');

#####.isEmpty()

Used to test if the FilterClause object is actually populated and ready to use. Will not return true until one of the [Logical Operators](#logical-operators) have been called.

	var clause = new jo.FilterClause('CustomerId');
	clause.isEmpty();

Output:

	true

Not Empty FilterClause:

	var clause = new jo.FilterClause('CustomerId').eq(1);
	clause.isEmpty();

Output:

	false


####Capturing Filters

#####.captureFilter(), .resetToCapturedFilter()

Capturing a filter will allow you to reset back to the captured filter.

An example is applying a filter, and then searching within that filter.

So in this example, you click a filter:

	query.andFilter(new jo.FilterClause('Status').eq('Pending'));

Then you capture that filter:

	query.captureFilter();

Now you perform a search:

	query.andFilter(new jo.FilterClause('Name').eq('Guy'));

At this point your query is:

	$filter=Status eq 'Pending' and Name eq 'Guy'

So now, you want to clear your search results but stay in that filter. So you call .resetToCapturedFilter().

	query.resetToCapturedFilter();

You query will reset back to:

	$filter=Status eq 'Pending'

To completely reset just call:

	query.resetFilter();


###Casts

For any of the filter types listed below, you may need to cast a value to a certain type.

####Datetime

To cast datetime, use jo.datetime(value)

    query.filter(new jo.FilterClause('DateAdded').eq(jo.datetime('2013-03-01')));

Output:

	$filter=DateAdded eq datetime'2013-03-01'

####Guid

To cast guid, use jo.guid(value)

    query.filter(new jo.FilterClause('CustomerId').eq(jo.guid('3F2504E0-4F89-11D3-9A0C-0305E82C3301')));

Output:

	$filter=CustomerId eq guid'3F2504E0-4F89-11D3-9A0C-0305E82C3301'

####Decimal

To cast to decimal, use jo.decimal(value)

	query.filter(new jo.FilterClause('Price').eq(jo.decimal(24.97)));

Output:

	$filter=Price eq 24.97m

####Single

To cast to decimal, use jo.single(value)

	query.filter(new jo.FilterClause('Price').eq(jo.single(24.97)));

Output:

	$filter=Price eq 24.97f

####Double

To cast to decimal, use jo.double(value)

	query.filter(new jo.FilterClause('Price').eq(jo.double(24.97)));

Output:

	$filter=Price eq 24.97d

####<a id="logical-operators"></a>Logical Operators  ##

The Logical Operator is what completes a filter clause. They can take in a string, number, or boolean, and are smart enough to know whether or not to add quotes.

Example:

	query.filter(new jo.FilterData('PropertyName').eq('test'));
	query.filter(new jo.FilterData('PropertyName').eq(10));

Output:

	$filter=PropertyName eq 'test'
	$filter=PropertyName eq 10

Available Operators:
* eq(value) - Equals
* ne(value) - Not equals
* gt(value) - Greater than
* ge(value) - Greater than or equal
* lt(value) - Less than
* le(value) - Less than or equal

#####.not()

The 'not' operator is a bit different. It can be followed by a function. So rather than taking in a value, it is chained to the filter clause.

Because 'not' is higher in the order of operations than the other logical operators, joData will automatically add parenthesis around any statement that doesn't return bool.

	query.filter(new jo.FilterClause('CustomerName').not().eq('bob'));

Output:
	
	$filter=not (CustomerName eq 'bob')

'CustomerName eq 'bob'' must be evaluted to a bool before 'not' can be applied, so it is wrapped in parenthesis.

	query.filter(new jo.FilterClause('CustomerName').not().endswith('bob'));

Output:

	$filter=not endswith(CustomerName,'bob')

endswith return a bool, so there is no need to add parenthesis.

#####Precedence Groups

#####new jo.PrecedenceGroup(filterClause)

Precedence Groups allow you to group filter clauses in parenthesis.

First, you instatiate a new jo.PrecedenceGroup. the constructor takes in a FilterClause object.

	var group = new jo.PrecedenceGroup(new jo.FilterClause('Name').eq('Bob'));

Then you add it to the main query filter.

	query.filter(group);

Output:

	$filter=(Name eq 'Bob')

#####.andFilter(filterClause), .orFilter(filterClause)

Just like with the query filter, you can call andFilter or orFilter to add clauses to the group.

	var group = new jo.PrecedenceGroup(new jo.FilterClause('Name').eq('Bob')).orFilter(new jo.FilterClause('Name').eq('George'));
	query.filter(group);

Output:

	$filter=(Name eq 'Bob' or Name eq 'George')

#####Mixing Filters and Precedence Groups

	query
		.filter(new jo.FilterClause('Id').eq(1))
		.andFilter(new jo.PrecedenceGroup(new jo.FilterClause('Name').startswith('a').eq(true))
			.orFilter(new jo.FilterClause('Name').startswith('b').eq(true)));

Output:

	$filter=Id eq 1 and (startswith(Name,'a') eq true or startswith(Name,'b') eq true)

####Settings Filter Defaults

####.defaultFilter(clause), .defaultAndFilter(clause), .defaultOrFilter(clause)

Filter defaults work a little different than all the other defaults. Rather than overriding the default when .filter, .andFilter, or .orFilter is called, the defaults are merged.

As for seperating default clauses with 'and' or 'or', .defaultAndFilter and .defaultOrFilter work the same as .andFilter and .orFilter.

	query.defaultFilter(new jo.FilterClause('Id').eq(1));

Output:

	$filter=Id eq 1

Adding a filter will merge it with the defaults:

	query
		.defaultFilter(new jo.FilterClause('Id').eq(1))
		.filter(new jo.FilterClause('Name').eq('bob'));

Output:

	$filter=Id eq 1 and Name eq 'bob'

Unless specified with .orFilter(), default clauses will be seperated from the other clauses by 'and'.

Calling .resetFilter() will remove all filter clauses except for the defaults.

	query
		.defaultFilter(new jo.FilterClause('Id').eq(1))
		.filter(new jo.FilterClause('Name').eq('bob'));

Output:

	$filter=Id eq 1 and Name eq 'bob'

Then reset the filters:

	query.resetFilter();

Output:

	$filter=Id eq 1

####Arithmetic Methods

All arithmetic methods are available. This includes:

* add
* sub
* mul
* div
* mod

Usage:

	query.filter(new jo.FilterClause('PropertyName').add(5).eq(10));

Output: 

	$filter=PropertyName add 5 eq 10

####String Functions

Supported String Methods:

#####substringof(value)

	query.filter(new jo.FilterClause('PropertyName').substringof('test').eq(true));

Output: 

	$filter=substringof('test',PropertyName) eq true

#####substringof(value) - with toLower, toUpper, or trim

If you wish your substring of to transform the value being searched:

	query.filter(new jo.FilterClause('PropertyName').toLower().substringof('test').eq(true));

Output

	$filter=substringof('test',tolower(PropertyName)) eq true

This works for toLower(), toUpper(), and trim()

#####endswith(value)

	query.filter(new jo.FilterClause('PropertyName').endswith('test').eq(true));

Output: 

	$filter=endswith(PropertyName,'test') eq true

#####startswith(value)

	query.filter(new jo.FilterClause('PropertyName').startswith('test').eq(true));

Output: 

	$filter=startswith(PropertyName,'test') eq true

#####length()

	query.filter(new jo.FilterClause('PropertyName').length().eq(10));

Output: 

	$filter=length(PropertyName) eq 10

#####indexof(value)

	query.filter(new jo.FilterClause('PropertyName').indexof('test').eq(1));

Output: 

	$filter=indexof(PropertyName,'test') eq 1

#####replace(find, replace)

	query.filter(new jo.FilterClause('PropertyName').replace('test', 'bob').eq('bob'));

Output: 

	$filter=replace(PropertyName,'test','bob') eq 'bob'

#####substring(position, \[optional\] length)

length is an options parameter.

	query.filter(new jo.FilterClause('PropertyName').substring(1).eq('test'));

Output: 

	$filter=substring(PropertyName,1) eq 'test'

With length param:

	query.filter(new jo.FilterClause('PropertyName').substring(1,2).eq('test'));

Output: 

	$filter=substring(PropertyName,1,2) eq 'test'

#####toLower(value)

	query.filter(new jo.FilterClause('PropertyName').toLower().eq('test'));

Output: 

	$filter=tolower(PropertyName) eq 'test'

#####toUpper(value)

	query.filter(new jo.FilterClause('PropertyName').toUpper().eq('TEST'));

Output: 

	$filter=toupper(PropertyName) eq 'TEST'

#####trim(value)

	query.filter(new jo.FilterClause('PropertyName').trim().eq('test'));

Output: 

	$filter=trim(PropertyName) eq 'test'

#####.Concat(value1, value2)

Concat is a bit different from other filter clauses. Concat can be nested, so it's possible to have 'concat(concat(City, ','), State) eq 'Birmingham, Alabama''

To do this, there is the jo.Concat object that takes in either a string or a jo.Concat object.

By default, the concat object assumes you're dealing with properties, so it doesn't wrap your concat arguments in quotes. If you wish to use a string literal, like in example 2,
use literal('your literal value').

Example 1 - Without Nesting

	query.filter(new jo.FilterClause().Concat(new jo.Concat('FirstName', 'LastName')).eq('BobSmith'));

Output:

	$filter=concat(FirstName,LastName) eq 'BobSmith'

Example 2 - With Nesting

	query.filter(new jo.FilterClause().Concat(new jo.Concat(new jo.Concat('City',literal(', ')), 'State')).eq('Birmingham, Alabama'));

Output:

	$filter=concat(concat(City,', '),State) eq 'Birmingham, Alabama'

####Date Functions

#####.day()

	query.filter(new jo.FilterClause('Birthday').day().eq(2));

Output:

	$filter=day(Birthday) eq 2

#####.hour()

	query.filter(new jo.FilterClause('Birthday').hour().eq(2));

Output:

	$filter=hour(Birthday) eq 2

#####.minute()

	query.filter(new jo.FilterClause('Birthday').minute().eq(2));

Output:

	$filter=minute(Birthday) eq 2

#####.month()

	query.filter(new jo.FilterClause('Birthday').month().eq(2));

Output:

	$filter=month(Birthday) eq 2

#####.second()

	query.filter(new jo.FilterClause('Birthday').second().eq(2));

Output:

	$filter=second(Birthday) eq 2

#####.year()

	query.filter(new jo.FilterClause('Birthday').year().eq(2));

Output:

	$filter=year(Birthday) eq 2

####Math Functions

#####.round()

	query.filter(new jo.FilterClause('Price').round().eq(2));

Output:

	$filter=round(Price) eq 2

#####.floor()

	query.filter(new jo.FilterClause('Price').floor().eq(2));

Output:

	$filter=floor(Price) eq 2

#####.ceiling()

	query.filter(new jo.FilterClause('Price').ceiling().eq(2));

Output:

	$filter=ceiling(Price) eq 2
	
####Raw Parameters

To add parameters onto the query outside of joData, you may use the Raw function.

#####raw(parameter, value)

	query.raw('ParameterName',"'ParameterValue'")

Output:

	ParameterName='ParameterValue'

##Saving Local

joData allows you to save a joData instance to your browsers localStorage. Then when you return to that page, you can reload the joData object from local storage.

This allows you to have sticky settings on something like a datagrid. Say a user enters a search term, sorts by a column, goes to a page, then clicks on a row to take them to an edit page.
This feature will allow the joData object to be reloaded once they return to the grid, causing the search, sort, and page to be restored.

Using it is simple, but joData requires you to have 2 things -	localStorage and the JSON object.

localStorage is supported in all major browsers, inclusing IE 8+. Saving Local will not work for IE 7 or less.

The JSON object is a little less consistant. For browsers that don't support it (IE 8 and less), you need a add the [json2](https://github.com/douglascrockford/JSON-js) js file.

	<!--[if lt IE 9]>
		<script src="/Scripts/json2.js" type="text/javascript"></script>
	<![endif]-->

Once everything is set up, it's a simple matter of calling .saveLocal() and .loadLocal()

####.saveLocal(\[optional\] key)

	query.saveLocal();

Calling .saveLocal() will stringify your joData object and save to to localStorage. You can pass in an optional string parameter to name the localStorage key.

####jo.loadLocal(\[optional\] key)

	jo.loadLocal()

.loadlLocal() needs to be called off the joData object statically rather than off of an instantiated joData object. You can pass in an optional string parameter to tell it which localStorage key to try and load.

##Unsupported Features (for now)

These are the list of features joData currently does not support. Hopefully, these features are coming soon.

###Filter

####Type Functions

* IsOf

###Custom Query Options

joData currently does not support any custom query options

##Road Map - Goals for the Future

* Paganition Extension - Writing an extension that will manage datagrid variables for you.
* Backbone Pagination Plugin - Writing a plugin for backbone that will build up your fetch query to get datagrid pages
