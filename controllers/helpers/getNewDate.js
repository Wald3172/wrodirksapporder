function getYesterdayDate(n) {
    // Получаем текущую дату
    const today = new Date();
  
    // Вычитаем один день из текущей даты
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - n);
  
    // Форматируем дату в нужный формат "yyyy-mm-dd"
    const formattedDate = yesterday.toISOString().slice(0, 10);
  
    return formattedDate;
}

module.exports = getYesterdayDate;