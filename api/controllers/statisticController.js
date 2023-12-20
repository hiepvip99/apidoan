const db = require("../databases/db");
const { Sequelize } = require('sequelize');
const shoeStatisticController = {
  //   getStatisticByWeekly(req, res) {
  //     const { fromday, today } = req.query;

  //     const query = `
  //   SELECT
  //     DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY)) AS day,
  //     COALESCE(SUM(shoe_order.total_price), 0) AS revenue
  //   FROM
  //     (
  //       SELECT DATE_ADD('${fromday}', INTERVAL ((a.a + (10 * b.a) + (100 * c.a)) - 1) DAY) AS day
  //       FROM
  //         (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
  //         CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
  //         CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
  //     ) AS all_dates
  //   LEFT JOIN
  //     (
  //       SELECT
  //         DATE(order_date) AS order_date,
  //         total_price
  //       FROM
  //         shoe_order
  //     ) AS shoe_order ON DATE(all_dates.day) = DATE(shoe_order.order_date)
  //   WHERE
  //     DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY)) BETWEEN DATE_ADD('${fromday}', INTERVAL 1 DAY) AND DATE_ADD('${today}', INTERVAL 1 DAY)
  //   GROUP BY
  //     DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY))
  //   ORDER BY
  //     DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY));
  // `;

  //     db.query(query, (err, results) => {
  //       if (err) {
  //         console.error("Error executing query:", err);
  //         res.status(500).json({ error: "Internal Server Error" });
  //         return;
  //       }
  //       const data = {
  //         data: results,
  //         status: 200,
  //       };
  //       res.status(200).json(data);
  //     });
  //     //     const { fromday, today } = req.query;

  //     //     const query = `
  //     //   SELECT
  //     //     all_dates.day,
  //     //     COALESCE(SUM(shoe_order.total_price), 0) AS revenue
  //     //   FROM
  //     //     (
  //     //       SELECT DATE('${fromday}' + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY) AS day
  //     //       FROM
  //     //         (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
  //     //         CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
  //     //         CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
  //     //     ) AS all_dates
  //     //   LEFT JOIN
  //     //     shoe_order ON all_dates.day = DATE(shoe_order.order_date)
  //     //   WHERE
  //     //     all_dates.day BETWEEN '${fromday}' AND '${today}'
  //     //   GROUP BY
  //     //     all_dates.day;
  //     // `;

  //     //     db.query(query, (err, results) => {
  //     //       if (err) {
  //     //         console.error("Error executing query:", err);
  //     //         res.status(500).json({ error: "Internal Server Error" });
  //     //         return;
  //     //       }
  //     //       const data = {
  //     //         data: results,
  //     //         status: 200,
  //     //       };
  //     //       res.status(200).json(data);
  //     //     });
  //   },

  getStatisticByWeekly(req, res) {
    const { fromday, today } = req.query;

    const query = `
        SELECT
            DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY)) AS day,
            COALESCE(SUM(shoe_order.total_price), 0) AS revenue,
            COALESCE(SUM(shoe_order.total_price) OVER (), 0) AS total_revenue
        FROM
            (
                SELECT DATE_ADD('${fromday}', INTERVAL ((a.a + (10 * b.a) + (100 * c.a)) - 1) DAY) AS day
                FROM
                    (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
                    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
                    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
            ) AS all_dates
        LEFT JOIN
            (
                SELECT
                    DATE(order_date) AS order_date,
                    total_price
                FROM
                    shoe_order
                WHERE
                    status_id = 4
            ) AS shoe_order ON DATE(all_dates.day) = DATE(shoe_order.order_date)
        WHERE
            DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY)) BETWEEN DATE_ADD('${fromday}', INTERVAL 1 DAY) AND DATE_ADD('${today}', INTERVAL 1 DAY)
        GROUP BY
            DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY))
        ORDER BY
            DATE(DATE_ADD(all_dates.day, INTERVAL 1 DAY));
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      const totalRevenue = results.length > 0 ? results[0].total_revenue : 0;
      const data = {
        data: results.map(item => ({ day: item.day, revenue: item.revenue })),
        total_revenue: totalRevenue,
        status: 200,
      };
      res.status(200).json(data);
    });
  },


  //   getStatisticByMonthly(req, res) {
  //     //   const { month, year } = req.query;

  //     //   const query = `
  //     //   SELECT
  //     //     DATE(order_date) AS date,
  //     //     SUM(total_price) AS revenue
  //     //   FROM
  //     //     shoe_order
  //     //   WHERE
  //     //     MONTH(order_date) = ${month}
  //     //     AND YEAR(order_date) = ${year}
  //     //   GROUP BY
  //     //     DATE(order_date)
  //     //   ORDER BY
  //     //     order_date ASC;
  //     // `;

  //     //   db.query(query, (err, results) => {
  //     //     if (err) {
  //     //       console.error("Error executing query:", err);
  //     //       res.status(500).json({ error: "Internal Server Error" });
  //     //       return;
  //     //     }
  //     //     res.status(200).json(results);
  //     //   });
  //     const { fromMonth, toMonth } = req.query;

  //     const query = `
  //   SELECT
  //     DATE_FORMAT(order_date, '%Y-%m') AS month,
  //     COALESCE(SUM(total_price), 0) AS revenue
  //   FROM
  //     shoe_order
  //   WHERE
  //     (order_date >= '${fromMonth}-01' AND order_date <= '${toMonth}-12')
  //   GROUP BY
  //     DATE_FORMAT(order_date, '%Y-%m');
  // `;

  //     db.query(query, (err, results) => {
  //       if (err) {
  //         console.error("Error executing query:", err);
  //         res.status(500).json({ error: "Internal Server Error" });
  //         return;
  //       }

  //       const data = [];
  //       const fromDate = new Date(fromMonth);
  //       const toDate = new Date(toMonth);

  //       let currentDate = new Date(fromDate);
  //       while (currentDate <= toDate) {
  //         const month =
  //           currentDate.getFullYear() +
  //           "-" +
  //           (currentDate.getMonth() + 1).toString().padStart(2, "0");
  //         const result = results.find((row) => row.month === month);
  //         const revenue = result ? result.revenue : 0;
  //         data.push({ month, revenue });

  //         currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  //       }

  //       res.status(200).json({ data, status: 200 });
  //     });
  //     },

  getStatisticByMonthly(req, res) {
    const { fromMonth, toMonth } = req.query;

    // const query = `
    //     SELECT
    //         DATE_FORMAT(order_date, '%Y-%m') AS month,
    //         COALESCE(SUM(total_price), 0) AS revenue,
    //         COALESCE(SUM(total_price) OVER (), 0) AS total_revenue
    //     FROM
    //         shoe_order
    //     WHERE
    //         (order_date >= '${fromMonth}-01' AND order_date <= '${toMonth}-12')
    //         AND status_id = 4
    //     GROUP BY
    //         DATE_FORMAT(order_date, '%Y-%m');
    // `;

    const query = `
    SELECT
        DATE_FORMAT(order_date, '%Y-%m') AS month,
        COALESCE(SUM(total_price), 0) AS revenue,
        (
            SELECT COALESCE(SUM(total_price), 0)
            FROM shoe_order
            WHERE (order_date >= '${fromMonth}-01' AND order_date <= '${toMonth}-12')
                AND status_id = 4
        ) AS total_revenue
    FROM
        shoe_order
    WHERE
        (order_date >= '${fromMonth}-01' AND order_date <= '${toMonth}-12')
        AND status_id = 4
    GROUP BY
        DATE_FORMAT(order_date, '%Y-%m');
`;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const data = [];
      const totalRevenue = results.length > 0 ? results[0].total_revenue : 0;
      const fromDate = new Date(fromMonth);
      const toDate = new Date(toMonth);

      let currentDate = new Date(fromDate);
      while (currentDate <= toDate) {
        const month =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const result = results.find((row) => row.month === month);
        const revenue = result ? result.revenue : 0;
        data.push({ month, revenue });

        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
      }

      res.status(200).json({ data, total_revenue: totalRevenue, status: 200 });
    });
  },

  getStatisticProduct: async (req, res) => {
    try {
      const { fromDate, toDate } = req.query;

      // Truy vấn để lấy 10 sản phẩm bán chạy nhất
      // const result = await db.query(
      //   `
      // SELECT 
      //   sp.id,
      //   sp.name,
      //   SUM(sod.quantity) AS total_quantity
      // FROM
      //   shoe_product sp
      //   JOIN shoe_order_detail sod ON sp.id = sod.product_id
      //   JOIN shoe_order so ON sod.order_id = so.id
      // WHERE
      //   so.order_date BETWEEN ${fromDate} AND ${toDate}
      //   AND so.status_id = 4
      // GROUP BY
      //   sp.id
      // ORDER BY
      //   total_quantity DESC
      // LIMIT 10
      // `,
      //   {
      //     // replacements: { fromDate, toDate },
      //     type: Sequelize.QueryTypes.SELECT,
      //   }
      // );

      // console.log(" result result:", result);

      // // Chuyển đổi kết quả thành một mảng các đối tượng
      // const topSellingProducts = result.map(item => ({
      //   id: item.id,
      //   name: item.name,
      //   total_quantity: item.total_quantity,
      // }));

      // res.json({ top_selling_products: topSellingProducts });
      const query = `
        SELECT
        sp.id,
        sp.name,
        SUM(sod.quantity) AS total_quantity
      FROM
        shoe_product sp
        JOIN shoe_order_detail sod ON sp.id = sod.product_id
        JOIN shoe_order so ON sod.order_id = so.id
      WHERE
        so.order_date BETWEEN ${fromDate} AND ${toDate}
        AND so.status_id = 4
      GROUP BY
        sp.id
      ORDER BY
        total_quantity DESC
      LIMIT 10
    `;

      db.query(query, (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: err });
          return;
        }
        const totalRevenue = results.length > 0 ? results[0].total_revenue : 0;
        const data = {
          data: results.map(item => ({ day: item.day, revenue: item.revenue })),
          total_revenue: totalRevenue,
          status: 200,
        };
        res.status(200).json(data);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // getStatisticByMonthly(req, res) {
  //   const { fromMonth, toMonth } = req.query;

  //   const query = `
  //       SELECT
  //           DATE_FORMAT(order_date, '%Y-%m') AS month,
  //           COALESCE(SUM(total_price), 0) AS revenue,
  //           COALESCE(SUM(total_price) OVER (), 0) AS total_revenue
  //       FROM
  //           shoe_order
  //       WHERE
  //           (order_date >= '${fromMonth}-01' AND order_date <= '${toMonth}-12')
  //       GROUP BY
  //           DATE_FORMAT(order_date, '%Y-%m');
  //   `;

  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error("Error executing query:", err);
  //       res.status(500).json({ error: "Internal Server Error" });
  //       return;
  //     }

  //     const data = [];
  //     const totalRevenue = results.length > 0 ? results[0].total_revenue : 0;
  //     const fromDate = new Date(fromMonth);
  //     const toDate = new Date(toMonth);

  //     let currentDate = new Date(fromDate);
  //     while (currentDate <= toDate) {
  //       const month =
  //         currentDate.getFullYear() +
  //         "-" +
  //         (currentDate.getMonth() + 1).toString().padStart(2, "0");
  //       const result = results.find((row) => row.month === month);
  //       const revenue = result ? result.revenue : 0;
  //       data.push({ month, revenue });

  //       currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  //     }

  //     res.status(200).json({ data, total_revenue: totalRevenue, status: 200 });
  //   });
  // },
};

module.exports = shoeStatisticController;



// async function getStatisticProduct(req, res) {
//   try {
//     const { fromDate, toDate } = req.query;

//     // Truy vấn để lấy 10 sản phẩm bán chạy nhất
//     const result = await sequelize.query(
//       `
//       SELECT 
//         sp.id,
//         sp.name,
//         SUM(sod.quantity) AS total_quantity
//       FROM
//         shoe_products sp
//         JOIN shoe_order_details sod ON sp.id = sod.product_id
//         JOIN shoe_orders so ON sod.order_id = so.id
//       WHERE
//         so.order_date BETWEEN :fromDate AND :toDate
//         AND so.status_id = 4
//       GROUP BY
//         sp.id
//       ORDER BY
//         total_quantity DESC
//       LIMIT 10
//       `,
//       {
//         replacements: { fromDate, toDate },
//         type: Sequelize.QueryTypes.SELECT,
//       }
//     );

//     // Chuyển đổi kết quả thành một mảng các đối tượng
//     const topSellingProducts = result.map(item => ({
//       id: item.id,
//       name: item.name,
//       total_quantity: item.total_quantity,
//     }));

//     res.json({ top_selling_products: topSellingProducts });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// module.exports = { getStatisticProduct };