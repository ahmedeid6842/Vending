import "joi";

declare module "joi" {
  interface Root {
    objectId(): Joi.AnySchema;
  }
}
