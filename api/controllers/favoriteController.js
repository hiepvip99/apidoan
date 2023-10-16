// shoeColorController.js
const db = require("../databases/db");

const shoeFavoriteController = {
  getAllShoeFavoriteProduct(req, res) {
    const accountId = req.query.account_id;
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (page - 1) * step;

    const query = `
    SELECT product_id
    FROM shoe_favorite
    WHERE account_id = ?
  `;

    db.query(query, [accountId], (err, results) => {
      if (err) throw err;
      let condition = `WHERE 1 = 1`;
      // Trả về danh sách các ID sản phẩm
      const productIds = results.map((result) => result.product_id);
      if (productIds.length === 0) {
        condition += ` AND id = 'abc'`;
        // Không có dữ liệu trong productIds
        // res.json({ message: "Không có dữ liệu productIds" });
        // return;
      } else {
        condition += ` AND id IN (${productIds.join(",")})`;
      }
      // res.json({ product_ids: productIds });
      db.query(
        `SELECT COUNT(*) AS total FROM shoe_product ${condition}`,
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
          // Truy vấn tất cả thông tin sản phẩm từ bảng shoe_product
          const getAllProductsQuery = `SELECT * FROM shoe_product ${condition} LIMIT ${offset}, ${parseInt(
            step
          )} `;

          db.query(getAllProductsQuery, (err, productResults) => {
            if (err) {
              console.error("Lỗi truy vấn dữ liệu sản phẩm: ", err);
              const data = {
                status: 500,
                datail: "Lỗi truy vấn dữ liệu sản phẩm",
              };
              res.status(500).json(data);
            } else {
              if (productResults.length === 0) {
                res.status(404).json({ error: "Không tìm thấy sản phẩm" });
              } else {
                // Tạo một mảng chứa thông tin tất cả các sản phẩm
                const allProducts = [];

                // Lặp qua từng sản phẩm trong kết quả truy vấn
                for (let i = 0; i < productResults.length; i++) {
                  const product = productResults[i];

                  // Truy vấn danh sách màu sắc của sản phẩm từ bảng shoe_product_colors
                  const getProductColorsQuery = `SELECT * FROM shoe_product_colors WHERE product_id = ${product.id}`;

                  // Truy vấn danh sách kích thước của sản phẩm từ bảng shoe_product_size
                  const getProductSizesQuery = `SELECT * FROM shoe_product_size WHERE product_id = ${product.id}`;

                  // Biến tạm lưu trữ thông tin sản phẩm, màu sắc và kích thước
                  const productWithDetails = {
                    id: product.id,
                    name: product.name,
                    manufacturer_id: product.manufacturer_id,
                    category_id: product.category_id,
                    gender: product.gender,
                    description: product.description,
                    colors: [],
                    sizes: [],
                  };

                  // Truy vấn danh sách màu sắc của sản phẩm
                  db.query(getProductColorsQuery, (err, colorResults) => {
                    if (err) {
                      console.error("Lỗi truy vấn dữ liệu màu sắc: ", err);
                      res
                        .status(500)
                        .json({ error: "Lỗi truy vấn dữ liệu màu sắc" });
                    } else {
                      // Lặp qua từng màu sắc và thêm vào mảng colors của sản phẩm
                      for (let j = 0; j < colorResults.length; j++) {
                        const color = colorResults[j];
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

                        productWithDetails.colors.push({
                          product_color_id: color.id,
                          color_id: color.color_id,
                          price: color.price,
                          images: images,
                        });
                      }

                      // Truy vấn danh sách kích thước của sản phẩm
                      db.query(getProductSizesQuery, (err, sizeResults) => {
                        if (err) {
                          console.error(
                            "Lỗi truy vấn dữ liệu kích thước: ",
                            err
                          );
                          res
                            .status(500)
                            .json({ error: "Lỗi truy vấn dữ liệu kích thước" });
                        } else {
                          // Lặp qua từng kích thước và thêm vào mảng sizes của sản phẩm
                          for (let k = 0; k < sizeResults.length; k++) {
                            const size = sizeResults[k];
                            productWithDetails.sizes.push({
                              product_size_id: size.product_size_id,
                              size_id: size.size_id,
                              color_id: size.color_id,
                              quantity: size.quantity,
                            });
                          }

                          // Thêm sản phẩm với thông tin chi tiết vào mảng allProducts
                          allProducts.push(productWithDetails);

                          // Kiểm tra xem đã lặp qua tất cả các sản phẩm chưa
                          if (allProducts.length === productResults.length) {
                            // Trả về kết quả
                            // res.json(allProducts);
                            const data = {
                              currentPage: parseInt(page),
                              step: parseInt(step),
                              totalPages: totalPages,
                              // keyword: keyword,
                              data: allProducts,
                            };
                            res.status(200).json(data);
                          }
                        }
                      });
                    }
                  });
                }
              }
            }
          });
        }
      );
    });
  },

  checkFavorite(req, res) {
  // console.log("Đã vào hàm checkFavorite");
  const accountId = req.query.account_id;
  const productId = req.query.product_id;

  if (!productId || !accountId) {
    return res.status(400).json({ error: "Missing product_id or account_id parameter" });
  }

  // console.log("accountId: ", accountId);
  const query = `
    SELECT * FROM shoe_favorite
    WHERE account_id = ? AND product_id = ?
  `;

  db.query(query, [accountId, productId], (err, result) => {
    if (err) {
      throw err;
    }

    // Trả về true nếu sản phẩm đã được yêu thích, ngược lại trả về false
    const isFavorite = result.length > 0;
    const data = {
      isFavorite: isFavorite,
      status: 200,
    };
    res.status(200).json(data);
  });
},

  // // // Controller để lấy danh sách tất cả các màu giày
  // //  getAllShoeFavoriteProduct(req, res) {
  // //   const query = "SELECT * FROM shoe_color ORDER BY name ASC";
  // //   // console.log("vao all");
  // //   // Thực hiện truy vấn
  // //   db.query(query, (error, results) => {
  // //     if (error) {
  // //       const data = {
  // //         status: 500,
  // //         error: true,
  // //       };
  // //       res.status(500).json(data);
  // //       // res.status(500).json({ error: 'Lỗi truy vấn' });
  // //     } else {
  // //       const data = {
  // //         status: 200,
  // //         data: results,
  // //       };
  // //       res.status(200).json(data);
  // //       // res.status(200).json(results);
  // //     }
  // //   });
  // // },

  // // Controller để lấy một màu giày dựa trên ID
  // getShoeColorById(req, res) {
  //   const id = req.params.id;
  //   const query = "SELECT * FROM shoe_color WHERE id = ?";

  //   // Thực hiện truy vấn
  //   db.query(query, [id], (error, results) => {
  //     if (error) {
  //       // res.status(500).json({ error: 'Lỗi truy vấn' });
  //       const data = {
  //         status: 500,
  //         error: true,
  //       };
  //       res.status(500).json(data);
  //     } else {
  //       if (results.length === 0) {
  //         res.status(404).json({ error: "Không tìm thấy màu giày" });
  //       } else {
  //         const data = {
  //           status: 200,
  //           object: results[0],
  //         };
  //         res.status(200).json(data);
  //         // res.status(200).json(results[0]);
  //       }
  //     }
  //   });
  // },

  // Controller để tạo một màu giày mới
  createFavorite(req, res) {
    const accountId = req.body.account_id;
    const productId = req.body.product_id;

    // console.log("accountId: ", accountId);
    const selectQuery = `
    SELECT * FROM shoe_favorite WHERE account_id = ? AND product_id = ?
  `;

    const insertQuery = `
    INSERT INTO shoe_favorite (account_id, product_id) VALUES (?, ?)
  `;

    db.query(selectQuery, [accountId, productId], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        // Nếu đã có record trong database, không thực hiện thêm gì cả
        const data = {
          status: 200,
          message: "Record already exists in database",
        };
        res.status(200).json(data);
      } else {
        // Nếu chưa có record trong database, thực hiện việc thêm mới
        db.query(insertQuery, [accountId, productId], (err, result) => {
          if (err) throw err;

          // Trả về kết quả thành công
          const data = {
            status: 200,
            message: "Record added to database",
          };
          res.status(200).json(data);
        });
      }
    });
  },

  // // Controller để cập nhật một màu giày dựa trên ID
  //  updateShoeColor(req, res) {
  //   const favoriteId = req.params.id;
  //   const updatedProductId = req.body.product_id;

  //   const query = `
  //     UPDATE shoe_favorite
  //     SET product_id = ?
  //     WHERE id = ?
  //   `;

  //   db.query(query, [updatedProductId, favoriteId], (err, result) => {
  //     if (err) throw err;

  //     // Trả về kết quả thành công hoặc thông báo lỗi nếu có
  //     res.json({ success: true });
  //   });
  // },

  // Controller để xóa một màu giày dựa trên ID
  deleteFavorite(req, res) {
    const shoeFavorite = req.body; // Danh sách các cặp account_id và product_id

    shoeFavorite.forEach((shoeColor) => {
      const accountId = shoeColor.account_id;
      const productId = shoeColor.product_id;

      const query = `
      DELETE FROM shoe_favorite
      WHERE account_id = ? AND product_id = ?
    `;

      db.query(query, [accountId, productId], (err, result) => {
        if (err) throw err;
      });
    });

    // Trả về kết quả thành công hoặc thông báo lỗi nếu có
    const data = {
      status: 200,
      message: "Deleted successfully",
    };
    res.status(200).json(data);
  },
};

// Export các phương thức của controller
module.exports = shoeFavoriteController;
