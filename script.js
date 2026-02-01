// 1) Objeto do usuário
const usuario = {
  nome: "Raquel",       // pode trocar
  saldoInicial: 2000.00 // pode trocar
};

// 2) Array de objetos (extrato)
const transacoes = [
  // exemplo (opcional) para testar:
  // { data: "01/02/2026 12:00", descricao: "Depósito inicial", valor: 2000, tipo: "entrada" }
];

// 3) Capturar elementos do DOM
const elNomeUsuario = document.getElementById("nome-usuario");
const elSaldo = document.getElementById("saldo");
const elListaTransacoes = document.getElementById("lista-transacoes");
const elFiltroTipo = document.getElementById("filtro-tipo");



// 4) Função para formatar valor em BRL (R$)
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function renderizarExtrato(lista = transacoes) {
  elListaTransacoes.innerHTML = ""; // limpa antes de desenhar

  if (lista.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3" style="text-align:center; opacity:0.7;">Sem transações ainda</td>`;
    elListaTransacoes.appendChild(tr);
    return;
  }

  for (const t of lista) {
    const tr = document.createElement("tr");
    tr.classList.add(t.tipo);

    const tdData = document.createElement("td");
    tdData.textContent = t.data;

    const tdDescricao = document.createElement("td");
    tdDescricao.textContent = t.descricao;

    const tdValor = document.createElement("td");
    const sinal = t.tipo === "entrada" ? "+ " : "- ";
    tdValor.textContent = `${sinal}R$ ${formatarMoeda(t.valor)}`;

    tr.appendChild(tdData);
    tr.appendChild(tdDescricao);
    tr.appendChild(tdValor);

    elListaTransacoes.appendChild(tr);
  }
} // ✅ FECHOU renderizarExtrato AQUI

// ✅ Agora sim: Filtra o extrato conforme o select (Todos | Entradas | Saídas)

function filtrarExtrato() {
  const tipo = elFiltroTipo.value; // "todos" | "entrada" | "saida"

  if (tipo === "todos") {
    renderizarExtrato(transacoes);
    return;
  }

  const filtradas = transacoes.filter(t => t.tipo === tipo);
  renderizarExtrato(filtradas);
}

// 5) Mostrar nome e saldo inicial na tela quando carregar, aqui eu mudo se precisar colocar saldo baixo pisca, alertas
function iniciarApp() {
  elNomeUsuario.textContent = usuario.nome;
  atualizarSaldo();   // 👈 quem deve mostrar o saldo
  filtrarExtrato();
}

// roda assim que o JS carregar
iniciarApp();

function atualizarSaldo() {
  let saldo = usuario.saldoInicial;

  for (const t of transacoes) {
    if (t.tipo === "entrada") saldo += t.valor;
    else saldo -= t.valor;
  }

  // Atualiza o valor na tela
  elSaldo.textContent = formatarMoeda(saldo);

  // 🎨 Cores inteligentes do saldo // Destaque visual para saldo baixo

  if (saldo < 100) {
    elSaldo.style.color = "#FBBF24"; // atenção
  } else {
    elSaldo.style.color = "#86EFAC"; // saudável
  }

  usuario.saldoAtual = saldo;
  return saldo;
}

// Função com tratamento de erros usando try/catch

function novaTransacao(tipo) {

  try {

    const valorStr = prompt("Digite o valor:");
    if (valorStr === null) return;

    const valor = Number(valorStr.replace(",", "."));

    if (!Number.isFinite(valor) || valor <= 0) {
      throw new Error("Valor inválido! Digite um número maior que zero.");
    }

    const descricao = prompt("Digite a descrição:");
    if (descricao === null) return;

    const descLimpa = descricao.trim();

    if (descLimpa.length < 2) {
      throw new Error("Descrição muito curta!");
    }

    const tipoMov = (tipo === "deposito") ? "entrada" : "saida";

    const saldoAtual = atualizarSaldo();

    if (tipoMov === "saida" && valor > saldoAtual) {
      throw new Error("Saldo insuficiente!");
    }

    const agora = new Date();
    const dataFormatada = agora.toLocaleString("pt-BR");

    transacoes.push({
      data: dataFormatada,
      descricao: descLimpa,
      valor: valor,
      tipo: tipoMov
    });

    atualizarSaldo();
    filtrarExtrato();

  } catch (erro) {

    alert(erro.message);

  }
}
