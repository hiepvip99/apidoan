const db = require("../databases/db");

const shoeStatisticController = {
  getStatisticByWeekly(req, res) {
    const { fromday, today } = req.query;

    const query = `
    SELECT
  DATE(order_date) AS day,
  SUM(total_price) AS revenue
FROM
  shoe_order
WHERE
  order_date BETWEEN '${fromday}' AND '${today}'
GROUP BY
  DATE(order_date);
  `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    });
  },

  getStatisticByMonthly(req, res) {
    const { month, year } = req.query;

    const query = `
    SELECT
      DATE(order_date) AS date,
      SUM(total_price) AS revenue
    FROM
      shoe_order
    WHERE
      MONTH(order_date) = ${month}
      AND YEAR(order_date) = ${year}
    GROUP BY
      DATE(order_date)
    ORDER BY
      order_date ASC;
  `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.status(200).json(results);
    });
  },
};

module.exports = shoeStatisticController;
