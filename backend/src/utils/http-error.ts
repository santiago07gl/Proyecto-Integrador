// Error con código HTTP; lo captura el middleware de errores y responde { message }.
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
