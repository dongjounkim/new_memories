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

    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }

    // console.log(data);
    // For each row in data, create a marker and add it to the map
    // For each row, columns `lat`, `lng`, and `city` are required
    for (var i in data) {
        var row = data[i];
        var key = row.lat + row.lng;
        var truePage = row.page - 15;
        row.key = key;
        row.truePage = truePage;

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

//Pagination
//Get HTML file locally
$.get('assets/data/dev_data_text.html', function (textData) {
    // Global variables
    newData = textData.split('</page>');
    console.log(newData);

    current_page = 1;
    records_per_page = 2;
});

function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page) {
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("listingTable");
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page); i++) {
        listing_table.innerHTML += newData[i] + "<br>";
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

function numPages() {
    return Math.ceil(newData.length / records_per_page);
}

window.onload = function () {
    changePage(1);
};


// Changes page when left and right arrow keys are pressed down
document.onkeydown = function () {
    switch (window.event.keyCode) {
        case 37:
            prevPage()
            break;
        case 39:
            nextPage();
            break;
    }
};