function addWords(){
    var words = prompt("Please add words/phrases, separated by commas");
    var regex = /\s*,\s*/;
    var words_list = words.split(regex);
    var dataObject = {'keywords': words_list};
    $.ajax({
        url : "/addkeyword",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataObject),
        success: function(data){
            console.log(data);
            window.location.reload(true);
        },
        error: function (textStatus, errorThrown) {
           console.log("ERROR: " + textStatus);
           console.log("The error thrown: " + errorThrown);
        }
    });
}

function removeWords(){
    var words = prompt("Please list words/phrases to remove, separated by commas");
    var regex = /\s*,\s*/;
    var words_list = words.split(regex);
    var dataObject = {'keywords': words_list};
    $.ajax({
        url : "/removekeyword",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataObject),
        success: function(data){
            console.log(data);
            window.location.reload(true);
        },
        error: function (textStatus, errorThrown) {
           console.log("ERROR: " + textStatus);
        }
    });
}

function displayWords(data){
    var count = 0;
    for (var i = 0; i < data.length; i++){
        if (count == 0){
            var cur_div = document.createElement("div");
            cur_div.setAttribute("class", "row");
            var element = document.getElementById("container_id");
            element.appendChild(cur_div);
        }
        var button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-outline-danger");
        button.setAttribute("data-toggle", "modal");
        button.setAttribute("data-target", "#keywordModal");
        button.setAttribute("data-keyword", data[i]["keyword"]);
        var text = document.createTextNode(data[i]["keyword"]);
        button.appendChild(text);
        cur_div.appendChild(button);
        if (count == 6){
            count = 0;
        }
        else{
            count++;
        }
    }
}
