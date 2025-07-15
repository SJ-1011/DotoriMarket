export interface ApiRes<T> {
  ok: 1 | 0;
  message?: string;
  item?: T;
}

export type ApiResPromise<T> = Promise<ApiRes<T>>;
