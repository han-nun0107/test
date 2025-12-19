import type { User, IdentityData } from "@/types/user/user";

export type { User, IdentityData };

export type SongRequest = {
  favorite: string[];
};

export type FavoriteItem = {
  song: string;
  singer: string;
};
