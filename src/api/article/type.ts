export interface QueryParams {
  id?: number | string | string[];
  title?: string;
  page?: number;
  pageSize?: number;
  status?: number;
}

export interface ArticleData {
  articleList: ArticleInfo[];
  total: number;
}

export interface ArticleInfo {
  content: string;
  description: string;
  title: string;
  create_time?: string;
  id: number | string;
  isTop: number;
  status: number;
  tagIds: number[];
  tags?: Tag[];
  update_time?: string;
}

export interface Tag {
  tagName: string;
}
