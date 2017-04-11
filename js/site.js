function generatingComponent(vardata, vargeodata){

  var lookUp = genLookup(vargeodata) ;

  var trends = dc.compositeChart('#CompositeChart') ;
  var req_trends = dc.compositeChart('#Requirement')

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

  var colors = ['#31B404','#FFFF00','#FFC000','#C00000','#FF0000', '#023858', '#a6bddb','#3690c0'] ;

 //var x = d3.scaleLinear() ;
//var axis = d3.axisLeft(scale);

  var chCarteDim = cf.dimension(function (d) { return d.country}) ;

  var chCarteGroup = chCarteDim.group().reduceSum( function (d) { return d.phase1}) ;

  var dateDimension = cf.dimension(function (d) { return d.date});

  var groupPhase1 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase1)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase1 / 1000000;}

  });
 
  var groupPhase2 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase2)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase2 / 1000000;}

  });

  var groupPhase3 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase3)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase3 / 1000000;}

  });
  var groupPhase4 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase4)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase4 / 1000000;}

  });
var groupPhase5 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase5)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase5 / 1000000;}

  });
  var groupRequirements = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.project_req)){console.log('Not included: ');console.log(d);return 0;} else {return d.project_req / 1000000;}

  });
  var groupfood_sec_req = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.food_sec_req)){console.log('Not included: ');console.log(d);return 0;} else {return d.food_sec_req / 1000000;}

  });
  var groupfunding = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.funded)){console.log('Not included: ');console.log(d);return 0;} else {return d.funded / 1000000;}

  });

  req_trends
            .width(450)
            .height(225)
            .dimension(dateDimension)
            //.x(xScaleRange)
            .x(d3.time.scale().domain([new Date(2013, 11, 0), new Date(2017, 3, 31)]))//.range([2014,2017]))
            // .tickValues([2014,2015,2016,2017])
            .elasticY(true)
            
            .legend(dc.legend().x($('#Requirement').width()-200).y(0).gap(2))
            
            //.group(groupRequirements, 'Requirements')
            .compose([
                dc.lineChart(req_trends).group(groupRequirements, 'Requirement').colors(colors[5]),
                dc.lineChart(req_trends).group(groupfood_sec_req, 'Food Sec Requirement').colors(colors[6]),
                dc.lineChart(req_trends).group(groupfunding, 'Funding').colors(colors[7]),
              ])
            .margins({top: 8, right: 12, bottom: 25, left: 60})
            .brushOn(false)
            .renderHorizontalGridLines(true)
            .xAxisLabel("Date")
             
             .xAxis().ticks(4);

            req_trends.yAxis().tickFormat(function (v) {
            return v + 'M';
        });
            

 trends

      .width(450)

      .height(225)

      .dimension(dateDimension)

      //.x(xScaleRange)

      .x(d3.time.scale().domain([new Date(2013, 11, 0), new Date(2017, 5, 31)]))

      .elasticY(true)

      .compose([

        dc.lineChart(trends).group(groupPhase1, 'Phase 1').colors(colors[0]),

        dc.lineChart(trends).group(groupPhase2, 'Phase 2').colors(colors[1]),

        dc.lineChart(trends).group(groupPhase3, 'Phase 3').colors(colors[2]),

        dc.lineChart(trends).group(groupPhase4, 'Phase 4').colors(colors[3]),

        dc.lineChart(trends).group(groupPhase3, 'Phase 5').colors(colors[4]),

        ])

      .brushOn(false)
      //.yAxisPadding(500)
      .renderHorizontalGridLines(true)
      //.xAxisLabel("Date")
      .yAxisLabel("Phases")
      .margins({top: 8, right: 12, bottom: 25, left: 60})
      .legend(dc.legend().x($('#CompositeChart').width()-170).y(0).gap(5))

      .xAxis().ticks(4);
      
      trends.yAxis().tickFormat(function (v) {
            return v + 'M';
        });
      

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