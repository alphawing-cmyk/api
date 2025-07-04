export const LoginSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string" },
      password: { type: "string" },
    },
  },
};

const RegisterSchema = {
  body: {
    type: "object",
    required: [
      "username",
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "role",
    ],
    properties: {
      username: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: "string" },
      company: { type: "string", nullable: true },
      password: { type: "string" },
      confirmPassword: {
        type: "string",
        const: {
          $data: "1/password",
        },
      },
      isActive: { type: "boolean", default: true, nullable: true },
      role: {
        type: "string",
        enum: ["demo", "client", "admin", "service"],
        default: "demo",
      },
      imgPath: { type: "string", nullable: true },
    },
    additionalProperties: false,
  },
};

export const ForgotPasswordSchema = {
  body: {
    type: "object",
    required: ["email", "origin"],
    properties: {
      email: { type: "string" },
      origin: { type: "string" },
    },
  },
};


export const ResetPasswordSchema = {
  body: {
    type: "object",
    required: ["password", "token"],
    properties: {
      password: { type: "string" },
      token: { type: "string" },
    },
  },
};

export const IdentifyUserSchema = {
  rbac: {
    roles: ["admin", "demo", "client"],
    permissions: [],
  },
};

export const UpdateUserSchema = {
  rbac: {
    roles: ["admin", "client", "demo"],
    permissions: [],
  },
  body: {
    type: "object",
    properties: {
      firstName: { type: "string", nullable: true },
      lastName: { type: "string", nullable: true },
      email: { type: "string", nullable: true },
      company: { type: "string", nullable: true },
      password: { type: "string", nullable: true },
    },
    additionalProperties: false,
  },
};


