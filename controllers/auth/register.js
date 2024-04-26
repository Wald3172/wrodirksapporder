const poolUser = require('../../config/dbConfigUser');
const bcrypt = require('bcryptjs');
const checkPassword = require('../helpers/checkPassword');
const registerMail = require('../../mails/registerMail')

const register = async (req, res) => {

    // data from req.body
    let { firstName, lastName, email, password, passwordConfirm } = req.body;

    // preparing data
    const title = 'WRO Dirks App | Rejestracja';
    const hrefRedirect = '/start'
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();

    // check if the user is in the database
    try {

        conn = await poolUser.getConnection();

        const result = await conn.query("SELECT email FROM user WHERE email = ?", [email])

        // user is in database
        if (result.length > 0) {
            return res.render('register', {
                errorMsg: 'Użytkownik o tym adresie e-mail jest już zarejestrowany', firstName, lastName, email, title
            });
        // is the password correct
        } else if (checkPassword(password) == `Password isn't correct`) {
            return res.render('register', {
                errorMsg: 'Hasło powinno zawierać: małe litery, duże litery, cyfry oraz znaki specjalne', firstName, lastName, email, title
            });
        // are passwords a match
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                errorMsg: 'Hasła się nie zgadzają', firstName, lastName, email, title
            }); 
        // is email at dirks-group.de
        } else if (email.slice(-15) !== '@dirks-group.de') {
            return res.render('register', {
                errorMsg: 'Podany email nie jest @dirks-group.de', firstName, lastName, email, title
            }); 
        // save user in the database
        } else {
            // hash password
            const hashedPassword = await bcrypt.hash(password, 8);
            // create username
            const user = email.slice(0, email.length-15);
            // to database 'user'
            await conn.query("INSERT INTO user (user, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)", [user, firstName, lastName, email, hashedPassword]);
            // send mail to the admin group
            registerMail(user, firstName, lastName, email);
            // info 'success'
            return res.render('register', {
                successMsg: 'Konto zostało utworzone. Po potwierdzeniu przez administratora będzie nadany dostęp do aplikacji.', title, hrefRedirect
            }); 
        }

    } catch (error) {
        console.log(error);
    } finally {
        if (conn) conn.end();
    }

}

module.exports = register;