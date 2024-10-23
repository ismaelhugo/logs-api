import express, { Request, Response } from 'express';
import { Client } from '@elastic/elasticsearch';
import cors from 'cors';

// Interface para definir o formato do log
interface Log {
  timestamp: string;
  level: string;
  message: string;
  stack_trace?: string;
  url: string;
  user_agent: string;
  user_id?: string;
  component: string;
}

// Criar instância do cliente do Elasticsearch
const client = new Client({ node: 'http://localhost:9200' });

// Criar instância do Express
const app = express();

// Middleware para permitir requisições de qualquer origem
app.use(cors());

// Middleware para parsear JSON no body das requisições
app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send('API de logs do front-end');
}); // Rota raiz

// Rota para receber os logs do front-end
app.post('/logs', async (req: Request, res: Response): Promise<void> => {
  try {
    // Log recebido do front-end (JSON)
    const log: Log = req.body;

    // Verifica se os campos obrigatórios existem
    if (!log.message || !log.timestamp) {
      res.status(400).json({ error: 'Campos obrigatórios faltando' });
      return;
    }

    // Indexa o log no Elasticsearch
    const response = await client.index({
      index: 'logs-frontend', // Índice no Elasticsearch
      document: log // Documento (log) a ser enviado
    });

    // Responde com sucesso
    res.status(201).json({ message: 'Log recebido e indexado', result: response });
  } catch (error) {
    console.error('Erro ao indexar log:', error);
    res.status(500).json({ error: 'Erro ao indexar log' });
  }
});

// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
