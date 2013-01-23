joData
======

A pure javascript library to help you query your data.

joData creates a javascript object that represents an oData query. This allows you to easily modify parts of your oData query without effecting the rest of it.

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

	'$orderby=PropertyName'

####.asc(), .desc()

You can add ascending or descending with the following:

	query.orderBy('PropertyName').asc();
	query.orderBy('PropertyName').desc();

Which ever order is called last will be the one that wins, so writing

	query.orderBy('PropertyName').asc().desc()

will result in 

	'$orderby=PropertyName desc'

####.resetOrderBy()

All OrderBy settings can be removed by calling:

	query.resetOrderBy();

###Top

####.top(number)

Top is a singleton property, so you can call .top as many times as you like and the result will always be the last one.

	query.top(10);

Output: 

	'$top=10'

####.resetTop()

All Top settings can be removed by calling:

	query.resetTop();

###Skip

####.skip(number)

Skip is a singleton property, so you can call .skip as many times as you like and the result will always be the last one.

	query.skip(5);

Output: 

	'$skip=5'

####.resetSkip()

All Skip settings can be removed by calling:

	query.resetSkip();

###Select

####.select(array)

Select is a singleton property, so you can call .select as many times as you like and the result will always be the last one.

select takes in an array of property names.

	query.select(['Property1', 'Property2]);

Output: 

	'$select=Property1,Property2'

####.resetSelect()

All Select settings can be removed by calling:

	query.resetSelect();

###Filter

####joData.FilterClause(property)

The joData.FilterClause object represents an oData filter clause. It's constructor takes in the property name the clause will be for.

	new joData.FilterClause('CustomerName');

#####.isEmpty()

Used to test if the FilterClause object is actually populated and ready to use. Will not return true until one of the [Logical Operators](#logical-operators) have been called.

	var clause = new joData.FilterClause('CustomerId');
	clause.isEmpty();

Output:

	'false'

Not Empty FilterClause:

	var clause = new joData.FilterClause('CustomerId').Eq(1);
	clause.isEmpty();

Output:

	'true'

####.filter(clause)

Filter is not singleton, which allows you to add as many filter clauses as you would like.

.filter works best for single filter clauses. If you need multiple filter clauses seperated by 'or' or 'and', see below.

To create a filer clause, use the joData.FilterClause object and pass in the proeprty the clause applies to.

	var clause = new joData.FilterClause('PropertyName');

Next, add your desires operator (for complete list of supported operators, see below)

	clause.Eq(5);

Lastly, to add it to the query:

	query.filter(clause);

Output: 

	'$filter=PropertyName eq 5'

####.andFilter(clause)

Adds a filter clause using the 'and' operator. joData is smart enough to know that if this is the first clause in the filter, don't use the operator. This way you can loop through properties and not have to worry about using .filter for the first item and .addFilter for the rest.

	query
		.andFilter(new joData.FilterClause('Property1').Eq(5))
		.andFilter(new joData.FilterClause('Property2').Eq(10));

Output: 

	'$filter=Property1 eq 5 and Property2 eq 10'

####.orFilter(clause)

Same as andFilter, except seperates the clauses with 'or'.

	query
		.andFilter(new joData.FilterClause('Property1').Eq(5))
		.andFilter(new joData.FilterClause('Property2').Eq(10));

Output: 

	'$filter=Property1 eq 5 or Property2 eq 10'
		
####Mixing filter methods

You can mix the filter methods as you like.

	query
		.filter(new joData.FilterClause('p1').Eq(1))
		.andFilter(new joData.FilterClause('p2').Eq(5))
		.orFilter(new joData.FilterClause('p3').Eq(10));

Output: 

	'$filter=p1 eq 1 and p2 eq 5 or p3 eq 10'

####<a id="logical-operators"></a>Logical Operators  ##

The Logical Operator is what completes a filter clause. They can take in a string, number, or boolean, and are smart enough to know whether or not to add quotes.

Example:

	query.filter(new joData.FilterData('PropertyName').Eq('test'));
	query.filter(new joData.FilterData('PropertyName').Eq(10));

Output:

	'$filter=PropertyName eq 'test''
	'$filter=PropertyName eq 10'

Available Operators:
* Eq(value) - Equals
* Ne(value) - Not equals
* Gt(value) - Greater than
* Ge(value) - Greater than or equal
* Lt(value) - Less than
* Le(value) - Less than or equal

#####.Not()

The 'not' operator is a bit different. It can be followed by a function. So rather than taking in a value, it is chained to the filter clause.

Because 'not' is higher in the order of operations than the other logical operators, joData will automatically add parenthesis around any statement that doesn't return bool.

	query.filter(new joData.FilterClause('CustomerName').Not().Eq('bob'));

Output:
	
	'$filter=not (CustomerName eq 'bob')'

'CustomerName eq 'bob'' must be evaluted to a bool before 'not' can be applied, so it is wrapped in parenthesis.

	query.filter(new joData.FilterClause('CustomerName').Not().Endswith('bob'));

Output:

	'$filter=not endswith('bob')'

endswith return a bool, so there is no need to add parenthesis.

####Arithmetic Methods

All arithmetic methods are available. This includes:

* add
* sub
* mul
* div
* mod

Usage:

	query.filter(new joData.FilterClause('PropertyName').Add(5).Eq(10));

Output: 

	'$filter=PropertyName add 5 eq 10'

####String Functions

Supported String Methods:

#####Substringof(value)

	query.filter(new joData.FilterClause('PropertyName').Substringof('test').Eq(true));

Output: 

	'$filter=substringof('test',PropertyName) eq true'

#####Endswith(value)

	query.filter(new joData.FilterClause('PropertyName').Endswith('test').Eq(true));

Output: 

	'$filter=endswith(PropertyName,'test') eq true'

#####Startswith(value)

	query.filter(new joData.FilterClause('PropertyName').Startswith('test').Eq(true));

Output: 

	'$filter=startswith(PropertyName,'test') eq true'

#####Length()

	query.filter(new joData.FilterClause('PropertyName').Length().Eq(10));

Output: 

	'$filter=length(PropertyName) eq 10'

#####Indexof(value)

	query.filter(new joData.FilterClause('PropertyName').Indexof('test').Eq(1));

Output: 

	'$filter=indexof(PropertyName,'test') eq 1'

#####Replace(find, replace)

	query.filter(new joData.FilterClause('PropertyName').Replace('test', 'bob').Eq('bob'));

Output: 

	'$filter=replace(PropertyName,'test','bob') eq 'bob''

#####Substring(position, \[optional\] length)

length is an options parameter.

	query.filter(new joData.FilterClause('PropertyName').Substring(1).Eq('test'));

Output: 

	'$filter=substring(PropertyName,1) eq 'test''

With length param:

	query.filter(new joData.FilterClause('PropertyName').Substring(1,2).Eq('test'));

Output: 

	'$filter=substring(PropertyName,1,2) eq 'test'

#####ToLower(value)

	query.filter(new joData.FilterClause('PropertyName').ToLower().Eq('test'));

Output: 

	'$filter=tolower(PropertyName) eq 'test''

#####ToUpper(value)

	query.filter(new joData.FilterClause('PropertyName').ToUpper().Eq('TEST'));

Output: 

	'$filter=toupper(PropertyName) eq 'TEST''

#####Trim(value)

	query.filter(new joData.FilterClause('PropertyName').Trim().Eq('test'));

Output: 

	'$filter=trim(PropertyName) eq 'TEST''

####Date Functions

#####.Day()

	query.filter(new joData.FilterClause('Birthday').Day().Eq(2));

Output:

	'$filter=day(Birthday) eq 2'

#####.Hour()

	query.filter(new joData.FilterClause('Birthday').Hour().Eq(2));

Output:

	'$filter=hour(Birthday) eq 2'

#####.Minute()

	query.filter(new joData.FilterClause('Birthday').Minute().Eq(2));

Output:

	'$filter=minute(Birthday) eq 2'

#####.Month()

	query.filter(new joData.FilterClause('Birthday').Month().Eq(2));

Output:

	'$filter=month(Birthday) eq 2'

#####.Second()

	query.filter(new joData.FilterClause('Birthday').Second().Eq(2));

Output:

	'$filter=second(Birthday) eq 2'

#####.Year()

	query.filter(new joData.FilterClause('Birthday').Year().Eq(2));

Output:

	'$filter=year(Birthday) eq 2'

###Setting Defaults

All oData query options have the ability to set a default setting.

####.setOrderByDefault(property, \[optional\] order)

	query.setOrderByDefault('PropertyName');

Output:

	'$orderby=PropertyName'

Setting .orderBy will override the default. Calling .resetOrderBy() will restore the default.

	query
		.setOrderByDefault('p1', 'desc')
		.orderBy('p2')
		.asc();

Output:

	'$orderby=p2 asc

Then, resetting will restore the default:

	query.resetOrderBy();

Output:

	'$orderby=p1 desc'

####.setTopDefault(top)

	query.setTopDefault(5);

Output:

	'$top=5'

Setting .top will override the default. Calling .resetTop() will restore the default.

	query
		.setTopDefault(5)
		.top(10);

Output:

	'$top=10

Then, resetting will restore the default:

	query.resetTop()

Output:

	'$top=5'

####.setSkipDefault(skip)

	query.setSkipDefault(5);

Output:

	'$skip=5'

Setting .skip will override the default. Calling .resetSkip() will restore the default.

	query
		.setSkipDefault(5)
		.skip(10);

Output:

	'$skip=10

Then, resetting will restore the default:

	query.resetSkip();

Output:

	'$skip=5'

####.defaultFilter(clause), .defaultAndFilter(clause), .defaultOrFilter(clause)

Filter defaults work a little different than all the other defaults. Rather than overriding the default when .filter, .andFilter, or .orFilter is called, the defaults are merged.

As for seperating default clauses with 'and' or 'or', .defaultAndFilter and .defaultOrFilter work the same as .andFilter and .orFilter.

	query.defaultFilter(new joData.FilterClause('Id').Eq(1));

Output:

	'$filter=Id eq 1'

Adding a filter will merge it with the defaults:

	query
		.defaultFilter(new joData.FilterClause('Id').Eq(1))
		.filter(new joData.FilterClause('Name').Eq('bob'));

Output:

	'$filter=Id eq 1 and Name eq 'bob''

Unless specified with .orFilter(), default clauses will be seperated from the other clauses by 'and'.

Calling .resetFilter() will remove all filter clauses except for the defaults.

	query
		.defaultFilter(new joData.FilterClause('Id').Eq(1))
		.filter(new joData.FilterClause('Name').Eq('bob'));

Output:

	'$filter=Id eq 1 and Name eq 'bob''

Then reset the filters:

	query.resetFilter();

Output:

	'$filter=Id eq 1'



##Unsupported Features (for now)

These are the list of features joData currently does not support. Hopefully, these features are coming soon.

###Filter
####Logical Operators

* () - Precedence Grouping

####String Functions

* concat

####Math Functions

* round
* floor
* ceiling

####Type Functions

* IsOf

###Expand

joData currently does not support $expand

###Format

joData currently does not support $format

###Select

joData currently supports $select, but does not provide default select options.

###Inline Count

joData currently does not support $inlinecount

###Custom Query Options

joData currently does not support any custom query options
