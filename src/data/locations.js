// Location hierarchy seed: countries → states → cities → areas (with ZIP/PIN codes).
// Admins can add more from /admin/locations.

export const SEED_COUNTRIES = [
  { id: 'IN', name: 'India', currency: 'INR' },
  { id: 'US', name: 'United States', currency: 'USD' },
];

export const SEED_STATES = [
  { id: 'GJ', countryId: 'IN', name: 'Gujarat' },
  { id: 'MH', countryId: 'IN', name: 'Maharashtra' },
  { id: 'DL', countryId: 'IN', name: 'Delhi' },
  { id: 'KA', countryId: 'IN', name: 'Karnataka' },
  { id: 'TG', countryId: 'IN', name: 'Telangana' },
  { id: 'TN', countryId: 'IN', name: 'Tamil Nadu' },
  { id: 'WB', countryId: 'IN', name: 'West Bengal' },
  { id: 'RJ', countryId: 'IN', name: 'Rajasthan' },
  { id: 'NY', countryId: 'US', name: 'New York' },
];

export const SEED_CITIES = [
  { slug: 'ahmedabad', name: 'Ahmedabad', stateId: 'GJ', lat: 23.0225, lng: 72.5714,
    areas: [['Satellite', '380015'], ['Navrangpura', '380009'], ['Bodakdev', '380054'], ['Maninagar', '380008'], ['Prahlad Nagar', '380015'], ['Dholka', '382225'], ['Bopal', '380058']] },
  { slug: 'mumbai', name: 'Mumbai', stateId: 'MH', lat: 19.076, lng: 72.8777,
    areas: [['Andheri West', '400053'], ['Bandra West', '400050'], ['Powai', '400076'], ['Dadar', '400014'], ['Colaba', '400005']] },
  { slug: 'delhi', name: 'Delhi', stateId: 'DL', lat: 28.6139, lng: 77.209,
    areas: [['Saket', '110017'], ['Dwarka', '110075'], ['Rajouri Garden', '110027'], ['Connaught Place', '110001']] },
  { slug: 'bengaluru', name: 'Bengaluru', stateId: 'KA', lat: 12.9716, lng: 77.5946,
    areas: [['Indiranagar', '560038'], ['Koramangala', '560034'], ['Whitefield', '560066'], ['Jayanagar', '560041']] },
  { slug: 'hyderabad', name: 'Hyderabad', stateId: 'TG', lat: 17.385, lng: 78.4867,
    areas: [['Banjara Hills', '500034'], ['Gachibowli', '500032'], ['Kukatpally', '500072']] },
  { slug: 'pune', name: 'Pune', stateId: 'MH', lat: 18.5204, lng: 73.8567,
    areas: [['Kothrud', '411038'], ['Baner', '411045'], ['Viman Nagar', '411014']] },
  { slug: 'chennai', name: 'Chennai', stateId: 'TN', lat: 13.0827, lng: 80.2707,
    areas: [['T. Nagar', '600017'], ['Adyar', '600020'], ['Anna Nagar', '600040']] },
  { slug: 'kolkata', name: 'Kolkata', stateId: 'WB', lat: 22.5726, lng: 88.3639,
    areas: [['Salt Lake', '700091'], ['Park Street', '700016'], ['Ballygunge', '700019']] },
  { slug: 'jaipur', name: 'Jaipur', stateId: 'RJ', lat: 26.9124, lng: 75.7873,
    areas: [['Malviya Nagar', '302017'], ['Vaishali Nagar', '302021'], ['C-Scheme', '302001']] },
  { slug: 'surat', name: 'Surat', stateId: 'GJ', lat: 21.1702, lng: 72.8311,
    areas: [['Adajan', '395009'], ['Vesu', '395007'], ['Athwa', '395001']] },
  { slug: 'rajkot', name: 'Rajkot', stateId: 'GJ', lat: 22.3039, lng: 70.8022,
    areas: [['Kalawad Road', '360005'], ['Race Course', '360001']] },
  { slug: 'vadodara', name: 'Vadodara', stateId: 'GJ', lat: 22.3072, lng: 73.1812,
    areas: [['Alkapuri', '390007'], ['Gotri', '390021'], ['Akota', '390020']] },
  { slug: 'new-york', name: 'New York', stateId: 'NY', lat: 40.7128, lng: -74.006,
    areas: [['Manhattan', '10001'], ['Brooklyn', '11201'], ['Queens', '11354']] },
].map((c, i) => ({
  ...c,
  id: `city_${i + 1}`,
  popular: true,
  areas: c.areas.map(([name, pincode]) => ({ name, pincode })),
}));
