'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')

const AccountController = {
    get: (req, res) => {
        let sql = 'SELECT * FROM shoe_account'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    getId: (req, res) => {
        let keyword = req.params.keyword;
        if (!keyword) {
            return res.status(400).json({ error: true, message: 'Please provide account_id' });
        }
        db.query("SELECT * FROM shoe_account where id like '%" + keyword + "%' or username like '%" + keyword + "%'", function (error, results, fields) {
            if (error) throw error;
            return res.json(results);
        });
    },
    add: (req, res) => {
        let account = req.body;
    if (!account.username || !account.password || !account.decentralization) {
        return res.status(300).json({ error: true, message: 'Please enter full account information' });
    }
    db.query('SELECT * FROM shoe_account where username=?', account.username, function (error, results, fields) {
        if (error) throw error;
        if (!results[0]) {
            db.query("INSERT INTO shoe_account SET ? ", { username: account.username, password: account.password, decentralization: account.decentralization, status: account.status }, function (error, results, fields) {
                if (error) throw error;
                return res.json({ error: false, data: results, message: 'New account has been created successfully.' });
            });
        } else {
            return res.json({ error: true, data: results, message: `Tài khoản đã tồn tại với tên: ${account.username}` });
        }
    })
    },
    update: (req, res) => {
        let data = req.body;
        let productId = req.params.productId;
        let sql = 'UPDATE shoe_account SET ? WHERE id = ?'
        db.query(sql, [data, productId], (err, response) => {
            if (err) throw err
            res.json({ message: 'Update success!' })
        })
    },
    
    delete: (req, res) => {
        let sql = 'DELETE FROM shoe_account WHERE id = ?'
        db.query(sql, [req.params.productId], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    }
}

module.exports = AccountController;