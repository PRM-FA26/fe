export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  bio: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  role: string;
  isAnonymous: boolean;
}

export interface Story {
  id: string;
  authorId?: string;
  title: string;
  description?: string;
  coverImage?: string;
  type?: string;
  status?: string;
  viewCount?: number;
  rating?: number;
  author?: {
    id: string;
    name?: string;
    displayName?: string;
    username?: string;
    avatar?: string;
    bio?: string;
  };
  genres?: { id?: string; name?: string; genre?: { id: string; name: string } }[];
  tags?: { id: string; name: string }[];
  _count?: { chapters: number; comments: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  isPremium?: boolean;
  createdAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    displayName?: string;
    username?: string;
    avatar?: string;
    isAnonymous?: boolean;
  };
  parentId?: string;
  replies?: Comment[];
  isLiked?: boolean;
  _count?: { replies?: number; likes?: number };
}

export interface Review {
  id: string;
  rating: number;
  content?: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    displayName?: string;
    username?: string;
    avatar?: string;
    isAnonymous?: boolean;
  };
}

export const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1543005127-b6b197e60be2?q=80&w=400&auto=format&fit=crop";

export const CHAPTERS_INITIAL = 5;
