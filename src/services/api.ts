import axios from "axios";

// Centralizamos a configuração do Axios aqui.
// Isso facilita a manutenção e permite adicionar interceptadores (como tokens de autenticação)
// no futuro de forma global, sem precisar alterar cada chamada separadamente.
export const api = axios.create({
  // TODO: Ajustar para a porta correta que o backend está rodando localmente
  baseURL: "http://localhost:5175/api",
});
