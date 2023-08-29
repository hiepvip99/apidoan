const db = require("../databases/db");

const shoeOrderController = {
  getById(req, res) {
  const id = req.params.id;

  // Truy vấn thông tin đơn hàng từ bảng `shoe_order`
  const getOrderQuery = `
    SELECT *
    FROM shoe_order
    WHERE id = ${id}
  `;

  db.query(getOrderQuery, (err, orderResults) => {
    if (err) {
      console.error("Lỗi truy vấn dữ liệu đơn hàng: ", err);
      res.status(500).json({ error: "Lỗi truy vấn dữ liệu đơn hàng" });
    } else {
      if (orderResults.length === 0) {
        res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      } else {
        const order = orderResults[0];

        // Truy vấn danh sách chi tiết đơn hàng từ bảng `shoe_order_detail`
        const getOrderDetailQuery = `
          SELECT *
          FROM shoe_order_detail
          WHERE order_id = ${id}
        `;

        db.query(getOrderDetailQuery, (err, detailResults) => {
          if (err) {
            console.error("Lỗi truy vấn dữ liệu chi tiết đơn hàng: ", err);
            res
              .status(500)
              .json({ error: "Lỗi truy vấn dữ liệu chi tiết đơn hàng" });
          } else {
            const orderDetails = detailResults.map((detail) => ({
              id: detail.id,
              order_id: detail.order_id,
              product_id: detail.product_id,
              color_id: detail.color_id,
              size_id: detail.size_id,
              quantity: detail.quantity,
            }));

            // Tạo đối tượng chứa thông tin đơn hàng và danh sách chi tiết đơn hàng
            const orderWithDetails = {
              order: {
                id: order.id,
                account_id: order.account_id,
                order_date: order.order_date,
                total_price: order.total_price,
                status: order.status,
                total_quantity: order.total_quantity,
              },
              details: orderDetails,
            };

            // Trả về kết quả
            res.json(orderWithDetails);
          }
        });
      }
    }
  });
},
  // getById(req, res) {
  //   const id = req.params.id;

  //   db.query(
  //     "SELECT * FROM shoe_order WHERE id = ?",
  //     [id],
  //     (err, results) => {
  //       if (err) {
  //         console.error("Error executing MySQL query:", err);
  //         const data = {
  //           status: 500,
  //           error: true,
  //         };
  //         res.status(500).json(data);
  //         return;
  //       }
  //       if (results.length === 0) {
  //         res.status(404).json({ error: "Shoe order not found" });
  //         return;
  //       }
  //       const data = {
  //         status: 200,
  //         object: results[0],
  //       };
  //       res.status(200).json(data);
  //     }
  //   );
  // },

  getAll(req, res) {
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (page - 1) * step;
    const keyword = req.query.keyword || "";
    console.log("keyword:", keyword);
    db.query(
      "SELECT COUNT(*) AS total FROM shoe_order",
      (err, countResult) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);
          return;
        }
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / step);
        db.query(
          `SELECT * FROM shoe_order where name like 
      '${`%${keyword}%`}' LIMIT ${offset}, ${parseInt(step)} `,
          (err, results) => {
            if (err) {
              console.error("Error executing MySQL query:", err);
              const data = {
                status: 500,
                error: true,
                detail: "Failed to fetch shoe orders",
              };
              res.status(500).json(data);
              return;
            }
            const data = {
              currentPage: parseInt(page),
              step: parseInt(step),
              totalPages: totalPages,
              data: results,
            };
            res.status(200).json(data);
          }
        );
      }
    );
  },

  add(req, res) {
    const { name } = req.body;
    db.query(
      "INSERT INTO shoe_order (name) VALUES (?)",
      [name],
      (err, results) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);
          return;
        }
        const newOrder = {
          status: 200,
        };
        res.status(200).json(newOrder);
      }
    );
  },

  update(req, res) {
    const id = req.body.id;
    const name = req.body.name;

    db.query(
      "UPDATE shoe_order SET name = ? WHERE id = ?",
      [name, id],
      (err, results) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);
          return;
        }
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    );
  },

  delete(req, res) {
    const id = req.params.id;
    db.query(
      "DELETE FROM shoe_order WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          const data = {
            status: 500,
            error: true,
          };
          res.status(500).json(data);
          return;
        }
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    );
  },
};

module.exports = shoeOrderController;
