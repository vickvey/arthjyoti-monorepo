export function apiResponse(
  success: boolean,
  message: string,
  data: any = null,
  errors: any = null
) {
  return {
    success,
    message,
    data,
    errors,
  };
}
