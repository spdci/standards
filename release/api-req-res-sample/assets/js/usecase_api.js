$(function () {
    $("#logo").load("./logo.html");
});
var optionsrenderJson = {
    collapsed: false,
    rootCollapsable: true,
    withQuotes: true,
    withLinks: true
};
var download_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">' +
    '  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>' +
    '  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>' +
    '</svg>'
$(function () {

    $.getJSON('./assets/example_files/crvsusecase.json', function (data) {

        $.each(data, function (index, val) {
            var usecaseid = val["processflow_id"]
            var usecase_name = val["processflow_name"]
            var usecaseDiv = '<div class="col-sm-12 mainusecasediv"><div class="card">' +
                ' <div class="card-header collapsed " id="collapseCardheader' + usecaseid + '" data-toggle="collapse" data-target="#collapseCardBody' + usecaseid + '" aria-expanded="false" aria-controls="collapseCardBody' + usecaseid + '">' +
                ' <span class="arrow"></span> <span style="margin-left: 10px;">' + usecase_name +
                ' </span></div><div id="collapseCardBody' + usecaseid + '" class="collapse "><div class="card-body"><div class="row"><div class="col-sm-6"> ' +
                ' <h5>Request Json<button class="btn btn-sm " onclick="download_file(\'' + usecaseid + '\',\'req\')"> <i class="fas fa-download"></i></button></h5>   <pre class="reqjsonpre" id="req' + usecaseid + '"></pre>' +
                ' </div><div class="col-sm-6">' +
                ' <h5>Response Json<button class="btn btn-sm " onclick="download_file(\'' + usecaseid + '\',\'res\')"> <i class="fas fa-download"></i></button></h5>      <pre class="resjsonpre" id="res' + usecaseid + '"></pre>' +
                ' </div></div></div></div></div></div>';
            $("#usecasesDiv").append(usecaseDiv);
            $.getJSON('./assets/example_files/' + usecaseid + "req.json", function (data) {
                renderJson('req' + usecaseid, data)
            });
            $.getJSON('./assets/example_files/' + usecaseid + "res.json", function (data) {
                renderJson('res' + usecaseid, data)
            });
        });

        let hash = window.location.hash;
        let value = hash.substring(1);
        console.log(value);
        $("#collapseCardBody" + value).addClass("show");
        $("#collapseCardheader" + value).removeClass("collapsed");

        var element = $("#collapseCardheader" + value);
        if (element.length) {
            $('html, body').animate({
                scrollTop: element.offset().top
            }, 2000);
        } else {
            console.error("Element not found: #collapseCardheader" + value);
        }
    });
});

function renderJson(divid, jsoninput) {
    try {
        var input = eval('(' + JSON.stringify(jsoninput) + ')');
    }
    catch (error) {
        return alert("Cannot eval JSON: " + error);
    }
    $('#' + divid).jsonViewer(input, optionsrenderJson);
}
function download_file(usecaseid, reqres) {
    $.ajax({
        url: './assets/example_files/' + usecaseid + reqres + ".json",
        dataType: 'json',
        success: function (data) {
            // Convert JSON object to a string
            var jsonString = JSON.stringify(data);

            // Create a <a> element with the JSON data as a download
            var link = document.createElement('a');
            link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);

            var match = usecaseid.match(/\d+/);

            // Check if a match is found
            var number = "-";
            if (match) {
                number = parseInt(match[0]);
                console.log(number); // Output: 1
            } else {
                console.log("No number found in the string.");
            }

            if (reqres == "req") {
                link.download = "Process_Flow_" + number + '_Request.json';
            } else if (reqres == "res") {
                link.download = "Process_Flow_" + number + '_Response.json';
            }

            // Trigger the download by programmatically clicking the link
            link.click();
        },
        error: function () {
            console.log('Error loading the JSON file');
        }
    });
}