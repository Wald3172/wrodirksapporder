const express = require('express');
const router = express.Router();
const access = require('../controllers/auth/access');
const selectApps = require('../controllers/order/selectApps');
const selectUserData = require('../controllers/order/selectUserData');

router.get('/order', access, selectApps, selectUserData, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Order';
        const pageHeader = "Order Management";
        const footerDepartName = "Order Management";
        const links = req.links;
        const cotTrailer = req.cotTrailer;
        const cotAll = req.cotAll;
        const user = req.user;
        const passOut = req.passOut;
        const admin = req.admin;
        const qtyUnconfirmedUsers = req.qtyUnconfirmedUsers;
        res.render('order', {title, pageHeader, links, cotTrailer, footerDepartName, user, passOut, admin, qtyUnconfirmedUsers, cotAll})
    } else {
        res.redirect('/home')
    }
});

router.get('/order/zglaszanie_naczep_sb', access, selectApps, selectUserData, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Zgłaszanie naczep/SB';
        const pageHeader = "Zgłaszanie naczep/SB";
        const footerDepartName = "Order Management";
        const breadcrumbs = [
            {
                name: 'Order Management',
                href: '/order'
            }
        ];
        const links = req.links;
        const cotTrailer = req.cotTrailer;
        const cotSB = req.cotSB;
        const user = req.user;
        const passOut = req.passOut;
        const admin = req.admin;
        const qtyUnconfirmedUsers = req.qtyUnconfirmedUsers;
        res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, footerDepartName, user, passOut, admin, qtyUnconfirmedUsers})
    } else {
        res.redirect('/home')
    }
});

router.get('/order/capacity', access, selectApps, selectUserData, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Capacity';
        const pageHeader = "Capacity";
        const footerDepartName = "Order Management";
        const breadcrumbs = [
            {
                name: 'Order Management',
                href: '/order'
            }
        ];
        const links = req.links;
        const cotTrailer = req.cotTrailer;
        const cotSB = req.cotSB;
        const dateDefault = new Date().toISOString().substr(0, 10);
        const user = req.user;
        const passOut = req.passOut;
        const admin = req.admin;
        const qtyUnconfirmedUsers = req.qtyUnconfirmedUsers;
        res.render('capacity', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, dateDefault, footerDepartName, user, passOut, admin, qtyUnconfirmedUsers})
    } else {
        res.redirect('/home')
    }
});

router.get('/order/grafik_outbound', access, selectApps, selectUserData, (req, res) => {
    if (req.user) {
        const title = 'WRO Dirks App | Grafik Outbound';
        const pageHeader = "Grafik Outbound";
        const footerDepartName = "Order Management";
        const breadcrumbs = [
            {
                name: 'Order Management',
                href: '/order'
            }
        ];
        const links = req.links;
        const cotTrailer = req.cotTrailer;
        const cotSB = req.cotSB;
        const user = req.user;
        const passOut = req.passOut;
        const admin = req.admin;
        const qtyUnconfirmedUsers = req.qtyUnconfirmedUsers;
        res.render('grafik_outbound', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, footerDepartName, user, passOut, admin, qtyUnconfirmedUsers})
    } else {
        res.redirect('/home')
    }
});

module.exports = router;