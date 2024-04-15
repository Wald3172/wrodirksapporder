const poolUser = require('../../config/dbConfigUser');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");

const saveUserData = async (req, res) => {
    
    const { firstName, lastName } = req.body;
    
    if (req.cookies.userSave) {

        let conn;

        try {
            // verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);
            
            conn = await poolUser.getConnection();
    
            // update user info in the table 'user'
            await conn.query("UPDATE user SET first_name = ?, last_name = ? WHERE id = ?", [firstName, lastName, decoded.id]);
    
        } catch (error) {
            console.log(error);
        } finally {
            if (conn) conn.end();
            return res.redirect ('/profile')
        }

    } else {
        console.log(error);
    }
}

module.exports = saveUserData;