// These are publicly documented demo credentials, never production secrets.
export const demoUser = { username: 'standard_user', password: 'secret_sauce' };

export const products = {
  backpack: { name: 'Sauce Labs Backpack', price: '$29.99' },
  bikeLight: { name: 'Sauce Labs Bike Light', price: '$9.99' },
} as const;

export const customer = {
  firstName: 'Alex',
  lastName: 'Taylor',
  postalCode: 'LS1 1AA',
};
