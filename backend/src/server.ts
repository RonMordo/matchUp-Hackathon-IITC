import express from "express";

const app = express();

app.listen(3001, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log("Server listening on PORT:", 3001);
  }
});
