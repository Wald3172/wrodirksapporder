const pool = require('../../config/dbConfig');

const selectKamagDefects = async (req, res, next) => {

    let conn;

    try {
        conn = await pool.getConnection();

        const defectsNoted = await conn.query("SELECT * FROM usterki_kamag WHERE status = 'zgłoszone' order by id");
        const defectsRepaired = await conn.query("SELECT * FROM usterki_kamag WHERE status = 'naprawione' order by id");

        req.defectsNoted = defectsNoted;
        req.defectsRepaired = defectsRepaired;

        if (conn) conn.end();
        next();

    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = selectKamagDefects;