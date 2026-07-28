export const getSubdomain = () => {
  const host = window.location.host;
  const parts = host.split('.');
  
  // Check if on localhost
  if (host.includes('localhost')) {
    if (parts.length > 1) {
      return parts[0];
    }
    return null;
  }
  
  // Production: acme.yourapp.com
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
};

export const isSubdomain = () => {
  return getSubdomain() !== null;
};