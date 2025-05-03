import { http } from "@/utils/http";
import type { QueryParams, ArticleData, ArticleInfo } from "./type";
enum Path {
  Article = "/article",
  Status = "/article/status"
}

// 获取文章
export const getArticle = (params: QueryParams) => {
  return http.request<BasicResponse<ArticleData>>("get", Path.Article, {
    params
  });
};

// 新增文章
export const addArticle = (data: ArticleInfo) => {
  return http.request<BasicResponse>("post", Path.Article, { data });
};

// 修改文章
export const updateArticle = (data: ArticleInfo) => {
  return http.request<BasicResponse>("put", Path.Article, { data });
};

// 上/下架文章
export const updateStatus = (data: { id: number }) => {
  return http.request<BasicResponse>("put", Path.Status, { data });
};

// 删除文章
export const deletArticle = (data: { id: number }) => {
  return http.request<BasicResponse>("delete", Path.Article, { data });
};
