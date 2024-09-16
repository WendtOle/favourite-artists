export const isAllowedOrigin = (requestOrigin: string) => {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "").split(',');
    return allowedOrigins.find((allowedOrigin => requestOrigin.includes(allowedOrigin)))
}