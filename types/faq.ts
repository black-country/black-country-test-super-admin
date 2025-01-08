export interface FAQ {
    id: string;
    question: string;
    answer: string;
    audience: 'Tenants' | 'Agents' | 'Service Provider';
  }