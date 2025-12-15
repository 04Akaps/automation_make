export class ApiResponse<T = any> {
  constructor(
    public readonly success: boolean,
    public readonly data: T | null,
    public readonly message: string,
    public readonly error?: string,
    public readonly timestamp: string = new Date().toISOString()
  ) {}

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, data, message);
  }

  static error(message: string, error?: string): ApiResponse<null> {
    return new ApiResponse(false, null, message, error);
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data,
      message: this.message,
      ...(this.error && { error: this.error }),
      timestamp: this.timestamp,
    };
  }
}
