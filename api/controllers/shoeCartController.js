const db = require("../databases/db");

const shoeCartController = {
  // Lấy thông tin giỏ hàng của tài khoản
  getCart(req, res) {
    const accountId = req.query.account_id;
    const query = `
    SELECT sc.id, sc.account_id, sc.product_id, sc.color_id, sc.size_id, sc.quantity, sp.name, sps.quantity AS inventory_quantity, spc.price, spc.images
    FROM shoe_cart AS sc
    INNER JOIN shoe_product AS sp ON sc.product_id = sp.id
    INNER JOIN shoe_product_size AS sps ON sc.product_id = sps.product_id AND sc.size_id = sps.size_id AND sc.color_id = sps.color_id
    INNER JOIN shoe_product_colors AS spc ON sp.id = spc.product_id AND sc.color_id = spc.color_id
    WHERE sc.account_id = ?
    GROUP BY sc.id
  `;

    db.query(query, [accountId], (err, results) => {
      if (err) throw err;

      // Định dạng lại trường `images` thành một mảng các đối tượng có trường `url`
      const formattedResults = results.map((result) => {
        const images = JSON.parse(result.images);
        const formattedImages = images.map((image) => {
          return { url: image };
        });
        return { ...result, images: formattedImages };
      });

      const data = {
        status: 200,
        data: formattedResults,
      };
      res.status(200).json(data);
    });
  },
  // getCart(req, res) {
  //   const accountId = req.query.account_id;
  //   const query = `SELECT * FROM shoe_cart WHERE account_id = ?`;

  //   db.query(query, [accountId], (err, results) => {
  //     if (err) throw err;
  //     // res.json(results);
  //     const data = {
  //       status: 200,
  //       data: results,
  //     };
  //     res.status(200).json(data);
  //   });
  // },

  // Thêm sản phẩm vào giỏ hàng
  addToCart(req, res) {
    const { account_id, product_id, color_id, size_id, quantity } = req.body;

    // Kiểm tra xem đã có bản ghi trùng lặp hay chưa
    const checkDuplicateQuery = `SELECT * FROM shoe_cart WHERE account_id = ? AND product_id = ? AND color_id = ? AND size_id = ?`;
    db.query(
      checkDuplicateQuery,
      [account_id, product_id, color_id, size_id],
      (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          // Nếu đã có bản ghi trùng lặp, thực hiện cập nhật số lượng
          const updateQuantityQuery = `UPDATE shoe_cart SET quantity = quantity + ? WHERE account_id = ? AND product_id = ? AND color_id = ? AND size_id = ?`;
          db.query(
            updateQuantityQuery,
            [quantity, account_id, product_id, color_id, size_id],
            (err, updateResult) => {
              if (err) throw err;

              const data = {
                status: 200,
              };
              res.status(200).json(data);
            }
          );
        } else {
          // Nếu không có bản ghi trùng lặp, thực hiện thêm mới
          const insertQuery = `INSERT INTO shoe_cart (account_id, product_id, color_id, size_id, quantity) VALUES (?, ?, ?, ?, ?)`;
          db.query(
            insertQuery,
            [account_id, product_id, color_id, size_id, quantity],
            (err, insertResult) => {
              if (err) throw err;

              const data = {
                status: 200,
              };
              res.status(200).json(data);
            }
          );
        }
      }
    );
  },
  // addToCart(req, res) {
  //   const { account_id, product_id, color_id, size_id, quantity } = req.body;
  //   const query = `INSERT INTO shoe_cart (account_id, product_id, color_id, size_id, quantity) VALUES (?, ?, ?, ?, ?)`;

  //   db.query(
  //     query,
  //     [account_id, product_id, color_id, size_id, quantity],
  //     (err, results) => {
  //       if (err) throw err;
  //       // res.json({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
  //       const data = {
  //         status: 200,
  //       };
  //       res.status(200).json(data);
  //     }
  //   );
  // },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(req, res) {
    const itemId = req.body.id;
    const query = `DELETE FROM shoe_cart WHERE id = ?`;

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
    const {id, quantity } = req.body;
    const query = `UPDATE shoe_cart SET quantity = ? WHERE id = ?`;

    db.query(query, [quantity, id], (err, results) => {
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
