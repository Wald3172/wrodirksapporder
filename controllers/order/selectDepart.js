const pool = require('../../config/dbConfig');

const selectDepart = async (req, res, next) => {

    let conn;

    try {
        conn = await pool.getConnection();

        const depart = await conn.query("SELECT depart_name, depart_href from depart");

        req.depart = depart;

        if (conn) conn.end();
        next();

    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = selectDepart;