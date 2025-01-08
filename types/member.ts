// types/member.ts
interface Member {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status?: 'online' | 'offline' | 'checked';
    date?: string;
  }
  