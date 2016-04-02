var Quiche = require('quiche');


function Graph() { };

Graph.getUrl = function(labels, dataSet1, dataSet2) {
  var bar = new Quiche('bar');
  bar.setWidth(600);
  bar.setHeight(400);
  bar.setTitle('Operations per second (thousands)');
  bar.setBarSpacing(4); // 6 pixles between bars/groups
  bar.setLegendBottom(); // Put legend at bottom

  bar.addData(dataSet1.data, dataSet1.name, 'FF0000');
  bar.addData(dataSet2.data, dataSet2.name, '0000FF');

  bar.setAutoScaling(); // Auto scale y axis
  bar.addAxisLabels('x', labels);

  return bar.getUrl(true).replace(/%2B/g, '+');
};

module.exports = Graph;
