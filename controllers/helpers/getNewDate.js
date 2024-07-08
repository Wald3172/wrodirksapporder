function getNewDate(n) {

    const today = new Date();
    const newDate = new Date(today);
    newDate.setDate(today.getDate() - n);
    const formattedDate = newDate.toISOString().slice(0, 10);
  
    return formattedDate;
}

module.exports = getNewDate;