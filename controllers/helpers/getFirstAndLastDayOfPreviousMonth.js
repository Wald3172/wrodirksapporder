function getFirstAndLastDayOfPreviousMonth() {
    // Создаем объект Date для текущей даты
    const today = new Date();
    
    // Получаем месяц и год предыдущего месяца
    const previousMonth = today.getMonth() - 1;
    const year = previousMonth === -1 ? today.getFullYear() - 1 : today.getFullYear();
    const month = previousMonth === -1 ? 11 : previousMonth;
    
    // Создаем дату для первого дня предыдущего месяца
    const firstDay = new Date(year, month, 1);
    
    // Создаем дату для последнего дня предыдущего месяца
    const lastDay = new Date(year, month + 1, 0);
    
    // Форматируем даты в строку "yyyy-mm-dd"
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay)
    };
}

module.exports = getFirstAndLastDayOfPreviousMonth;