const db = require("../databases/db");

const upload = require("../uploadHelper");

const shoeProductController = {
  // getById(req, res) {
  //   const id = req.query.id;
  //   // Truy vấn thông tin sản phẩm từ bảng shoe_product
  //   const getProductQuery = `SELECT * FROM shoe_product WHERE id = ${id}`;

  //   db.query(getProductQuery, (err, productResults) => {
  //     if (err) {
  //       console.error("Lỗi truy vấn dữ liệu sản phẩm: ", err);
  //       res.status(500).json({ error: "Lỗi truy vấn dữ liệu sản phẩm" });
  //     } else {
  //       if (productResults.length === 0) {
  //         res.status(404).json({ error: "Không tìm thấy sản phẩm" });
  //       } else {
  //         const product = productResults[0];

  //         // Truy vấn danh sách màu sắc của sản phẩm từ bảng shoe_product_colors
  //         const getProductColorsQuery = `SELECT * FROM shoe_product_colors WHERE product_id = ${id}`;

  //         db.query(getProductColorsQuery, (err, colorResults) => {
  //           if (err) {
  //             console.error("Lỗi truy vấn dữ liệu màu sắc: ", err);
  //             res.status(500).json({ error: "Lỗi truy vấn dữ liệu màu sắc" });
  //           } else {
  //             const colors = colorResults.map((color) => ({
  //               color_id: color.color_id,
  //               price: color.price,
  //               images: [],
  //             }));

  //             // Truy vấn danh sách kích thước của sản phẩm từ bảng shoe_product_size
  //             const getProductSizesQuery = `SELECT * FROM shoe_product_size WHERE product_id = ${id}`;

  //             db.query(getProductSizesQuery, (err, sizeResults) => {
  //               if (err) {
  //                 console.error("Lỗi truy vấn dữ liệu kích thước: ", err);
  //                 res
  //                   .status(500)
  //                   .json({ error: "Lỗi truy vấn dữ liệu kích thước" });
  //               } else {
  //                 const sizes = sizeResults.map((size) => ({
  //                   product_size_id: size.product_size_id,
  //                   size_id: size.size_id,
  //                   color_id: size.color_id,
  //                   quantity: size.quantity,
  //                 }));

  //                 // Kết hợp thông tin sản phẩm, màu sắc và kích thước vào một đối tượng
  //                 const productWithDetails = {
  //                   id: product.id,
  //                   name: product.name,
  //                   manufacturer_id: product.manufacturer_id,
  //                   category_id: product.category_id,
  //                   gender: product.gender,
  //                   colors,
  //                   sizes,
  //                 };

  //                 // Trả về kết quả
  //                 res.json(productWithDetails);
  //               }
  //             });
  //           }
  //         });
  //       }
  //     }
  //   });
  // },

  getProductById(req, res) {
    const productId = req.query.id;

    // Truy vấn thông tin sản phẩm từ bảng shoe_product dựa trên product_id
    const getProductQuery = `SELECT * FROM shoe_product WHERE id = ${productId}`;

    db.query(getProductQuery, (err, productResults) => {
      if (err) {
        console.error("Lỗi truy vấn dữ liệu sản phẩm: ", err);
        res.status(500).json({ error: "Lỗi truy vấn dữ liệu sản phẩm" });
      } else {
        if (productResults.length === 0) {
          res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        } else {
          const product = productResults[0];

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
            colors: [],
            sizes: [],
          };

          // Truy vấn danh sách màu sắc của sản phẩm
          db.query(getProductColorsQuery, (err, colorResults) => {
            if (err) {
              console.error("Lỗi truy vấn dữ liệu màu sắc: ", err);
              res.status(500).json({ error: "Lỗi truy vấn dữ liệu màu sắc" });
            } else {
              // Lặp qua từng màu sắc và thêm vào mảng colors của sản phẩm
              for (let j = 0; j < colorResults.length; j++) {
                const color = colorResults[j];
                let images = [];

                if (color.images) {
                  const fixedImages = color.images.replace(/\\/g, "\\\\");
                  const imageUrlsArray = JSON.parse(fixedImages);
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
                  console.error("Lỗi truy vấn dữ liệu kích thước: ", err);
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

                  // Trả về thông tin sản phẩm với chi tiết
                  res.status(200).json(productWithDetails);
                }
              });
            }
          });
        }
      }
    });
  },

  // getAll(req, res) {
  //   const page = req.params.page || 1;
  //   const step = req.params.step || 10;
  //   const offset = (page - 1) * step;
  //   const keyword = req.params.keyword || "";
  //   db.query(
  //     "SELECT COUNT(*) AS total FROM shoe_product",
  //     (err, countResult) => {
  //       if (err) {
  //         console.error("Error executing MySQL query:", err);
  //         const data = {
  //           status: 500,
  //           error: true,
  //         };
  //         res.status(500).json(data);
  //         return;
  //       }
  //       const total = countResult[0].total;
  //       const totalPages = Math.ceil(total / step);
  //       db.query(
  //         `SELECT * FROM shoe_product where name like
  //     '${`%${keyword}%`}' LIMIT ${offset}, ${parseInt(step)} `,
  //         (err, results) => {
  //           if (err) {
  //             console.error("Error executing MySQL query:", err);
  //             const data = {
  //               status: 500,
  //               error: true,
  //               detail: "Failed to fetch shoe manufacturers",
  //             };
  //             res.status(500).json(data);
  //             return;
  //           }
  //           const data = {
  //             currentPage: parseInt(page),
  //             step: parseInt(step),
  //             totalPages: totalPages,
  //             data: results,
  //           };
  //           res.status(200).json(data);
  //         }
  //       );
  //     }
  //   );
  // },

  getAllProduct(req, res) {
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (page - 1) * step;
    // search by :
    const keyword = req.query.keyword || "";
    const manufacturerId = req.query.manufacturerId;
    const categoryId = req.query.categoryId;
    const gender = req.query.gender;

    let condition = `WHERE 1 = 1`;

    if (keyword) {
      condition += ` AND name LIKE '%${keyword}%'`;
    }
    if (manufacturerId) {
      condition += ` AND manufacturer_id = ${manufacturerId}`;
    }
    if (categoryId) {
      condition += ` AND category_id = ${categoryId}`;
    }
    if (gender) {
      condition += ` AND gender = '%${gender}%'`;
    }

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
            res.status(500).json({ error: "Lỗi truy vấn dữ liệu sản phẩm" });
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
                        const fixedImages = color.images.replace(/\\/g, "\\\\");
                        const imageUrlsArray = JSON.parse(fixedImages);
                        console.log(imageUrlsArray);
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
                        console.error("Lỗi truy vấn dữ liệu kích thước: ", err);
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
                            keyword: keyword,
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
  },

  // add(req, res) {
  //   const { name, manufacturer_id, category_id, gender} = req.body;
  //   db.query(
  //     `INSERT INTO shoe_product (name, manufacturer_id, category_id, gender) VALUES (${name}, ${manufacturer_id},${category_id},${gender})`,

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
  //       const newProduct = {
  //         status: 200,
  //       };
  //       res.status(200).json(newProduct);
  //     }
  //   );
  // },

  addProduct(req, res) {
    // upload.array("images")(req, res, function (err) {
    const {
      name,
      manufacturer_id,
      category_id,
      gender,
      product_size,
      product_color,
    } = req.body;
    // const product_color = req.files.;

    console.log("product_color: ", product_color);
    console.log("req.files: ", req.files);

    // const imageUrls = Object.values(req.files).map((file) => file.path);
    // Kiểm tra các trường thông tin bắt buộc của sản phẩm
    if (!name || !manufacturer_id || !category_id || !gender) {
      res.status(400).json({ error: "Thiếu thông tin bắt buộc của sản phẩm" });
      return;
    }

    // Tạo truy vấn để thêm sản phẩm mới vào bảng `shoe_product`
    const addProductQuery = `
    INSERT INTO shoe_product (name, manufacturer_id, category_id, gender)
    VALUES ('${name}', ${manufacturer_id}, ${category_id}, '${gender}')
  `;

    db.query(addProductQuery, (err, productResult) => {
      if (err) {
        console.error("Lỗi thêm sản phẩm mới: ", err);
        res.status(500).json({ error: "Lỗi thêm sản phẩm mới" });
      } else {
        const newProductId = productResult.insertId;

        if (!product_color || product_color.length === 0) {
          // Nếu không có thông tin về màu sắc, trả về ID của sản phẩm mới
          res.json({ id: newProductId });
          return;
        }

        console.log("product_color: ", product_color);
        // Tạo mảng chứa các truy vấn để thêm thông tin màu sắc vào bảng `shoe_product_colors`
        const addColorQueries = product_color.map((color) => {
          return `
          INSERT INTO shoe_product_colors (product_id, color_id, price)
          VALUES (${newProductId}, ${color.color_id}, ${color.price})
        `;
        });

        // Thực hiện lần lượt các truy vấn thêm thông tin màu sắc
        addColorQueries.forEach((query) => {
          db.query(query, (err) => {
            if (err) {
              console.error("Lỗi thêm thông tin màu sắc mới: ", err);
            }
          });
        });

        if (!product_size || product_size.length === 0) {
          // Nếu không có thông tin về kích cỡ, trả về ID của sản phẩm mới
          res.json({ id: newProductId });
          return;
        }

        // Tạo mảng chứa các truy vấn để thêm thông tin kích cỡ vào bảng `shoe_product_size`
        const addSizeQueries = product_size.map((size) => {
          return `
          INSERT INTO shoe_product_size (product_id, size_id, color_id, quantity)
          VALUES (${newProductId}, ${size.size_id}, ${size.color_id}, ${size.quantity})
        `;
        });

        // Thực hiện lần lượt các truy vấn thêm thông tin kích cỡ
        addSizeQueries.forEach((query) => {
          db.query(query, (err) => {
            if (err) {
              console.error("Lỗi thêm thông tin kích cỡ mới: ", err);
            }
          });
        });

        // Trả về ID của sản phẩm mới
        res.json({ id: newProductId });
      }
    });
    // });
  },

  //   update(req, res) {
  //     upload.array("images")(req, res, function (err) {
  //       const {
  //         id,
  //         name,
  //         manufacturer_id,
  //         category_id,
  //         gender,
  //         product_size,
  //         product_color,
  //       } = req.body;
  //       // const product_color = req.files.;

  //       console.log("product_color: ", product_color);
  //       console.log("req.files: ", req.files);

  //       const imageUrls = Object.values(req.files).map((file) => file.path);
  //       // Kiểm tra các trường thông tin bắt buộc của sản phẩm
  //       if (!id || !name || !manufacturer_id || !category_id || !gender) {
  //         res
  //           .status(400)
  //           .json({ error: "Thiếu thông tin bắt buộc của sản phẩm" });
  //         return;
  //       }

  //       // Tạo truy vấn để thêm sản phẩm mới vào bảng `shoe_product`
  //       //     const addProductQuery = `
  //       //   INSERT INTO shoe_product (name, manufacturer_id, category_id, gender)
  //       //   VALUES ('${name}', ${manufacturer_id}, ${category_id}, '${gender}')
  //       // `;
  //       const updateProductQuery = `
  //     UPDATE shoe_product
  //     SET name = '${name}', manufacturer_id = ${manufacturer_id}, category_id = ${category_id}, gender = '${gender}'
  //     WHERE id = ${id}
  // `;

  //       db.query(updateProductQuery, (err, productResult) => {
  //         if (err) {
  //           console.error("Lỗi sửa sản phẩm mới: ", err);
  //           return res.status(500).json({ error: "Lỗi sửa sản phẩm mới" });
  //         } else {
  //           console.log("product_color: ", product_color);
  //           // Tạo mảng chứa các truy vấn để thêm thông tin màu sắc vào bảng `shoe_product_colors`
  //           const addColorQueries = product_color.map((color) => {
  //             return `
  //           INSERT INTO shoe_product_colors (product_id, color_id, price, images)
  //           VALUES (${id}, ${color.color_id}, ${
  //               color.price
  //             }, '${JSON.stringify(imageUrls)}')
  //         `;
  //           });

  //           // Thực hiện lần lượt các truy vấn thêm thông tin màu sắc
  //           addColorQueries.forEach((query) => {
  //             db.query(query, (err) => {
  //               if (err) {
  //                 console.error("Lỗi thêm thông tin màu sắc mới: ", err);
  //               }
  //             });
  //           });

  //           if (!product_size || product_size.length === 0) {
  //             // Nếu không có thông tin về kích cỡ, trả về ID của sản phẩm mới
  //             res.json({ id: id });
  //             return;
  //           }

  //           // Tạo mảng chứa các truy vấn để thêm thông tin kích cỡ vào bảng `shoe_product_size`
  //           const addSizeQueries = product_size.map((size) => {
  //             return `
  //           INSERT INTO shoe_product_size (product_id, size_id, color_id, quantity)
  //           VALUES (${id}, ${size.size_id}, ${size.color_id}, ${size.quantity})
  //         `;
  //           });

  //           // Thực hiện lần lượt các truy vấn thêm thông tin kích cỡ
  //           addSizeQueries.forEach((query) => {
  //             db.query(query, (err) => {
  //               if (err) {
  //                 console.error("Lỗi thêm thông tin kích cỡ mới: ", err);
  //               }
  //             });
  //           });

  //           // Trả về ID của sản phẩm mới
  //           res.status(200).json({ id: id , status:200, detail: "update thành công"});
  //         }
  //       });
  //     });
  //   },

  updateProduct(req, res) {
    const {
      id,
      name,
      manufacturer_id,
      category_id,
      gender,
      product_size,
      product_color,
    } = req.body;

    // Kiểm tra trường thông tin bắt buộc `id` của sản phẩm
    if (!id) {
      res.status(400).json({ error: "Thiếu thông tin bắt buộc của sản phẩm" });
      return;
    }

    // Tạo truy vấn để cập nhật thông tin sản phẩm trong bảng `shoe_product`
    const updateProductQuery = `
    UPDATE shoe_product
    SET name = '${name}', manufacturer_id = ${manufacturer_id}, category_id = ${category_id}, gender = '${gender}'
    WHERE id = ${id}
  `;

    db.query(updateProductQuery, (err, productResult) => {
      if (err) {
        console.error("Lỗi cập nhật thông tin sản phẩm: ", err);
        res.status(500).json({ error: "Lỗi cập nhật thông tin sản phẩm" });
      } else {
        if (!product_color || product_color.length === 0) {
          // Nếu không có thông tin về màu sắc, trả về kết quả thành công
          res.json({ success: true });
          return;
        }

        // Tạo mảng chứa các truy vấn để cập nhật thông tin màu sắc trong bảng `shoe_product_colors`
        const updateColorQueries = product_color.map((color) => {
          return `
          UPDATE shoe_product_colors
          SET price = ${color.price}
          WHERE product_id = ${id} AND color_id = ${color.color_id}
        `;
        });

        // Thực hiện lần lượt các truy vấn cập nhật thông tin màu sắc
        updateColorQueries.forEach((query) => {
          db.query(query, (err) => {
            if (err) {
              console.error("Lỗi cập nhật thông tin màu sắc: ", err);
            }
          });
        });
      }
    });

    if (!product_size || product_size.length === 0) {
      // Nếu không có thông tin về kích cỡ, trả về kết quả thành công
      res.json({ success: true });
      return;
    }

    // Tạo mảng chứa các truy vấn để cập nhật thông tin kích cỡ trong bảng `shoe_product_size`
    const updateSizeQueries = product_size.map((size) => {
      return `
      UPDATE shoe_product_size
      SET quantity = ${size.quantity}
      WHERE product_id = ${id} AND size_id = ${size.size_id} AND color_id = ${size.color_id}
    `;
    });

    // Thực hiện lần lượt các truy vấn cập nhật thông tin kích cỡ
    updateSizeQueries.forEach((query) => {
      db.query(query, (err) => {
        if (err) {
          console.error("Lỗi cập nhật thông tin kích cỡ: ", err);
        }
      });
    });

    // Trả về kết quả thành công
    res.json({ success: true });
  },

  delete(req, res) {
    const id = req.query.id;

    // Xóa các bản ghi trong bảng shoe_product_colors có product_id tương ứng
    db.query(
      "DELETE FROM shoe_product_colors WHERE product_id = ?",
      [id],
      (err, results) => {
        if (err) {
          const data = {
            status: 500,
            error: true,
            detail:
              "do not delete record in shoe_product_colors WHERE product_id",
          };
          res.status(500).json(data);
          return;
        }

        // Xóa các bản ghi trong bảng shoe_product_size có product_id tương ứng
        db.query(
          "DELETE FROM shoe_product_size WHERE product_id = ?",
          [id],
          (err, results) => {
            if (err) {
              const data = {
                status: 500,
                error: true,
                detail:
                  "do not delete record in shoe_product_colors WHERE product_id",
              };
              res.status(500).json(data);
              return;
            }

            // Sau khi xóa các bản ghi liên quan, tiếp tục xóa bản ghi trong bảng shoe_product
            db.query(
              "DELETE FROM shoe_product WHERE id = ?",
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
          }
        );
      }
    );
  },

  updateImageProduct(req, res) {
    upload.array("images")(req, res, function (err) {
      if (err) {
        console.log("error", err);
      }
      const product_id = req.body.product_id;
      const color_id = req.body.color_id;
      if (!product_id || !color_id) {
        return res
          .status(500)
          .json({ status: 500, detail: "invalid  product_id or color_id" });
      }
      console.log("req.files: ", req.files);
      const imageUrls = req.files.map((file) => `api/image/${file.filename}`);
      // const imageUrls = Object.values(req.files).map((file) => file.path);
      const updateQuery = `UPDATE shoe_product_colors SET images = ? WHERE product_id = ? AND color_id = ?`;

      // Thực hiện truy vấn cập nhật dữ liệu trong cơ sở dữ liệu

      db.query(
        updateQuery,
        [JSON.stringify(imageUrls), product_id, color_id],
        (error, results, fields) => {
          if (error) {
            console.error("Lỗi khi cập nhật dữ liệu: ", error);
            res
              .status(500)
              .json({ message: "Lỗi khi cập nhật dữ liệu", status: 500 });
          } else {
            res
              .status(200)
              .json({ message: "Cập nhật thành công", status: 200 });
          }
        }
      );
    });
  },

  updateProductSize(req, res) {
    const { productSizeId, productId, sizeId, colorId, quantity } = req.body;

    // Kiểm tra nếu productSizeId không được cung cấp
    if (!productSizeId) {
      res.status(400).json({ error: "Thiếu thông tin productSizeId" });
      return;
    }

    // Truy vấn cập nhật thông tin kích thước sản phẩm
    const updateProductSizeQuery = `UPDATE shoe_product_size SET 
    product_id = ${productId},
    size_id = ${sizeId},
    color_id = ${colorId},
    quantity = ${quantity}
    WHERE product_size_id = ${productSizeId}`;

    db.query(updateProductSizeQuery, (err, result) => {
      if (err) {
        console.error("Lỗi cập nhật thông tin kích thước: ", err);
        res.status(500).json({ error: "Lỗi cập nhật thông tin kích thước" });
      } else {
        res
          .status(200)
          .json({ message: "Cập nhật thông tin kích thước thành công" });
      }
    });
  },

  updateProductColor(req, res) {
    const { id, productId, colorId, price } = req.body;

    // Kiểm tra nếu id không được cung cấp
    if (!id) {
      res.status(400).json({ error: "Thiếu thông tin id" });
      return;
    }

    // Truy vấn cập nhật thông tin màu sắc sản phẩm
    const updateProductColorQuery = `UPDATE shoe_product_colors SET 
    product_id = ${productId},
    color_id = ${colorId},
    price = ${price},
    WHERE id = ${id}`;

    db.query(updateProductColorQuery, (err, result) => {
      if (err) {
        console.error("Lỗi cập nhật thông tin màu sắc: ", err);
        res.status(500).json({ error: "Lỗi cập nhật thông tin màu sắc" });
      } else {
        res
          .status(200)
          .json({ message: "Cập nhật thông tin màu sắc thành công" });
      }
    });
  },

  deleteProductSize(req, res) {
    const { colorId, sizeId, productId } = req.query;

    // Kiểm tra nếu colorId, sizeId hoặc productId không được cung cấp
    if (!colorId || !sizeId || !productId) {
      res
        .status(400)
        .json({ error: "Thiếu thông tin colorId, sizeId hoặc productId" });
      return;
    }

    // Truy vấn xóa thông tin kích thước sản phẩm
    const deleteProductSizeQuery = `DELETE FROM shoe_product_size 
    WHERE color_id = ${colorId} AND size_id = ${sizeId} AND product_id = ${productId}`;

    db.query(deleteProductSizeQuery, (err, result) => {
      if (err) {
        console.error("Lỗi xóa thông tin kích thước: ", err);
        res.status(500).json({ error: "Lỗi xóa thông tin kích thước" });
      } else {
        res
          .status(200)
          .json({ message: "Xóa thông tin kích thước thành công" });
      }
    });
  },

  deleteProductColor(req, res) {
    const { productId, colorId } = req.query;

    // Kiểm tra nếu productId hoặc colorId không được cung cấp
    if (!productId || !colorId) {
      res.status(400).json({ error: "Thiếu thông tin productId hoặc colorId" });
      return;
    }

    // Truy vấn xóa thông tin màu sắc sản phẩm
    const deleteProductColorQuery = `DELETE FROM shoe_product_colors 
    WHERE product_id = ${productId} AND color_id = ${colorId}`;

    db.query(deleteProductColorQuery, (err, result) => {
      if (err) {
        console.error("Lỗi xóa thông tin màu sắc: ", err);
        res.status(500).json({ error: "Lỗi xóa thông tin màu sắc" });
      } else {
        res.status(200).json({ message: "Xóa thông tin màu sắc thành công" });
      }
    });
  },

  deleteProductSize(req, res) {
    const { colorId, sizeId, productId } = req.query;

    // Kiểm tra nếu colorId, sizeId hoặc productId không được cung cấp
    if (!colorId || !sizeId || !productId) {
      res
        .status(400)
        .json({ error: "Thiếu thông tin colorId, sizeId hoặc productId" });
      return;
    }

    // Truy vấn xóa thông tin kích thước sản phẩm
    const deleteProductSizeQuery = `DELETE FROM shoe_product_size 
    WHERE color_id = ${colorId} AND size_id = ${sizeId} AND product_id = ${productId}`;

    db.query(deleteProductSizeQuery, (err, result) => {
      if (err) {
        console.error("Lỗi xóa thông tin kích thước: ", err);
        res.status(500).json({ error: "Lỗi xóa thông tin kích thước" });
      } else {
        res
          .status(200)
          .json({ message: "Xóa thông tin kích thước thành công" });
      }
    });
  },

  deleteProductColor(req, res) {
    const { productId, colorId } = req.query;

    // Kiểm tra nếu productId hoặc colorId không được cung cấp
    if (!productId || !colorId) {
      res.status(400).json({ error: "Thiếu thông tin productId hoặc colorId" });
      return;
    }

    // Truy vấn xóa thông tin màu sắc sản phẩm
    const deleteProductColorQuery = `DELETE FROM shoe_product_colors 
    WHERE product_id = ${productId} AND color_id = ${colorId}`;

    db.query(deleteProductColorQuery, (err, result) => {
      if (err) {
        console.error("Lỗi xóa thông tin màu sắc: ", err);
        res.status(500).json({ error: "Lỗi xóa thông tin màu sắc" });
      } else {
        res.status(200).json({ message: "Xóa thông tin màu sắc thành công" });
      }
    });
  },

  createProductSize(req, res) {
    const { productId, sizeId, colorId, quantity } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!productId || !sizeId || !colorId || !quantity) {
      res.status(400).json({ error: "Thiếu thông tin cần thiết" });
      return;
    }

    // Truy vấn thêm thông tin kích thước sản phẩm
    const insertProductSizeQuery = `INSERT INTO shoe_product_size (product_id, size_id, color_id, quantity) 
    VALUES (${productId}, ${sizeId}, ${colorId}, ${quantity})`;

    db.query(insertProductSizeQuery, (err, result) => {
      if (err) {
        console.error("Lỗi thêm thông tin kích thước: ", err);
        res.status(500).json({ error: "Lỗi thêm thông tin kích thước" });
      } else {
        res
          .status(200)
          .json({ message: "Thêm thông tin kích thước thành công" });
      }
    });
  },

  createProductColor(req, res) {
    const { productId, colorId, price, images } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!productId || !colorId || !price || !images) {
      res.status(400).json({ error: "Thiếu thông tin cần thiết" });
      return;
    }

    // Truy vấn thêm thông tin màu sắc sản phẩm
    const insertProductColorQuery = `INSERT INTO shoe_product_colors (product_id, color_id, price, images) 
    VALUES (${productId}, ${colorId}, ${price}, '${JSON.stringify(images)}')`;

    db.query(insertProductColorQuery, (err, result) => {
      if (err) {
        console.error("Lỗi thêm thông tin màu sắc: ", err);
        res.status(500).json({ error: "Lỗi thêm thông tin màu sắc" });
      } else {
        res.status(200).json({ message: "Thêm thông tin màu sắc thành công" });
      }
    });
  },
};

module.exports = shoeProductController;
