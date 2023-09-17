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

  // getAll(req, res) {
  //   // Truy vấn tất cả các đơn hàng từ bảng `shoe_order`
  //   const getAllOrdersQuery = `
  //   SELECT *
  //   FROM shoe_order
  // `;

  //   db.query(getAllOrdersQuery, (err, orderResults) => {
  //     if (err) {
  //       console.error("Lỗi truy vấn dữ liệu đơn hàng: ", err);
  //       res.status(500).json({ error: "Lỗi truy vấn dữ liệu đơn hàng" });
  //     } else {
  //       if (orderResults.length === 0) {
  //         res.status(404).json({ error: "Không tìm thấy đơn hàng" });
  //       } else {
  //         // Tạo mảng chứa thông tin tất cả các đơn hàng
  //         const orders = orderResults.map((order) => ({
  //           id: order.id,
  //           account_id: order.account_id,
  //           order_date: order.order_date,
  //           total_price: order.total_price,
  //           status: order.status,
  //           total_quantity: order.total_quantity,
  //         }));

  //         // Trả về kết quả
  //         res.json(orders);
  //       }
  //     }
  //   });
  // },

  getAll(req, res) {
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (page - 1) * step;
    const date = req.query.date || "";
    console.log("date:", date);
    db.query(
      `SELECT COUNT(*) AS total FROM shoe_order WHERE order_date LIKE '%${date}%'`,
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
        let total = 1;
        if (countResult.length > 0) {
          total = countResult[0].total < 1 ? 1 : countResult[0].total;
        }
        // const total = countResult[0].total || 0;
        const totalPages = Math.ceil(total / step);
        // Truy vấn tất cả các đơn hàng từ bảng `shoe_order`
        const getAllOrdersQuery = `
    SELECT *
    FROM shoe_order WHERE order_date LIKE '%${date}%'
  `;

        db.query(getAllOrdersQuery, (err, orderResults) => {
          if (err) {
            console.error("Lỗi truy vấn dữ liệu đơn hàng: ", err);
            const data = {
              status: 500,
              error: true,
              detail: "Lỗi truy vấn dữ liệu đơn hàng",
            };
            res.status(500).json(data);
            // res.status(500).json({ error: "Lỗi truy vấn dữ liệu đơn hàng" });
          } else {
            if (orderResults.length === 0) {
              const data = {
                status: 404,
                error: true,
                detail: "Không tìm thấy đơn hàng",
              };
              res.status(404).json(data);
              // res.status(404).json({ error: "Không tìm thấy đơn hàng" });
            } else {
              // Tạo mảng chứa thông tin tất cả các đơn hàng
              const orders = orderResults.map((order) => {
                // Truy vấn danh sách chi tiết đơn hàng từ bảng `shoe_order_detail`
                const getOrderDetailQuery = `
            SELECT *
            FROM shoe_order_detail
            WHERE order_id = ${order.id}
          `;

                return new Promise((resolve, reject) => {
                  db.query(getOrderDetailQuery, (err, detailResults) => {
                    if (err) {
                      console.error(
                        "Lỗi truy vấn dữ liệu chi tiết đơn hàng: ",
                        err
                      );
                      reject("Lỗi truy vấn dữ liệu chi tiết đơn hàng");
                    } else {
                      const orderDetails = detailResults.map((detail) => ({
                        id: detail.id,
                        order_id: detail.order_id,
                        product_id: detail.product_id,
                        color_id: detail.color_id,
                        size_id: detail.size_id,
                        quantity: detail.quantity,
                      }));

                      resolve({
                        id: order.id,
                        account_id: order.account_id,
                        order_date: order.order_date,
                        total_price: order.total_price,
                        status: order.status,
                        total_quantity: order.total_quantity,
                        details: orderDetails,
                      });
                    }
                  });
                });
              });

              Promise.all(orders)
                .then((orderData) => {
                  // Trả về kết quả
                  const data = {
                    currentPage: parseInt(page),
                    step: parseInt(step),
                    totalPages: totalPages,
                    data: orderData,
                  };
                  res.status(200).json(data);
                  // res.json(orderData);
                })
                .catch((error) => {
                  res.status(500).json({ error });
                });
            }
          }
        });
      }
    );
  },

  add(req, res) {
    const {
      account_id,
      order_date,
      total_price,
      status,
      total_quantity,
      order_details,
    } = req.body;

    // Kiểm tra các trường thông tin bắt buộc của đơn hàng
    if (
      !account_id ||
      !order_date ||
      !total_price ||
      !status ||
      !total_quantity
    ) {
      res.status(400).json({ error: "Thiếu thông tin bắt buộc của đơn hàng" });
      return;
    }

    // Tạo truy vấn để thêm đơn hàng mới vào bảng `shoe_order`
    const addOrderQuery = `
    INSERT INTO shoe_order (account_id, order_date, total_price, status, total_quantity)
    VALUES (${account_id}, '${order_date}', ${total_price}, ${status}, ${total_quantity})
  `;

    db.query(addOrderQuery, (err, orderResult) => {
      if (err) {
        console.error("Lỗi thêm đơn hàng mới: ", err);
        res.status(500).json({ error: "Lỗi thêm đơn hàng mới" });
      } else {
        const newOrderId = orderResult.insertId;

        if (!order_details || order_details.length === 0) {
          // Nếu không có chi tiết đơn hàng, trả về ID của đơn hàng mới
          res.json({ id: newOrderId });
          return;
        }

        // Tạo mảng chứa các truy vấn để thêm chi tiết đơn hàng vào bảng `shoe_order_detail`
        const addOrderDetailQueries = order_details.map((detail) => {
          const { product_id, color_id, size_id, quantity } = detail;
          return `
          INSERT INTO shoe_order_detail (order_id, product_id, color_id, size_id, quantity)
          VALUES (${newOrderId}, ${product_id}, ${color_id}, ${size_id}, ${quantity})
        `;
        });

        // Thực hiện lần lượt các truy vấn thêm chi tiết đơn hàng
        addOrderDetailQueries.forEach((query) => {
          db.query(query, (err) => {
            if (err) {
              console.error("Lỗi thêm chi tiết đơn hàng mới: ", err);
            }
          });
        });

        // Trả về ID của đơn hàng mới
        res.json({ id: newOrderId });
      }
    });
  },

  addOrderDetail(req, res) {
    const { order_id, product_id, color_id, size_id, quantity } = req.body;

    // Kiểm tra xem các trường thông tin cần thiết đã được cung cấp hay chưa
    if (!order_id || !product_id || !color_id || !size_id || !quantity) {
      res.status(400).json({ error: "Thiếu thông tin cần thiết" });
      return;
    }

    // Tạo câu lệnh INSERT để thêm mới dữ liệu vào bảng shoe_order_detail
    const addOrderDetailQuery = `INSERT INTO shoe_order_detail (order_id, product_id, color_id, size_id, quantity)
    VALUES (${order_id}, ${product_id}, ${color_id}, ${size_id}, ${quantity})`;

    db.query(addOrderDetailQuery, (err, result) => {
      if (err) {
        console.error("Lỗi thêm mới dữ liệu: ", err);
        res.status(500).json({ error: "Lỗi thêm mới dữ liệu" });
      } else {
        res
          .status(201)
          .json({ message: "Thêm mới chi tiết đơn hàng thành công" });
      }
    });
  },

  // update(req, res) {
  //   const id = req.body.id;
  //   const name = req.body.name;

  //   db.query(
  //     "UPDATE shoe_order SET name = ? WHERE id = ?",
  //     [name, id],
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
  //       const data = {
  //         status: 200,
  //       };
  //       res.status(200).json(data);
  //     }
  //   );
  // },

  statusChange(req, res) {
    const id = req.query.id;
    const status = req.query.status;
    db.query(
      "UPDATE shoe_order SET status = ? WHERE id = ?",
      [status, id],
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

  // delete(req, res) {
  //   const id = req.params.id;
  //   db.query("DELETE FROM shoe_order WHERE id = ?", [id], (err, results) => {
  //     if (err) {
  //       const data = {
  //         status: 500,
  //         error: true,
  //       };
  //       res.status(500).json(data);
  //       return;
  //     }
  //     const data = {
  //       status: 200,
  //     };
  //     res.status(200).json(data);
  //   });
  // },
};

module.exports = shoeOrderController;
