// Pyrford Badminton Club: small helpers. The site works without this file.

// Paste the club's Google Form link here. Every "sign up" button on the page uses it.
// While it is empty, those buttons scroll to the Joining section instead.
const SIGNUP_FORM_URL = '';

if (SIGNUP_FORM_URL) {
  document.querySelectorAll('.js-form').forEach((a) => {
    a.href = SIGNUP_FORM_URL;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

// "44 years": counted from the first club night, 1 July 1982, so it stays right each year.
const first = new Date(1982, 6, 1);
const now = new Date();
let years = now.getFullYear() - first.getFullYear();
if (now < new Date(now.getFullYear(), 6, 1)) years -= 1;
document.querySelectorAll('.js-years').forEach((el) => { el.textContent = years; });
