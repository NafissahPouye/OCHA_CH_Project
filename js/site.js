function generatingComponent(vardata, vargeodata){

  var lookUp = genLookup(vargeodata) ;

  var trends = dc.compositeChart('#CompositeChart') ;
  var req_trends = dc.lineChart('#Requirement')

  var chCarte = dc.leafletChoroplethChart('#carte') ;

   var scale_maxDate = new Date(2016, 3, 10);

  var dateFormat = d3.time.format("%Y-%m-%d");
    vardata.forEach(function (e) {
        e.date = dateFormat.parse(e.date);
    });

  var xScaleRange = d3.time.scale().domain([new Date(2014, 4, 1), scale_maxDate]);
  function formatDate(value) {
   var monthNames = [  "March","Apr", "Nov", "Dec"];
   return monthNames[value.getMonth()] + " " + value.getDate();
};
  var cf = crossfilter(vardata);

  var all = cf.groupAll();

  var colors = ['#64FE2E','#F7FE2E','#FE2E2E','#2E64FE'] ;

 //var x = d3.scaleLinear() ;
//var axis = d3.axisLeft(scale);

  var chCarteDim = cf.dimension(function (d) { return d.country}) ;

  var chCarteGroup = chCarteDim.group().reduceSum( function (d) { return d.phase1}) ;

  var dateDimension = cf.dimension(function (d) { return d.date});

  var groupPhase1 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase1)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase1;}

  });
 
  var groupPhase2 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase2)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase2;}

  });

  var groupPhase3to5 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase3to5)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase3to5;}

  });

  var groupRequirements = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.project_req)){console.log('Not included: ');console.log(d);return 0;} else {return d.project_req;}

  });

  req_trends
            .width(450)
            .height(160)
            .dimension(dateDimension)
            .x(xScaleRange)
            .margins({top: 20, right: 5, bottom: 20, left: 80})
            .elasticY(true)
            .brushOn(false)
            .legend(dc.legend().x($('#Requirement').width()-200).y(0).gap(2))
            .group(groupRequirements, 'Requirements');
            //.lineChart(req_trends)
 trends

      .width(450)

      .height(250)

      .dimension(dateDimension)

      .x(xScaleRange)

      //.x(d3.time.scale().domain([new Date(2013, 12, 0), scale_maxDate]))

      .elasticY(true)

      .compose([

        dc.lineChart(trends).group(groupPhase1, 'Phase 1').colors(colors[0]),

        dc.lineChart(trends).group(groupPhase2, 'Phase 2').colors(colors[1]),

        dc.lineChart(trends).group(groupPhase3to5, 'Phase 3+').colors(colors[2]),

     //   dc.lineChart(trends).group(groupRequirements, 'Project Requirement')

        ])

      .brushOn(false)
      .yAxisPadding(500)
      .renderHorizontalGridLines(true)
      //.xAxisLabel("Date")
      //.yAxisLabel("Trends")
      .margins({top: 15, right: 5, bottom: 20, left: 60})
      .legend(dc.legend().x($('#CompositeChart').width()-170).y(0).gap(5))
      .xAxis().ticks(8);
      //trends.yAxis().ticks(5);
      

      //.xAxis();
 

  dc.dataCount('count-info')

    .dimension(cf)

    .group(all);

//define the map

      chCarte.width(100)
            //.height(460)

             .dimension(chCarteDim)

             .group(chCarteGroup)

             .center([1,1])

             .zoom(0)

             .geojson(vargeodata)

             .colors(['#CCCCCC','#03a9f4'])

             .colorDomain([0,1])

             .colorAccessor(function (d){

               if (d>0) {

                 return 1;

               } else {

                 return 0;

               }

             })

             .featureKeyAccessor(function (feature){

               return feature.properties['ISO3'];

             }).popup(function (d){

               return lookUp[d];

             })

             .renderPopup(true);
        
      dc.renderAll();

      var map = chCarte.map();

      zoomToGeom(vargeodata);

      function zoomToGeom(geodata){

        var bounds = d3.geo.bounds(geodata) ;

        map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);

      }

      function genLookup(geojson) {

        var lookup = {} ;

        geojson.features.forEach(function (e) {

          lookup[e.properties['ISO3']] = String(e.properties['NAME']);

        });

        return lookup ;

      }

}

var dataCall = $.ajax({

    type: 'GET',

    url: 'data/datas.json',

    dataType: 'json',

});

var geomCall = $.ajax({

    type: 'GET',

    url: 'data/wa.geojson',

    dataType: 'json',

});

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){

    var geom = geomArgs[0];

    geom.features.forEach(function(e){

        e.properties['ISO3'] = String(e.properties['NAME']);

    });

    generatingComponent(dataArgs[0],geom);

});