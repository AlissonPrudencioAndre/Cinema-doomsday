
import express from "express";
import { criarBilheteria } from "./bilheteria.ts";
import { Evento } from "./dominio.ts";
import type { Pedido } from "./tipos.ts";

const app = express();
app.use(express.json());

const PORTA = Number(process.env.PORT ?? 3000);


const eventos = [
  new Evento(1, "Vingadores: Doomsday — Pré-estreia", 50, 50),
  new Evento(2, "Vingadores: Doomsday — Sessão especial", 60, 50),
];

const bilheteria = criarBilheteria({
  eventos,
  limitePagamentoMs: 5000,
  pagar: async (valor: number) => {
    console.log(`Pagamento simulado: R$ ${valor.toFixed(2)}`);
  },
});

app.get("/", (_req, res) => {
  res.json({
    mensagem: "Bilheteria Vingadores: Doomsday",
    status: "online",
  });
});

app.get("/eventos", (_req, res) => {
  res.json(bilheteria.listarEventos());
});

app.post("/reservas", async (req, res) => {
  try {
    const pedido = req.body as Pedido;
    const comprovante = await bilheteria.reservar(pedido);

    res.status(201).json(comprovante);
  } catch (erro) {
    const status =
      typeof erro === "object" &&
      erro !== null &&
      "status" in erro &&
      typeof erro.status === "number"
        ? erro.status
        : 500;

    const mensagem =
      erro instanceof Error
        ? erro.message
        : "Erro interno do servidor";

    res.status(status).json({ erro: mensagem });
  }
});

app.listen(PORTA, () => {
  console.log(
    `Bilheteria Vingadores: Doomsday disponível em http://localhost:${3000}`
  );
});
