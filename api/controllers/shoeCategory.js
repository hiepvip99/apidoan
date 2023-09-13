const db = require("../databases/db");

const ShoeController = {
  getAllCategories(req, res) {
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (page - 1) * step;
    const keyword = req.query.keyword || "";
    console.log("keyword:", keyword);
    db.query(
      "SELECT COUNT(*) AS total FROM shoe_category",
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
        db.query(
          `SELECT * FROM shoe_category where name like 
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

  getCategoryById(req, res) {
    const categoryId = req.query.id;
    db.query(
      "SELECT * FROM shoe_category WHERE id = ?",
      [categoryId],
      (error, results) => {
        if (error) {
          console.error("Error retrieving category: ", error);
          const data = {
            status: 500,
            detail: "Internal server error",
          };
          return res.status(500).json(data);
          // return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
          const data = {
            status: 404,
            detail: "Category not found",
          };
          return res.status(404).json(data);
          // return res.status(404).json({ error: "Category not found" });
        }
        const data = {
          status: 200,
          object: results[0],
        };
        res.status(200).json(data);
      }
    );
  },

  createCategory(req, res) {
    const { name } = req.body;
    // const name = req.body.name;
    console.log("name : ", req.body.name);
    const sql = "INSERT INTO shoe_category SET ?";
    db.query(sql, [ {name:name}], (error, result) => {
      if (error) {
        console.error("Error creating category:", error);
        // res.status(500).json({ error: "Failed to create category" });
        const data = {
          status: 500,
          detail: "Failed to create category",
        };
        return res.status(500).json(data);
      } else {
        console.log("Category created successfully");
        const data = {
          status: 200,
          detail: "Category created successfully",
        };
        return res.status(200).json(data);
        // res.status(200).json({ message: "Category created successfully" });
      }
    });
  },

  updateCategory(req, res) {
    const categoryId = req.body.id;
    const name = req.body.name;
    db.query(
      "UPDATE shoe_category SET name = ? WHERE id = ?",
      [name, categoryId],
      (error) => {
        if (error) {
          console.error("Error updating category: ", error);
          const data = {
            status: 500,
            detail: "Internal server error",
          };
          return res.status(500).json(data);
          // return res.status(500).json({ error: "Internal server error" });
        }
        const data = {
          status: 200,
          detail: "Category updated successfully",
        };
        return res.status(200).json(data);
        // res.json({ id: categoryId, name });
      }
    );
  },

  deleteCategory(req, res) {
    const categoryId = req.body.id;
    db.query(
      "DELETE FROM shoe_category WHERE id = ?",
      [categoryId],
      (error) => {
        if (error) {
          console.error("Error deleting category: ", error);
          const data = {
            status: 500,
            detail: "Internal server error",
          };
          return res.status(500).json(data);
          // return res.status(500).json({ error: "Internal server error" });
        }
        const data = {
          status: 200,
          detail: "Category delete successfully",
        };
        return res.status(200).json(data);
      }
    );
  },
};

module.exports = ShoeController;
