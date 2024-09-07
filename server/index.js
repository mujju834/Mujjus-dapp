const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const web3 = new Web3('https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Replace with your Infura project ID

const privateKey = 'YOUR_PRIVATE_KEY'; // Replace with your private key

// MongoDB Order Schema
const orderSchema = new mongoose.Schema({
    userId: String,
    timestamp: Date,
    currencyPair: String,
    amount: Number,
    price: Number,
    orderType: String,
    transactionHash: String,
    status: String,
});

const Order = mongoose.model('Order', orderSchema);

mongoose.connect('mongodb://localhost:27017/cryptoview', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req,res)=>{
    res.send("this is the main")
})
// API endpoint to place order
app.post('/api/trade', async (req, res) => {
    const { userId, currencyPair, amount, price, orderType } = req.body;

    // Validate the order parameters
    if (amount <= 0 || price <= 0) {
        return res.status(400).send('Invalid amount or price');
    }

    // Create the transaction data
    const transactionData = {
        // Fill with transaction data appropriate for your smart contract or method
    };

    try {
        // Sign the transaction
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionData, privateKey);

        // Send the transaction to the blockchain
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        // Save the order to the database
        const order = new Order({
            userId,
            timestamp: new Date(),
            currencyPair,
            amount,
            price,
            orderType,
            transactionHash: receipt.transactionHash,
            status: 'pending', // Initial status
        });

        await order.save();

        res.json({ transactionHash: receipt.transactionHash });
    } catch (error) {
        res.status(500).send('Transaction failed: ' + error.message);
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
