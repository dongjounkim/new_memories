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
        encoding: "fr",
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

    // // console.log(data);
    // For each row in data, create a marker and add it to the map
    // For each row, columns `lat`, `lng`, and `city` are required
    var markers = {};
    //Step 1 : list all locations to avoid duplicates
    // console.log(data);
    for (var i in data) {
        var row = data[i];
        var lat_long = row.lat + ";" + row.lng;
        var truePage = row.page - 15;
        // row.key = key;
        row.truePage = truePage;
        // si le marqueur existe deja, 
        if (lat_long in markers) {
            //Ajoute la mention du lieu dans ce marqueur
            markers[lat_long].push(row); 
            // console.log("marker deja vu");
            // for (var i in markers[lat_long]) {
            //     // console.log(markers[lat_long][i].city);
            //     var marker = L.marker([markers[lat_long][i].lat, markers[lat_long][i].lng], {
            //         opacity: 1
            //     }).setPopupContent(markers[lat_long][i].subject + '<br>' + markers[lat_long][i].page);
            // };
        } else {
            //Creer un nv marquer pour cette mention de lieu
            markers[lat_long]=[row];
        }
    }
        
        // console.log(markers);
        //Step 2 : creake markers and create popup
        let popup_info = {"Charlotte":[],"Philippe":[]};
        console.log( popup_info);

        for (marker_infos in markers) {
            //prepare popup for this marker
            for (var i in markers[marker_infos]) {
                if (markers[marker_infos][i].subject == "Philippe") {
                    popup_info["Philippe"].push(markers[marker_infos][i]['page']);
                } else if (markers[marker_infos][i].subject == "Charlotte") {
                    popup_info["Charlotte"].push(markers[marker_infos][i]['page']);
                }
                
            };
            var marker = L.marker([markers[marker_infos][i].lat, markers[marker_infos][i].lng], {
                opacity: 1
            }).bindPopup('<b>' + markers[marker_infos][i].city + '</b><br>Philippe :<br>' + `<a href="${popup_info['Philippe'][i]}">${popup_info['Philippe']}</a>` + '</b><br>Charlotte :<br>' + `<a href="#">${popup_info['Charlotte']}</a>`);
            console.log(`${popup_info['Philippe'][i]}`);
            marker.addTo(map);
            i++;
        };

        // for(var key in row) {
        //     // console.log(row[key]);
        // }
        // var marqueurs = {"0.4-48.3":[{"city":"Navarre", "subject":"Philippe", "page":25}], "0.3-48.5":[{"city":"Escouy", "subject":"Philippe", "page":30},{"city":"Escouy", "subject":"Charlotte", "page":31}]};
        // for(mark in markers){
            
        // }

        // If `page` is null, then do not show page number
        // if (row.page == null) {
        //     var marker = L.marker([row.lat, row.lng], {
        //         opacity: 1
        //     }).bindPopup('<b>' + row.city + '</b><br>' + row.subject);


        // } else {
        //     var marker = L.marker([row.lat, row.lng], {
        //         opacity: 1
        //     }).bindPopup('<b>' + row.city + '</b><br>' + row.subject + '<br>' + row.page);
        // };


    




});

//Pagination
//Get HTML file locally
$.get('assets/data/dev_data_text.html', function (textData) {
    // Global variables
    
    newData = textData.split('</page>');
    // console.log(newData);

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
    var max_page = newData.length / 2;

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page - 1) * records_per_page; i < (page * records_per_page); i++) {
        listing_table.innerHTML += newData[i] + "<br>";
    }
    
    //Adds the following string in span id="page" and changes page from input value 
    page_span.innerHTML = `<input type="number" class="book__page__menu__text" onChange="changePage(this.value); current_page = this.value; changePageID();" id="page" placeholder="Page: ${page}" name="pagenum" min="1" max="${max_page}">`;

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

    changePageID();
}

function numPages() {
    return Math.ceil(newData.length / records_per_page);
}

//Adds page number as ID in the URL
function changePageID() {
    history.pushState({page: current_page}, ``, `?page=${current_page}`);
    console.log("change Id")
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