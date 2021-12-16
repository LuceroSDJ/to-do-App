require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ************ CREATE DATABASE INSIDE MONGODB *****************
const password = process.env.DB_PASS
mongoose.connect("mongodb+srv://admin-lucero:" + password + "@cluster0.sejie.mongodb.net/todoListDB", {useNewUrlParser: true});

//************ CREATE A MONGOOSE SCHEMA *****************
const itemsSchema = {
    name: String
};

//************ CREATE A MONGOOSE MODEL BASED ON THE SCHEMA *****************
const Item = mongoose.model("Item", itemsSchema);

// ****** test *********
const item1 = new Item ({
    name: "Buy milk"
});
const item2 = new Item ({
    name: "Buy eggs."
});
const item3 = new Item ({
    name: "Buy puffs."
});

const defaultItems = [item1, item2, item3];


//global variables
const itemsList = [];
const workItems = [];
//const means that as of now, we can push new items but we cannot assign a new array to the variable 


app.get("/", function(req, res) {
    // const day = date.getDate();
// ******************** READ *************************
    Item.find({}, function(err, foundItems) {
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if(err) {
                    console.log(err);
                }else {
                    console.log("Default items added.");
                }       
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle : "Today", newItems: foundItems});
        }
    })
});


//handle post reques to the home route
app.post("/", function(req, res) {
    console.log(req.body);   //taps into the form key:value pairs like so { newItem: 'ssss', list: '11/28/2021,' }
    //use body parser to tap into the request body
    const userInput = req.body.newItem;

    // *************** CREATE NEW DOCUMENT based on our Item model ****************
    const item = new Item({
        name: userInput
    });  
    item.save();  //save item in items collection 
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    const checkedBox = req.body.checkbox;  //returns "on", which is not very helpful.We need the value of the item name that was actually checed
    console.log(checkedBox);
    // **************** DELETE ******************
    Item.findByIdAndRemove(checkedBox, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Item deleted.");
        };
        res.redirect("/");
    });
});




app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work", newItems: workItems});
});


app.listen(3000, function() {
    console.log("Server listening on port 3000");
});