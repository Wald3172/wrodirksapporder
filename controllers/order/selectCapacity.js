const poolStany = require('../../config/dbConfigStany');
const pool = require('../../config/dbConfig');

const selectCapacity = async (req, res) => {

    const { dateStart } = req.body;

    const title = 'WRO Dirks App | Capacity';
    const pageHeader = "Capacity";
    const breadcrumbs = [
        {
            name: 'Order Management',
            href: '/order'
        }
    ];

    let conn;

    try {
        conn = await pool.getConnection();

        const links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");

        if (conn) conn.end();

        try {
            conn = await poolStany.getConnection();
    
            const capacity = await conn.query("SELECT date, PC_qty, Percent_over FROM outbound_plan WHERE date = ?", [dateStart]);
            console.log(capacity);
            req.capacity = capacity;
    
            if (conn) conn.end();
    
            res.render('capacity', {title, pageHeader, breadcrumbs, links, capacity, dateStart});

        } catch (error) {
            if (conn) conn.end();
            console.log(error);
        }

        if (conn) conn.end();

    } catch (error) {
        if (conn) conn.end();
        console.log(error);
    }

}

module.exports = selectCapacity;