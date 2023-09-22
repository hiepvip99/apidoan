const db = require("../databases/db");

const shoeStatisticController = {
  getStatisticByWeekly(req, res) {
//     const { fromday, today } = req.query;

//     const query = `
//     SELECT
//   DATE(order_date) AS day,
//   SUM(total_price) AS revenue
// FROM
//   shoe_order
// WHERE
//   order_date BETWEEN '${fromday}' AND '${today}'
// GROUP BY
//   DATE(order_date);
//   `;

//     db.query(query, (err, results) => {
//       if (err) {
//         console.error("Error executing query:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//         return;
//       }

//       res.json(results);
    //     });
    const { fromday, today } = req.query;

    const query = `
  SELECT
    all_dates.day,
    COALESCE(SUM(shoe_order.total_price), 0) AS revenue
  FROM
    (
      SELECT DATE('${fromday}' + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY) AS day
      FROM
        (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
        CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
        CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
    ) AS all_dates
  LEFT JOIN
    shoe_order ON all_dates.day = DATE(shoe_order.order_date)
  WHERE
    all_dates.day BETWEEN '${fromday}' AND '${today}'
  GROUP BY
    all_dates.day;
`;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    });0
  },

  getStatisticByMonthly(req, res) {
  //   const { month, year } = req.query;

  //   const query = `
  //   SELECT
  //     DATE(order_date) AS date,
  //     SUM(total_price) AS revenue
  //   FROM
  //     shoe_order
  //   WHERE
  //     MONTH(order_date) = ${month}
  //     AND YEAR(order_date) = ${year}
  //   GROUP BY
  //     DATE(order_date)
  //   ORDER BY
  //     order_date ASC;
  // `;

  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error("Error executing query:", err);
  //       res.status(500).json({ error: "Internal Server Error" });
  //       return;
  //     }
  //     res.status(200).json(results);
    //   });
    const { fromMonth, toMonth } = req.query;

    const query = `
  SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    COALESCE(SUM(total_price), 0) AS revenue
  FROM
    shoe_order
  WHERE
    DATE_FORMAT(order_date, '%Y-%m') BETWEEN '${fromMonth}' AND '${toMonth}'
  GROUP BY
    DATE_FORMAT(order_date, '%Y-%m');
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
};

module.exports = shoeStatisticController;
