const db = require("../databases/db");
const { sendNotification } = require("../firebase-notification");

const shoeOrderController = {
  getById(req, res) {
    const id = req.query.id;

    // Truy vấn thông tin đơn hàng từ bảng `shoe_order`
    const getOrderQuery = `
    SELECT *
    FROM shoe_order
    WHERE id = ${id}
  `;

    db.query(getOrderQuery, (err, orderResults) => {
      if (err) {
        const data = {
          status: 500,
          error: true,
          detail: "Lỗi truy vấn dữ liệu đơn hàng",
        };
        console.error("Lỗi truy vấn dữ liệu đơn hàng: ", err);
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
              // res
              //   .status(500)
              //   .json({ error: "Lỗi truy vấn dữ liệu chi tiết đơn hàng" });
              const data = {
                status: 500,
                error: true,
                detail: "Lỗi truy vấn dữ liệu chi tiết đơn hàng",
              };
              res.status(500).json(data);
            } else {
              const orderDetails = detailResults.map(async (detail) => {
                const productQuery = `SELECT * FROM shoe_product WHERE id = ${detail.product_id}`;

                const product = await new Promise((resolve, reject) => {
                  db.query(productQuery, (err, productResult) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(productResult[0]);
                    }
                  });
                });

                return {
                  id: detail.id,
                  order_id: detail.order_id,
                  // product_id: detail.product_id,
                  product: product,
                  color_id: detail.color_id,
                  size_id: detail.size_id,
                  quantity: detail.quantity,
                };
              });

              // Đợi cho tất cả các truy vấn trả về kết quả
              Promise.all(orderDetails)
                .then((orderDetailsWithProduct) => {
                  db.query(
                    `SELECT * FROM shoe_customer WHERE id_account = ${order.account_id}`,
                    (err, customerResult) => {
                      if (err) {
                        console.log("err customerResult in order:", err);
                      }
                      let customer;
                      if (customerResult.length > 0) {
                        customer = customerResult[0];
                      }
                      // Tạo đối tượng chứa thông tin đơn hàng và danh sách chi tiết đơn hàng
                      const orderWithDetails = {
                        status: 200,
                        object: {
                          id: order.id,
                          // account_id: order.account_id,
                          customerInfo: customer,
                          order_date: order.order_date,
                          total_price: order.total_price,
                          status_id: order.status_id,
                          payment_methods: order.payment_methods,
                          total_quantity: order.total_quantity,
                          delivery_address: order.delivery_address,
                        },
                        details: orderDetailsWithProduct,
                      };

                      // Trả về kết quả
                      res.status(200).json(orderWithDetails);
                    }
                  );
                })
                .catch((error) => {
                  console.log("Error fetching product details:", error);
                  res
                    .status(500)
                    .json({ error: "Failed to fetch product details" });
                });
              // const orderDetails = detailResults.map((detail) => ({
              //   id: detail.id,
              //   order_id: detail.order_id,
              //   product_id: detail.product_id,
              //   color_id: detail.color_id,
              //   size_id: detail.size_id,
              //   quantity: detail.quantity,
              // }));

              // db.query(
              //   `SELECT * FROM shoe_customer WHERE id_account = ${order.account_id}`,
              //   (err, customerResult) => {
              //     if (err) {
              //       console.log("err customerResult in order:", err);
              //     }
              //     let customer;
              //     if (customerResult.length > 0) {
              //       customer = customerResult[0];
              //     }
              //     // Tạo đối tượng chứa thông tin đơn hàng và danh sách chi tiết đơn hàng
              //     const orderWithDetails = {
              //       status: 200,
              //       object: {
              //         id: order.id,
              //         // account_id: order.account_id,
              //         customerInfo: customer,
              //         order_date: order.order_date,
              //         total_price: order.total_price,
              //         status_id: order.status_id,
              //         payment_methods: order.payment_methods,
              //         total_quantity: order.total_quantity,
              //         delivery_address: order.delivery_address,
              //       },
              //       details: orderDetails,
              //     };

              //     // Trả về kết quả
              //     res.status(200).json(orderWithDetails);
              //   }
              // );
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
    const account_id = req.query.account_id || "";
    // console.log("date:", date);
    console.log("account_id:", account_id);
    db.query(
      `SELECT COUNT(*) AS total FROM shoe_order WHERE order_date LIKE '%${date}%' AND account_id LIKE '%${account_id}%'`,
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
    FROM shoe_order WHERE order_date LIKE '%${date}%' AND account_id LIKE '%${account_id}%'
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
              //     // Tạo mảng chứa thông tin tất cả các đơn hàng
              //     const orders = orderResults.map((order) => {
              //       // Truy vấn danh sách chi tiết đơn hàng từ bảng `shoe_order_detail`
              //       const getOrderDetailQuery = `
              //   SELECT *
              //   FROM shoe_order_detail
              //   WHERE order_id = ${order.id}
              // `;

              //       return new Promise((resolve, reject) => {
              //         db.query(getOrderDetailQuery, (err, detailResults) => {
              //           if (err) {
              //             console.error(
              //               "Lỗi truy vấn dữ liệu chi tiết đơn hàng: ",
              //               err
              //             );
              //             reject("Lỗi truy vấn dữ liệu chi tiết đơn hàng");
              //           } else {
              //             const orderDetails = detailResults.map((detail) => ({
              //               id: detail.id,
              //               order_id: detail.order_id,
              //               product_id: detail.product_id,
              //               color_id: detail.color_id,
              //               size_id: detail.size_id,
              //               quantity: detail.quantity,
              //             }));

              //             db.query(
              //               `SELECT * FROM shoe_customer WHERE id_account = ${order.account_id}`,
              //               (err, customerResult) => {
              //                 if (err) {
              //                   console.log(
              //                     "Error retrieving customer information:",
              //                     err
              //                   );
              //                 }

              //                 let customer = null;
              //                 if (customerResult.length > 0) {
              //                   customer = customerResult[0];
              //                   customer.address = JSON.parse(customer.address);
              //                 }

              //                 resolve({
              //                   id: order.id,
              //                   customerInfo: customer,
              //                   order_date: order.order_date,
              //                   total_price: order.total_price,
              //                   status_id: order.status_id,
              //                   payment_methods: order.payment_methods,
              //                   total_quantity: order.total_quantity,
              //                   delivery_address: order.delivery_address,
              //                   details: orderDetails,
              //                 });
              //               }
              //             );

              //             // db.query(
              //             //   `SELECT * FROM shoe_customer WHERE id_account = ${order.account_id}`,
              //             //   (err, customerResult) => {
              //             //     if (err) {
              //             //       console.log("err customerResult in order:", err);
              //             //     }

              //             //     let customer = null;
              //             //     if (customerResult.length > 0) {
              //             //       customer = customerResult[0];
              //             //     }

              //             //     resolve({
              //             //       id: order.id,
              //             //       // account_id: order.account_id,
              //             //       customerInfo: customer,
              //             //       order_date: order.order_date,
              //             //       total_price: order.total_price,
              //             //       status_id: order.status_id,
              //             //       payment_methods: order.payment_methods,
              //             //       total_quantity: order.total_quantity,
              //             //       details: orderDetails,
              //             //     });
              //             //   }
              //             // );
              //           }
              //         });
              //       });
              //     });

              //     db.query(
              //       `SELECT * FROM shoe_order_status`,
              //       (err, statusResult) => {
              //         if (err) {
              //           return;
              //         }
              //         Promise.all(orders)
              //           .then((orderData) => {
              //             // Trả về kết quả
              //             const data = {
              //               currentPage: parseInt(page),
              //               step: parseInt(step),
              //               totalPages: totalPages,
              //               data: orderData,
              //               statusObj: statusResult,
              //             };
              //             res.status(200).json(data);
              //             // res.json(orderData);
              //           })
              //           .catch((error) => {
              //             res.status(500).json({ error });
              //           });
              //       }
              //     );
              const orders = orderResults.map((order) => {
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
                      const orderDetails = detailResults.map(async (detail) => {
                        const productQuery = `SELECT * FROM shoe_product WHERE id = ${detail.product_id}`;

                        const product = await new Promise((resolve, reject) => {
                          db.query(productQuery, (err, productResult) => {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(productResult[0]);
                            }
                          });
                        });

                        return {
                          id: detail.id,
                          order_id: detail.order_id,
                          // product_id: detail.product_id,
                          product: product,
                          color_id: detail.color_id,
                          size_id: detail.size_id,
                          quantity: detail.quantity,
                        };
                      });

                      Promise.all(orderDetails)
                        .then((orderDetailsWithProduct) => {
                          db.query(
                            `SELECT * FROM shoe_customer WHERE id_account = ${order.account_id}`,
                            (err, customerResult) => {
                              if (err) {
                                console.log(
                                  "Error retrieving customer information:",
                                  err
                                );
                              }

                              let customer = null;
                              if (customerResult.length > 0) {
                                customer = customerResult[0];
                                customer.address = JSON.parse(customer.address);
                              }

                              resolve({
                                id: order.id,
                                customerInfo: customer,
                                order_date: order.order_date,
                                total_price: order.total_price,
                                status_id: order.status_id,
                                payment_methods: order.payment_methods,
                                total_quantity: order.total_quantity,
                                delivery_address: order.delivery_address,
                                details: orderDetailsWithProduct,
                              });
                            }
                          );
                        })
                        .catch((error) => {
                          console.log("Error fetching product details:", error);
                          reject("Lỗi truy vấn dữ liệu sản phẩm");
                        });
                    }
                  });
                });
              });

              db.query(
                `SELECT * FROM shoe_order_status`,
                (err, statusResult) => {
                  if (err) {
                    return;
                  }
                  Promise.all(orders)
                    .then((orderData) => {
                      const data = {
                        currentPage: parseInt(page),
                        step: parseInt(step),
                        totalPages: totalPages,
                        data: orderData,
                        statusObj: statusResult,
                      };
                      res.status(200).json(data);
                    })
                    .catch((error) => {
                      res.status(500).json({ error });
                    });
                }
              );
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
      status_id,
      total_quantity,
      payment_methods,
      order_details,
    } = req.body;

    // Kiểm tra các trường thông tin bắt buộc của đơn hàng
    if (
      !account_id ||
      !order_date ||
      !total_price ||
      !status_id ||
      !payment_methods ||
      !total_quantity
    ) {
      res.status(400).json({ error: "Thiếu thông tin bắt buộc của đơn hàng" });
      return;
    }

    // Tạo truy vấn để thêm đơn hàng mới vào bảng `shoe_order`
    const addOrderQuery = `
    INSERT INTO shoe_order (account_id, order_date, total_price, status_id, total_quantity, payment_methods)
    VALUES (${account_id}, '${order_date}', ${total_price}, ${status_id}, ${total_quantity}, '${payment_methods}')
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
        const data = {
          status: 200,
        };
        res.status(200).json(data);
        // res.json({ id: newOrderId });
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
    const id = req.body.id;
    const status_id = req.body.status_id;
    if (!id || !status_id) {
      const data = {
        status: 500,
        detail: "Invalid id or status id",
      };
      return res.status(500).json(data);
    }
    db.query(
      "UPDATE shoe_order SET status_id = ? WHERE id = ?",
      [status_id, id],
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

        // if (status_id === ) {
        // }
        // Gọi hàm sendNotification
        sendNotification(
          "Có cập nhật mới",
          "Đơn hàng của bạn đã có cập nhật,Vui lòng kiểm tra thông tin đơn hàng của bạn",
          "all"
        ).then((response) => {
            console.log("Thông báo đã được gửi:", response);
          })
          .catch((error) => {
            console.log("Lỗi khi gửi thông báo:", error);
          });
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    );
  },

  getStatusOrder(req, res) {
    db.query(`SELECT * FROM shoe_order_status`, (err, statusResult) => {
      if (err) {
        console.log("err:", err);
        return res.status(500);
      }
      const data = {
        status: 200,
        statusObj: statusResult,
      };
      res.status(200).json(data);
    });
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
