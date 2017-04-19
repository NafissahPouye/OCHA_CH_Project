function generatingComponent(vardata, vargeodata){

  var lookUp = genLookup(vargeodata) ;

  var trends = dc.compositeChart('#CompositeChart') ;
  var req_trends = dc.compositeChart('#Requirement')

  var chCarte = dc.leafletChoroplethChart('#carte') ;

   var scale_maxDate = new Date(2016, 3, 10);
   var numberFormat = d3.format(',f');

  var dateFormat = d3.time.format("%Y-%m-%d");
  var dateFormatPretty = d3.time.format("%b %Y");
  var dateFormatPretty1 = d3.time.format("%Y");
  function formatDate(value) {
   var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   return monthNames[value.getMonth()] + " " + value.getDate();
};
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

  var colors = ['#FAE61E','#FAE61E','#E67800','#C80000','#640000', '#023858', '#a6bddb','#3690c0'] ;

 //var x = d3.scaleLinear() ;
//var axis = d3.axisLeft(scale);

  var chCarteDim = cf.dimension(function (d) { return d.country}) ;

  var chCarteGroup = chCarteDim.group().reduceSum( function (d) { return d.phase1}) ;

  var dateDimension = cf.dimension(function (d) { return d.date});

  var groupPhase1 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase1)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase1 / 1000;}

  });
 
  var groupPhase2 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase2)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase2 / 1000;}

  });

  var groupPhase3 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase3)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase3 / 1000;}

  });
  var groupPhase4 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase4)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase4 / 1000;}

  });
var groupPhase5 = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.phase5)){console.log('Not included: ');console.log(d);return 0;} else {return d.phase5 / 1000;}

  });
  var groupFoodsec = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.food_sec_req)){console.log('Not included: ');console.log(d);return 0;} else { return d.food_sec_req;}

  });

  function remove_space(groupFoodsec) { 
  return {
    all: function() {
      
      return groupFoodsec.all().filter(function(d) {
        console.log(d)
        return d.key != "";
      });
    }
  };
}

  var groupFundings = dateDimension.group().reduceSum(function (d){

    if(isNaN(d.funded)){console.log('Not included: ');console.log(d);return 0;} else { return d.funded;}

  });
  function remove_space(groupFundings) { 
  return {
    all: function() {
      
      return groupFundings.all().filter(function(d) {
        console.log(d)
        return d.key != "";
      });
    }
  };
}
 // var groupfood_sec_req = dateDimension.group().reduceSum(function (d) { return d.food_sec_req ;})

  /*var groupFoodsec = {all:function () {return groupfood_sec_req.all().filter(function(d) {
      return d.value != 0;
    })
   }
};
  
  var groupfunding = dateDimension.group().reduceSum(function (d){ return d.funded ;})
  var groupFundings = {all:function () {return groupfunding.all().filter(function(d) {
      return d.value != 0;
    })
   }
};
*/
  req_trends
            .width(550)
            .height(230)
            .dimension(dateDimension)
            .x(d3.time.scale().domain([new Date(2013, 11, 0), new Date(2017, 3, 31)]))
            .elasticY(true)
            .legend(dc.legend().x($('#Requirement').width()-150).y(0).gap(3))
            .valueAccessor(function(d){return d.value.avg != "";})
            .shareTitle(false)
            //.omit("")
            .compose([
                dc.lineChart(req_trends).group(groupFoodsec, 'Food Sec Requirement').colors(colors[5]).title(function (d) { return [dateFormatPretty1(d.key),  "Food Sec Req: " + numberFormat(d.value) + ' Million US $'].join('\n'); }),
                dc.lineChart(req_trends).group(groupFundings, 'Funding').colors(colors[6]).title(function (d) { return [dateFormatPretty1(d.key), "Funding: " + numberFormat(d.value) + ' Million US $'].join('\n'); }),
              ])
            .margins({top: 20, right: 0, bottom: 30, left: 60})
            .brushOn(false)
            .renderHorizontalGridLines(true)
            .renderTitle(true)
            .xAxisLabel("Date")
            .xAxis().ticks(3)
            req_trends.yAxis().tickFormat(function (v) {
            return v + 'M';
        });

            
           
 trends

      .width(550)

      .height(260)

      .dimension(dateDimension)

      .x(d3.time.scale().domain([new Date(2013, 11, 0), new Date(2017, 5, 31)]))

      .elasticY(true)

      .valueAccessor(function(d){return d.value.avg;})
            
      .shareTitle(false)

      .compose([

        dc.lineChart(trends).group(groupPhase2, 'Under Pressure').colors(colors[1]).title(function (d) { return [ dateFormatPretty(d.key), "Under Pressure:  " + d.value].join('\n'); }),

        dc.lineChart(trends).group(groupPhase3, 'Crisis').colors(colors[2]).title(function (d) { return [dateFormatPretty(d.key), "Crisis:  " + d.value].join('\n'); }),

        dc.lineChart(trends).group(groupPhase4, 'Emergency').colors(colors[3]).title(function (d) { return [dateFormatPretty(d.key), "Emergency:  " + d.value].join('\n'); }),

        dc.lineChart(trends).group(groupPhase5, 'Famine').colors(colors[4]).title(function (d) { return [dateFormatPretty(d.key), "Famine:  " + d.value ].join('\n'); }),

        ])

      .brushOn(false)
      .renderHorizontalGridLines(true)
      .yAxisLabel("Population")
      .margins({top: 20, right: 0, bottom: 20, left: 60})
      .legend(dc.legend().x($('#CompositeChart').width()-110).y(0).gap(2))
      .xAxis().ticks(7);
      
      trends.yAxis().tickFormat(function (v) {
            return v + 'k';
        });
      

  dc.dataCount('count-info')

    .dimension(cf)

    .group(all);

//define the map

      chCarte.width(4)

             .mapOptions(true)
            
             .dimension(chCarteDim)

             .group(chCarteGroup)

             .center([1.1,1.1])

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