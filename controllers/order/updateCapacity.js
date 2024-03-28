const poolStany = require('../../config/dbConfigStany');

const updateCapacity = async (req, res) => {

    const { date, capacity, percent } = req.body;
    console.log(req.body);

    const SQLcapacity = Number(capacity);
    // const SQLpercent = Number(percent);

    let conn;

    try {
        conn = await poolStany.getConnection();

        await conn.query("UPDATE outbound_plan SET PC_qty = ? and Percent_over = ? WHERE Date = ?", [SQLcapacity, percent, date]);

        if (conn) conn.end();

        res.redirect('/order/capacity');

    } catch (error) {
        if (conn) conn.end();
        console.log(error);
    }

}

module.exports = updateCapacity;