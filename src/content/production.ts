import media from "@/data/imported-media.json";
import type { Locale } from "@/i18n/config";

/**
 * Production page. Copy and photos come from the previous yegtextile.com/production page
 * (English original, lightly corrected), translated into Turkish and French.
 * Photos are imported by scripts/import-site-images.ts.
 */
type Key = keyof typeof media;
export const importedImage = (key: Key, position = "50% 50%") => ({ url: media[key].src, width: media[key].width, height: media[key].height, blur: media[key].blur, position });
const img = importedImage;

export const productionImages = {
  rawMaterial: img("production/raw-material", "60% 50%"),
  cutting: img("production/cutting", "55% 40%"),
  sewing: img("production/sewing", "50% 45%"),
  craft: img("production/craft", "50% 50%"),
  network: img("production/network", "60% 40%"),
  quality: img("production/quality", "40% 45%"),
};

export const PRODUCTION_ADDRESS = "Zafer Mah. 2487/6 Sok. No:29, Merkezefendi, Denizli";

type ChapterKey = Exclude<keyof typeof productionImages, never>;
type Chapter = { image: ChapterKey; title: string; text: string; stages?: string[] };

const tr = {
  meta: {
    title: "Üretim",
    description:
      "Hammaddeden bitmiş ürüne kadar üretimin her aşamasında kalite ve hizmette en yüksek standartlar: Gerber kesim, deneyimli dikim ekibi, Türkiye geneline yayılan üretim ağı ve kendi bünyemizde kalite güvencesi.",
  },
  eyebrow: "Üretim",
  title: "Üretim gücümüz",
  lead: "Hammaddeden bitmiş ürüne — her aşamada kalite.",
  hq: "Üretim merkezi",
  facts: [
    { value: "30+", label: "Yıllık üretim tecrübesi" },
    { value: "%50", label: "Düz kumaş üretim payı" },
    { value: "Gerber", label: "Kesim sistemi" },
    { value: "4", label: "Aşamalı kalite kontrol" },
  ],
  chapters: [
    {
      image: "rawMaterial",
      title: "Hammaddeden bitmiş ürüne",
      text: "Hammaddeden bitmiş ürüne kadar üretimin her aşamasında müşterilerimize kalite ve hizmette en yüksek standartları garanti ediyoruz. Müşterilerimize en iyi seçenekleri ve avantajlı fiyatları sunabilmek için en güncel teknolojiyle donatılmış durumdayız; üretim terminlerini olabildiğince kısa tutmaya özellikle önem veriyoruz. Tasarımdan üretime, oradan teslimata kadar tüm adımlar deneyimli ekibimiz tarafından özenle yürütülürken müşterilerimizle güçlü bir iletişimi sürdürüyoruz.",
    },
    {
      image: "cutting",
      title: "Kesim",
      text: "Kesim departmanımız, maksimum verim ve hassasiyeti garanti etmek için Gerber kullanıyor. Üretimimizin yaklaşık %50’si düz kumaşlardan oluştuğu için hatasız bir süreç sağlamak adına el motorları kullanıyoruz. Her tür kumaş için tam otomatik sistem kesim makineleri kullanıyoruz.",
    },
    {
      image: "sewing",
      title: "Dikim",
      text: "Çok sayıda deneyimli makine operatörümüz sayesinde yüksek kaliteli ve uzun ömürlü ürünleri mümkün olan en kısa sürede üretiyoruz. Düz kumaşların kısa sürede birbirinden farklı ürünlere nasıl dönüştüğünü görünce şaşıracaksınız.",
    },
    {
      image: "craft",
      title: "Ustalık",
      text: "30 yılı aşkın süredir üretim yapan YEG, çok hassas kumaşlarda ve karmaşık modellerde bile kusursuz işçiliğiyle tanınır. Daha fazla emek gerektirse de özgün işler ortaya koymaktan gurur duyuyoruz.",
    },
    {
      image: "network",
      title: "Üretim ağı",
      text: "Deneyimli terzilerden oluşan bir üretim ekibimiz ve Türkiye’nin dört bir yanına yayılmış, her biri farklı bir alanda uzmanlaşmış, sayısı giderek artan özel fason üreticilerimiz var. Kalite güvence departmanımız, her modelin üretim öncesi numunelere ve YEG kalite standartlarına tam olarak uyduğundan emin olmak için tüm fason üreticilerde düzenli kontroller yapıyor.",
    },
    {
      image: "quality",
      title: "Kalite güvencesi",
      text: "Kalite güvence sistemimiz birkaç kapsamlı aşamadan oluşur: ham ve boyalı kumaş kontrolü, kumaş serim ve kesim kontrolü, dikim öncesi ürün montajı ve nitelikli kalite kontrol uzmanlarından oluşan bir ekip tarafından yapılan final kontrolü. Ürünler üzerinde tam denetim ve kontrol sağlamak için tüm aşamalar kendi bünyemizde yürütülür.",
      stages: ["Ham ve boyalı kumaş kontrolü", "Serim ve kesim kontrolü", "Dikim öncesi ürün montajı", "Uzman ekiple final kontrol"],
    },
  ] as Chapter[],
  ctaTitle: "Birlikte üretelim",
  ctaText: "Koleksiyonunuzu hammaddeden teslimata kadar aynı özenle hayata geçirelim.",
  cta: "Bize ulaşın",
};

export type ProductionContent = typeof tr;

const en: ProductionContent = {
  meta: {
    title: "Production",
    description:
      "The highest standards in quality and service at every stage, from raw material to finished product: Gerber cutting, an experienced sewing team, a production network across Türkiye and in-house quality assurance.",
  },
  eyebrow: "Production",
  title: "Our production strength",
  lead: "From raw material to finished product — quality at every stage.",
  hq: "Production centre",
  facts: [
    { value: "30+", label: "Years of manufacturing" },
    { value: "50%", label: "Plain-fabric production" },
    { value: "Gerber", label: "Cutting system" },
    { value: "4", label: "Quality control stages" },
  ],
  chapters: [
    {
      image: "rawMaterial",
      title: "From raw material to finished product",
      text: "We guarantee our clients the highest standards in quality and service at every stage of production, from raw material to finished product. We are equipped with the most up-to-date technology to offer clients the best options and advantageous pricing, and we place a keen emphasis on keeping production lead times very short. All steps, from design to production through to delivery, are handled attentively by our experienced team, while we maintain solid communication with our clients.",
    },
    {
      image: "cutting",
      title: "Cutting",
      text: "Our cutting department uses Gerber to guarantee maximum throughput and accuracy. Since about 50% of our production consists of plain fabrics, we use hand motors to guarantee a defect-free process. We use fully automatic system cutters for every kind of fabric.",
    },
    {
      image: "sewing",
      title: "Sewing",
      text: "Thanks to our large number of experienced sewing machine operators, we produce high-quality, long-lasting products in the shortest possible time. You will be surprised to see how plain fabrics are transformed into a variety of specific products in a short time.",
    },
    {
      image: "craft",
      title: "Craftsmanship",
      text: "As a manufacturer for over 30 years, YEG is known for its impeccable craftsmanship, even with very delicate fabrics and intricate styles. We are proud to deliver unique work, even when it requires more labour-intensive production.",
    },
    {
      image: "network",
      title: "Production network",
      text: "We have a production team of experienced tailors and a growing number of privately owned subcontractors across Türkiye, each specialising in a different type of work. Our quality assurance department carries out regular checks on all subcontractors to ensure that every style fully matches the pre-production samples and YEG quality standards.",
    },
    {
      image: "quality",
      title: "Quality assurance",
      text: "Our quality assurance system consists of several comprehensive stages: raw and dyed fabric inspection, fabric spreading and cutting inspection, pre-sewing product assembly, and a final inspection by a team of qualified quality control specialists. All stages are carried out in-house to ensure full supervision and control over the products.",
      stages: ["Raw and dyed fabric inspection", "Spreading and cutting inspection", "Pre-sewing product assembly", "Final inspection by specialists"],
    },
  ],
  ctaTitle: "Let’s produce together",
  ctaText: "Let us bring your collection to life with the same care, from raw material to delivery.",
  cta: "Contact us",
};

const fr: ProductionContent = {
  meta: {
    title: "Production",
    description:
      "Les plus hauts standards de qualité et de service à chaque étape, de la matière première au produit fini : coupe Gerber, équipe couture expérimentée, réseau de production en Turquie et assurance qualité en interne.",
  },
  eyebrow: "Production",
  title: "Notre force de production",
  lead: "De la matière première au produit fini — la qualité à chaque étape.",
  hq: "Centre de production",
  facts: [
    { value: "30+", label: "Années de fabrication" },
    { value: "50 %", label: "Production en tissus unis" },
    { value: "Gerber", label: "Système de coupe" },
    { value: "4", label: "Étapes de contrôle qualité" },
  ],
  chapters: [
    {
      image: "rawMaterial",
      title: "De la matière première au produit fini",
      text: "Nous garantissons à nos clients les plus hauts standards de qualité et de service à chaque étape de la production, de la matière première au produit fini. Nous sommes équipés des technologies les plus récentes pour offrir à nos clients les meilleures options et des prix avantageux, et nous attachons une grande importance à des délais de production très courts. Toutes les étapes, de la conception à la production jusqu’à la livraison, sont suivies avec soin par notre équipe expérimentée, tout en maintenant une communication solide avec nos clients.",
    },
    {
      image: "cutting",
      title: "Coupe",
      text: "Notre département de coupe utilise Gerber pour garantir un rendement et une précision maximum. Environ 50 % de notre production étant constituée de tissus unis, nous utilisons des moteurs manuels pour garantir un processus sans défaut. Nous utilisons des systèmes de coupe entièrement automatiques pour tous les types de tissus.",
    },
    {
      image: "sewing",
      title: "Couture",
      text: "Grâce à nos nombreux opérateurs couture expérimentés, nous produisons des articles de grande qualité et durables dans les délais les plus courts. Vous serez surpris de voir comment de simples tissus se transforment en peu de temps en produits variés.",
    },
    {
      image: "craft",
      title: "Savoir-faire",
      text: "Fabricant depuis plus de 30 ans, YEG est reconnu pour la perfection de son savoir-faire, même sur des tissus très délicats et des modèles complexes. Nous sommes fiers de livrer des pièces uniques, même lorsqu’elles demandent davantage de travail.",
    },
    {
      image: "network",
      title: "Réseau de production",
      text: "Nous disposons d’une équipe de production composée de tailleurs expérimentés et d’un nombre croissant de sous-traitants privés répartis dans toute la Turquie, chacun spécialisé dans un type de travail différent. Notre service d’assurance qualité effectue des contrôles réguliers chez tous les sous-traitants afin de garantir que chaque modèle corresponde parfaitement aux échantillons de pré-production et aux standards de qualité YEG.",
    },
    {
      image: "quality",
      title: "Assurance qualité",
      text: "Notre système d’assurance qualité comprend plusieurs étapes complètes : contrôle des tissus écrus et teints, contrôle du matelassage et de la coupe, assemblage des produits avant couture, et inspection finale par une équipe de spécialistes qualifiés du contrôle qualité. Toutes les étapes sont réalisées en interne afin d’assurer une supervision et un contrôle complets des produits.",
      stages: ["Contrôle des tissus écrus et teints", "Contrôle du matelassage et de la coupe", "Assemblage avant couture", "Inspection finale par des spécialistes"],
    },
  ],
  ctaTitle: "Produisons ensemble",
  ctaText: "Donnons vie à votre collection avec le même soin, de la matière première à la livraison.",
  cta: "Nous contacter",
};

const content = { en, tr, fr };

export const getProduction = (lang: Locale) => content[lang];
/** All languages, the defaults the admin edits on top of */
export const productionContent = content;
