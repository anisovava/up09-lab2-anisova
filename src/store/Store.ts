
import { create } from 'zustand'

interface Chat{
  id: string;
  lastMessage: string;
}

interface UserState {
  userId: string;
  activeChat: string | null;
  chats: Chat[];
  setUserId: (id: string) => void;
  setActiveChat: (chatId: string) => void;
  addChat: (lastMessage: string) => void; // Метод для добавления чата
  isValidUserId: (id: string) => boolean; // Метод для проверки ID пользователя
}

const VALID_USER_ID = '93114424';

conts useStore = create<UserState>((set)=> ({

}));
