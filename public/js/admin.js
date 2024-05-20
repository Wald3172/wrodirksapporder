function openModalConfirmUser (id) {
    const modalUserId = document.getElementById('modalUserId');
    const modalUser = document.getElementById('modalUser');
    const modalName = document.getElementById('modalName');
    const modalLastName = document.getElementById('modalLastName');
    const modalEmail = document.getElementById('modalEmail');

    const inputUser = document.getElementById(`${id}_user`).value;
    const inputName = document.getElementById(`${id}_first_name`).value;
    const inputLastName = document.getElementById(`${id}_last_name`).value;
    const inputEmail = document.getElementById(`${id}_email`).value;

    modalUserId.value = id;
    modalUser.value = inputUser;
    modalName.value = inputName;
    modalLastName.value = inputLastName;
    modalEmail.value = inputEmail;
}

function openModalDeleteUser (id) {
    const modalUserId = document.getElementById('modalUserIdDelete');
    const modalText = document.getElementById('modalTextDelete');
    const modalEmail = document.getElementById('modalDeleteEmail');
    const inputEmail = document.getElementById(`${id}_email`).value;

    modalUserId.value = id;
    modalEmail.value = inputEmail;
    modalText.textContent = `Czy na pewno chcesz usunąć konto ${inputEmail}?`;
}

function openModalChangeUser (id) {
    const modalUserId = document.getElementById('modalUserIdChange');
    const modalUser = document.getElementById('modalUserChange');
    const modalName = document.getElementById('modalNameChange');
    const modalLastName = document.getElementById('modalLastNameChange');
    const modalEmail = document.getElementById('modalEmailChange');
    const modalRoleChange1 = document.getElementById('modalRoleChange1');
    const modalRoleChange2 = document.getElementById('modalRoleChange2');

    const inputUser = document.getElementById(`${id}_user`).value;
    const inputName = document.getElementById(`${id}_first_name`).value;
    const inputLastName = document.getElementById(`${id}_last_name`).value;
    const inputEmail = document.getElementById(`${id}_email`).value;
    const inputRole = document.getElementById(`${id}_role`).value;

    modalUserId.value = id;
    modalUser.value = inputUser;
    modalName.value = inputName;
    modalLastName.value = inputLastName;
    modalEmail.value = inputEmail;
    if (inputRole === 'admin') {
        modalRoleChange1.checked = false;
        modalRoleChange2.checked = true;
    } else {
        modalRoleChange1.checked = true;
        modalRoleChange2.checked = false;
    }
}