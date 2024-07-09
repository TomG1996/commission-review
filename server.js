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
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    finalPrice: { type: Number, required: true }, // Füge finalPrice zum Schema hinzu
    status: { type: String, default: 'Nicht bestätigt' }
});

const Payment = mongoose.model('Payment', paymentSchema);

app.post('/payments', async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).send(payment);
    } catch (error) {
        res.status(400).send({ message: 'Invalid data', error });
    }
});

app.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.send(payments);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
});

app.put('/payments/:id', async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send(payment);
    } catch (error) {
        res.status(400).send({ message: 'Invalid data', error });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
