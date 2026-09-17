export function optimizeCloudinaryUrl(url: string | null | undefined, width = 1600) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url ?? "";
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
