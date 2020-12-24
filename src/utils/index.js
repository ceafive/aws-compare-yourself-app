import { CognitoUserPool } from "amazon-cognito-identity-js";

const POOL_DATA = {
  UserPoolId: "us-east-1_I2ASrvj5O",
  ClientId: "5u6bc17tllpureof6s0d8ouujh"
};

export const userPool = new CognitoUserPool(POOL_DATA);
