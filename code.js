var n = 4, // The number of series
    m = 58; // The number of values per series


// The xz array has m elements, representing the x-values shared by all series.
// The yz array has n elements, representing the y-values of each of the n series.
// Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
// The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.

var xz = d3.range(m),
    yz = d3.range(n).map(function() { return bumps(m); }),
    y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
    yMax = d3.max(yz, function(y) { return d3.max(y) }),
    y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });


var svg = d3.select('svg'),
  margin = {top: 40, right: 10, bottom: 20, left: 10},
  width = +svg.attr('width') - margin.left - margin.right,
  height = +svg.attr('height') - margin.top - margin.bottom,
  g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.bottom})`);

  var x = d3.scaleBand() // Scales the band widths for the bar chart
    .domain(xz)
    .rangeRound([0, width])
    .padding(0.08);

  var y = d3.scaleLinear() // scales the height data points
    .domain([0, y1Max])
    .range([height, 0]);
// Returns an array of m psuedorandom, smoothly-varying non-negative numbers.
// Inspired by Lee Byron’s test data generator.
// http://leebyron.com/streamgraph/
function bumps(m) {
  var values = [], i, j, w, x, y, z;

  // Initialize with uniform random values in [0.1, 0.2).
  for (i = 0; i < m; ++i) {
    values[i] = 0.1 + 0.1 * Math.random();
  }

  // Add five random bumps.
  for (j = 0; j < 5; ++j) {
    x = 1 / (0.1 + Math.random());
    y = 2 * Math.random() - 0.5;
    z = 10 / (0.1 + Math.random());
    for (i = 0; i < m; i++) {
      w = (i / m - y) * z;
      values[i] += x * Math.exp(-w * w);
    }
  }

  // Ensure all values are positive.
  for (i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values;
}