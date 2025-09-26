export class ApiError extends Error {
  constructor(status, messege) {
    super(messege);
    this.status = status;
  }
}
