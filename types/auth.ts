export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  bio?: string;
  isBot?: boolean;
}

export interface AuthUser extends User {
  password: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
  upvotes: number;
  pinned?: boolean;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  upvotes: number;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}
