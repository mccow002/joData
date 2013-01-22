joData
======

A pure javascript library to help you query your data.

joData creates a javascript object that represents an oData query. This allows you to easily modify parts of your oData query without effecting the rest of it.

All methods in joData are chainable.

##Getting Started

###Creating a joData object

To create a joData query object, you instantiate it by passing your base uri into the constructor.

	var query = new joData('http://test.com');

This base uri can be accessed by calling

	query.baseUri;

To get the query in oData format, call toString off of your query object.

	query.toString();

###OrderBy

Order by is a singleton property, so you can call .orderBy as many times as you like and the result will always be the last one.

	query.orderBy('PropertyName');

Output: '$orderby=PropertyName'

You can add ascending or descending with the following:

	query.orderBy('PropertyName').asc();
	query.orderBy('PropertyName').desc();

Which ever order is called last will be the one that wins, so writing

	query.orderBy('PropertyName').asc().desc()

will result in "$orderby=PropertyName desc".

All OrderBy settings can be removed by calling:

	query.resetOrderBy();

###Top

Top is a singleton property, so you can call .top as many times as you like and the result will always be the last one.

	query.top(10);

Output: '$top=10'

All Top settings can be removed by calling:

	query.resetTop();

###Skip

Skip is a singleton property, so you can call .skip as many times as you like and the result will always be the last one.

	query.skip(5);

Output: '$skip=5'

All Skip settings can be removed by calling:

	query.resetSkip();

###Select

Select is a singleton property, so you can call .select as many times as you like and the result will always be the last one.

select takes in an array of property names.

	query.select(['Property1', 'Property2]);

Output: '$select=Property1,Property2'

All Select settings can be removed by calling:

	query.resetSelect();

###Filter

Filter is not singleton, which allows you to add as many filter clauses as you would like.



###Setting Defaults



Say you have a datagrid that needs to pull all emails associated with a customer id. So regardless of filters or orderBys, your query needs to 