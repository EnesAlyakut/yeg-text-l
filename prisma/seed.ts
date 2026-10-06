/**
 * Seeds the database from the YEG brand package.
 * Product imagery = LOFIBUY catalogue pages (studio lookbook) + matching campaign frames.
 * Run: npm run db:seed   (idempotent — upserts by slug/key)
 */
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import manifest from "../src/data/media-manifest.json";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://yeg:yeg_local_dev@localhost:5433/yeg?schema=public";
}

const db = new PrismaClient();

type MediaKey = keyof typeof manifest;
const img = (key: MediaKey, position?: string) => {
  const m = manifest[key];
  return { url: m.src, width: m.width, height: m.height, blur: m.blur, position: position ?? "50% 50%" };
};

// ————————————————————————————————————————————————————————— taxonomy

const categories = [
  { slug: "blazers", nameEn: "Blazers", nameTr: "Blazer Ceketler" },
  { slug: "jackets", nameEn: "Jackets & Overshirts", nameTr: "Ceket & Gömlek Ceketler" },
  { slug: "shirts", nameEn: "Shirts", nameTr: "Gömlekler" },
  { slug: "trousers", nameEn: "Trousers", nameTr: "Pantolonlar" },
  { slug: "vests", nameEn: "Vests", nameTr: "Yelekler" },
  { slug: "tops", nameEn: "Knit & Tops", nameTr: "Triko & Üst Giyim" },
];

const collections = [
  {
    slug: "new-season",
    nameEn: "New Season",
    nameTr: "Yeni Sezon",
    seasonEn: "SS26",
    seasonTr: "İY26",
    taglineEn: "Light tailoring for long days.",
    taglineTr: "Uzun günler için hafif terzilik.",
    descriptionEn:
      "Cropped proportions, short sleeves and washed linens. New Season takes the codes of classic tailoring and cuts them for heat, movement and the city in summer.",
    descriptionTr:
      "Kısa oranlar, kısa kollar ve yıkanmış keten. Yeni Sezon, klasik terziliğin kodlarını alır ve onları sıcak, hareket ve yazın şehir için yeniden keser.",
    cover: img("campaign/neon-room", "50% 40%"),
    isFeatured: true,
  },
  {
    slug: "signature",
    nameEn: "Signature Series",
    nameTr: "İmza Serisi",
    seasonEn: "Premium",
    seasonTr: "Seçkin",
    taglineEn: "The blazer, reconsidered.",
    taglineTr: "Blazer ceket, yeniden düşünüldü.",
    descriptionEn:
      "Our most technical pieces: fully constructed blazers with hand-finished lapels, hook closures and contrast collars. Built slowly, in small runs.",
    descriptionTr:
      "En teknik parçalarımız: el işi yakalara, kanca kapamalara ve kontrast yakalara sahip tam yapılandırılmış blazerlar. Yavaş ve küçük seriler halinde üretilir.",
    cover: img("campaign/studio-black", "50% 30%"),
    isFeatured: true,
  },
  {
    slug: "essentials",
    nameEn: "Essentials",
    nameTr: "Temel Parçalar",
    seasonEn: "Core",
    seasonTr: "Sürekli",
    taglineEn: "The pieces everything else is built on.",
    taglineTr: "Her şeyin üzerine kurulduğu parçalar.",
    descriptionEn:
      "Wide pleated trousers, relaxed shirts and rib knits in a disciplined palette. Designed to be worn daily and produced season after season.",
    descriptionTr:
      "Disiplinli bir renk paletinde geniş pileli pantolonlar, rahat gömlekler ve ribana trikolar. Her gün giyilmek ve sezondan sezona üretilmek için tasarlandı.",
    cover: img("campaign/lounge", "50% 45%"),
    isFeatured: true,
  },
  {
    slug: "after-dark",
    nameEn: "After Dark",
    nameTr: "Gece Yarısı",
    seasonEn: "Campaign",
    seasonTr: "Kampanya",
    taglineEn: "Dressed for the city at night.",
    taglineTr: "Gece şehri için giyinmek.",
    descriptionEn:
      "Checked blousons, dip-dyed hems and black piping. After Dark is the moodier side of YEG — darker cloths, sharper lines, shot in the alleys of the city.",
    descriptionTr:
      "Ekose bluzonlar, batik etekler ve siyah biyeler. Gece Yarısı, YEG'in daha karanlık yüzü — daha koyu kumaşlar, daha keskin hatlar; şehrin ara sokaklarında çekildi.",
    cover: img("campaign/after-dark-check", "55% 50%"),
    isFeatured: true,
  },
];

// ————————————————————————————————————————————————————————— products

type Lang = { name: string; short: string; description: string; material: string; color: string; features: string[] };
type ProductSeed = {
  image: MediaKey;
  gallery?: MediaKey[];
  slug: string;
  code: string;
  category: string;
  collection: string;
  price: number;
  fit: [string, string];
  weight: string;
  en: Lang;
  tr: Lang;
  featured?: boolean;
  showcase?: boolean;
};

const products: ProductSeed[] = [
  {
    image: "catalog/p004",
    gallery: ["campaign/neon-room"],
    slug: "cropped-short-sleeve-blazer-sky",
    code: "YEG-26-004",
    category: "blazers",
    collection: "new-season",
    price: 265,
    fit: ["Cropped, boxy", "Kısa, boxy"],
    weight: "260 g/m²",
    featured: true,
    en: {
      name: "Cropped Short-Sleeve Blazer",
      short: "A tailored jacket cut short at the hem and the sleeve.",
      description:
        "Our signature silhouette for SS26. A single-breasted blazer with a cropped body and elbow-length sleeves, cut from a fluid wool-blend twill. Worn here with the matching wide pleated trouser.",
      material: "Wool-blend twill — 55% polyester, 40% viscose, 5% wool",
      color: "Sky",
      features: ["Cropped body with dropped shoulder", "Elbow-length sleeves", "Half-lined for summer weight", "Horn-effect buttons"],
    },
    tr: {
      name: "Kısa Kollu Crop Blazer",
      short: "Etekten ve koldan kısa kesilmiş terzi işi ceket.",
      description:
        "İY26'nın imza silueti. Kısa gövdeli, dirsek boyu kollu, akışkan yün karışımlı dimi kumaştan tek düğmeli blazer. Takım pileli geniş pantolonla birlikte kombinlendi.",
      material: "Yün karışımlı dimi — %55 polyester, %40 viskon, %5 yün",
      color: "Gök Mavisi",
      features: ["Düşük omuzlu kısa gövde", "Dirsek boyu kollar", "Yazlık yarım astar", "Boynuz görünümlü düğmeler"],
    },
  },
  {
    image: "catalog/p016",
    slug: "contrast-lapel-cropped-blazer-navy",
    code: "YEG-26-016",
    category: "blazers",
    collection: "new-season",
    price: 255,
    fit: ["Cropped, relaxed", "Kısa, rahat"],
    weight: "280 g/m²",
    en: {
      name: "Contrast Lapel Cropped Blazer",
      short: "Navy tailoring with a sharp ecru lapel.",
      description:
        "A cropped navy blazer finished with a contrasting ecru lapel and short sleeves. Designed as a set with the tailored shorts for a clean, graphic summer uniform.",
      material: "Cotton-blend gabardine — 65% cotton, 35% polyester",
      color: "Navy / Ecru",
      features: ["Contrast notch lapel", "Cropped body", "Short sleeves with pressed crease", "Concealed inner pocket"],
    },
    tr: {
      name: "Kontrast Yakalı Crop Blazer",
      short: "Keskin ekru yakalı lacivert terzilik.",
      description:
        "Kontrast ekru yaka ve kısa kollarla tamamlanan kısa lacivert blazer. Temiz ve grafik bir yaz üniforması için terzi işi şortla takım olarak tasarlandı.",
      material: "Pamuk karışımlı gabardin — %65 pamuk, %35 polyester",
      color: "Lacivert / Ekru",
      features: ["Kontrast çentik yaka", "Kısa gövde", "Ütü izli kısa kollar", "Gizli iç cep"],
    },
  },
  {
    image: "catalog/p017",
    gallery: ["campaign/alley-sand"],
    slug: "camp-collar-overshirt-sand",
    code: "YEG-26-017",
    category: "jackets",
    collection: "new-season",
    price: 185,
    fit: ["Oversized", "Oversize"],
    weight: "210 g/m²",
    en: {
      name: "Camp Collar Overshirt",
      short: "A washed linen overshirt with an open camp collar.",
      description:
        "Oversized, short-sleeved and cut from garment-washed linen blend. The contrast-lined collar sits open; the hem is finished straight to wear untucked over matching shorts.",
      material: "Linen blend — 55% linen, 45% viscose",
      color: "Sand",
      features: ["Open camp collar with contrast facing", "Garment-washed for softness", "Straight hem", "Side vents"],
    },
    tr: {
      name: "Kamp Yaka Gömlek Ceket",
      short: "Açık kamp yakalı yıkanmış keten gömlek ceket.",
      description:
        "Oversize, kısa kollu ve hazır giyim yıkamalı keten karışımından kesildi. Kontrast astarlı yaka açık durur; etek, takım şortun üzerine dışarıda giyilmek üzere düz bitirildi.",
      material: "Keten karışımı — %55 keten, %45 viskon",
      color: "Kum",
      features: ["Kontrast kaplamalı açık kamp yaka", "Yumuşaklık için yıkamalı", "Düz etek", "Yan yırtmaçlar"],
    },
  },
  {
    image: "catalog/p018",
    slug: "boxy-contrast-jacket-burgundy",
    code: "YEG-26-018",
    category: "jackets",
    collection: "signature",
    price: 275,
    fit: ["Boxy", "Boxy"],
    weight: "300 g/m²",
    featured: true,
    en: {
      name: "Boxy Contrast Jacket",
      short: "Burgundy cape-shoulder jacket with an ecru collar.",
      description:
        "An architectural jacket with extended cape shoulders, patch pockets and an ecru collar. Structured enough to hold its square silhouette, soft enough to wear open over a vest.",
      material: "Compact twill — 70% polyester, 30% viscose",
      color: "Burgundy / Ecru",
      features: ["Extended cape shoulder", "Oversized patch pockets", "Contrast collar", "Fully taped seams"],
    },
    tr: {
      name: "Boxy Kontrast Ceket",
      short: "Ekru yakalı, pelerin omuzlu bordo ceket.",
      description:
        "Uzatılmış pelerin omuzları, torba cepleri ve ekru yakasıyla mimari bir ceket. Kare silüetini koruyacak kadar yapılı, bir yeleğin üzerinde açık giyilecek kadar yumuşak.",
      material: "Kompakt dimi — %70 polyester, %30 viskon",
      color: "Bordo / Ekru",
      features: ["Uzatılmış pelerin omuz", "Oversize torba cepler", "Kontrast yaka", "Tamamen bantlı dikişler"],
    },
  },
  {
    image: "catalog/p019",
    gallery: ["campaign/studio-sky", "campaign/brick-wall-portrait", "campaign/parking-sky"],
    slug: "contrast-collar-jacket-sky",
    code: "YEG-26-019",
    category: "jackets",
    collection: "new-season",
    price: 245,
    fit: ["Cropped, relaxed", "Kısa, rahat"],
    weight: "260 g/m²",
    featured: true,
    showcase: true,
    en: {
      name: "Contrast Collar Jacket",
      short: "The campaign piece — sky blue with an ecru collar.",
      description:
        "The face of the SS26 campaign. A short-sleeved, cropped jacket in sky blue twill with a wide ecru revere collar. Pairs with the high-rise pleated trouser for the full look.",
      material: "Wool-blend twill — 55% polyester, 40% viscose, 5% wool",
      color: "Sky / Ecru",
      features: ["Wide contrast revere collar", "Cropped, boxy body", "Short sleeves", "Tonal corozo buttons"],
    },
    tr: {
      name: "Kontrast Yaka Ceket",
      short: "Kampanya parçası — ekru yakalı gök mavisi.",
      description:
        "İY26 kampanyasının yüzü. Gök mavisi dimi kumaştan, geniş ekru revers yakalı, kısa kollu crop ceket. Tam görünüm için yüksek bel pileli pantolonla eşleşir.",
      material: "Yün karışımlı dimi — %55 polyester, %40 viskon, %5 yün",
      color: "Gök Mavisi / Ekru",
      features: ["Geniş kontrast revers yaka", "Kısa, boxy gövde", "Kısa kollar", "Ton sür ton corozo düğmeler"],
    },
  },
  {
    image: "catalog/p020",
    slug: "tuxedo-crop-jacket-ivory",
    code: "YEG-26-020",
    category: "blazers",
    collection: "new-season",
    price: 275,
    fit: ["Cropped", "Kısa"],
    weight: "280 g/m²",
    en: {
      name: "Tuxedo Crop Jacket",
      short: "Ivory evening jacket with a black satin lapel.",
      description:
        "Evening codes for daytime. An ivory cropped jacket with a black peak lapel and a long self-tie belt that falls from the waist. Worn with tailored shorts and loafers.",
      material: "Cotton-blend gabardine — 65% cotton, 35% polyester; satin lapel",
      color: "Ivory / Black",
      features: ["Black satin peak lapel", "Detachable long tie belt", "Cropped body", "Single-button closure"],
    },
    tr: {
      name: "Smokin Yaka Crop Ceket",
      short: "Siyah saten yakalı fildişi gece ceketi.",
      description:
        "Gündüz için gece kodları. Siyah sivri yakalı ve belden sarkan uzun kuşaklı fildişi crop ceket. Terzi işi şort ve loafer ile kombinlendi.",
      material: "Pamuk karışımlı gabardin — %65 pamuk, %35 polyester; saten yaka",
      color: "Fildişi / Siyah",
      features: ["Siyah saten sivri yaka", "Çıkarılabilir uzun kuşak", "Kısa gövde", "Tek düğme kapama"],
    },
  },
  {
    image: "catalog/p028",
    slug: "relaxed-poplin-shirt-chocolate",
    code: "YEG-26-028",
    category: "shirts",
    collection: "essentials",
    price: 135,
    fit: ["Relaxed", "Rahat"],
    weight: "140 g/m²",
    en: {
      name: "Relaxed Poplin Shirt",
      short: "A dense chocolate poplin shirt, cut generously.",
      description:
        "A wardrobe staple in a deep chocolate tone. Relaxed through the body with a soft point collar and a single chest pocket. Styled with the olive balloon trouser.",
      material: "Cotton poplin — 100% cotton",
      color: "Chocolate",
      features: ["Soft point collar", "Single chest pocket", "Curved hem", "Mother-of-pearl effect buttons"],
    },
    tr: {
      name: "Rahat Kesim Poplin Gömlek",
      short: "Bol kesimli, yoğun çikolata poplin gömlek.",
      description:
        "Derin çikolata tonunda gardırop klasiği. Gövdede rahat kesim, yumuşak sivri yaka ve tek göğüs cebi. Zeytin yeşili balon pantolonla kombinlendi.",
      material: "Pamuk poplin — %100 pamuk",
      color: "Çikolata",
      features: ["Yumuşak sivri yaka", "Tek göğüs cebi", "Oval etek", "Sedef görünümlü düğmeler"],
    },
  },
  {
    image: "catalog/p029",
    slug: "patchwork-stripe-overshirt",
    code: "YEG-26-029",
    category: "jackets",
    collection: "new-season",
    price: 215,
    fit: ["Boxy", "Boxy"],
    weight: "240 g/m²",
    en: {
      name: "Patchwork Stripe Overshirt",
      short: "Pieced navy and sky stripes on a clean overshirt.",
      description:
        "Offcuts from the season's navy and sky cloths, pieced into a graphic striped panel. Every panel is laid by hand, so no two pieces place the stripes in exactly the same way.",
      material: "Cotton-blend twill — 65% cotton, 35% polyester",
      color: "Sky / Navy",
      features: ["Hand-placed patchwork panel", "Boxy cut", "Concealed placket", "Made from production offcuts"],
    },
    tr: {
      name: "Patchwork Çizgili Gömlek Ceket",
      short: "Sade bir gömlek ceket üzerinde lacivert ve mavi parçalı çizgiler.",
      description:
        "Sezonun lacivert ve mavi kumaşlarından kalan parçalar grafik bir çizgili panelde birleşiyor. Her panel elle yerleştirilir; hiçbir parçada çizgiler birebir aynı durmaz.",
      material: "Pamuk karışımlı dimi — %65 pamuk, %35 polyester",
      color: "Gök Mavisi / Lacivert",
      features: ["Elle yerleştirilen patchwork panel", "Boxy kesim", "Gizli pat", "Üretim artığı kumaşlardan"],
    },
  },
  {
    image: "catalog/p036",
    slug: "piped-wide-leg-trouser-navy",
    code: "YEG-26-036",
    category: "trousers",
    collection: "essentials",
    price: 165,
    fit: ["Wide leg, high rise", "Geniş paça, yüksek bel"],
    weight: "280 g/m²",
    en: {
      name: "Piped Wide-Leg Trouser",
      short: "High-rise navy trouser with white piping.",
      description:
        "A high-rise, double-pleated wide trouser in navy with contrast white piping running down the outseam. The waist ties at the side for an adjustable fit.",
      material: "Wool-look twill — 70% polyester, 30% viscose",
      color: "Navy",
      features: ["Contrast outseam piping", "Double front pleats", "Side-tie waist adjusters", "Pressed centre crease"],
    },
    tr: {
      name: "Biyeli Geniş Paça Pantolon",
      short: "Beyaz biyeli, yüksek bel lacivert pantolon.",
      description:
        "Dış yan dikiş boyunca beyaz kontrast biye uzanan, yüksek bel, çift pileli lacivert geniş pantolon. Bel, ayarlanabilir kalıp için yandan bağlanır.",
      material: "Yün görünümlü dimi — %70 polyester, %30 viskon",
      color: "Lacivert",
      features: ["Kontrast yan biye", "Çift ön pile", "Yandan bağlamalı bel ayarı", "Ütülü orta çizgi"],
    },
  },
  {
    image: "catalog/p044",
    gallery: ["campaign/alley-check"],
    slug: "check-cropped-blouson-tobacco",
    code: "YEG-26-044",
    category: "jackets",
    collection: "after-dark",
    price: 295,
    fit: ["Cropped, boxy", "Kısa, boxy"],
    weight: "340 g/m²",
    featured: true,
    showcase: true,
    en: {
      name: "Check Cropped Blouson",
      short: "Tobacco check with deep ribbed cuffs.",
      description:
        "The After Dark hero. A cropped blouson in a brushed tobacco check with oversized rib cuffs and a clean collar. Photographed on location in the city at night.",
      material: "Brushed check — 60% polyester, 30% viscose, 10% wool",
      color: "Tobacco Check",
      features: ["Brushed yarn-dyed check", "Deep rib cuffs", "Cropped body", "Concealed snap placket"],
    },
    tr: {
      name: "Ekose Crop Bluzon",
      short: "Derin ribana manşetli tütün rengi ekose.",
      description:
        "Gece Yarısı'nın kahramanı. Fırçalanmış tütün rengi ekoseden, oversize ribana manşetli ve sade yakalı crop bluzon. Gece şehirde, mekânda fotoğraflandı.",
      material: "Fırçalanmış ekose — %60 polyester, %30 viskon, %10 yün",
      color: "Tütün Ekose",
      features: ["Fırçalanmış iplik boyalı ekose", "Derin ribana manşetler", "Kısa gövde", "Gizli çıtçıt pat"],
    },
  },
  {
    image: "catalog/p045",
    slug: "dip-dye-hem-jacket-espresso",
    code: "YEG-26-045",
    category: "jackets",
    collection: "after-dark",
    price: 285,
    fit: ["Relaxed", "Rahat"],
    weight: "320 g/m²",
    en: {
      name: "Dip-Dye Hem Jacket",
      short: "Espresso tailoring with a hand-dyed hem.",
      description:
        "Each jacket is dipped by hand so the hem bleeds into a warm rust tone. The same treatment is repeated at the trouser hem to finish the look.",
      material: "Cotton twill — 100% cotton, hand dip-dyed",
      color: "Espresso / Rust",
      features: ["Hand dip-dyed hem — each piece unique", "Relaxed shoulder", "Two-button front", "Matching trouser available"],
    },
    tr: {
      name: "Batik Etekli Ceket",
      short: "Elle boyanmış etekli espresso terzilik.",
      description:
        "Her ceket elle boyaya daldırılır; böylece etek sıcak bir pas tonuna akar. Aynı işlem, görünümü tamamlamak için pantolon paçasında da tekrarlanır.",
      material: "Pamuk dimi — %100 pamuk, elle batik boyama",
      color: "Espresso / Pas",
      features: ["Elle batik etek — her parça tek", "Rahat omuz", "Çift düğmeli ön", "Takım pantolonu mevcut"],
    },
  },
  {
    image: "catalog/p046",
    slug: "pleated-wide-trouser-navy",
    code: "YEG-26-046",
    category: "trousers",
    collection: "essentials",
    price: 175,
    fit: ["Extra wide, high rise", "Ekstra geniş, yüksek bel"],
    weight: "260 g/m²",
    en: {
      name: "Pleated Wide Trouser",
      short: "Deep knife pleats that move like a skirt.",
      description:
        "Inspired by the hakama, this navy trouser is built on deep knife pleats that open as you walk. Worn here with a white knit polo tucked in.",
      material: "Crepe suiting — 100% polyester",
      color: "Navy",
      features: ["Deep knife pleats", "Extended waistband", "Wide leg with full drape", "Side slant pockets"],
    },
    tr: {
      name: "Pileli Geniş Pantolon",
      short: "Etek gibi hareket eden derin bıçak pileler.",
      description:
        "Hakamadan ilham alan bu lacivert pantolon, yürüdükçe açılan derin bıçak pileler üzerine kurulu. Beyaz triko polo içeride giyilerek kombinlendi.",
      material: "Krep takım kumaşı — %100 polyester",
      color: "Lacivert",
      features: ["Derin bıçak pileler", "Uzatılmış bel bandı", "Tam dökümlü geniş paça", "Yan eğik cepler"],
    },
  },
  {
    image: "catalog/p048",
    slug: "windowpane-linen-shirt-ecru",
    code: "YEG-26-048",
    category: "shirts",
    collection: "new-season",
    price: 155,
    fit: ["Relaxed", "Rahat"],
    weight: "160 g/m²",
    en: {
      name: "Windowpane Linen Shirt",
      short: "An ecru windowpane with contrast olive trims.",
      description:
        "A short-sleeve linen shirt in an ecru windowpane, finished with an olive contrast collar and cuff. Designed with the matching wide trouser as a summer set.",
      material: "Linen blend — 60% linen, 40% cotton",
      color: "Ecru Check",
      features: ["Contrast collar and cuffs", "Short sleeves", "Box-pleat back", "Matching trouser available"],
    },
    tr: {
      name: "Kareli Keten Gömlek",
      short: "Zeytin yeşili kontrast detaylı ekru kareli.",
      description:
        "Zeytin yeşili kontrast yaka ve manşetle tamamlanan ekru kareli kısa kollu keten gömlek. Yaz takımı olarak geniş pantolonuyla birlikte tasarlandı.",
      material: "Keten karışımı — %60 keten, %40 pamuk",
      color: "Ekru Kareli",
      features: ["Kontrast yaka ve manşet", "Kısa kollar", "Sırtta kutu pile", "Takım pantolonu mevcut"],
    },
  },
  {
    image: "catalog/p050",
    slug: "grid-check-camp-shirt-white",
    code: "YEG-26-050",
    category: "shirts",
    collection: "new-season",
    price: 145,
    fit: ["Oversized", "Oversize"],
    weight: "150 g/m²",
    en: {
      name: "Grid Check Camp Shirt",
      short: "A black-on-white grid, worn as a set.",
      description:
        "A fine black grid on crisp white cotton, cut oversized with a camp collar and a contrast inner placket. Available with the matching wide trouser.",
      material: "Cotton seersucker — 100% cotton",
      color: "White / Black Grid",
      features: ["Camp collar", "Contrast placket facing", "Oversized fit", "Matching trouser available"],
    },
    tr: {
      name: "Ekose Kamp Yaka Gömlek",
      short: "Beyaz üzerine siyah ızgara, takım olarak.",
      description:
        "Canlı beyaz pamuk üzerinde ince siyah ızgara; kamp yaka ve kontrast iç pat ile oversize kesildi. Takım geniş pantolonuyla birlikte mevcut.",
      material: "Pamuk seersucker — %100 pamuk",
      color: "Beyaz / Siyah Izgara",
      features: ["Kamp yaka", "Kontrast pat kaplaması", "Oversize kalıp", "Takım pantolonu mevcut"],
    },
  },
  {
    image: "catalog/p053",
    slug: "popover-anorak-shirt-olive",
    code: "YEG-26-053",
    category: "shirts",
    collection: "essentials",
    price: 175,
    fit: ["Oversized", "Oversize"],
    weight: "220 g/m²",
    en: {
      name: "Popover Anorak Shirt",
      short: "An olive popover with utility flap pockets.",
      description:
        "A pullover shirt with a half placket, utility flap pockets and a dropped shoulder, in a dry olive cotton. Styled tonal with the balloon trouser.",
      material: "Cotton canvas — 100% cotton",
      color: "Olive",
      features: ["Half placket, pull-over", "Flap patch pockets", "Dropped shoulder", "Drawcord hem"],
    },
    tr: {
      name: "Popover Anorak Gömlek",
      short: "Kapaklı cepli zeytin yeşili popover.",
      description:
        "Yarım patlı, kapaklı utility cepli ve düşük omuzlu, kuru zeytin yeşili pamuktan geçmeli gömlek. Balon pantolonla ton sür ton kombinlendi.",
      material: "Pamuk kanvas — %100 pamuk",
      color: "Zeytin",
      features: ["Yarım pat, geçmeli", "Kapaklı torba cepler", "Düşük omuz", "Büzgülü etek"],
    },
  },
  {
    image: "catalog/p057",
    slug: "utility-chore-jacket-navy",
    code: "YEG-26-057",
    category: "jackets",
    collection: "after-dark",
    price: 235,
    fit: ["Relaxed", "Rahat"],
    weight: "320 g/m²",
    en: {
      name: "Utility Chore Jacket",
      short: "A navy workwear jacket with long tie details.",
      description:
        "Workwear, refined. A navy chore jacket with a spread collar, patch pockets and long ecru ties at the cuff. Worn with the matching wide trouser.",
      material: "Cotton drill — 100% cotton",
      color: "Navy",
      features: ["Spread collar", "Patch pockets", "Long cuff ties", "Corozo buttons"],
    },
    tr: {
      name: "Cepli İş Ceketi",
      short: "Uzun bağcık detaylı lacivert iş ceketi.",
      description:
        "Rafine edilmiş iş giyimi. Açık yakalı, torba cepli ve manşette uzun ekru bağcıklı lacivert iş ceketi. Takım geniş pantolonla giyildi.",
      material: "Pamuk drill — %100 pamuk",
      color: "Lacivert",
      features: ["Açık yaka", "Torba cepler", "Uzun manşet bağcıkları", "Corozo düğmeler"],
    },
  },
  {
    image: "catalog/p067",
    gallery: ["campaign/alley-grey", "campaign/checkpoint-grey"],
    slug: "oversized-blazer-heather-grey",
    code: "YEG-26-067",
    category: "blazers",
    collection: "signature",
    price: 315,
    fit: ["Oversized", "Oversize"],
    weight: "340 g/m²",
    featured: true,
    showcase: true,
    en: {
      name: "Oversized Blazer",
      short: "Heather grey, soft-shouldered, long ties at the hem.",
      description:
        "A long, soft-shouldered blazer in heather grey with an exaggerated notch lapel and ties falling from the pocket line. The easiest way into YEG tailoring.",
      material: "Melange suiting — 60% polyester, 30% viscose, 10% wool",
      color: "Heather Grey",
      features: ["Soft, unpadded shoulder", "Wide notch lapel", "Tie details at pocket", "Fully lined"],
    },
    tr: {
      name: "Oversize Blazer",
      short: "Melanj gri, yumuşak omuzlu, etekte uzun bağcıklar.",
      description:
        "Abartılı çentik yakalı ve cep hizasından sarkan bağcıklı, uzun ve yumuşak omuzlu melanj gri blazer. YEG terziliğine en kolay giriş.",
      material: "Melanj takım kumaşı — %60 polyester, %30 viskon, %10 yün",
      color: "Melanj Gri",
      features: ["Yumuşak, vatkasız omuz", "Geniş çentik yaka", "Cepte bağcık detayı", "Tam astar"],
    },
  },
  {
    image: "catalog/p119",
    slug: "ecru-collar-blazer-navy",
    code: "YEG-26-119",
    category: "blazers",
    collection: "signature",
    price: 305,
    fit: ["Regular", "Standart"],
    weight: "320 g/m²",
    en: {
      name: "Ecru Collar Blazer",
      short: "Navy tailoring lifted by an ecru collar.",
      description:
        "A three-button navy blazer with an ecru under-collar that frames the face. Worn as a suit with the tie-hem trouser, gathered at the ankle.",
      material: "Wool-look twill — 70% polyester, 30% viscose",
      color: "Navy / Ecru",
      features: ["Contrast ecru collar", "Three-button front", "Patch pockets", "Matching tie-hem trouser"],
    },
    tr: {
      name: "Ekru Yakalı Blazer",
      short: "Ekru yaka ile hafifleyen lacivert terzilik.",
      description:
        "Yüzü çerçeveleyen ekru alt yakalı, üç düğmeli lacivert blazer. Bilekte büzülen bağcıklı paça pantolonla takım olarak giyildi.",
      material: "Yün görünümlü dimi — %70 polyester, %30 viskon",
      color: "Lacivert / Ekru",
      features: ["Kontrast ekru yaka", "Üç düğmeli ön", "Torba cepler", "Bağcıklı paça takım pantolonu"],
    },
  },
  {
    image: "catalog/p165",
    slug: "hook-front-blazer-off-white",
    code: "YEG-26-165",
    category: "blazers",
    collection: "signature",
    price: 320,
    fit: ["Relaxed", "Rahat"],
    weight: "300 g/m²",
    en: {
      name: "Hook-Front Blazer",
      short: "Off-white, closed with a column of metal hooks.",
      description:
        "Buttons replaced by a column of blackened metal hook-and-eye closures. An off-white blazer designed to be worn closed, with the matching straight trouser.",
      material: "Cotton-blend gabardine — 65% cotton, 35% polyester",
      color: "Off-White",
      features: ["Blackened metal hook closures", "Peak lapel", "Straight, relaxed body", "Matching trouser available"],
    },
    tr: {
      name: "Kancalı Blazer",
      short: "Kırık beyaz, bir sıra metal kancayla kapanır.",
      description:
        "Düğmelerin yerini bir sıra karartılmış metal kanca-göz kapama alır. Takım düz pantolonuyla kapalı giyilmek üzere tasarlanmış kırık beyaz blazer.",
      material: "Pamuk karışımlı gabardin — %65 pamuk, %35 polyester",
      color: "Kırık Beyaz",
      features: ["Karartılmış metal kanca kapama", "Sivri yaka", "Düz, rahat gövde", "Takım pantolonu mevcut"],
    },
  },
  {
    image: "catalog/p166",
    slug: "cape-vest-navy",
    code: "YEG-26-166",
    category: "vests",
    collection: "after-dark",
    price: 195,
    fit: ["Boxy", "Boxy"],
    weight: "300 g/m²",
    en: {
      name: "Cape Vest",
      short: "A navy vest with a cape shoulder and long belt.",
      description:
        "Half vest, half cape. The shoulder extends past the arm to create a sharp, square line; a long self-belt hangs from the waist. Worn over a wide ecru trouser.",
      material: "Wool-look twill — 70% polyester, 30% viscose",
      color: "Navy",
      features: ["Cape shoulder", "Long self-belt", "Hidden snap closure", "Pairs with the ecru wide trouser"],
    },
    tr: {
      name: "Pelerin Yelek",
      short: "Pelerin omuzlu ve uzun kemerli lacivert yelek.",
      description:
        "Yarı yelek, yarı pelerin. Omuz, keskin ve kare bir hat oluşturmak için kolun ötesine uzanır; belden uzun bir kemer sarkar. Geniş ekru pantolonla giyildi.",
      material: "Yün görünümlü dimi — %70 polyester, %30 viskon",
      color: "Lacivert",
      features: ["Pelerin omuz", "Uzun kumaş kemer", "Gizli çıtçıt kapama", "Ekru geniş pantolonla uyumlu"],
    },
  },
  {
    image: "catalog/p173",
    slug: "strap-hem-trouser-navy",
    code: "YEG-26-173",
    category: "trousers",
    collection: "essentials",
    price: 165,
    fit: ["Wide leg", "Geniş paça"],
    weight: "280 g/m²",
    en: {
      name: "Strap-Hem Trouser",
      short: "Navy trouser with adjustable ankle straps.",
      description:
        "A pleated navy trouser with buckled straps at the ankle, so the leg can be worn long and straight or cinched. Styled with a white poplin shirt tucked in.",
      material: "Wool-look twill — 70% polyester, 30% viscose",
      color: "Navy",
      features: ["Adjustable ankle straps", "Single front pleat", "Belt loops", "Pressed crease"],
    },
    tr: {
      name: "Kemer Detaylı Paça Pantolon",
      short: "Ayarlanabilir bilek kemerli lacivert pantolon.",
      description:
        "Bilekte tokalı kemerleri olan pileli lacivert pantolon; paça uzun ve düz ya da büzülerek giyilebilir. İçeride beyaz poplin gömlekle kombinlendi.",
      material: "Yün görünümlü dimi — %70 polyester, %30 viskon",
      color: "Lacivert",
      features: ["Ayarlanabilir bilek kemerleri", "Tek ön pile", "Kemer köprüleri", "Ütülü çizgi"],
    },
  },
  {
    image: "catalog/p174",
    slug: "striped-rib-tank-rust",
    code: "YEG-26-174",
    category: "tops",
    collection: "essentials",
    price: 85,
    fit: ["Slim", "Dar"],
    weight: "220 g/m²",
    en: {
      name: "Striped Rib Tank",
      short: "A rust and navy rib knit, worn under tailoring.",
      description:
        "A fine rib-knit tank in rust and navy stripes with a high neck. Designed as the base layer under our jackets — or worn alone with a silk neckerchief.",
      material: "Rib knit — 95% cotton, 5% elastane",
      color: "Rust Stripe",
      features: ["Fine 2×2 rib", "High neckline", "Stretch for fit", "Garment-dyed"],
    },
    tr: {
      name: "Çizgili Ribana Atlet",
      short: "Terziliğin altında giyilen kiremit ve lacivert ribana.",
      description:
        "Kiremit ve lacivert çizgili, yüksek yakalı ince ribana atlet. Ceketlerimizin altında temel katman olarak ya da ipek fularla tek başına giyilmek üzere tasarlandı.",
      material: "Ribana örme — %95 pamuk, %5 elastan",
      color: "Kiremit Çizgili",
      features: ["İnce 2×2 ribana", "Yüksek yaka", "Esnek kalıp", "Hazır giyim boyama"],
    },
  },
  {
    image: "catalog/p175",
    gallery: ["campaign/lounge-portrait", "campaign/lounge"],
    slug: "herringbone-pleated-trouser-mocha",
    code: "YEG-26-175",
    category: "trousers",
    collection: "essentials",
    price: 175,
    fit: ["Wide leg, high rise", "Geniş paça, yüksek bel"],
    weight: "320 g/m²",
    featured: true,
    showcase: true,
    en: {
      name: "Herringbone Pleated Trouser",
      short: "A textured mocha trouser with double pleats.",
      description:
        "A high-rise double-pleated trouser in a mocha herringbone, with tab details at the hem. Photographed for the campaign with the natural rib tank and a leather cross-body strap.",
      material: "Herringbone — 60% polyester, 30% viscose, 10% wool",
      color: "Mocha Herringbone",
      features: ["Double front pleats", "Hem tab details", "Extended waistband", "Wide leg with full break"],
    },
    tr: {
      name: "Balıksırtı Pileli Pantolon",
      short: "Çift pileli, dokulu mocha pantolon.",
      description:
        "Paçada tırnak detaylı, mocha balıksırtı kumaştan yüksek bel çift pileli pantolon. Kampanya için doğal ribana atlet ve deri çapraz askıyla fotoğraflandı.",
      material: "Balıksırtı — %60 polyester, %30 viskon, %10 yün",
      color: "Mocha Balıksırtı",
      features: ["Çift ön pile", "Paçada tırnak detayı", "Uzatılmış bel bandı", "Tam kırılımlı geniş paça"],
    },
  },
  {
    image: "catalog/p177",
    slug: "funnel-neck-shirt-olive",
    code: "YEG-26-177",
    category: "shirts",
    collection: "new-season",
    price: 145,
    fit: ["Relaxed", "Rahat"],
    weight: "180 g/m²",
    en: {
      name: "Funnel-Neck Shirt",
      short: "An olive shirt with a stand-up funnel collar.",
      description:
        "A long-sleeve shirt with a tall funnel collar that can be worn up or folded, and drawcord cuffs. In a dry olive cotton with the ecru tailored short.",
      material: "Cotton twill — 100% cotton",
      color: "Olive",
      features: ["Funnel collar", "Drawcord cuffs", "Concealed placket", "Relaxed body"],
    },
    tr: {
      name: "Dik Yaka Gömlek",
      short: "Dik huni yakalı zeytin yeşili gömlek.",
      description:
        "Dik ya da katlanarak giyilebilen uzun huni yakalı ve büzgülü manşetli uzun kollu gömlek. Kuru zeytin yeşili pamuktan, ekru terzi şortla.",
      material: "Pamuk dimi — %100 pamuk",
      color: "Zeytin",
      features: ["Huni yaka", "Büzgülü manşetler", "Gizli pat", "Rahat gövde"],
    },
  },
  {
    image: "catalog/p178",
    slug: "strap-detail-vest-black",
    code: "YEG-26-178",
    category: "vests",
    collection: "after-dark",
    price: 185,
    fit: ["Regular", "Standart"],
    weight: "300 g/m²",
    en: {
      name: "Strap Detail Vest",
      short: "A black vest crossed by long white straps.",
      description:
        "A tailored black vest with long white strap details that fall past the hem and continue down the matching trouser. A graphic, monochrome statement.",
      material: "Crepe suiting — 100% polyester",
      color: "Black / White",
      features: ["Contrast strap details", "Tailored vest body", "Matching strap trouser", "Satin back"],
    },
    tr: {
      name: "Şerit Detaylı Yelek",
      short: "Uzun beyaz şeritlerle kesilen siyah yelek.",
      description:
        "Etekten aşağı sarkan ve takım pantolon boyunca devam eden uzun beyaz şerit detaylı terzi işi siyah yelek. Grafik, monokrom bir duruş.",
      material: "Krep takım kumaşı — %100 polyester",
      color: "Siyah / Beyaz",
      features: ["Kontrast şerit detaylar", "Terzi işi yelek gövdesi", "Şeritli takım pantolon", "Saten sırt"],
    },
  },
  {
    image: "catalog/p183",
    slug: "piped-tailored-jacket-black",
    code: "YEG-26-183",
    category: "blazers",
    collection: "after-dark",
    price: 295,
    fit: ["Regular", "Standart"],
    weight: "300 g/m²",
    en: {
      name: "Piped Tailored Jacket",
      short: "Black tailoring traced with white piping.",
      description:
        "A black single-breasted jacket traced with fine white piping along the front and sleeve, echoed on the matching trouser. Evening tailoring with an edge.",
      material: "Crepe suiting — 100% polyester",
      color: "Black",
      features: ["Contrast white piping", "Single-breasted", "Structured shoulder", "Matching piped trouser"],
    },
    tr: {
      name: "Biyeli Terzi Ceket",
      short: "Beyaz biyeyle çizilen siyah terzilik.",
      description:
        "Önde ve kolda ince beyaz biyelerle çizilen, takım pantolonda da tekrarlanan tek düğmeli siyah ceket. Keskin bir gece terziliği.",
      material: "Krep takım kumaşı — %100 polyester",
      color: "Siyah",
      features: ["Kontrast beyaz biye", "Tek sıra düğme", "Yapılı omuz", "Biyeli takım pantolon"],
    },
  },
  {
    image: "campaign/studio-black",
    slug: "embellished-blazer-black",
    code: "YEG-26-201",
    category: "blazers",
    collection: "signature",
    price: 345,
    fit: ["Relaxed", "Rahat"],
    weight: "320 g/m²",
    featured: true,
    en: {
      name: "Embellished Blazer",
      short: "Black tailoring scattered with metal hardware.",
      description:
        "Our most decorative piece. A relaxed black blazer with hand-placed pins, chains and hardware across the chest, worn with a straight black trouser.",
      material: "Crepe suiting — 100% polyester; metal hardware",
      color: "Black",
      features: ["Hand-applied metal hardware", "Relaxed shoulder", "Single-button front", "Limited production"],
    },
    tr: {
      name: "Aksesuarlı Blazer",
      short: "Metal aksesuarlarla bezenmiş siyah terzilik.",
      description:
        "En dekoratif parçamız. Göğüs boyunca elle yerleştirilmiş iğne, zincir ve metal aksesuarlı rahat siyah blazer; düz siyah pantolonla giyildi.",
      material: "Krep takım kumaşı — %100 polyester; metal aksesuar",
      color: "Siyah",
      features: ["Elle uygulanan metal aksesuar", "Rahat omuz", "Tek düğmeli ön", "Sınırlı üretim"],
    },
  },
  {
    image: "campaign/studio-sage",
    slug: "camp-collar-jacket-sage",
    code: "YEG-26-202",
    category: "jackets",
    collection: "new-season",
    price: 235,
    fit: ["Cropped, boxy", "Kısa, boxy"],
    weight: "240 g/m²",
    en: {
      name: "Camp Collar Jacket",
      short: "Sage linen jacket with a wide open collar.",
      description:
        "A cropped, short-sleeved jacket in sage linen with a wide tonal collar, worn open over a white tank with ecru pleated shorts.",
      material: "Linen blend — 55% linen, 45% viscose",
      color: "Sage",
      features: ["Wide camp collar", "Cropped, boxy body", "Short sleeves", "Garment-washed"],
    },
    tr: {
      name: "Kamp Yaka Ceket",
      short: "Geniş açık yakalı adaçayı keten ceket.",
      description:
        "Geniş ton sür ton yakalı, adaçayı yeşili ketenden kısa kollu crop ceket; beyaz atlet ve ekru pileli şort üzerinde açık giyildi.",
      material: "Keten karışımı — %55 keten, %45 viskon",
      color: "Adaçayı",
      features: ["Geniş kamp yaka", "Kısa, boxy gövde", "Kısa kollar", "Hazır giyim yıkama"],
    },
  },
];

function specsFor(p: ProductSeed): Prisma.InputJsonValue {
  return [
    { labelEn: "Reference", labelTr: "Referans", valueEn: p.code, valueTr: p.code },
    { labelEn: "Fit", labelTr: "Kalıp", valueEn: p.fit[0], valueTr: p.fit[1] },
    { labelEn: "Fabric weight", labelTr: "Kumaş ağırlığı", valueEn: p.weight, valueTr: p.weight },
    { labelEn: "Sizes", labelTr: "Bedenler", valueEn: "XS — XXL", valueTr: "XS — XXL" },
    { labelEn: "Production", labelTr: "Üretim", valueEn: "Made in Türkiye", valueTr: "Türkiye'de üretildi" },
    { labelEn: "Minimum order", labelTr: "Minimum sipariş", valueEn: "50 pcs per colour", valueTr: "Renk başına 50 adet" },
    { labelEn: "Lead time", labelTr: "Termin", valueEn: "4 — 6 weeks", valueTr: "4 — 6 hafta" },
    { labelEn: "Care", labelTr: "Bakım", valueEn: "Dry clean or cold gentle wash", valueTr: "Kuru temizleme veya soğuk hassas yıkama" },
  ];
}

// ————————————————————————————————————————————————————————— journal

const blogCategories = [
  { slug: "campaign", nameEn: "Campaign", nameTr: "Kampanya" },
  { slug: "production", nameEn: "Production", nameTr: "Üretim" },
  { slug: "style-notes", nameEn: "Style Notes", nameTr: "Stil Notları" },
];

const posts = [
  {
    slug: "built-for-the-few-ss26-campaign",
    category: "campaign",
    cover: img("campaign/neon-monogram", "50% 45%"),
    featured: true,
    daysAgo: 6,
    titleEn: "Built For The Few: inside the SS26 campaign",
    titleTr: "Seçkinler İçin: İY26 kampanyasının perde arkası",
    excerptEn: "Neon, wet concrete and a single sky-blue suit. How we shot the season that defines the YEG silhouette.",
    excerptTr: "Neon, ıslak beton ve tek bir gök mavisi takım. YEG silüetini tanımlayan sezonu nasıl çektiğimizi anlatıyoruz.",
    contentEn: `The idea was simple: one suit, one room, one colour of light.

For SS26 we wanted the clothes to carry the image on their own. The cropped jacket and the high-rise pleated trouser were designed as a single line — shoulder to floor — and the campaign had to show that line without distraction.

## A room built in red

We built the set around our brand red. Neon tubes were bent into fragments of the YEG monogram and hung across the back wall, so that the logo only resolves when you step back from the image.

> We don't design for everyone. We design for the few who notice the difference.

## Why sky blue

Against a red room, a pale sky-blue suit does something unexpected: it reads cleaner and sharper than black ever could. It became the colour of the season.

- Cropped Short-Sleeve Blazer in Sky
- Contrast Collar Jacket in Sky / Ecru
- High-rise wide pleated trouser

Every piece in the campaign is in production now and available for wholesale.`,
    contentTr: `Fikir basitti: tek takım, tek oda, tek renk ışık.

İY26 için kıyafetlerin görüntüyü tek başına taşımasını istedik. Crop ceket ve yüksek bel pileli pantolon tek bir çizgi olarak tasarlandı — omuzdan zemine — ve kampanyanın bu çizgiyi dikkat dağıtmadan göstermesi gerekiyordu.

## Kırmızıyla kurulan bir oda

Seti marka kırmızımızın etrafında kurduk. Neon tüpler YEG monogramının parçaları şeklinde bükülüp arka duvara asıldı; logo ancak görüntüden bir adım geri çekildiğinizde beliriyor.

> Herkes için tasarlamıyoruz. Farkı fark eden azınlık için tasarlıyoruz.

## Neden gök mavisi

Kırmızı bir odada açık gök mavisi bir takım beklenmedik bir şey yapar: siyahın asla olamayacağı kadar temiz ve keskin okunur. Sezonun rengi oldu.

- Gök Mavisi Kısa Kollu Crop Blazer
- Gök Mavisi / Ekru Kontrast Yaka Ceket
- Yüksek bel geniş pileli pantolon

Kampanyadaki tüm parçalar şu anda üretimde ve toptan satışa hazır.`,
  },
  {
    slug: "from-idea-to-fabric-to-product",
    category: "production",
    cover: img("campaign/lounge", "40% 50%"),
    featured: false,
    daysAgo: 18,
    titleEn: "From idea to fabric to product",
    titleTr: "Fikirden kumaşa, kumaştan ürüne",
    excerptEn: "Every YEG garment passes through the same five hands. A walk through our production floor.",
    excerptTr: "Her YEG ürünü aynı beş elden geçer. Üretim alanımızda bir tur.",
    contentEn: `A garment is only as good as the decisions made before the first cut.

## 01 — Idea

Each collection starts with a single sentence and a wall of references. We edit until the sentence and the silhouette say the same thing.

## 02 — Fabric

We source and test cloth in-house: drape, shrinkage, colour fastness and how a fabric behaves after twenty washes. Only then does it get a code.

## 03 — Pattern

Patterns are drafted and graded by our own pattern makers. A cropped jacket lives or dies by two centimetres at the hem.

## 04 — Production

Cutting, sewing, pressing and finishing happen under one roof in Türkiye. Small runs, trained hands, no shortcuts.

## 05 — Control

Every piece is measured and inspected against the approved sample before it is packed.

> Quality is not a department. It is every step.`,
    contentTr: `Bir kıyafet, ilk kesimden önce verilen kararlar kadar iyidir.

## 01 — Fikir

Her koleksiyon tek bir cümle ve bir duvar dolusu referansla başlar. Cümle ile silüet aynı şeyi söyleyene dek düzenleriz.

## 02 — Kumaş

Kumaşı kendi bünyemizde tedarik eder ve test ederiz: döküm, çekme, renk haslığı ve yirmi yıkamadan sonra kumaşın nasıl davrandığı. Ancak bundan sonra bir kod alır.

## 03 — Kalıp

Kalıplar kendi modelistlerimiz tarafından çizilir ve serilenir. Bir crop ceketi etekteki iki santim belirler.

## 04 — Üretim

Kesim, dikim, ütü ve son işlemler Türkiye'de tek çatı altında yapılır. Küçük seriler, eğitimli eller, kestirme yok.

## 05 — Kontrol

Her parça paketlenmeden önce onaylı numuneye göre ölçülür ve kontrol edilir.

> Kalite bir departman değildir. Her adımdır.`,
  },
  {
    slug: "the-case-for-the-cropped-blazer",
    category: "style-notes",
    cover: img("campaign/studio-sky", "50% 30%"),
    featured: false,
    daysAgo: 31,
    titleEn: "The case for the cropped blazer",
    titleTr: "Crop blazer'ın savunusu",
    excerptEn: "Why we cut our tailoring short — and how to wear it with a high-rise trouser.",
    excerptTr: "Terziliğimizi neden kısa kestiğimiz ve yüksek bel pantolonla nasıl giyileceği.",
    contentEn: `A classic blazer ends at the seat. Ours end at the waist — on purpose.

## Proportion over rules

Cutting the jacket short raises the visual waistline and lets a wide, high-rise trouser fall uninterrupted to the floor. The result is a longer, cleaner line.

## How to wear it

- Keep the trouser high: the jacket should meet the waistband, not float above it.
- Go tonal: the same cloth top and bottom makes the silhouette read as one piece.
- Let the collar do the work: a contrast ecru collar is all the detail you need.

> The best tailoring changes how you stand.`,
    contentTr: `Klasik bir blazer kalçada biter. Bizimkiler belde biter — bilerek.

## Kurallar yerine oran

Ceketi kısa kesmek görsel bel çizgisini yükseltir ve geniş, yüksek bel pantolonun kesintisiz yere dökülmesini sağlar. Sonuç daha uzun, daha temiz bir çizgidir.

## Nasıl giyilir

- Pantolonu yüksek tutun: ceket bel bandıyla buluşmalı, üstünde havada kalmamalı.
- Ton sür ton gidin: üstte ve altta aynı kumaş silüeti tek parça gibi gösterir.
- Bırakın yaka konuşsun: kontrast ekru bir yaka ihtiyacınız olan tek detaydır.

> En iyi terzilik nasıl durduğunuzu değiştirir.`,
  },
  {
    slug: "after-dark-the-city-at-night",
    category: "campaign",
    cover: img("campaign/alley-check", "50% 40%"),
    featured: false,
    daysAgo: 45,
    titleEn: "After Dark: dressing for the city at night",
    titleTr: "Gece Yarısı: gece şehri için giyinmek",
    excerptEn: "Checked blousons, dip-dyed hems and wet streets. The moodier side of YEG.",
    excerptTr: "Ekose bluzonlar, batik etekler ve ıslak sokaklar. YEG'in daha karanlık yüzü.",
    contentEn: `After Dark was shot between midnight and four in the morning, in alleys lit only by shop signs.

## Darker cloths, sharper lines

The collection leans on brushed checks, espresso cottons and black crepe traced with white piping — fabrics that catch the little light there is.

## The hero piece

The Check Cropped Blouson, in a brushed tobacco check with deep rib cuffs, carries the whole story: workwear roots, tailored proportions, a city attitude.

> Some clothes are made for daylight. These are not.`,
    contentTr: `Gece Yarısı, gece yarısı ile sabah dört arasında, yalnızca dükkân tabelalarıyla aydınlanan ara sokaklarda çekildi.

## Daha koyu kumaşlar, daha keskin hatlar

Koleksiyon fırçalanmış ekoselere, espresso pamuklulara ve beyaz biyeyle çizilen siyah krebe yaslanıyor — oradaki az ışığı yakalayan kumaşlar.

## Kahraman parça

Fırçalanmış tütün ekoseden, derin ribana manşetli Ekose Crop Bluzon tüm hikâyeyi taşıyor: iş giyimi kökleri, terzi işi oranlar, şehirli bir tavır.

> Bazı kıyafetler gün ışığı için yapılır. Bunlar değil.`,
  },
  {
    slug: "why-we-manufacture-in-turkiye",
    category: "production",
    cover: img("campaign/brick-wall-portrait", "50% 35%"),
    featured: false,
    daysAgo: 60,
    titleEn: "Why we manufacture in Türkiye",
    titleTr: "Neden Türkiye'de üretiyoruz",
    excerptEn: "Speed, craft and control: the case for producing close to home.",
    excerptTr: "Hız, zanaat ve kontrol: yakında üretmenin gerekçesi.",
    contentEn: `Türkiye has one of the deepest textile traditions in the world, and some of the most skilled hands in tailoring.

## Speed

Producing close to our fabric mills means a sample can go from pattern to fitting in days, not weeks.

## Craft

Our sewing teams have decades of experience in tailoring — the kind of experience that shows in a collar that rolls correctly.

## Control

When design, pattern, production and quality control share a building, nothing gets lost in translation.

> Made in Türkiye is not a label for us. It is the method.`,
    contentTr: `Türkiye, dünyanın en köklü tekstil geleneklerinden birine ve terzilikte en yetenekli ellerden bazılarına sahip.

## Hız

Kumaş fabrikalarımıza yakın üretmek, bir numunenin kalıptan provaya haftalar değil günler içinde geçmesi demek.

## Zanaat

Dikim ekiplerimiz terzilikte onlarca yıllık deneyime sahip — doğru dönen bir yakada kendini gösteren türden bir deneyim.

## Kontrol

Tasarım, kalıp, üretim ve kalite kontrol aynı binayı paylaştığında hiçbir şey çeviride kaybolmaz.

> Türkiye'de üretildi, bizim için bir etiket değil. Yöntemin kendisi.`,
  },
];

// ————————————————————————————————————————————————————————— homepage

const homepage = {
  hero: {
    image: img("campaign/alley-grey", "58% 35%"),
    // Optional art-directed crop for phones; the neon frame crops well on its own.
    mobileImage: null,
    videoUrl: "",
    titleEn: "Not For Everyone",
    titleTr: "Herkes İçin Değil",
    subtitleEn: "Contemporary menswear, designed and produced in Türkiye.",
    subtitleTr: "Türkiye'de tasarlanan ve üretilen çağdaş erkek giyim.",
    ctaLabelEn: "Explore the collection",
    ctaLabelTr: "Koleksiyonu keşfet",
    ctaHref: "/products",
  },
  intro: {
    textEn: "We don't just produce fabric; we weave the memory of brands. Character in every thread, perfection in every stitch, our signature in every detail.",
    textTr: "Biz kumaş üretmiyoruz; markaların hafızasını dokuyoruz. Her iplikte karakter, her dikişte kusursuzluk, her detayda imzamız var.",
  },
  marquee: {
    itemsEn: ["Designed", "Patterned", "Crafted", "Produced", "Delivered"],
    itemsTr: ["Tasarlandı", "Kalıplandı", "İşlendi", "Üretildi", "Teslim edildi"],
  },
  featured: {
    titleEn: "Selected pieces",
    titleTr: "Seçili parçalar",
    productSlugs: [
      "contrast-collar-jacket-sky",
      "check-cropped-blouson-tobacco",
      "oversized-blazer-heather-grey",
      "boxy-contrast-jacket-burgundy",
      "embellished-blazer-black",
      "cropped-short-sleeve-blazer-sky",
    ],
  },
  statement: {
    image: img("campaign/neon-monogram", "50% 50%"),
    captionEn: "",
    captionTr: "",
  },
  showcase: {
    productSlugs: ["check-cropped-blouson-tobacco", "contrast-collar-jacket-sky", "herringbone-pleated-trouser-mocha"],
  },
  lookbook: {
    titleEn: "The SS26 campaign",
    titleTr: "İY26 kampanyası",
    textEn: "Shot between the studio and the city at night — every look is in production and available for wholesale.",
    textTr: "Stüdyo ile gece şehri arasında çekildi — her görünüm üretimde ve toptan satışa hazır.",
    images: (
      [
        ["campaign/studio-sky", "Contrast Collar Jacket — Sky", "Kontrast Yaka Ceket — Gök Mavisi"],
        ["campaign/alley-check", "Check Cropped Blouson — Tobacco", "Ekose Crop Bluzon — Tütün"],
        ["campaign/lounge-portrait", "Herringbone Pleated Trouser", "Balıksırtı Pileli Pantolon"],
        ["campaign/parking-sky", "Contrast Collar Jacket — After hours", "Kontrast Yaka Ceket — Gece"],
        ["campaign/studio-black", "Embellished Blazer — Black", "Aksesuarlı Blazer — Siyah"],
        ["campaign/alley-sand", "Camp Collar Overshirt — Sand", "Kamp Yaka Gömlek Ceket — Kum"],
        ["campaign/brick-wall-portrait", "Contrast Collar Jacket — Brick", "Kontrast Yaka Ceket — Tuğla"],
        ["campaign/checkpoint-grey", "Oversized Blazer — Heather Grey", "Oversize Blazer — Melanj Gri"],
        ["campaign/studio-sage", "Camp Collar Jacket — Sage", "Kamp Yaka Ceket — Adaçayı"],
        ["campaign/lounge", "Herringbone Pleated Trouser — Lounge", "Balıksırtı Pileli Pantolon — Salon"],
      ] as const
    ).map(([key, en, tr]) => {
      const m = manifest[key];
      return { url: m.src, width: m.width, height: m.height, blurDataUrl: m.blur, altEn: en, altTr: tr, objectPosition: "50% 40%" };
    }),
  },
  story: {
    linesEn: ["From idea", "To fabric", "To product"],
    linesTr: ["Fikirden", "Kumaşa", "Ürüne"],
    textEn:
      "Design, pattern making, sampling and production live under one roof. Every decision — from the weight of a cloth to the roll of a collar — is made by the same hands that sign off the final piece.",
    textTr:
      "Tasarım, kalıp, numune ve üretim tek çatı altında. Bir kumaşın ağırlığından bir yakanın dönüşüne kadar her karar, son parçayı onaylayan aynı eller tarafından verilir.",
    texture: img("texture/particle-monogram", "70% 50%"),
    steps: [
      {
        titleEn: "Design",
        titleTr: "Tasarım",
        textEn: "Every collection begins with a single idea, edited until the silhouette says it alone.",
        textTr: "Her koleksiyon tek bir fikirle başlar; silüet onu tek başına anlatana dek düzenlenir.",
        image: img("catalog/p165", "50% 25%"),
      },
      {
        titleEn: "Fabric & pattern",
        titleTr: "Kumaş & kalıp",
        textEn: "Cloth is tested in-house. Patterns are drafted and graded by our own pattern makers.",
        textTr: "Kumaş kendi bünyemizde test edilir. Kalıplar kendi modelistlerimizce çizilir ve serilenir.",
        image: img("catalog/p048", "50% 25%"),
      },
      {
        titleEn: "Production",
        titleTr: "Üretim",
        textEn: "Cut, sewn, pressed and inspected in Türkiye — small runs, trained hands, no shortcuts.",
        textTr: "Türkiye'de kesilir, dikilir, ütülenir ve kontrol edilir — küçük seriler, eğitimli eller, kestirme yok.",
        image: img("catalog/p045", "50% 25%"),
      },
    ],
  },
  collections: {
    titleEn: "Four stories, one hand",
    titleTr: "Dört hikâye, tek el",
    collectionSlugs: ["new-season", "signature", "essentials", "after-dark"],
  },
  banner: {
    image: img("texture/red-wave-02", "50% 50%"),
    titleEn: "Let's build your next collection",
    titleTr: "Bir sonraki koleksiyonunuzu birlikte üretelim",
    textEn: "Private label, wholesale and made-to-order production for brands that care about the details.",
    textTr: "Detaylara önem veren markalar için private label, toptan ve siparişe özel üretim.",
    ctaLabelEn: "Start a conversation",
    ctaLabelTr: "Görüşme başlatın",
    ctaHref: "/contact",
  },
};

const sectionOrder = ["hero", "intro", "marquee", "featured", "statement", "showcase", "lookbook", "story", "collections", "banner"] as const;

// ————————————————————————————————————————————————————————— run

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@yegtextile.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "yeg-admin-2026";
  const existing = await db.user.findUnique({ where: { email } });
  if (!existing) {
    await db.user.create({ data: { email, name: "YEG Admin", passwordHash: await bcrypt.hash(password, 12), role: "ADMIN" } });
    console.log(`Admin created: ${email}`);
  }

  const catIds: Record<string, string> = {};
  for (const [i, c] of categories.entries()) {
    const row = await db.category.upsert({ where: { slug: c.slug }, update: { ...c, sortOrder: i }, create: { ...c, sortOrder: i } });
    catIds[c.slug] = row.id;
  }

  const colIds: Record<string, string> = {};
  for (const [i, { cover, ...c }] of collections.entries()) {
    const data = {
      ...c,
      sortOrder: i,
      coverUrl: cover.url,
      coverWidth: cover.width,
      coverHeight: cover.height,
      coverBlur: cover.blur,
      coverPosition: cover.position,
    };
    const row = await db.collection.upsert({ where: { slug: c.slug }, update: data, create: data });
    colIds[c.slug] = row.id;
  }

  for (const [i, p] of products.entries()) {
    const data = {
      code: p.code,
      nameEn: p.en.name,
      nameTr: p.tr.name,
      shortEn: p.en.short,
      shortTr: p.tr.short,
      descriptionEn: p.en.description,
      descriptionTr: p.tr.description,
      materialEn: p.en.material,
      materialTr: p.tr.material,
      colorEn: p.en.color,
      colorTr: p.tr.color,
      featuresEn: p.en.features,
      featuresTr: p.tr.features,
      specs: specsFor(p),
      price: new Prisma.Decimal(p.price),
      categoryId: catIds[p.category],
      collectionId: colIds[p.collection],
      isFeatured: Boolean(p.featured),
      isShowcase: Boolean(p.showcase),
      sortOrder: i,
      seoTitleEn: `${p.en.name} — ${p.en.color}`,
      seoTitleTr: `${p.tr.name} — ${p.tr.color}`,
      seoDescriptionEn: p.en.short,
      seoDescriptionTr: p.tr.short,
    };
    const row = await db.product.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
    await db.productImage.deleteMany({ where: { productId: row.id } });
    const keys = [p.image, ...(p.gallery ?? [])];
    await db.productImage.createMany({
      data: keys.map((key, idx) => {
        const m = manifest[key];
        const portrait = m.height > m.width;
        return {
          productId: row.id,
          url: m.src,
          width: m.width,
          height: m.height,
          blurDataUrl: m.blur,
          altEn: `${p.en.name} in ${p.en.color} — YEG Textile`,
          altTr: `${p.tr.name}, ${p.tr.color} — YEG Textile`,
          objectPosition: portrait ? "50% 28%" : "50% 45%",
          isPrimary: idx === 0,
          sortOrder: idx,
        };
      }),
    });
  }

  const bcIds: Record<string, string> = {};
  for (const [i, c] of blogCategories.entries()) {
    const row = await db.blogCategory.upsert({ where: { slug: c.slug }, update: { ...c, sortOrder: i }, create: { ...c, sortOrder: i } });
    bcIds[c.slug] = row.id;
  }

  for (const { cover, category, daysAgo, featured, ...post } of posts) {
    const data = {
      ...post,
      categoryId: bcIds[category],
      isFeatured: featured,
      coverUrl: cover.url,
      coverWidth: cover.width,
      coverHeight: cover.height,
      coverBlur: cover.blur,
      coverPosition: cover.position,
      publishedAt: new Date(Date.now() - daysAgo * 86_400_000),
      seoTitleEn: post.titleEn,
      seoTitleTr: post.titleTr,
      seoDescriptionEn: post.excerptEn,
      seoDescriptionTr: post.excerptTr,
    };
    await db.blog.upsert({ where: { slug: post.slug }, update: data, create: data });
  }

  for (const [i, key] of sectionOrder.entries()) {
    const data = homepage[key] as unknown as Prisma.InputJsonValue;
    await db.homepageSection.upsert({ where: { key }, update: { data, sortOrder: i }, create: { key, data, sortOrder: i } });
  }

  await db.setting.upsert({
    where: { key: "contact" },
    update: {},
    create: {
      key: "contact",
      value: {
        email: "info@yegtextile.com",
        phone: "+90 212 000 00 00",
        whatsapp: "+90 500 000 00 00",
        addressEn: "Istanbul, Türkiye",
        addressTr: "İstanbul, Türkiye",
        instagram: "yegtextile",
      },
    },
  });
  await db.setting.upsert({ where: { key: "general" }, update: {}, create: { key: "general", value: { currency: "USD", showPrices: true } } });


  // Sample galleries (editable in the admin): collections + the campaign journal post
  const gal = (items: [MediaKey, string, string][]) =>
    items.map(([key, en, tr]) => ({ url: manifest[key].src, width: manifest[key].width, height: manifest[key].height, blurDataUrl: manifest[key].blur, altEn: en, altTr: tr, objectPosition: "50% 40%" }));
  const galleries: Record<string, [MediaKey, string, string][]> = {
    "new-season": [
      ["campaign/studio-sky", "Contrast Collar Jacket", "Kontrast Yaka Ceket"],
      ["campaign/parking-sky", "After hours", "Gece mesaisi"],
      ["campaign/alley-sand", "Camp Collar Overshirt", "Kamp Yaka Gömlek Ceket"],
      ["campaign/studio-sage", "Camp Collar Jacket — Sage", "Kamp Yaka Ceket — Adaçayı"],
    ],
    "after-dark": [
      ["campaign/alley-check", "Check Cropped Blouson", "Ekose Crop Bluzon"],
      ["campaign/alley-grey", "Oversized Blazer", "Oversize Blazer"],
      ["campaign/checkpoint-grey", "Checkpoint", "Kontrol noktası"],
    ],
  };
  for (const [slug, items] of Object.entries(galleries)) {
    await db.collection.update({ where: { slug }, data: { gallery: gal(items) } });
  }
  await db.blog.update({
    where: { slug: "built-for-the-few-ss26-campaign" },
    data: {
      gallery: gal([
        ["campaign/neon-room", "The Red Room", "Kırmızı Oda"],
        ["campaign/brick-wall-portrait", "On location", "Mekânda"],
        ["campaign/studio-sky", "Studio", "Stüdyo"],
      ]),
    },
  });

  console.log(`Seeded ${products.length} products, ${collections.length} collections, ${posts.length} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
