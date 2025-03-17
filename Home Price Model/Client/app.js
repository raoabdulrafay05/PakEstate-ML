function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1;
}

function getBedrooms() {
    var uiBedrooms = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBedrooms.length; i++) {
        if (uiBedrooms[i].checked) {
            return parseInt(uiBedrooms[i].value);
        }
    }
    return -1;
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var city = document.getElementById("uiCity").value;
    var propertyType = document.getElementById("uiType").value;
    var location = document.getElementById("uiLocations").value;
    var area = document.getElementById("uiSqft").value;  // "area" represents the square footage
    var bhk = getBedrooms();      // "bhk" represents the number of bedrooms
    var bathrooms = getBathValue();

    if (!city || !propertyType || !location || area <= 0 || bhk == -1 || bathrooms == -1) {
        alert("Please fill all fields correctly.");
        return;
    }

    // Changed endpoint to use relative URL
    var url = "/api/predict_home_prices";

    $.post(url, {
        city: city,
        type: propertyType,       // Flask expects the key 'type'
        location: location,
        area: parseFloat(area),   // Flask expects the key 'area'
        bedroom: bhk,             // Flask expects the key 'bedroom'
        bath: bathrooms           // Flask expects the key 'bath'
    }, function(data, status) {
        console.log("Received response for price estimate:", data);
        if (data.estimated_price) {
            document.getElementById("uiEstimatedPrice").innerHTML = "Estimated Price: RS " + data.estimated_price.toLocaleString();
        } else {
            document.getElementById("uiEstimatedPrice").innerHTML = "Could not estimate price.";
        }
    }).fail(function() {
        console.log("Error fetching price estimate");
    });
}

function loadCities() {
    console.log("Loading cities...");
    // Changed endpoint to use relative URL
    var url = "/api/get_city_names";

    $.get(url, function(data, status) {
        console.log("Received response for city names:", data);
        
        if (data && data.city_names) {
            var cities = data.city_names;
            var uiCity = document.getElementById("uiCity");
            uiCity.innerHTML = ""; // Clear previous entries

            var defaultOption = document.createElement("option");
            defaultOption.text = "Choose a City";
            defaultOption.value = "";
            defaultOption.selected = true;
            defaultOption.disabled = true;
            uiCity.appendChild(defaultOption);

            for (var i = 0; i < cities.length; i++) {
                var opt = document.createElement("option");
                opt.text = cities[i];
                opt.value = cities[i];
                uiCity.appendChild(opt);
            }
        }
    }).fail(function() {
        console.log("Error fetching cities");
    });
}

function loadPropertyTypes() {
    console.log("Loading property types...");
    // Changed endpoint to use relative URL
    var url = "/api/get_types";

    $.get(url, function(data, status) {
        console.log("Received response for property types:", data);

        if (data && data.types) {
            var types = data.types;
            var uiType = document.getElementById("uiType");
            uiType.innerHTML = "";

            var defaultOption = document.createElement("option");
            defaultOption.text = "Choose a Type";
            defaultOption.value = "";
            defaultOption.selected = true;
            defaultOption.disabled = true;
            uiType.appendChild(defaultOption);

            for (var i = 0; i < types.length; i++) {
                var opt = document.createElement("option");
                opt.text = types[i];
                opt.value = types[i];
                uiType.appendChild(opt);
            }
        }
    }).fail(function() {
        console.log("Error fetching property types");
    });
}

function updateLocations() {
    console.log("Updating locations...");

    var city = document.getElementById("uiCity").value;
    var propertyType = document.getElementById("uiType").value;

    if (!city || !propertyType) {
        console.log("City or Property Type not selected yet.");
        return;
    }

    // Changed endpoint to use relative URL
    var url = `/api/get_location_names?city=${encodeURIComponent(city)}&type=${encodeURIComponent(propertyType)}`;

    $.get(url, function(data, status) {
        console.log("Received response for locations:", data);

        let locations = data.locations;
        if (typeof locations === "string") {
            try {
                locations = JSON.parse(locations);
            } catch (e) {
                console.error("Could not parse locations JSON:", e);
                locations = []; // fallback
            }
        }

        var uiLocations = document.getElementById("uiLocations");
        uiLocations.innerHTML = ""; // Clear previous entries

        var defaultOption = document.createElement("option");
        defaultOption.text = "Choose a Location";
        defaultOption.value = "";
        defaultOption.selected = true;
        defaultOption.disabled = true;
        uiLocations.appendChild(defaultOption);

        for (var i = 0; i < locations.length; i++) {
            let loc = locations[i];
            if (Array.isArray(loc)) {
                loc = loc.join("");
            }
            let opt = document.createElement("option");
            opt.text = loc;
            opt.value = loc;
            uiLocations.appendChild(opt);
        }
    }).fail(function() {
        console.log("Error fetching locations");
    });
}

function onPageLoad() {
    console.log("Document loaded");
    loadCities();
    loadPropertyTypes();
}

window.onload = onPageLoad;