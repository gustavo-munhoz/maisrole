export const isDev = () => process.env.NODE_ENV === 'dev';
export const isProd = () => process.env.NODE_ENV === 'prod';
export const isCI = () => process.env.NODE_ENV === 'ci';
export const isStaging= () => !isProd();