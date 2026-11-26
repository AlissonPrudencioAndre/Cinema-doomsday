
import type {
  Comprovante,
  ConfigBilheteria,
  EventoInfo,
  Ingresso,
  Pedido,
} from "./tipos.ts";

import {
  DadosInvalidosErro,
  ErroDeNegocio,
  NaoEncontradoErro,
  PagamentoErro,
  PoltronaOcupadaErro,
} from "./dominio.ts";

import { direitoAMeia } from "./regras.ts";
import {
  calcularTotal,
  montarIngressos,
} from "./preco.ts";

export class Bilheteria {
  private readonly eventos = new Map<number, ConfigBilheteria["eventos"][number]>();
  private readonly reservasEmAndamento = new Map<number, Promise<Comprovante>>();
  private proximoReservaId = 1;

  constructor(
    private readonly config: ConfigBilheteria
  ) {
    config.eventos.forEach((evento) => {
      this.eventos.set(evento.id, evento);
    });
  }

  listarEventos(): EventoInfo[] {
    return Array.from(this.eventos.values()).map((evento) =>
      evento.info()
    );
  }

  async reservar(pedido: Pedido): Promise<Comprovante> {
    if (
      !pedido ||
      !Number.isInteger(pedido.eventoId) ||
      !Array.isArray(pedido.ingressos) ||
      pedido.ingressos.length === 0
    ) {
      throw new DadosInvalidosErro("Pedido inválido");
    }

    const evento = this.eventos.get(pedido.eventoId);

    if (!evento) {
      throw new NaoEncontradoErro("Evento não encontrado");
    }

    const poltronas = pedido.ingressos.map((pessoa) => {
      if (
        !pessoa ||
        typeof pessoa.nome !== "string" ||
        !pessoa.nome.trim() ||
        !Number.isInteger(pessoa.idade) ||
        pessoa.idade < 0 ||
        typeof pessoa.estudante !== "boolean" ||
        typeof pessoa.pcd !== "boolean"
      ) {
        throw new DadosInvalidosErro("Dados do ingresso inválidos");
      }

      return pessoa.poltrona;
    });


    evento.reservar(poltronas);

    const reservaId = this.proximoReservaId++;

    try {
      const ingressos = montarIngressos(
        evento.preco,
        pedido.ingressos,
        direitoAMeia
      );

      const total = calcularTotal(ingressos);

      await this.pagarComLimite(total);

      return {
        reservaId,
        eventoId: evento.id,
        ingressos,
        total,
      };
    } catch (erro) {
      evento.liberar(poltronas);

      if (erro instanceof ErroDeNegocio) {
        throw erro;
      }

      throw new PagamentoErro(
        "Não foi possível concluir o pagamento"
      );
    }
  }

  private async pagarComLimite(valor: number): Promise<void> {
    let temporizador: ReturnType<typeof setTimeout> | undefined;

    const limite = new Promise<never>((_, rejeitar) => {
      temporizador = setTimeout(
        () => rejeitar(new Error("Tempo limite de pagamento")),
        this.config.limitePagamentoMs
      );
    });

    try {
      await Promise.race([
        this.config.pagar(valor),
        limite,
      ]);
    } catch {
      throw new PagamentoErro("Pagamento recusado ou expirado");
    } finally {
      if (temporizador !== undefined) {
        clearTimeout(temporizador);
      }
    }
  }
}

export function criarBilheteria(
  config: ConfigBilheteria
): Bilheteria {
  return new Bilheteria(config);
}
