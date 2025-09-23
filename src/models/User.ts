export class User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string
  ) {
    if (!email.includes("@")) {
      throw new Error("Email inválido");
    }
  }

  updateEmail(newEmail: string) {
    if (!newEmail.includes("@")) {
      throw new Error("Email inválido");
    }
    this.email = newEmail;
  }
}
