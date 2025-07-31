import Joi from 'joi';

declare module 'joi' {
  interface Root {
    objectId(): Joi.AnySchema;
  }
}

declare module 'joi-objectid' {
  function joiObjectId(Joi: any): any;
  export = joiObjectId;
}
