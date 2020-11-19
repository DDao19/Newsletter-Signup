const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();
const port = 3000

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
});


mailchimp.setConfig({
  apiKey: "8685b4ef8d170e6fe251ade448af55b1-us7",
  server: "us7"
});

app.post("/", (req, res) => {
  const firstName = req.body.fName
  const lastName = req.body.lName
  const userEmail = req.body.email

  const listID = "97e1eeda6a"

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: userEmail
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listID, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    res.sendFile(__dirname + "/success.html")
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}`)
  };
  run().catch(e => res.sendFile(__dirname + "/failure.html"))
  
});

app.post("/failure", (req, res) => {
  res.redirect("/")
})




app.listen(process.env.PORT || port, () => {
  console.log(`Server is listening on port ${process.env.PORT || port}`)
})

// API KEY
// 8685b4ef8d170e6fe251ade448af55b1-us7

// List ID
// 97e1eeda6a