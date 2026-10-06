/**
 * French copy for the content that lives in the database (products, collections, journal,
 * categories, homepage blocks). Applied by scripts/apply-fr.ts — keyed by slug / homepage key.
 */

type ProductFr = { name: string; short: string; description: string; material: string; color: string; features: string[] };

export const productsFr: Record<string, ProductFr> = {
  "cropped-short-sleeve-blazer-sky": {
    name: "Blazer court à manches courtes",
    short: "Une veste tailleur raccourcie à l’ourlet comme à la manche.",
    description:
      "Notre silhouette signature pour le PE26. Un blazer droit au corps raccourci et aux manches à hauteur de coude, coupé dans un sergé fluide en laine mélangée. Porté ici avec le pantalon large à pinces assorti.",
    material: "Sergé laine mélangée — 55 % polyester, 40 % viscose, 5 % laine",
    color: "Ciel",
    features: ["Corps raccourci, épaule tombante", "Manches à hauteur de coude", "Demi-doublure pour l’été", "Boutons effet corne"],
  },
  "contrast-lapel-cropped-blazer-navy": {
    name: "Blazer court à revers contrasté",
    short: "Un tailoring marine relevé d’un revers écru net.",
    description:
      "Un blazer marine raccourci, fini d’un revers écru contrasté et de manches courtes. Pensé en ensemble avec le short tailleur pour un uniforme d’été net et graphique.",
    material: "Gabardine coton mélangé — 65 % coton, 35 % polyester",
    color: "Marine / Écru",
    features: ["Revers cranté contrasté", "Corps raccourci", "Manches courtes au pli marqué", "Poche intérieure dissimulée"],
  },
  "camp-collar-overshirt-sand": {
    name: "Surchemise à col camp",
    short: "Une surchemise en lin lavé au col camp ouvert.",
    description:
      "Oversize, à manches courtes et coupée dans un lin mélangé lavé en pièce. Le col à parementure contrastée se porte ouvert ; l’ourlet droit se porte sorti, sur le short assorti.",
    material: "Lin mélangé — 55 % lin, 45 % viscose",
    color: "Sable",
    features: ["Col camp ouvert à parementure contrastée", "Lavée en pièce pour plus de souplesse", "Ourlet droit", "Fentes latérales"],
  },
  "boxy-contrast-jacket-burgundy": {
    name: "Veste carrée contrastée",
    short: "Une veste bordeaux à épaules cape et col écru.",
    description:
      "Une veste architecturale aux épaules cape prolongées, aux poches plaquées et au col écru. Assez structurée pour tenir sa silhouette carrée, assez souple pour se porter ouverte sur un gilet.",
    material: "Sergé compact — 70 % polyester, 30 % viscose",
    color: "Bordeaux / Écru",
    features: ["Épaule cape prolongée", "Grandes poches plaquées", "Col contrasté", "Coutures entièrement gansées"],
  },
  "contrast-collar-jacket-sky": {
    name: "Veste à col contrasté",
    short: "La pièce de la campagne — bleu ciel et col écru.",
    description:
      "Le visage de la campagne PE26. Une veste raccourcie à manches courtes en sergé bleu ciel, au large col à revers écru. Se porte avec le pantalon taille haute à pinces pour le look complet.",
    material: "Sergé laine mélangée — 55 % polyester, 40 % viscose, 5 % laine",
    color: "Ciel / Écru",
    features: ["Large col à revers contrasté", "Corps raccourci et carré", "Manches courtes", "Boutons en corozo ton sur ton"],
  },
  "tuxedo-crop-jacket-ivory": {
    name: "Veste smoking courte",
    short: "Une veste du soir ivoire au revers en satin noir.",
    description:
      "Les codes du soir, pour le jour. Une veste ivoire raccourcie au revers en pointe noir et à la longue ceinture à nouer qui tombe de la taille. Portée avec un short tailleur et des mocassins.",
    material: "Gabardine coton mélangé — 65 % coton, 35 % polyester ; revers en satin",
    color: "Ivoire / Noir",
    features: ["Revers en pointe en satin noir", "Longue ceinture à nouer amovible", "Corps raccourci", "Fermeture un bouton"],
  },
  "relaxed-poplin-shirt-chocolate": {
    name: "Chemise ample en popeline",
    short: "Une chemise en popeline dense couleur chocolat, coupée généreusement.",
    description:
      "Un basique du vestiaire dans un chocolat profond. Ample au corps, avec un col pointu souple et une seule poche poitrine. Stylée avec le pantalon ballon olive.",
    material: "Popeline de coton — 100 % coton",
    color: "Chocolat",
    features: ["Col pointu souple", "Une poche poitrine", "Ourlet arrondi", "Boutons effet nacre"],
  },
  "patchwork-stripe-overshirt": {
    name: "Surchemise patchwork à rayures",
    short: "Des rayures marine et ciel assemblées sur une surchemise épurée.",
    description:
      "Des chutes des tissus marine et ciel de la saison, assemblées en un panneau rayé graphique. Chaque panneau est posé à la main : aucune pièce ne place les rayures exactement de la même façon.",
    material: "Sergé coton mélangé — 65 % coton, 35 % polyester",
    color: "Ciel / Marine",
    features: ["Panneau patchwork posé à la main", "Coupe carrée", "Patte de boutonnage cachée", "Réalisée à partir de chutes de production"],
  },
  "piped-wide-leg-trouser-navy": {
    name: "Pantalon large passepoilé",
    short: "Un pantalon marine taille haute à passepoil blanc.",
    description:
      "Un pantalon large taille haute à double pince, en marine, avec un passepoil blanc contrasté le long de la couture extérieure. La taille se noue sur le côté pour un ajustement réglable.",
    material: "Sergé aspect laine — 70 % polyester, 30 % viscose",
    color: "Marine",
    features: ["Passepoil contrasté sur la couture extérieure", "Double pince devant", "Réglages de taille à nouer sur les côtés", "Pli central marqué"],
  },
  "check-cropped-blouson-tobacco": {
    name: "Blouson court à carreaux",
    short: "Des carreaux tabac et de profonds poignets en bord-côte.",
    description:
      "La pièce phare d’After Dark. Un blouson court à carreaux tabac brossés, aux grands poignets en bord-côte et au col net. Photographié en extérieur, dans la ville, la nuit.",
    material: "Carreaux brossés — 60 % polyester, 30 % viscose, 10 % laine",
    color: "Carreaux tabac",
    features: ["Carreaux brossés teints en fil", "Poignets en bord-côte profonds", "Corps raccourci", "Patte à pressions cachée"],
  },
  "dip-dye-hem-jacket-espresso": {
    name: "Veste à ourlet dip-dye",
    short: "Un tailoring espresso à l’ourlet teint à la main.",
    description:
      "Chaque veste est trempée à la main pour que l’ourlet se fonde dans un ton rouille chaud. Le même traitement est répété à l’ourlet du pantalon pour parfaire le look.",
    material: "Sergé de coton — 100 % coton, teint à la main en dip-dye",
    color: "Espresso / Rouille",
    features: ["Ourlet teint à la main — chaque pièce est unique", "Épaule décontractée", "Fermeture deux boutons", "Pantalon assorti disponible"],
  },
  "pleated-wide-trouser-navy": {
    name: "Pantalon large plissé",
    short: "De profonds plis couteau qui bougent comme une jupe.",
    description:
      "Inspiré du hakama, ce pantalon marine est construit sur de profonds plis couteau qui s’ouvrent à la marche. Porté ici avec un polo en maille blanc rentré.",
    material: "Crêpe de costume — 100 % polyester",
    color: "Marine",
    features: ["Plis couteau profonds", "Ceinture prolongée", "Jambe large au tombé ample", "Poches latérales en biais"],
  },
  "windowpane-linen-shirt-ecru": {
    name: "Chemise en lin à carreaux fenêtre",
    short: "Des carreaux fenêtre écru et des finitions olive contrastées.",
    description:
      "Une chemise à manches courtes en lin à carreaux fenêtre écru, finie d’un col et de poignets contrastés olive. Pensée en ensemble d’été avec le pantalon large assorti.",
    material: "Lin mélangé — 60 % lin, 40 % coton",
    color: "Carreaux écru",
    features: ["Col et poignets contrastés", "Manches courtes", "Pli creux au dos", "Pantalon assorti disponible"],
  },
  "grid-check-camp-shirt-white": {
    name: "Chemise col camp à quadrillage",
    short: "Un quadrillage noir sur blanc, à porter en ensemble.",
    description:
      "Un fin quadrillage noir sur un coton blanc net, coupé oversize avec un col camp et une parementure intérieure contrastée. Disponible avec le pantalon large assorti.",
    material: "Seersucker de coton — 100 % coton",
    color: "Blanc / Quadrillage noir",
    features: ["Col camp", "Parementure de patte contrastée", "Coupe oversize", "Pantalon assorti disponible"],
  },
  "popover-anorak-shirt-olive": {
    name: "Chemise anorak à enfiler",
    short: "Une chemise à enfiler olive aux poches utilitaires à rabat.",
    description:
      "Une chemise à enfiler avec demi-patte de boutonnage, poches utilitaires à rabat et épaule tombante, dans un coton olive sec. Stylée ton sur ton avec le pantalon ballon.",
    material: "Toile de coton — 100 % coton",
    color: "Olive",
    features: ["Demi-patte, à enfiler", "Poches plaquées à rabat", "Épaule tombante", "Ourlet à cordon de serrage"],
  },
  "utility-chore-jacket-navy": {
    name: "Veste de travail utilitaire",
    short: "Une veste workwear marine aux longs liens.",
    description:
      "Le workwear, raffiné. Une veste de travail marine au col ouvert, aux poches plaquées et aux longs liens écru aux poignets. Portée avec le pantalon large assorti.",
    material: "Drill de coton — 100 % coton",
    color: "Marine",
    features: ["Col ouvert", "Poches plaquées", "Longs liens aux poignets", "Boutons en corozo"],
  },
  "oversized-blazer-heather-grey": {
    name: "Blazer oversize",
    short: "Gris chiné, épaules souples, longs liens à l’ourlet.",
    description:
      "Un long blazer aux épaules souples, en gris chiné, au revers cranté exagéré et aux liens qui tombent de la ligne des poches. La porte d’entrée la plus simple vers le tailoring YEG.",
    material: "Toile de costume chinée — 60 % polyester, 30 % viscose, 10 % laine",
    color: "Gris chiné",
    features: ["Épaule souple, sans épaulette", "Large revers cranté", "Liens au niveau des poches", "Entièrement doublé"],
  },
  "ecru-collar-blazer-navy": {
    name: "Blazer à col écru",
    short: "Un tailoring marine rehaussé d’un col écru.",
    description:
      "Un blazer marine trois boutons au dessous de col écru qui encadre le visage. Porté en costume avec le pantalon à ourlet noué, resserré à la cheville.",
    material: "Sergé aspect laine — 70 % polyester, 30 % viscose",
    color: "Marine / Écru",
    features: ["Col écru contrasté", "Fermeture trois boutons", "Poches plaquées", "Pantalon à ourlet noué assorti"],
  },
  "hook-front-blazer-off-white": {
    name: "Blazer à agrafes",
    short: "Blanc cassé, fermé par une colonne d’agrafes métalliques.",
    description:
      "Les boutons laissent place à une colonne d’agrafes en métal noirci. Un blazer blanc cassé pensé pour être porté fermé, avec le pantalon droit assorti.",
    material: "Gabardine coton mélangé — 65 % coton, 35 % polyester",
    color: "Blanc cassé",
    features: ["Fermetures à agrafes en métal noirci", "Revers en pointe", "Corps droit et décontracté", "Pantalon assorti disponible"],
  },
  "cape-vest-navy": {
    name: "Gilet cape",
    short: "Un gilet marine à épaule cape et longue ceinture.",
    description:
      "Mi-gilet, mi-cape. L’épaule se prolonge au-delà du bras pour dessiner une ligne carrée et nette ; une longue ceinture du même tissu tombe de la taille. Porté sur un pantalon large écru.",
    material: "Sergé aspect laine — 70 % polyester, 30 % viscose",
    color: "Marine",
    features: ["Épaule cape", "Longue ceinture du même tissu", "Fermeture à pressions cachée", "S’associe au pantalon large écru"],
  },
  "strap-hem-trouser-navy": {
    name: "Pantalon à pattes de cheville",
    short: "Un pantalon marine à pattes réglables à la cheville.",
    description:
      "Un pantalon marine à pince avec des pattes à boucle à la cheville : la jambe se porte longue et droite, ou resserrée. Stylé avec une chemise en popeline blanche rentrée.",
    material: "Sergé aspect laine — 70 % polyester, 30 % viscose",
    color: "Marine",
    features: ["Pattes de cheville réglables", "Une pince devant", "Passants de ceinture", "Pli marqué"],
  },
  "striped-rib-tank-rust": {
    name: "Débardeur côtelé rayé",
    short: "Une maille côtelée rouille et marine, à porter sous le tailoring.",
    description:
      "Un débardeur en fine maille côtelée à rayures rouille et marine, à col montant. Pensé comme sous-couche sous nos vestes — ou porté seul avec un foulard en soie.",
    material: "Maille côtelée — 95 % coton, 5 % élasthanne",
    color: "Rayures rouille",
    features: ["Fine côte 2×2", "Col montant", "Extensible pour un bon maintien", "Teint en pièce"],
  },
  "herringbone-pleated-trouser-mocha": {
    name: "Pantalon à pinces chevrons",
    short: "Un pantalon moka texturé à double pince.",
    description:
      "Un pantalon taille haute à double pince en chevrons moka, avec des pattes à l’ourlet. Photographié pour la campagne avec le débardeur côtelé naturel et une sangle bandoulière en cuir.",
    material: "Chevrons — 60 % polyester, 30 % viscose, 10 % laine",
    color: "Chevrons moka",
    features: ["Double pince devant", "Pattes à l’ourlet", "Ceinture prolongée", "Jambe large à cassure marquée"],
  },
  "funnel-neck-shirt-olive": {
    name: "Chemise col cheminée",
    short: "Une chemise olive à haut col cheminée.",
    description:
      "Une chemise à manches longues au haut col cheminée, à porter relevé ou replié, avec des poignets à cordon. Dans un coton olive sec, avec le short tailleur écru.",
    material: "Sergé de coton — 100 % coton",
    color: "Olive",
    features: ["Col cheminée", "Poignets à cordon", "Patte de boutonnage cachée", "Corps ample"],
  },
  "strap-detail-vest-black": {
    name: "Gilet à sangles",
    short: "Un gilet noir traversé de longues sangles blanches.",
    description:
      "Un gilet tailleur noir aux longues sangles blanches qui dépassent l’ourlet et se prolongent sur le pantalon assorti. Une déclaration graphique et monochrome.",
    material: "Crêpe de costume — 100 % polyester",
    color: "Noir / Blanc",
    features: ["Sangles contrastées", "Corps de gilet tailleur", "Pantalon à sangles assorti", "Dos en satin"],
  },
  "piped-tailored-jacket-black": {
    name: "Veste tailleur passepoilée",
    short: "Un tailoring noir souligné d’un passepoil blanc.",
    description:
      "Une veste noire droite soulignée d’un fin passepoil blanc le long du devant et des manches, en écho au pantalon assorti. Un tailoring du soir avec du caractère.",
    material: "Crêpe de costume — 100 % polyester",
    color: "Noir",
    features: ["Passepoil blanc contrasté", "Droite", "Épaule structurée", "Pantalon passepoilé assorti"],
  },
  "embellished-blazer-black": {
    name: "Blazer orné",
    short: "Un tailoring noir parsemé d’ornements métalliques.",
    description:
      "Notre pièce la plus décorative. Un blazer noir décontracté orné d’épingles, de chaînes et d’accessoires métalliques posés à la main sur la poitrine, porté avec un pantalon noir droit.",
    material: "Crêpe de costume — 100 % polyester ; ornements métalliques",
    color: "Noir",
    features: ["Ornements métalliques appliqués à la main", "Épaule décontractée", "Fermeture un bouton", "Production limitée"],
  },
  "camp-collar-jacket-sage": {
    name: "Veste à col camp",
    short: "Une veste en lin sauge au large col ouvert.",
    description:
      "Une veste raccourcie à manches courtes en lin sauge, au large col ton sur ton, portée ouverte sur un débardeur blanc avec un short à pinces écru.",
    material: "Lin mélangé — 55 % lin, 45 % viscose",
    color: "Sauge",
    features: ["Large col camp", "Corps raccourci et carré", "Manches courtes", "Lavée en pièce"],
  },
};

/** Technical table: labels always, values when they are words (sizes, weights and references stay as they are). */
export const specLabelsFr: Record<string, string> = {
  Reference: "Référence",
  Fit: "Coupe",
  "Fabric weight": "Grammage",
  Sizes: "Tailles",
  Production: "Production",
  "Minimum order": "Commande minimum",
  "Lead time": "Délai",
  Care: "Entretien",
};

export const specValuesFr: Record<string, string> = {
  "Made in Türkiye": "Fabriqué en Turquie",
  "50 pcs per colour": "50 pièces par coloris",
  "4 — 6 weeks": "4 — 6 semaines",
  "Dry clean or cold gentle wash": "Nettoyage à sec ou lavage délicat à froid",
  Boxy: "Carrée",
  Cropped: "Courte",
  "Cropped, boxy": "Courte, carrée",
  "Cropped, relaxed": "Courte, ample",
  "Extra wide, high rise": "Très large, taille haute",
  Oversized: "Oversize",
  Regular: "Classique",
  Relaxed: "Ample",
  Slim: "Ajustée",
  "Wide leg": "Jambe large",
  "Wide leg, high rise": "Jambe large, taille haute",
};

export const categoriesFr: Record<string, string> = {
  blazers: "Blazers",
  jackets: "Vestes et surchemises",
  shirts: "Chemises",
  trousers: "Pantalons",
  tops: "Maille et hauts",
  vests: "Gilets",
};

export const blogCategoriesFr: Record<string, string> = {
  campaign: "Campagne",
  production: "Production",
  "style-notes": "Notes de style",
};

export const collectionsFr: Record<string, { name: string; season: string; tagline: string; description: string }> = {
  essentials: {
    name: "Essentiels",
    season: "Permanent",
    tagline: "Les pièces sur lesquelles tout le reste se construit.",
    description:
      "Pantalons larges à pinces, chemises amples et mailles côtelées dans une palette rigoureuse. Pensés pour être portés chaque jour et produits saison après saison.",
  },
  "new-season": {
    name: "Nouvelle saison",
    season: "PE26",
    tagline: "Un tailoring léger pour les longues journées.",
    description:
      "Proportions raccourcies, manches courtes et lins lavés. Nouvelle saison reprend les codes du tailoring classique et les coupe pour la chaleur, le mouvement et la ville en été.",
  },
  signature: {
    name: "Série Signature",
    season: "Premium",
    tagline: "Le blazer, repensé.",
    description:
      "Nos pièces les plus techniques : des blazers entièrement construits aux revers finis main, aux fermetures à agrafes et aux cols contrastés. Fabriqués lentement, en petites séries.",
  },
  "after-dark": {
    name: "After Dark",
    season: "Campagne",
    tagline: "Habillé pour la ville, la nuit.",
    description:
      "Blousons à carreaux, ourlets dip-dye et passepoils noirs. After Dark est la facette la plus sombre de YEG — des tissus plus foncés, des lignes plus nettes, photographiés dans les ruelles de la ville.",
  },
};

/** Captions of gallery / lookbook images, keyed by their English text. */
export const captionsFr: Record<string, string> = {
  "Contrast Collar Jacket": "Veste à col contrasté",
  "After hours": "Après minuit",
  "Camp Collar Overshirt": "Surchemise à col camp",
  "Camp Collar Jacket — Sage": "Veste à col camp — Sauge",
  "Check Cropped Blouson": "Blouson court à carreaux",
  "Oversized Blazer": "Blazer oversize",
  Checkpoint: "Checkpoint",
  "The Red Room": "La Chambre rouge",
  "On location": "En extérieur",
  Studio: "Studio",
  "Contrast Collar Jacket — Sky": "Veste à col contrasté — Ciel",
  "Check Cropped Blouson — Tobacco": "Blouson court à carreaux — Tabac",
  "Herringbone Pleated Trouser": "Pantalon à pinces chevrons",
  "Contrast Collar Jacket — After hours": "Veste à col contrasté — Après minuit",
  "Embellished Blazer — Black": "Blazer orné — Noir",
  "Camp Collar Overshirt — Sand": "Surchemise à col camp — Sable",
  "Contrast Collar Jacket — Brick": "Veste à col contrasté — Brique",
  "Oversized Blazer — Heather Grey": "Blazer oversize — Gris chiné",
  "Herringbone Pleated Trouser — Lounge": "Pantalon à pinces chevrons — Salon",
};

export const postsFr: Record<string, { title: string; excerpt: string; content: string }> = {
  "the-case-for-the-cropped-blazer": {
    title: "Plaidoyer pour le blazer court",
    excerpt: "Pourquoi nous coupons notre tailoring court — et comment le porter avec un pantalon taille haute.",
    content: `Un blazer classique s’arrête au niveau des hanches. Les nôtres s’arrêtent à la taille — volontairement.

## La proportion avant les règles

Raccourcir la veste remonte la taille visuelle et laisse un pantalon large taille haute tomber sans interruption jusqu’au sol. Le résultat : une ligne plus longue et plus nette.

## Comment le porter

- Gardez le pantalon haut : la veste doit rejoindre la ceinture, pas flotter au-dessus.
- Jouez le ton sur ton : le même tissu en haut et en bas fait lire la silhouette comme une seule pièce.
- Laissez le col faire le travail : un col écru contrasté est le seul détail dont vous avez besoin.

> Le meilleur tailoring change votre façon de vous tenir.`,
  },
  "after-dark-the-city-at-night": {
    title: "After Dark : s’habiller pour la ville, la nuit",
    excerpt: "Blousons à carreaux, ourlets dip-dye et rues mouillées. La facette la plus sombre de YEG.",
    content: `After Dark a été photographié entre minuit et quatre heures du matin, dans des ruelles éclairées seulement par les enseignes des boutiques.

## Des tissus plus sombres, des lignes plus nettes

La collection s’appuie sur des carreaux brossés, des cotons espresso et un crêpe noir souligné de passepoil blanc — des tissus qui captent le peu de lumière disponible.

## La pièce maîtresse

Le Blouson court à carreaux, dans un carreau tabac brossé aux profonds poignets en bord-côte, porte toute l’histoire : des racines workwear, des proportions tailleur, une attitude citadine.

> Certains vêtements sont faits pour la lumière du jour. Pas ceux-ci.`,
  },
  "built-for-the-few-ss26-campaign": {
    title: "Pensé pour quelques-uns : dans les coulisses de la campagne PE26",
    excerpt: "Néons, béton mouillé et un seul costume bleu ciel. Comment nous avons photographié la saison qui définit la silhouette YEG.",
    content: `L’idée était simple : un costume, une pièce, une seule couleur de lumière.

Pour le PE26, nous voulions que les vêtements portent l’image à eux seuls. La veste courte et le pantalon taille haute à pinces ont été dessinés comme une seule ligne — de l’épaule au sol — et la campagne devait montrer cette ligne sans distraction.

## Une pièce construite en rouge

Nous avons construit le décor autour du rouge de notre marque. Des tubes néon ont été courbés en fragments du monogramme YEG et suspendus sur le mur du fond, de sorte que le logo n’apparaît que lorsqu’on prend du recul sur l’image.

> Nous ne créons pas pour tout le monde. Nous créons pour les quelques-uns qui remarquent la différence.

## Pourquoi le bleu ciel

Dans une pièce rouge, un costume bleu ciel pâle produit quelque chose d’inattendu : il paraît plus net et plus tranchant que le noir ne pourrait jamais l’être. Il est devenu la couleur de la saison.

- Blazer court à manches courtes, coloris Ciel
- Veste à col contrasté, Ciel / Écru
- Pantalon large taille haute à pinces

Chaque pièce de la campagne est aujourd’hui en production et disponible en vente en gros.`,
  },
  "from-idea-to-fabric-to-product": {
    title: "De l’idée au tissu, puis au produit",
    excerpt: "Chaque vêtement YEG passe entre les mêmes cinq mains. Visite de notre atelier de production.",
    content: `Un vêtement ne vaut que par les décisions prises avant la première coupe.

## 01 — L’idée

Chaque collection commence par une seule phrase et un mur de références. Nous retravaillons jusqu’à ce que la phrase et la silhouette disent la même chose.

## 02 — Le tissu

Nous sourçons et testons les tissus en interne : tombé, retrait, solidité des couleurs et comportement après vingt lavages. Ce n’est qu’ensuite qu’un tissu reçoit une référence.

## 03 — Le patron

Les patrons sont tracés et gradués par nos propres modélistes. Une veste courte se joue à deux centimètres d’ourlet.

## 04 — La production

Coupe, couture, repassage et finitions se font sous un même toit en Turquie. Petites séries, mains expertes, aucun raccourci.

## 05 — Le contrôle

Chaque pièce est mesurée et inspectée par rapport à l’échantillon validé avant d’être emballée.

> La qualité n’est pas un service. C’est chaque étape.`,
  },
  "why-we-manufacture-in-turkiye": {
    title: "Pourquoi nous fabriquons en Turquie",
    excerpt: "Rapidité, savoir-faire et contrôle : produire près de chez soi.",
    content: `La Turquie possède l’une des traditions textiles les plus profondes au monde, et certaines des mains les plus habiles du tailoring.

## Rapidité

Produire près de nos tissages permet de passer un échantillon du patron à l’essayage en quelques jours, et non en quelques semaines.

## Savoir-faire

Nos équipes de couture ont des décennies d’expérience dans le tailoring — le genre d’expérience qui se voit dans un col qui tombe juste.

## Contrôle

Quand le design, le patronage, la production et le contrôle qualité partagent un même bâtiment, rien ne se perd en route.

> Fabriqué en Turquie n’est pas une étiquette pour nous. C’est une méthode.`,
  },
};

/** French keys merged into the homepage blocks. */
export const homepageFr = {
  hero: {
    titleFr: "Pas pour tout le monde",
    subtitleFr: "Prêt-à-porter masculin contemporain, conçu et produit en Turquie.",
    ctaLabelFr: "Découvrir la collection",
  },
  intro: {
    textFr:
      "Nous ne produisons pas simplement du tissu ; nous tissons la mémoire des marques. Du caractère dans chaque fil, la perfection dans chaque point, notre signature dans chaque détail.",
  },
  marquee: { itemsFr: ["Conçu", "Patronné", "Façonné", "Produit", "Livré"] },
  featured: { titleFr: "Pièces choisies" },
  statement: { captionFr: "" },
  lookbook: {
    titleFr: "La campagne PE26",
    textFr: "Photographiée entre le studio et la ville, la nuit — chaque look est en production et disponible en vente en gros.",
  },
  story: {
    linesFr: ["De l’idée", "Au tissu", "Au produit"],
    textFr:
      "Design, patronage, échantillonnage et production vivent sous un même toit. Chaque décision — du poids d’un tissu au tombé d’un col — est prise par les mêmes mains qui valident la pièce finale.",
    stepsFr: [
      { titleFr: "Design", textFr: "Chaque collection naît d’une seule idée, retravaillée jusqu’à ce que la silhouette l’exprime seule." },
      { titleFr: "Tissu et patronage", textFr: "Le tissu est testé en interne. Les patrons sont tracés et gradués par nos propres modélistes." },
      { titleFr: "Production", textFr: "Coupé, cousu, repassé et contrôlé en Turquie — petites séries, mains expertes, aucun raccourci." },
    ],
  },
  collections: { titleFr: "Quatre histoires, une seule main" },
  banner: {
    titleFr: "Construisons votre prochaine collection",
    textFr: "Marque privée, vente en gros et production sur commande pour les marques attentives aux détails.",
    ctaLabelFr: "Démarrer la conversation",
  },
};

export const addressFr = "Istanbul, Turquie";
