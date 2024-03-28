const express = require('express');
const router = express.Router();
const selectApps = require('../controllers/order/selectApps');

router.get('/order', selectApps, (req, res) => {
    const title = 'WRO Dirks App | Order';
    const pageHeader = "Order Management";
    // const breadcrumbs = [
    //     {
    //         name: 'Punkt 1',
    //         href: '#'
    //     },
    //     {
    //         name: 'Punkt 2',
    //         href: '#'
    //     },
    //     {
    //         name: 'Punkt 3',
    //         href: '#'
    //     }
    // ];
    // const appsZlecenia = req.appsZlecenia;
    // const appsTransporty = req.appsTransporty;
    const links = req.links;
    const cotTrailer = req.cotTrailer;

    res.render('order', {title, pageHeader, links, cotTrailer})
});

router.get('/order/zglaszanie_naczep_sb', selectApps, (req, res) => {
    const title = 'WRO Dirks App | Zgłaszanie naczep/SB';
    const pageHeader = "Zgłaszanie naczep/SB";
    const breadcrumbs = [
        {
            name: 'Order Management',
            href: '/order'
        }
    ];
    const links = req.links;
    const cotTrailer = req.cotTrailer;
    const cotSB = req.cotSB;

    res.render('zglaszanie_naczep_sb', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB})
});

router.get('/order/capacity', selectApps, (req, res) => {
    const title = 'WRO Dirks App | Capacity';
    const pageHeader = "Capacity";
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

    res.render('capacity', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB, dateDefault})
});

router.get('/order/grafik_outbound', selectApps, (req, res) => {
    const title = 'WRO Dirks App | Grafik Outbound';
    const pageHeader = "Grafik Outbound";
    const breadcrumbs = [
        {
            name: 'Order Management',
            href: '/order'
        }
    ];
    const links = req.links;
    const cotTrailer = req.cotTrailer;
    const cotSB = req.cotSB;

    res.render('grafik_outbound', {title, pageHeader, breadcrumbs, links, cotTrailer, cotSB})
});







// router.get('/order/checklista-zlecenia', (req, res) => {
//     const pageHeader = "Checklista zlecenia";
//     // const appsZlecenia = req.appsZlecenia;
//     // const appsTransporty = req.appsTransporty;
//     // const appsInne = req.appsInne;

//     res.render('order-checklista', {title, pageHeader})
// });

// router.get('/order/checklista-transporty', (req, res) => {
//     const pageHeader = "Checklista transporty";
//     // const appsZlecenia = req.appsZlecenia;
//     // const appsTransporty = req.appsTransporty;
//     // const appsInne = req.appsInne;

//     res.render('order-checklista', {title, pageHeader})
// });

module.exports = router;