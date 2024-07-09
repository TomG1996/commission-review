const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/paymentDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const paymentSchema = new mongoose.Schema({
    name: String,
    price: Number,
    type: String,
    date: String,
    status: { type: String, default: 'Nicht bestätigt' }
});

const Payment = mongoose.model('Payment', paymentSchema);

app.post('/payments', async (req, res) => {
    const payment = new Payment(req.body);
    await payment.save();
    res.send(payment);
});

app.get('/payments', async (req, res) => {
    const payments = await Payment.find();
    res.send(payments);
});

app.put('/payments/:id', async (req, res) => {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(payment);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
