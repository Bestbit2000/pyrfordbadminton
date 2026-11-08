# Pyrford Badminton Club website

A four-page website for Pyrford Badminton Club, Woking. It's plain HTML and CSS: no build step, nothing to install, and it costs nothing to host on GitHub Pages.

| File | What it is |
| --- | --- |
| `index.html` | Home: when, where, cost, who it's for, 40 years, map and parking |
| `come-and-play.html` | How to join, the price, what to bring |
| `questions.html` | Questions people ask |
| `sign-up.html` | The sign-up form (a Google Form shown inside the page) |
| `styles.css` | All the styling (colours are set at the top) |
| `images/shuttle.svg` | The shuttlecock icon shown in browser tabs |

The club's email address isn't anywhere on the site, so junk-mail programs that scan websites can't pick it up. Everything goes through the sign-up form.

## 1. Make the sign-up form (Google Forms, free)

Sign in to Google as the club (pyrfordbadclub@gmail.com), go to [forms.google.com](https://forms.google.com) and start a blank form called "Pyrford Badminton Club: sign up". Suggested questions:

| Question | Type | Required? |
| --- | --- | --- |
| Your name | Short answer | Yes |
| Your email address | Short answer, with Response validation: Text > Email | Yes |
| Phone number | Short answer | No |
| How would you describe your badminton? | Multiple choice: Social / Intermediate / Coming back after a break / Not sure | Yes |
| Which Thursday would you like to come first? | Date | No |
| How did you hear about us? | Multiple choice: Searching online / An AI assistant / Woking Leisure Centre / Facebook / A friend / A website listing / Other | Yes |
| I'm 18 or over | Checkbox | Yes |
| Anything you'd like to ask? | Paragraph | No |

"How did you hear about us?" is the tally the marketing plan uses to see which channels work.

Then:

1. **Get an email for each sign-up:** Responses tab > the three dots > **Get email notifications for new responses**.
2. **Keep it open to everyone:** in Settings, leave "Limit to 1 response" off, because turning it on makes people sign in to Google first.
3. **Get the addresses for the site:** click **Send**.
   - The **<>** (embed) tab shows code containing `src="https://docs.google.com/forms/d/e/.../viewform?embedded=true"`. Copy just that address.
   - The **link** tab gives the form's ordinary address.
4. **Put them in `sign-up.html`:** delete the `form-placeholder` block, uncomment the iframe and the line under it, and paste the embed address into `src="..."` and the ordinary address into `href="..."`.

The site says "We only use your details to arrange your visit and to keep in touch about the club." Check the committee is happy with that wording, and only keep sign-ups as long as you need them.

## 2. Put the site online (GitHub Pages, free)

1. Create a new **public** repository on GitHub, for example `pyrford-badminton-club`. A free GitHub account only hosts sites from public repositories.
2. Upload all these files, keeping the `images` folder: **Add file > Upload files**, drag them in, then **Commit changes**.
3. In the repository, go to **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and click **Save**.
4. After a minute or two, the site appears at `https://<your-github-name>.github.io/pyrford-badminton-club/`. The address is shown at the top of the Pages settings.

Every change you commit to `main` updates the site within a minute or two.

## Using your own web address later

If the club buys an address such as `pyrfordbadminton.co.uk`, add it under **Settings > Pages > Custom domain** and follow GitHub's instructions for the DNS records. Then add the site to Google Search Console (free) so you can see what people search for.

## Still to fill in

- **The sign-up form**: step 1 above.
- **More questions** (`questions.html`, marked `TO FILL IN`): how many courts, how games get organised, coming back after years away. If you add a question to the page, add it to the list at the top of the file too. That list is what search engines and AI assistants read.
- **Photos** (`index.html`, marked `PHOTOS`): when you have some, save them in `images/` and uncomment the photo block. Give every picture a description (`alt`), and only use photos of members who are happy to be online.
- **Junior club link**: the Lightwater Junior Badminton Club link goes to its Surrey County Council directory entry. If the club has its own website (the old Google Site links to it), use that address instead.
- **Last updated**: change the date at the bottom of each page whenever you update the site.

## Keep the facts the same everywhere

Use the same wording on this site, Facebook, the leisure centre and every directory: **Pyrford Badminton Club, every Thursday 8-10pm, Woking Leisure Centre, Kingfield Road, Woking GU22 9BA, £70 a quarter, first two sessions free.** When every place agrees, search engines and AI assistants are confident enough to recommend the club.
