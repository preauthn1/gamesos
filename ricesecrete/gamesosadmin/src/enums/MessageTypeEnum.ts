/* 消息类型枚举 */
export const enum MessageTypeEnum {
  /* 消息 */
  MESSAGE = "MESSAGE",
  /* 通知 */
  NOTICE = "NOTICE",
  /* 待办 */
  TODO = "TODO",
}

export const MessageTypeLabels = {
  [MessageTypeEnum.MESSAGE]: "消息",
  [MessageTypeEnum.NOTICE]: "通知",
  [MessageTypeEnum.TODO]: "待办",
};
export interface NotifyMessageItem {
  //  ID
  id: string;
  // 标题
  title: string;
  // 类型
  type: MessageTypeEnum;
  // 跳转地址
  url: string;
  // 状态 0:未读 1:已读
  status: number;
}
