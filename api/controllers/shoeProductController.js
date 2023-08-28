const db = require("../databases/db");

const shoeProductController = {
  getById(req, res) {
    const id = req.params.id;
    // Truy vấn thông tin sản phẩm từ bảng shoe_product
    const getProductQuery = `SELECT * FROM shoe_product WHERE id = ${id}`;

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
          const getProductColorsQuery = `SELECT * FROM shoe_product_colors WHERE product_id = ${id}`;

          db.query(getProductColorsQuery, (err, colorResults) => {
            if (err) {
              console.error("Lỗi truy vấn dữ liệu màu sắc: ", err);
              res.status(500).json({ error: "Lỗi truy vấn dữ liệu màu sắc" });
            } else {
              const colors = colorResults.map((color) => ({
                color_id: color.color_id,
                price: color.price,
              }));

              // Truy vấn danh sách kích thước của sản phẩm từ bảng shoe_product_size
              const getProductSizesQuery = `SELECT * FROM shoe_product_size WHERE product_id = ${id}`;

              db.query(getProductSizesQuery, (err, sizeResults) => {
                if (err) {
                  console.error("Lỗi truy vấn dữ liệu kích thước: ", err);
                  res
                    .status(500)
                    .json({ error: "Lỗi truy vấn dữ liệu kích thước" });
                } else {
                  const sizes = sizeResults.map((size) => ({
                    product_size_id: size.product_size_id,
                    size_id: size.size_id,
                    color_id: size.color_id,
                    quantity: size.quantity,
                  }));

                  // Kết hợp thông tin sản phẩm, màu sắc và kích thước vào một đối tượng
                  const productWithDetails = {
                    id: product.id,
                    name: product.name,
                    manufacturer_id: product.manufacturer_id,
                    category_id: product.category_id,
                    gender: product.gender,
                    colors,
                    sizes,
                  };

                  // Trả về kết quả
                  res.json(productWithDetails);
                }
              });
            }
          });
        }
      }
    });
  },

  getAll(req, res) {
    const page = req.params.page || 1;
    const step = req.params.step || 10;
    const offset = (page - 1) * step;
    const keyword = req.params.keyword || "";
    db.query(
      "SELECT COUNT(*) AS total FROM shoe_product",
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
          `SELECT * FROM shoe_product where name like 
      '${`%${keyword}%`}' LIMIT ${offset}, ${parseInt(step)} `,
          (err, results) => {
            if (err) {
              console.error("Error executing MySQL query:", err);
              const data = {
                status: 500,
                error: true,
                detail: "Failed to fetch shoe manufacturers",
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
      "INSERT INTO shoe_product (name) VALUES (?)",
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
        const newProduct = {
          status: 200,
        };
        res.status(200).json(newProduct);
      }
    );
  },

  update(req, res) {
    const id = req.body.id;
    const name = req.body.name;

    db.query(
      "UPDATE shoe_product SET name = ? WHERE id = ?",
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
    db.query("DELETE FROM shoe_product WHERE id = ?", [id], (err, results) => {
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
    });
  },
};

module.exports = shoeProductController;
