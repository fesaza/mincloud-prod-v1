
function onDataBoundCumpleanios(e) {
    var dataItems = e.sender.dataSource.view();
    for (var j = 0; j < dataItems.length; j++) {
        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
        var ahora = new Date();
        var fechaHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);

        var _fecha = dataItems[j].get("FechaNacimiento");

        var fecha = new Date(ahora.getFullYear(), _fecha.getMonth(), _fecha.getDate());

        if (fecha < fechaHoy) {
            row.addClass("vencido");
        } else {
            if (fecha.toDateString() == fechaHoy.toDateString()) {
                row.addClass("warning");
            }
        }
    }
}

function onDataBound(e) {
    setRowClassGrid(e, "FechaSeguimiento");
}

function setRowClassGrid(e, propertyName) {
    var dataItems = e.sender.dataSource.view();
    for (var j = 0; j < dataItems.length; j++) {
        var _fecha = dataItems[j].get(propertyName);
        var fecha = new Date(_fecha);

        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
        var ahora = new Date();
        var fechaHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
        if (fecha < fechaHoy) {
            row.addClass("vencido");
        } else {
            if (fecha.toDateString() == fechaHoy.toDateString()) {
                row.addClass("warning");
            }
        }
    }
}

function createChart() {
    configPersonasPerfiles();
    configDataMinisterios();
    configDataGeneros();
    chartPersonasBarrios();
    chartPersonasSeguimientos();
    chartPersonasEdades();

    $('#grdFiltros').data('kendoGrid').dataSource.read();
    $('#grdSegPendientes').data('kendoGrid').dataSource.read();
}

function configDataGeneros() {
    var ds = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return "../personas/GetDistribucionPersonasGeneros";
                },
                dataType: "json"
            }
        }, group: { field: "perfil" },
        sort: {
            field: "date",
            dir: "asc"
        }, schema: {
            model: {
                fields: {
                    date: {
                        type: "date"
                    }
                }
            }
        }
    });
    configChartGeneros(ds);
}

function configChartGeneros(data) {
    $("#generos").kendoChart({
        title: {
            position: "bottom",
            text: ""
        },
        legend: {
            position: "bottom"
        },
        dataSource: data,
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: \n #= value#%",

            }
        },
        chartArea: {
            height: 300
        },
        series: [{
            type: "pie",
            field: "value",
            categoryField: "genero",
            //explodeField: "explode"
        }],
        seriesColors: ["#03a9f4", "#ff9800", "#fad84a", "#4caf50"],
        tooltip: {
            visible: true,
            template: "${ category } - ${ value }%"
        },
                    seriesClick: function (e) {
                debugger;
                if (e.originalEvent.type === "contextmenu") {
                    // Disable browser context menu
                    e.originalEvent.preventDefault();
                }
                setFilter("Genero", e.category);
            }

    });
}

function configDataMinisterios() {
    var ds = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return "../personas/GetHistoricoIngresoPersonas";
                },
                dataType: "json"
            }
        }, group: { field: "perfil" },
        sort: {
            field: "date",
            dir: "asc"
        }, schema: {
            model: {
                fields: {
                    date: {
                        type: "date"
                    }
                }
            }
        }
    });
    configChartHistoricos(ds);
}

function configChartHistoricos(ds) {
    $("#historicos").kendoChart({

        dataSource: ds,
        chartArea: {
            height: 300
        },
        series: [{
            type: "column",
            field: "value",
            aggregate: "sum",
            name: "#= group.value # ",
            categoryField: "date",
            tooltip: {
                visible: true,
                template: " ${ series.name } - ${ value } miembro(s)"
            }
        }],
        legend: {
            position: "bottom"
        },
        valueAxis: {
            line: {
                visible: false
            },

        },
        categoryAxis: {
            baseUnit: "months",
            majorGridLines: {
                visible: false
            }
        },
        seriesClick: function (e) {
            debugger;
            if (e.originalEvent.type === "contextmenu") {
                // Disable browser context menu
                e.originalEvent.preventDefault();
            }
            //$.get("../personas/SetFilter?field=Historico&value=" + e.category.toJSON(), function (data) {
            //    createChart();
            //});
            setFilter("Historico", e.category.toJSON());
        }
    });
}

function configPersonasPerfiles() {
    var totalLideres = 0;
    var totalNuevos = 0;
    var totalAsistentes = 0;


    $.get("../personas/GetPersonasByPerfil?perfil=Lider", function (data) {
        totalLideres = data.length;


        $.get("../personas/GetPersonasByPerfil?perfil=Nuevo", function (data) {
            totalNuevos = data.length;


            $.get("../personas/GetPersonasByPerfil?perfil=Asistente", function (data) {
                totalAsistentes = data.length;

                var totalMiembros = totalNuevos + totalAsistentes + totalLideres;



                var data = [
                    {
                        "perfil": "Líderes",
                        "percentage": (totalLideres * 100) / totalMiembros,
                        "explode": true
                    },
                    {
                        "perfil": "Nuevos",
                        "percentage": (totalNuevos * 100) / totalMiembros
                    },
                    {
                        "perfil": "Asistentes",
                        "percentage": (totalAsistentes) * 100 / totalMiembros
                    }
                ];

                createPersonasPerfiles(data);
            });

        });

    });
}

function createPersonasPerfiles(data) {
    $("#perfiles").kendoChart({
        title: {
            position: "bottom",
            text: ""
        },
        legend: {
            position: "bottom"
        },
        dataSource: {
            data: data
        },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: \n #= kendo.format('{0:n2}', value)#%",
            }
        },
        chartArea: {
            height: 300
        },
        series: [{
            type: "pie",
            field: "percentage",
            categoryField: "perfil",
            //explodeField: "explode"
        }],
        seriesColors: ["#03a9f4", "#ff9800", "#fad84a", "#4caf50"],
        tooltip: {
            visible: true,
            template: "${ category } - ${ value }%"
        },
        seriesClick: function (e) {
            debugger;
            if (e.originalEvent.type === "contextmenu") {
                // Disable browser context menu
                e.originalEvent.preventDefault();
            }
            //$.get("../personas/SetFilter?field=Perfil&value=" + e.category, function (data) {
            //    createChart();
            //});
            setFilter("Perfil", e.category);
        }
    });
}

function chartPersonasBarrios() {

    $.get("../personas/GetPersonasBarrios", function (data) {

        for (var i = 0; i < data.length; i++) {
            data[i].percentage = (data[i].count / data[i].total) * 100;
            debugger;
        }

        $("#barrios").kendoChart({
            title: {
                position: "bottom",
                text: ""
            },
            legend: {
                position: "bottom"
            },
            dataSource: {
                data: data
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "transparent",
                    template: "#= category #: \n #= kendo.format('{0:n2}', value) #%"
                }
            },
            chartArea: {
                height: 300
            },
            series: [
                {
                    type: "pie",
                    field: "percentage",
                    categoryField: "barrio",
                    //explodeField: "explode"
                }
            ],
            seriesColors: ["#03a9f4", "#ff9800", "#fad84a", "#4caf50"],
            tooltip: {
                visible: true,
                template: "${ category } - ${ value }%"
            },
            seriesClick: function (e) {
                debugger;
                if (e.originalEvent.type === "contextmenu") {
                    // Disable browser context menu
                    e.originalEvent.preventDefault();
                }
                //$.get("../personas/SetFilter?field=Perfil&value=" + e.category, function (data) {
                //    createChart();
                //});
                setFilter("Cantidad por Barrio", e.category);
            }
        });

        $("#barriosCount").kendoChart({

            dataSource: data,
            chartArea: {
                height: 300
            },
            series: [{
                type: "column",
                field: "count",
                tooltip: {
                    visible: true,
                    template: " ${ value } persona(s)"
                }
            }],
            legend: {
                position: "bottom"
            },
            valueAxis: {
                line: {
                    visible: false
                },
            },
            seriesColors: ["#03a9f4", "#ff9800", "#fad84a", "#4caf50"],
            categoryAxis: {
                field: "barrio",
                labels: {
                    rotation: 60
                }
            },
            seriesClick: function (e) {
                debugger;
                if (e.originalEvent.type === "contextmenu") {
                    // Disable browser context menu
                    e.originalEvent.preventDefault();
                }
                setFilter("Distribución Barrio", e.category);
            }
        });
    });
}



function chartPersonasSeguimientos() {
    $.get("../personas/GetPersonasSeguimientoReport", function (data) {
        $("#seguimientosChart").kendoChart({

            dataSource: data,
            chartArea: {
                height: 300
            },
            series: [{
                type: "column",
                field: "count",
                tooltip: {
                    visible: true,
                    template: " ${ value } persona(s)"
                }
            }],
            legend: {
                position: "bottom"
            },
            valueAxis: {
                line: {
                    visible: false
                },
            },
            categoryAxis: {
                field: "seguimiento",
                labels: {
                    rotation: 60
                }
            }
        });
    });
}

function chartPersonasEdades() {
    //seriesDefaults: {
    //        type: "line",
    //        style: "smooth"
    //},
    $.get("../personas/GetPersonasEdades", function (data) {
        $("#edadesChart").kendoChart({
            dataSource: data,
            chartArea: {
                height: 300
            },
            series: [{
                type: "column",
                field: "count",
                tooltip: {
                    visible: true,
                    template: " ${ value } persona(s)"
                }
            }],
            seriesDefaults: {
                type: "line",
                style: "smooth"
            },
            legend: {
                position: "bottom"
            },
            valueAxis: {
                line: {
                    visible: false
                },
            },
            seriesColors: ["#fad84a", "#4caf50"],
            categoryAxis: {
                field: "edad",
                labels: {
                    //rotation: 60
                }
            },
            seriesClick: function (e) {
                debugger;
                if (e.originalEvent.type === "contextmenu") {
                    // Disable browser context menu
                    e.originalEvent.preventDefault();
                }
                setFilter("Edad", e.category);
            }
        });
    });
}

function clearFilter(field) {
    $.get("../personas/ClearFilter?field=" + field, function (data) {
        createChart();

    });
    debugger;
    var div = $("#" + field + "_filter");
    div.remove();
}

function setFilter(field, value) {
    $.get("../personas/SetFilter?field=" + field + "&value=" + value, function (data) {
        createChart();
        var f = "\"" + field + "\"";
        $("#filtros").append("<div id='" + field + "_filter'><button class='btn btn-xs btn-warning width-30' style='margin:3px;' onclick='clearFilter(" + f + ")'><i class='fa fa-times'></i>  " + field + " = " + value + " </button></div>");
    });
}

$(document).ready(createChart);
$(document).bind("kendo:skinChange", createChart);
