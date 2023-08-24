const db = require("../databases/db");

const ShoeController = {
  getAllCategories(req, res) {
    db.query("SELECT * FROM shoe_category", (error, results) => {
      if (error) {
        console.error("Error retrieving categories: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(results);
    });
  },

  getCategoryById(req, res) {
    const categoryId = req.params.id;
    db.query(
      "SELECT * FROM shoe_category WHERE id = ?",
      [categoryId],
      (error, results) => {
        if (error) {
          console.error("Error retrieving category: ", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Category not found" });
        }
        res.json(results[0]);
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
        res.status(500).json({ error: "Failed to create category" });
      } else {
        console.log("Category created successfully");
        res.status(200).json({ message: "Category created successfully" });
      }
    });
  },

  updateCategory(req, res) {
    const categoryId = req.params.id;
    const { name } = req.body;
    db.query(
      "UPDATE shoe_category SET name = ? WHERE id = ?",
      [name, categoryId],
      (error) => {
        if (error) {
          console.error("Error updating category: ", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ id: categoryId, name });
      }
    );
  },

  deleteCategory(req, res) {
    const categoryId = req.params.id;
    db.query(
      "DELETE FROM shoe_category WHERE id = ?",
      [categoryId],
      (error) => {
        if (error) {
          console.error("Error deleting category: ", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ message: "Category deleted successfully" });
      }
    );
  },
};

module.exports = ShoeController;
