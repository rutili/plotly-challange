d3.json('data/samples.json').then(({names})=>{
    names.forEach(name => {
        d3.select('select').append('option').text(name);
    });
    showCharts();
});

function optionChanged() {
    showCharts();
};

function showCharts() {
    var sel = d3.select('select').node().value;

    d3.json('data/samples.json').then(({metadata,samples})=>{

        var meta = metadata.filter(obj=>obj.id==sel)[0];
        var sample = samples.filter(obj=>obj.id==sel)[0];

        var { otu_ids, sample_values, otu_labels } = sample;
        
        d3.select('.panel-body').html('');
        Object.entries(meta).forEach(([key,val])=>{
            d3.select('.panel-body').append('h5').text(key.toUpperCase()+': '+val)
        })
        
        var data = [
            {
              x: sample_values.slice(0,10).reverse(),
              y: otu_ids.slice(0,10).reverse().map(x=>'OTU '+x),
              type: 'bar',
              orientation: 'h'
            }
          ];
          
        Plotly.newPlot('bar', data);
    

        var trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        },
        };
        
        var data = [trace1];
        
        var layout = {
        title: {text:'<b>Bacteria Culture per Sample</b>',titlefont:{size:30}},
        showlegend: false,
        height: 600
        };
        
        Plotly.newPlot('bubble', data, layout);
          
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: meta.wfreq,
              title: { text: "<b>Belly Button Washing Frequency</b><br>Scrub per week" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { axis: { range: [0, 10] } }
            }
          ];
          
      var layout = { width: 600, height: 400, xaxis: {showticklabels: true, tick0: 0, dtick: 1}};
          
       Plotly.newPlot('gauge', data, layout);
    })
};