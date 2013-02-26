describe('joData', function(){
	it('exists', function(){
		expect(joData).toBeDefined();
	});

	describe('the constructor', function(){
		it('sets the baseUri', function(){
			var j = new joData('http://foo.bar');
			expect(j.baseUri).toEqual('http://foo.bar');
		});
	});
	
	describe('order by', function(){
		it('should cause an $orderby query string parameter to appear upon toString', function(){
			var j = new joData('http://foo.bar');
			j.orderBy('baz');
			
			expect(j.toString()).toEqual('http://foo.bar?$orderby=baz');
		});
		
		it('allows for desc', function(){
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
		
		describe('multiple calls', function(){
			it('only keeps the latest of asc or desc', function(){
				var j = new joData('http://foo.bar');
				j.orderBy('baz').desc().asc().desc().asc();
				
				expect(j.toString()).toEqual('http://foo.bar?$orderby=baz asc');
			});
			
			it('only keeps the latest of property names', function(){
				var j = new joData('http://foo.bar');
				j.orderBy('baz').orderBy('two');
				
				expect(j.toString()).toEqual('http://foo.bar?$orderby=two');
			});
		});
	});
	
	describe('top', function(){
		it('should cause a $top query string parameter to appear upon toString', function(){
			var j = new joData('http://foo.bar');
			j.top(20);
			
			expect(j.toString()).toEqual('http://foo.bar?$top=20');
		});
		
		describe('multiple calls', function(){
			it('only keeps the latest top value', function(){
				var j = new joData('http://foo.bar');
				j.top(10).top(20);
				
				expect(j.toString()).toEqual('http://foo.bar?$top=20');
			});
		});
	});
	
	describe('skip', function(){
		it('should cause a $skip query string parameter to appear upon toString', function(){
			var j = new joData('http://foo.bar');
			j.skip(20);
			
			expect(j.toString()).toEqual('http://foo.bar?$skip=20');
		});
		
		describe('multiple calls', function(){
			it('only keeps the latest skip value', function(){
				var j = new joData('http://foo.bar');
				j.skip(10).skip(20);
				
				expect(j.toString()).toEqual('http://foo.bar?$skip=20');
			});
		});
	});
	
	describe('select', function(){
		it('joins an array into a $select parameter upon toString', function(){
			var j = new joData('http://foo.bar');
			j.select(['prop1','prop2']);
			
			expect(j.toString()).toEqual('http://foo.bar?$select=prop1,prop2');
		});
		
		describe('multiple calls', function(){
			it('only uses the latest array', function(){
				var j = new joData('http://foo.bar');
				j.select(['prop1','prop2']);
				j.select(['prop3','prop4']);
				
				expect(j.toString()).toEqual('http://foo.bar?$select=prop3,prop4');
			});
		});
	});
	
	describe('filter', function(){
		it('should cause a $filter query string parameter to appear upon toString', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('prop1').Eq('val1'));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=prop1 eq 'val1'");
		
		});
		
		it('should allow for joining conditions with a logical or', function(){
			var j = new joData('http://foo.bar');
			
			var filter1 = new joData.FilterClause('prop1').Eq('val1');
			var filter2 = new joData.FilterClause('prop2').Eq('val2');
			
			j.filter(filter1).orFilter(filter2);
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=prop1 eq 'val1' or prop2 eq 'val2'");
		});
		
		it('should allow for joining conditions with a logical and', function(){
			var j = new joData('http://foo.bar');
			
			var filter1 = new joData.FilterClause('prop1').Eq('val1');
			var filter2 = new joData.FilterClause('prop2').Eq('val2');
			
			j.filter(filter1).andFilter(filter2);
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=prop1 eq 'val1' and prop2 eq 'val2'");
		});
		
		describe('multiple calls', function(){
			xit('only uses the most recent filter (did you mean to use orFilter or andFilter?)', function(){
				var j = new joData('http://foo.bar');
			
				var filter1 = new joData.FilterClause('prop1').Eq('val1');
				var filter2 = new joData.FilterClause('prop2').Eq('val2');
				
				j.filter(filter1);
				j.filter(filter2);
				
				// TODO: actually returns a garbled http://foo.bar?$filter=prop2 eq 'val1'prop2 eq 'val2'
				// That is, it smushes them together. We should probably either reset, or choose a default joiner (AND/OR)
				expect(j.toString()).toEqual("http://foo.bar?$filter=prop2 eq 'val2'");
			});
		});
	});
	
	describe('reset filter', function(){
		it('causes complete amnesia of previous filters', function(){
			var j = new joData('http://foo.bar');
			
			var filter1 = new joData.FilterClause('prop1').Eq('val1');
			var filter2 = new joData.FilterClause('prop2').Eq('val2');
			
			j.filter(filter1).andFilter(filter2);
			
			j.resetFilter();
			
			expect(j.toString()).toEqual('http://foo.bar');
		});
	});
	
	describe('filter string helpers', function(){
		it('supports lowering a filter property', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('prop1').ToLower().Eq('val1'));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=tolower(prop1) eq 'val1'");
		});
		
		it('supports uppering a filter property', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('prop1').ToUpper().Eq('val1'));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=toupper(prop1) eq 'val1'");
		});
		
		it('supports substringof to check that a filter property contains a string', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('prop1').Substringof('over 9000').Eq(true));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=substringof('over 9000',prop1) eq true");
		});
		
		it('supports substring with a length to check a part of a filter property', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('prop1').Substring(4, 9).Eq('over 9000'));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=substring(prop1,4,9) eq 'over 9000'");
		});
		
		it('supports substring without a length to check the rest of a filter property', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('prop1').Substring(4).Eq('over 9000!'));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=substring(prop1,4) eq 'over 9000!'");
		});
	});
	
	describe('filter arithmetic helpers', function(){
		it('supports the add expression', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('prop1').Add(9000).Eq(9001));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=prop1 add 9000 eq 9001");
		});
	});
	
	describe('filter logical operators', function(){
		it('supports the greater than expression', function(){
			var j = new joData('http://foo.bar');
			j.filter(new joData.FilterClause('powerLevel').Gt(9001));
			
			expect(j.toString()).toEqual("http://foo.bar?$filter=powerLevel gt 9001");
		});
	});
});
