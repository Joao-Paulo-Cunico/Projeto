const saldo = document.getElementById("saldo");
let saldoTotal = 0;

//BOTOES
const input_receita = document.getElementById("input-receita");
const btn_receita = document.getElementById("btn-receita");
const lista_receitas = document.getElementById("lista-receita");

const lista_despesa = document.getElementById("lista-despesa");
const input_despesa = document.getElementById("input-despesa");
const btn_despesa = document.getElementById("btn-despesa");

btn_receita.addEventListener("click", function () {
    const valor = Number(input_receita.value);
    const novaReceita = document.createElement("p");

    if (valor === "" || valor <= 0) {
        alert("Digite numeros Positivos")
        return;
    }

    saldoTotal += valor;

    saldo.textContent = `Saldo: R$ ${saldoTotal}`;

    novaReceita.textContent = `Receita: R$ ${valor}`

    lista_receitas.appendChild(novaReceita);

    input_receita.value = "";
})

btn_despesa.addEventListener("click", function () {
    const valor = Number(input_despesa.value);
    const novaDespesa = document.createElement("p");

    if (valor === "" || valor <= 0) {
        alert("Digite numeros Positivos")
        return;
    }

    saldoTotal -= valor;

    saldo.textContent = `Saldo: R$ ${saldoTotal}`;

    novaDespesa.textContent = `Despesa: R$ ${valor}`

    lista_despesa.appendChild(novaDespesa);
})