// shoeColorController.js
const db = require("../databases/db");

// Hàm thực hiện truy vấn SQL và trả về kết quả
function executeQuery(query, res, successMessage, errorMessage) {
    db.query(query, (error, results) => {
        if (error) {
            console.error('Lỗi khi thực hiện truy vấn:', error);
            const data = {
                status: 500,
                error: true,
                message: errorMessage
            }
            res.status(500).json(data);
        } else {
            const data = {
                status: 200,
                error: false,
                message: successMessage
            }
            res.status(200).json(data);
            // res.status(200).json({ message: successMessage });
        }
    });
}

// API tạo tài khoản
function addDiscount(req, res) {
    const { code, discount, expiration_date } = req.body;

    const query = `INSERT INTO shoe_discount (code, discount, expiration_date) VALUES ('${code}', ${discount}, '${expiration_date}')`;

    executeQuery(query, res, 'Mã giảm giá đã được thêm thành công.', 'Đã xảy ra lỗi khi thêm mã giảm giá');
}

// API sửa tài khoản
function updateDiscount(req, res) {
    const { code, discount, expiration_date } = req.body;

    const query = `UPDATE shoe_discount SET discount = ${discount}, expiration_date = '${expiration_date}', code = '${code}' WHERE code = '${code}'`;

    executeQuery(query, res, 'Mã giảm giá đã được sửa đổi thành công.', 'Đã xảy ra lỗi khi sửa mã giảm giá.');
}

// API xóa tài khoản
function deleteDiscount(req, res) {
    const code = req.params.code;

    const query = `DELETE FROM shoe_discount WHERE code = '${code}'`;

    executeQuery(query, res, 'Mã giảm giá đã được xóa thành công.', 'Đã xảy ra lỗi khi xoá mã giảm giá.');
}

function getAllDiscount(req, res) {
    // Truy vấn tất cả các mã giảm giá từ bảng shoe_discount
    const query = 'SELECT * FROM shoe_discount';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Lỗi khi lấy các mã giảm giá:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy các mã giảm giá.' });
        } else {
            const data = {
                data: results,
                status: 200,
            }
            res.status(200).json(data);
        }
    });
}
function applyDiscount(req, res) {
    const { customer_id, discount_code } = req.body;

    // Kiểm tra xem mã giảm giá có tồn tại và còn hạn sử dụng không
    const checkDiscountQuery = `SELECT * FROM shoe_discount WHERE code = '${discount_code}' AND expiration_date >= NOW()`;

    db.query(checkDiscountQuery, (error, discountResults) => {
        if (error) {
            console.error('Lỗi khi kiểm tra mã giảm giá:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra mã giảm giá.' });
        } else if (discountResults.length === 0) {
            res.status(400).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' });
        } else {
            const discount = discountResults[0].discount;

            // Kiểm tra xem mã giảm giá đã được sử dụng chưa
            const checkUsageQuery = `SELECT * FROM shoe_discount_customer WHERE customer_id = ${customer_id} AND discount_code = '${discount_code}'`;

            db.query(checkUsageQuery, (error, usageResults) => {
                if (error) {
                    console.error('Lỗi khi kiểm tra việc sử dụng mã giảm giá:', error);
                    res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra việc sử dụng mã giảm giá.' });
                } else if (usageResults.length > 0) {
                    res.status(400).json({ message: 'Mã giảm giá đã được sử dụng.' });
                } else {
                    const applyDiscountQuery = `INSERT INTO shoe_discount_customer (customer_id, discount_code) VALUES (${customer_id}, '${discount_code}')`;

                    db.query(applyDiscountQuery, (error, results) => {
                        if (error) {
                            console.error('Lỗi khi áp dụng mã giảm giá cho khách hàng:', error);
                            res.status(500).json({ message: 'Đã xảy ra lỗi khi áp dụng mã giảm giá.' });
                        } else {
                            res.status(200).json({ success: true, discount: discount });
                        }
                    });
                }
            });
        }
    });
}

// Export các phương thức của controller
module.exports = {
    getAllDiscount,
    applyDiscount,
    addDiscount,
    updateDiscount,
    deleteDiscount,
};
