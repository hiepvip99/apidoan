const db = require("../databases/db");
const { sendNotification, sendNotificationWithToken } = require("../firebase-notification");

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

                        const colorsQuery = `SELECT * FROM shoe_product_colors WHERE product_id = ${detail.product_id} AND color_id = ${detail.color_id};`;

                        const colorS = await new Promise((resolve, reject) => {
                          db.query(colorsQuery, (err, colorResult) => {
                            if (err) {
                              reject(err);
                            } else {
                              const color = colorResult[0];
                              let images = [];

                              if (color.images) {
                                // console.log(color.images);
                                // const imageUrlsArray = JSON.parse(color.images);
                                const fixedImages = color.images.replace(
                                  /\\/g,
                                  "\\\\"
                                );
                                const imageUrlsArray = JSON.parse(fixedImages);
                                // console.log(imageUrlsArray);
                                images = imageUrlsArray.map((url) => ({ url }));
                              }

                              const colorImage = {
                                // product_color_id: color.id,
                                color_id: color.color_id,
                                price: color.price,
                                images: images,
                              };

                              resolve(colorImage);
                              // resolve(colorResult[0]);
                            }
                          });
                        });

                        return {
                          id: detail.id,
                          order_id: detail.order_id,
                          // product_id: detail.product_id,
                          product: product,
                          // color_id: detail.color_id,
                          color: colorS,
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
      delivery_address,
    } = req.body;

    // Kiểm tra các trường thông tin bắt buộc của đơn hàng
    if (
      !account_id ||
      !order_date ||
      !total_price ||
      !status_id ||
      !payment_methods ||
      !total_quantity || !delivery_address || delivery_address === ''
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc của đơn hàng", status: 400 });
    }

    // Tạo truy vấn để thêm đơn hàng mới vào bảng `shoe_order`
    const addOrderQuery = `
    INSERT INTO shoe_order (account_id, order_date, total_price, status_id, total_quantity, payment_methods, delivery_address)
    VALUES (${account_id}, '${order_date}', ${total_price}, ${status_id}, ${total_quantity}, '${payment_methods}', '${delivery_address}')
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

        order_details.map((detail) => {
          const { product_id, color_id, size_id, quantity } = detail;
          // Lấy giá trị quantity hiện tại từ bảng shoe_product_size
          const selectQuery = `SELECT quantity FROM shoe_product_size WHERE product_id = ${product_id} AND color_id = ${color_id} AND size_id = ${size_id}`;
          db.query(selectQuery, (error, results) => {
            if (error) {
              console.error("Lỗi khi truy vấn cơ sở dữ liệu: " + error);
              res
                .status(500)
                .json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
              return;
            }

            if (results.length === 0) {
              res.status(404).json({ message: "Không tìm thấy bản ghi" });
              return;
            }

            const currentQuantity = results[0].quantity;
            const newQuantity = currentQuantity - quantity;

            // Cập nhật giá trị mới vào bảng shoe_product_size
            const updateQuery = `UPDATE shoe_product_size SET quantity = ${newQuantity} WHERE product_id = ${product_id} AND color_id = ${color_id} AND size_id = ${size_id}`;
            db.query(updateQuery, (error, results) => {
              if (error) {
                console.error("Lỗi khi cập nhật cơ sở dữ liệu: " + error);
                res
                  .status(500)
                  .json({ message: "Lỗi khi cập nhật cơ sở dữ liệu" });
                return;
              }

              // res.json({ message: "Cập nhật số lượng thành công" });
            });
          });
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

  checkReviewExistence(req, res) {
    const { order_detail_id, product_id } = req.query;
    const query = `SELECT COUNT(*) AS count FROM shoe_review WHERE order_detail_id = ${order_detail_id} AND product_id = ${product_id}`;

    db.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error checking review existence: ' + error);
        res.status(500).json({ error: 'Failed to check review existence' });
      } else {
        const hasReview = results[0].count === 0;
        res.status(200).json({ hasReview: hasReview });
      }
    });
  },
  
  getReview(req, res) {
    const { order_detail_id, customer_id, step = 10, page = 1 } = req.query;

    const pageSize = parseInt(step);
    const startIndex = (parseInt(page) - 1) * pageSize;

    let query = 'SELECT r.*, c.name AS customer_name, c.image AS customer_image FROM shoe_review r JOIN shoe_customer c ON r.customer_id = c.id';

    if (order_detail_id) {
      query += ` WHERE r.order_detail_id = ${order_detail_id}`;
    } else if (customer_id) {
      query += ` WHERE r.customer_id = ${customer_id}`;
    } else {
      res.status(400).json({ error: 'Missing query parameter' });
      return;
    }

    const countQuery = query.replace('r.*, c.name AS customer_name, c.image AS customer_image', 'COUNT(*) AS total');

    db.query(countQuery, (error, countResults) => {
      if (error) {
        console.error('Error fetching reviews count: ' + error);
        res.status(500).json({ error: 'Failed to fetch reviews count' });
        return;
      }

      const totalReviews = countResults[0].total;
      const totalPages = Math.ceil(totalReviews / pageSize);

      query += ` LIMIT ${startIndex}, ${pageSize}`;

      db.query(query, (error, results, fields) => {
        if (error) {
          console.error('Error fetching reviews: ' + error);
          res.status(500).json({ error: 'Failed to fetch reviews' });
        } else {
          res.status(200).json({
            reviews: results,
            currentPage: parseInt(page),
            step: parseInt(step),
            totalPages: totalPages
          });
        }
      });
    });
  },
  // getReview(req, res) {
  //   const { order_detail_id, customer_id, step = 10, page = 1 } = req.query;

  //   const pageSize = parseInt(step);
  //   const startIndex = (parseInt(page) - 1) * pageSize;

  //   let query = 'SELECT * FROM shoe_review';

  //   if (order_detail_id) {
  //     query += ` WHERE order_detail_id = ${order_detail_id}`;
  //   } else if (customer_id) {
  //     query += ` WHERE customer_id = ${customer_id}`;
  //   } else {
  //     res.status(400).json({ error: 'Missing query parameter' });
  //     return;
  //   }

  //   const countQuery = query.replace('*', 'COUNT(*) AS total');

  //   db.query(countQuery, (error, countResults) => {
  //     if (error) {
  //       console.error('Error fetching reviews count: ' + error);
  //       res.status(500).json({ error: 'Failed to fetch reviews count' });
  //       return;
  //     }

  //     const totalReviews = countResults[0].total;
  //     const totalPages = Math.ceil(totalReviews / pageSize);

  //     query += ` LIMIT ${startIndex}, ${pageSize}`;

  //     db.query(query, (error, results, fields) => {
  //       if (error) {
  //         console.error('Error fetching reviews: ' + error);
  //         res.status(500).json({ error: 'Failed to fetch reviews' });
  //       } else {
  //         res.status(200).json({
  //           reviews: results,
  //           currentPage: parseInt(page),
  //           step: parseInt(step),
  //           totalPages: totalPages
  //         });
  //       }
  //     });
  //   });
  // },

  // getReview(req, res) {
  // const { order_detail_id, customer_id } = req.query;

  // let query = 'SELECT * FROM shoe_review';

  // if (order_detail_id) {
  //   query += ` WHERE order_detail_id = ${order_detail_id}`;
  // } else if (customer_id) {
  //   query += ` WHERE customer_id = ${customer_id}`;
  // } else {
  //   res.status(400).json({ error: 'Missing query parameter' });
  //   return;
  // }

  // db.query(query, (error, results, fields) => {
  //   if (error) {
  //     console.error('Error fetching reviews: ' + error);
  //     res.status(500).json({ error: 'Failed to fetch reviews' });
  //   } else {
  //     res.status(200).json(results);
  //   }
  // });
  // },

  // API lấy toàn bộ đánh giá với các thuộc tính và số lượng theo mức rating (getAllReview)
  getAllReview(req, res) {
    const { product_id, rating, step = 10, page = 1 } = req.query;

    let query = 'SELECT r.*, c.name AS customer_name, c.image AS customer_image FROM shoe_review r';
    let condition = '';

    if (product_id) {
      query += ` JOIN shoe_customer c ON r.customer_id = c.id WHERE r.product_id = ${product_id}`;
      condition = `WHERE product_id = ${product_id}`;
    } else {
      query += ' JOIN shoe_customer c ON r.customer_id = c.id';
    }

    const startIndex = (parseInt(page) - 1) * parseInt(step);
    query += ` LIMIT ${startIndex}, ${parseInt(step)}`;

    db.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error fetching reviews: ' + error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
      } else {
        if (!rating) {
          const ratingCountQuery = `SELECT r.rating, COUNT(*) AS count FROM shoe_review r ${condition} GROUP BY r.rating`;
          db.query(ratingCountQuery, (error, ratingCountResults, fields) => {
            if (error) {
              console.error('Error fetching rating count: ' + error);
              res.status(500).json({ error: 'Failed to fetch rating count' });
            } else {
              const ratingCounts = {
                star1: 0,
                star2: 0,
                star3: 0,
                star4: 0,
                star5: 0
              };
              let totalRatings = 0;
              let totalStars = 0;

              ratingCountResults.forEach((row) => {
                const rating = `star${row.rating}`;
                ratingCounts[rating] = row.count;
                totalRatings += row.count;
                totalStars += row.count * row.rating;
              });

              const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;

              const totalCountQuery = `SELECT COUNT(*) AS total FROM shoe_review ${condition}`;
              db.query(totalCountQuery, (error, totalCountResults) => {
                if (error) {
                  console.error('Error fetching total count: ' + error);
                  res.status(500).json({ error: 'Failed to fetch total count' });
                } else {
                  const totalReviews = totalCountResults[0].total;
                  const totalPages = Math.ceil(totalReviews / parseInt(step));

                  res.status(200).json({
                    reviews: results,
                    rating_counts: ratingCounts,
                    average_rating: averageRating,
                    total_rating: totalRatings,
                    currentPage: parseInt(page),
                    step: parseInt(step),
                    totalPages: totalPages
                  });
                }
              });
            }
          });
        } else {
          res.status(200).json(results);
        }
      }
    });
  },
  // getAllReview(req, res) {
  //   const { product_id, rating, step = 10, page = 1 } = req.query;

  //   let query = 'SELECT * FROM shoe_review';
  //   let condition = '';

  //   if (product_id) {
  //     query += ` WHERE product_id = ${product_id}`;
  //     condition = `WHERE product_id = ${product_id}`;
  //   }

  //   const startIndex = (parseInt(page) - 1) * parseInt(step);
  //   query += ` LIMIT ${startIndex}, ${parseInt(step)}`;

  //   db.query(query, (error, results, fields) => {
  //     if (error) {
  //       console.error('Error fetching reviews: ' + error);
  //       res.status(500).json({ error: 'Failed to fetch reviews' });
  //     } else {
  //       if (!rating) {
  //         const ratingCountQuery = `SELECT rating, COUNT(*) AS count FROM shoe_review ${condition} GROUP BY rating`;
  //         db.query(ratingCountQuery, (error, ratingCountResults, fields) => {
  //           if (error) {
  //             console.error('Error fetching rating count: ' + error);
  //             res.status(500).json({ error: 'Failed to fetch rating count' });
  //           } else {
  //             const ratingCounts = {
  //               star1: 0,
  //               star2: 0,
  //               star3: 0,
  //               star4: 0,
  //               star5: 0
  //             };
  //             let totalRatings = 0;
  //             let totalStars = 0;

  //             ratingCountResults.forEach((row) => {
  //               const rating = `star${row.rating}`;
  //               ratingCounts[rating] = row.count;
  //               totalRatings += row.count;
  //               totalStars += row.count * row.rating;
  //             });

  //             const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;

  //             const totalCountQuery = `SELECT COUNT(*) AS total FROM shoe_review ${condition}`;
  //             db.query(totalCountQuery, (error, totalCountResults) => {
  //               if (error) {
  //                 console.error('Error fetching total count: ' + error);
  //                 res.status(500).json({ error: 'Failed to fetch total count' });
  //               } else {
  //                 const totalReviews = totalCountResults[0].total;
  //                 const totalPages = Math.ceil(totalReviews / parseInt(step));

  //                 res.status(200).json({
  //                   reviews: results,
  //                   rating_counts: ratingCounts,
  //                   average_rating: averageRating,
  //                   total_rating: totalRatings,
  //                   currentPage: parseInt(page),
  //                   step: parseInt(step),
  //                   totalPages: totalPages
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       } else {
  //         res.status(200).json(results);
  //       }
  //     }
  //   });
  // },
  // getAllReview(req, res) {
  //   const { product_id, rating, step = 10, page = 1 } = req.query;

  //   let query = 'SELECT * FROM shoe_review';
  //   let condition = '';

  //   if (product_id) {
  //     query += ` WHERE product_id = ${product_id}`;
  //     condition = `WHERE product_id = ${product_id}`;
  //   }

  //   const startIndex = (page - 1) * step;
  //   query += ` LIMIT ${startIndex}, ${step}`;

  //   db.query(query, (error, results, fields) => {
  //     if (error) {
  //       console.error('Error fetching reviews: ' + error);
  //       res.status(500).json({ error: 'Failed to fetch reviews' });
  //     } else {
  //       if (!rating) {
  //         const ratingCountQuery = `SELECT rating, COUNT(*) AS count FROM shoe_review ${condition} GROUP BY rating`;
  //         db.query(ratingCountQuery, (error, ratingCountResults, fields) => {
  //           if (error) {
  //             console.error('Error fetching rating count: ' + error);
  //             res.status(500).json({ error: 'Failed to fetch rating count' });
  //           } else {
  //             // const ratingCounts = {
  //             //   star1: 0,
  //             //   star2: 0,
  //             //   star3: 0,
  //             //   star4: 0,
  //             //   star5: 0
  //             // };
  //             // ratingCountResults.forEach((row) => {
  //             //   const rating = `star${row.rating}`;
  //             //   ratingCounts[rating] = row.count;
  //             // });
  //             // res.status(200).json({ reviews: results, rating_counts: ratingCounts });
  //             const ratingCounts = {
  //               star1: 0,
  //               star2: 0,
  //               star3: 0,
  //               star4: 0,
  //               star5: 0
  //             };
  //             let totalRatings = 0;
  //             let totalStars = 0;

  //             ratingCountResults.forEach((row) => {
  //               const rating = `star${row.rating}`;
  //               ratingCounts[rating] = row.count;
  //               totalRatings += row.count;
  //               totalStars += row.count * row.rating;
  //             });

  //             const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;

  //             res.status(200).json({ reviews: results, rating_counts: ratingCounts, average_rating: averageRating, total_rating: totalRatings });
  //           }
  //         });
  //       } else {
  //         res.status(200).json(results);
  //       }
  //     }
  //   });
  // },

  // getReview(req, res) {
  //   const { customer_id, order_detail_id } = req.query;

  //   let query = 'SELECT * FROM reviews';

  //   if (customer_id) {
  //     query += ` WHERE customer_id = ${mysql.escape(customer_id)}`;
  //   } else if (order_detail_id) {
  //     query += ` WHERE order_detail_id = ${mysql.escape(order_detail_id)}`;
  //   }

  //   db.query(query, (error, results, fields) => {
  //     if (error) {
  //       console.error('Error fetching reviews: ' + error);
  //       res.status(500).json({ error: 'Failed to fetch reviews' });
  //     } else {
  //       res.status(200).json(results);
  //     }
  //   });
  // },

  addReview(req, res) {
    const { product_id, customer_id, order_detail_id, rating, review_text } = req.body;
    const review = {
      product_id,
      customer_id,
      order_detail_id,
      rating,
      review_text,
      created_at: new Date(),
    };

    db.query('INSERT INTO shoe_review SET ?', review, (error, results, fields) => {
      if (error) {
        console.error('Error adding review: ' + error);
        res.status(500).json({ error: 'Failed to add review' });
      } else {
        console.log('Review added successfully');
        res.status(200).json({ message: 'Review added successfully', status: 200 });
      }
    });
  },

  // statusChange(req, res) {
  //   const id = req.body.id;
  //   const status_id = req.body.status_id;

  //   if (!id || !status_id) {
  //     const data = {
  //       status: 500,
  //       detail: "Invalid id or status id",
  //     };
  //     return res.status(500).json(data);
  //   }

  //   // Trường hợp status_id là 5 hoặc 6
  //   if (status_id === 5 || status_id === 6) {
  //     // Thực hiện truy vấn để lấy thông tin từ bảng shoe_order_detail
  //     db.query(
  //       `SELECT sod.product_id, sod.color_id, sod.size_id, sod.quantity
  //            FROM shoe_order_detail sod
  //            WHERE sod.order_id = ?`,
  //       [id],
  //       (err, orderDetailResults) => {
  //         if (err) {
  //           console.error("Error executing MySQL query:", err);
  //           const data = {
  //             status: 500,
  //             error: true,
  //           };
  //           res.status(500).json(data);
  //           return;
  //         }

  //         // Thực hiện cập nhật quantity trong bảng shoe_product_size
  //         orderDetailResults.forEach((orderDetail) => {
  //           const { product_id, color_id, size_id, quantity } = orderDetail;
  //           db.query(
  //             `UPDATE shoe_product_size
  //                        SET quantity = quantity + ?
  //                        WHERE product_id = ? AND color_id = ? AND size_id = ?`,
  //             [quantity, product_id, color_id, size_id],
  //             (updateErr, updateResults) => {
  //               if (updateErr) {
  //                 console.error("Error updating shoe_product_size:", updateErr);
  //                 const data = {
  //                   status: 500,
  //                   error: true,
  //                 };
  //                 res.status(500).json(data);
  //                 return;
  //               }
  //             }
  //           );
  //         });

  //         // Tiếp tục xử lý thông báo và trả về kết quả cho người dùng
  //         db.query(
  //           `SELECT n.notification_token, n.id_account 
  //                    FROM shoe_order o
  //                    JOIN shoe_customer n ON o.account_id = n.id_account
  //                    WHERE o.id = ?`,
  //           [id],
  //           (err, notificationResults) => {
  //             if (err) {
  //               console.error("Error executing MySQL query:", err);
  //               const data = {
  //                 status: 500,
  //                 error: true,
  //               };
  //               res.status(500).json(data);
  //               return;
  //             }

  //             if (notificationResults.length > 0) {
  //               const notificationToken = notificationResults[0].notification_token;
  //               const user_account_id = notificationResults[0].id_account;

  //               addNotification(user_account_id, 'Đơn hàng của bạn đã có cập nhật', `Đơn hàng có mã là: ${id} đã có cập nhật mới`, notificationToken);

  //               const data = {
  //                 status: 200,
  //                 orderDetailResults: orderDetailResults,
  //               };

  //               res.status(200).json(data);
  //             }
  //           }
  //         );
  //       }
  //     );
  //   } else {
  //     // Trường hợp status_id khác 5 và 6, chỉ cập nhật status_id trong bảng shoe_order
  //     db.query(
  //       "UPDATE shoe_order SET status_id = ? WHERE id = ?",
  //       [status_id, id],
  //       (updateErr, updateResults) => {
  //         if (updateErr) {
  //           console.error("Error executing MySQL query:", updateErr);
  //           const data = {
  //             status: 500,
  //             error: true,
  //           };
  //           res.status(500).json(data);
  //           return;
  //         }

  //         // Tiếp tục xử lý thông báo và trả về kết quả cho người dùng
  //         db.query(
  //           `SELECT n.notification_token, n.id_account 
  //                    FROM shoe_order o
  //                    JOIN shoe_customer n ON o.account_id = n.id_account
  //                    WHERE o.id = ?`,
  //           [id],
  //           (err, notificationResults) => {
  //             if (err) {
  //               console.error("Error executing MySQL query:", err);
  //               const data = {
  //                 status: 500,
  //                 error: true,
  //               };
  //               res.status(500).json(data);
  //               return;
  //             }

  //             if (notificationResults.length > 0) {
  //               const notificationToken = notificationResults[0].notification_token;
  //               const user_account_id = notificationResults[0].id_account;

  //               addNotification(user_account_id, 'Đơn hàng của bạn đã có cập nhật', `Đơn hàng có mã là: ${id} đã có cập nhật mới`, notificationToken);

  //               const data = {
  //                 status: 200,
  //               };

  //               res.status(200).json(data);
  //             }
  //           }
  //         );
  //       }
  //     );
  //   }
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

    // Trường hợp status_id là 5 hoặc 6
    if (status_id === 5 || status_id === 6) {
      // Thực hiện truy vấn để lấy thông tin từ bảng shoe_order_detail
      db.query(
        `SELECT sod.product_id, sod.color_id, sod.size_id, sod.quantity
        FROM shoe_order_detail sod
        WHERE sod.order_id = ?`,
        [id],
        (err, orderDetailResults) => {
          if (err) {
            console.error("Error executing MySQL query:", err);
            const data = {
              status: 500,
              error: true,
            };
            res.status(500).json(data);
            return;
          }

          // Thực hiện cập nhật quantity trong bảng shoe_product_size
          orderDetailResults.forEach((orderDetail) => {
            const { product_id, color_id, size_id, quantity } = orderDetail;
            db.query(
              `UPDATE shoe_product_size
              SET quantity = quantity + ?
              WHERE product_id = ? AND color_id = ? AND size_id = ?`,
              [quantity, product_id, color_id, size_id],
              (updateErr, updateResults) => {
                if (updateErr) {
                  console.error("Error updating shoe_product_size:", updateErr);
                  const data = {
                    status: 500,
                    error: true,
                  };
                  res.status(500).json(data);
                  return;
                }
              }
            );
          });

          // Tiếp tục xử lý thông báo và trả về kết quả cho người dùng
          db.query(
            `UPDATE shoe_order SET status_id = ? WHERE id = ?`,
            [status_id, id],
            (updateStatusErr, updateStatusResults) => {
              if (updateStatusErr) {
                console.error("Error updating shoe_order status:", updateStatusErr);
                const data = {
                  status: 500,
                  error: true,
                };
                res.status(500).json(data);
                return;
              }

              db.query(
                `SELECT n.notification_token, n.id_account 
              FROM shoe_order o
              JOIN shoe_customer n ON o.account_id = n.id_account
              WHERE o.id = ?`,
                [id],
                (err, notificationResults) => {
                  if (err) {
                    console.error("Error executing MySQL query:", err);
                    const data = {
                      status: 500,
                      error: true,
                    };
                    res.status(500).json(data);
                    return;
                  }

                  if (notificationResults.length > 0) {
                    const notificationToken = notificationResults[0].notification_token;
                    const user_account_id = notificationResults[0].id_account;

                    addNotification(
                      user_account_id,
                      'Đơn hàng của bạn đã có cập nhật',
                      `Đơn hàng có mã là: ${id} đã có cập nhật mới`,
                      notificationToken
                    );

                    const data = {
                      status: 200,
                      orderDetailResults: orderDetailResults,
                    };

                    res.status(200).json(data);
                  }
                }
              );
            }
          );
        }
      );
    } else {
      // Trường hợp status_id khác 5 và 6, chỉ cập nhật status_id trong bảng shoe_order
      db.query(
        "UPDATE shoe_order SET status_id = ? WHERE id = ?",
        [status_id, id],
        (updateErr, updateResults) => {
          if (updateErr) {
            console.error("Error executing MySQL query:", updateErr);
            const data = {
              status: 500,
              error: true,
            };
            res.status(500).json(data);
            return;
          }

          // Tiếp tục xử lý thông báo và trả về kết quả cho người dùng
          db.query(
            `SELECT n.notification_token, n.id_account 
                     FROM shoe_order o
                     JOIN shoe_customer n ON o.account_id = n.id_account
                     WHERE o.id = ?`,
            [id],
            (err, notificationResults) => {
              if (err) {
                console.error("Error executing MySQL query:", err);
                const data = {
                  status: 500,
                  error: true,
                };
                res.status(500).json(data);
                return;
              }

              if (notificationResults.length > 0) {
                const notificationToken = notificationResults[0].notification_token;
                const user_account_id = notificationResults[0].id_account;

                addNotification(user_account_id, 'Đơn hàng của bạn đã có cập nhật', `Đơn hàng có mã là: ${id} đã có cập nhật mới`, notificationToken);

                const data = {
                  status: 200,
                };

                res.status(200).json(data);
              }
            }
          );
        }
      );
    }
  },

//   statusChange(req, res) {
//     const id = req.body.id;
//     const status_id = req.body.status_id;
//     if (!id || !status_id) {
//       const data = {
//         status: 500,
//         detail: "Invalid id or status id",
//       };
//       return res.status(500).json(data);
//     }
//     db.query(
//       "UPDATE shoe_order SET status_id = ? WHERE id = ?",
//       [status_id, id],
//       (err, results) => {
//         if (err) {
//           console.error("Error executing MySQL query:", err);
//           const data = {
//             status: 500,
//             error: true,
//           };
//           res.status(500).json(data);
//           return;
//         }

//         db.query(`SELECT n.notification_token, n.id_account FROM shoe_order o
// JOIN shoe_customer n ON o.account_id = n.id_account
// WHERE o.id = ${id}`, (err, results) => {
//           if (err) {
//             console.error("Error executing MySQL query:", err);
//             const data = {
//               status: 500,
//               error: true,
//             };
//             res.status(500).json(data);
//             return;
//           }
//           if (results.length > 0) {
//             const notificationToken = results[0].notification_token;
//             const user_account_id = results[0].id_account;

//             addNotification(user_account_id, 'Đơn hàng của bạn đã có cập nhật', `Đơn hàng có mã là: ${id} đã có cập nhật mới`, notificationToken);
//             // Tiếp tục xử lý với notificationToken
//             const data = {
//               status: 200,
//             };
//             res.status(200).json(data);
//           }
//         });

//         // if (status_id === ) {
//         // }
//         // Gọi hàm sendNotification

//       }
//     );
//   },

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

function addNotification(accountId, title, content, notificationToken) {
  const timestamp = new Date().toISOString();
  const query = `INSERT INTO shoe_notification (account_id, title, content, timestamp)
                 VALUES (${accountId}, '${title}', '${content}', '${timestamp}')`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error adding notification:', error);
      return;
    }
    sendNotificationWithToken(
      "Có cập nhật mới",
      "Đơn hàng của bạn đã có cập nhật,Vui lòng kiểm tra thông tin đơn hàng của bạn",
      notificationToken
    ).then((response) => {
      console.log("Thông báo đã được gửi:", response);
    })
      .catch((error) => {
        console.log("Lỗi khi gửi thông báo:", error);
      });
    console.log('Notification added successfully!');
  });


}

module.exports = shoeOrderController;
