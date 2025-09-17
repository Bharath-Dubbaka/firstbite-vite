/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 Latitude of your business
 * @param {number} lon1 Longitude of your business
 * @param {number} lat2 Latitude of the user's location
 * @param {number} lon2 Longitude of the user's location
 * @returns {number} The distance in kilometers
 */
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
   const R = 6371; // Radius of the Earth in km
   const dLat = deg2rad(lat2 - lat1);
   const dLon = deg2rad(lon2 - lon1);
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
         Math.cos(deg2rad(lat2)) *
         Math.sin(dLon / 2) *
         Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   const distance = R * c; // Distance in km
   return distance;
};

function deg2rad(deg) {
   return deg * (Math.PI / 180);
}
