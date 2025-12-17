# Dont Forget App - Tasks

O serviço **dont-forget-tasks** é responsável pelo domínio de **Tasks** e **Categories** da aplicação *Dont Forget App*. Este serviço implementa tanto o lado de leitura quanto o de escrita do domínio, seguindo o padrão **CQRS**, com suporte a mensageria para commands.

## Comunicação

-   **Queries**
    -   HTTP REST síncrono
-   **Commands**
    -   Recebidos via eventos publicados pelo Gateway
    -   Processados de forma assíncrona

## Pré-requisitos

-   Docker
-   Docker Compose

## Configuração de Ambiente

Este serviço depende de um arquivo `.env`.

Crie o arquivo `.env` com base no exemplo:

``` bash
cp .env.example .env
```

## Executando a Aplicação

Para subir o serviço e suas dependências:

``` bash
docker compose up
```

O serviço ficará disponível conforme a porta configurada.
