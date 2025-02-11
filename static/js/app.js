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
    height: 700,
    width: 1500
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
    height: 700,
    width: 1500
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
    height: 700,
    width: 1500
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
