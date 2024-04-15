function checkPassword(password) {

    const lowercaseLetters = "qwertyuiopasdfghjklzxcvbnm";
    const uppercaseLetters = "QWERTYUIOPLKJHGFDSAZXCVBNM";
    const numbers = "0123456789";
    const specialSymbols = "!@#$%^&*()_-+=\|/.,:;[]{}";

    let is_lowercaseLetters = false;
    let is_uppercaseLetters = false;
    let is_numbers = false;
    let is_specialSymbols = false;

    for (let i=0; i < password.length; i++) {

        if (!is_lowercaseLetters && lowercaseLetters.indexOf(password[i]) != -1) is_lowercaseLetters = true;
        if (!is_uppercaseLetters && uppercaseLetters.indexOf(password[i]) != -1) is_uppercaseLetters = true;
        if (!is_numbers && numbers.indexOf(password[i]) != -1) is_numbers = true;
        if (!is_specialSymbols && specialSymbols.indexOf(password[i]) != -1) is_specialSymbols = true;

    }

    if (!is_lowercaseLetters || !is_uppercaseLetters || !is_numbers || !is_specialSymbols) {
        return "Password isn't correct"
    } else {
        return "Password is correct"
    }
}

module.exports = checkPassword;