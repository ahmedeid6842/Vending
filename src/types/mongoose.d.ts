import { Query } from 'mongoose';

declare module 'mongoose' {
  interface Query<ResultType = any, DocType = any, THelpers = {}, RawDocType = DocType> {
    cache: (options?: { useCache?: boolean; key?: any }) => Query<ResultType, DocType, THelpers, RawDocType>;
    useCache?: boolean;
    hashKey?: string;
  }
}