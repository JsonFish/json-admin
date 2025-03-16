export interface QueryParmars {
  name: string;
  page: number;
  pageSize: number;
  status: number;
}

export interface LinkData {
  linkList: LinkInfo[];
  total: number;
}

export interface LinkInfo {
  applicant?: string;
  createTime?: string;
  id: number;
  avatar: string;
  description: string;
  name: string;
  link: string;
  status?: number;
  updateTime?: string;
}
