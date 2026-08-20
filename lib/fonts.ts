import localFont from "next/font/local";

// Yonsei's own typefaces, from the Design Center's UI package (internal-only
// distribution, used with the founding director's confirmation that an
// official Yonsei center's own site is within the intended scope). Shared
// between the homepage title and the CenterLogo block so both draw from the
// same font instances rather than loading the files twice.
export const yonseiLogo = localFont({
  src: "../app/fonts/YonseiLogo.ttf",
  variable: "--font-yonsei-logo",
});
export const yonseiBold = localFont({
  src: "../app/fonts/YonseiBold.ttf",
  variable: "--font-yonsei-bold",
});

// Same variable font as infosci.github.io (Yonsei DataLab) — shared brand
// typeface across both sites, one person maintaining both.
export const googleSansFlex = localFont({
  src: "../app/fonts/GoogleSansFlex-Variable.woff2",
  variable: "--font-google-sans-flex",
  weight: "100 900",
});
