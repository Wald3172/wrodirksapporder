const pool = require('../../config/dbConfig');

const selectApps = async (req, res, next) => {

    let conn;

    try {
        conn = await pool.getConnection();

        const links = await conn.query("SELECT app_name, href, img FROM apps WHERE app_type = 'link' order by priority");
        const cotTrailer = await conn.query("SELECT DISTINCT cot FROM list_of_cot WHERE sb='trailer'");
        const cotSB = await conn.query("SELECT DISTINCT cot FROM list_of_cot WHERE sb='container'");

        req.links = links;
        req.cotTrailer = cotTrailer;
        req.cotSB = cotSB;

        if (conn) conn.end();
        next();

    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = selectApps;