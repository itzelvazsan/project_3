// Data
Promise.all([
    d3.json("data_extraction/measles_vacc_data.json"),
    d3.json("data_extraction/measles_inc_data.json"),
    d3.json("data_extraction/dtp_vacc_data.json"),
    d3.json("data_extraction/diphth_incidence_data.json"),
    d3.json("data_extraction/mortality_data.json")
  ])
  .then(function([measlesVaccination, measlesIncidence, dtpVaccination, dtpIncidence, mortality]) {
    // Aquí ya tienes todos los datos disponibles
    console.log("Measles Vaccination:", measlesVaccination);
    console.log("Measles Incidence:", measlesIncidence);
    console.log("DTP Vaccination:", dtpVaccination);
    console.log("DTP Incidence:", dtpIncidence);
    console.log("Mortality:", mortality);
    // Continúa con la construcción de tus gráficos
  })
  .catch(function(error) {
    console.error("Error al cargar los archivos JSON:", error);
  });
  

// Build country panel





// Build year panel





// Function to create vaccination line plot





// Function to create disease incidence line plot




// Function to create mortality line plot



// Function to run on page load


// Function for event listener



// Initialize the dashboard
//nit();