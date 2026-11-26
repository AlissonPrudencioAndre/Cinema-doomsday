
import type { Ingresso, Pessoa, TipoIngresso } from "./tipos.ts";


export const valorDoIngresso =
  (precoBase: number) =>
  (tipo: TipoIngresso): number => {
    return tipo === "meia"
      ? Number((precoBase / 2).toFixed(2))
      : Number(precoBase.toFixed(2));
  };


export const aplicarTaxa =
  (taxa: number) =>
  (valor: number): number => {
    return Number((valor * (1 + taxa)).toFixed(2));
  };


export function montarIngressos(
  precoBase: number,
  pessoas: readonly Pessoa[],
  temDireitoAMeia: (pessoa: Pessoa) => boolean
): Ingresso[] {
  return pessoas.map((pessoa) => {
    const tipo: TipoIngresso = temDireitoAMeia(pessoa)
      ? "meia"
      : "inteira";

    return {
      nome: pessoa.nome,
      poltrona: pessoa.poltrona,
      tipo,
      valor: valorDoIngresso(precoBase)(tipo),
    };
  });
}

export function calcularTotal(ingressos: readonly Ingresso[]): number {
  const subtotal = ingressos.reduce(
    (total, ingresso) => total + ingresso.valor,
    0
  );

  return aplicarTaxa(0.1)(subtotal);
}
