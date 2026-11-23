# Gaita Game — atualização do afinador e central de ajuda

## Afinador e calibração pelo mapa
- O mapa agora é interativo: cada uma das 20 posições (10 furos soprados e 10 aspirados) pode ser selecionada.
- A seleção mostra furo, direção e nota musical, incluindo oitava.
- A calibração individual usa a nota escolhida pelo aluno como referência, em vez de assumir automaticamente que a nota detectada é a nota desejada.
- O ajuste considera o desvio geral da gaita já configurado e limita a correção individual a ±50 cents.
- Se o som detectado estiver muito distante da nota escolhida, o aplicativo avisa para conferir o furo e a direção, evitando gravar uma calibração evidentemente errada.
- A opção de zerar uma calibração atua sobre a posição selecionada; zerar todas continua disponível.
- Ao mudar o tom da gaita, o mapa é redesenhado com as notas correspondentes.

## Ajuda e dúvidas em Ajustes
Foi adicionada uma central de ajuda em formato de tópicos expansíveis, explicando:
- Tela inicial, nível, XP e sequência diária.
- Aulas teóricas.
- Aulas práticas, modos Aprender e Ritmo.
- Músicas, tablaturas e importação.
- Funcionamento do afinador e cents.
- Mapa da gaita e calibração individual.
- Permissão e sensibilidade do microfone.
- Bends e tolerância.
- Rotina, progresso e desafios.
- Backup e restauração.
- Tom da gaita e opções de visualização.

## Compatibilidade e publicação
- As mudanças são aditivas e mantêm o formato de armazenamento `S` já utilizado pelo aplicativo.
- O `service worker` foi atualizado para a versão de cache `gaita-bem-te-vi-v8`, para evitar que o navegador continue servindo a interface antiga.
- O afinador depende da permissão de microfone do navegador e de contexto seguro (HTTPS).

## Testes realizados
- JavaScript embutido no `index.html` validado com `node --check`.
- A validação acústica em diferentes modelos de celular/gaita ainda precisa ser feita no aparelho real, porque depende do microfone, ruído ambiente e resposta das palhetas.
