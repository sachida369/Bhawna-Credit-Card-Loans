# Smart Loan Advisor — GitHub Pages Static LeadGen Site

This is a static, GitHub Pages-friendly lead generation website for Smart Loan Advisor (https://smartloanadvisor.shop/). It includes:
- index.html (homepage with lead capture form)
- blog.html + sample post
- contact.html, privacy-policy.html, terms.html
- assets (css, js, images)
- WhatsApp floating chat button and call/email contact links

## Email notifications (Option A)

This static site cannot send server-side email by itself. Two easy options to receive email notifications when a user submits the form:

1. **Formspree (recommended, no-code)**:
   - Sign up at https://formspree.io
   - Create a form and copy your endpoint (e.g. https://formspree.io/f/abcd)
   - Open `index.html` and set `CONFIG.FORM_ENDPOINT` to that URL (in the inline script near the bottom).
   - Submissions will be forwarded to `brainimmensitynetwork@gmail.com` if configured in Formspree dashboard.

2. **Email fallback (default)**:
   - If `FORM_ENDPOINT` is empty, the form uses `mailto:` fallback which opens the user's email client prefilled with lead details.

3. **EmailJS (client-side SMTP)**:
   - Alternatively you can integrate EmailJS (emailjs.com) for sending emails from client-side using their service keys. Replace `postToEndpoint` in `assets/js/main.js` with EmailJS code as documented by EmailJS.

## How to publish on GitHub Pages
1. Create a new GitHub repo and push these files to the `main` branch.
2. In repository settings → Pages, select `main` branch / root as source, save.
3. Your site will be available at `https://<your-username>.github.io/<repo>/` or configure a custom domain (smartloanadvisor.shop).

## Quick customizations
- Replace placeholder images in `assets/images/` with real hero and logo images.
- Update phone/email in `index.html` and `contact.html` (already set to +91-8595469797 and brainimmensitynetwork@gmail.com).
- Set `CONFIG.FORM_ENDPOINT` in `index.html` to your Formspree endpoint for direct email notifications.

