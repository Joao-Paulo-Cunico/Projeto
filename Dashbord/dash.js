const input_receita = document.getElementById("input-receita");
const btn_receita = document.getElementById("btn-receita");
const lista_receitas = document.getElementById("lista-receita");

btn_receita.addEventListener("click", function(){
    const valor = input_receita.value;

    const novaReceita = document.createElement("p");

    novaReceita.textContent = `Receita: R$ ${valor}`

    lista_receitas.appendChild(novaReceita);
})