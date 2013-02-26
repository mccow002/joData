joData
======

[![Build Status](https://travis-ci.org/mccow002/joData.png?branch=master)](https://travis-ci.org/mccow002/joData)

A pure javascript library to help you query jo data.

joData creates a javascript object that represents an oData query. This allows you to easily modify parts of your oData query without effecting the rest of it.

joData's goal is to implement 

All methods in joData are chainable.

##Getting Started

###Creating a joData object

To create a joData query object, you instantiate it by passing your base uri into the constructor.

	var query = new joData('http://test.com');

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

###Filter

####.filter(clause)

Filter is not singleton, which allows you to add as many filter clauses as you would like.

.filter takes in a [joData.FilterClause](#filter-clause) object.

.filter works best for single filter clauses. If you need multiple filter clauses seperated by 'or' or 'and', see below.

To create a filer clause, use the joData.FilterClause object and pass in the proeprty the clause applies to.

	var clause = new joData.FilterClause('PropertyName');

Next, add your desires operator (for complete list of supported operators, see below)

	clause.eq(5);

Lastly, to add it to the query:

	query.filter(clause);

Output: 

	$filter=PropertyName eq 5

####.andFilter(clause)

Adds a filter clause using the 'and' operator. joData is smart enough to know that if this is the first clause in the filter, don't use the operator. This way you can loop through properties and not have to worry about using .filter for the first item and .addFilter for the rest.

.andFilter takes in a [joData.FilterClause](#filter-clause) object.

	query
		.andFilter(new joData.FilterClause('Property1').eq(5))
		.andFilter(new joData.FilterClause('Property2').eq(10));

Output: 

	$filter=Property1 eq 5 and Property2 eq 10

####.orFilter(clause)

Same as andFilter, except seperates the clauses with 'or'.

.orFilter takes in a [joData.FilterClause](#filter-clause) object.

	query
		.orFilter(new joData.FilterClause('Property1').eq(5))
		.orFilter(new joData.FilterClause('Property2').eq(10));

Output: 

	$filter=Property1 eq 5 or Property2 eq 10
			
####Mixing filter methods

You can mix the filter methods as you like.

	query
		.filter(new joData.FilterClause('p1').eq(1))
		.andFilter(new joData.FilterClause('p2').eq(5))
		.orFilter(new joData.FilterClause('p3').eq(10));

Output: 

	$filter=p1 eq 1 and p2 eq 5 or p3 eq 10

####Removing a Single Filter

####.removeFilter(property)

If you wish to remove a single filter, call .removeFilter and pass in the name of the property whose filter you wish to remove. Currently, this will only work with FilterClause. It does not work with Precedence Groups 
or Conat.

	query.removeFilter('CustomerName')

####<a id="filter-clause"></a>joData.FilterClause(property) ##

The joData.FilterClause object represents an oData filter clause. It's constructor takes in the property name the clause will be for.

 Note: The only time a parameter is not required for a FilterClause is for a concat clause.

	new joData.FilterClause('CustomerName');

#####.isEmpty()

Used to test if the FilterClause object is actually populated and ready to use. Will not return true until one of the [Logical Operators](#logical-operators) have been called.

	var clause = new joData.FilterClause('CustomerId');
	clause.isEmpty();

Output:

	true

Not Empty FilterClause:

	var clause = new joData.FilterClause('CustomerId').eq(1);
	clause.isEmpty();

Output:

	false

####<a id="logical-operators"></a>Logical Operators  ##

The Logical Operator is what completes a filter clause. They can take in a string, number, or boolean, and are smart enough to know whether or not to add quotes.

Example:

	query.filter(new joData.FilterData('PropertyName').eq('test'));
	query.filter(new joData.FilterData('PropertyName').eq(10));

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

	query.filter(new joData.FilterClause('CustomerName').not().eq('bob'));

Output:
	
	$filter=not (CustomerName eq 'bob')

'CustomerName eq 'bob'' must be evaluted to a bool before 'not' can be applied, so it is wrapped in parenthesis.

	query.filter(new joData.FilterClause('CustomerName').not().endswith('bob'));

Output:

	$filter=not endswith(CustomerName,'bob')

endswith return a bool, so there is no need to add parenthesis.

#####Precedence Groups

#####new joData.PrecedenceGroup(filterClause)

Precedence Groups allow you to group filter clauses in parenthesis.

First, you instatiate a new joData.PrecedenceGroup. the constructor takes in a FilterClause object.

	var group = new joData.PrecedenceGroup(new joData.FilterClause('Name').eq('Bob'));

Then you add it to the main query filter.

	query.filter(group);

Output:

	$filter=(Name eq 'Bob')

#####.andFilter(filterClause), .orFilter(filterClause)

Just like with the query filter, you can call andFilter or orFilter to add clauses to the group.

	var group = new joData.PrecedenceGroup(new joData.FilterClause('Name').eq('Bob')).orFilter(new joData.FilterClause('Name').eq('George'));
	query.filter(group);

Output:

	$filter=(Name eq 'Bob' or Name eq 'George')

#####Mixing Filters and Precedence Groups

	query
		.filter(new joData.FilterClause('Id').eq(1))
		.andFilter(new joData.PrecedenceGroup(new joData.FilterClause('Name').startswith('a').eq(true))
			.orFilter(new joData.FilterClause('Name').startswith('b').eq(true)));

Output:

	$filter=Id eq 1 and (startswith(Name,'a') eq true or startswith(Name,'b') eq true)

####Settings Filter Defaults

####.defaultFilter(clause), .defaultAndFilter(clause), .defaultOrFilter(clause)

Filter defaults work a little different than all the other defaults. Rather than overriding the default when .filter, .andFilter, or .orFilter is called, the defaults are merged.

As for seperating default clauses with 'and' or 'or', .defaultAndFilter and .defaultOrFilter work the same as .andFilter and .orFilter.

	query.defaultFilter(new joData.FilterClause('Id').eq(1));

Output:

	$filter=Id eq 1

Adding a filter will merge it with the defaults:

	query
		.defaultFilter(new joData.FilterClause('Id').eq(1))
		.filter(new joData.FilterClause('Name').eq('bob'));

Output:

	$filter=Id eq 1 and Name eq 'bob'

Unless specified with .orFilter(), default clauses will be seperated from the other clauses by 'and'.

Calling .resetFilter() will remove all filter clauses except for the defaults.

	query
		.defaultFilter(new joData.FilterClause('Id').eq(1))
		.filter(new joData.FilterClause('Name').eq('bob'));

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

	query.filter(new joData.FilterClause('PropertyName').add(5).eq(10));

Output: 

	$filter=PropertyName add 5 eq 10

####String Functions

Supported String Methods:

#####substringof(value)

	query.filter(new joData.FilterClause('PropertyName').substringof('test').eq(true));

Output: 

	$filter=substringof('test',PropertyName) eq true

#####endswith(value)

	query.filter(new joData.FilterClause('PropertyName').endswith('test').eq(true));

Output: 

	$filter=endswith(PropertyName,'test') eq true

#####startswith(value)

	query.filter(new joData.FilterClause('PropertyName').startswith('test').eq(true));

Output: 

	$filter=startswith(PropertyName,'test') eq true

#####length()

	query.filter(new joData.FilterClause('PropertyName').length().eq(10));

Output: 

	$filter=length(PropertyName) eq 10

#####indexof(value)

	query.filter(new joData.FilterClause('PropertyName').indexof('test').eq(1));

Output: 

	$filter=indexof(PropertyName,'test') eq 1

#####replace(find, replace)

	query.filter(new joData.FilterClause('PropertyName').replace('test', 'bob').eq('bob'));

Output: 

	$filter=replace(PropertyName,'test','bob') eq 'bob'

#####substring(position, \[optional\] length)

length is an options parameter.

	query.filter(new joData.FilterClause('PropertyName').substring(1).eq('test'));

Output: 

	$filter=substring(PropertyName,1) eq 'test'

With length param:

	query.filter(new joData.FilterClause('PropertyName').substring(1,2).eq('test'));

Output: 

	$filter=substring(PropertyName,1,2) eq 'test'

#####toLower(value)

	query.filter(new joData.FilterClause('PropertyName').toLower().eq('test'));

Output: 

	$filter=tolower(PropertyName) eq 'test'

#####toUpper(value)

	query.filter(new joData.FilterClause('PropertyName').toUpper().eq('TEST'));

Output: 

	$filter=toupper(PropertyName) eq 'TEST'

#####trim(value)

	query.filter(new joData.FilterClause('PropertyName').trim().eq('test'));

Output: 

	$filter=trim(PropertyName) eq 'test'

#####.Concat(value1, value2)

Concat is a bit different from other filter clauses. Concat can be nested, so it's possible to have 'concat(concat(City, ','), State) eq 'Birmingham, Alabama''

To do this, there is the joData.Concat object that takes in either a string or a joData.Concat object.

By default, the concat object assumes you're dealing with properties, so it doesn't wrap your concat arguments in quotes. If you wish to use a string literal, like in example 2,
use literal('your literal value').

Example 1 - Without Nesting

	query.filter(new joData.FilterClause().Concat(new joData.Concat('FirstName', 'LastName')).eq('BobSmith'));

Output:

	$filter=concat(FirstName,LastName) eq 'BobSmith'

Example 2 - With Nesting

	query.filter(new joData.FilterClause().Concat(new joData.Concat(new joData.Concat('City',literal(', ')), 'State')).eq('Birmingham, Alabama'));

Output:

	$filter=concat(concat(City,', '),State) eq 'Birmingham, Alabama'

####Date Functions

#####.day()

	query.filter(new joData.FilterClause('Birthday').day().eq(2));

Output:

	$filter=day(Birthday) eq 2

#####.hour()

	query.filter(new joData.FilterClause('Birthday').hour().eq(2));

Output:

	$filter=hour(Birthday) eq 2

#####.minute()

	query.filter(new joData.FilterClause('Birthday').minute().eq(2));

Output:

	$filter=minute(Birthday) eq 2

#####.month()

	query.filter(new joData.FilterClause('Birthday').month().eq(2));

Output:

	$filter=month(Birthday) eq 2

#####.second()

	query.filter(new joData.FilterClause('Birthday').second().eq(2));

Output:

	$filter=second(Birthday) eq 2

#####.year()

	query.filter(new joData.FilterClause('Birthday').year().eq(2));

Output:

	$filter=year(Birthday) eq 2

####Math Functions

#####.round()

	query.filter(new joData.FilterClause('Price').round().eq(2));

Output:

	$filter=round(Price) eq 2

#####.floor()

	query.filter(new joData.FilterClause('Price').floor().eq(2));

Output:

	$filter=floor(Price) eq 2

#####.ceiling()

	query.filter(new joData.FilterClause('Price').ceiling().eq(2));

Output:

	$filter=ceiling(Price) eq 2


###Expand

####.expand(property)

Expand is a singleton property, so you can call .expand as many times as you like and the result will always be the last one.

	query.expand('Customer');

Output: 

	$expand=Customer

####.resetExpand()

The Expand settings can be removed by calling:

	query.resetExpand();

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

calling .resetFormat() will remove any format settings.

###Inlinecount

####.inlinecount()

Inlinecount is a singleton property, so you can call .inlinecount as many times as you like and the result will always be the last one.

You must follow .inlinecount with an inlinecount method. The methods are:

#####.allPages()

	query.inlinecount().allPages();

Output:
	
	$inlinecount=allpages

#####.none()

	query.inlinecount().none();

Output:
	
	$inlinecount=none

####.resetInlineCount()

calling .resetInlineCount() will remove any inline count settings.

##Unsupported Features (for now)

These are the list of features joData currently does not support. Hopefully, these features are coming soon.

###Filter

####Type Functions

* IsOf

###Expand Defaults

joData currently supports $expand, but does not provide default expand options.

###Format Defaults

joData currently supports $format, but does not provide default format options.

###Select Defaults

joData currently supports $select, but does not provide default select options.

###Inline Count Defaults

joData currently supports $inlinecount, but does not provide default inlinecount options.

###Custom Query Options

joData currently does not support any custom query options

##Road Map - Goals for the Future

* Paganition Extension - Writing an extension that will manage datagrid variables for you.
* Backbone Pagination Plugin - Writing a plugin for backbone that will build up your fetch query to get datagrid pages
* The ability to save a joData object to local storage to allow for sticky settings
