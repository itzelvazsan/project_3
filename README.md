# Fearing the Needle: a visual analysis of North and South America measles vaccination rates and mortality from 2008 to 2022
## Project 3

This repository is part of the Data Analysis and Visualization Bootcamp at Tecnológico de Monterrey. In this project, we chose the Data Visualization track.

## Authors:

- Guillermo K. Pons
- Itzel Vázquez Sánchez
- Miguel Rodríguez

## Overview of the Project and Purpose

Vaccine skepticism has risen since the SARS-CoV-2 pandemic, putting at risk a significant portion of the population with pre-existing conditions or comorbidities that prevent them from getting vaccinated. We conducted a visual analysis of vaccination rates and mortality/incidence rates for measles, diphtheria, tetanus, and pertussis (DTP) from 2008 to 2022. On one hand, measles is a highly preventable and contagious infectious disease that was, until recently, controlled through government programs across North and South America. On the other hand, the DTP vaccine prevents the development of diphtheria, tetanus, and pertussis, which are highly contagious diseases with a death rate of up to 26% for children under 5 years old and adults over 40.

We selected this time period to address the recent rise in vaccine skepticism during two pandemic periods: the 2009 H1N1 Swine Flu pandemic and the 2020 SARS-CoV-2 pandemic. By analyzing vaccination, incidence, and mortality rates, we aim to observe both small- and large-scale effects of this recent trend and the lack of healthcare access during critical years of each pandemic. Our analysis will also help determine if the increase in measles, diphtheria, tetanus, and pertussis cases is isolated to North America or affects South American countries as well.

## How to Use and Interact with the Repo

| Item  |   File Type |         File Name  |           Description                                                    |
| ----- | ----------  | ------------------ | ------------------------------------------------------------------------ |
|   1   | folder      |  data_extraction   | JSON extraction code, JSON files and CSV files with raw and cleaned data |
|   2   | folder      |   data_geojson     | GeoJSON with polygons to merge with health data json                     |
|   3   |   folder    |   static           | Contains js and css folders, with app.js and style.css files             |
|   4   |   html      |          index     | Contains dashboard structure                                             |

To open the HTML in your browser, please follow these steps:

- Download Node.js to read JSON data from local files.
- Open your directory in Git Bash and run: `http-server --cors`
- Verify that your local host is running on port 8080.
- Open Visual Studio Code, open the folder, and view the HTML file in your browser

## Data Sources

We use the following datasets:

- WHO Immunization Data Portal:
  * Measles incidence
  * Measles vaccination coverage
  * DTP incidence
  * DTP vaccination coverage
- WHO Mortality Database

API: [WHO Athena](https://www.who.int/data/gho/info/athena-api)

## Ethical Considerations

It is well-known that studies involving health data usually require individual consent unless it can be demonstrated that obtaining consent is impractical. Since this project used data from Athena, an API from the World Health Organization, consent was not necessary. The vaccination, incidence, and mortality data is typically reported through administrative records and anonymized for statistical purposes.

## Credits

The code of this project origins from the solved exercises in the Program, [CSS: Styling the content](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Styling_the_content), [CSS Introduction](https://www.w3schools.com/css/css_intro.asp) and Microsoft Copilot.
