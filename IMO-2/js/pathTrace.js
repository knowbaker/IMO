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
		lineData: [{"x":1974, "y":2},{"x":1975, "y":3},{"x":1976, "y":3},{"x":1977, "y":1},{"x":1978, "y":2},{"x":1979, "y":5},{"x":1981, "y":1},{"x":1982, "y":3},{"x":1983, "y":2},{"x":1984, "y":4},{"x":1985, "y":2},{"x":1986, "y":1},{"x":1987, "y":5},{"x":1988, "y":6},{"x":1989, "y":5},{"x":1990, "y":3},{"x":1991, "y":5},{"x":1992, "y":2},{"x":1993, "y":7},{"x":1994, "y":1},{"x":1995, "y":11},{"x":1996, "y":2},{"x":1997, "y":4},{"x":1998, "y":3},{"x":1999, "y":10},{"x":2000, "y":3},{"x":2001, "y":2},{"x":2002, "y":3},{"x":2003, "y":3},{"x":2004, "y":2},{"x":2005, "y":2},{"x":2006, "y":5},{"x":2007, "y":5},{"x":2008, "y":3},{"x":2009, "y":6},{"x":2010, "y":3},{"x":2011, "y":2},{"x":2012, "y":3},{"x":2013, "y":3},{"x":2014, "y":2},{"x":2015, "y":1}],
		year: [1974,1975,1976,1977,1978,1979,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015]
	};
} ]);

app.directive('d3Bars', [ function() {
	return {
		restrict : 'EA',
		scope : {data: '='},
		link : function(scope, elem, attrs, controller) {
			var height = 430;
			var width = 900;
			var margin = {top : 50,right : 50,bottom : 50,left : 50};
			var h = height - margin.top - margin.bottom;//800
			var w = width - margin.left - margin.right;//400
			var dataSet = scope.data.lineData;
			var year = scope.data.year;

			var svg = d3.select("#holder")
						.append("svg")
							.attr("width", width).attr("height", height)
						.append("g")
							.attr("transform", "translate("+margin.left+","+margin.top+")");

			var xScale = d3.scale.ordinal().domain(year).rangePoints([0,w]);
			var yScale = d3.scale.linear().domain([ 12, 1 ]).range([ h, 0 ]);

			var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			var yAxis = d3.svg.axis().scale(yScale).orient("left");

			var make_x_axis = function() {
				return d3.svg.axis().scale(xScale).orient("bottom")
			}

			var make_y_axis = function() {
				return d3.svg.axis().scale(yScale).orient("left")
			}

			svg.append("g").attr("class", "grid").attr("transform","translate(0," + h + ")")
				.call(make_x_axis().tickSize(-h, 0, 0).tickFormat(""))
			svg.append("g").attr("class", "grid")
				.call(make_y_axis().tickSize(-w, 0, 0).tickFormat(""))

			var xAxisGroup = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + h + ")").call(xAxis)
					.selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.3em").attr("transform", "rotate(-90)");
			var yAxisGroup = svg.append("g").attr("class", "y axis").call(yAxis);
			
			var lineFunction = d3.svg.line().x(function(d, i) {
				return xScale(d.x);
			}).y(function(d, i) {
				return yScale(d.y);
			}).interpolate("linear");

			var getInterpolation = function() {
				var interpolate = d3.scale.quantile().domain([ 0, 1 ]).range(d3.range(1, dataSet.length + 1));
				return function(t) {
					var interpolatedLine = dataSet.slice(0,interpolate(t));
					return lineFunction(interpolatedLine);
				}
			}

			var linePath = svg.append("path").attr("stroke", "steelblue").attr("stroke-width", 2).attr("fill", "none")
					.transition().duration(3000).attrTween("d", getInterpolation);
		}// end: link function
	}
} ]);