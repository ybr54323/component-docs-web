// 普通表
export const NormalTable = {
  customHeaderCell(column, index) {
    return {
      style: {
        padding: "16px 24px",
        "font-size": "14px",
        "font-family": "PingFangSC-Medium, PingFang SC",
        "font-weight": "500",
        color: "rgba(0, 0, 0, 0.85)",
        "white-space": "nowrap",
        background: "rgba(0, 0, 0, 0.02)",
      },
    };
  },

  customCell(record, index) {
    let style = {
      padding: "16px 24px",
      "font-size": "14px",
      "font-family": "PingFangSC-Regular, PingFang SC",
      "font-weight": "400",
      color: "rgba(0, 0, 0, 0.65)",
      "word-break": "break-word",
    };
    return { style };
  },
};
