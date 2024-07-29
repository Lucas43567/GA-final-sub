const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Republic_C207',
  database: 'credit_card_tracker'
});

db.connect((err) => {
  if (err) {
    console.log('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.log('Error fetching products:', err);
      res.send('Error fetching products');
      return;
    }
    res.render('index', { products: results });
  });
});

app.get('/addCard', (req, res) => {
  res.render('addCard');
});

app.post('/addCard', (req, res) => {
  const { cardName, name, benefits, image } = req.body;
  const query = 'INSERT INTO products (cardName, name, benefits, image) VALUES (?, ?, ?, ?)';
  db.query(query, [cardName, name, benefits, image], (err, results) => {
    if (err) {
      console.log('Error inserting card:', err);
      res.send('Error inserting card');
      return;
    }
    res.redirect('/');
  });
});

app.get('/editProduct/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE productId = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.log('Error fetching product details:', err);
      res.send('Error fetching product details');
      return;
    }
    res.render('editCard', { card: results[0] });
  });
});

app.post('/editProduct/:id', (req, res) => {
  const productId = req.params.id;
  const { cardName, name, benefits, image } = req.body;
  const query = 'UPDATE products SET cardName = ?, name = ?, benefits = ?, image = ? WHERE productId = ?';
  db.query(query, [cardName, name, benefits, image, productId], (err, results) => {
    if (err) {
      console.log('Error updating card:', err);
      res.send('Error updating card');
      return;
    }
    res.redirect('/');
  });
});

app.get('/product/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE productId = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.log('Error fetching product details:', err);
      res.send('Error fetching product details');
      return;
    }
    res.render('product', { product: results[0] });
  });
});

app.get('/deleteProduct/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE productId = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.log('Error deleting product:', err);
      res.send('Error deleting product');
      return;
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
