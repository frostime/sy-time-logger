export const thisYear = () => {
    let date = new Date();
    return date.getFullYear();
}

export interface IWeek {
    index: number;
    start: Date;
    end: Date;
}

export function getWeek(date: Date): IWeek {
    const currentDate = new Date(date.getTime()); // 创建一个新的日期对象，以避免修改原始日期对象
  
    let dayOfWeek = currentDate.getDay(); // 获取当天是星期几
    dayOfWeek -= 1;
    dayOfWeek = dayOfWeek < 0 ? 6 : dayOfWeek;
  
    const startOfWeek = new Date(currentDate); // 复制当前日期对象
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek); // 设置为本周的第一天
  
    const endOfWeek = new Date(currentDate); // 复制当前日期对象
    endOfWeek.setDate(currentDate.getDate() + (6 - dayOfWeek)); // 设置为本周的最后一天
  
    const weekIndex = Math.ceil(
      (currentDate.getDate() - startOfWeek.getDate() + 1) / 7
    ); // 计算本周是本年度的第几周
  
    return {
      index: weekIndex,
      start: startOfWeek,
      end: endOfWeek,
    };
}
