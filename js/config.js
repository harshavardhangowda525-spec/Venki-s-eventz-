/* ==========================================================================
   VENKI'S EVENTZ — SITE CONFIGURATION
   --------------------------------------------------------------------------
   Edit this one file to update business details, images, gallery,
   statistics and testimonials. No other code changes are needed.

   IMAGES: every `src` below can be a full URL or a local path such as
   "assets/photos/wedding-01.jpg". Drop real photos into assets/photos/
   and replace the URLs. Stock photos are used as placeholders.
   ========================================================================== */

window.SITE = {
  business: {
    name: "Venki's Eventz",
    tagline: "Wedding Planning & Event Management — Bengaluru",
    phoneDisplay: "095383 34455",
    phoneIntl: "+919538334455",          // used for tel: links
    whatsapp: "919538334455",            // country code + number, digits only
    whatsappMessage:
      "Hi Venki's Eventz, I'm interested in planning an event. I'd like to know more about your services.",
    addressLine1: "188/1, 7th Cross Road",
    addressLine2: "Bengaluru South, Karnataka",
    hours: "Open 24 Hours",
    serviceArea: "Bengaluru and surrounding areas",
    // Text Google Maps searches for (embed + directions)
    mapQuery: "Venki's Eventz, 188/1, 7th Cross Road, Bengaluru South, Karnataka",
    email: "",                           // optional, e.g. "hello@venkiseventz.com"
    social: {
      // Add full profile URLs to show these icons in the footer
      instagram: "",
      facebook: "",
      youtube: ""
    }
  },

  /* Enquiry form delivery.
     Leave empty  → "Send Enquiry" opens WhatsApp with all form details filled in.
     Set a URL    → form is POSTed (JSON) to that endpoint, e.g. a Formspree
                    URL "https://formspree.io/f/xxxxxxx". WhatsApp is still offered. */
  formEndpoint: "",

  /* Single images used across the page (keyed by data-img="..." in index.html) */
  images: {
    hero1: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=75",
    hero2: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=75",
    hero3: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=2000&q=75",
    about: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=75",
    aboutDetail: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=700&q=75",
    serviceWedding: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=70",
    serviceDecor: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=70",
    serviceReception: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=70",
    serviceBirthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=70",
    serviceCorporate: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70",
    serviceCoordination: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=70",
    why: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=75",
    cta: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=70"
  },

  /* GALLERY — add, remove or reorder freely.
     `tall: true` gives a portrait-shaped tile in the masonry grid. */
  gallery: [
    { src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=1400&q=75", alt: "Elegant wedding reception table with floral centrepieces and candles", caption: "Reception Setup", category: "Receptions", tall: true },
    { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=75", alt: "Grand wedding stage setup with warm lighting", caption: "Stage Design", category: "Stage Setups" },
    { src: "https://images.unsplash.com/photo-1470753937643-efeb931202a9?auto=format&fit=crop&w=1400&q=75", alt: "Floral wedding decoration with fresh roses", caption: "Floral Décor", category: "Floral Decorations", tall: true },
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=75", alt: "Bride and groom sharing a moment at their wedding", caption: "Couple Moments", category: "Weddings" },
    { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=75", alt: "Event venue with dramatic ambient lighting", caption: "Ambient Lighting", category: "Lighting" },
    { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=75", alt: "Decorated banquet table arrangement for a wedding", caption: "Table Arrangements", category: "Tables", tall: true },
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=75", alt: "Outdoor wedding ceremony venue decorated with flowers", caption: "Ceremony Venue", category: "Venues" },
    { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=75", alt: "Bride holding a bouquet on her wedding day", caption: "Bridal Portraits", category: "Weddings", tall: true },
    { src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1400&q=75", alt: "Wedding decoration with candles and soft florals", caption: "Wedding Decorations", category: "Décor" }
  ],

  /* STATISTICS — leave `value: null` to hide a stat until you have a real number.
     Example: { value: 250, suffix: "+", label: "Events Planned" } */
  stats: [
    { value: null, suffix: "+", label: "Events Planned" },
    { value: null, suffix: "+", label: "Happy Clients" },
    { value: null, suffix: "+", label: "Years of Experience" },
    { value: 24, suffix: "/7", label: "Availability" },
    { value: 6, suffix: "", label: "Event Services" },
    { value: 5, suffix: "", label: "Step Planning Process" }
  ],

  /* TESTIMONIALS — replace with real customer reviews.
     Set `placeholder: false` (or remove it) once a review is genuine;
     placeholder reviews show a small "Sample review" tag. */
  testimonials: [
    { quote: "From the first meeting to the last guest leaving, everything was handled beautifully. Our wedding felt exactly like us.", name: "Client Name", event: "Wedding · Bengaluru", placeholder: true },
    { quote: "The décor was breathtaking and the team took care of every small detail, so our families could simply enjoy the day.", name: "Client Name", event: "Reception · Bengaluru", placeholder: true },
    { quote: "Professional, calm and creative. Our engagement ceremony ran perfectly on time and looked stunning.", name: "Client Name", event: "Engagement · Bengaluru", placeholder: true },
    { quote: "They planned our daughter's birthday with so much care — the theme, the lights, the flow. Guests are still talking about it.", name: "Client Name", event: "Birthday Celebration", placeholder: true }
  ]
};
