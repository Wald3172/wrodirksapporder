const logout = (req, res) => {

    res.clearCookie('userSave');
    res.status(200).redirect("/home");
}

module.exports = logout;