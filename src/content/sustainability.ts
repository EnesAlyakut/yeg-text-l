import type { ImageRef } from "@/lib/content-types";

/**
 * Sustainability page — edited from the admin (Pages → Sustainability).
 * While `published` is false the page stays out of search results and the sitemap.
 */
type Block = { title: string; text: string };

export type SustainabilityContent = {
  title: string;
  lead: string;
  paragraphs: string[];
  /** Short lines shown big, one under the other ("Nasıl ürettiğimiz. Ne kullandığımız…") */
  statement: string[];
  /** Red band: the motto and its translation */
  motto: string;
  mottoNote: string;
  /** Closing signature line */
  signature: string;
  blocks: Block[];
};

const tr: SustainabilityContent = {
  title: "Daha fazla değil\n*Daha doğru*",
  lead: "Sürdürülebilirlik bizim için bir söylem değil, üretim biçimimizin bir parçası.",
  paragraphs: [
    "Tekstil üretiminin çevresel etkisinin farkındayız. Bu nedenle daha sürdürülebilir kaynakları tercih etmeye, üretim süreçlerimizi geliştirmeye ve karbon ayak izimizi azaltmaya yönelik adımlar atıyoruz.",
    "Organik ve geri dönüştürülmüş kumaş alternatifleri, ekolojik yıkama teknikleri ve daha kontrollü üretim süreçleriyle yalnızca bugünün ürününü değil, yarının üretim anlayışını da düşünüyoruz.",
    "Döngüsel ekonomiyi destekleyen malzeme ve üretim alternatiflerini değerlendirirken kalite standardından vazgeçmiyoruz. Çünkü bizim için sürdürülebilirlik, daha az tüketirken daha iyi üretmenin yollarını aramak demek.",
  ],
  statement: ["Mesele sadece ne ürettiğimiz değil.", "Nasıl ürettiğimiz", "Ne kullandığımız", "Ne bıraktığımız"],
  motto: "Less waste. Less impact. More thought.",
  mottoNote: "Daha az atık. Daha az etki. Daha fazla düşünce.",
  signature: "YEG TEXTILE — Bir satın alma değil, bir duruş.",
  blocks: [],
};

const en: SustainabilityContent = {
  title: "Not more\n*More right*",
  lead: "For us, sustainability is not a slogan — it is part of how we produce.",
  paragraphs: [
    "We are aware of the environmental impact of textile production. That is why we take steps to choose more sustainable sources, improve our production processes and reduce our carbon footprint.",
    "With organic and recycled fabric alternatives, ecological washing techniques and more controlled production, we think not only about today’s product but about tomorrow’s way of making.",
    "While we consider materials and production methods that support a circular economy, we never give up on quality. For us, sustainability means finding ways to make better while consuming less.",
  ],
  statement: ["It is not only about what we make.", "How we make it", "What we use", "What we leave behind"],
  motto: "Less waste. Less impact. More thought.",
  mottoNote: "Fewer offcuts, a lighter footprint, every decision considered.",
  signature: "YEG TEXTILE — Not a purchase, a stance.",
  blocks: [],
};

const fr: SustainabilityContent = {
  title: "Pas plus\n*Plus juste*",
  lead: "Pour nous, la durabilité n’est pas un discours : elle fait partie de notre façon de produire.",
  paragraphs: [
    "Nous sommes conscients de l’impact environnemental de la production textile. C’est pourquoi nous choisissons des sources plus durables, améliorons nos processus et réduisons notre empreinte carbone.",
    "Avec des alternatives en tissus biologiques et recyclés, des techniques de lavage écologiques et une production plus maîtrisée, nous pensons non seulement au produit d’aujourd’hui, mais aussi à la manière de produire de demain.",
    "En étudiant des matières et des procédés qui soutiennent l’économie circulaire, nous ne renonçons jamais à la qualité. Pour nous, la durabilité, c’est chercher à mieux produire en consommant moins.",
  ],
  statement: ["Il ne s’agit pas seulement de ce que nous produisons.", "Mais de comment nous le produisons", "De ce que nous utilisons", "De ce que nous laissons"],
  motto: "Less waste. Less impact. More thought.",
  mottoNote: "Moins de déchets. Moins d’impact. Plus de réflexion.",
  signature: "YEG TEXTILE — Pas un achat, une allure.",
  blocks: [],
};

export const sustainabilityContent = {
  published: true,
  image: null as ImageRef | null,
  tr,
  en,
  fr,
};
