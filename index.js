var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const { json } = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// header
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// default route
app.get('/', function (req, res) {
    return res.json({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shoe_store'
});
// connect to database
dbConn.connect();
// Retrieve all users 
app.get('/accountAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_account', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});
// Retrieve user with id 
app.get('/account', function (req, res) {
    let keyword = req.params.keyword;
    if (!keyword) {
        return res.status(404).json({ error: true, message: 'Please provide account_id or username' , status: 404});
    }
    dbConn.query("SELECT * FROM shoe_account where id like '%" + keyword + "%' or username like '%" + keyword + "%'", function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});
// Add a new user  
app.post('/account', function (req, res) {
    let account = req.body;
    if (!account.username || !account.password || !account.decentralization) {
        return res.status(400).json({ error: true, message: 'Please enter full account information' });
    }
    dbConn.query('SELECT * FROM shoe_account where username=?', account.username, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            dbConn.query("INSERT INTO shoe_account SET ? ", { username: account.username, password: account.password, decentralization: account.decentralization, status: account.status }, function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New account has been created successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `Tài khoản đã tồn tại với tên: ${account.username}` });
        }
    })
});
//  Update user with id
app.put('/account', function (req, res) {
    let id = req.body.id;
    let password = req.body.password;
    let decentralization = req.body.decentralization;
    let status = req.body.status;
    if (!id || !password || !decentralization) {
        return res.status(400).json({ error: true, message: 'Please provide id and password and decentralization and status' });
    }
    dbConn.query("UPDATE shoe_account SET ? WHERE id = ?", [{ password: password, decentralization: decentralization, status: status }, id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'account has been updated successfully.' });
    });
});
//  Delete user
app.delete('/account', function (req, res) {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide account_id' });
    }
    dbConn.query('DELETE FROM shoe_account WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'Account has been deleted successfully.' });
    });
});

// Day la phan shoe_category
// Day la phan shoe_category
// Day la phan shoe_category


app.get('/categoryAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_category', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/category/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide category_id' });
    }
    dbConn.query('SELECT * FROM shoe_category where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/category', function (req, res) {
    let name = req.body.name;
    if (!name) {
        return res.status(400).json({ error: true, message: 'Please provide category name' });
    }
    dbConn.query("SELECT * FROM shoe_category where name=?", name, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            dbConn.query("INSERT INTO shoe_category SET ? ", { name: name }, function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New category has been created successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `This category already exists: ${name}` });
        }
    });
});

app.put('/category', function (req, res) {
    let id = req.body.id;
    let name = req.body.name;

    if (!id || !name) {
        return res.status(400).json({ error: user, message: 'Please provide id and name' });
    }
    dbConn.query("SELECT * FROM shoe_category where name= ?", [name], function (error, results, fields) {
        if (!results[0]) {
            dbConn.query("UPDATE shoe_category SET ? WHERE id = ?", [{ name: name }, id], function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'category has been updated successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `The category's name is duplicated: ${name}` });
        }
    });


});

app.delete('/category', function (req, res) {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide account_id' });
    }
    dbConn.query('DELETE FROM shoe_category WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'CAtegory has been deleted successfully.' });
    });
});

// Day la phan shoe_manufacturer
// Day la phan shoe_manufacturer
// Day la phan shoe_manufacturer

app.get('/manufacturerAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_manufacturer', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/manufacturer/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide manufacturer_id' });
    }
    dbConn.query('SELECT * FROM shoe_manufacturer where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/manufacturer', function (req, res) {
    let name = req.body.name;
    if (!name) {
        return res.status(400).json({ error: true, message: 'Please provide manufacturer name' });
    }
    dbConn.query("SELECT * FROM shoe_manufacturer where name=?", name, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            dbConn.query("INSERT INTO shoe_manufacturer SET ? ", { name: name }, function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New manufacturer has been created successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `This manufacturer already exists: ${name}` });
        }
    });
});

app.put('/manufacturer', function (req, res) {
    let id = req.body.id;
    let name = req.body.name;

    if (!id || !name) {
        return res.status(400).json({ error: user, message: 'Please provide id and name' });
    }
    dbConn.query("SELECT * FROM shoe_manufacturer where name= ?", [name, id], function (error, results, fields) {
        if (!results[0]) {
            dbConn.query("UPDATE shoe_manufacturer SET ? WHERE id = ?", [{ name: name }, id], function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'manufacturer has been updated successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `The manufacturer's name is duplicated: ${name}` });
        }
    });

});

app.delete('/manufacturer', function (req, res) {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide manufacturer_id' });
    }
    dbConn.query('DELETE FROM shoe_manufacturer WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'manufacturer has been deleted successfully.' });
    });
});
// // Day la phan shoe_supplier
// // Day la phan shoe_supplier
// // Day la phan shoe_supplier

// app.get('/supplierAll', function (req, res) {
//     dbConn.query('SELECT * FROM shoe_supplier', function (error, results, fields) {
//         if (error) throw error;
//         return res.json(results);
//     });
// });

// app.get('/supplier/:id', function (req, res) {
//     let id = req.params.id;
//     if (!id) {
//         return res.status(400).json({ error: true, message: 'Please provide supplier_id' });
//     }
//     dbConn.query('SELECT * FROM shoe_supplier where id=?', id, function (error, results, fields) {
//         if (error) throw error;
//         return res.json(results[0]);
//     });
// });

// app.post('/supplier', function (req, res) {
//     let name = req.body.name;
//     if (!name) {
//         return res.status(400).json({ error: true, message: 'Please provide supplier name' });
//     }
//     dbConn.query("SELECT * FROM shoe_supplier where name=?", name, function (error, results, fields) {
//         if (error) throw error;
//         if (!results[0]) {
//             dbConn.query("INSERT INTO shoe_supplier SET ? ", { name: name }, function (error, results, fields) {
//                 if (error) throw error;
//                 return res.json({ error: false, data: results, message: 'New supplier has been created successfully.' });
//             });
//         } else {
//             return res.json({ error: true, data: results, message: `This supplier already exists: ${name}` });
//         }
//     });
// });

// app.put('/supplier', function (req, res) {
//     let id = req.body.id;
//     let name = req.body.name;

//     if (!id || !name) {
//         return res.status(400).json({ error: user, message: 'Please provide id and name' });
//     }
//     dbConn.query("SELECT * FROM shoe_supplier where name= ?", [name, id], function (error, results, fields) {
//         if (!results[0]) {
//             dbConn.query("UPDATE shoe_supplier SET ? WHERE id = ?", [{ name: name }, id], function (error, results, fields) {
//                 if (error) throw error;
//                 return res.json({ error: false, data: results, message: 'supplier has been updated successfully.' });
//             });
//         } else {
//             return res.json({ error: true, data: results, message: `The supplier's name is duplicated: ${name}` });
//         }
//     });

// });

// app.delete('/supplier', function (req, res) {
//     let id = req.body.id;
//     if (!id) {
//         return res.status(400).json({ error: true, message: 'Please provide supplier_id' });
//     }
//     dbConn.query('DELETE FROM shoe_supplier WHERE id = ?', [id], function (error, results, fields) {
//         if (error) throw error;
//         return res.json({ error: false, data: results, message: 'supplier has been deleted successfully.' });
//     });
// });

// Day la phan shoe_customer
// Day la phan shoe_customer
// Day la phan shoe_customer

app.get('/customerAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_customer', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/customer/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide customer_id' });
    }
    dbConn.query('SELECT * FROM shoe_customer where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/customer', function (req, res) {
    let phone_number = req.body.phone_number;
    let email = req.body.email;
    let name = req.body.name;
    let date_of_birth = req.body.date_of_birth;
    let id_image = req.body.id_image;
    let id_account = req.body.id_account;
    if (!phone_number || !name || !date_of_birth || !id_account) {
        return res.status(400).json({ error: true, message: 'Please provide customer infomation' });
    }
    dbConn.query("SELECT * FROM shoe_customer where phone_number=?", [phone_number], function (error, results2, fields) {
        if (!results2[0]) {
            dbConn.query("SELECT * FROM shoe_customer where  id_account=?", [id_account], function (error, results1, fields) {
                if (!results1[0]) {
                    dbConn.query("INSERT INTO shoe_customer SET ? ", { name: name, id_account: id_account, phone_number: phone_number, date_of_birth: date_of_birth, id_image: id_image, email: email }, function (error, results, fields) {
                        if (error) throw error;
                        return res.json({ error: false, data: results, message: 'New customer has been created successfully.' });
                    });
                } else {
                    return res.json({ error: true, data: results1, message: `This customer already exists: Check id_account: ${id_account}` });
                }
            });
        } else {
            return res.json({ error: true, data: results2, message: `This customer already exists: Check phone_number: ${phone_number} ` });
        }

    });
});

app.put('/customer', function (req, res) {
    // let phone_number = req.body.phone_number;
    let id = req.body.id;
    let email = req.body.email;
    let name = req.body.name;
    let date_of_birth = req.body.date_of_birth;
    let id_image = req.body.id_image;
    if (/*!phone_number || */!id || !name || !date_of_birth) {
        return res.status(400).json({ error: true, message: 'Please provide customer infomation' });
    }
    // dbConn.query("SELECT * FROM shoe_customer where phone_number=?", [phone_number], function (error, results2, fields) {
    //     if (!results2[0]) {
            dbConn.query("UPDATE shoe_customer SET ? WHERE id = ?", [{ name: name,/* phone_number: phone_number,*/ date_of_birth: date_of_birth, id_image: id_image, email: email }, id], function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'customer has been updated successfully.' });
            });
        // } else {
        //     return res.json({ error: true, data: results2, message: `This customer already exists: Check phone_number: ${phone_number} ` });
        // }

    // });
});

app.delete('/customer', function (req, res) {
    let id = req.body.id;
    let id_account = req.body.id_account;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide customer_id' });
    }
    dbConn.query('SELECT * FROM shoe_customer WHERE id = ?', [id], function (error, results, fields) {
        if (results[0].id_account == id_account) {
            dbConn.query('DELETE FROM shoe_customer WHERE id = ?', [id], function (error, results, fields) {
                if (error) throw error;
                dbConn.query('DELETE FROM shoe_account WHERE id = ?', [id_account], function (error, results, fields) {
                    if (error) throw error;
                    return res.json({ error: false, data: results, message: 'Customer and Customer_Account has been deleted successfully.' });
                });
            });
        } else {
            return res.json({ error: true, data: results, message: `Customer and Customer_Account has been deleted error in id_account: ${id_account}` })
        }
    });

});

// Day la phan shoe_staff
// Day la phan shoe_staff
// Day la phan shoe_staff

app.get('/staffAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_staff', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/staff/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide staff_id' });
    }
    dbConn.query('SELECT * FROM shoe_staff where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/staff', function (req, res) {
    let name = req.body.name;
    let address = req.body.address;
    let phone_number = req.body.phone_number;
    let brith_of_date = req.body.brith_of_date;
    let position = req.body.position;
    let basic_salary = req.body.basic_salary;
    let start_work_date = req.body.start_work_date;
    let id_image = req.body.id_image;
    if (!name || !phone_number || !address || !brith_of_date || !position || !basic_salary || !start_work_date || !id_image) {
        return res.status(400).json({ error: true, message: 'Please provide staff infomation' });
    }
    dbConn.query("INSERT INTO shoe_staff SET ? ", {
        name: name, address: address, phone_number: phone_number, brith_of_date: brith_of_date, position: position,
        basic_salary: basic_salary, start_work_date: start_work_date, id_image: id_image
    }, function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'New staff has been created successfully.' });
    });
});

app.put('/staff', function (req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let address = req.body.address;
    let phone_number = req.body.phone_number;
    let brith_of_date = req.body.brith_of_date;
    let position = req.body.position;
    let basic_salary = req.body.basic_salary;
    let start_work_date = req.body.start_work_date;
    let id_image = req.body.id_image;
    if (!name || !phone_number || !address || !brith_of_date || !position || !basic_salary || !start_work_date || !id_image) {
        return res.status(400).json({ error: true, message: 'Please provide staff infomation' });
    }
    dbConn.query("UPDATE shoe_staff SET ? WHERE id = ?", [{
        name: name, address: address, phone_number: phone_number, brith_of_date: brith_of_date, position: position,
        basic_salary: basic_salary, start_work_date: start_work_date, id_image: id_image
    }, id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'staff has been update successfully.' });
    });
});

app.delete('/staff', function (req, res) {
    let id = req.body.id;
    let id_image = req.body.id_image;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide staff_id' });
    }
    dbConn.query('DELETE FROM shoe_staff WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        dbConn.query('DELETE FROM shoe_image WHERE id = ?', [id_image], function (error, results, fields) {
            if (error) throw error;
            return res.json({ error: false, data: results, message: 'staff and staff_image has been deleted successfully.' });
        });
    });

});

// Day la shoe_quantity
// Day la shoe_quantity
// Day la shoe_quantity

app.get('/quantityAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_quantity', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/quantity/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide quantity_id' });
    }
    dbConn.query('SELECT * FROM shoe_quantity where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/quantity', function (req, res) {
    let color = req.body.color;
    let size = req.body.size;
    let quantity = req.body.quantity;
    if (!color || !size || !quantity) {
        return res.status(400).json({ error: true, message: 'Please enter full quantity information' });
    }
    dbConn.query('SELECT * FROM shoe_quantity where size=? and color=? and quantity=?', [size, color, quantity], function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            dbConn.query("INSERT INTO shoe_quantity SET ?", [{ size: size, color: color, quantity: quantity }], function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New quantity has been created successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `shoe_quantity does exist` });
        }
    });
});

app.put('/quantity', function (req, res) {
    let color = req.body.color;
    let id = req.body.id;
    let size = req.body.size;
    let quantity = req.body.quantity;
    if (!color || !size || !quantity || !id) {
        return res.status(400).json({ error: true, message: 'Please enter full quantity information' });
    }
    dbConn.query('SELECT * FROM shoe_quantity where id=?', [id], function (error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            dbConn.query("UPDATE shoe_quantity SET ?  where id= ?", [{ size: size, color: color, quantity: quantity }, id], function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'quantity has been updated successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `This quantity already not exists` });
        }
    })
});

app.delete('/quantity', function (req, res) {
    let id = req.body.id;

    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide quantity_id' });
    }
    dbConn.query('DELETE FROM shoe_quantity WHERE id = ?', [id], function (error, results, fields) {
        return res.json({ error: false, data: results, message: 'quantity has been deleted successfully.' });
    });
});

// Day la shoe_image
// Day la shoe_image
// Day la shoe_image

app.get('/image/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide image_id' });
    }
    dbConn.query('SELECT * FROM shoe_image where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/image', function (req, res) {
    let link = req.body.link;
    if (!link) {
        return res.status(400).json({ error: true, message: 'Please enter link :v' });
    }
    dbConn.query("INSERT INTO shoe_image SET ?", [{ link: link }], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'New image has been created successfully.' });
    });
});

app.put('/image', function (req, res) {
    let link = req.body.link;
    let id = req.body.id;
    if (!link || !id) {
        return res.status(400).json({ error: true, message: 'Please enter shoe_id, link' });
    }
    dbConn.query("UPDATE shoe_image SET ? WHERE", [{ link: link }, id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'image has been update successfully.' });
    });
});

app.delete('/image', function (req, res) {
    let id = req.body.id;

    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide image_id' });
    }
    dbConn.query('DELETE FROM shoe_image WHERE id = ?', [id], function (error, results, fields) {
        return res.json({ error: false, data: results, message: 'image has been deleted successfully.' });
    });
});

// Day la shoe_product
// Day la shoe_product
// Day la shoe_product

app.get('/productAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_product', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/product/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide product_id' });
    }
    dbConn.query('SELECT * FROM shoe_product where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/product', function (req, res) {
    let name = req.body.name;
    let id_category = req.body.id_category;
    let price = req.body.price;
    let id_quantity = req.body.id_quantity;
    let id_image = req.body.id_image;
    let id_manufacturer = req.body.id_manufacturer;
    let id_supplier = req.body.id_supplier;
    if (!name || !id_category || !price || !id_quantity || !id_image || !id_manufacturer || !id_supplier) {
        return res.status(400).json({ error: true, message: 'Please enter all infomation :v' });
    }
    dbConn.query("SELECT * FROM shoe_product WHERE name=?", name, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            dbConn.query("INSERT INTO shoe_product SET ?", [{
                name: name, id_category: id_category, price: price, id_quantity: id_quantity,
                id_image: id_image, id_manufacturer: id_manufacturer, id_supplier: id_supplier
            }], function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New product has been created successfully.' });
            });
        } else {
            return res.json({ error: true, message: `this product has been already exist with name: ${name}` });
        }
    });

});

app.put('/product', function (req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let id_category = req.body.id_category;
    let price = req.body.price;
    let id_quantity = req.body.id_quantity;
    let id_image = req.body.id_image;
    let id_manufacturer = req.body.id_manufacturer;
    let id_supplier = req.body.id_supplier;
    if (!name || !id_category || !price || !id_quantity || !id_image || !id_manufacturer || !id_supplier || !id) {
        return res.status(400).json({ error: true, message: 'Please enter all infomation' });
    }
    dbConn.query("UPDATE shoe_product SET ? WHERE id=?", [{
        name: name, id_category: id_category, price: price, id_quantity: id_quantity,
        id_image: id_image, id_manufacturer: id_manufacturer, id_supplier: id_supplier
    }, id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'product has been update successfully.' });
    });
});

app.delete('/product', function (req, res) {
    let id = req.body.id;

    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide product_id' });
    }
    dbConn.query('DELETE FROM shoe_product WHERE id = ?', [id], function (error, results, fields) {
        return res.json({ error: false, data: results, message: 'product has been deleted successfully.' });
    });
});

// Day la shoe_order_details
// Day la shoe_order_details
// Day la shoe_order_details

app.get('/orderDetail/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide product_id' });
    }
    dbConn.query('SELECT * FROM shoe_order_details where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/orderDetail', function (req, res) {
    let id_product = req.body.id_product;
    let id_quantity = req.body.id_quantity;
    let order_quantity = req.body.order_quantity;
    if (!id_product || !id_quantity || !order_quantity) {
        return res.status(400).json({ error: true, message: 'Please enter all infomation :v' });
    }
    dbConn.query("INSERT INTO shoe_order_details SET ?", [{ id_product: id_product, id_quantity: id_quantity, order_quantity: order_quantity }], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'New orderDetail has been created successfully.' });
    });
});

app.put('/orderDetail', function (req, res) {
    let id = req.body.id;
    let id_product = req.body.id_product;
    let id_quantity = req.body.id_quantity;
    let order_quantity = req.body.order_quantity;
    if (!id_product || !id_quantity || !order_quantity || !id) {
        return res.status(400).json({ error: true, message: 'Please enter all infomation' });
    }
    dbConn.query("UPDATE shoe_order_details SET ? WHERE id=?", [{
        id_product: id_product, id_quantity: id_quantity, order_quantity: order_quantity
    }, id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'orderDetail has been update successfully.' });
    });
});

app.delete('/orderDetail', function (req, res) {
    let id = req.body.id;

    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide order_detail_id' });
    }
    dbConn.query('DELETE FROM shoe_order_details WHERE id = ?', [id], function (error, results, fields) {
        return res.json({ error: false, data: results, message: 'orderDetail has been deleted successfully.' });
    });
});

// Day la phan shoe_order_status
// Day la phan shoe_order_status
// Day la phan shoe_order_status

app.get('/orderStatusAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_order_status', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/orderStatus/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide orderStatus_id' });
    }
    dbConn.query('SELECT * FROM shoe_order_status where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/orderStatus', function (req, res) {
    let name = req.body.name;
    if (!name) {
        return res.status(400).json({ error: true, message: 'Please provide order Status name' });
    }
    dbConn.query("SELECT * FROM shoe_order_status where name=?", name, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            dbConn.query("INSERT INTO shoe_order_status SET ? ", { name: name }, function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New orderStatus has been created successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `This orderStatus already exists: ${name}` });
        }
    });
});

app.put('/orderStatus', function (req, res) {
    let id = req.body.id;
    let name = req.body.name;

    if (!id || !name) {
        return res.status(400).json({ error: user, message: 'Please provide id and name' });
    }
    dbConn.query("SELECT * FROM shoe_order_status where name= ?", [name, id], function (error, results, fields) {
        if (!results[0]) {
            dbConn.query("UPDATE shoe_order_status SET ? WHERE id = ?", [{ name: name }, id], function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'orderStatus has been updated successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `The orderStatus's name is duplicated: ${name}` });
        }
    });

});

app.delete('/orderStatus', function (req, res) {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide orderStatus_id' });
    }
    dbConn.query('DELETE FROM shoe_order_status WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'orderStatus has been deleted successfully.' });
    });
});

// Day la phan shoe_order
// Day la phan shoe_order
// Day la phan shoe_order

app.get('/orderAll', function (req, res) {
    dbConn.query('SELECT * FROM shoe_order', function (error, results, fields) {
        if (error) throw error;
        return res.json(results);
    });
});

app.get('/order/:id', function (req, res) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide order_id' });
    }
    dbConn.query('SELECT * FROM shoe_order where id=?', id, function (error, results, fields) {
        if (error) throw error;
        return res.json(results[0]);
    });
});

app.post('/order', function (req, res) {
    let order_date = req.body.order_date;
    let id_customer = req.body.id_customer;
    let id_order_details = req.body.id_order_details;
    let id_order_status = req.body.id_order_status;
    let total = req.body.total;
    let payment_methods = req.body.payment_methods;
    if (!order_date || !id_customer || !id_order_details || !id_order_status || !total || !payment_methods) {
        return res.status(400).json({ error: true, message: 'Please provide all information' });
    }
    // check order detail trc trong flutter xong moi cho 
    // insert neu chua co trong order datail thi them vao va tra ra id
            dbConn.query("INSERT INTO shoe_order SET ? ", {
                order_date: order_date, id_customer: id_customer, id_order_details: id_order_details,
                id_order_status: id_order_status, total: total, payment_methods: payment_methods
            }, function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New order has been created successfully.' });
            });
});

app.put('/order', function (req, res) {
    let id = req.body.id;
    let id_order_status = req.body.id_order_status;
    if (!id || !id_order_status) {
        return res.status(400).json({ error: true, message: 'Please provide id and order_status_id' });
    }
    dbConn.query("UPDATE shoe_order SET ? WHERE id=?", [{ id_order_status: id_order_status }, id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'order has been update successfully.' });
    });
});

app.delete('/order', function (req, res) {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide order_id' });
    }
    dbConn.query('DELETE FROM shoe_order WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'order has been deleted successfully.' });
    });
});

// Day la phan shoe_review
// Day la phan shoe_review
// Day la phan shoe_review

app.get('/review', function (req, res) {
    let id_product = req.body.id_product;
    if (!id_product) {
        return res.status(400).json({ error: true, message: 'Please provide id_product' });
    }
    dbConn.query('SELECT * FROM shoe_review where id_product=?', id_product, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            return res.status(404).json({ error: true, message: `No comments found with id_product: ${id_product}` })
        } else {
            return res.json(results[0]);
        }
    });
});

app.post('/review', function (req, res) {
    let id_order = req.body.id_order;
    let id_customer = req.body.id_customer;
    let id_product = req.body.id_product;
    let comment = req.body.comment;
    let star = req.body.star;
    if (!id_order || !id_customer || !id_product || !comment || !star) {
        return res.status(400).json({ error: true, message: 'Please provide full infomation' });
    }
    dbConn.query("SELECT * FROM shoe_review where id_order=?", id_order, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            dbConn.query("INSERT INTO shoe_review SET ? ", {
                id_order: id_order, id_customer: id_customer, id_product: id_product,
                comment: comment, star: star
            }, function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New review has been created successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `This review already exists with id_order: ${id_order}` });
        }
    });
});

app.delete('/review', function (req, res) {
    let id = req.body.id;
    if (!id) {
        return res.status(400).json({ error: true, message: 'Please provide order_id' });
    }
    dbConn.query('DELETE FROM shoe_review WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        return res.json({ error: false, data: results, message: 'review has been deleted successfully.' });
    });
});

app.set()

// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;