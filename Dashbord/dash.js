const saldo = document.getElementById("saldo");
let saldoTotal = 0;

//BOTOES
const input_descricao_receita = document.getElementById("descricao-receita");
const input_descricao_despesa = document.getElementById("descricao-despesa");

const input_receita = document.getElementById("input-receita");
const btn_receita = document.getElementById("btn-receita");
const lista_receitas = document.getElementById("lista-receita");

const lista_despesa = document.getElementById("lista-despesa");
const input_despesa = document.getElementById("input-despesa");
const btn_despesa = document.getElementById("btn-despesa");

//ADICIONAR RECEITA
btn_receita.addEventListener("click", function () {
    const valor = Number(input_receita.value);
    const descricao = String(input_descricao.value);

    if (valor <= 0) {
        alert("Digite numeros Positivos")
        return;
    }

    const novaReceita = document.createElement("p");
    const deletarReceita = document.createElement("button");
    const item = document.createElement("div");


    saldoTotal += valor;

    saldo.textContent = `Saldo: R$ ${saldoTotal}`;

    novaReceita.textContent = `Receita: ${descricao} R$ ${valor}`;

    deletarReceita.textContent = `Excluir`;

    deletarReceita.addEventListener("click", function () {
        saldoTotal -= valor;

        saldo.textContent = `Saldo: R$ ${saldoTotal}`;

        item.remove();
    })

    item.appendChild(novaReceita);
    item.appendChild(DeletarReceita);
    lista_receitas.appendChild(item);

    input_receita.value = "";
    input_descricao_receita.value = "";
})

//ADICIONAR DESPESA
btn_despesa.addEventListener("click", function () {
    const valor = Number(input_despesa.value);
    const descricao = String(input_descricao.value);

    const novaDespesa = document.createElement("p");
    const deletarDespesa = document.createElement("button");
    const item_despesa = document.createElement("div");

    if (valor <= 0) {
        alert("Digite numeros Positivos")
        return;
    }

    saldoTotal -= valor;

    saldo.textContent = `Saldo: R$ ${saldoTotal}`;

    novaDespesa.textContent = `Despesa: ${descricao} R$ ${valor}`

    deletarDespesa.textContent = `Excluir`;

    deletarDespesa.addEventListener("click", function(){
        saldoTotal -= valor;
        saldo.textContent = `Saldo: R$ ${saldoTotal}`;
        item_despesa.remove();
    })

    item_despesa.appendChild(novaDespesa);
    lista_despesa.appendChild(item);

    input_despesa.value = "";
    input_descricao_despesa.value = "";
})