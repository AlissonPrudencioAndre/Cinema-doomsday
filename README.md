# Cinema doomsday — Sistema de Venda de Ingressos

**Vídeo de apresentação:** 

**Repositório:** (https://github.com/AlissonPrudencioAndre/Cinema-doomsday)

## 1. Integrantes

| Integrante | Responsabilidades | rgm
| Alisson Prudêncio André| elaboração do projeto e gravação do vídeo | 38118688

## 2. Sobre o projeto

O projeto Cinema doomsday é um sistema de venda de ingressos desenvolvido em TypeScript, utilizando Express para disponibilizar uma API HTTP.
O sistema permite consultar eventos, realizar reservas de poltronas, calcular valores de ingressos, processar pagamentos e gerar comprovantes.
O projeto também inclui testes automatizados e um benchmark que simula múltiplos pedidos simultâneos.

## 3. Tecnologias utilizadas

- TypeScript
- Node.js
- Express
- tsx
- npm

Os dados dos eventos e das poltronas ocupadas são mantidos em memória durante a execução da aplicação.

## 4. Arquitetura do projeto

### `src/main.ts`

configura os eventos, a operadora de pagamento e a instância da bilheteria. inicia o servidor na porta 3000.

### `src/servidor.ts`

Implementa o servidor Express e as rotas HTTP.

### `src/bilheteria.ts`

valida os pedidos, controla as reservas, calcula os valores, processa os pagamentos e gera os comprovantes.

### `src/dominio.ts`

Define a classe `Evento` e a hierarquia de erros de negócio.

### `src/preco.ts`

Implementa as funções de cálculo dos preços dos ingressos e do total da compra.

### `src/regras.ts`

Contém as regras de negócio relacionadas ao direito à meia-entrada.

### `src/tipos.ts`

Define os tipos e as interfaces utilizados na aplicação.

### `src/bench.ts`

Implementa o benchmark de concorrência, enviando múltiplos pedidos simultaneamente para o servidor.

## 5. Como executar o projeto

### Requisitos

- Node.js instalado.
- npm instalado.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/AlissonPrudencioAndre/Cinema-doomsday
cd Cinema doomsday
```

Instale as dependências:

```bash
npm install
```

### Executar os testes

```bash
npm test
```

Resultado obtido durante o desenvolvimento:

```text
Pontos: 16 de 16 (100%)
```

### Iniciar o servidor

```bash
npm start
```

O servidor fica disponível em:

```text
http://localhost:3000
```

### Executar o benchmark

Em outro terminal, execute:

```bash
npm run bench
```

Para definir a quantidade de pedidos e o evento:

```bash
npm run bench -- 200 2
```

O primeiro parâmetro representa a quantidade de pedidos e o segundo representa o identificador do evento.

## 6. Endpoints

### GET `/eventos`

Retorna a lista de eventos, incluindo identificador, nome, preço, capacidade e quantidade de ingressos disponíveis.

Exemplo:

```bash
curl http://localhost:3000/eventos
```

### POST `/reservas`

Recebe os dados de uma reserva e retorna o comprovante quando a venda é concluída.

Exemplo:

```bash
curl -X POST http://localhost:3000/reservas \
  -H "Content-Type: application/json" \
  -d '{"eventoId":1,"ingressos":[{"nome":"Ana","idade":20,"estudante":true,"pcd":false,"poltrona":1}]}'
```

## 7. Paradigmas de programação

### Orientação a objetos

A classe `Evento` encapsula os dados e as operações de cada evento.

As poltronas ocupadas são mantidas em uma estrutura privada, impedindo que outros componentes alterem diretamente seu estado.

O método `reservar()` valida todas as poltronas antes de marcá-las como ocupadas, garantindo que uma operação inválida não reserve parcialmente um pedido.

A classe `Bilheteria` coordena o processo de venda e utiliza os métodos de `Evento` para controlar as poltronas.

A hierarquia de erros permite representar diferentes situações de negócio com seus respectivos códigos HTTP.

### Programação funcional

O módulo `preco.ts` utiliza funções para calcular os valores dos ingressos e das compras.

A função `montarIngressos()` utiliza `map()` para transformar as pessoas em ingressos, preservando a ordem e as poltronas.

A função `calcularTotal()` utiliza `reduce()` para somar os valores dos ingressos e aplicar a taxa de 10%.

As funções recebem dados e retornam novos resultados, evitando alterações desnecessárias nos dados de entrada.

## 8. Concorrência

A concorrência é controlada principalmente pela reserva imediata das poltronas.

O método `Bilheteria.reservar()` chama `evento.reservar(poltronas)` antes de aguardar o pagamento.

Isso impede que outra requisição reserve a mesma poltrona enquanto a primeira está aguardando a operadora.

O processamento assíncrono permite que o Node.js atenda outros pedidos enquanto uma operação aguarda o pagamento.

O método `pagarComLimite()` utiliza `Promise.race()` para limitar o tempo de espera pela operadora.

Se o pagamento falhar ou exceder o tempo limite, as poltronas são liberadas e o sistema retorna um erro de negócio.

## 9. Resultados dos testes automatizados

Durante o desenvolvimento, foram executados os testes disponibilizados no projeto.

| Resultado | Quantidade |
| Pontos obtidos | 16 |
| Pontos possíveis | 16 |
| Aproveitamento | 100% |

Os testes contemplam:

- Herança e status HTTP dos erros.
- Reserva e liberação de poltronas.
- Controle de reservas simultâneas.
- Cálculo de preços e aplicação de taxas.
- Direito à meia-entrada.
- Tratamento de falhas de pagamento.
- Tempo limite da operadora.
- Funcionamento do servidor HTTP.

## 10. Resultados do benchmark

O benchmark foi executado com 200 pedidos simultâneos para cada evento.

### Primeira execução — Evento 1

Comando:

```bash
npm run bench
```

Resultado:

```text
200 pedidos em 215 ms (929 pedidos/s)
por status HTTP: { '201': 48, '409': 152 }
```

O evento 1 possuía 50 poltronas de capacidade. Antes do benchmark, havia 48 poltronas disponíveis.

O teste resultou em 48 vendas e 152 conflitos, sem ultrapassar a capacidade do evento.

### Segunda execução — Evento 2

Comando:

```bash
npm run bench -- 200 2
```

Resultado:

```text
200 pedidos em 185 ms (1082 pedidos/s)
por status HTTP: { '201': 50, '409': 150 }
```

O evento 2 possuía 50 poltronas disponíveis antes do benchmark.

O teste resultou em 50 vendas e 150 conflitos, esgotando a capacidade do evento.

### Tabela consolidada

| Indicador | Evento 1 | Evento 2 |
| Pedidos enviados | 200 | 200 |
| Vendas realizadas (201) | 48 | 50 |
| Conflitos (409) | 152 | 150 |
| Falhas de pagamento (502) | 0 | 0 |
| Tempo total | 215 ms | 185 ms |
| Pedidos por segundo | 929 | 1082 |
| Disponibilidade final | 0 | 0 |

Os resultados demonstram que o sistema respeitou a capacidade dos eventos durante as execuções realizadas.

O benchmark também demonstrou o tratamento de pedidos concorrentes, com rejeição das tentativas de reserva de poltronas já ocupadas.

Os valores de pedidos por segundo representam as taxas observadas nas execuções realizadas e não uma garantia de desempenho em produção.

## 11. Perguntas e respostas

### O que acontece quando duas pessoas tentam reservar a mesma poltrona?

A primeira requisição que consegue reserva terá a poltrona, marcando o assento como ocupado. As requisições seguintes recebem o erro `PoltronaOcupadaErro`.

### Por que as poltronas são reservadas antes do pagamento?

impede que outras requisições reservem a mesma poltrona enquanto a primeira aguarda a operadora de pagamento.

### O que acontece quando o pagamento falha?

O sistema libera as poltronas reservadas e retorna um erro de pagamento com status HTTP 502.

### Como o sistema trata o tempo limite de pagamento?

`pagarComLimite()` utiliza `Promise.race()` para aguardar o pagamento ou o tempo limite configurado. Se o limite for atingido, a operação é tratada como uma falha de pagamento.

### O que os benchmarks demonstram?

a aplicação processou 200 pedidos simultâneos em cada execução, respeitando a capacidade dos eventos e rejeitando as tentativas de reserva de poltronas ocupadas.

### O sistema utiliza um banco de dados?

Não, os eventos e as poltronas ocupadas são mantidos em memória, utilizando estruturas como `Map` e `Set`.

### O sistema impede vendas acima da capacidade?

o sistema respeitou a capacidade dos eventos e não apresentou vendas acima do número de poltronas disponíveis.
a classe `Evento` para impede reservas duplicadas.

## 12. Considerações finais

O projeto Cinema doomsday demonstrou a aplicação dos paradigmas de programação orientada a objetos e programação funcional em um sistema de venda de ingressos.
testes automatizados obtiveram 16 pontos de 16, e os benchmarks demonstraram o controle das reservas em cenários de concorrência.
A implementação atende ao controle de poltronas, cálculo de preços, processamento de pagamentos, tratamento de erros e disponibilização de uma API HTTP.
