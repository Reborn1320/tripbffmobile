import moment, { Moment } from "moment";

export function toDateUtc(momentLocal: Moment): Moment {
  return moment.utc(momentLocal.format("YYYY-MM-DD"));
}