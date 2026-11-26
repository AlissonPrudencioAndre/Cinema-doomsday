
import type { EventoInfo } from "./tipos.ts";


export class ErroDeNegocio extends Error {
  public readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = new.target.name;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DadosInvalidosErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 400);
  }
}

export class NaoEncontradoErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 404);
  }
}

export class PoltronaOcupadaErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 409);
  }
}

export class PagamentoErro extends ErroDeNegocio {
  constructor(mensagem: string) {
    super(mensagem, 502);
  }
}


export class Evento {
  private readonly poltronasOcupadas = new Set<number>();

  constructor(
    public readonly id: number,
    public readonly nome: string,
    public readonly preco: number,
    public readonly capacidade: number
  ) {
    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      !nome.trim() ||
      !Number.isFinite(preco) ||
      preco <= 0 ||
      !Number.isInteger(capacidade) ||
      capacidade <= 0
    ) {
      throw new DadosInvalidosErro("Dados do evento inválidos");
    }
  }

 
  get disponivel(): number {
    return this.capacidade - this.poltronasOcupadas.size;
  }

  reservar(poltronas: number[]): void {
    if (
      !Array.isArray(poltronas) ||
      poltronas.length === 0
    ) {
      throw new DadosInvalidosErro(
        "O pedido deve conter pelo menos uma poltrona"
      );
    }

    if (
      poltronas.some(
        (poltrona) =>
          !Number.isInteger(poltrona) ||
          poltrona < 1 ||
          poltrona > this.capacidade
      )
    ) {
      throw new DadosInvalidosErro("Poltrona inválida");
    }

    if (new Set(poltronas).size !== poltronas.length) {
      throw new DadosInvalidosErro(
        "O pedido contém poltronas repetidas"
      );
    }

    if (
      poltronas.some((poltrona) =>
        this.poltronasOcupadas.has(poltrona)
      )
    ) {
      throw new PoltronaOcupadaErro(
        "Uma ou mais poltronas já estão ocupadas"
      );
    }

    poltronas.forEach((poltrona) =>
      this.poltronasOcupadas.add(poltrona)
    );
  }

  liberar(poltronas: number[]): void {
    if (
      !Array.isArray(poltronas) ||
      poltronas.length === 0
    ) {
      throw new DadosInvalidosErro(
        "Informe as poltronas que serão liberadas"
      );
    }

    if (new Set(poltronas).size !== poltronas.length) {
      throw new DadosInvalidosErro(
        "O pedido contém poltronas repetidas"
      );
    }

    if (
      poltronas.some(
        (poltrona) =>
          !Number.isInteger(poltrona) ||
          poltrona < 1 ||
          poltrona > this.capacidade ||
          !this.poltronasOcupadas.has(poltrona)
      )
    ) {
      throw new DadosInvalidosErro(
        "Não é possível liberar uma poltrona não reservada"
      );
    }

    poltronas.forEach((poltrona) =>
      this.poltronasOcupadas.delete(poltrona)
    );
  }


  info(): EventoInfo {
    return {
      id: this.id,
      nome: this.nome,
      preco: this.preco,
      capacidade: this.capacidade,
      disponivel: this.disponivel,
    };
  }
}
