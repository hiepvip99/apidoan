// shoeCustomerController.js
const db = require("../databases/db");
const upload = require("../uploadHelper");
// Controller để lấy danh sách tất cả khách hàng giày
// function getAllShoeCustomers(req, res) {
//   const page = req.query.page || 1;
//   const step = req.query.step || 10;
//   const offset = (page - 1) * step;
//   const keyword = req.query.keyword || "";

//   db.query(
//     "SELECT COUNT(*) AS total FROM shoe_customer",
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
//       let total = 1;
//       if (countResult.length > 0) {
//         total = countResult[0].total < 1 ? 1 : countResult[0].total;
//       }
//       const totalPages = Math.ceil(total / step);
//       db.query(
//         `SELECT id, name, phone_number, date_of_birth, email, id_account, address, image FROM shoe_customer WHERE name LIKE '%${keyword}%' LIMIT ${offset}, ${parseInt(
//           step
//         )}`,
//         (err, results) => {
//           if (err) {
//             console.error("Error executing MySQL query:", err);
//             const data = {
//               status: 500,
//               error: true,
//               detail: "Failed to fetch shoe customers",
//             };
//             res.status(500).json(data);
//             return;
//           }
//           const modifiedResults = results.map((customer) => {
//             return {
//               ...customer,
//               address: JSON.parse(customer.address),
//             };
//           });

//           const data = {
//             currentPage: parseInt(page),
//             step: parseInt(step),
//             totalPages: totalPages,
//             data: modifiedResults,
//           };
//           res.status(200).json(data);
//         }
//       );
//     }
//   );
// }


function getAllShoeCustomers(req, res) {
  const page = req.query.page || 1;
  const step = req.query.step || 10;
  const offset = (page - 1) * step;
  const keyword = req.query.keyword || "";

  // Thực hiện truy vấn để lấy tổng số lượng khách hàng
  db.query("SELECT COUNT(*) AS total FROM shoe_customer", (err, countResult) => {
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

    const totalPages = Math.ceil(total / step);

    // Thực hiện truy vấn để lấy thông tin khách hàng và thống kê đơn hàng
    db.query(
      `SELECT c.id, c.name, c.phone_number, c.date_of_birth, c.email, c.id_account, c.address, c.image, 
                    COUNT(o.id) AS total_order, COALESCE(SUM(CASE WHEN o.status_id = 4 THEN o.total_price ELSE 0 END), 0) AS total_amount_spent
             FROM shoe_customer c
             LEFT JOIN shoe_order o ON c.id_account = o.account_id
             WHERE c.name LIKE '%${keyword}%'
             GROUP BY c.id
             LIMIT ${offset}, ${parseInt(step)}`,
      (err, results) => {
        if (err) {
          console.error("Error executing MySQL query:", err);
          const data = {
            status: 500,
            error: true,
            detail: "Failed to fetch shoe customers",
          };
          res.status(500).json(data);
          return;
        }

        const modifiedResults = results.map((customer) => {
          return {
            ...customer,
            address: JSON.parse(customer.address),
          };
        });

        const data = {
          currentPage: parseInt(page),
          step: parseInt(step),
          totalPages: totalPages,
          data: modifiedResults,
        };
        res.status(200).json(data);
      }
    );
  });
}




// function getAllShoeCustomers(req, res) {
//   const page = req.query.page || 1;
//   const step = req.query.step || 10;
//   const offset = (page - 1) * step;
//   const keyword = req.query.keyword || "";

//   // const query = "SELECT * FROM shoe_customer";

//   db.query(
//     "SELECT COUNT(*) AS total FROM shoe_customer",
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
//       let total = 1;
//       if (countResult.length > 0) {
//         total = countResult[0].total < 1 ? 1 : countResult[0].total;
//       }
//       // const total = countResult[0].total || 0;
//       const totalPages = Math.ceil(total / step);
//       db.query(
//         `SELECT * FROM shoe_customer where name like
//       '${`%${keyword}%`}' LIMIT ${offset}, ${parseInt(step)} `,
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


//   // Thực hiện truy vấn
//   // db.query(query, (error, results) => {
//   //   if (error) {
//   //     const data = {
//   //       status: 500,
//   //       error: true,
//   //     };
//   //     res.status(500).json(data);
//   //     // res.status(500).json({ error: "Lỗi truy vấn" });
//   //   } else {
//   //     const data = {
//   //       status: 500,
//   //       error: true,
//   //     };
//   //     res.status(200).json(results);
//   //   }
//   // });
// }
function getNotificationByAccountId(req, res) {
  const accountId = req.query.accountId;
  const query = 'SELECT * FROM shoe_notification WHERE account_id = ? LIMIT 50';

  db.query(query, [accountId], (error, results) => {
    if (error) {
      console.error('Error retrieving notifications:', error);
      // callback(error, null);
    } else {
      console.log('Notifications retrieved successfully');
      const data = {
        status: 200,
        data: results,
      }
      return res.status(200).json(data);
    }
  });
}

function updateNotificationToken(req, res) {
  const idAccount = req.body.idAccount;
  const newToken = req.body.newToken;

  const query = `UPDATE shoe_customer SET notification_token = '${newToken}' WHERE id_account = ${idAccount}`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Lỗi khi cập nhật token thông báo:', error);
    } else {
      console.log('Token thông báo đã được cập nhật thành công.');
      const data = {
        status: 200,
      }
      return res.status(200).json(data);
    }
  });
}

// Controller để lấy một khách hàng giày dựa trên ID
function getShoeCustomerByIdAccount(req, res) {
  const id = req.query.accountId;

  // Thực hiện truy vấn để lấy thông tin khách hàng và thống kê đơn hàng
  const query = `
        SELECT c.id, c.name, c.phone_number, c.date_of_birth, c.email, c.id_account, c.address, c.image, 
            COUNT(o.id) AS total_order, 
            COALESCE(SUM(CASE WHEN o.status_id = 4 THEN o.total_price ELSE 0 END), 0) AS total_amount_spent
        FROM shoe_customer c
        LEFT JOIN shoe_order o ON c.id_account = o.account_id
        WHERE c.id_account = ?
        GROUP BY c.id
    `;

  db.query(query, [id], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
    } else {
      if (results.length === 0) {
        const data = {
          status: 404,
          detail: "Không tìm thấy khách hàng",
          error: true,
        };
        res.status(404).json(data);
      } else {
        const shoeCustomer = results[0];
        try {
          if (shoeCustomer.address) {
            shoeCustomer.address = JSON.parse(shoeCustomer.address);
          }
        } catch (err) {
          // Xử lý lỗi tại đây
          console.error(err);
        }
        res.status(200).json(shoeCustomer);
      }
    }
  });
}

// function getShoeCustomerByIdAccount(req, res) {
//   const id = req.query.accountId;
//   const query = "SELECT *, DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth FROM shoe_customer WHERE id_account = ?";

//   db.query(query, [id], (error, results) => {
//     if (error) {
//       const data = {
//         status: 500,
//         error: true,
//       };
//       res.status(500).json(data);
//     } else {
//       if (results.length === 0) {
//         const data = {
//           status: 404,
//           detail: "Không tìm thấy khách hàng",
//           error: true,
//         };
//         res.status(404).json(data);
//       } else {
//         const shoeCustomer = results[0];
//         try {
//           if (shoeCustomer.address) {
//             shoeCustomer.address = JSON.parse(shoeCustomer.address);
//           }
//         } catch (err) {
//           // Xử lý lỗi tại đây
//           console.error(err);
//         }
//         res.status(200).json(shoeCustomer);
//       }
//     }
//   });
// }


// function getShoeCustomerByIdAccount(req, res) {
//   const id = req.query.accountId;
//   const query = "SELECT * FROM shoe_customer WHERE id_account = ?";

//   // console.log("đã vào hàm getShoeCustomerByIdAccount này rồi");

//   // Thực hiện truy vấn
//   db.query(query, [id], (error, results) => {
//     if (error) {
//       // res.status(500).json({ error: "Lỗi truy vấn" });
//       const data = {
//         status: 500,
//         error: true,
//       };
//       res.status(500).json(data);
//     } else {
//       if (results.length === 0) {
//         const data = {
//           status: 404,
//           detail: "Không tìm thấy khách hàng",
//           error: true,
//         };
//         res.status(404).json(data);
//         // res.status(404).json({ error: "Không tìm thấy khách hàng" });
//       } else {
//         // res.status(200).json(results[0]);
//         const shoeCustomer = results[0];
//         shoeCustomer.address = JSON.parse(shoeCustomer.address);
//         res.status(200).json(shoeCustomer);
//       }
//     }
//   });
// }

// Controller để tạo một khách hàng giày mới
function createShoeCustomer(req, res) {
  // Lưu ảnh
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.log("error", err);
      const data = {
        status: 500,
        detail: "Lỗi trong quá trình tải ảnh",
      };
      res.status(500).json(data);
      return;
    }

    // Lấy thông tin khách hàng
    const { name, phone_number, date_of_birth, email, address } = req.body;

    // Lấy đường dẫn ảnh
    const imageUrl = req.file ? `api/image/${req.file.filename}` : "";

    // Thực hiện thêm khách hàng vào cơ sở dữ liệu
    const insertQuery =
      "INSERT INTO shoe_customer (name, phone_number, date_of_birth, email, address, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      insertQuery,
      [name, phone_number, date_of_birth, email, address, imageUrl],
      (error, results, fields) => {
        if (error) {
          console.error("Lỗi khi thêm khách hàng: ", error);
          const data = {
            status: 500,
            detail: "Lỗi khi thêm khách hàng",
          };
          res.status(500).json(data);
        } else {
          const data = {
            status: 200,
            detail: "Thêm khách hàng thành công",
            customer: {
              id: results.insertId,
              name,
              phone_number,
              date_of_birth,
              email,
              address,
              image: imageUrl,
            },
          };
          res.status(200).json(data);
        }
      }
    );
  });
}
// function createShoeCustomer(req, res) {
//   const { name, phone_number, date_of_birth, email, id_account } = req.body;
//   const query =
//     "INSERT INTO shoe_customer (name, phone_number, date_of_birth, email, id_account) VALUES (?, ?, ?, ?, ?)";

//   // Thực hiện truy vấn
//   db.query(
//     query,
//     [name, phone_number, date_of_birth, email, id_account],
//     (error, results) => {
//       if (error) {
//         const data = {
//           status: 500,
//           error: true,
//         };
//         res.status(500).json(data);
//         // res.status(500).json({ error: "Lỗi truy vấn" });
//       } else {
//         const newCustomerId = results.insertId;
//         res.status(201).json({ id: newCustomerId, name: name });
//       }
//     }
//   );
// }

function checkCustomerInfo(req, res) {
  // API endpoint để kiểm tra thông tin
    const accountId = req.body.accountId;

    if (!accountId) {
      res.status(400).json({ error: 'Missing accountId' });
      return;
    }

    const sql = `SELECT name, phone_number FROM shoe_customer WHERE id_account = ?`;
    db.query(sql, [accountId], (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (result.length > 0) {
          const row = result[0];
          const name = row.name;
          const address = row.address;
          const phone_number = row.phone_number;

          if (name !== null && phone_number !== null && name !== "" && phone_number !== "") {
            res.json({ hasUpdateInfomation: false });
          } else {
            res.json({ hasUpdateInfomation: true });
          }
        } else {
          res.status(404).json({ error: 'Account not found' });
        }
      }
    });
}

// Controller để cập nhật một khách hàng giày dựa trên ID
function updateShoeCustomer(req, res) {
  // const customerId = req.params.id; // Lấy id khách hàng từ request params
  const { name, phone_number, date_of_birth, email, id } = req.body; // Lấy thông tin khách hàng từ request body

  // Thực hiện cập nhật thông tin khách hàng trong cơ sở dữ liệu
  const updateQuery =
    "UPDATE shoe_customer SET name = ?, phone_number = ?, date_of_birth = ?, email = ? WHERE id = ?";
  db.query(
    updateQuery,
    [name, phone_number, date_of_birth, email, id],
    (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi cập nhật khách hàng: ", error);
        const data = {
          status: 500,
          detail: "Lỗi khi cập nhật khách hàng",
        };
        res.status(500).json(data);
      } else {
        const data = {
          status: 200,
          detail: "Cập nhật thông tin khách hàng thành công",
        };
        res.status(200).json(data);
      }
    }
  );
}

function updateShoeCustomerImage(req, res) {
   // Lấy id khách hàng từ request params

  // Lưu ảnh
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.log("error", err);
      const data = {
        status: 500,
        detail: "Lỗi trong quá trình tải ảnh",
      };
      res.status(500).json(data);
      return;
    }
    const customerId = req.body.customerId;
    // Lấy đường dẫn ảnh
    const imageUrl = req.file ? `api/image/${req.file.filename}` : "";

    // Thực hiện cập nhật ảnh cho khách hàng trong cơ sở dữ liệu
    const updateQuery = "UPDATE shoe_customer SET image = ? WHERE id = ?";
    db.query(updateQuery, [imageUrl, customerId], (error, results, fields) => {
      if (error) {
        console.error("Lỗi khi cập nhật ảnh khách hàng: ", error);
        const data = {
          status: 500,
          detail: "Lỗi khi cập nhật ảnh khách hàng",
        };
        res.status(500).json(data);
      } else {
        const data = {
          status: 200,
          url: imageUrl,
          detail: "Cập nhật ảnh khách hàng thành công",
        };
        res.status(200).json(data);
      }
    });
  });
}

// Controller để xóa một khách hàng giày dựa trên ID
function deleteShoeCustomer(req, res) {
  const id = req.params.id;
  const query = "DELETE FROM shoe_customer WHERE id = ?";

  // Thực hiện truy vấn
  db.query(query, [id], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
      // res.status(500).json({ error: "Lỗi truy vấn" });
    } else {
      res.status(200).json({ message: "Xóa khách hàng giày thành công" });
    }
  });
}

// Controller để lấy danh sách khách hàng giày dựa trên ID tài khoản
function getShoeCustomersByAccountId(req, res) {
  const accountId = req.params.accountId;
  const query = "SELECT * FROM shoe_customer WHERE id_account = ?";

  // Thực hiện truy vấn
  db.query(query, [accountId], (error, results) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      res.status(500).json(data);
      // res.status(500).json({ error: "Lỗi truy vấn" });
    } else {
      res.status(200).json(results);
    }
  });
}


function getVipCustomer(req, res) {
  const query = `
    SELECT
      c.id,
      c.name,
      c.phone_number,
      c.date_of_birth,
      c.email,
      c.image
    FROM
      shoe_customer AS c
    INNER JOIN (
      SELECT
        account_id,
        COUNT(*) AS order_count
      FROM
        shoe_order
      GROUP BY
        account_id
      HAVING
        order_count >= 5
    ) AS o ON c.id_account = o.account_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn: ", err);
      res.status(500).send("Lỗi truy vấn cơ sở dữ liệu");
      return;
    }

    res.json(results);
  });
}

function updateAddress(req, res) {
  console.log("vào updateAddress");
  const customerId = req.body.customerId;
  // Chuyển đổi danh sách chuỗi thành chuỗi JSON
  const addressesJson = JSON.stringify(req.body.addresses);
  
  // Tạo câu truy vấn SQL
  const sql = `UPDATE shoe_customer SET address = ? WHERE id = ?`;

  // Thực thi câu truy vấn
  db.query(sql, [addressesJson, customerId], (error, results, fields) => {
    if (error) {
      const data = {
        status: 500,
        error: true,
      };
      console.error('Lỗi khi cập nhật địa chỉ:', error);
      return res.status(500).json(data);
    }
    const data = {
      status: 200,
    };
    console.log(`Đã cập nhật địa chỉ cho khách hàng có id ${customerId}`);
    return res.status(200).json(data);
  });
}

module.exports = {
  getAllShoeCustomers,
  getShoeCustomerByIdAccount,
  createShoeCustomer,
  updateShoeCustomer,
  deleteShoeCustomer,
  getShoeCustomersByAccountId,
  getVipCustomer,
  updateShoeCustomerImage,
  updateAddress,
  updateNotificationToken,
  getNotificationByAccountId,
  checkCustomerInfo,
};
