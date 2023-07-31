export interface UserState {
  username?: string;
  nickname?: string;
  avatar?: string;
  is_superuser: boolean;
  is_staff: boolean;
  roles: string;
}
