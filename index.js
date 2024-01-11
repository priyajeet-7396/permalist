import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "*****",
  port:5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
  
async function getItem() {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  const items = [];
  result.rows.forEach((item) => {
    items.push(item);
  });
  return items;
}


app.get("/", async (req, res) => {
  const items = await  getItem();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});



app.post("/add", (req, res) => {
  const item = req.body.newItem;
  console.log(item);
  db.query("INSERT INTO items (title)  VALUES ($1)", [item]);
  res.redirect("/");
});



app.post("/edit", async (req, res) => {
  const title  = req.body.updatedItemTitle 
  const  id  = req.body.updatedItemId
  await db.query("UPDATE items SET title  = ($1) WHERE id = ($2)", [title, id]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId
  await db.query("DELETE FROM  items WHERE id = $1", [id]);
  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
