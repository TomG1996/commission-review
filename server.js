const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const dbUri = 'mongodb+srv://TomG:<IchundDu-1996>@review.zqyofix.mongodb.net/?retryWrites=true&w=majority&appName=Review'; // Ersetze durch deinen Verbindungs-String

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const paymentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    finalPrice: { type: Number, required: true },
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

app.delete('/payments/:id', async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: 'Invalid data', error });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
