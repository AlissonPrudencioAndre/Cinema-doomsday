
import type { Pessoa } from "./tipos.ts";

export function direitoAMeia(pessoa: Pessoa): boolean {
  return (
    pessoa.estudante ||
    pessoa.idade >= 60 ||
    pessoa.pcd
  );
}
