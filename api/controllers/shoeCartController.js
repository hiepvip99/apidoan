const db = require("../databases/db");

const shoeCartController = {
  // Lấy thông tin giỏ hàng của tài khoản
  getCart(req, res) {
    const accountId = req.params.account_id;
    const query = `SELECT * FROM cart WHERE account_id = ?`;

    db.query(query, [accountId], (err, results) => {
      if (err) throw err;
      // res.json(results);
      const data = {
        status: 200,
        object: results,
      };
      res.status(200).json(data);
    });
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart(req, res) {
    const { account_id, product_id, color_id, size_id, quantity } = req.body;
    const query = `INSERT INTO cart (account_id, product_id, color_id, size_id, quantity) VALUES (?, ?, ?, ?, ?)`;

    db.query(
      query,
      [account_id, product_id, color_id, size_id, quantity],
      (err, results) => {
        if (err) throw err;
        // res.json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    );
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(req, res) {
    const itemId = req.params.id;
    const query = `DELETE FROM cart WHERE id = ?`;

    db.query(query, [itemId], (err, results) => {
        if (err) throw err;
        const data = {
          status: 200,
        };
        res.status(200).json(data);
    //   res.json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
    });
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(req, res) {
    const itemId = req.params.id;
    const { quantity } = req.body;
    const query = `UPDATE cart SET quantity = ? WHERE id = ?`;

    db.query(query, [quantity, itemId], (err, results) => {
        if (err) throw err;
        const data = {
          status: 200,
        };
        res.status(200).json(data);
    //   res.json({ message: "Số lượng sản phẩm đã được cập nhật" });
    });
  },
};

module.exports = shoeCartController;
