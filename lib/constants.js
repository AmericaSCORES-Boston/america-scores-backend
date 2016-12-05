// Example accounts for all endpoint unit tests
const admin = {
  authorization: 'Admin',
  f_name: 'Amanda',
  l_name: 'Diggs',
  email: 'adiggs@americascores.org',
  auth0_id: 'auth0|58437948dff6306470568bd5'
};

const staff = {
  authorization: 'Staff',
  f_name: 'Larry',
  l_name: 'Mulligan',
  email: 'lmulligan@americascores.org',
  auth0_id: 'auth0|584378dda26376e37529be0f'
};

const coach = {
  authorization: 'Coach',
  f_name: 'Ron',
  l_name: 'Large',
  email: 'ronlarge@americascores.org',
  auth0_id: 'auth0|584377c428be27504a2bcf92'
};

const volunteer = {
  authorization: 'Volunteer',
  f_name: 'Maggie',
  l_name: 'Pam',
  email: 'mp@americascores.org',
  auth0_id: 'auth0|5843788eda0529cd293da8e3'
};

module.exports = {
  admin, staff, coach, volunteer
};
