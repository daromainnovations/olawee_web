
export function deleteWooCommerceSessionCookies() {
  document.cookie
    .split(";")
    .forEach((cookie) => {
      if (cookie.trim().startsWith("wordpress_logged_in")) {
        const domain = window.location.hostname;
        const baseDomain = domain.includes("localhost") ? domain : `.${domain}`;
        document.cookie = `${cookie.trim().split("=")[0]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${baseDomain}`;
      }
    });
}