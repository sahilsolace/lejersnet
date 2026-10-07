// Mock address service — in production, addresses could sync from
// a Wix CMS collection or a dedicated backend.

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const addressService = {
  async geocodeAddress(_street: string, _postcode: string, _city: string): Promise<{ lat: number; lng: number }> {
    await delay(500);
    return { lat: 55.6761 + Math.random() * 0.05, lng: 12.5683 + Math.random() * 0.05 };
  },
};
