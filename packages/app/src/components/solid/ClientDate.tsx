import dayjs from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import { createMemo, type Component } from "solid-js";
dayjs.extend(calendarPlugin);

export const ClientDate: Component<{
  date: Date;
  format?: string;
  calendar?: boolean;
}> = (props) => {
  const str = createClientDate(props);

  return <>{str}</>;
};

export const createClientDate = (props: { date: Date; format?: string; calendar?: boolean }) => {
  const m = createMemo(() => {
    const date = dayjs(props.date);
    return props.calendar ? date.calendar() : date.format(props.format ?? "dddd MMMM D, YYYY [at] h:mm a");
  }, "");

  return m;
};
