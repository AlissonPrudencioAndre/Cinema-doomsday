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

1. Concorrência
Antes de iniciar o pagamento, a aplicação tenta reservar as poltronas. O método Evento.reservar() verifica se todas estão disponíveis e, sem executar nenhum await entre a verificação e a atualização, marca todas como ocupadas. Assim, no processo atual do Node, outro pedido não consegue entrar no meio dessa operação síncrona e reservar a mesma poltrona.
O await perigoso seria entre verificar a disponibilidade e marcar as poltronas como ocupadas. Se houvesse uma pausa nesse ponto, outro pedido poderia verificar a mesma poltrona como livre. Também seria perigoso fazer o pagamento antes de reservar: duas requisições poderiam cobrar e só depois disputar a poltrona. Por isso, reservamos antes do pagamento e liberamos as poltronas se o pagamento falhar ou exceder o tempo limite.

2. Orientação a objetos (OO)
O Evento esconde o conjunto de poltronas ocupadas e controla como elas são reservadas ou liberadas. Isso protege o estado interno: outras partes do sistema não devem alterar diretamente as poltronas, porque poderiam deixar a capacidade ou a disponibilidade inconsistentes.
A reserva é tudo ou nada porque, se alguém compra várias poltronas, não queremos reservar apenas algumas e rejeitar as restantes. Primeiro validamos todas; só depois marcamos todas como ocupadas. Se houver uma poltrona inválida, repetida ou já ocupada, nenhuma é reservada.
Os erros formam uma hierarquia de classes para representar tipos específicos de falha. Isso permite tratar erros de forma uniforme, mas ainda distinguir, por exemplo, uma poltrona ocupada de uma falha no pagamento e convertê-los em respostas HTTP adequadas.

4. Programação funcional
Em preco.ts, as funções de cálculo são puras: recebem os dados necessários e devolvem o preço, sem alterar o estado do sistema nem depender do servidor. Isso torna o comportamento mais previsível e facilita a reutilização e os testes.
Podemos testar preco.ts diretamente, importando as funções em um arquivo de testes e verificando entradas e saídas esperadas. Não precisamos iniciar o Express, fazer requisições HTTP ou simular o pagamento. Também podemos testar casos de meia-entrada, quantidade de ingressos e diferentes tipos de preço.

4. Se fosse em outro paradigma
Poderíamos transformar os tipos de ingresso em classes, como IngressoInteira e IngressoMeia, cada uma com um método para calcular o preço. Isso seria uma abordagem mais orientada a objetos, útil se cada tipo tivesse regras e comportamentos complexos.
Para o nosso caso, em que o cálculo é simples e não precisa manter estado, as funções puras são mais leves e fáceis de testar. Então, usar OO seria possível, mas provavelmente acrescentaria estrutura sem um benefício proporcional.

6. Concorrente × paralelo
Os pedidos são concorrentes porque podem estar em andamento ao mesmo tempo, por exemplo, enquanto aguardam o pagamento. Isso não significa que o JavaScript execute esses trechos simultaneamente em vários núcleos. No nosso caso, a parte síncrona que verifica e marca as poltronas roda sem interrupção dentro do processo, enquanto as operações assíncronas podem aguardar.
Se a venda rodasse em vários processos ou núcleos, a proteção em memória de um único processo não seria suficiente. Cada processo poderia ter seu próprio estado e considerar a mesma poltrona disponível. Precisaríamos de uma coordenação compartilhada, como uma transação no banco de dados com bloqueio ou atualização atômica da poltrona. Também seria importante tratar tentativas repetidas de pagamento, por exemplo, com uma chave de idempotência.
