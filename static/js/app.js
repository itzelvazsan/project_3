// Upload 4 JSON - we used node.js - Typing in Bash: http-server --cors
let datasets = [];

// Cargar 4 JSON y almacenarlos en datasets globales
Promise.all([
  d3.json("http://localhost:8080/data_extraction/measles_vacc_data.json"),
  d3.json("http://localhost:8080/data_extraction/measles_inc_data.json"),
  d3.json("http://localhost:8080/data_extraction/dtp_vacc_data.json"),
  d3.json("http://localhost:8080/data_extraction/diphth_incidence_data.json"),
  d3.json("http://localhost:8080/data_extraction/mortality_data.json")
])
.then(function([measlesVaccination, measlesIncidence, dtpVaccination, dtpIncidence, mortality]) {

  // Create an array for the datasets
  datasets = [
    {name: "measlesVaccination", data: measlesVaccination},
    {name: "measlesIncidence", data: measlesIncidence},
    {name: "dtpVaccination", data: dtpVaccination},
    {name: "dtpIncidence", data: dtpIncidence},
    {name: "mortality", data: mortality}
  ];

  console.log("Datasets:", datasets);

  // Upload the GeoJSON
  d3.json("http://localhost:8080/data_geojson/countries.geojson")
    .then(geoData => {
      geoData.features.forEach(feature => {
        const countryCode = feature.properties.ISO_A3;
        feature.properties.data = {};
        for (let i = 0; i < datasets.length; i++) {
          const match = datasets[i].data.find(d => d.COUNTRY === countryCode);
          feature.properties.data[datasets[i].name] = match ? match.Numeric : 0;
        }
      });
      console.log("Merged GeoData:", geoData);


      // Map with Leaflet
// Create the map with Leaflet
// Your existing map setup
var map = L.map('map').setView([37.8, -96], 4); // Centered on the US

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Markers for countries
var countryMarkers = [
  { lat: 37.0902, lon: -95.7129, name: "USA", vaccinationRate: "85%" }, // United States
  { lat: 56.1304, lon: -106.3468, name: "CAN", vaccinationRate: "80%" }, // Canada
  { lat: 13.4460, lon: -83.9537, name: "HND", vaccinationRate: "70%" }, // Honduras
  { lat: 17.1896, lon: -88.4976, name: "BLZ", vaccinationRate: "85%" }, // Belize
  { lat: 3.1966, lon: -60.4186, name: "GUY", vaccinationRate: "85%" }, // Guyana
  { lat: -38.4161, lon: -63.6167, name: "ARG", vaccinationRate: "75%" }, // Argentina
  { lat: -33.8688, lon: -70.6483, name: "CHL", vaccinationRate: "80%" }, // Chile
  { lat: -15.7801, lon: -47.9292, name: "BRA", vaccinationRate: "78%" }, // Brazil
  { lat: 23.6345, lon: -102.5528, name: "MEX", vaccinationRate: "90%" }, // Mexico
  { lat: -9.19, lon: -75.0152, name: "PER", vaccinationRate: "80%" }, // Peru
  { lat: 4.5709, lon: -74.2973, name: "COL", vaccinationRate: "82%" }, // Colombia
  { lat: -12.0464, lon: -77.0428, name: "PER", vaccinationRate: "80%" }, // Peru
  { lat: 10.1616, lon: -83.5719, name: "CRI", vaccinationRate: "85%" }, // Costa Rica
  { lat: 1.2835, lon: -82.7735, name: "ECU", vaccinationRate: "80%" }, // Ecuador
  { lat: 12.8797, lon: -85.9050, name: "NIC", vaccinationRate: "75%" }, // Nicaragua
  { lat: 15.1992, lon: -86.2419, name: "SLV", vaccinationRate: "78%" }, // El Salvador
  { lat: 13.4443, lon: -58.7172, name: "GRD", vaccinationRate: "85%" }, // Grenada
  { lat: -16.2902, lon: -63.5887, name: "BOL", vaccinationRate: "70%" }, // Bolivia
  { lat: 12.8654, lon: -85.2072, name: "NIC", vaccinationRate: "78%" }, // Nicaragua
  { lat: 7.5980, lon: -80.0240, name: "PAN", vaccinationRate: "88%" }, // Panama
  { lat: -32.5228, lon: -55.7651, name: "URY", vaccinationRate: "83%" }, // Uruguay
  { lat: 13.7942, lon: -60.9789, name: "VCT", vaccinationRate: "90%" }, // Saint Vincent and the Grenadines
  { lat: 9.7489, lon: -83.7534, name: "CRC", vaccinationRate: "85%" }, // Costa Rica
  { lat: 19.3131, lon: -81.2546, name: "CUB", vaccinationRate: "80%" }, // Cuba
  { lat: 1.3521, lon: -75.5196, name: "GTM", vaccinationRate: "75%" }, // Guatemala
  { lat: -19.2576, lon: -63.7822, name: "BOL", vaccinationRate: "70%" }, // Bolivia
  { lat: 6.6111, lon: -58.4981, name: "SUR", vaccinationRate: "70%" }, // Suriname
  { lat: -1.8312, lon: -78.1835, name: "ECU", vaccinationRate: "75%" }, // Ecuador
  { lat: -12.0432, lon: -77.0282, name: "PER", vaccinationRate: "77%" }, // Peru
  { lat: 5.4254, lon: -54.7065, name: "GUY", vaccinationRate: "90%" }, // Guyana
  { lat: 6.9147, lon: -74.0770, name: "COL", vaccinationRate: "80%" }, // Colombia
];

// Loop through the country data to create markers
countryMarkers.forEach(function(data) {
  var marker = L.marker([data.lat, data.lon]).addTo(map);
  marker.bindPopup("<b>" + data.name + "</b><br>Vaccination Rate: " + data.vaccinationRate);
});



// Load GeoJSON data and display it on the map
d3.json("http://localhost:8080/data_geojson/countries.geojson").then(geoData => {
    L.geoJSON(geoData, {
        style: function(feature) {
            let measlesVacRate = feature.properties.data ? feature.properties.data.measlesVaccination : 0;
            return {
                fillColor: getColor(measlesVacRate),
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        },
        onEachFeature: function(feature, layer) {
            let props = feature.properties;
            let popupContent = `<b>${props.ADMIN}</b><br>
                Measles Vaccination: ${props.data.measlesVaccination || 'N/A'}<br>
                Measles Incidence: ${props.data.measlesIncidence || 'N/A'}<br>
                DTP Vaccination: ${props.data.dtpVaccination || 'N/A'}<br>
                DTP Incidence: ${props.data.dtpIncidence || 'N/A'}<br>
                Mortality: ${props.data.mortality || 'N/A'}`;
            layer.bindPopup(popupContent);
        }
    }).addTo(map);
});

// Function to determine the color based on the vaccination rate
function getColor(value) {
    return value > 90 ? 'dark green' :
           value > 75 ? 'medium green' :
           value > 50 ? 'light green' :
           value > 25 ? 'pale green' :
                        'light yellow';
}


    })
    .catch(error => {
      console.error("Error with GeoJSON:", error);
    });

})
.catch(function(error) {
  console.error("Error with JSON:", error);
});


// Function to create vaccination line plot
function buildVaccinationChart(country) {
  // Search vaccination datasets in datasets array
  const measlesDataset = datasets.find(ds => ds.name === "measlesVaccination");
  const dtpDataset     = datasets.find(ds => ds.name === "dtpVaccination");
   
  // Filter data by country
  let measlesCountryData = measlesDataset.data.filter(d => d.COUNTRY === country);
  let dtpCountryData     = dtpDataset.data.filter(d => d.COUNTRY === country);
  
  // Years and rates data
  let yearsMeasles = measlesCountryData.map(d => d.YEAR);
  let ratesMeasles = measlesCountryData.map(d => d.Numeric);
  
  let yearsDtp = dtpCountryData.map(d => d.YEAR);
  let ratesDtp = dtpCountryData.map(d => d.Numeric);
  
  // Traces for Plotly
  let traceMeaslesVac = {
    x: yearsMeasles,
    y: ratesMeasles,
    mode: 'lines+markers',
    name: 'Measles Vaccination'
  };
  
  let traceDtpVac = {
    x: yearsDtp,
    y: ratesDtp,
    mode: 'lines+markers',
    name: 'DTP Vaccination'
  };
  
  // Layout
  let layoutVac = {
    title: `Vaccination Rates in ${country}`,
    xaxis: { title: 'Year' },
    yaxis: { title: 'Vaccination Rate' },
    height: 600,
    width: 650
  };
  
  //Plot "line-vaccination"
  Plotly.newPlot('line-vaccination', [traceMeaslesVac, traceDtpVac], layoutVac);
}


// Function to create incidence line plot
function buildDiseaseChart(country) {
  const measlesRatesDataset = datasets.find(ds => ds.name === "measlesIncidence");
  const dtpRatesDataset     = datasets.find(ds => ds.name === "dtpIncidence");
  
  let measlesRatesCountryData = measlesRatesDataset.data.filter(d => d.COUNTRY === country);
  let dtpRatesCountryData     = dtpRatesDataset.data.filter(d => d.COUNTRY === country);
  
  let yearsMeaslesIncidence = measlesRatesCountryData.map(d => d.YEAR);
  let ratesMeaslesIncidence = measlesRatesCountryData.map(d => d.Numeric);
  
  let yearsDtpIncidence = dtpRatesCountryData.map(d => d.YEAR);
  let ratesDtpIncidence = dtpRatesCountryData.map(d => d.Numeric);
  
  // Traces
  let traceMeaslesIncidence = {
    x: yearsMeaslesIncidence,
    y: ratesMeaslesIncidence,
    mode: 'lines+markers',
    name: 'Measles Incidence'
  };
  
  let traceDtpIncidence = {
    x: yearsDtpIncidence,
    y: ratesDtpIncidence,
    mode: 'lines+markers',
    name: 'DTP Incidence'
  };
  
  // Layout
  let layoutIncidence = {
    title: `Incidence Rates in ${country}`,
    xaxis: { title: 'Year' },
    yaxis: { title: 'Incidence Rate' },
    height: 600,
    width: 650
  };
  
  Plotly.newPlot('line-incidence', [traceMeaslesIncidence, traceDtpIncidence], layoutIncidence);
}


// Function to create mortality line plot  
function mortalityChart(country) {
  const mortalityDataset = datasets.find(ds => ds.name === "mortality");
  
  let mortalityCountryData = mortalityDataset.data.filter(d => d.COUNTRY === country);
  
  let yearsMortality = mortalityCountryData.map(d => d.YEAR);
  let ratesMortality = mortalityCountryData.map(d => d.Numeric);
  
  // Trace
  let traceMortality = {
    x: yearsMortality,
    y: ratesMortality,
    mode: 'lines+markers',
    name: 'Mortality Rates'
  };
  // Layout
  let layoutMortality = {
    title: `Infant Mortality Rates in ${country}`,
    xaxis: { title: 'Year' },
    yaxis: { title: 'Infant Mortality Rate' },
    height: 600,
    width: 1300
  };
  
  // Plot
  Plotly.newPlot('line-mortality', [traceMortality], layoutMortality);
}


// Build panel data
function buildPanelData(country, year) {
  const measlesDataset = datasets.find(ds => ds.name === "measlesVaccination").data;
  const dtpDataset = datasets.find(ds => ds.name === "dtpVaccination").data;
  const measlesRatesDataset = datasets.find(ds => ds.name === "measlesIncidence").data;
  const dtpRatesDataset = datasets.find(ds => ds.name === "dtpIncidence").data;
  const mortality = datasets.find(ds => ds.name === "mortality").data;
  
  // Filter the data by country
  let countryMeaslesVac =  measlesDataset.filter(obj => obj.COUNTRY == country);
  let countryDtpVac =  dtpDataset.filter(obj => obj.COUNTRY == country);
  let countryMeaslesInc =  measlesRatesDataset.filter(obj => obj.COUNTRY == country);
  let countryDtpInc =  dtpRatesDataset.filter(obj => obj.COUNTRY == country);
  let countryMortality =  mortality.filter(obj => obj.COUNTRY == country);

  // Filter the data by year
  let yearMeaslesVac =  countryMeaslesVac.filter(obj => +obj.YEAR == +year);
  let yearDtpVac =  countryDtpVac.filter(obj => +obj.YEAR == +year);
  let yearMeaslesInc =  countryMeaslesInc.filter(obj => +obj.YEAR == +year);
  let yearDtpInc =  countryDtpInc.filter(obj => +obj.YEAR == +year);
  let yearMortality =  countryMortality.filter(obj => +obj.YEAR == +year);


  // Get numeric field
  let measlesVacRates = yearMeaslesVac.map(d => d.Numeric);;
  let dtpVacRates = yearDtpVac.map(d => d.Numeric);
  let measlesIncRates = yearMeaslesInc.map(d => d.Numeric);
  let dtpIncRates = yearDtpInc.map(d => d.Numeric);
  let mortalityRates = yearMortality.map(d => d.Numeric);

  // Create an array for the data
  let panelData = {
    "Measles Vaccination": measlesVacRates,
    "DTP Vaccination": dtpVacRates,
    "Measles Incidence": measlesIncRates,
    "DTP Incidence": dtpIncRates,
    "Mortality": mortalityRates
  };
  // Use d3 to select the panel with id of `#disease-data`
  let panel = d3.select("#disease-data")

  // Use `.html("") to clear any existing data
  panel.html("");

  Object.entries(panelData).forEach(([key, value]) => {
    panel.append("p").text(`${key}: ${JSON.stringify(value)}`);
  });
}


// Function to run dashboard
function init() {
  
  d3.json("http://localhost:8080/data_extraction/measles_inc_data.json")
    .then(data => {
      
      let countries = Array.from(new Set(data.map(d => d.COUNTRY)));
      // Use d3 to select the dropdown with id of `#selCountry`
      let dropdownCountry = d3.select("#selCountry");

      // Use the list of country names to populate the select options
      countries.forEach(country => {
        dropdownCountry.append("option")
          .text(country)
          .property("value", country);
      });
      
      // Get the first country from the lists
      let firstCountry = countries[0];
      
      // Get years data
      let years = Array.from(new Set(data.map(d => d.YEAR)));
      // Use d3 to select the dropdown with id of `#selCountry`
      let dropdownYear = d3.select("#selYear");

      // Use the list of country names to populate the select options
      years.forEach(year => {
        dropdownYear.append("option")
          .text(year)
          .property("value", year);
      });
      
      // Get the first country from the lists
      let firstYear = years[0];


      // Call functions with first selections
      buildVaccinationChart(firstCountry);
      buildDiseaseChart(firstCountry);
      mortalityChart(firstCountry);
      buildPanelData(firstCountry, firstYear);
      
      // Set currentCountry to the first country so that later changes work correctly
      currentCountry = firstCountry;
    })
    .catch(error => console.error("Error in dashboard:", error));
}


// Function for event listener
let currentCountry = null;

function optionChanged(newCountry, newYear) {
  // Update data panel
  buildPanelData(newCountry, newYear);
  
  // Update plots only if country changes
  if (newCountry !== currentCountry) {
    buildVaccinationChart(newCountry);
    buildDiseaseChart(newCountry);
    mortalityChart(newCountry);
    currentCountry = newCountry; 
  }

}


// Initialize the dashboard
init();
