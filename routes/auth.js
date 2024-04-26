const express = require('express');
const router = express.Router();
const access = require('../controllers/auth/access');
const depart = require('../controllers/order/selectDepart');
const selectUserData = require('../controllers/order/selectUserData');
const register = require('../controllers/auth/register');
const login = require('../controllers/auth/login');
const logout = require('../controllers/auth/logout');
const unconfirmedUsers = require('../controllers/auth/unconfirmedUsers');
const deleteUsers = require('../controllers/auth/deleteUsers');
const changeUsers = require('../controllers/auth/changeUsers');

router.get('/home', access, depart, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Logowanie';
        const depart = req.depart;
        res.render('home', {title, depart})
    } else {
        res.redirect('/start')
    }
});

router.get('/start', access, (req, res) => {
    if (!req.user) {
        const title = 'WRO Dirks App | Logowanie';
        res.render('start', {title})
    } else {
        res.redirect('/home')
    }
});

router.get('/register', access, (req, res) => {
    if (!req.user) {
        const title = 'WRO Dirks App | Rejestracja';
        res.render('register', {title})
    } else {
        res.redirect('/home')
    }
});

router.get('/profile', access, selectUserData, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Konto';
        const pageHeader = "Moje konto";
        const footerDepartName = "Account settings";
        const user = req.user;
        const firstName = req.firstName;
        const lastName = req.lastName;
        const passOut = req.passOut;
        const admin = req.admin;
        const qtyUnconfirmedUsers = req.qtyUnconfirmedUsers;
        res.render('profile', {title, pageHeader, footerDepartName, user, firstName, lastName, passOut, admin, qtyUnconfirmedUsers})
    } else {
        res.redirect('/home')
    }
});

router.get('/profileOutlook', access, selectUserData, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Konto';
        const pageHeader = "Moje konto";
        const footerDepartName = "Account settings";
        const user = req.user;
        const passOut = req.passOut;
        const admin = req.admin;
        const qtyUnconfirmedUsers = req.qtyUnconfirmedUsers;
        res.render('profile', {title, pageHeader, footerDepartName, user, passOut, admin, qtyUnconfirmedUsers})
    } else {
        res.redirect('/home')
    }
});

router.get('/admin', access, selectUserData, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Konto';
        const pageHeader = "Panel administracyjny";
        const footerDepartName = "Admin panel";
        const user = req.user;
        const passOut = req.passOut;
        const admin = req.admin;
        const allUsers = req.allUsers;
        const unconfirmedUsers = req.unconfirmedUsers;
        const qtyUnconfirmedUsers = req.qtyUnconfirmedUsers;
        res.render('admin', {title, pageHeader, footerDepartName, user, passOut, admin, qtyUnconfirmedUsers, allUsers, unconfirmedUsers})
    } else {
        res.redirect('/home')
    }
});

router.get('/logout', logout);

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/unconfirmedUsers', unconfirmedUsers);
router.post('/auth/deleteUsers', deleteUsers);
router.post('/auth/changeUsers', changeUsers);

module.exports = router;