/**
 * ============================================================
 *  WEDDING CONFIGURATION
 *  Edit everything about the invitation from this single file.
 *  See README.md for a full walkthrough of every field.
 * ============================================================
 */

const weddingConfig = {

  couple: {
    bride: "Priya",
    brideFull: "Priya",
    groom: "Swaraj",
    groomFull: "Swaraj Kumar",
    hashtag: "#SwarajAndPriyaTieTheKnot"
  },

  images: {
    hero: "https://ik.imagekit.io/twcoyrvbw/Wedding%20Images/Main_S1-NHDZcy",
    closing: "https://ik.imagekit.io/twcoyrvbw/Wedding%20Images/0011.jpg.jpeg"
  },

  // ISO date string used to drive the countdown. Keep the timezone offset
  // accurate for the wedding location.
  weddingDateISO: "2026-09-14T10:00:00+05:30",
  // Testing Date
  // weddingDateISO: "2025-01-01T10:00:00+05:30",
  weddingYear: "2026",
  liveStreamUrl: "https://www.youtube.com/",

  wedding: {
    label: "The Wedding Ceremony",
    date: "Monday, 14th September 2026",
    time: "10:00 AM",
    venue: "Trinity Lutheran Church, A+ Parish",
    address: "Suryabagh, Visakhapatnam",
    mapsUrl: "https://maps.google.com/?q=Trinity+Lutheran+Church+A%2B+Parish+Suryabagh+Visakhapatnam"
  },

  reception: {
    label: "The Reception",
    date: "Monday, 14th September 2026",
    time: "12:00 noon onwards",
    venue: "Vuda Children's Arena",
    address: "Siripuram, Visakhapatnam",
    mapsUrl: "https://maps.google.com/?q=Vuda+Children%27s+Arena+Siripuram+Visakhapatnam"
  },

  venueSection: {
    name: "Trinity Lutheran Church, A+ Parish",
    address: "Suryabagh, Visakhapatnam, Andhra Pradesh",
    // Paste your exact Google Maps place or directions URL here.
    directionsUrl: "https://maps.google.com/?q=Trinity+Lutheran+Church+A%2B+Parish+Suryabagh+Visakhapatnam",
    mapsUrl: "https://maps.google.com/?q=Trinity+Lutheran+Church+A%2B+Parish+Suryabagh+Visakhapatnam"
  },

  timeline: [
    {
      time: "10:00 AM",
      title: "Wedding Ceremony",
      description: "The Holy Matrimony of Swaraj Kumar and Priya."
    },
    {
      time: "10:00 AM",
      title: "Wedding Bells",
      description: "The wedding ceremony will be solemnized at Trinity Lutheran Church, A+ Parish."
    },
    {
      time: "10:00 AM",
      title: "Message & Blessings",
      description: "Message by Rev. Srikanth James RRK, Parish Pastor, Trinity Lutheran Church North Parish."
    },
    {
      time: "12:00 PM",
      title: "Reception",
      description: "Reception begins at Vuda Children's Arena, Siripuram, Visakhapatnam."
    },
    {
      time: "12:00 PM",
      title: "Celebration",
      description: "Family and friends gather to celebrate the newly married couple."
    }
  ],

  gallery: [
    {
      image: "https://ik.imagekit.io/twcoyrvbw/Wedding%20Images/IMG-20260608-WA0028.jpg.jpeg?updatedAt=1788830599218",
      alt: "Wedding rings resting on a bouquet",
      label: "The details",
      caption: "Little things, held close"
    },
    {
      image: "https://ik.imagekit.io/twcoyrvbw/Wedding%20Images/0033.jpg.jpeg",
      alt: "Bride and groom walking together after the ceremony",
      label: "The promise",
      caption: "Where every step leads to us"
    },
    {
      image: "https://ik.imagekit.io/twcoyrvbw/Wedding%20Images/0044.jpg.jpeg",
      alt: "Newlyweds holding hands outdoors",
      label: "The beginning",
      caption: "A day written in sunlight"
    },
    {
      image: "https://ik.imagekit.io/twcoyrvbw/Wedding%20Images/0022.jpg.jpeg",
      alt: "Bride in a wedding dress among flowers",
      label: "The glow",
      caption: "A little magic in the air"
    },
    {
      image: "https://ik.imagekit.io/twcoyrvbw/Wedding%20Images/0011.jpg.jpeg",
      alt: "Wedding guests celebrating together",
      label: "The celebration",
      caption: "Love, gathered around us"
    }
  ],

  story: {
    heading: "Two Hearts, One Beautiful Journey",
    paragraph: "With the blessings of our families and loved ones, Swaraj Kumar and Priya invite you to join them as they begin their beautiful journey together."
  },

  music: {
    enabled: true,
    source: "assets/music/wedding-song.mp3",
    title: "Our Song"
  },

  navigation: [
    { label: "Gallery", href: "#gallery" },
    { label: "Events", href: "#events" },
    { label: "Venue", href: "#venue" }
  ]
};

window.weddingConfig = weddingConfig;