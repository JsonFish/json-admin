import { http } from "@/utils/http";

import { LoginResult, RefreshTokenResult, LoginParmars } from "./type";

/** 获取图片验证码 */
export const getCaptcha = () => {
  return http.get<any, BasicResponse>("/auth/captcha");
};

/** 登录 */
export const getLogin = (data: LoginParmars) => {
  return http.post<any, LoginResult>("/auth/login", { data });
};

/** 刷新token */
export const refreshTokenApi = () => {
  return http.request<RefreshTokenResult>("get", "/auth/refresh");
};
