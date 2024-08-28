"use strict"

window.onload = function () {
    const form = document.querySelector('form');
    const btnReset = document.getElementById('btnReset');
    const addButton = document.getElementById('add');
    const removeButton = document.getElementById('remove');
    var dropdownHoras = document.querySelectorAll('#horas');
    const diasSemana = document.querySelectorAll('.dias-semana');
    const originalDropdown = document.querySelector('.dropdowns');
    const lista = document.getElementById('lista');

    form.addEventListener('submit', function (evt) {
        evt.preventDefault();

        submit();
    });


    btnReset.addEventListener('click', function () {
        clearDropdown();
    })

    addButton.addEventListener('click', function (evt) {
        addDropdown(originalDropdown, lista);
    });

    removeButton.addEventListener('click', function (evt) {
        removeLastDropdown();
    })

    getTempo();
    getHoras(dropdownHoras[0], 'semana');
    diasSemana[0].addEventListener('change', function (evt) {
        if (evt.target.value === 'segunda-sexta') {
            getHoras(dropdownHoras[0], 'semana');
        } else {
            getHoras(dropdownHoras[0], 'fds');
        }
    });

    document.querySelector('.quantidades').addEventListener('input', function (e) {
        if (this.value.length > 3) {
            this.value = this.value.slice(0, 3); // Truncate to first 3 digits
        }
    });

};

function submit() {
    const price = document.getElementById('price');
    const tax = document.getElementById('tax');
    const ipaca = document.getElementById('ipaca');
    const finprice = document.getElementById('finprice');
    const dropdownsList = document.querySelectorAll(".dropdowns");
    const infoArr = [];
    dropdownsList.forEach(line => {
        infoArr.push(getValuesFromDropdowns(line));
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/info', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.error) {
                    console.log(response.error);
                } else {
                    const info = response.info;
                    const totalPrice = info.totalPrice.toLocaleString(undefined, { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
                    const taxPrice = info.taxPrice.toLocaleString(undefined, { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
                    const ipacaPrice = info.ipacaPrice.toLocaleString(undefined, { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
                    const finalPrice = info.finalPrice.toLocaleString(undefined, { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
                    price.value = totalPrice;
                    tax.value = taxPrice;
                    ipaca.value = ipacaPrice;
                    finprice.value = finalPrice;
                }
            } else {
                console.log('Error:', xhr.status);
            }
        }
    };
    xhr.send(JSON.stringify({ info: infoArr }));
}

function getValuesFromDropdowns(dropdownsElement) {
    // Assuming the structure of your "dropdowns" div is consistent
    const horasValue = dropdownsElement.children[1].querySelector("select").value;
    const tempoValue = dropdownsElement.children[2].querySelector("select").value;
    const quantidadeValue = dropdownsElement.children[3].querySelector("input").value;

    return {
        coordenada: tempoValue + horasValue,
        quantity: quantidadeValue
    };
}

function addDropdown(originalDropdown, lista) {
    var clonedDropdown = originalDropdown.cloneNode(true);
    const childrenSize = clonedDropdown.children.length;
    let lastChild = clonedDropdown.children[childrenSize - 1];
    lastChild.children[1].value = '';
    lista.appendChild(clonedDropdown);
    const diasSemanaList = document.querySelectorAll('.dias-semana');
    const dropdownHorasList = document.querySelectorAll('.horas');
    const size = document.querySelectorAll('.horas').length;
    diasSemanaList[size - 1].addEventListener('change', function (evt) {
        const horas = dropdownHorasList[size - 1];
        if (evt.target.value === 'segunda-sexta') {
            getHoras(horas, 'semana');
        } else {
            getHoras(horas, 'fds');
        }
    });
}

function removeLastDropdown() {
    var lista = document.getElementById('lista');
    var dropdowns = lista.querySelectorAll('.dropdowns');

    // Check if there are any dropdowns to remove
    if (dropdowns.length > 1) {
        // Remove the last dropdown
        lista.removeChild(dropdowns[dropdowns.length - 1]);
    }
}

function clearDropdown() {
    var lista = document.getElementById('lista');
    var dropdowns = lista.querySelectorAll('.dropdowns');

    // Check if there are more than one dropdowns to remove
    if (dropdowns.length > 1) {
        // Remove all dropdowns except the first one
        for (var i = dropdowns.length - 1; i > 0; i--) {
            lista.removeChild(dropdowns[i]);
        }
    }
}

function getHoras(dropdownHoras, dias) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/horas/${dias}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.error) {
                    console.log(response.error);
                } else {
                    const horasArr = response.horas;
                    dropdownHoras.replaceChildren();
                    const vazio = document.createElement('option');
                    vazio.setAttribute('hidden', true);
                    vazio.setAttribute('disabled', true);
                    vazio.setAttribute('selected', true);
                    dropdownHoras.appendChild(vazio);
                    for (let i = 0; i < horasArr.length; i++) {
                        const option = document.createElement('option');
                        if (dias === 'fds') {
                            option.setAttribute('value', i + 10);
                        } else {
                            option.setAttribute('value', i + 2);
                        }
                        option.innerText = horasArr[i];
                        dropdownHoras.appendChild(option);
                    }
                }
            } else {
                console.log('Error:', xhr.status);
            }
        }
    };
    xhr.send();
}

function getTempo() {
    var dropdownTempo = document.getElementById('tempo');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/tempos', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.error) {
                    console.log(response.error);
                } else {
                    const temposArr = response.tempos;
                    let character = "B".charCodeAt(0);
                    for (let i = 0; i < temposArr.length; i++) {
                        const option = document.createElement('option');
                        const value = String.fromCharCode(character++);
                        option.setAttribute('value', value);
                        option.innerText = temposArr[i];
                        dropdownTempo.appendChild(option);
                    }
                }
            } else {
                console.log('Error:', xhr.status);
            }
        }
    };
    xhr.send();
}

function removerSegundos(params) {
    let value = "";
    for (let i = 0; i < params.length; i++) {
        if (params[i] == '\"') {
            break;
        }
        value += params[i];
    }
    return value;
}