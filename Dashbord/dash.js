const saldo = document.getElementById("saldo");
let saldoTotal = 0;

//BOTOES
//DESCRICAO
const input_descricao_receita = document.getElementById("descricao-receita");
const input_descricao_despesa = document.getElementById("descricao-despesa");
//RECEITA
const input_receita = document.getElementById("input-receita");
const btn_receita = document.getElementById("btn-receita");
const lista_receitas = document.getElementById("lista-receita");
//DESPESA
const lista_despesa = document.getElementById("lista-despesa");
const input_despesa = document.getElementById("input-despesa");
const btn_despesa = document.getElementById("btn-despesa");

//ADICIONAR RECEITA
btn_receita.addEventListener("click", function () {
    const tipo = String("receita");
    const valor = Number(input_receita.value);
    const descricao = String(input_descricao_receita.value);

    if(!validarValor(valor)){
        return;
    }

    saldoTotal += valor;

    atualizarSaldo();

    const item = document.createElement("div");

    const novaReceita = document.createElement("p");
    
    novaReceita.textContent = `Receita: ${descricao} R$ ${valor}`;
    
    const botao = criarBotaoExcluir(item, valor, tipo);
    
    item.appendChild(novaReceita);
    item.appendChild(botao);
    lista_receitas.appendChild(item);
    
    input_receita.value = "";
    input_descricao_receita.value = "";
})

//ADICIONAR DESPESA
btn_despesa.addEventListener("click", function () {
    const tipo = String("despesa");
    const valor = Number(input_despesa.value);
    const descricao = String(input_descricao_despesa.value);
    
    if (!validarValor(valor)) {
        return;
    }

    saldoTotal -= valor;
    
    atualizarSaldo();

    const novaDespesa = document.createElement("p");

    const itemDespesa = document.createElement("div");
    
    novaDespesa.textContent = `Despesa: ${descricao} R$ ${valor}`;
    
    const botao = criarBotaoExcluir(itemDespesa, valor, tipo);
    
    itemDespesa.appendChild(novaDespesa);
    itemDespesa.appendChild(botao);
    lista_despesa.appendChild(itemDespesa);
    
    input_despesa.value = "";
    input_descricao_despesa.value = "";
})


function atualizarSaldo(){
    saldo.textContent = `Saldo: R$ ${saldoTotal}`;
}

function validarValor(valor){
    if (valor <= 0) {
        alert("Digite numeros Positivos")
        return false;
    }
    return true;
}

function criarBotaoExcluir(item, valor, tipo){
    const botao = document.createElement("button");
    
    botao.textContent = `Excluir`;
    
    botao.addEventListener("click", function () {

        if (tipo === "receita") {
            saldoTotal -= valor;
        } 
        else {
            saldoTotal += valor;
        }
        
        atualizarSaldo();
        
        item.remove();
    })

    return botao;
}