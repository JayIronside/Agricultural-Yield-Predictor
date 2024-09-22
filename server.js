import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Configure middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Define the endpoint URL and API key
const url = "http://d284b462-5868-483c-9d00-f29f5e3647ee.eastus2.azurecontainer.io/score";
const apiKey = 'x1KACpvZi6fF6DiqBifRnuo77StC2wEC';

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", (req, res) => {
  const year = req.body.year;
  const country = req.body.country;
  const item = req.body.item;
  const rainfall = req.body.Rainfall;
  const temperature = req.body.Temperature;
  const pesticides = req.body.Pesticides;

  const data = {
    "Inputs": {
      "input1": [
        {
          "Year": year,
          "Country": country,
          "Item": item,
          "Rainfall (mm)": rainfall,
          "Temperature (Celsius)": temperature,
          "Pesticides (tonnes)": pesticides
        }
      ]
    },
    "GlobalParameters": {}
  };

  // Set up the Axios request
  axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  })
  .then(response => {
    const results = response.data.Results.WebServiceOutput0;
    results.forEach((item, index) => {
      const scoredLabels = item['Scored Labels'];
      res.render("index", { result: scoredLabels});
    });
  })
  .catch(error => {
    console.error('Error:', error);
    res.status(500).send('Error during processing');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
