export interface IResponseTemplate {
  /**
   * Value of the response.
   */
    value: string | number | boolean | string [];
  /**
   * Error message of the response.
   */
  error: string;
}
