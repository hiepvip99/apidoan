// shoeColorController.js
const db = require("../databases/db");

// Hàm thực hiện truy vấn SQL và trả về kết quả
function executeQuery(query, res, successMessage, errorMessage) {
  connection.query(query, (error, results) => {
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

// API đăng nhập
function login(req, res) {
  const { username, password } = req.body;

  const query = `SELECT * FROM shoe_account WHERE username = '${username}' AND password = '${password}'`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Lỗi khi thực hiện truy vấn:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập.' });
    } else {
      if (results.length === 0) {
        res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
      } else {
        const account = results[0];
        if (account.status_id === 1) {
          res.status(200).json({ message: 'Đăng nhập thành công.', data: account });
        } else if (account.status_id === 2) {
          res.status(401).json({ message: 'Tài khoản đã bị khóa.' });
        }
      }
    }
  });
}
// function login(req, res) {
//   const { username, password } = req.body;

//   const query = `SELECT * FROM shoe_account WHERE username = '${username}' AND password = '${password}'`;

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Lỗi khi thực hiện truy vấn:', error);
//       res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập.' });
//     } else {
//       if (results.length === 0) {
//         res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
//       } else {
//         res.status(200).json({ message: 'Đăng nhập thành công.' });
//       }
//     }
//   });
// }

// API tạo tài khoản
function createAccount(req, res) {
  const { username, password, decentralization_id, status_id } = req.body;

  const query = `INSERT INTO shoe_account (username, password, decentralization_id, status_id) VALUES ('${username}', '${password}', ${decentralization_id}, ${status_id})`;

  executeQuery(query, res, 'Tài khoản đã được tạo thành công.', 'Đã xảy ra lỗi khi tạo tài khoản.');
}

// API sửa tài khoản
function updateAccount(req, res) {
  const accountId = req.params.id;
  const { username, password, decentralization_id, status_id } = req.body;

  const query = `UPDATE shoe_account SET username = '${username}', password = '${password}', decentralization_id = ${decentralization_id}, status_id = ${status_id} WHERE id = ${accountId}`;

  executeQuery(query, res, 'Tài khoản đã được sửa đổi thành công.', 'Đã xảy ra lỗi khi sửa tài khoản.');
}

// API xóa tài khoản
function deleteAccount(req, res) {
  const accountId = req.params.id;

  const query = `DELETE FROM shoe_account WHERE id = ${accountId}`;

  executeQuery(query, res, 'Tài khoản đã được xóa thành công.', 'Đã xảy ra lỗi khi xóa tài khoản.');
}

// Export các phương thức của controller
module.exports = {
  login,
  createAccount,
  updateAccount,
  deleteAccount,
};
