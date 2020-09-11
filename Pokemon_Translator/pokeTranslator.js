/* 
Developer's Name - Swapnil Belorkar
Initial Version  
Version Number - 1
Date - 09/09/2020
Description - Getting a Pokemon_Name as an Input from a User, then calling pokemon api with specified pokemon name to fetch its description. Sent Fetched Description to Shakesphere API to translate the data to shakespherean English and Display the translated shakespherean English output.

*/
 
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const qs = require("querystring");

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Launching the Input HTML File
app.get("/", (req, res) => {
  res.sendFile("input.html", { root: __dirname });
});

// Initializing empty object to save final translated data
let finalResponse = [];

//Main function
app.get("/pokemon/:name", (req, res) => {
  // Calling Fetch API consecatively
  const url = "http://pokeapi.co/api/v2/pokemon/" + req.params.name;
  fetch(url)
    .then((res1) => res1.json())
    .then((poke_fetch_data) => {

      const ability_description = [];
      // fetcing abilities description of specified pokemon name
      if (poke_fetch_data.abilities && poke_fetch_data.abilities.length) {
        fetch(poke_fetch_data.abilities[1].ability.url)
          .then((res2) => res2.json())
          .then((description_data) => {
            if (
              description_data.effect_entries &&
              description_data.effect_entries.length
            ) {
              let text = description_data.effect_entries[1].effect;

              text = text.replace(/(\r\n|\n|\r)/gm, " "); //Removes Line breakes from our Pokemon Api extracted data

              text = text.replace(/\s+/g, " "); // Removes extra Spaces from our Extracted Data

              // Calling Shakesphere API with Pokemon Description
              fetch(
                "https://api.funtranslations.com/translate/shakespeare.json" +
                  "?" +
                  qs.stringify({ text }), //Query String
                {
                  method: "POST",
                  body: JSON.stringify(text),
                  headers: { "Content-Type": "application/json" },
                }
              )
                .then((res3) => res3.json())

                .then((dataa) => {
                  console.log(dataa);
                  //return dataa;

                  // Pushing a final version of translated Data
                  finalResponse.push({
                    name: poke_fetch_data.name,
                    description: dataa.contents.translated,
                  });
                  res.send(finalResponse[0]);   // Returning translated Shakespherean Data
                })
            }
          });
      }
    })
    .catch((err) => res.send("Pokemon Not Found"));
});

app.listen(2000);
