import React, { useState } from 'react';
import axios from 'axios';

const TradeForm = () => {
    const [currencyPair, setCurrencyPair] = useState('ETH/USDT');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [orderType, setOrderType] = useState('market');
    const [transactionHash, setTransactionHash] = useState('');

    const placeOrder = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/trade', {
                userId: 'user123', // Replace with actual user ID
                currencyPair,
                amount: parseFloat(amount),
                price: parseFloat(price),
                orderType,
            });

            setTransactionHash(response.data.transactionHash);
        } catch (error) {
            alert('Order failed: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Place a Trade</h2>
            <form onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
                <div>
                    <label>Currency Pair:</label>
                    <select value={currencyPair} onChange={(e) => setCurrencyPair(e.target.value)}>
                        <option value="ETH/USDT">ETH/USDT</option>
                        {/* Add more pairs as needed */}
                    </select>
                </div>
                <div>
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Order Type:</label>
                    <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                    </select>
                </div>
                <button type="submit">Place Order</button>
            </form>

            {transactionHash && (
                <div>
                    <h3>Transaction Submitted</h3>
                    <p>Transaction Hash: {transactionHash}</p>
                </div>
            )}
        </div>
    );
};

export default TradeForm;
