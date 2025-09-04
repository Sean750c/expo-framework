// Existing types...
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  msg: string;
  data: T;
}

export type EmptyReponse = ApiResponse<{}>;
export type JSONReponse = ApiResponse<JSON>;
