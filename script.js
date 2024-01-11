// -------------------------------------- Compensação de rolagem

const linksAncora = document.querySelectorAll("a");
linksAncora.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const anchorId = this.getAttribute("href");
    rolar(anchorId);
  })
})

function rolar(anchorId) {
  const alturaGuia = document.querySelector("#guia").offsetHeight;
  const targetElement = document.querySelector(anchorId);

  if (targetElement) {
    const targetOffsetTop = targetElement.offsetTop - alturaGuia - 35;
    window.scrollTo({
      top: targetOffsetTop,
      behavior: "smooth",
    })
  }
}

// ----------------------- Funções para orçamento abaixo

const produtos = [
  {
    tipo: "Nobres", cortes: [
      { nome: "Picanha", valor: 59.99 },
      { nome: "Prime Rib", valor: 59.99 },
      { nome: "Wagyu", valor: 590 },
      { nome: "Chorizo", valor: 51.99 },
    ]
  },
  {
    tipo: "Bovinas", cortes: [
      { nome: "Bife Ancho", valor: 79.90 },
      { nome: "Baby Beef", valor: 59.90 },
      { nome: "T-Bone", valor: 49.99 },
      { nome: "Maminha", valor: 33.99 },
    ]
  },
  {
    tipo: "Aves", cortes: [
      { nome: "Cortes de Pato", valor: 33.98 },
      { nome: "Codorna Européia", valor: 39.99 },
      { nome: "Cortes de Frango", valor: 17.99 },
      { nome: "Cortes de Avestruz", valor: 69.99 },
    ]
  },
  {
    tipo: "Exóticas", cortes: [
      { nome: "Carne de Coelho", valor: 129.99 },
      { nome: "Carne de Javali", valor: 149.99 },
      { nome: "Carne de Rã", valor: 60 },
      { nome: "Carne de Jacaré", valor: 125 },
    ]
  },
  {
    tipo: "Frutos do Mar", cortes: [
      { nome: "Frutos do Mar", valor: 70.50 }
    ]
  },
];

const selecOrcamentoTipo = document.querySelectorAll(".formulario---orcamento--dropdown")[0];

const dropdownOrcamentoTipo = document.querySelectorAll(".formulario---orcamento .dropdown--item")[0];

let orcamentoTipo;

dropdownOrcamentoTipo.style.display = "none";

function revelarTipo() {
  selecOrcamentoTipo.lastElementChild.classList.toggle("fa-arrow-up");
  if (dropdownOrcamentoTipo.style.display === "none") {
    dropdownOrcamentoTipo.style.display = "flex";
    dropdownOrcamentoCorte.style.display = "none";
    const lastChild = dropdownOrcamentoCorte.previousElementSibling.lastElementChild;

    if (lastChild.classList.contains('fa-arrow-up')) {
      lastChild.classList.remove('fa-arrow-up');
    }
  } else {
    dropdownOrcamentoTipo.style.display = "none";
  }
}

const selecOrcamentoCorte = document.querySelectorAll(".formulario---orcamento--dropdown")[2];

function escolherTipo(x) {
  selecOrcamentoTipo.firstElementChild.innerHTML = x.innerHTML;
  orcamentoTipo = x.innerHTML;
  revelarTipo();
  definirCorte();
  selecOrcamentoCorte.firstElementChild.innerHTML = "Corte";
  selecOrcamentoCorte.addEventListener("click", revelarCortes);
  valor = 0;
  calculo(peso, valor);
}

const dropdownOrcamentoCorte = document.querySelectorAll(".formulario---orcamento .dropdown--item")[1];

let orcamentoCorte;

dropdownOrcamentoCorte.style.display = "none";

function revelarCortes() {
  selecOrcamentoCorte.lastElementChild.classList.toggle("fa-arrow-up");
  if (dropdownOrcamentoCorte.style.display === "none") {
    dropdownOrcamentoCorte.style.display = "flex";
    dropdownOrcamentoTipo.style.display = "none";
    dropdownOrcamentoTipo.lastElementChild.classList.remove("fa-arrow-up");
  } else {
    dropdownOrcamentoCorte.style.display = "none";
  }
}

function definirCorte() {

  while (dropdownOrcamentoCorte.firstChild) {
    dropdownOrcamentoCorte.removeChild(dropdownOrcamentoCorte.firstChild)
  }

  for (let i = 0; i < produtos.length; i++) {
    if (orcamentoTipo === produtos[i].tipo) {
      for (let j = 0; j < produtos[i].cortes.length; j++) {
        const opcaoCorte = document.createElement("p");
        opcaoCorte.setAttribute("onclick", "escolherCorte(this)");
        opcaoCorte.innerHTML = `${produtos[i].cortes[j].nome}`;
        dropdownOrcamentoCorte.appendChild(opcaoCorte);
      }
    }
  }
}

let valor = 0;

function escolherCorte(x) {
  selecOrcamentoCorte.firstElementChild.innerHTML = x.innerHTML;
  orcamentoCorte = x.innerHTML;
  revelarCortes();
  definirValor(orcamentoCorte);
  calculo(peso, valor);
}

function definirValor(x) {
  let valores = [];
  for (let i = 0; i < produtos.length; i++) {
    for (let j = 0; j < produtos[i].cortes.length; j++) {
      valores.push(produtos[i].cortes[j]);
    }
  }

  for (let i = 0; i < valores.length; i++) {
    if (x === valores[i].nome) {
      valor = valores[i].valor;
    }
  }
  calculo(peso, valor);
}

let peso = 0;

const radioOrcamento = document.querySelectorAll(".radio");
const radioOrcamentoP = document.querySelectorAll(".radio")[4];

function selecPeso(x) {
  for (let i = 0; i < radioOrcamento.length; i++) {

    if (x === radioOrcamentoP && x === radioOrcamento[i]) {
      x.style.color = "black";

      let multiplicador = document.querySelector("#precoPersonalizado").value;
      multiplicador = Number(multiplicador.replace("e", ""));

      peso = multiplicador;

      calculo(peso, valor);

      continue;
    } else if (x === radioOrcamento[i]) {
      x.style.color = "black";
      let multiplicador = radioOrcamento[i].nextElementSibling.innerHTML;

      multiplicador = multiplicador.replace(",", ".");
      multiplicador = Number(multiplicador.replace(/[kg\s]/g, ""));

      peso = multiplicador;

      calculo(peso, valor);

      continue;
    }
    radioOrcamento[i].style.color = "transparent";
  }
}

function calculo(peso, valor) {
  const resultado = document.querySelector("#preco");

  if (!valor || valor <= 0) {
    resultado.innerHTML = "Preço";
    return;
  }

  if (!peso || valor <= 0) {
    resultado.innerHTML = "Preço";
    return;
  }

  let $ = (valor * peso).toFixed(2) + "";
  $ = $.replace(".", ",");
  resultado.innerHTML = $;
}

// ----------------------- Formulário para contato abaixo

const radio = document.querySelectorAll(".formulario--faleconosco--radio--itens");
const selected = document.querySelector(".formulario--faleconosco--dropdown");
const dropdown = document.querySelector(".dropdown");
const checkbox = document.querySelectorAll(".resposta");
const icon = checkbox[2].firstElementChild;
const todosCheckbox = checkbox[2];
const resultado = document.querySelector("#resultado");

let escolheuRadio = false;
let escolheuDropdown = false;

dropdown.style.display = "none"

function selecionaRadio(x) {
  for (let i = 0; i < radio.length; i++) {
    if (radio[i] == x) {
      x.classList.add("radio-button---active");
      escolheuRadio = true;
      continue;
    }
    radio[i].classList.remove("radio-button---active");
  }
}

function revelar() {
  selected.lastElementChild.classList.toggle("fa-arrow-up");
  if (dropdown.style.display === "none") {
    dropdown.style.display = "flex"
  } else {
    dropdown.style.display = "none"
  }
}

function escolher(x) {
  selected.firstElementChild.innerHTML = x.innerHTML;
  escolheuDropdown = true;
  revelar();
}

function marcarCheckbox(x) {
    x.classList.toggle("checkbox-item---selected");
    checar();
}

function checar() {
  if (checkbox[0].classList.contains("checkbox-item---selected") &&
    checkbox[1].classList.contains("checkbox-item---selected")) {
    todosCheckbox.setAttribute("onclick", "desmarcar()");
    todosCheckbox.style.color = "white";
    icon.classList.replace("fa-minus", "fa-check");
  } else if (checkbox[0].classList.contains("checkbox-item---selected") ||
    checkbox[1].classList.contains("checkbox-item---selected")) {
    todosCheckbox.setAttribute("onclick", "desmarcar()");
    todosCheckbox.style.color = "red";
    icon.classList.replace("fa-check", "fa-minus");
  } else {
    todosCheckbox.setAttribute("onclick", "marcar()");
    todosCheckbox.style.color = "black";
    icon.classList.replace("fa-minus", "fa-check");
  }
}

function marcar() {
  checkbox[0].classList.add("checkbox-item---selected");
  checkbox[1].classList.add("checkbox-item---selected");
  todosCheckbox.style.color = "white";
  todosCheckbox.setAttribute("onclick", "desmarcar()");
}

function desmarcar() {
  checkbox[0].classList.remove("checkbox-item---selected");
  checkbox[1].classList.remove("checkbox-item---selected");
  todosCheckbox.style.color = "black";
  todosCheckbox.setAttribute("onclick", "marcar()");
  icon.classList.replace("fa-minus", "fa-check");
}

function enviar() {
  let nome = document.querySelector("#nome").value;
  let email = document.querySelector("#email").value;
  let tel = document.querySelector("#tel").value;
  let mensagem = document.querySelector("#mensagem").value;
  let feedback = '';

  if (!validarNome(nome)) {
    feedback += 'Erro: Nome inválido. <br>';
    resultado.classList.add("resultado-reprovado");
  }
  if (!validarEmail(email)) {
    feedback += 'Erro: E-mail inválido. <br>';
    resultado.classList.add("resultado-reprovado");
  }
  if (!validarTel(tel)) {
    feedback += 'Erro: Telefone inválido. <br>';
    resultado.classList.add("resultado-reprovado");
  }
  if (!escolheuRadio) {
    feedback += 'Erro: Item "Preferência por" é obrigatório. <br>';
    resultado.classList.add("resultado-reprovado");
  }
  if (!escolheuDropdown) {
    feedback += 'Erro: Item "Tipo de Carne Preferida" é obrigatório. <br>';
    resultado.classList.add("resultado-reprovado");
  }
  if (!validarMensagem(mensagem)) {
    feedback += 'Erro: Item mensagem vazia ou muito curta.';
    resultado.classList.add("resultado-reprovado");
  }

  feedback === '' ? resultado.classList.replace("resultado-reprovado", "resultado-aprovado") : resultado.classList.replace("resultado-aprovado", "resultado-reprovado");

  feedback === '' ? resultado.innerHTML = 'Enviado com sucesso!' : resultado.innerHTML = feedback;
}

function validarNome(nome) {
  let verifica = nome.split(" ");

  if (verifica[1]) {
    return verifica.length >= 2;
  }
}

function validarEmail(email) {
  let base = email.split("@");
  let final;
  if (!email) {
    return false
  } else if (base.length < 2) {
    return false;
  } else {
    final = base[1].split(".");
    if (final.length >= 2) {
      if (final[0].length >= 5 && final[1].length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

function validarTel(tel) {
  let remover = ["(", ")", " ", "-"];
  let removido = [];
  for (let i = 0; i < tel.length; i++) {
    if (remover.indexOf(tel[i]) === -1) {
      removido += Number(tel[i]);
    }
  }
  return removido.length == 11
}

function validarMensagem(mensagem) {
  console.log(mensagem);
  return mensagem.length >= 5;
}