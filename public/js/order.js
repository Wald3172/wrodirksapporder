document.addEventListener('DOMContentLoaded', (event) => {
    reportDate = document.querySelectorAll('.report-date');
    reportDate.forEach(element => {
        element.value = new Date().toISOString().substr(0, 10);
   });
  });

document.addEventListener('DOMContentLoaded', (event) => {
    reportDate = document.querySelectorAll('.dateFormat');
    reportDate.forEach(element => {
        let day = element.innerHTML.slice(8, 10);
        let month = element.innerHTML.slice(4, 7);
        let year = element.innerHTML.slice(11, 15);
        element.innerHTML = `${day} ${month} ${year}`;
   });
  });

function toggle(idElement, idCheckbox) {
    const element = document.getElementById(idElement);
    const checkbox = document.getElementById(idCheckbox);
    if (checkbox.checked === true) {
        element.classList.remove("displayNone");
        element.classList.add("displayBlock");
    } else if (checkbox.checked === false) {
        element.classList.add("displayNone");
        element.classList.remove("displayBlock");
    }
}

function closeModalInfo(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('displayBlock');
}

function btnDisable(id1, id2) {
    const btn1 = document.getElementById(id1);
    const btn2 = document.getElementById(id2);
    btn1.classList.add("displayNone");
    btn2.classList.remove("displayNone");
    btn2.classList.add("displayBlock");
}

function viewPassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
} 

function changeData() {
    const myDate = document.querySelectorAll('.myDate');
    myDate.forEach(element => {
        if (element.innerText) {
            let date = new Date(element.innerText);
            function addLeadingZero(num) {
                return num < 10 ? '0' + num : num;
            }
            let day = addLeadingZero(date.getDate());
            let month = addLeadingZero(date.getMonth() + 1);
            let year = date.getFullYear();
            let hours = addLeadingZero(date.getHours());
            let minutes = addLeadingZero(date.getMinutes());
            let seconds = addLeadingZero(date.getSeconds());
            let formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
            element.innerText = formattedDate;
        }
    });
}

changeData();