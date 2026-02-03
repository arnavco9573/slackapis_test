import localFont from "next/font/local";

const primaryFont = localFont({
  src: [
    {
      path: "./Urbanist-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./Urbanist-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./Urbanist-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Urbanist-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Urbanist-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Urbanist-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Urbanist-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Urbanist-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./Urbanist-Black.ttf",
      weight: "900",
      style: "normal",
    },

    // from smallest to largest italic style
    {
      path: "./Urbanist-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "./Urbanist-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "./Urbanist-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./Urbanist-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Urbanist-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Urbanist-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./Urbanist-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./Urbanist-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "./Urbanist-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-primary",
});

export { primaryFont };
