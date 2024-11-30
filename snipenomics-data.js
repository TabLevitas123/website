// Configuration for Snipenomics slides and transitions
export const SLIDE_DURATION = 5000; // Duration in milliseconds
export const TRANSITION_DURATION = 500;

export const SLIDE_BACKGROUNDS = {
  primary: "bg-gradient-to-br from-blue-900 to-purple-900",
  secondary: "bg-gradient-to-br from-purple-900 to-indigo-900",
  tertiary: "bg-gradient-to-br from-indigo-900 to-blue-900"
};

export const slides = [
  {
    id: "intro",
    title: "What is $SNIPE?",
    content: "",
    background: SLIDE_BACKGROUNDS.primary,
    animation: "fade-in"
  },
  {
    id: "token-definition",
    title: "$SNIPE Token",
    content: "$Snipe is a publicly traded Deflationary ERC-20 Token on the Ethereum blockchain.",
    background: SLIDE_BACKGROUNDS.secondary,
    animation: "slide-right"
  },
  {
    id: "utility-question",
    title: "Did somebody say 'Utility'?",
    content: "",
    background: SLIDE_BACKGROUNDS.tertiary,
    animation: "zoom-in"
  },
  {
    id: "utility-explanation",
    title: "Unique Utility",
    content: "What sets $SNIPE apart from other tokens is its unique utility. It serves as the sole means of purchasing services from the SniperAI platform",
    background: SLIDE_BACKGROUNDS.primary,
    animation: "slide-up"
  },
  {
    id: "snipenomics-intro",
    title: "SNIPENOMICS",
    content: "",
    background: SLIDE_BACKGROUNDS.secondary,
    animation: "fade-in"
  },
  {
    id: "total-supply",
    title: "Total Supply",
    content: "1,000,000,000",
    background: SLIDE_BACKGROUNDS.tertiary,
    animation: "number-count"
  },
  {
    id: "supply-lock",
    title: "Supply Lock",
    content: "96% Supply Locked for 1 Year",
    background: SLIDE_BACKGROUNDS.primary,
    animation: "slide-left"
  },
  {
    id: "fair-launch",
    title: "Fair Launch",
    content: "Fair Launch, No Presale, 100% SAFU",
    background: SLIDE_BACKGROUNDS.secondary,
    animation: "fade-in"
  },
  {
    id: "ethereum-lp",
    title: "Ethereum LP",
    content: "Ethereum Starting LP: 5 ETH",
    background: SLIDE_BACKGROUNDS.tertiary,
    animation: "slide-up"
  },
  {
    id: "launch-tax",
    title: "Launch Tax",
    content: "Launch Tax: 5,10% Launch Tax (Sent to Marketing & Treasury)",
    background: SLIDE_BACKGROUNDS.primary,
    animation: "fade-in"
  },
  {
    id: "social-media",
    title: "Social Media",
    content: "Twitter: @SnipeAI_ETH\nTelegram: @SnipeAI_ETH\nYoutube: Snipe AI_ETH",
    background: SLIDE_BACKGROUNDS.secondary,
    animation: "slide-up"
  },
  {
    id: "token-listings",
    title: "Token Listings",
    content: "Etherscan: [Placeholder]\nDextools: [Placeholder]\nDexscreener [Placeholder]",
    background: SLIDE_BACKGROUNDS.tertiary,
    animation: "fade-in"
  },
  {
    id: "partners",
    title: "Partners",
    content: "Huge thanks go out to our partners! Dextools, Dexscreener, DWG Labs, and ByBit.",
    background: SLIDE_BACKGROUNDS.primary,
    animation: "slide-right"
  },
  {
    id: "contact",
    title: "Contact",
    content: "Questions? Comments? General Naval Gazings? Email us at: Admin@SnipeAI.io",
    background: SLIDE_BACKGROUNDS.secondary,
    animation: "fade-in"
  },
  {
    id: "thanks",
    title: "THANKS FOR WATCHING!",
    content: "",
    background: SLIDE_BACKGROUNDS.tertiary,
    animation: "zoom-in"
  }
];