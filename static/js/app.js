// Data - to charge data we used node.js - Typing in Bash: http-server --cors
Promise.all([
    d3.json("http://localhost:8080/data_extraction/measles_vacc_data.json"),
    d3.json("http://localhost:8080/data_extraction/measles_inc_data.json"),
    d3.json("http://localhost:8080/data_extraction/dtp_vacc_data.json"),
    d3.json("http://localhost:8080/data_extraction/diphth_incidence_data.json"),
    d3.json("http://localhost:8080/data_extraction/mortality_data.json")
  ])
  .then(function([measlesVaccination, measlesIncidence, dtpVaccination, dtpIncidence, mortality]) {
    
    console.log("Measles Vaccination:", measlesVaccination);
    console.log("Measles Incidence:", measlesIncidence);
    console.log("DTP Vaccination:", dtpVaccination);
    console.log("DTP Incidence:", dtpIncidence);
    console.log("Mortality:", mortality);
    
  })
  .catch(function(error) {
    console.error("Error to upload JSON files:", error);
  });
  

// Build country panel



// Build year panel



// Function to create vaccination line plot
function buildVaccinationChart(country) {
    // Upload the two vaccination JSON files
    Promise.all([
      d3.json("http://localhost:8080/data_extraction/measles_vacc_data.json"),
      d3.json("http://localhost:8080/data_extraction/dtp_vacc_data.json")
    ])
    .then(([measlesData, dtpData]) => {
          
      // Filter data by country
      let measlesCountryData = measlesData.filter(d => d.COUNTRY === country);
      let dtpCountryData     = dtpData.filter(d => d.COUNTRY === country);
  
      // Create arrays of years and rates
      let yearsMeasles = measlesCountryData.map(d => d.YEAR);
      let ratesMeasles = measlesCountryData.map(d => d.Numeric);
  
      let yearsDtp = dtpCountryData.map(d => d.YEAR);
      let ratesDtp = dtpCountryData.map(d => d.Numeric);
  
      // Define trace for Measles
      let traceMeasles = {
        x: yearsMeasles,
        y: ratesMeasles,
        mode: 'lines+markers',
        name: 'Measles Vaccination'
      };
  
      // Define trace for dtp
      let traceDtp = {
        x: yearsDtp,
        y: ratesDtp,
        mode: 'lines+markers',
        name: 'DTP Vaccination'
      };
  
      // Define layout
      let layout1 = {
        title: `Vaccination Rates in ${country}`,
        xaxis: { title: 'Year' },
        yaxis: { title: 'Vaccination Rate' },
        height: 700,
        width: 1500
      };
  
      // Combine traces
      Plotly.newPlot('line-vaccination', [traceMeasles, traceDtp], layout1);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
  }
  

// Function to create disease incidence line plot
function buildDiseaseChart(country) {
    // Upload the two incidence JSON
    Promise.all([
      d3.json("http://localhost:8080/data_extraction/measles_inc_data.json"),
      d3.json("http://localhost:8080/data_extraction/diphth_incidence_data.json")
    ])
    .then(([measlesData, dtpData]) => {
      
      // Filter data by country
      let measlesIncidenceCountryData = measlesData.filter(d => d.COUNTRY === country);
      let dtpIncidenceCountryData     = dtpData.filter(d => d.COUNTRY === country);
  
      // Create arrays of years and rates
      let yearsIncidenceMeasles = measlesIncidenceCountryData.map(d => d.YEAR);
      let ratesIncidenceMeasles = measlesIncidenceCountryData.map(d => d.Numeric);
  
      let yearsIncidenceDtp = dtpIncidenceCountryData.map(d => d.YEAR);
      let ratesIncidenceDtp = dtpIncidenceCountryData.map(d => d.Numeric);
  
      // Define trace for Measles
      let traceIncidenceMeasles = {
        x: yearsIncidenceMeasles,
        y: ratesIncidenceMeasles,
        mode: 'lines+markers',
        name: 'Measles Disease'
      };
  
      // Define trace for dtp
      let traceIncidenceDtp = {
        x: yearsIncidenceDtp,
        y: ratesIncidenceDtp,
        mode: 'lines+markers',
        name: 'DTP Disease'
      };
  
      // Define layout
      let layout2 = {
        title: `Incidence Rates in ${country}`,
        xaxis: { title: 'Year' },
        yaxis: { title: 'Incidence Rate' },
        height: 700,
        width: 1500
      };
  
      // Combine traces
      Plotly.newPlot('line-incidence', [traceIncidenceMeasles, traceIncidenceDtp], layout2);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
  }

// Function to create mortality line plot
function mortalityChart(country) {
    // Upload Mortality JSON 
    Promise.all(d3.json("http://localhost:8080/data_extraction/mortality_data.json")
    ).then((mortalityData) => {
      
      // Filter data by country
      let mortalityCountryData = mortalityData.filter(d => d.COUNTRY === country);
  
      // Create arrays of years and rates
      let yearsMortality = mortalityCountryData.map(d => d.YEAR);
      let ratesMortality = mortalityCountryData.map(d => d.Numeric);
    
      // Define trace
      let traceMortality = {
        x: yearsMortality,
        y: ratesMortality,
        mode: 'lines+markers',
        name: 'Measles Disease'
      };
  
      // Define layout
      let layout3 = {
        title: `Infant Mortality Rates in ${country}`,
        xaxis: { title: 'Year' },
        yaxis: { title: 'Infant Mortality Rate' },
        height: 700,
        width: 1500
      };
  
      // Plot
      Plotly.newPlot('line-mortality', [traceMortality], layout3);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
  }


// Function to run on page load




// Function for event listener



// Initialize the dashboard
//init();