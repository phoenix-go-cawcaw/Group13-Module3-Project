import pool from '../pool.js';

export const createPayfast = async(req, res) => {
    try {
        const {user_id, total_amount, voucher_code} = req.body;

        // Insert into checkout only - this is order data
        const [result] = await pool.execute(
            `INSERT INTO checkout (user_id, total_amount, voucher_code, status) 
             VALUES (?, ?, ?, ?)`, 
            [user_id, total_amount, voucher_code || null, 'pending']
        );
        
        const checkoutId = result.insertId;

        // Create a payment record for this checkout
        await pool.execute(
            `INSERT INTO payments (checkout_id, provider, payment_method, status) 
             VALUES (?, ?, ?, ?)`,
            [checkoutId, 'payfast', 'payfast', 'pending']
        );

        res.json({redirectUrl: `http://localhost:5173/payfast/${checkoutId}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to create payment"});
    }
};


export const updatePayfast = async (req, res) => {
    try {
        const { checkoutId, status, ownerName, paymentMethod } = req.body;

        const transactionId = "HB-" + Math.floor(Math.random() * 100000000);

        // Update payments table only with payment info
        await pool.execute(
            `UPDATE payments 
             SET status = ?, transaction_id = ?, owner_name = ?, payment_method = ? 
             WHERE checkout_id = ?`, 
            [status, transactionId, ownerName || null, paymentMethod || 'payfast', checkoutId]
        );

        // If payment succeeded, mark the order as completed
        if (status === 'paid') {
            await pool.execute(
                `UPDATE checkout 
                 SET status = 'completed' 
                 WHERE id = ?`,
                [checkoutId]
            );
        }

        // If payment failed, mark order as pending (can retry)
        if (status === 'failed') {
            await pool.execute(
                `UPDATE checkout 
                 SET status = 'pending' 
                 WHERE id = ?`,
                [checkoutId]
            );
        }

        res.json({ message: "Payment updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Payment update failed" });
    }
};