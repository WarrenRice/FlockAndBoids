const express = require("express");
const app = express();
//require("dotenv").config();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at ${port}`));

app.use(express.static("publics"));
