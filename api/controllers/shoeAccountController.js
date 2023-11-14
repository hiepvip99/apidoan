const db = require("../databases/db");
// const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const tokenManager = require('./tokenManager');

const resetTokens = {};

// Mock database for demonstration purposes
let users = [
  { id: 1, username: 'exampleuser', email: 'example@email.com', resetToken: null },
  // Add more user data as needed
];

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-email-password',
  },
});

// // Object to store reset tokens and their expiration timers



const AccountController = {
  getAccountStatusById(req, res) {
    console.log(req.query.id);
    let statusId = req.query.id;
    db.query(
      "SELECT * FROM shoe_account_status WHERE id = ?",
      [statusId],
      (error, results) => {
        if (error) {
          console.error("Error retrieving accountStatus: ", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "AccountStatus not found" });
        }
        res.json(results[0]);
      }
    );
  },

  getAllStatusAccount(req, res) {
    db.query("SELECT * FROM shoe_account_status", (error, results) => {
      if (error) {
        console.error("Error retrieving accountStatus: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "AccountStatus not found" });
      }
      res.json(results[0]);
    });
  },

  getAccountById(req, res) {
    const accountId = req.query.accountId;

    const sql = `
    SELECT a.*, c.name AS customer_name, c.phone_number, c.date_of_birth, c.email
    FROM shoe_account AS a
    JOIN shoe_customer AS c ON a.id = c.id_account
    WHERE a.id = ?
  `;
    db.query(sql, [accountId], (err, result) => {
      if (err) {
        console.error("Error retrieving data:", err);
        res.status(500).json({ error: "Failed to retrieve data" });
      } else {
        db.query(
          `SELECT * FROM shoe_decentralization`,
          [accountId],
          (err, result1) => {
            if (err) {
              const data = {
                status: 500,
              };
              res.status(500).json(data);
            } else {
              db.query(
                `SELECT * FROM shoe_account_status`,
                [accountId],
                (err, result2) => {
                  if (err) {
                    const data = {
                      status: 500,
                    };
                    res.status(500).json(data);
                  } else {
                    const data = {
                      status: 200,
                      object: result[0],
                      decentralization: result1,
                      account_status: result2,
                    };
                    res.status(200).json(data);
                  }
                }
              );
            }
          }
        );
      }
    });
  },

  getAllAccount(req, res) {
    const page = req.query.page || 1;
    const step = req.query.step || 10;
    const offset = (parseInt(page) - 1) * parseInt(step);
    const keyword = req.query.keyword || "";
    console.log("keyword:", keyword);
    db.query(
      `SELECT COUNT(*) AS total FROM shoe_account WHERE username LIKE 
      '%${keyword}%' LIMIT ${offset}, ${parseInt(step)}`,
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
        console.log(countResult);
        let total = 1;
        if (countResult.length > 0) {
          total = countResult[0].total < 1 ? 1 : countResult[0].total;
        }
        const totalPages = Math.ceil(total / step);

        const sql = `
        SELECT a.*, c.name AS customer_name, c.phone_number, c.date_of_birth, c.email
        FROM shoe_account AS a
        LEFT JOIN shoe_customer AS c ON a.id = c.id_account WHERE a.username LIKE 
      '%${keyword}%' ORDER BY a.id ASC LIMIT ${offset}, ${parseInt(step)} 
      `;

        db.query(sql, (err, result) => {
          if (err) {
            console.error("Error retrieving data:", err);
            res.status(500).json({ error: "Failed to retrieve data" });
          } else {
            db.query(`SELECT * FROM shoe_decentralization`, (err, result1) => {
              if (err) {
                const data = {
                  status: 500,
                };
                res.status(500).json(data);
              } else {
                db.query(
                  `SELECT * FROM shoe_account_status`,
                  (err, result2) => {
                    if (err) {
                      const data = {
                        status: 500,
                      };
                      res.status(500).json(data);
                    } else {
                      const data = {
                        status: 200,
                        currentPage: parseInt(page),
                        step: parseInt(step),
                        totalPages: totalPages,
                        data: result,
                        decentralization: result1,
                        account_status: result2,
                      };
                      res.status(200).json(data);
                    }
                  }
                );
              }
            });
          }
        });
      }
    );
  },

  login(req, res) {
    // const { username, password } = req.body;

    // const query = `SELECT * FROM shoe_account WHERE username = '${username}' AND password = '${password}'`;

    // db.query(query, (error, results) => {
    //   if (error) {
    //     console.error('Lỗi khi thực hiện truy vấn:', error);
    //     res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập.' });
    //   } else {
    //     if (results.length === 0) {
    //       res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    //     } else {
    //       const data = {
    //         status: 200,
    //         data: results[0],
    //       }
    //       res.status(200).json(data);
    //     }
    //   }
    // });
    const { username, password } = req.body;

    const query = `SELECT * FROM shoe_account WHERE username = '${username.toLowerCase()}' AND password = '${password}'`;

    db.query(query, (error, results) => {
      if (error) {
        console.error('Lỗi khi thực hiện truy vấn:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng nhập.' });
      } else {
        if (results.length === 0) {
          res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
        } else {
          const account = results[0];
          if (account.status_id === 1) {
            res.status(200).json({ message: 'Đăng nhập thành công.', data: account });
          } else if (account.status_id === 2) {
            res.status(401).json({ message: 'Tài khoản đã bị khóa.' });
          }
        }
      }
    });
  },

  addAccount(req, res) {
    const { username, password, decentralization_id, status_id } = req.body;
    console.log("username", username);
    console.log("password", password);
    console.log("decentralization_id", decentralization_id);
    console.log("status_id", status_id);
    if (
      username === undefined ||
      password === undefined ||
      decentralization_id === undefined ||
      status_id === undefined
    ) {
      const data = {
        status: 500,
        detail: "Invalid account infomation",
      };
      return res.status(500).json(data);
    } else {
      // Thực hiện kiểm tra dữ liệu đầu vào (validation)
      db.query(
        `SELECT * FROM shoe_account WHERE username = ?`,
        [username.toLowerCase()],
        (err, result) => {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Failed to execute query" });
          }

          if (result && result.length > 0) {
            // Người dùng đã tồn tại, thực hiện hành động tương ứng
            const data = {
              status: 500,
              detail: "Username is exist",
            };
            return res.status(500).json(data);
            // ...
          } else {
            // Thực hiện truy vấn để thêm bản ghi mới
            const sql = `INSERT INTO shoe_account (username, password, decentralization_id, status_id) VALUES (?, ?, ?, ?)`;
            const values = [
              username.toLowerCase(),
              password,
              decentralization_id,
              status_id,
            ];

            db.query(sql, values, (err, result) => {
              if (err) {
                console.error("Error adding account:", err);
                // res.status(500).json({ error: "Failed to add account" });
                const data = {
                  status: 500,
                  detail: "Failed to add account",
                };
                res.status(500).json(data);
              } else {
                const data = {
                  status: 200,
                };
                res.status(200).json(data);
                // res.json({ message: "Account added successfully" });
              }
            });
          }
        }
      );
      // ...
    }
  },

  updateAccount(req, res) {
    // const accountId = req.params.id;
    const { /*  username,  */ password, decentralization_id, status_id, id } =
      req.body;

    // Tạo danh sách các cột cần cập nhật
    const updateColumns = [];
    const updateValues = [];

    // Kiểm tra từng thuộc tính và thêm vào danh sách cập nhật nếu được gửi và không rỗng
    if (password !== undefined && password !== "") {
      updateColumns.push("password");
      updateValues.push(password);
    }
    if (decentralization_id !== undefined && decentralization_id !== "") {
      updateColumns.push("decentralization_id");
      updateValues.push(decentralization_id);
    }
    if (status_id !== undefined && status_id !== "") {
      updateColumns.push("status_id");
      updateValues.push(status_id);
    }

    // Nếu không có thuộc tính nào được gửi, trả về lỗi
    if (updateColumns.length === 0) {
      const data = {
        status: 500,
        detail: "No account information to update",
      };
      return res.status(500).json(data);
    }

    // Thực hiện truy vấn để cập nhật bản ghi
    const sql = `UPDATE shoe_account SET ${updateColumns
      .map((column) => `${column} = ?`)
      .join(", ")} WHERE id = ?`;
    const values = [...updateValues, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating account:", err);
        const data = {
          status: 500,
          detail: "Failed to update account",
        };
        res.status(500).json(data);
      } else {
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    });
  },

  registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(500).json({ error: "Missing account information" });
    }

    // Kiểm tra xem email đã tồn tại trong bảng shoe_customer
    db.query(
      `SELECT * FROM shoe_customer WHERE email = ?`,
      [email],
      (err, emailResult) => {
        if (err) {
          console.error("Error executing email query:", err);
          return res.status(500).json({ error: "Failed to execute email query" });
        }

        if (emailResult && emailResult.length > 0) {
          // Email đã tồn tại
          return res.status(500).json({ message: "Email is already registered", status: 500 });
        } else {
          // Kiểm tra xem tài khoản đã tồn tại trong bảng shoe_account chưa
          db.query(
            `SELECT * FROM shoe_account WHERE username = ?`,
            [username.toLowerCase()],
            (err, result) => {
              if (err) {
                console.error("Error executing username query:", err);
                return res.status(500).json({ error: "Failed to execute username query" });
              }

              if (result && result.length > 0) {
                // Tài khoản đã tồn tại
                return res.status(500).json({ error: "Username is already taken" });
              } else {
                // Thực hiện truy vấn để thêm bản ghi mới vào bảng shoe_account
                const sql = `INSERT INTO shoe_account (username, password, decentralization_id, status_id) VALUES (?, ?, ?, ?`;
                const values = [username.toLowerCase(), password, 2, 1];

                db.query(sql, values, (err, result) => {
                  if (err) {
                    console.error("Error adding account:", err);
                    return res.status(500).json({ error: "Failed to add account" });
                  } else {
                    // Lấy ID của tài khoản vừa được thêm vào
                    const accountId = result.insertId;

                    // Thực hiện truy vấn để thêm bản ghi mới vào bảng shoe_customer
                    const customerSql = `INSERT INTO shoe_customer (id_account, email) VALUES (?, ?)`;
                    const customerValues = [accountId, email];

                    db.query(customerSql, customerValues, (err, result) => {
                      if (err) {
                        console.error("Error adding customer:", err);
                        return res.status(500).json({ error: "Failed to add customer" });
                      } else {
                        return res.status(200).json({ message: "Account registered successfully", status: 200 });
                      }
                    });
                  }
                });
              }
            }
          );
        }
      }
    );
  },
  // registerUser(req, res) {
  //   const { username, email, password } = req.body;

  //   if (!username || !email || !password) {
  //     return res.status(500).json({ error: "Missing account information" });
  //   }

  //   // Kiểm tra xem tài khoản đã tồn tại trong bảng shoe_account chưa
  //   db.query(
  //     `SELECT * FROM shoe_account WHERE username = ?`,
  //     [username.toLowerCase()],
  //     (err, result) => {
  //       if (err) {
  //         console.error("Error executing query:", err);
  //         return res.status(500).json({ error: "Failed to execute query" });
  //       }

  //       if (result && result.length > 0) {
  //         // Tài khoản đã tồn tại
  //         return res.status(500).json({ error: "Username is already taken" });
  //       } else {
  //         // Thực hiện truy vấn để thêm bản ghi mới vào bảng shoe_account
  //         const sql = `INSERT INTO shoe_account (username, password, decentralization_id, status_id) VALUES (?, ?, ?, ?)`;
  //         const values = [username.toLowerCase(), password, 2, 1]; // Phân quyền là 2 và trạng thái là 1

  //         db.query(sql, values, (err, result) => {
  //           if (err) {
  //             console.error("Error adding account:", err);
  //             return res.status(500).json({ error: "Failed to add account" });
  //           } else {
  //             // Lấy ID của tài khoản vừa được thêm vào
  //             const accountId = result.insertId;

  //             // Thực hiện truy vấn để thêm bản ghi mới vào bảng shoe_customer
  //             const customerSql = `INSERT INTO shoe_customer (id_account, email) VALUES (?, ?)`;
  //             const customerValues = [accountId, email];

  //             db.query(customerSql, customerValues, (err, result) => {
  //               if (err) {
  //                 console.error("Error adding customer:", err);
  //                 return res.status(500).json({ error: "Failed to add customer" });
  //               } else {
  //                 return res.status(200).json({ message: "Account registered successfully" , status:200});
  //               }
  //             });
  //           }
  //         });
  //       }
  //     }
  //   );
  // },

  deleteAccount(req, res) {
    const accountId = req.body.id;
    console.log("da vao del accid: ", accountId);
    // Thực hiện truy vấn để xóa bản ghi
    const sql = `DELETE FROM shoe_account WHERE id = ?`;
    const values = [accountId];

    if (accountId === undefined) {
      return;
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error deleting account:", err);
        const data = {
          status: 500,
          detail: "Failed to delete account",
        };
        res.status(500).json(data);
        // res.status(500).json({ error: "Failed to delete account" });
      } else {
        const data = {
          status: 200,
        };
        res.status(200).json(data);
      }
    });
  },

  // forgotPass(req, res) {
  //   const { email } = req.body;

  //   // SQL query to check if the email exists in the shoe_customer table
  //   const sqlQuery = `SELECT * FROM shoe_customer WHERE email = ?`;

  //   // Execute the query with the email parameter
  //   db.query(sqlQuery, [email], (error, results) => {
  //     if (error) {
  //       console.error(error);
  //       return res.status(500).json({ error: 'Database error' });
  //     }

  //     // Check if the query returned any rows (customer with the given email)
  //     const customer = results[0];

  //     if (!customer) {
  //       return res.status(404).json({ message: 'Không tìm thấy email!' });
  //     }

  //     // Generate a random 6-digit token
  //     const resetToken = randomstring.generate({ length: 6, charset: 'numeric' });

  //     // Store the token in the resetTokens object with a 5-minute expiration
  //     resetTokens[email] = {
  //       token: resetToken,
  //       expiration: Date.now() + 5 * 60 * 1000, // 5 minutes in milliseconds
  //     };

  //     // Compose the email
  //     const mailOptions = {
  //       from: 'fidevang5@gmail.com',
  //       to: email,
  //       subject: 'Password Reset Confirmation Code',
  //       text: `Your confirmation code is: ${resetToken}`,
  //     };

  //     // Tạo transporter với tùy chọn rejectUnauthorized tắt
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         user: 'fidevang5@gmail.com',
  //         pass: 'gkmg mfzv gdxy atdk',
  //       },
  //       tls: {
  //         rejectUnauthorized: false,
  //       },
  //     });

  //     // Gửi email
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.error(error);
  //         return res.status(500).json({ error: 'Failed to send confirmation code email' });
  //       }

  //       console.log('Email sent: ' + info.response);
  //       res.json({ success: true });
  //     });

  //     // const mailOptions = {
  //     //   from: 'firevang4@gmail.com',
  //     //   to: email,
  //     //   subject: 'Password Reset Confirmation Code',
  //     //   text: `Your confirmation code is: ${resetToken}`,
  //     // };

  //     // // Send the email
  //     // transporter.sendMail(mailOptions, (error, info) => {
  //     //   if (error) {
  //     //     console.error(error);
  //     //     return res.status(500).json({ error: 'Failed to send confirmation code email' });
  //     //   }

  //     //   console.log('Email sent: ' + info.response);
  //     //   res.json({ success: true });
  //     // });
  //   });
  // },

  // resetPassword(req, res) {
  //   const { email, confirmationCode } = req.body;

  //   // SQL query to check if the token exists and has not expired
  //   const sqlQuery = `SELECT * FROM shoe_customer WHERE email = ?`;

  //   // Execute the query with the email parameter
  //   db.query(sqlQuery, [email], (error, results) => {
  //     if (error) {
  //       console.error(error);
  //       return res.status(500).json({ error: 'Database error' });
  //     }

  //     // Check if the query returned any rows (customer with the given email)
  //     const customer = results[0];

  //     if (!customer) {
  //       return res.status(400).json({ error: 'Invalid confirmation code' });
  //     }

  //     // Check if the token exists and has not expired
  //     const storedToken = resetTokens[email];
  //     if (!storedToken || Date.now() > storedToken.expiration || storedToken.token !== confirmationCode) {
  //       return res.status(400).json({ error: 'Invalid or expired confirmation code' });
  //     }

  //     // Reset the user's password or perform other necessary actions

  //     // Clear the resetToken after successful password reset
  //     // Assume there is a column named resetToken in the shoe_customer table
  //     const updateQuery = `UPDATE shoe_customer SET resetToken = NULL WHERE email = ?`;

  //     // Execute the update query with the email parameter
  //     db.query(updateQuery, [email], (updateError) => {
  //       if (updateError) {
  //         console.error(updateError);
  //         return res.status(500).json({ error: 'Failed to update resetToken in the database' });
  //       }

  //       // Clear the stored token and expiration timer
  //       delete resetTokens[email];

  //       res.json({ hasUpdatePassword: true });
  //     });
  //   });
  // },


  // Check and clear expired tokens every minute
  clearExpiredTokens() {
    setInterval(() => {
      for (const email in resetTokens) {
        if (Date.now() > resetTokens[email].expiration) {
          delete resetTokens[email];
        }
      }
    }, 60 * 1000 * 5); // 1 minute in milliseconds
  },

  updatePassword(req, res) {
    const { username, newPassword } = req.body;

    // SQL query to get the account ID based on the provided username
    const selectQuery = 'SELECT id FROM shoe_account WHERE username = ?';

    // Execute the query with the username parameter
    db.query(selectQuery, [username], (selectError, selectResults) => {
      if (selectError) {
        console.error(selectError);
        return res.status(500).json({ error: 'Database error' });
      }

      // Check if the query returned any rows (account with the given username)
      if (selectResults.length === 0) {
        return res.status(404).json({ error: 'Username not found in the shoe_account table' });
      }

      const accountId = selectResults[0].id;

      // Update the password for the found account ID
      const updateQuery = 'UPDATE shoe_account SET password = ? WHERE id = ?';
      db.query(updateQuery, [newPassword, accountId], (updateError) => {
        if (updateError) {
          console.error(updateError);
          return res.status(500).json({ error: 'Failed to update password' });
        }

        console.log('Password updated successfully');

        // You can add additional logic here if needed

        res.json({ success: true });
      });
    });
  },

  forgotPass(req, res) {
    const { email } = req.body;

    // SQL query to check if the email exists in the shoe_customer table
    const sqlQuery = `SELECT * FROM shoe_customer WHERE email = ?`;

    // Execute the query with the email parameter
    db.query(sqlQuery, [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database error' });
      }

      // Check if the query returned any rows (customer with the given email)
      const customer = results[0];

      if (!customer) {
        return res.status(404).json({ message: 'Không tìm thấy email!' });
      }

      // Generate a random 6-digit token using the tokenManager
      const resetToken = tokenManager.generateToken(email);

      // Compose the email
      const mailOptions = {
        from: 'fidevang5@gmail.com',
        to: email,
        subject: 'Password Reset Confirmation Code',
        text: `Your confirmation code is: ${resetToken}`,
      };

      // Tạo transporter với tùy chọn rejectUnauthorized tắt
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fidevang5@gmail.com',
          pass: 'gkmg mfzv gdxy atdk',
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Gửi email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to send confirmation code email' });
        }

        console.log('Email sent: ' + info.response);
        res.json({ success: true });
      });
    });
  },

  resetPassword(req, res) {
    const { email, confirmationCode } = req.body;

    // SQL query to check if the token exists and has not expired
    const sqlQuery = `SELECT * FROM shoe_customer WHERE email = ?`;

    // Execute the query with the email parameter
    db.query(sqlQuery, [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database error' });
      }



      // Check if the query returned any rows (customer with the given email)
      const customer = results[0];

      if (!customer) {
        return res.status(400).json({ error: 'Invalid confirmation code' });
      }

      // Get the token from the tokenManager
      const storedToken = tokenManager.getResetToken(email);
      if (!storedToken) {
        return res.status(400).json({ error: 'Invalid or expired confirmation code' });;
      }
      // console.log('Stored Token Expiration:', storedToken.expiration);
      // console.log('Current Time:', Date.now());
      // console.log('confirmationCode :', confirmationCode);
      // console.log('storedToken.token :', storedToken.token);
      // console.log('so sanh :', Date.now() < storedToken.expiration);

      // if (!storedToken || Date.now() > storedToken.expiration || storedToken.token !== confirmationCode) {
      //   return res.status(400).json({ error: 'Invalid or expired confirmation code' });
      // }
      return res.status(200).json({ hasUpdatePassword: Date.now() < storedToken.expiration && storedToken.token.trim() === confirmationCode, status: 200 });
      if (Date.now() < storedToken.expiration && storedToken.token.trim() === confirmationCode) {
        console.log('da vao if resetPass'),
        tokenManager.deleteResetToken(email);
        return res.status(200).json({ hasUpdatePassword: Date.now() < storedToken.expiration && storedToken.token.trim() === confirmationCode, status: 200 });
      }

      // Reset the user's password or perform other necessary actions

      // Clear the resetToken after successful password reset
      // Assume there is a column named resetToken in the shoe_customer table
      // const updateQuery = `UPDATE shoe_customer WHERE email = ?`;

      // // Execute the update query with the email parameter
      // db.query(updateQuery, [email], (updateError) => {
      //   if (updateError) {
      //     console.error(updateError);
      //     return res.status(500).json({ error: 'Failed to update resetToken in the database' });
      //   }

      //   // Clear the stored token and expiration timer using the tokenManager
      //   tokenManager.deleteResetToken(email);

      //   res.json({ hasUpdatePassword: true });
      // });
    });
  },

};

// clearExpiredTokens();

module.exports = AccountController;
