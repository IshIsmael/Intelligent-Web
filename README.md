# Plant Sighting Application

## Overview
This is a Node.js application for uploading plant sightings. It allows users to post a plant sighting, view details about various plants, and participate in discussions on the individual plant sightings. The application utilizes MongoDB and IndexedDB and EJS as the templating engine.

## Features
- Upload plant sightings with details and images
- View individual plant information
- Sort by newest, oldest, alphabetical order. 3 Closest plants displayed in Homepage
- Edit plant sighting details
- Create new plants offline
- Offline viewing and messaging on previously viewed plants, and newely created plants
- Participate in an indivdual plant info page with chat to discuss the plant and provide name suggestions
- Fetch plant data from DBpedia

## Installation

Install dependencies using -

npm install

Create your mongoDB connection on mongo -

mongodb://localhost:27017/plantSightings

Then run normally or with nodemon

## File and Directory Structure

Notable files and directories include:
- app.js: Main application file where middleware and routes are set up.
- package.json: Contains project metadata and dependencies.
- routes/index.js: Defines the routes for the application.
- models/plantSighting.js: Mongoose schema for plant sightings.
- views/: Contains EJS for rendering the web pages.
- databases/: Establishes db connection with mongo
- controllers/plantSighting.js: Handles the logic for plant sightings.
- public/: Static assets such as CSS, JavaScript, images and service woker.

  
The server can then be run from the bin/www file
Whilst offline:
- To load a plant info page offline the user must "save" the plant by viewing it online.

- A new offline post will not have interactivity with server (2 way server interactive chat) until back online

- When going to the create Post offline page, the option of the DBpedia should not appear, if it does, refresh page and it will disappear.


Git Repository:
https://github.com/IshIsmael/Intelligent-Web

![image](https://github.com/IshIsmael/Intelligent-Web/assets/52096455/ec8284cd-aff2-429e-a7ee-3887767f0de8)
