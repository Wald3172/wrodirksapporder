function openModalDeleteRecord (id) {
    const modalUserId = document.getElementById('modalUserIdDelete');
    modalUserId.value = id;
}

function openModalConfirmRecord (id) {
    const modalUserId = document.getElementById('modalUserIdConfirm');
    modalUserId.value = id;
}

function filterKamagTable () {
    const selectKamag = document.getElementById('selectKamag').value;
    const selectStatus = document.getElementById('selectStatus').value;
    const kamag = document.querySelectorAll('.kamag');
    const status = document.querySelectorAll('.status');
    if (selectStatus !== 'all') {
        for (let i = 0; i < status.length; i++) {
            if (kamag[i].innerText === selectKamag && status[i].innerText === selectStatus) {
                kamag[i].parentElement.classList.remove('displayNone')
            } else {
                kamag[i].parentElement.classList.add('displayNone');
            }
        }
    } else {
        kamag.forEach(element => {
            if (element.innerText === selectKamag) {
                element.parentElement.classList.remove('displayNone');
            } else {
                element.parentElement.classList.add('displayNone');
            }
        });
    }
}



