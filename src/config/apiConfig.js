
export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const OPENAI_MODEL = "gpt-3.5-turbo";

export const getApiKey = () => import.meta.env.VITE_OPENAI_API_KEY;
