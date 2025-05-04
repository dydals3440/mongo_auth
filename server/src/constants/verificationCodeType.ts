// const enum
// what this code compiles to js
// its going to inject these values everywhere in our code
// instead of creating an object with these keys values and then referencing
// this  object in our code so you can read up on const enum  doesn't make sense
const enum VerificationCodeType {
  EmailVerification = 'email_verification',
  PasswordReset = 'password_reset',
}

export default VerificationCodeType;
