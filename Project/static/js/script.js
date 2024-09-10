document.querySelectorAll('.deleteButtonService').forEach(button => {
    button.addEventListener('click', function() {
        const serviceIdToDelete = this.dataset.serviceId;
        const cardToRemove = this.closest('.card');
        fetch(`/deleteService/${serviceIdToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.ok) {
                alert('Сервис успешно удален');
                cardToRemove.remove();
            } else {
                alert('Ошибка удаления сервиса: ' + response.statusText);
            }
        }).catch(error => {
            console.error('Ошибка сети:', error);
        });
    });
});

document.querySelectorAll('.deleteButtonEmployee').forEach(button => {
    button.addEventListener('click', function() {
        const employeeIdToDelete = this.dataset.employeeId;
        console.log(employeeIdToDelete);
        const cardToRemove = this.closest('.card');

        fetch(`/deleteEmployee/${employeeIdToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.ok) {
                    alert('Сотрудник успешно удален');
                    cardToRemove.remove();
                } else {
                    alert('Ошибка удаления сотрудника: ' + response.statusText);
                }
            })
            .catch(error => {
                console.error('Ошибка сети:', error);
            });
    });
});


document.getElementById('updateServiceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const serviceIdToUpdate = window.location.pathname.split('/').pop();
    const formData = new FormData(this);

    const updatedServiceData = {
        serviceName: formData.get('serviceName'),
        serviceDescription: formData.get('serviceDescription'),
        serviceImage: formData.get('serviceImage'),
        servicePrice: formData.get('servicePrice')
    };
    console.log(updatedServiceData);

    fetch(`/updateService/${serviceIdToUpdate}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedServiceData)
    }).then(response => {
        if (response.ok) {
            alert('Сервис успешно обновлен');
            window.location.href = 'https://localhost:3000/services'; // Перенаправление
        } else {
            alert('Ошибка обновления сервиса: ' + response.statusText);
        }
    }).catch(error => {
        console.error('Ошибка сети:', error);
    });
});


// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('searchForm').addEventListener('submit', async function(event) {
//         event.preventDefault();
//
//         const searchInput = document.getElementById('searchInput').value;
//
//             const response = await fetch(`/searchEmployee?query=${searchInput}`, {
//                 method: 'GET',
//             }).then(async (response) => {
//                 const data = await response.json()
//                 console.log("data:" + data);
//                 if (response.ok) {
//                     alert("Результат поиска сотрудников");
//                     response.render('employees', {
//                         employees: data,
//                     });
//                 }
//                 else
//                     throw new Error('Ошибка: ' + response.status);
//             })
//     });
// });
