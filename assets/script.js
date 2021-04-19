// initialize Leaflet
var map = L.map('mapid').setView([46, 2], 5);

// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// show the scale bar on the lower left corner
L.control.scale().addTo(map);

// Read markers data from data.csv
$.get('assets/data/dev_data_locations.csv', function (csvString) {

    // Use PapaParse to convert string to array of objects
    var data = Papa.parse(csvString, {
        header: true,
        endoding: "fr",
        transform: function (h) {
            return h.replace(',', '.')
        },
        dynamicTyping: true
    }).data;

    console.log(data);
    // For each row in data, create a marker and add it to the map
    // For each row, columns `lat`, `lng`, and `city` are required
    for (var i in data) {
        var row = data[i];

        // If `page` is null, then do not show page number
        if (row.page == null) {
            var marker = L.marker([row.lat, row.lng], {
                opacity: 1
            }).bindPopup('<b>' + row.city + '</b><br>' + row.subject);


        } else {
            var marker = L.marker([row.lat, row.lng], {
                opacity: 1
            }).bindPopup('<b>' + row.city + '</b><br>' + row.subject + '<br>' + row.page);


        };

        marker.addTo(map);
    }

});

//Import txt file as a JS variable
// const fileUrl = 'assets/data/dev_data_text.html' 

// fetch(fileUrl)
//    .then( r => r.text() )
// //    .then( t => console.log(t) )

//Pagination
var current_page = 1;
var records_per_page = 2;

const objJson = require(['assets/data/text.json']);




// var objJson = [
//     { adName: "asd"},
//     { adName: "AdName 2"},
//     { adName: "AdName 3"},
//     { adName: "AdName 4"},
//     { adName: "AdName 5"},
//     { adName: "AdName 6"},
//     { adName: "AdName 7"},
//     { adName: "AdName 8"},
//     { adName: "AdName 9"},
//     { adName: "AdName 10"}
// ]; // Can be obtained from another source, such as your objJson variable

function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}
    
function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        listing_table.innerHTML += objJson[i].adName + "<br>";
    }
    page_span.innerHTML = page;

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages()
{
    return Math.ceil(objJson.length / records_per_page);
}

window.onload = function() {
    changePage(1);
};