var app = angular.module("app", [ 'ngRoute' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'main.html',
		controller : 'mainController'
	}).otherwise({
		templateUrl : 'main.html',
		contoller : 'mainController'
	});
} ]);

app.controller('mainController', [ '$scope', function($scope) {
	$scope.myData = {
		lineData: [{"x": 1974, "y": 2}, {"x": 1975, "y": 3}, {"x": 1976, "y": 3}, {"x": 1977, "y": 1}, {"x": 1978, "y": 2},  {"x": 1979, "y": 10}],
		rank: [2,3,3,1,2,5,1,3,2,4,2,1,5,6,5,3,5,2,7,1,11,2,4,3,10,3,2,3,3,2,2,5,5,3,6,3,2,3,3,2,1],
		year: [1974,1975,1976,1977,1978,1979,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015]
	};
} ]);

app.directive('d3Bars', [ function() {
	return {
		restrict : 'EA',
		scope : {data: '='},
		link : function(scope, elem, attrs, controller) {
			var height = 600;
			var svg = d3.select(elem[0]).append("svg").attr("width", 1200).attr("height", height);
			 
			var xScale = d3.scale.ordinal()//.linear()
			                          .domain(scope.data.year)
			                          .rangeBands([0, 800]);//.range([0, 800]);
			var yScale = d3.scale.linear()
										.domain([12,0])
										.range([400, 0])
			
			var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			var yAxis = d3.svg.axis().scale(yScale).orient("left");
			
			//Create an SVG group Element for the Axis elements and call the xAxis function
			console.log(yScale(1));
			console.log(xScale(1975));
			var yTrans = height - yScale(1);
			console.log(yTrans);
			var xTrans = yTrans - 600;
			var xAxisGroup = svg.append("g").attr("transform", "translate(100," + 450 + ")")
								.call(xAxis)
								.selectAll("text")
						            .style("text-anchor", "end")
						            .attr("dx", "-.8em")
						            .attr("dy", "-1.2em")
						            .attr("transform", "rotate(-90)" );
			var yAxisGroup = svg.append("g").call(yAxis).attr("transform", "translate(100,50)");
			var lineFunction = d3.svg.line()
										.x(function(d, i) { return xScale(d.x); })
										.y(function(d, i) { return yScale(d.y); })
										.interpolate("linear");

			var getInterpolation = function() {
				  var interpolate = d3.scale.quantile()
				      .domain([0,1])
				      .range(d3.range(1, scope.data.lineData.length + 1));

				  return function(t) {
				      var interpolatedLine = scope.data.lineData.slice(0, interpolate(t));
				      return lineFunction(interpolatedLine);
			      }
			}

			var linePath = svg.append("path")
								.attr("stroke", "blue")
								.attr("stroke-width", 2)
								.attr("fill", "none")
								.attr("transform", "translate(100,50)")
								.transition().duration(3000).attrTween("d", getInterpolation);
		}// end: link function
	}
} ]);