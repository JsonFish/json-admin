export interface QueryParams {
  email: string;
  username: string;
  page: number;
  pageSize: number;
}

export interface UserData {
  total: number;
  userList: UserInfo[];
}

export interface UserInfo {
  avatar?: string;
  create_time?: string;
  email: string;
  id: number;
  ip?: string;
  role: number;
  status: number;
  update_time?: string;
  username: string;
}
