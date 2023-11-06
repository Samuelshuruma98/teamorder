const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to your MongoDB Atlas database
const mongoURI = 'mongodb+srv://SamueShuruma:sam1998sam@cluster0.nv2gn3g.mongodb.net/teamorder?retryWrites=true&w=majority'; // Replace with your MongoDB Atlas URI
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas: ' + err);
  });

// Define an "Order" schema and model
const orderSchema = new mongoose.Schema({
  confirmed: Boolean,
  packed: Boolean,
  onTheWay: Boolean,
  delivered: Boolean,
});

const Order = mongoose.model('Order', orderSchema);

app.use(bodyParser.json());

// Serve your HTML and static files
app.use(express.static('public'));

// Define routes for updating order status
app.post('/', async (req, res) => {
  const { confirmed, packed, onTheWay, delivered } = req.body;

  try {
    const order = new Order({ confirmed, packed, onTheWay, delivered });
    await order.save();
    res.status(200).json({ message: 'Order status updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status.' });
  }
});

// Setting up the route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Setting up a route to save orders to the database
app.post('/order', async (req, res) => {
  const { confirmedcheckbox, packedCheckbox, Onthewaycheckbox, deliveredcheckbox } = req.body;

  try {
    
      const order = new Order({
        confirmed: confirmedcheckbox === 'on', // Convert 'on' to true, otherwise false
        packed: packedCheckbox === 'on',       // Convert 'on' to true, otherwise false
        onTheWay: Onthewaycheckbox === 'on',   // Convert 'on' to true, otherwise false
        delivered: deliveredcheckbox === 'on', // Convert 'on' to true, otherwise false
      });

    await order.save();
    console.log('Order is received and saved.');

    // Send a success message to the browser
    res.status(200).send('Order received successfully.');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error while saving order.');
  }
});

// Setting up a route to retrieve order data
app.get('/order', async (req, res) => {
  try {
    const orders = await Order.find().exec();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving order data.' });
  }
});

// Setting the application to listen on a specific port
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
