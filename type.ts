interface Column {
  dataIndex: string; // 字段的key
  label: string; // label文本
  type:
    | "input"
    | "select"
    | "textarea"
    | "treeSelect"
    | "password"
    | "number"
    | "radio"
    | "datePicker"; // 表单项类型
  allowClear: boolean;
  selections: Selection[];
  placeholder: string;
  treeData?: TreeNode[]; // 当表单项type为treeSelect时生效
  initialValue?: string | number; // 初始值
  maxLength?: number;
  max?: number;
  min?: number;
  precision?: number; // 精度
  rate?: 1 | 0.5 | 0.33 | 0.333 | 0.3333 | 0.25; // 默认为1，表示表单项占据一行，0.5表示占据半行，即表单可以为两列布局，0.33表示以3列布局，0,25表示以4列布局
  disabled?: boolean;
  readonly?: boolean;
}
interface Selection {
  value: number | string;
  label: string;
  selectable?: boolean;
  key?: number | string;
}
interface TreeNode {
  label: string;
  value: number | string;
  name: string;
  selectable: boolean;
  children: TreeNode[];
}
