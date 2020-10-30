function formatDate(datestring) {
  var date = new Date(datestring);
  var zone = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
  return date.toDateString() + " at " + date.toLocaleTimeString() + " " + zone;
}

function loadHistoryTable(data) {
  console.log("MADE IT TO THE HISTORY TABLE");
  var table = document.getElementById("historyTable").getElementsByTagName('tbody')[0];
  if (data.length < 1) {
    document.getElementById("historyTable").setAttribute("style", "display:none;");
    var header = document.getElementsByClassName("header")[0];
    header.getElementsByTagName("h4")[0].innerHTML = "No Past Interventions";
    header.getElementsByTagName("p")[0].innerHTML = "You currently have no completed interactions.";
    return;
  }
  for (var i = 0; i < data.length; i++){
    // Uncomment the following once tested:
    // if (data[i]["status"] != "Accepted" || data[i]["moderator"] != [insert var for moderator email here]) continue;
    console.log("Creating row " + i);
    var row = table.insertRow(-1);
    if (!(i%2)) {
      row.setAttribute("class", "stripe");
    }

    // Insert new cells (<td> elements) for the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    //set attributes of td
    cell1.setAttribute("data-toggle", "collapse");
    cell1.setAttribute("data-target", "\#info"+i);
    cell1.setAttribute("class", "accordion-toggle");
    cell2.setAttribute("data-toggle", "collapse");
    cell2.setAttribute("data-target", "\#info"+i);
    cell2.setAttribute("class", "accordion-toggle");

    // Add some text to the new cells:
    cell1.innerHTML = data[i]["name"];
    cell2.innerHTML = data[i]["post_content"];
    cell3.innerHTML = new Date(data[i]["complete_date"]).toDateString();

    // Expanding row information
    var expand = table.insertRow(-1);
    expand.setAttribute("class", "hiddenWrapper");
    var infocell = expand.insertCell(0);
    infocell.setAttribute("colspan", "3");
    infocell.setAttribute("class", "hiddenRow");

    var newDiv = document.createElement("div");
    newDiv.setAttribute("id", "info"+i);
    newDiv.setAttribute("class", "collapse");
    infocell.appendChild(newDiv);

    var content = document.createElement("div");
    content.setAttribute("class", "content");
    newDiv.appendChild(content);

    posterInfo(content, data[i]);
    postInfo(content, data[i]);
    interventionInfo(content, data[i]);
  }
}

function posterInfo(content, entry) {
  var heading = document.createElement("H5");
  heading.innerHTML = "Poster Information";
  content.appendChild(heading);

  var name = document.createElement("div");
  name.innerHTML = "<b>Name:</b> " + entry["name"];
  content.appendChild(name);

  var age = document.createElement("div");
  age.innerHTML = "<b>Age:</b> " + entry["age"];
  content.appendChild(age);

  var profile_url = document.createElement("div");
  profile_url.innerHTML = "<b>Profile URL:</b> " + "<a href=\"" + entry["profile_url"] + "\">" + entry["profile_url"] + "</a>";
  content.appendChild(profile_url);

  var hr = document.createElement("hr");
  content.appendChild(hr);
}

function postInfo(content, entry) {
  var heading = document.createElement("H5");
  heading.innerHTML = "Post";
  content.appendChild(heading);

  var full_post = document.createElement("div");
  content.appendChild(full_post);
  var bold = document.createElement("b");
  full_post.appendChild(bold);
  var url = document.createElement("a");
  url.innerHTML = "Full Post:";
  url.setAttribute("href", entry["post_url"]);
  bold.appendChild(url);

  var post_content = document.createElement("div");
  post_content.setAttribute("class", "panel panel-default");
  full_post.appendChild(post_content);

  var post_text = document.createElement("div");
  post_text.setAttribute("class", "panel-body");
  post_text.innerHTML = "\"" + entry["post_content"].trim() + "\"";
  post_content.appendChild(post_text);

  var keywords = document.createElement("div");
  keywords.innerHTML = "<b>Keywords:</b> " + entry["keywords"].join(', ');
  content.appendChild(keywords);

  var post_url = document.createElement("div");
  post_url.innerHTML = "<b>Post URL:</b> " + "<a href=\"" + entry["post_url"] + "\">" + entry["post_url"] + "</a>";
  content.appendChild(post_url);

  var date_posted = document.createElement("div");
  date_posted.innerHTML = "<b>Date Posted:</b> " + formatDate(entry["post_date"]);
  content.appendChild(date_posted);

  var hr = document.createElement("hr");
  content.appendChild(hr);
}

function interventionInfo(content, entry) {
  var heading = document.createElement("H5");
  heading.innerHTML = "Intervention Information";
  content.appendChild(heading);

  /*var mod = document.createElement("div");
  mod.innerHTML = "<b>Moderator:</b> " + entry["moderator"];
  content.appendChild(mod);

  var status = document.createElement("status");
  status.innerHTML = "<b>Status:</b> " + entry["status"];
  content.appendChild(status);*/

  var accept_date = document.createElement("div");
  accept_date.innerHTML = "<b>Date Accepted:</b> " + formatDate(entry["accept_date"]);
  content.appendChild(accept_date);

  var complete_date = document.createElement("div");
  complete_date.innerHTML = "<b>Date Completed:</b> " + formatDate(entry["complete_date"]);
  content.appendChild(complete_date);

  var br = document.createElement("br");
  content.appendChild(br);
}
