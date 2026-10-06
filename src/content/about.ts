import manifest from "@/data/media-manifest.json";
import type { Locale } from "@/i18n/config";
import { importedImage } from "./production";

const m = (key: keyof typeof manifest, position = "50% 50%") => {
  const x = manifest[key];
  return { url: x.src, width: x.width, height: x.height, blur: x.blur, position };
};

export const aboutImages = {
  hero: m("campaign/brick-wall-sky", "62% 40%"),
  portraitA: m("campaign/lounge-portrait", "50% 30%"),
  portraitB: m("campaign/studio-sky", "50% 25%"),
  night: m("campaign/alley-grey", "50% 40%"),
  dusk: m("texture/red-dusk", "50% 60%"),
  // The red-lit studio, cropped tall beside the "Who we are" text
  studio: importedImage("campaign/arge-studio", "55% 55%"),
  // One photo per production area (denim, knit, knitwear, woven)
  areaDenim: importedImage("production/sewing", "50% 45%"),
  areaKnit: importedImage("fabrics/knitting-floor", "50% 40%"),
  areaKnitwear: importedImage("production/raw-material", "60% 50%"),
  areaWoven: importedImage("production/cutting", "55% 40%"),
  // Faded full-width background of "Uluslararası Yapılanma" — uploaded in the admin (Hakkımızda → Görseller)
  global: null as ReturnType<typeof importedImage> | null,
};

/*
 * Copy notes
 * - *word* marks a red accent (rendered by components/about/Rich).
 * - Multi-line statements end lines with a space so the joined text reads correctly.
 * - Strings shown in uppercase settings that contain foreign names are pre-uppercased:
 *   CSS uppercase under lang="tr" would dot the I (TEXTİLE, FLORİDA).
 */
const tr = {
  meta: {
    title: "Hakkımızda",
    description:
      "YEG Textile, tekstil üretiminin farklı aşamalarında edindiği deneyimi bugün ürün geliştirme, üretim ve uluslararası iş ortaklıklarıyla bir arada yürüten Türkiye merkezli bir tekstil şirketidir.",
  },
  hero: {
    eyebrow: "YEG TEXTILE — DENİZLİ · İSTANBUL · FLORIDA · VANCOUVER",
    title: "Hakkımızda",
    imageAlt: "YEG Textile kampanya çekimi",
  },

  who: {
    title: ["Üretimi Bilen ", "Bir Şirket"],
    lead: "YEG Textile, tekstil üretiminin farklı aşamalarında edindiği deneyimi bugün ürün geliştirme, üretim ve uluslararası iş ortaklıklarıyla bir arada yürüten Türkiye merkezli bir tekstil şirketidir.",
    start:
      "Hikâyemizin başlangıcı *2012* yılına uzanıyor. Uluslararası Ticaret eğitiminin ardından aile atölyesinde çalışmaya başladık. İşe masa başından değil, üretimin içinden girdik. Kesim, dikim, kalite kontrol, sevkiyat… İşin nasıl yürüdüğünü sahada öğrendik.",
    founded: "*2016* yılında YEG Textile’i kurduk.",
    paragraphs: [
      "İlk ihracatımızı Fransa’ya çocuk giyim ürünleriyle gerçekleştirdik. Sonrasında farklı ürün grupları, farklı ülkeler ve farklı beklentilerle karşılaştık. Her proje, üretim tarafında olduğu kadar iş yapma biçimimizde de yeni bir deneyim bıraktı.",
      "Bugün geldiğimiz noktada YEG Textile, bir markanın ihtiyacını sadece üretim aşamasında karşılayan bir firma olmaktan çıktı. Ürünün fikrinden numunesine, kumaşından üretimine kadar sürecin içinde yer alan bir iş ortağı olarak çalışıyoruz.",
    ],
  },

  story: {
    title: ["Üretimin İçinden ", "Gelen Bir Tecrübe"],
    intro: "YEG’in bugününü anlamak için başlangıç noktamıza bakmak yeterli.",
    steps: [
      "Üretimin içinde olmak bize tekstilin yalnızca kumaş, kalıp ve makinelerden ibaret olmadığını öğretti. Bir ürünün zamanında çıkması, doğru kumaşın bulunması, numunenin beklentiyi karşılaması, üretimde yaşanan bir problemin zamanında paylaşılması… Bunların hepsi aynı işin parçası.",
      "İlk ihracatımızın ardından farklı pazarlardan gelen taleplerle birlikte üretim kabiliyetimizi genişlettik.",
      "Bir sipariş geldiğinde onu sadece üretilecek bir adet olarak görmedik. Nerede kullanılacağını, nasıl bir ürün beklendiğini, hangi pazara gideceğini ve üretim sırasında nelere dikkat edilmesi gerektiğini anlamaya çalıştık.",
      "YEG Textile’in bugün sahip olduğu üretim kültürü de büyük ölçüde bu yılların birikiminden oluştu.",
    ],
    emphasis: "İşi büyütürken önce *işin kendisini* öğrenmeye devam ettik.",
  },

  brand: {
    title: ["Üretimin Arkasında ", "Bir Marka Duruşu"],
    intro: [
      "YEG Textile’in şirket yapısı ile marka yaklaşımı birbirinden ayrı iki konu değil.",
      "Üretim tarafında kaliteye, teknik bilgiye ve güvenilirliğe verdiğimiz önem; markanın nasıl görünmesi gerektiğine dair bakışımızı da şekillendiriyor.",
    ],
    crowd: "Bugün moda dünyasında çok fazla marka var. Çok fazla ürün, çok fazla iletişim, çok fazla benzerlik…",
    selective: "YEG ise bu kalabalığın içinde daha seçici bir yerde durmayı hedefliyor.",
    slogan: ["YEG Textile — ", "Herkes için *değil.*"],
    audience: [
      "Buradaki “herkes”, ulaşılması gereken bir kitleyi değil; YEG’in hitap ettiği insanın bakışını ifade ediyor.",
      "Bir ürünü sadece satın aldığı için değil, kendisiyle bir bağ kurduğu için tercih eden insanlar.",
    ],
    ownLine: "Kendine ait bir çizgisi olanlar.",
    stance: ["Bir satın alma değil, ", "*bir duruş*"],
    outro:
      "Bu bakış, YEG’in görsel dünyasından ürün seçimlerine ve iletişim diline kadar markanın farklı temas noktalarında kendini göstermesi için tasarlanıyor.",
  },

  company: {
    title: ["Markanın Arkasında Güçlü ", "Bir Üretim Yapısı Var"],
    intro: "Marka tarafında nasıl bir duruşumuz varsa, üretim tarafında da bunun karşılığını oluşturmak gerekiyor.",
    strength: "YEG Textile’in gücü burada başlıyor.",
    paragraphs: [
      "Denim, örme, triko ve dokuma ürün gruplarında üretim yapıyor; farklı ölçekteki markaların koleksiyon ihtiyaçlarına göre çalışıyoruz.",
      "Numune geliştirmeden kumaş tedariğine, üretim planlamasından kalite kontrole ve sevkiyata kadar sürecin farklı aşamalarını birlikte yönetiyoruz.",
    ],
    before: ["Müşterinin tasarımını alıp üretmek elbette işin bir parçası.", "Ama çoğu zaman süreç bundan önce başlıyor."],
    questions: [
      "Kumaş bunu kaldırır mı?",
      "Bu yıkama nasıl sonuç verir?",
      "Bu ürün bu maliyetle üretilebilir mi?",
      "Numuneyi nasıl daha hızlı çıkarabiliriz?",
      "Üretimde aynı sonucu tekrar nasıl alırız?",
    ],
    outro: "Bizim Ar-Ge ve ürün geliştirme yaklaşımımız biraz da bu soruların etrafında şekilleniyor.",
  },

  capacity: {
    title: ["YEG TEXTILE’in farklı ürün gruplarındaki ", "aylık üretim kapasitesi:"],
    unit: "adet",
    stats: [
      { value: "300.000", label: "T-Shirt" },
      { value: "150.000", label: "Gömlek & Dokuma Ürünler" },
      { value: "100.000", label: "Hoodie & Sweatshirt" },
      { value: "100.000", label: "Denim Pantolon & Ceket" },
      { value: "100.000", label: "Triko" },
    ],
    paragraphs: [
      "Bu rakamların arkasında yalnızca üretim hattı bulunmuyor.",
      "Planlama, tedarik, numune, kalite kontrol, üretim takibi ve sevkiyatın birbirine bağlı ilerlemesi gerekiyor.",
      "Özellikle yüksek adetli işlerde küçük bir aksaklığın bütün takvimi etkileyebildiğini biliyoruz.",
    ],
    emphasis: "Bu nedenle kapasite kadar önemli gördüğümüz konu, o kapasiteyi *doğru zamanda* ve *doğru organizasyonla* kullanabilmek.",
  },

  areas: {
    title: ["Farklı Ürünler, ", "Tek Bir Üretim Disiplini"],
    items: [
      { name: "DENIM", lines: ["Pantolon, ceket ve şort üretimi.", "Vintage, kirli yıkama ve ekolojik yıkama uygulamaları."] },
      {
        name: "ÖRME",
        lines: ["T-Shirt, sweatshirt ve hoodie.", "Jersey, fleece ve interlok kumaşlarla farklı ürün ve gramaj ihtiyaçlarına yönelik üretim."],
      },
      { name: "TRİKO", lines: ["İnce ve kalın gauge üretim kabiliyeti.", "Kazak, hırka ve farklı triko ürünleri."] },
      { name: "DOKUMA", lines: ["Gömlek ve dokuma dış giyim ürünleri."] },
    ],
    outro:
      "Farklı ürün gruplarında çalışmak bize yalnızca daha geniş bir üretim alanı sağlamıyor. Aynı zamanda farklı kumaşları, teknikleri ve üretim ihtiyaçlarını birlikte değerlendirebilme imkânı veriyor.",
  },

  identity: {
    title: ["Duruşun Bir Görsel ", "Karşılığı Olmalı"],
    intro: "YEG’in marka dünyasında gereksiz hiçbir şeyin yer almamasını istiyoruz.",
    colors:
      "Siyah, kemik beyazı, kırmızı ve asit sarı-yeşil gibi kontrollü renk kullanımları; güçlü tipografi ve sade grafik yapı ile birlikte markanın daha sert ve belirgin bir karakter oluşturmasını sağlıyor.",
    palette: ["Siyah", "Kemik beyazı", "Kırmızı", "Asit sarı-yeşil"],
    aim: "Buradaki amaç dikkat çekmek için her şeyi aynı anda kullanmak değil.",
    opposite: "Tam tersine, neyin kullanılmayacağını bilmek.",
    slogan: ["Süsleme yok. ", "Sadece *isim.*"],
    surfaces:
      "Bu anlayış; ambalajdan kartvizite, dijital iletişimden ürün etiketlerine kadar markanın temas ettiği farklı yüzeylerde aynı çizginin korunmasını hedefliyor.",
    places: ["Sokakta. ", "*Gecede.* ", "İçeride."],
    outro: "YEG’in dili, nerede karşılaşılırsa karşılaşılsın kendini belli etmeli.",
    imageAlt: "Gece, sokakta YEG Textile kampanya karesi",
  },

  quality: {
    title: ["Kalite Son Kontrolde ", "Başlamaz"],
    paragraphs: [
      "Bir ürünün kaliteli olup olmadığını üretimin sonunda görmek yerine, bunu üretimin başından itibaren kontrol altında tutmaya çalışıyoruz.",
      "Kumaş seçiminden numuneye, kesimden dikime, yıkamadan paketlemeye kadar farklı aşamalarda kontroller gerçekleştiriliyor.",
    ],
    purpose: "Bu sistemin amacı yalnızca hatayı bulmak değil. *Mümkün olduğunca erken fark etmek.*",
    certsIntro: "YEG Textile’in sahip olduğu yönetim sistemleri ve sertifikasyonlar bu çalışma disiplinini destekliyor:",
    certs: [
      { code: "ISO 9001:2015", label: "Kalite Yönetim Sistemi" },
      { code: "ISO 14001:2015", label: "Çevre Yönetim Sistemi" },
      { code: "ISO 45001:2018", label: "İş Sağlığı ve Güvenliği Yönetim Sistemi" },
      { code: "ISO 10002:2018", label: "Müşteri Memnuniyeti Yönetim Sistemi" },
      { code: "GMP", label: "İyi Üretim Uygulamaları" },
      { code: "OEKO-TEX", label: "Standard 100" },
    ],
    outro: "Bunun yanında organik ve geri dönüştürülmüş kumaş seçenekleri ile ekolojik yıkama teknikleri üzerinde de çalışıyoruz.",
  },

  conduct: {
    title: ["Verdiğimiz Sözün ", "Arkasında Durmak"],
    lead: "Bir üretim işinde güven, ilk siparişte değil; süreç boyunca oluşuyor.",
    commitments: [
      "Numune zamanında çıkmadığında bunu söylemek.",
      "Üretimde bir problem varsa saklamamak.",
      "Termin konusunda gerçekçi olmak.",
      "Bir şey değiştiğinde müşteriyi son anda değil, mümkün olduğunca erken bilgilendirmek.",
    ],
    honesty: "Bizim için dürüstlük biraz da burada başlıyor.",
    easy: "Her şeyin kusursuz ilerleyeceğini söylemek kolay.",
    matters: "Asıl önemli olan, bir problem çıktığında ne yaptığınız.",
    paragraphs: [
      "YEG Textile olarak müşterilerimizle açık iletişim kurmaya ve sorunların karşılıklı olarak çözülebileceği bir çalışma ortamı oluşturmaya önem veriyoruz.",
      "Çünkü uzun süre birlikte çalışabileceğiniz bir iş ortağında aradığınız şey yalnızca iyi üretim değildir.",
    ],
    emphasis: "*Ne zaman ne söyleyeceğini* bilen bir ekip de gerekir.",
  },

  global: {
    title: ["Türkiye’den ", "Dünyaya"],
    intro: ["YEG Textile’in üretim merkezi Türkiye’de.", "Ancak çalışma alanımız Türkiye ile sınırlı değil."],
    milestones: [
      "*2022* yılında İstanbul’daki yapılanmamızı güçlendirdik. Daha geniş bir tedarik ağına ve teknik altyapıya erişimimizi artırdık.",
      "*2026* yılında ise Amerika Birleşik Devletleri’nin Florida eyaletinde GLOBAL YEG LLC yapılanmasını oluşturduk.",
    ],
    today: "Bugün farklı operasyon noktalarımızla müşterilerimize daha yakın bir çalışma modeli kuruyoruz.",
    locations: [
      { city: "Denizli", country: "Türkiye", role: "Üretim ve ana operasyon", lang: "tr" },
      { city: "İstanbul", country: "Türkiye", role: "Üretim ve tedarik ağı", lang: "tr" },
      { city: "Florida", country: "USA", role: "Uluslararası ticari yapılanma", lang: "en" },
      { city: "Vancouver", country: "Canada", role: "Uluslararası operasyon", lang: "en" },
    ],
    outro: "Türkiye’deki üretim gücümüzü, farklı pazarlardaki ticari yapılanmamızla birlikte büyütmeye devam ediyoruz.",
  },

  future: {
    title: ["Daha Fazlasını Üretmekten Önce, ", "*Daha İyisini* Üretmek"],
    paragraphs: [
      "YEG Textile’in önünde büyüyen bir pazar ve geliştirmeye devam ettiğimiz bir yapı var.",
      "Üretim kapasitemizi artırırken ürün geliştirme tarafını da güçlendirmek, yeni teknolojileri üretim süreçlerine dahil etmek, tedarik ağımızı genişletmek ve uluslararası operasyonlarımızı daha etkin hale getirmek istiyoruz.",
    ],
    grow: "Bunu hızlı büyümek için değil, *doğru büyümek* için yapıyoruz.",
    measure: "Çünkü bizim için iyi bir şirket olmak yalnızca daha fazla üretmekle ölçülmüyor.",
    goals: [
      "Daha iyi ürün geliştirmek.",
      "Daha sağlıklı süreçler kurmak.",
      "Müşterinin işini kolaylaştırmak.",
      "Ve yıllar sonra hâlâ aynı güvenle birlikte çalışabilmek.",
    ],
    final: ["Asıl hedefimiz ", "*bu.*"],
  },

  capabilities: ["Tasarım", "Kalıp", "Numune", "Üretim", "Kalite kontrol", "Fason üretim"],
  ctaTitle: "Birlikte çalışalım",
  ctaText: "Tek bir koleksiyondan tam bir sezon serisine kadar, koleksiyonunuzu fikirden teslimata taşıyabiliriz.",
  cta: "Stüdyoyla iletişime geçin",
};

export type AboutContent = typeof tr;

const en: AboutContent = {
  meta: {
    title: "About us",
    description:
      "YEG Textile is a Türkiye-based textile company that today brings the experience it has gained across the different stages of textile production together with product development, manufacturing and international partnerships.",
  },
  hero: {
    eyebrow: "YEG Textile — Denizli · Istanbul · Florida · Vancouver",
    title: "About us",
    imageAlt: "YEG Textile campaign image",
  },

  who: {
    title: ["A Company That ", "Knows Production"],
    lead: "YEG Textile is a Türkiye-based textile company that today brings the experience it has gained across the different stages of textile production together with product development, manufacturing and international partnerships.",
    start:
      "Our story goes back to *2012*. After studying International Trade, we started working in the family workshop. We didn’t enter the business from behind a desk, but from inside production. Cutting, sewing, quality control, shipping… We learned how the work gets done on the floor.",
    founded: "In *2016*, we founded YEG Textile.",
    paragraphs: [
      "We made our first export to France, with childrenswear. After that we met different product groups, different countries and different expectations. Every project left us with new experience — in the way we do business as much as on the production side.",
      "Where we stand today, YEG Textile is no longer a company that meets a brand’s needs only at the production stage. We work as a partner involved throughout the process — from a product’s idea to its sample, from its fabric to its production.",
    ],
  },

  story: {
    title: ["Experience From ", "Inside Production"],
    intro: "To understand YEG today, it is enough to look at where we started.",
    steps: [
      "Being inside production taught us that textiles are not just fabric, patterns and machines. A product leaving on time, finding the right fabric, a sample meeting expectations, a production problem being shared in time… All of these are part of the same job.",
      "After our first export, as requests came in from different markets, we expanded our production capabilities.",
      "When an order came in, we never saw it as just a quantity to be produced. We tried to understand where it would be used, what kind of product was expected, which market it was going to and what needed attention during production.",
      "The production culture YEG Textile has today was largely built from the experience of those years.",
    ],
    emphasis: "As we grew the business, we kept learning *the work itself* first.",
  },

  brand: {
    title: ["A Brand Stance ", "Behind the Production"],
    intro: [
      "YEG Textile’s company structure and its brand approach are not two separate subjects.",
      "The importance we give to quality, technical knowledge and reliability on the production side also shapes how we think the brand should look.",
    ],
    crowd: "Today the fashion world has a great many brands. Too many products, too much communication, too much sameness…",
    selective: "YEG, on the other hand, aims to stand in a more selective place within that crowd.",
    slogan: ["YEG Textile — ", "Not for *everyone.*"],
    audience: [
      "The “everyone” here is not an audience to be reached; it describes the outlook of the person YEG speaks to.",
      "People who choose a product not simply because they bought it, but because they formed a bond with it.",
    ],
    ownLine: "Those who have a line of their own.",
    stance: ["Not a purchase — ", "*a stance*"],
    outro:
      "This outlook is designed to show itself across the brand’s different touchpoints — from YEG’s visual world to its product choices and its language of communication.",
  },

  company: {
    title: ["Behind the Brand, ", "a Strong Production Structure"],
    intro: "Whatever stance we hold on the brand side needs a counterpart on the production side.",
    strength: "This is where YEG Textile’s strength begins.",
    paragraphs: [
      "We manufacture across denim, jersey knit, knitwear and woven product groups, working to the collection needs of brands of every size.",
      "From sample development to fabric sourcing, from production planning to quality control and shipping, we manage the different stages of the process together.",
    ],
    before: ["Taking a customer’s design and producing it is, of course, part of the job.", "But most of the time, the process starts before that."],
    questions: [
      "Can the fabric take this?",
      "How will this wash turn out?",
      "Can this product be made at this cost?",
      "How can we get the sample out faster?",
      "How do we get the same result again in production?",
    ],
    outro: "Our R&D and product development approach is shaped, in part, around these questions.",
  },

  capacity: {
    title: ["YEG TEXTILE’s monthly production capacity ", "across product groups:"],
    unit: "units",
    stats: [
      { value: "300,000", label: "T-Shirts" },
      { value: "150,000", label: "Shirts & Woven Products" },
      { value: "100,000", label: "Hoodies & Sweatshirts" },
      { value: "100,000", label: "Denim Trousers & Jackets" },
      { value: "100,000", label: "Knitwear" },
    ],
    paragraphs: [
      "Behind these figures there is more than a production line.",
      "Planning, sourcing, sampling, quality control, production tracking and shipping all have to move forward in step with one another.",
      "We know that, especially on high-volume work, one small disruption can affect the entire schedule.",
    ],
    emphasis: "That is why what we consider as important as capacity is being able to use it *at the right time* and *with the right organisation.*",
  },

  areas: {
    title: ["Different Products, ", "One Production Discipline"],
    items: [
      { name: "DENIM", lines: ["Trousers, jackets and shorts.", "Vintage, dirty-wash and eco-wash applications."] },
      {
        name: "KNIT",
        lines: ["T-shirts, sweatshirts and hoodies.", "Production in jersey, fleece and interlock fabrics for different product and fabric-weight needs."],
      },
      { name: "KNITWEAR", lines: ["Fine and coarse gauge production capability.", "Sweaters, cardigans and other knitwear products."] },
      { name: "WOVEN", lines: ["Shirts and woven outerwear."] },
    ],
    outro:
      "Working across different product groups doesn’t only give us a wider production scope. It also lets us weigh different fabrics, techniques and production needs together.",
  },

  identity: {
    title: ["A Stance Needs ", "a Visual Counterpart"],
    intro: "We want nothing unnecessary in YEG’s brand world.",
    colors:
      "A controlled use of colour — black, bone white, red and acid yellow-green — together with strong typography and a plain graphic structure lets the brand build a harder, more distinct character.",
    palette: ["Black", "Bone white", "Red", "Acid yellow-green"],
    aim: "The aim is not to use everything at once to get attention.",
    opposite: "Quite the opposite: knowing what not to use.",
    slogan: ["No ornament. ", "Just the *name.*"],
    surfaces:
      "This approach aims to keep the same line across every surface the brand touches — from packaging to business cards, from digital communication to product labels.",
    places: ["On the street. ", "*At night.* ", "Inside."],
    outro: "Wherever it is encountered, YEG’s language should make itself known.",
    imageAlt: "YEG Textile campaign frame, at night on the street",
  },

  quality: {
    title: ["Quality Doesn’t Start ", "at the Final Check"],
    paragraphs: [
      "Rather than finding out at the end of production whether a product is good, we try to keep it under control from the very beginning.",
      "Checks are carried out at different stages — from fabric selection to sampling, from cutting to sewing, from washing to packing.",
    ],
    purpose: "The purpose of this system isn’t only to find mistakes. *It is to notice them as early as possible.*",
    certsIntro: "The management systems and certifications held by YEG Textile support this way of working:",
    certs: [
      { code: "ISO 9001:2015", label: "Quality Management System" },
      { code: "ISO 14001:2015", label: "Environmental Management System" },
      { code: "ISO 45001:2018", label: "Occupational Health and Safety Management System" },
      { code: "ISO 10002:2018", label: "Customer Satisfaction Management System" },
      { code: "GMP", label: "Good Manufacturing Practice" },
      { code: "OEKO-TEX", label: "Standard 100" },
    ],
    outro: "Alongside this, we are working on organic and recycled fabric options and on eco-friendly washing techniques.",
  },

  conduct: {
    title: ["Standing Behind ", "Our Word"],
    lead: "In production work, trust isn’t formed with the first order; it builds throughout the process.",
    commitments: [
      "Saying so when a sample isn’t ready on time.",
      "Not hiding a problem in production.",
      "Being realistic about lead times.",
      "When something changes, telling the customer as early as possible — not at the last minute.",
    ],
    honesty: "For us, honesty starts, in part, right here.",
    easy: "It’s easy to say everything will go perfectly.",
    matters: "What really matters is what you do when a problem comes up.",
    paragraphs: [
      "As YEG Textile, we value open communication with our customers and a working environment where problems can be solved together.",
      "Because what you look for in a partner you can work with for years isn’t only good production.",
    ],
    emphasis: "You also need a team that knows *what to say, and when.*",
  },

  global: {
    title: ["From Türkiye ", "to the World"],
    intro: ["YEG Textile’s production centre is in Türkiye.", "But our field of work isn’t limited to Türkiye."],
    milestones: [
      "In *2022*, we strengthened our set-up in Istanbul, widening our access to a larger supply network and technical infrastructure.",
      "In *2026*, we established GLOBAL YEG LLC in the state of Florida, United States.",
    ],
    today: "Today, with our different operating locations, we are building a way of working that keeps us closer to our customers.",
    locations: [
      { city: "Denizli", country: "Türkiye", role: "Production and main operations", lang: "en" },
      { city: "Istanbul", country: "Türkiye", role: "Production and supply network", lang: "en" },
      { city: "Florida", country: "USA", role: "International commercial structure", lang: "en" },
      { city: "Vancouver", country: "Canada", role: "International operations", lang: "en" },
    ],
    outro: "We continue to grow our production strength in Türkiye together with our commercial presence in different markets.",
  },

  future: {
    title: ["Before Producing More, ", "Producing *Better*"],
    paragraphs: [
      "Ahead of YEG Textile lie a growing market and a structure we keep developing.",
      "As we increase our production capacity, we want to strengthen product development, bring new technologies into our production processes, widen our supply network and make our international operations more effective.",
    ],
    grow: "We are doing this not to grow fast, but to *grow right.*",
    measure: "Because for us, being a good company isn’t measured only by producing more.",
    goals: [
      "Developing better products.",
      "Building healthier processes.",
      "Making our customers’ work easier.",
      "And, years from now, still working together with the same trust.",
    ],
    final: ["That is our real ", "*goal.*"],
  },

  capabilities: ["Design", "Pattern making", "Sampling", "Production", "Quality control", "Private label"],
  ctaTitle: "Work with us",
  ctaText: "From a single collection to a full seasonal range, we can take your collection from idea to delivery.",
  cta: "Contact the studio",
};

const fr: AboutContent = {
  meta: {
    title: "À propos",
    description:
      "YEG Textile est une entreprise textile basée en Turquie qui réunit aujourd’hui l’expérience acquise aux différentes étapes de la production textile avec le développement produit, la fabrication et des partenariats internationaux.",
  },
  hero: {
    eyebrow: "YEG Textile — Denizli · Istanbul · Floride · Vancouver",
    title: "À propos",
    imageAlt: "Image de campagne YEG Textile",
  },

  who: {
    title: ["Une entreprise ", "qui connaît la production"],
    lead: "YEG Textile est une entreprise textile basée en Turquie qui réunit aujourd’hui l’expérience acquise aux différentes étapes de la production textile avec le développement produit, la fabrication et des partenariats internationaux.",
    start:
      "Notre histoire remonte à *2012*. Après des études de commerce international, nous avons commencé à travailler dans l’atelier familial. Nous ne sommes pas entrés dans le métier par un bureau, mais par l’intérieur de la production. Coupe, couture, contrôle qualité, expédition… Nous avons appris sur le terrain comment le travail se fait.",
    founded: "En *2016*, nous avons fondé YEG Textile.",
    paragraphs: [
      "Notre première exportation s’est faite vers la France, avec des vêtements pour enfants. Nous avons ensuite rencontré d’autres familles de produits, d’autres pays et d’autres attentes. Chaque projet nous a laissé une nouvelle expérience — dans notre façon de travailler autant que du côté de la production.",
      "Aujourd’hui, YEG Textile n’est plus une entreprise qui répond aux besoins d’une marque uniquement au stade de la production. Nous travaillons comme un partenaire présent tout au long du processus — de l’idée du produit à son échantillon, de son tissu à sa fabrication.",
    ],
  },

  story: {
    title: ["Une expérience née ", "au cœur de la production"],
    intro: "Pour comprendre YEG aujourd’hui, il suffit de regarder notre point de départ.",
    steps: [
      "Être au cœur de la production nous a appris que le textile ne se résume pas au tissu, aux patrons et aux machines. Un produit livré à temps, le bon tissu trouvé, un échantillon à la hauteur des attentes, un problème de production partagé au bon moment… Tout cela fait partie du même métier.",
      "Après notre première exportation, au fil des demandes venues de différents marchés, nous avons élargi nos capacités de production.",
      "Lorsqu’une commande arrivait, nous ne la voyions jamais comme une simple quantité à produire. Nous cherchions à comprendre où le produit serait utilisé, ce qui était attendu, vers quel marché il partait et à quoi il fallait prêter attention pendant la production.",
      "La culture de production de YEG Textile s’est en grande partie construite sur l’expérience de ces années.",
    ],
    emphasis: "En faisant grandir l’entreprise, nous avons continué d’apprendre *le métier lui-même* en premier.",
  },

  brand: {
    title: ["Une posture de marque ", "derrière la production"],
    intro: [
      "La structure de l’entreprise YEG Textile et son approche de marque ne sont pas deux sujets distincts.",
      "L’importance que nous accordons à la qualité, au savoir-faire technique et à la fiabilité côté production façonne aussi notre vision de ce à quoi la marque doit ressembler.",
    ],
    crowd: "Aujourd’hui, le monde de la mode compte énormément de marques. Trop de produits, trop de communication, trop de ressemblances…",
    selective: "YEG, au contraire, veut se tenir à une place plus sélective au sein de cette foule.",
    slogan: ["YEG Textile — ", "Pas pour *tout le monde.*"],
    audience: [
      "Ce « tout le monde » ne désigne pas un public à atteindre ; il exprime le regard de la personne à qui YEG s’adresse.",
      "Des personnes qui choisissent un produit non pas simplement parce qu’elles l’ont acheté, mais parce qu’elles ont créé un lien avec lui.",
    ],
    ownLine: "Celles et ceux qui ont leur propre ligne.",
    stance: ["Pas un achat, ", "*une posture*"],
    outro:
      "Cette vision est pensée pour s’exprimer à travers les différents points de contact de la marque — de l’univers visuel de YEG à ses choix de produits et à son langage de communication.",
  },

  company: {
    title: ["Derrière la marque, ", "une solide structure de production"],
    intro: "Quelle que soit la posture que nous défendons côté marque, elle doit trouver son équivalent côté production.",
    strength: "C’est ici que commence la force de YEG Textile.",
    paragraphs: [
      "Nous produisons dans les familles denim, maille jersey, tricot et chaîne et trame, et travaillons selon les besoins de collection de marques de toutes tailles.",
      "Du développement des échantillons à l’approvisionnement en tissus, de la planification de la production au contrôle qualité et à l’expédition, nous gérons ensemble les différentes étapes du processus.",
    ],
    before: ["Prendre le design d’un client et le produire fait bien sûr partie du métier.", "Mais la plupart du temps, le processus commence avant."],
    questions: [
      "Le tissu peut-il supporter cela ?",
      "Quel résultat donnera ce lavage ?",
      "Ce produit peut-il être fabriqué à ce coût ?",
      "Comment sortir l’échantillon plus vite ?",
      "Comment obtenir à nouveau le même résultat en production ?",
    ],
    outro: "Notre approche R&D et développement produit se construit en partie autour de ces questions.",
  },

  capacity: {
    title: ["Capacité de production mensuelle de YEG TEXTILE ", "par famille de produits :"],
    unit: "pièces",
    stats: [
      { value: "300 000", label: "T-shirts" },
      { value: "150 000", label: "Chemises et produits chaîne et trame" },
      { value: "100 000", label: "Hoodies et sweatshirts" },
      { value: "100 000", label: "Pantalons et vestes en denim" },
      { value: "100 000", label: "Tricot" },
    ],
    paragraphs: [
      "Derrière ces chiffres, il n’y a pas qu’une ligne de production.",
      "Planification, approvisionnement, échantillonnage, contrôle qualité, suivi de production et expédition doivent avancer de façon coordonnée.",
      "Nous savons que, surtout sur les gros volumes, un petit incident peut affecter tout le calendrier.",
    ],
    emphasis: "C’est pourquoi ce que nous jugeons aussi important que la capacité, c’est de pouvoir l’utiliser *au bon moment* et *avec la bonne organisation.*",
  },

  areas: {
    title: ["Des produits différents, ", "une seule discipline de production"],
    items: [
      { name: "DENIM", lines: ["Pantalons, vestes et shorts.", "Délavages vintage, effet sale et lavages écologiques."] },
      {
        name: "MAILLE",
        lines: ["T-shirts, sweatshirts et hoodies.", "Production en jersey, molleton et interlock selon les besoins de produit et de grammage."],
      },
      { name: "TRICOT", lines: ["Capacité de production en jauges fines et épaisses.", "Pulls, cardigans et autres articles en tricot."] },
      { name: "CHAÎNE ET TRAME", lines: ["Chemises et vêtements d’extérieur tissés."] },
    ],
    outro:
      "Travailler sur différentes familles de produits ne nous offre pas seulement un champ de production plus large. Cela nous permet aussi d’évaluer ensemble différents tissus, techniques et besoins de production.",
  },

  identity: {
    title: ["Une posture doit avoir ", "son équivalent visuel"],
    intro: "Nous voulons que rien de superflu n’ait sa place dans l’univers de marque de YEG.",
    colors:
      "Un usage maîtrisé de la couleur — noir, blanc os, rouge et jaune-vert acide — associé à une typographie forte et une structure graphique épurée permet à la marque d’affirmer un caractère plus dur et plus marqué.",
    palette: ["Noir", "Blanc os", "Rouge", "Jaune-vert acide"],
    aim: "Le but n’est pas de tout utiliser en même temps pour attirer l’attention.",
    opposite: "Au contraire : savoir ce qu’il ne faut pas utiliser.",
    slogan: ["Aucun ornement. ", "Juste le *nom.*"],
    surfaces:
      "Cette approche vise à préserver la même ligne sur toutes les surfaces que touche la marque — de l’emballage aux cartes de visite, de la communication digitale aux étiquettes produits.",
    places: ["Dans la rue. ", "*La nuit.* ", "À l’intérieur."],
    outro: "Où qu’on le rencontre, le langage de YEG doit se faire reconnaître.",
    imageAlt: "Image de campagne YEG Textile, la nuit dans la rue",
  },

  quality: {
    title: ["La qualité ne commence pas ", "au contrôle final"],
    paragraphs: [
      "Plutôt que de découvrir à la fin de la production si un produit est de qualité, nous essayons de la maîtriser dès le début.",
      "Des contrôles sont réalisés à différentes étapes — du choix du tissu à l’échantillon, de la coupe à la couture, du lavage à l’emballage.",
    ],
    purpose: "Le but de ce système n’est pas seulement de trouver les erreurs. *C’est de les repérer le plus tôt possible.*",
    certsIntro: "Les systèmes de management et certifications détenus par YEG Textile soutiennent cette discipline de travail :",
    certs: [
      { code: "ISO 9001:2015", label: "Système de management de la qualité" },
      { code: "ISO 14001:2015", label: "Système de management environnemental" },
      { code: "ISO 45001:2018", label: "Système de management de la santé et de la sécurité au travail" },
      { code: "ISO 10002:2018", label: "Système de management de la satisfaction client" },
      { code: "GMP", label: "Bonnes pratiques de fabrication" },
      { code: "OEKO-TEX", label: "Standard 100" },
    ],
    outro: "Nous travaillons également sur des options de tissus biologiques et recyclés, ainsi que sur des techniques de lavage écologiques.",
  },

  conduct: {
    title: ["Tenir ", "la parole donnée"],
    lead: "Dans un travail de production, la confiance ne naît pas à la première commande ; elle se construit tout au long du processus.",
    commitments: [
      "Le dire quand un échantillon n’est pas prêt à temps.",
      "Ne pas cacher un problème de production.",
      "Être réaliste sur les délais.",
      "Quand quelque chose change, prévenir le client le plus tôt possible — pas au dernier moment.",
    ],
    honesty: "Pour nous, l’honnêteté commence aussi un peu ici.",
    easy: "Il est facile de dire que tout se passera parfaitement.",
    matters: "Ce qui compte vraiment, c’est ce que vous faites quand un problème survient.",
    paragraphs: [
      "Chez YEG Textile, nous tenons à une communication ouverte avec nos clients et à un environnement de travail où les problèmes se résolvent ensemble.",
      "Car ce que l’on recherche chez un partenaire avec qui travailler longtemps, ce n’est pas seulement une bonne production.",
    ],
    emphasis: "Il faut aussi une équipe qui sait *quoi dire, et quand.*",
  },

  global: {
    title: ["De la Turquie ", "au monde"],
    intro: ["Le centre de production de YEG Textile se trouve en Turquie.", "Mais notre champ d’action ne se limite pas à la Turquie."],
    milestones: [
      "En *2022*, nous avons renforcé notre structure à Istanbul et élargi notre accès à un réseau d’approvisionnement et à une infrastructure technique plus vastes.",
      "En *2026*, nous avons créé GLOBAL YEG LLC dans l’État de Floride, aux États-Unis.",
    ],
    today: "Aujourd’hui, avec nos différents sites d’opération, nous construisons un modèle de travail plus proche de nos clients.",
    locations: [
      { city: "Denizli", country: "Turquie", role: "Production et opérations principales", lang: "fr" },
      { city: "Istanbul", country: "Turquie", role: "Production et réseau d’approvisionnement", lang: "fr" },
      { city: "Floride", country: "USA", role: "Structure commerciale internationale", lang: "fr" },
      { city: "Vancouver", country: "Canada", role: "Opérations internationales", lang: "fr" },
    ],
    outro: "Nous continuons de faire grandir notre force de production en Turquie avec notre structure commerciale sur différents marchés.",
  },

  future: {
    title: ["Avant de produire plus, ", "produire *mieux*"],
    paragraphs: [
      "Devant YEG Textile s’ouvrent un marché en croissance et une structure que nous continuons de développer.",
      "Tout en augmentant notre capacité de production, nous voulons renforcer le développement produit, intégrer de nouvelles technologies à nos processus, élargir notre réseau d’approvisionnement et rendre nos opérations internationales plus efficaces.",
    ],
    grow: "Nous ne le faisons pas pour grandir vite, mais pour *grandir juste.*",
    measure: "Car pour nous, être une bonne entreprise ne se mesure pas seulement au fait de produire davantage.",
    goals: [
      "Développer de meilleurs produits.",
      "Construire des processus plus sains.",
      "Faciliter le travail de nos clients.",
      "Et, des années plus tard, travailler encore ensemble avec la même confiance.",
    ],
    final: ["Voilà notre véritable ", "*objectif.*"],
  },

  capabilities: ["Design", "Patronage", "Échantillonnage", "Production", "Contrôle qualité", "Marque privée"],
  ctaTitle: "Travaillons ensemble",
  ctaText: "D’une simple collection à une gamme saisonnière complète, nous pouvons accompagner votre collection de l’idée à la livraison.",
  cta: "Contacter le studio",
};

const content = { en, tr, fr };

export const getAbout = (lang: Locale) => content[lang];
/** All languages, the defaults the admin edits on top of */
export const aboutContent = content;
