import Ajv, { Options as AjvOptions } from "ajv";


const createAjvInstance = (options: AjvOptions) => new Ajv.default(options);

const schemaCompilers = {
  body: createAjvInstance({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
    $data: true,
  }),
  params: createAjvInstance({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
  querystring: createAjvInstance({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
  headers: createAjvInstance({
    removeAdditional: false,
    coerceTypes: true,
    allErrors: true,
  }),
};

export default schemaCompilers;