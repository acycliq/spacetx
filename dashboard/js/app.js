

var cookie = sessionStorage['myvariable']

if (!cookie){ // if you dont have cookie, run the default selection
    console.log('No cookie, starting with default dataset')
    var configSettings = config().get('default')
}
else {
    console.log('Found cookie: ' + cookie)
    var configSettings = config().get(cookie)
}
run(configSettings)

function dispatcher(x){
    console.log('you clicked '+ x)

    //save a cookie
    sessionStorage['myvariable'] = x;

    //reload page
    location.reload(true);

}


function run(c){
    var cellJson = c.cellData;
    var geneJson = c.geneData;

    d3.queue()
        .defer(d3.json, cellJson)
        .defer(d3.csv, geneJson)
        .await(splitCharts(c))
}


function splitCharts(myParam) {
    return (err, ...args) => {

        var cellData = args[0];
        var geneData = args[1];

        for (i = 0; i < cellData.length; ++i) {
            cellData[i].Cell_Num = +cellData[i].Cell_Num
            cellData[i].x = +cellData[i].X
            cellData[i].y = +cellData[i].Y
        }

        //render now the charts
        var issData = sectionChart(cellData);
        dapiChart(issData, geneData, myParam)
        landingPoint(configSettings.name)
    }
}

function landingPoint(name){
    var coords = getLandingCoords(name)

    var evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: coords.x,
        clientY: coords.y,
        /* whatever properties you want to give it */
    });
    document.getElementById('sectionOverlay').dispatchEvent(evt);
}

//create ramp
function getLandingCellNum(str) {
    return str === 'default' ? 2279 :
        str === 'Simulation_1' ? 2279 :
            str === 'Simulation_2' ? 2279 :
                str === 'Simulation_3' ? 2279 :
                    str === 'Simulation_4' ? 2279 :
                        str === 'Simulation_5' ? 2279 :
                            str === 'Simulation_6' ? 2279 :
                1;
}


function getLandingCoords(str){
    var cn = getLandingCellNum(str);
    var x,
        y;

    if ( !d3.select('#Cell_Num_' + cn).empty() ){
        x = +d3.select('#Cell_Num_' + cn).attr('cx');
        y = +d3.select('#Cell_Num_' + cn).attr('cy');
    }
    else{
        x = 0;
        y = 0;
    }

    var px = $('#sectionOverlay').offset().left + x;
    var py = $('#sectionOverlay').offset().top + y;

    var out = {x:px, y:py};

    return out
}

function getMinZoom(str) {
    return str === 'default' ? 4 : 2;
}
