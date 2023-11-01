const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Kết nối tới cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

// Kiểm tra kết nối đến cơ sở dữ liệu
db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối đến cơ sở dữ liệu: ' + err.stack);
        return;
    }
    console.log('Đã kết nối thành công đến cơ sở dữ liệu MySQL');
});

// Định nghĩa route API để thêm đánh giá
app.post('/reviews', (req, res) => {
    const { product_id, customer_id, rating, review_text } = req.body;

    const review = {
        product_id: product_id,
        customer_id: customer_id,
        rating: rating,
        review_text: review_text
    };

    // Thêm đánh giá vào cơ sở dữ liệu
    db.query('INSERT INTO shoe_review SET ?', review, (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm đánh giá: ' + err.stack);
            res.status(500).send('Lỗi khi thêm đánh giá');
            return;
        }

        console.log('Đánh giá đã được thêm thành công');
        res.status(200).send('Đánh giá đã được thêm thành công');
    });
});

// Khởi chạy server
app.listen(3000, () => {
    console.log('Server đã được khởi chạy trên cổng 3000');
});