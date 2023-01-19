import axios from "../../node_modules/axios";
import notification from "ant-design-vue/es/notification";
import { getCookie, setCookie, getUrlParam } from "./index";
// 创建 axios 实例
const request = axios.create({
  baseURL: "/",
  timeout: 60000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  console.warn(error);
  const {
    config: { headers },
  } = error;
  if (headers.showNotice === false) return Promise.reject(error);
  if (error.response) {
    const data = error.response.data;
    if (error.response.status === 500) {
      notification.error({
        message: "内部服务器错误",
        description: data.message || data.msg || "",
      });
    }
    if (error.response.status === 403) {
      notification.error({
        message: "禁止的",
        description: data.message || data.msg || "",
      });
    }
    if (error.response.status === 401) {
      notification.error({
        message: "未经授权",
        description: "授权验证失败",
      });

      const redirectUrl =
        window._VUE_APP_REDIRECT_URL ||
        "http://10.252.206.19:30093/exchangePortal/#/login?redirectUrl=" +
          window.location.href;
      window.location.href = redirectUrl;
    }

    if (error.response.status === 400) {
      notification.error({
        message: "传参错误",
        description: error.response.data.message,
      });
    }
  }
  return Promise.reject(error);
};

// 尝试从url上获取productCode
let productCode;
if ((productCode = getUrlParam("productCode"))) {
  setCookie("PRODUCT_CODE", decodeURIComponent(productCode));
}

// 尝试从url上获取token
let token;
if ((token = getUrlParam("token"))) {
  setCookie("EXCHANGE_TOKEN", decodeURIComponent(token));
  // 去除url上的token并且重定向
  const [url] = window.location.href.split("?");
  if (/^http(s)?:\/\/.+/.test(url)) {
    window.location.href = url + "?productCode=" + getCookie("PRODUCT_CODE");
  }
}
request.interceptors.request.use((config) => {
  const token = getCookie("ACCESS_TOKEN");
  const exchangeToken = getCookie("EXCHANGE_TOKEN");
  if (token) {
    config.headers["Authorization"] = token;
  }
  if (exchangeToken) {
    config.headers["Auth-Legacy-Token"] = exchangeToken;
  }
  const method = config.method;
  const isIncludes = (list = [], item) => {
    return list.includes(item);
  };
  if (
    isIncludes(["post", "put"], method) &&
    !/data-model-property/.test(config.url)
  ) {
    if (config.data instanceof FormData) {
      config.data.append("projectId", projectId);
    } else {
      config.data = {
        ...(config.data || {}),
      };
    }
  }
  if (isIncludes(["get"], method)) {
    config.params = {
      ...(config.params || {}),
    };
  }
  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  const url = response?.config?.url;
  const isCenterApi = url.indexOf("ds-server-metadata") > -1;
  const isBaseApi = url.indexOf("ds-server-metadata") > -1;
  const code = response?.data?.code || 0;
  if (code == 0 || code == 200) {
    const {
      config: { headers },
    } = response;
    if (headers.showNotice === false) return response.data;
    const method = response.config.method;
    // center/base 的获取列表接口用的也是post方法，无需弹提示
    if (
      (isCenterApi && ["post"].indexOf(method) > -1) ||
      (isBaseApi && ["post"].indexOf(method) > -1)
    ) {
      // eslint-disable-next-line
    } else if (["post", "put", "delete"].indexOf(method) > -1) {
      notification.success({
        description: response.data.msg || "保存成功",
        message: "成功",
      });
    }
    return response;
  }
  return Promise.reject(response);
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
