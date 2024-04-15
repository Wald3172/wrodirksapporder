const express = require('express');
const router = express.Router();
const access = require('../controllers/auth/access');
const depart = require('../controllers/order/selectDepart');
const selectUserData = require('../controllers/order/selectUserData');
const register = require('../controllers/auth/register');
const login = require('../controllers/auth/login');
const logout = require('../controllers/auth/logout');

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
        res.render('profile', {title, pageHeader, footerDepartName, user, firstName, lastName, passOut})
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
        res.render('profile', {title, pageHeader, footerDepartName, user, passOut})
    } else {
        res.redirect('/home')
    }
});

router.get('/logout', logout);

router.post('/auth/register', register);
router.post('/auth/login', login);

module.exports = router;