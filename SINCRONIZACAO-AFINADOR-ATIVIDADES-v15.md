# Gaita Game 2.0 — sincronização do afinador com as atividades (v15)

## O que mudou
- O afinador foi mantido como estava e continua sendo a fonte única da calibração.
- Nas atividades, o motor identifica explicitamente a nota-alvo do exercício.
- Essa nota-alvo é enviada ao detector para localizar a calibração individual correspondente, usando o mesmo estado salvo pelo afinador.
- O ajuste geral (`S.g`) e o ajuste individual (`S.cals`) são aplicados uma única vez no sinal detectado.
- A correspondência considera a preferência de oitavas e não aplica uma calibração individual a outra nota distante.
- A ligação cobre os modos **Aprender (espera)** e **Ritmo (acompanhar)**.

## Como validar no Android
1. Atualize o PWA substituindo os arquivos do pacote v15 no mesmo endereço publicado.
2. Feche totalmente o aplicativo instalado e abra-o novamente para receber o service worker v15.
3. No Afinador, calibre uma nota conhecida da gaita, selecionando o furo e a direção corretos. Não mude outras configurações durante o teste.
4. Abra uma atividade que peça exatamente essa nota e toque-a com a gaita.
5. Repita em Aprender e em Ritmo. Compare também uma nota diferente para confirmar que a correção individual não está sendo aplicada indevidamente.
6. Feche e reabra o aplicativo e repita o teste para confirmar que a calibração salva continua disponível.

## Teste automatizado
Com Node.js instalado, execute na raiz do pacote:

```bash
node tests/calibration-sync.test.cjs
```

A validação automatizada cobre o roteamento da calibração e a seleção do alvo da atividade. Ela não substitui a prova acústica com gaita real e microfone do aparelho.
