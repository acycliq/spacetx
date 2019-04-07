function renderHeatmapTab(selected) {

    'hide the toolip raised by the section chart'
    d3.select('#tooltip').style('opacity', 0)

    var radioButton,
        checkBox0,
        checkBox1,
        checkBox2,
        json;

    radioButton = selected; // mean or median?
    json = "./notebooks/confusionMatrixData.json"

    
    checkBox0 = '98genes' //  default value
    // if (document.getElementById('beta10')){
    //     document.getElementById('beta10').checked? checkBox0 = 'beta10': checkBox0 = '98genes'
    // }
    //
    //
    // if (document.getElementById('beta30')){
    //     document.getElementById('beta30').checked? checkBox0 = 'beta30': checkBox0 = '98genes'
    // }
    //

    if (document.getElementById('beta10').checked) {
        checkBox0 = 'beta10'
    } else if (document.getElementById('beta30').checked) {
        checkBox0 = 'beta30'
    } else {
        checkBox0 = '98genes'
    }

    if (document.getElementById('nonNeurons').checked) {
        checkBox1 = 'nonNeuronsOn'
    } else {
        checkBox1 = 'nonNeuronsOff'
    }


    if (document.getElementById('rangeDomain').checked) {
        checkBox2 = 'rangeDomainOn'
    } else {
        checkBox2 = 'rangeDomainOff'
    }

    var confMatrixjson = '.\\notebooks\\jsonFiles\\' + checkBox0 +
        '\\' + checkBox2 +
        '\\' + radioButton +
        '\\' + checkBox1 +
        '\\' + 'confusionMatrix.json';
    console.log('Pushing ' + confMatrixjson + ' in confusion matrix')
    // d3.json(confMatrixjson, function (data) {
    //     dataset = []
    //     for (var i = 0; i < data.index.length; i++) {
    //         // console.log(' i: ', i)
    //         for (var j = 0; j < data.columns.length; j++) {
    //             // console.log('i: ' + i + ' j: ' + j + ' value: ' + data.data[i][j])
    //             dataset.push({
    //                 xKey: i + 1,
    //                 xLabel: data.index[i],
    //                 yKey: j + 1,
    //                 yLabel: data.columns[j],
    //                 val: +data.data[i][j],
    //             })
    //         }
    //     }
    //     console.log('json parsed!!');
    //     renderHeatmap(dataset);
    //     var diagonalScore = diagonalMean(dataset);
    //     cmAnalytics(diagonalScore)
    // });

    d3.csv("notebooks/raw_data.csv", function(data){
        norm = 'avg'
        ddl = 1;
        dataset = heatmapDataManager(data, norm, ddl)
        console.log('json parsed!!');
        renderHeatmap(dataset);
        var diagonalScore = diagonalMean(dataset);
        cmAnalytics(diagonalScore)
    })
}


// Update now table on the confusion matrix tab with the analytics results
function cmAnalytics(score) {
    // check if a there is a reference to a datatable.
    // If yes, refresh with the new data
    // Otherwise create and populate a datatable
    if ($.fn.dataTable.isDataTable('#cm_analytics')) {
        table = $('#cm_analytics').DataTable();
        table.clear().rows.add(score).draw();
    } else {
        table = $('#cm_analytics').DataTable({
            "lengthChange": false,
            searching: false,
            "paging": true,
            "data": score,
            "columns": [
                    {
                        title: "Metric",
                        data: "metric"
                    },
                    {
                        title: "Value",
                        data: "value"
                    }
                ],
        });

    }
}

var sectionChartFilters = document.getElementById('section-chart-controls');
var checkItAll = sectionChartFilters.querySelector('input[name="cb:select-all"]');
var clearItAll = sectionChartFilters.querySelector('input[name="cb:clear-all"]');
var inputs = sectionChartFilters.querySelectorAll('tbody>tr>td>input:not([name="cb:select-all"]):not([name="cb:clear-all"])');
var other = sectionChartFilters.querySelector('input[name="cb:other"]');


inputs.forEach(function (input) {
    input.addEventListener('change', function () {
        // first of all, hide the existing tooltip
        d3.select('#tooltip').style('opacity', 0);

        if (!this.checked) {
            checkItAll.checked = false;
            checkItAll.disabled = false;
        }
        if (this.checked) {
            clearItAll.checked = false;
            clearItAll.disabled = false;
        }
        if (!checkItAll.checked) {
            var allChecked = true;
            for (var i = 0; i < inputs.length; i++) {
                if (!inputs[i].checked) {
                    allChecked = false;
                }
            }

            if (allChecked) {
                checkItAll.checked = true;
                checkItAll.disabled = true;
                clearItAll.disabled = false;
                clearItAll.checked = false;
            }
        }

        var selected = getSelected(inputs),
            filteredSectionData = cellData.filter(function (el) {
                var it = selected.includes(el.managedData.IdentifiedType);
                if (input.name === 'Other') {
                    return !it
                } else {
                    return it
                }
            });
        sectionChart(filteredSectionData)
    });

});


checkItAll.addEventListener('change', function () {
    // first of all, hide the existing tooltip
    d3.select('#tooltip').style('opacity', 0);

    inputs.forEach(function (input) {
        input.checked = checkItAll.checked;
    });
    checkItAll.disabled = true;
    clearItAll.disabled = false;
    clearItAll.checked = false;

    var selected = getSelected(inputs),
        filteredSectionData = cellData.filter(function (el) {
            return selected.includes(el.managedData.IdentifiedType);
        });
    sectionChart(filteredSectionData)
});


clearItAll.addEventListener('change', function () {
    // first of all, hide the existing tooltip
    d3.select('#tooltip').style('opacity', 0);

    inputs.forEach(function (input) {
        input.checked = !clearItAll.checked;
    });
    checkItAll.checked = false;
    checkItAll.disabled = false;
    clearItAll.disabled = true;

    var selected = getSelected(inputs),
        filteredSectionData = cellData.filter(function (el) {
            return selected.includes(el.managedData.IdentifiedType);
        });
    sectionChart(filteredSectionData)
});

function getSelected(inputs) {
    //Loop over all selected
    var selected = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            if (inputs[i].name === 'Cck') {
                selected.push('Cck Calb1/Slc17a8*', 'Cck Cxcl14-', 'Cck Cxcl14+', 'Cck Vip Cxcl14-', 'Cck Vip Cxcl14+');
            } else if (inputs[i].name === 'PC') {
                selected.push('PC', 'PC Other1', 'PC Other2')
            } else if (inputs[i].name === 'IS') {
                selected.push('IS1', 'IS2', 'IS3')
            } else {
                selected.push(inputs[i].name);
            }
        }
    }
    return selected
}

function heatmapDataManager(data, norm, ddl) {
// Helper function to handle the data to be fed in to heatmap
// ddl is the drill down level. Data are aggregated over that level.
// For example 'Astro.1', 'Astro.2' ,..., 'Astro.5' will all be combined
// in a big class 'Astro' if ddl=1
// norm is either 'avg' or 'median'. The default is 'median'

    function stripper(d, k) {
        for (i = 0; i < k; ++i) {
            if (d.lastIndexOf('.') > 0) {
                d = d.substring(0, d.lastIndexOf('.'))
            }
        }
        return d
    }

    // var ddl = 4; //drill down level
    var result = data.map(o => Object.entries(o).reduce((o, [k, v]) => {
        //const firsts = k => k.split('.').slice(0, -1).join('.');
        if (k === 'model_class') {
            o[k] = stripper(v, ddl);
        } else {
            k = stripper(k, ddl);
            o[k] = (o[k] || 0) + parseFloat(v);
        }
        return o;
    }, {}));


    var out = d3.nest()
        .key(function (d) {
            return d.model_class;
        })
        .rollup(function (v) {
            var teams = v.map(function (team) {
                delete team.model_class;
                return d3.entries(team);
            }).reduce(function (memo, team) {
                return memo.concat(team);
            }, []);

            var a = d3.nest()
                .key(function (d) {
                    return d.key;
                })
                .rollup(function (w) {
                    return {
                        count: w.length,
                        median: d3.median(w, function (d) {
                            return d['value'];
                        }),
                        avg: d3.mean(w, function (d) {
                            return d['value'];
                        })
                    };
                })
                .entries(teams);

            return a;
        })
        .entries(result);


    dataset = [];
    for (var i = 0; i < out.length; i++) { //62
        // console.log(' i: ', i)
        var cur = out[i],
            curKey = cur.key, // this is the model_class
            curVal = cur.value;
        for (var j = 0; j < curVal.length; j++) { //71
            // console.log('i: ' + i + ' j: ' + j + ' value: ' + data.data[i][j])
            dataset.push({
                xKey: j + 1,
                xLabel: curVal[j].key,
                yKey: i + 1,
                yLabel: cur.key,
                val: norm === 'avg'? +curVal[j].value.avg: +curVal[j].value.median,
            })
        }
    }


    return dataset
}

// listener on the Confusion matrix tab
$('#layers-base input').change(function () {
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('radio button: ' + selected + ' was selected');
    renderHeatmapTab(selected)
});

$('#layers-base-2 input').change(function () {
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#layers-base-3 input').change(function () {
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#layers-base-4 input').change(function () {
    // uncheck the other checkbox
    $("#beta30").prop("checked", false);
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#layers-base-5 input').change(function () {
    // uncheck the other checkbox
    $("#beta10").prop("checked", false);
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('check box clicked');
    renderHeatmapTab(selected)
});

$('#confusion-table-tab').on('shown.bs.tab', function (e) {
    console.log('Confusion matrix tab was clicked.');
    $('#myDropdown').hide(); // hide the dropdown
    $('#dropdown-inefficiency').hide();
    var selected = document.ConfusionMatrixRadioButton.norm.value;
    console.log('Radio button ' + selected + ' is selected');
    renderHeatmapTab(selected);


    // hide the search forms
    $('#nav-table-search').hide();
    $('#nav-place-search').hide();
});

// listener on the Viewer tab
$('#map-tab').on('shown.bs.tab', function (e) {
    console.log('Viewer tab was clicked.');
    $('#myDropdown').show() // show the dropdown
});

// listener on the Worlflow tab
$('#workflow-tab').on('shown.bs.tab', function (e) {
    console.log('Workflow tab was clicked.');
    $('#myDropdown').hide(); // hide the dropdown
    $('#dropdown-inefficiency').hide();

    // hide the toolip raised by the section chart
    d3.select('#tooltip').style('opacity', 0)
});