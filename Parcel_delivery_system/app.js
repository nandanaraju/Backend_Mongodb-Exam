const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Parceldetails = require('./Models/Parceldetails.js');


app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const dotenv = require('dotenv');
app.use(express.json());
dotenv.config();

const uri = process.env.mongodb_uri;
mongoose.connect(uri);

const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log("Database Connected");
});

app.get('/api/parcels', async (req, res) => {
    try {
        const parcels = await Parceldetails.find();
        res.json(parcels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/parcels/:delivery_date', async (req, res) => {
    try {
        const delivery_date = new Date(req.query.date);
        const parcels = await Parceldetails.find({ delivery_date });
        res.json(parcels);
        console.log("Parcel Fetched Successfully")
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/parcels', async (req, res) => {
    try {
        const data = req.body;
        const result = await Parceldetails.create(data);
        console.log(result);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});

app.put('/api/parcels/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const updatedParcel = await Parceldetails.findOneAndUpdate({ parcelId: id }, updatedData, options);

        if (updatedParcel) {
            res.status(200).json(updatedParcel);
        } else {
            res.status(404).json({ message: 'Parcel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/parcels/:id', async (req, res) => { 
    try {
        const id = req.params.id;
        const deletedDetails = await Parceldetails.findOneAndDelete({ parcelId: id });

        if (deletedDetails) {
            res.status(200).json({ message: 'Parcel Details deleted successfully' });
        } else {
            res.status(404).json({ message: 'Parcel Details not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
