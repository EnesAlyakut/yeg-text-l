import type { Locale } from "@/i18n/config";
import type { FabricSlug } from "./fabrics";

/**
 * Detail copy for each fabric page (/fabrics/[slug]). The source site only listed titles and materials,
 * so this is general textile knowledge written for YEG — no company-specific figures (weights, MOQ, lead times).
 * `materialNotes` follows the order of the fabric's `materials` in fabrics.ts.
 */
export type FabricDetail = {
  structure: string;
  lead: string;
  body: string[];
  features: { title: string; text: string }[];
  uses: string[];
  materialNotes: string[];
  finishes: string[];
};

type DetailLabels = {
  back: string;
  view: string;
  structure: string;
  group: string;
  overview: string;
  features: string;
  materials: string;
  uses: string;
  finishes: string;
  finishesNote: string;
  prev: string;
  next: string;
  related: string;
  sampleTitle: string;
  sampleText: string;
  sampleCta: string;
  enquiry: string;
};

const trLabels: DetailLabels = {
  back: "Tüm kumaşlar",
  view: "Detaylar",
  structure: "Yapı",
  group: "Grup",
  overview: "Genel bakış",
  features: "Öne çıkanlar",
  materials: "Malzemeler",
  uses: "Kullanım alanları",
  finishes: "Bitim işlemleri",
  finishesNote: "Talebe ve kaliteye göre uygulanabilir.",
  prev: "Önceki kumaş",
  next: "Sonraki kumaş",
  related: "Aynı gruptan",
  sampleTitle: "Bu kumaştan numune isteyin",
  sampleText: "Kullanım alanınızı, miktarınızı ve renk beklentinizi paylaşın; size uygun kaliteyi ve numuneyi hazırlayalım.",
  sampleCta: "Numune talep et",
  enquiry: "Kumaş talebi",
};

const enLabels: DetailLabels = {
  back: "All fabrics",
  view: "Details",
  structure: "Structure",
  group: "Group",
  overview: "Overview",
  features: "Highlights",
  materials: "Materials",
  uses: "Uses",
  finishes: "Finishes",
  finishesNote: "Available on request, depending on quality.",
  prev: "Previous fabric",
  next: "Next fabric",
  related: "From the same group",
  sampleTitle: "Request a sample of this fabric",
  sampleText: "Tell us your end use, quantity and colour expectations; we’ll prepare the right quality and a sample for you.",
  sampleCta: "Request a sample",
  enquiry: "Fabric enquiry",
};

const frLabels: DetailLabels = {
  back: "Tous les tissus",
  view: "Détails",
  structure: "Structure",
  group: "Famille",
  overview: "Aperçu",
  features: "Points forts",
  materials: "Matières",
  uses: "Usages",
  finishes: "Finitions",
  finishesNote: "Possibles sur demande, selon la qualité.",
  prev: "Tissu précédent",
  next: "Tissu suivant",
  related: "Dans la même famille",
  sampleTitle: "Demandez un échantillon de ce tissu",
  sampleText: "Indiquez-nous l’usage, la quantité et vos attentes de couleur ; nous préparons la bonne qualité et un échantillon.",
  sampleCta: "Demander un échantillon",
  enquiry: "Demande de tissu",
};

const tr: Record<FabricSlug, FabricDetail> = {
  shirt: {
    structure: "Bezayağı, dobby ve iplik boyalı dokuma",
    lead: "Günlükten resmîye, her gömleğin temeli: nefes alan, ütüye iyi yanıt veren, rengini ve formunu koruyan dokuma kumaşlar.",
    body: [
      "Gömleklik kumaşlar tenle en uzun süre temas eden kumaş grubudur; bu yüzden tuşe, nefes alabilirlik ve yıkama sonrası form, desen kadar önemlidir. Düz bezayağı dokumalardan küçük motifli dobby yapılara, iplik boyalı ekose ve çizgilere kadar geniş bir yelpazede çalışıyoruz.",
      "Polyester, pamuk ve viskon karışımları; pamuğun doğallığını, polyesterin dayanımını ve viskonun akışkan dökümünü tek kumaşta birleştirir. Karışım oranı, gömleğin kullanım amacına — ofis, üniforma ya da günlük koleksiyon — göre birlikte belirlenir.",
    ],
    features: [
      { title: "Nefes alan yapı", text: "Sık ama hava geçiren dokular gün boyu konfor sağlar." },
      { title: "Kalıcı desen", text: "İplik boyalı ekose ve çizgilerde renk yüzeye basılmaz; ipliğin kendisindedir." },
      { title: "Kolay bakım", text: "Karışımlı kalitelerde daha az buruşma, daha hızlı kuruma." },
    ],
    uses: ["Klasik ve günlük gömlek", "Kurumsal üniforma gömlekleri", "Bluz ve tunik", "Gömlek-ceket (overshirt)", "Pijama ve ev giyimi"],
    materialNotes: [
      "Sade bezayağı yüzey; baskı ve nakış için temiz bir zemin.",
      "Armürlü tezgâhta dokunan küçük geometrik motifler; yakından fark edilen doku.",
      "İplik dokumadan önce boyanır; renkler yıkamada daha uzun süre canlı kalır.",
      "Çözgü ve atkıdaki renkli ipliklerle oluşan kareler ve çizgiler.",
      "Dayanımı, doğallığı ve yumuşak dökümü dengeleyen karışım.",
    ],
    finishes: ["Kolay ütü (easy-care) apresi", "Yumuşatma apresi", "Çekmezlik (sanfor) işlemi", "Leke tutmazlık apresi"],
  },
  "suit-trouser": {
    structure: "Dimi (twill) ve gabardin dokuma",
    lead: "Keskin bir ütü çizgisi, düzgün bir döküm ve gün boyu formunu koruyan yapı: takım elbise ve pantolon için dokuma kumaşlar.",
    body: [
      "Takım elbise ve pantolon kumaşlarında beklenti nettir: kumaş vücuda iyi oturmalı, diz ve arka kısımda torbalanmamalı, ütü çizgisini taşımalıdır. Bu yüzden ağırlıklı olarak çapraz yönlü dimi (twill) yapılarla çalışıyoruz; bu yapı kumaşa hem dayanım hem de karakteristik çapraz dokuyu verir.",
      "Polyester-viskon karışımları dökümlü ve buruşmaya dirençli bir yüzey sunarken pamuklu kaliteler daha doğal, mat ve nefes alan bir görünüm verir. Elastan katkılı seçenekler rahat kalıplı pantolonlarda hareket serbestliği sağlar.",
    ],
    features: [
      { title: "Form koruma", text: "Buruşmaya dirençli yapı, ütü çizgisini ve silueti gün boyu korur." },
      { title: "Dökümlü yüzey", text: "Viskon katkısı kumaşa ağırlık ve akışkan bir düşüş kazandırır." },
      { title: "Mevsime göre gramaj", text: "Yazlık hafif kalitelerden kışlık dolgun kalitelere kadar seçenek." },
    ],
    uses: ["Takım elbise ve ceket", "Klasik ve chino pantolon", "Etek ve elbise", "Kurumsal ve personel kıyafetleri", "Yelek"],
    materialNotes: [
      "Buruşmaya ve aşınmaya dayanıklı; rengini uzun süre korur.",
      "Selüloz esaslı; yumuşak tutum, hafif parlaklık ve dökümlü düşüş.",
      "Doğal, nefes alan ve mat görünümlü; chino ve gündelik pantolonlar için.",
    ],
    finishes: ["Buruşmazlık apresi", "Elastan (stretch) seçenekleri", "Su itici (DWR) apre", "Fırçalanmış (şeftali tüyü) yüzey"],
  },
  sportswear: {
    structure: "Örme, file ve raşel yapılar",
    lead: "Hareketle birlikte çalışan kumaşlar: esneyen, terle başa çıkan, hızlı kuruyan ve hafif kalan spor giyim kumaşları.",
    body: [
      "Spor giyimde kumaş, sporcunun ikinci derisidir. Polyester ve naylon esaslı örme yapılar nemi yüzeye taşıyıp hızlı kurur; file bölgeler havalandırma sağlar, polar ise soğuk havada hafif bir ısı katmanı oluşturur.",
      "Antrenman tişörtünden eşofmana, takım formalarından outdoor ara katmanlara kadar her ürün farklı bir yapı ister. Kullanım senaryosunu — tempo, iklim, yıkama sıklığı — konuşarak doğru elyafı ve örgüyü birlikte seçiyoruz.",
    ],
    features: [
      { title: "Nem yönetimi", text: "Teri ciltten uzaklaştıran ve hızlı kuruyan sentetik yapılar." },
      { title: "Esneklik", text: "Örme yapı ve elastan katkısı ile hareket kısıtlanmaz." },
      { title: "Hafiflik", text: "File ve mikrofiber kalitelerle neredeyse hissedilmeyen ürünler." },
    ],
    uses: ["Antrenman tişörtü ve atlet", "Eşofman ve jogger", "Takım formaları", "Polar sweatshirt ve ara katman", "Tayt ve sporcu sütyeni", "Outdoor giyim"],
    materialNotes: [
      "Spor giyimin ana elyafı; hafif, dayanıklı ve hızlı kuruyan.",
      "Yüksek aşınma dayanımı; yumuşak ve pürüzsüz tutum.",
      "Doğal konfor; eşofman ve gündelik spor ürünlerinde.",
      "Açık gözenekli örgü; terlemenin yoğun olduğu bölgelerde havalandırma.",
      "Fırçalanmış, kabarık yüzey; hafif ve sıcak tutan katman.",
      "Çözgülü örme; formunu koruyan, kaçmayan dayanıklı yapı.",
      "Çok ince lifler; ipeksi tutum ve yüksek nem emme.",
    ],
    finishes: ["Nem transferi (wicking) apresi", "Antibakteriyel apre", "UV korumalı kaliteler", "Elastan (stretch) seçenekleri"],
  },
  "fancy-outerwear": {
    structure: "Dobby ve iplik boyalı dokuma",
    lead: "Koleksiyonun en çok göze çarpan parçaları için karakterli yüzeyler: dokusu, deseni ve rengiyle öne çıkan dış giyim kumaşları.",
    body: [
      "Fantezi dış giyim kumaşları bir ceketin ya da kabanın ilk bakışta fark edilmesini sağlar. Dobby motifler, iplik boyalı ekoseler ve çizgiler düz bir kalıba bile derinlik ve karakter katar.",
      "Bu grupta görünüş kadar yapı da önemlidir: kumaş astar ve tela ile uyumlu çalışmalı, dikişte formunu korumalı ve dış etkenlere dayanmalıdır. Desen ölçeğini ve renk paletini koleksiyonunuzun hikâyesine göre birlikte belirliyoruz.",
    ],
    features: [
      { title: "Karakterli doku", text: "Dobby motifler ve renkli iplik oyunlarıyla derinlikli yüzeyler." },
      { title: "Gövdeli yapı", text: "Ceket ve kaban kalıplarında formunu taşıyan dolgun tutum." },
      { title: "Koleksiyona özel", text: "Desen ölçeği ve renk paleti sezon hikâyesine göre kurgulanır." },
    ],
    uses: ["Ceket ve blazer", "Kaban ve trençkot", "Gömlek-ceket (overshirt)", "Yelek", "Tasarım koleksiyon parçaları"],
    materialNotes: [
      "Sade yüzey; kesimin ve detayın öne çıktığı modeller için.",
      "Küçük geometrik motiflerle zenginleşen dokulu yüzey.",
      "Dokuma öncesi boyanan iplikler; derin ve kalıcı renkler.",
      "Ekose, kareli ve çizgili desenlerle klasik ya da cesur çizgiler.",
      "Dayanımı, tutumu ve dökümü dengeleyen karışım.",
    ],
    finishes: ["Su itici (DWR) apre", "Fırçalanmış yüzey", "Yıkanmış (washed) görünüm", "Kaplama / laminasyon seçenekleri"],
  },
  workwear: {
    structure: "Gabardin, kanvas ve oxford dokuma",
    lead: "Her gün, her vardiyada dayanmak için: aşınmaya, yıkamaya ve zorlu koşullara karşı tasarlanmış iş elbisesi kumaşları.",
    body: [
      "İş elbisesinde kumaş bir araçtır; sürtünmeye, sık endüstriyel yıkamaya ve uzun çalışma saatlerine dayanmalıdır. Sık dokunmuş gabardin, kanvas ve oxford yapılar bu dayanımı sağlarken polyester katkısı rengi ve formu uzun süre korur.",
      "Fabrika, servis, sağlık, lojistik ya da otel personeli — her sektörün ihtiyacı farklıdır. Çalışma ortamını, yıkama koşullarını ve kurumsal renkleri konuşarak doğru kaliteyi birlikte belirliyoruz.",
    ],
    features: [
      { title: "Aşınma dayanımı", text: "Sık dokunmuş yapılar sürtünmeye ve yırtılmaya karşı uzun ömürlüdür." },
      { title: "Yıkama dayanımı", text: "Sık ve yüksek ısıda yıkamaya rağmen rengini ve ölçüsünü korur." },
      { title: "Kurumsal renk", text: "Firma renklerine uygun, seriden seriye tutarlı renk." },
    ],
    uses: ["Tulum ve iş pantolonu", "İş ceketi ve yelek", "Personel ve servis üniformaları", "Önlük", "Sağlık ve hizmet sektörü kıyafetleri"],
    materialNotes: [
      "Mukavemet ve renk haslığı; karışımların taşıyıcı elyafı.",
      "Sık dimi dokuma; düzgün yüzey, iyi döküm ve yüksek dayanım.",
      "Kalın bezayağı yapı; ağır kullanım için sağlam ve gövdeli.",
      "Sepet örgü (panama) yapı; nefes alan ve dayanıklı, gömlek ve hafif üniformalar için.",
    ],
    finishes: ["Leke ve su itici apre", "Endüstriyel yıkamaya uygun kaliteler", "Antistatik seçenekler", "Buruşmazlık apresi"],
  },
  decoration: {
    structure: "Perdelik, fon ve tül dokuma",
    lead: "Mekânın ışığını, sesini ve karakterini belirleyen kumaşlar: güneşlikten blackout’a, fondan tüle dekorasyon kumaşları.",
    body: [
      "Dekorasyon kumaşları bir mekânın atmosferini kurar. Tül gün ışığını yumuşatarak içeri alır; fon ve perdelik kumaşlar renk ve doku katar; blackout ise ışığı tamamen keserek yatak odaları ve toplantı salonları için karanlık ve sessiz bir ortam sağlar.",
      "Konut, otel, ofis ve mağaza projelerinde kumaşı yalnızca görünüşüne göre değil; ışık geçirgenliği, dökümü ve bakım kolaylığına göre seçiyoruz. Projeye uygun en ve metrajları birlikte planlıyoruz.",
    ],
    features: [
      { title: "Işık kontrolü", text: "Tülden blackout’a kadar her seviyede ışık geçirgenliği." },
      { title: "Döküm", text: "Pile ve kıvrımları düzgün oturan, ağırlığı dengeli kumaşlar." },
      { title: "Proje ölçeği", text: "Tek odadan tüm binaya kadar uygun metraj planlaması." },
    ],
    uses: ["Ev perdeleri", "Otel ve konaklama projeleri", "Ofis ve toplantı salonları", "Mağaza ve vitrin dekorasyonu", "Etkinlik ve sahne fonları"],
    materialNotes: [
      "Güneş ışığını süzerek sıcaklığı ve parlamayı azaltır.",
      "Çok katlı ya da kaplamalı yapı; ışığı tamamen keser.",
      "Tülün arkasında renk ve doku katan ana perde kumaşı.",
      "Dokulu ya da desenli, gövdeli dekoratif perde kumaşları.",
      "İnce ve şeffaf; ışığı yumuşatarak içeri alan hafif katman.",
    ],
    finishes: ["Güç tutuşur (FR) kaliteler", "Leke tutmazlık", "Termal yalıtım kaplaması", "Geniş en seçenekleri"],
  },
  curtain: {
    structure: "Stor, zebra ve blackout perde kumaşları",
    lead: "Mekanizmalı perdeler için düz, ölçülü ve formunu koruyan kumaşlar: stor, zebra ve blackout sistemleri.",
    body: [
      "Stor ve zebra perdeler rulo mekanizmalarla çalışır; bu yüzden kumaşın kenarları düzgün kalmalı, sarılıp açıldıkça kırışmamalı ve zamanla sarkmamalıdır. Kaplamalı düz stor kumaşları bu gereksinim için sertlik ve boyut stabilitesi sağlar.",
      "Zebra perdeler, şeffaf ve opak bantların üst üste kaydırılmasıyla ışığı kademeli olarak ayarlar. Blackout kaliteler ise ışığı tamamen keserek ev, ofis ve otel odalarında tam karanlık sağlar.",
    ],
    features: [
      { title: "Boyut stabilitesi", text: "Rulo mekanizmada kırışmayan, sarkmayan düz yüzey." },
      { title: "Kademeli ışık", text: "Zebra bantlarla gün boyunca ayarlanabilir aydınlık." },
      { title: "Kolay bakım", text: "Toz tutmayan, silinebilir kaplamalı yüzeyler." },
    ],
    uses: ["Ev ve ofis stor perdeleri", "Zebra perdeler", "Otel odaları", "Toplantı ve eğitim salonları", "Cam cepheler ve kış bahçeleri"],
    materialNotes: [
      "Sertlik veren kaplamayla düz kalan, kenarları dağılmayan stor kumaşı.",
      "Şeffaf ve opak bantlar; birbiri üzerinde kayarak ışığı ayarlar.",
      "Işığı tamamen kesen yoğun ya da kaplamalı yapı.",
    ],
    finishes: ["Güç tutuşur (FR) kaliteler", "Toz ve leke itici kaplama", "Isı yansıtıcı arka kaplama", "Geniş en seçenekleri"],
  },
  "bed-linen": {
    structure: "Poli-pamuk ve mikrofiber dokuma",
    lead: "Her gece tenle buluşan kumaşlar: yumuşak, dayanıklı ve sık yıkamaya rağmen formunu koruyan nevresimlik kumaşlar.",
    body: [
      "Nevresimlik kumaşlarda konfor ile dayanım bir arada olmalıdır. Poli-pamuk karışımlar pamuğun nefes alan yapısını polyesterin dayanımı ve kolay bakımıyla birleştirir; sık yıkanan otel ve konaklama tekstili için özellikle uygundur.",
      "Mikrofiber nevresim kumaşları ince lifleri sayesinde ipeksi bir tutum sunar, hızlı kurur ve az buruşur. Düz, çizgili ya da baskılı seçeneklerle ev koleksiyonlarından toplu projelere kadar çalışıyoruz.",
    ],
    features: [
      { title: "Yumuşak tutum", text: "Tenle temasta rahat, pürüzsüz bir yüzey." },
      { title: "Yıkama dayanımı", text: "Sık yıkamada bile rengini ve ölçüsünü koruyan yapı." },
      { title: "Kolay bakım", text: "Hızlı kuruyan, az buruşan kaliteler." },
    ],
    uses: ["Nevresim takımları", "Çarşaf ve yastık kılıfı", "Otel ve konaklama tekstili", "Hastane ve yurt tekstili", "Baskılı ev koleksiyonları"],
    materialNotes: [
      "Pamuğun konforu, polyesterin dayanımı; yoğun kullanım için ideal denge.",
      "Çok ince lifler; ipeksi, hafif ve hızlı kuruyan nevresim.",
    ],
    finishes: ["Yumuşatma apresi", "Çekmezlik işlemi", "Baskıya hazır (PFP) zemin", "Antibakteriyel apre"],
  },
  "home-knit-velvet": {
    structure: "Örme raşel ve kadife",
    lead: "Evin sıcak yüzeyleri için: yumuşak tutumlu örme ve kadife ev tekstili kumaşları.",
    body: [
      "Bu grup evde dokunulan ve sarınılan ürünler içindir: battaniyeler, kırlentler, örtüler ve dekoratif ürünler. Örme raşel yapılar esnek, hafif ve kaçmaz bir yüzey sunarken kadife, tüylü yüzeyiyle hem görsel hem dokunsal sıcaklık katar.",
      "Polyester ve viskon esaslı kaliteler renk canlılığını korur ve kolay bakım sağlar. Renk, tüy yüksekliği ve gramajı ürünün kullanımına göre birlikte belirliyoruz.",
    ],
    features: [
      { title: "Yumuşaklık", text: "Dokunduğunuz anda hissedilen sıcak ve yumuşak tutum." },
      { title: "Renk derinliği", text: "Kadife yüzeyde ışıkla değişen zengin tonlar." },
      { title: "Dayanıklı örgü", text: "Raşel yapı kaçmaz ve formunu korur." },
    ],
    uses: ["Battaniye ve şal", "Kırlent ve minder", "Yatak örtüsü ve runner", "Dekoratif ev ürünleri", "Bebek ve çocuk ev tekstili"],
    materialNotes: [
      "Kolay bakım ve canlı renk; ev tekstilinin taşıyıcı elyafı.",
      "Yumuşak tutum ve hafif parlaklık katan selüloz elyaf.",
      "Çözgülü örme; esnek, hafif ve kaçmayan yapı.",
      "Kısa, sık tüylü yüzey; sıcak tutum ve derin renk.",
    ],
    finishes: ["Yumuşatma apresi", "Tüy dökmezlik işlemi", "Boncuklanma önleyici (antipilling)", "Kabartma (gofre) desen"],
  },
  upholstery: {
    structure: "Süet, raşel ve kadife döşemelik",
    lead: "Her gün oturulan, dokunulan, kullanılan yüzeyler için: aşınmaya dayanıklı ve uzun ömürlü döşemelik kumaşlar.",
    body: [
      "Döşemelik kumaşlar evdeki en yoğun kullanımı karşılar; koltuklar, sandalyeler ve yataklar her gün sürtünmeye maruz kalır. Bu yüzden döşemelikte görünüş kadar aşınma dayanımı, dikiş mukavemeti ve renk haslığı da belirleyicidir.",
      "Süet mat ve kadifemsi bir tutum; kadife zengin ve derin bir renk; raşel ise esnek ve dayanıklı bir yapı sunar. Ev, ofis, otel ve kafe-restoran projeleri için kullanım yoğunluğuna uygun kaliteyi birlikte seçiyoruz.",
    ],
    features: [
      { title: "Aşınma dayanımı", text: "Yoğun kullanıma uygun, uzun ömürlü yüzeyler." },
      { title: "Renk haslığı", text: "Güneşle ve kullanımla kolay solmayan renkler." },
      { title: "Kolay temizlik", text: "Leke itici kalitelerle günlük kullanımda pratiklik." },
    ],
    uses: ["Koltuk ve kanepe", "Sandalye ve puf", "Baza ve yatak başlığı", "Otel, kafe ve restoran mobilyaları", "Ofis oturma grupları"],
    materialNotes: [
      "Mikrofiber esaslı, mat ve kadifemsi yüzey; zamansız bir görünüm.",
      "Çözgülü örme yapı; esnek, dayanıklı ve kaçmaz.",
      "Sık tüylü yüzey; zengin renk ve lüks bir dokunuş.",
    ],
    finishes: ["Leke ve su itici apre", "Güç tutuşur (FR) kaliteler", "Boncuklanma önleyici (antipilling)", "Kolay temizlenebilir (easy-clean) seçenekler"],
  },
  mattress: {
    structure: "Yatak kumaşı (tiking)",
    lead: "Uykunun görünmeyen yüzü: yatağın dış katmanını oluşturan, nefes alan ve dayanıklı yatak kumaşları.",
    body: [
      "Yatak kumaşı, yatağın dolgusunu saran ve uyku konforunu doğrudan etkileyen dış katmandır. Kapitone ile uyumlu çalışmalı, nefes almalı, yüzeyde düzgün durmalı ve uzun yıllar formunu korumalıdır.",
      "Polyester kaliteler dayanım ve ekonomik bir çözüm sunarken viskon ve pamuk katkısı daha yumuşak bir tutum ve daha iyi nem yönetimi sağlar. Desen ve renk seçenekleriyle yatağın görünüşünü markanıza göre kurguluyoruz.",
    ],
    features: [
      { title: "Nefes alabilirlik", text: "Hava geçiren yapıyla serin ve kuru bir uyku yüzeyi." },
      { title: "Kapitone uyumu", text: "Dikişte düzgün oturan, büzülmeyen kumaş." },
      { title: "Uzun ömür", text: "Yıllarca formunu ve görünüşünü koruyan dayanım." },
    ],
    uses: ["Yatak ve baza", "Yatak koruyucu (alez)", "Yastık ve yorgan dış kumaşı", "Bebek ve çocuk yatakları", "Otel yatakları"],
    materialNotes: [
      "Dayanıklı ve ekonomik; formunu koruyan ana elyaf.",
      "Yumuşak tutum ve iyi nem emme; serin bir yüzey.",
      "Doğal ve nefes alan; hassas ciltler için.",
    ],
    finishes: ["Antibakteriyel / akar önleyici apre", "Serinletici (cooling) apre", "Güç tutuşur (FR) kaliteler", "Yumuşatma apresi"],
  },
  technical: {
    structure: "Top ve iplik boyalı teknik dokuma",
    lead: "Dış ortamda ve yük altında çalışan kumaşlar: çadır, mobilya ve bant uygulamaları için teknik kumaşlar.",
    body: [
      "Teknik kumaşlarda öncelik performanstır: kumaş güneşe, yağmura, gerilime ve yıpranmaya dayanmalıdır. Çadır ve gölgelik kumaşlarından bahçe mobilyası kılıflarına, taşıma ve bağlama bantlarına kadar farklı uygulamalar için çalışıyoruz.",
      "Renklendirme yöntemi kullanım alanına göre seçilir: top boyama esnek ve hızlı renk çalışması sağlarken iplik boyama rengi lif seviyesinde sabitleyerek dış ortamda daha uzun ömür sunar.",
    ],
    features: [
      { title: "Dış ortam dayanımı", text: "Güneşe, yağmura ve sıcaklık değişimlerine karşı dayanıklı." },
      { title: "Yüksek mukavemet", text: "Gerilim ve yük altında yırtılmaya dirençli yapı." },
      { title: "Renk kalıcılığı", text: "Dış ortamda uzun süre canlı kalan renkler." },
    ],
    uses: ["Çadır ve gölgelik", "Bahçe ve dış mekân mobilyası", "Tente ve branda", "Taşıma ve bağlama bantları", "Çanta ve aksesuar"],
    materialNotes: [
      "Kumaş dokunduktan sonra topta boyanır; renk seçiminde esneklik ve hız.",
      "İplik dokumadan önce boyanır; yüksek renk haslığı ve dış ortam dayanımı.",
    ],
    finishes: ["Su geçirmez kaplama", "UV dayanımı", "Güç tutuşur (FR) kaliteler", "Küf önleyici apre"],
  },
};

const en: Record<FabricSlug, FabricDetail> = {
  shirt: {
    structure: "Plain, dobby and yarn-dyed weaves",
    lead: "The foundation of every shirt, casual to formal: woven fabrics that breathe, press well and keep their colour and shape.",
    body: [
      "Shirt fabrics spend more time against the skin than any other group, so hand feel, breathability and shape after washing matter as much as the pattern. We work across a wide range — from plain weaves to small-figured dobby structures and yarn-dyed checks and stripes.",
      "Polyester, cotton and viscose blends combine the naturalness of cotton, the strength of polyester and the fluid drape of viscose in one fabric. The blend ratio is set together, according to what the shirt is for — office, uniform or a casual collection.",
    ],
    features: [
      { title: "Breathable structure", text: "Dense yet airy weaves keep you comfortable all day." },
      { title: "Lasting pattern", text: "In yarn-dyed checks and stripes the colour isn’t printed on — it’s in the yarn itself." },
      { title: "Easy care", text: "Blended qualities crease less and dry faster." },
    ],
    uses: ["Classic and casual shirts", "Corporate uniform shirts", "Blouses and tunics", "Overshirts", "Pyjamas and loungewear"],
    materialNotes: [
      "A clean plain-weave surface; a neat base for print and embroidery.",
      "Small geometric figures woven on a dobby loom; texture you notice up close.",
      "The yarn is dyed before weaving, so colours stay bright for longer.",
      "Checks and stripes built from coloured yarns in warp and weft.",
      "A blend balancing strength, naturalness and a soft drape.",
    ],
    finishes: ["Easy-care finish", "Softening finish", "Sanforised (anti-shrink)", "Stain-repellent finish"],
  },
  "suit-trouser": {
    structure: "Twill and gabardine weaves",
    lead: "A sharp crease, a clean drape and a structure that holds its shape all day: woven fabrics for suits and trousers.",
    body: [
      "Expectations for suit and trouser fabrics are clear: the cloth must sit well on the body, not bag at the knees or seat, and hold a pressed crease. That’s why we work mostly with diagonal twill structures, which give the fabric both strength and its characteristic diagonal texture.",
      "Polyester-viscose blends offer a fluid, crease-resistant surface, while cotton qualities give a more natural, matte and breathable look. Stretch options with elastane add freedom of movement to relaxed-fit trousers.",
    ],
    features: [
      { title: "Shape retention", text: "A crease-resistant structure keeps the line and silhouette all day." },
      { title: "Fluid surface", text: "Viscose adds weight and a flowing fall." },
      { title: "Seasonal weights", text: "From light summer qualities to full-bodied winter ones." },
    ],
    uses: ["Suits and jackets", "Tailored and chino trousers", "Skirts and dresses", "Corporate and staff wear", "Waistcoats"],
    materialNotes: [
      "Resistant to creasing and abrasion; keeps its colour for a long time.",
      "Cellulose-based; soft handle, gentle sheen and a fluid fall.",
      "Natural, breathable and matte; for chinos and casual trousers.",
    ],
    finishes: ["Crease-resistant finish", "Stretch (elastane) options", "Water-repellent (DWR) finish", "Brushed (peach) surface"],
  },
  sportswear: {
    structure: "Knit, mesh and raschel structures",
    lead: "Fabrics that move with you: stretchy, sweat-managing, quick-drying and light sportswear fabrics.",
    body: [
      "In sportswear, fabric is an athlete’s second skin. Polyester and nylon knits carry moisture to the surface and dry quickly; mesh zones ventilate, and fleece adds a light layer of warmth in cold weather.",
      "From training tees to tracksuits, team kits to outdoor mid-layers, every product needs a different structure. We talk through the use case — intensity, climate, washing frequency — and choose the right fibre and knit together.",
    ],
    features: [
      { title: "Moisture management", text: "Synthetic structures that pull sweat away from the skin and dry fast." },
      { title: "Stretch", text: "Knit structures and elastane keep movement free." },
      { title: "Lightness", text: "Mesh and microfiber qualities you barely feel." },
    ],
    uses: ["Training tees and tanks", "Tracksuits and joggers", "Team kits", "Fleece sweatshirts and mid-layers", "Leggings and sports bras", "Outdoor wear"],
    materialNotes: [
      "The core fibre of sportswear; light, strong and quick-drying.",
      "High abrasion resistance with a soft, smooth handle.",
      "Natural comfort; for tracksuits and casual sportswear.",
      "An open-hole knit; ventilation where you sweat most.",
      "A brushed, lofty surface; a light, warm layer.",
      "A warp knit; holds its shape and won’t ladder.",
      "Ultra-fine fibres; a silky handle and high absorbency.",
    ],
    finishes: ["Moisture-wicking finish", "Antibacterial finish", "UV-protective qualities", "Stretch (elastane) options"],
  },
  "fancy-outerwear": {
    structure: "Dobby and yarn-dyed weaves",
    lead: "Characterful surfaces for a collection’s statement pieces: outerwear fabrics that stand out through texture, pattern and colour.",
    body: [
      "Fancy outerwear fabrics are what make a jacket or coat noticed at first glance. Dobby figures, yarn-dyed checks and stripes add depth and character even to a simple pattern.",
      "In this group, construction matters as much as looks: the fabric must work with lining and interfacing, hold its shape at the seams and stand up to the elements. We set the pattern scale and colour palette together, around your collection’s story.",
    ],
    features: [
      { title: "Characterful texture", text: "Depth from dobby figures and coloured-yarn play." },
      { title: "Body", text: "A full handle that carries the shape of jackets and coats." },
      { title: "Made for the collection", text: "Pattern scale and palette shaped around the season’s story." },
    ],
    uses: ["Jackets and blazers", "Coats and trench coats", "Overshirts", "Waistcoats", "Designer collection pieces"],
    materialNotes: [
      "A clean surface for designs where cut and detail lead.",
      "A textured surface enriched with small geometric figures.",
      "Yarns dyed before weaving; deep, lasting colour.",
      "Checks, plaids and stripes, classic or bold.",
      "A blend balancing strength, handle and drape.",
    ],
    finishes: ["Water-repellent (DWR) finish", "Brushed surface", "Washed look", "Coating / lamination options"],
  },
  workwear: {
    structure: "Gabardine, canvas and oxford weaves",
    lead: "Built to last every day, every shift: workwear fabrics designed against abrasion, washing and tough conditions.",
    body: [
      "In workwear, fabric is a tool: it must withstand friction, frequent industrial washing and long hours. Tightly woven gabardine, canvas and oxford structures provide that strength, while polyester keeps colour and shape for longer.",
      "Factory, service, healthcare, logistics or hotel staff — every sector has different needs. We discuss the working environment, washing conditions and corporate colours, and choose the right quality together.",
    ],
    features: [
      { title: "Abrasion resistance", text: "Tight weaves stand up to friction and tearing for longer." },
      { title: "Wash durability", text: "Keeps colour and size through frequent, high-temperature washing." },
      { title: "Corporate colour", text: "Consistent colour matched to your brand, batch after batch." },
    ],
    uses: ["Overalls and work trousers", "Work jackets and vests", "Staff and service uniforms", "Aprons", "Healthcare and hospitality wear"],
    materialNotes: [
      "Strength and colour fastness; the backbone of the blends.",
      "A tight twill; smooth surface, good drape and high strength.",
      "A heavy plain weave; robust and full-bodied for hard use.",
      "A basket (panama) weave; breathable and durable, for shirts and light uniforms.",
    ],
    finishes: ["Stain- and water-repellent finish", "Qualities suited to industrial washing", "Anti-static options", "Crease-resistant finish"],
  },
  decoration: {
    structure: "Drapery, backdrop and sheer weaves",
    lead: "Fabrics that set a room’s light, sound and character: decoration fabrics from sunshades and blackout to backdrops and sheers.",
    body: [
      "Decoration fabrics build the atmosphere of a space. Sheers soften daylight as they let it in; backdrop and drapery fabrics add colour and texture; blackout cuts light out completely, creating a dark, quiet room for bedrooms and meeting rooms.",
      "For homes, hotels, offices and stores, we choose fabric not only by its look but by light transmission, drape and ease of care. We plan suitable widths and quantities for each project together.",
    ],
    features: [
      { title: "Light control", text: "Every level of light transmission, from sheer to blackout." },
      { title: "Drape", text: "Fabrics with balanced weight that pleat and fold neatly." },
      { title: "Project scale", text: "Quantities planned for a single room or an entire building." },
    ],
    uses: ["Home curtains", "Hotel and hospitality projects", "Offices and meeting rooms", "Retail and window displays", "Event and stage backdrops"],
    materialNotes: [
      "Filters sunlight, reducing heat and glare.",
      "Multi-layer or coated; blocks light completely.",
      "The main curtain behind the sheer, adding colour and texture.",
      "Textured or patterned decorative curtain fabrics with body.",
      "Fine and transparent; a light layer that softens incoming light.",
    ],
    finishes: ["Flame-retardant (FR) qualities", "Stain resistance", "Thermal insulation coating", "Wide-width options"],
  },
  curtain: {
    structure: "Roller, zebra and blackout blind fabrics",
    lead: "Flat, precise fabrics that hold their shape for mechanised blinds: roller, zebra and blackout systems.",
    body: [
      "Roller and zebra blinds run on roll mechanisms, so the fabric’s edges must stay straight, it mustn’t crease as it rolls and unrolls, and it shouldn’t sag over time. Coated plain roller fabrics provide the stiffness and dimensional stability this demands.",
      "Zebra blinds adjust light gradually by sliding sheer and opaque bands over each other. Blackout qualities block light completely for full darkness in homes, offices and hotel rooms.",
    ],
    features: [
      { title: "Dimensional stability", text: "A flat surface that doesn’t crease or sag on the roller." },
      { title: "Graduated light", text: "Brightness adjustable through the day with zebra bands." },
      { title: "Easy care", text: "Coated surfaces that resist dust and wipe clean." },
    ],
    uses: ["Home and office roller blinds", "Zebra blinds", "Hotel rooms", "Meeting and training rooms", "Glass façades and conservatories"],
    materialNotes: [
      "A stiffening coating keeps it flat, with clean, fray-free edges.",
      "Sheer and opaque bands that slide over each other to tune light.",
      "A dense or coated structure that blocks light completely.",
    ],
    finishes: ["Flame-retardant (FR) qualities", "Dust- and stain-repellent coating", "Heat-reflective back coating", "Wide-width options"],
  },
  "bed-linen": {
    structure: "Poly-cotton and microfiber weaves",
    lead: "Fabrics that meet the skin every night: soft, durable bed linen fabrics that keep their shape through frequent washing.",
    body: [
      "Bed linen must combine comfort with durability. Poly-cotton blends pair cotton’s breathability with polyester’s strength and easy care — particularly suited to frequently washed hotel and hospitality textiles.",
      "Microfiber bed linen fabrics offer a silky handle thanks to their fine fibres, dry quickly and crease little. With plain, striped or printed options we work on everything from home collections to bulk projects.",
    ],
    features: [
      { title: "Soft handle", text: "A smooth surface that’s comfortable against the skin." },
      { title: "Wash durability", text: "Keeps colour and size even with frequent washing." },
      { title: "Easy care", text: "Quick-drying, low-crease qualities." },
    ],
    uses: ["Duvet cover sets", "Sheets and pillowcases", "Hotel and hospitality textiles", "Hospital and dormitory textiles", "Printed home collections"],
    materialNotes: [
      "Cotton’s comfort, polyester’s strength; the ideal balance for heavy use.",
      "Ultra-fine fibres; silky, light and quick-drying bed linen.",
    ],
    finishes: ["Softening finish", "Anti-shrink treatment", "Prepared-for-print (PFP) base", "Antibacterial finish"],
  },
  "home-knit-velvet": {
    structure: "Knitted raschel and velvet",
    lead: "For the warm surfaces of the home: soft-handled knit and velvet home textile fabrics.",
    body: [
      "This group is for things you touch and wrap yourself in at home: blankets, cushions, throws and decorative pieces. Knitted raschel structures offer a stretchy, light, ladder-free surface, while velvet’s pile adds both visual and tactile warmth.",
      "Polyester and viscose based qualities keep colours vivid and are easy to care for. We set colour, pile height and weight together, according to how the product will be used.",
    ],
    features: [
      { title: "Softness", text: "A warm, soft handle you feel the moment you touch it." },
      { title: "Depth of colour", text: "Rich tones on velvet that shift with the light." },
      { title: "Durable knit", text: "Raschel structure won’t ladder and holds its shape." },
    ],
    uses: ["Blankets and throws", "Cushions and seat pads", "Bedspreads and runners", "Decorative home products", "Baby and kids’ home textiles"],
    materialNotes: [
      "Easy care and vivid colour; the backbone fibre of home textiles.",
      "A cellulose fibre adding a soft handle and gentle sheen.",
      "A warp knit; stretchy, light and ladder-free.",
      "A short, dense pile; warm handle and deep colour.",
    ],
    finishes: ["Softening finish", "Anti-shedding treatment", "Anti-pilling", "Embossed pattern"],
  },
  upholstery: {
    structure: "Suede, raschel and velvet upholstery",
    lead: "For surfaces sat on, touched and used every day: hard-wearing, long-lasting upholstery fabrics.",
    body: [
      "Upholstery fabrics take the heaviest use in the home; sofas, chairs and beds face friction every day. That’s why abrasion resistance, seam strength and colour fastness matter as much as appearance.",
      "Suede offers a matte, velvety handle; velvet, rich and deep colour; raschel, a stretchy and durable structure. For homes, offices, hotels and cafés we choose the quality that matches the intensity of use together.",
    ],
    features: [
      { title: "Abrasion resistance", text: "Long-lasting surfaces suited to heavy use." },
      { title: "Colour fastness", text: "Colours that don’t fade easily with sunlight and use." },
      { title: "Easy cleaning", text: "Stain-repellent qualities for everyday practicality." },
    ],
    uses: ["Sofas and armchairs", "Chairs and poufs", "Bed bases and headboards", "Hotel, café and restaurant furniture", "Office seating"],
    materialNotes: [
      "Microfiber-based, matte and velvety; a timeless look.",
      "A warp-knit structure; stretchy, durable and ladder-free.",
      "A dense pile surface; rich colour and a luxurious touch.",
    ],
    finishes: ["Stain- and water-repellent finish", "Flame-retardant (FR) qualities", "Anti-pilling", "Easy-clean options"],
  },
  mattress: {
    structure: "Mattress ticking",
    lead: "The unseen side of sleep: breathable, durable fabrics forming the outer layer of a mattress.",
    body: [
      "Mattress fabric is the outer layer that wraps the filling and directly affects sleep comfort. It must work with quilting, breathe, sit smoothly on the surface and keep its shape for years.",
      "Polyester qualities offer durability and an economical solution, while viscose and cotton add a softer handle and better moisture management. With pattern and colour options we shape the mattress’s look around your brand.",
    ],
    features: [
      { title: "Breathability", text: "An airy structure for a cool, dry sleeping surface." },
      { title: "Quilting compatibility", text: "Fabric that sits neatly in stitching without puckering." },
      { title: "Longevity", text: "Durability that keeps shape and appearance for years." },
    ],
    uses: ["Mattresses and bed bases", "Mattress protectors", "Pillow and duvet shells", "Baby and kids’ mattresses", "Hotel beds"],
    materialNotes: [
      "Durable and economical; the core fibre that holds its shape.",
      "A soft handle and good moisture absorption; a cool surface.",
      "Natural and breathable; for sensitive skin.",
    ],
    finishes: ["Antibacterial / anti-dust-mite finish", "Cooling finish", "Flame-retardant (FR) qualities", "Softening finish"],
  },
  technical: {
    structure: "Piece- and yarn-dyed technical weaves",
    lead: "Fabrics that work outdoors and under load: technical fabrics for tents, furniture and banding.",
    body: [
      "With technical fabrics, performance comes first: the fabric must resist sun, rain, tension and wear. We work on applications from tent and shade fabrics to garden furniture covers and carrying and lashing straps.",
      "The colouring method is chosen by end use: piece dyeing allows flexible, fast colour work, while yarn dyeing locks colour in at fibre level for a longer life outdoors.",
    ],
    features: [
      { title: "Outdoor durability", text: "Resistant to sun, rain and temperature changes." },
      { title: "High strength", text: "A tear-resistant structure under tension and load." },
      { title: "Colour permanence", text: "Colours that stay vivid outdoors for longer." },
    ],
    uses: ["Tents and shades", "Garden and outdoor furniture", "Awnings and tarpaulins", "Carrying and lashing straps", "Bags and accessories"],
    materialNotes: [
      "Dyed in the piece after weaving; flexibility and speed in colour choice.",
      "Yarn dyed before weaving; high colour fastness and outdoor durability.",
    ],
    finishes: ["Waterproof coating", "UV resistance", "Flame-retardant (FR) qualities", "Anti-mould finish"],
  },
};

const fr: Record<FabricSlug, FabricDetail> = {
  shirt: {
    structure: "Armures toile, dobby et teint en fil",
    lead: "La base de chaque chemise, du casual au formel : des tissus tissés qui respirent, se repassent bien et gardent couleur et tenue.",
    body: [
      "Les tissus pour chemises sont ceux qui restent le plus longtemps au contact de la peau : le toucher, la respirabilité et la tenue après lavage comptent autant que le motif. Nous travaillons une large gamme — des armures toile aux petits motifs dobby, en passant par les carreaux et rayures teints en fil.",
      "Les mélanges polyester, coton et viscose réunissent dans un même tissu le naturel du coton, la résistance du polyester et le tombé fluide de la viscose. Le ratio du mélange se décide ensemble, selon l’usage de la chemise — bureau, uniforme ou collection casual.",
    ],
    features: [
      { title: "Structure respirante", text: "Des tissages serrés mais aérés pour un confort toute la journée." },
      { title: "Motif durable", text: "Dans les carreaux et rayures teints en fil, la couleur n’est pas imprimée : elle est dans le fil." },
      { title: "Entretien facile", text: "Les qualités mélangées se froissent moins et sèchent plus vite." },
    ],
    uses: ["Chemises classiques et casual", "Chemises d’uniforme d’entreprise", "Chemisiers et tuniques", "Surchemises", "Pyjamas et tenues d’intérieur"],
    materialNotes: [
      "Une surface toile nette ; une base propre pour l’impression et la broderie.",
      "Petits motifs géométriques tissés sur métier dobby ; une texture visible de près.",
      "Le fil est teint avant le tissage : les couleurs restent vives plus longtemps.",
      "Carreaux et rayures formés par des fils de couleur en chaîne et en trame.",
      "Un mélange qui équilibre résistance, naturel et tombé souple.",
    ],
    finishes: ["Apprêt easy-care", "Apprêt adoucissant", "Sanforisage (anti-rétrécissement)", "Apprêt anti-taches"],
  },
  "suit-trouser": {
    structure: "Armures sergé et gabardine",
    lead: "Un pli net, un tombé propre et une tenue qui dure toute la journée : des tissus tissés pour costumes et pantalons.",
    body: [
      "Les attentes sont claires : le tissu doit bien tomber sur le corps, ne pas poquer aux genoux ni à l’assise et garder le pli du repassage. C’est pourquoi nous travaillons surtout des structures sergé, qui donnent au tissu à la fois résistance et texture diagonale caractéristique.",
      "Les mélanges polyester-viscose offrent une surface fluide et infroissable, tandis que les qualités coton donnent un aspect plus naturel, mat et respirant. Les options stretch avec élasthanne apportent de la liberté de mouvement aux pantalons à coupe décontractée.",
    ],
    features: [
      { title: "Tenue de forme", text: "Une structure infroissable qui garde la ligne et la silhouette toute la journée." },
      { title: "Tombé fluide", text: "La viscose apporte du poids et un tombé souple." },
      { title: "Grammages saisonniers", text: "Des qualités légères pour l’été aux qualités étoffées pour l’hiver." },
    ],
    uses: ["Costumes et vestes", "Pantalons de ville et chinos", "Jupes et robes", "Tenues d’entreprise et de personnel", "Gilets"],
    materialNotes: [
      "Résiste au froissement et à l’abrasion ; garde sa couleur longtemps.",
      "D’origine cellulosique ; toucher doux, léger brillant et tombé fluide.",
      "Naturel, respirant et mat ; pour les chinos et pantalons casual.",
    ],
    finishes: ["Apprêt infroissable", "Options stretch (élasthanne)", "Apprêt déperlant (DWR)", "Surface grattée (peau de pêche)"],
  },
  sportswear: {
    structure: "Mailles, mesh et raschel",
    lead: "Des tissus qui bougent avec vous : extensibles, respirants, à séchage rapide et légers.",
    body: [
      "En sportswear, le tissu est la seconde peau de l’athlète. Les mailles polyester et nylon évacuent l’humidité vers la surface et sèchent vite ; les zones en mesh ventilent, et la polaire ajoute une couche de chaleur légère par temps froid.",
      "Du t-shirt d’entraînement au survêtement, des maillots d’équipe aux couches intermédiaires outdoor, chaque produit demande une structure différente. Nous parlons de l’usage — intensité, climat, fréquence de lavage — et choisissons ensemble la bonne fibre et la bonne maille.",
    ],
    features: [
      { title: "Gestion de l’humidité", text: "Des structures synthétiques qui éloignent la transpiration de la peau et sèchent vite." },
      { title: "Élasticité", text: "Les structures maille et l’élasthanne laissent le mouvement libre." },
      { title: "Légèreté", text: "Des qualités mesh et microfibre qu’on oublie en les portant." },
    ],
    uses: ["T-shirts et débardeurs d’entraînement", "Survêtements et joggings", "Maillots d’équipe", "Sweats polaires et couches intermédiaires", "Leggings et brassières", "Vêtements outdoor"],
    materialNotes: [
      "La fibre de base du sportswear ; légère, résistante et à séchage rapide.",
      "Grande résistance à l’abrasion, toucher doux et lisse.",
      "Confort naturel ; pour survêtements et sportswear casual.",
      "Une maille ajourée ; de la ventilation là où l’on transpire le plus.",
      "Une surface grattée et gonflante ; une couche légère et chaude.",
      "Une maille chaîne ; garde sa forme et ne file pas.",
      "Des fibres ultrafines ; toucher soyeux et forte absorption.",
    ],
    finishes: ["Apprêt d’évacuation de l’humidité", "Apprêt antibactérien", "Qualités anti-UV", "Options stretch (élasthanne)"],
  },
  "fancy-outerwear": {
    structure: "Armures dobby et teint en fil",
    lead: "Des surfaces de caractère pour les pièces fortes d’une collection : des tissus d’extérieur qui se distinguent par la texture, le motif et la couleur.",
    body: [
      "Les tissus fantaisie pour l’extérieur font qu’une veste ou un manteau se remarque au premier regard. Motifs dobby, carreaux et rayures teints en fil apportent profondeur et caractère, même à un patron simple.",
      "Dans cette famille, la construction compte autant que l’aspect : le tissu doit s’accorder avec la doublure et l’entoilage, garder sa forme aux coutures et résister aux intempéries. Nous définissons ensemble l’échelle du motif et la palette, autour de l’histoire de votre collection.",
    ],
    features: [
      { title: "Texture de caractère", text: "De la profondeur grâce aux motifs dobby et aux jeux de fils colorés." },
      { title: "De la main", text: "Un toucher étoffé qui porte la forme des vestes et manteaux." },
      { title: "Pensé pour la collection", text: "Échelle du motif et palette construites autour de l’histoire de la saison." },
    ],
    uses: ["Vestes et blazers", "Manteaux et trenchs", "Surchemises", "Gilets", "Pièces de collection créateur"],
    materialNotes: [
      "Une surface sobre pour les modèles où la coupe et le détail priment.",
      "Une surface texturée enrichie de petits motifs géométriques.",
      "Des fils teints avant tissage ; des couleurs profondes et durables.",
      "Carreaux, tartans et rayures, classiques ou audacieux.",
      "Un mélange qui équilibre résistance, toucher et tombé.",
    ],
    finishes: ["Apprêt déperlant (DWR)", "Surface grattée", "Aspect délavé", "Options d’enduction / contrecollage"],
  },
  workwear: {
    structure: "Gabardine, toile et oxford",
    lead: "Faits pour durer chaque jour, à chaque poste : des tissus de travail conçus contre l’abrasion, les lavages et les conditions difficiles.",
    body: [
      "Dans le vêtement de travail, le tissu est un outil : il doit résister aux frottements, aux lavages industriels fréquents et aux longues journées. Les structures serrées en gabardine, toile et oxford assurent cette résistance, tandis que le polyester préserve plus longtemps la couleur et la forme.",
      "Usine, service, santé, logistique ou hôtellerie — chaque secteur a ses besoins. Nous parlons de l’environnement de travail, des conditions de lavage et des couleurs de l’entreprise, et choisissons ensemble la bonne qualité.",
    ],
    features: [
      { title: "Résistance à l’abrasion", text: "Des tissages serrés qui résistent plus longtemps aux frottements et aux déchirures." },
      { title: "Tenue au lavage", text: "Garde couleur et dimensions malgré des lavages fréquents à haute température." },
      { title: "Couleur d’entreprise", text: "Une couleur constante, assortie à votre marque, d’un lot à l’autre." },
    ],
    uses: ["Combinaisons et pantalons de travail", "Vestes et gilets de travail", "Uniformes de personnel et de service", "Tabliers", "Tenues pour la santé et l’hôtellerie"],
    materialNotes: [
      "Résistance et solidité des couleurs ; l’ossature des mélanges.",
      "Un sergé serré ; surface lisse, bon tombé et grande résistance.",
      "Une armure toile épaisse ; robuste et étoffée pour un usage intensif.",
      "Une armure natté (panama) ; respirante et résistante, pour chemises et uniformes légers.",
    ],
    finishes: ["Apprêt anti-taches et déperlant", "Qualités adaptées au lavage industriel", "Options antistatiques", "Apprêt infroissable"],
  },
  decoration: {
    structure: "Rideaux, toiles de fond et voilages",
    lead: "Des tissus qui définissent la lumière, l’acoustique et le caractère d’un lieu : du pare-soleil à l’occultant, de la toile de fond au voilage.",
    body: [
      "Les tissus de décoration créent l’atmosphère d’un espace. Le voilage adoucit la lumière du jour en la laissant entrer ; les toiles de fond et tissus de rideau apportent couleur et texture ; l’occultant bloque totalement la lumière pour des chambres et salles de réunion sombres et calmes.",
      "Pour les logements, hôtels, bureaux et boutiques, nous choisissons le tissu non seulement pour son aspect, mais aussi pour sa transmission lumineuse, son tombé et sa facilité d’entretien. Nous planifions ensemble les laizes et métrages adaptés à chaque projet.",
    ],
    features: [
      { title: "Contrôle de la lumière", text: "Tous les niveaux de transmission, du voilage à l’occultant." },
      { title: "Tombé", text: "Des tissus au poids équilibré qui plissent et drapent proprement." },
      { title: "Échelle projet", text: "Des métrages planifiés pour une pièce comme pour un bâtiment entier." },
    ],
    uses: ["Rideaux pour la maison", "Projets hôteliers", "Bureaux et salles de réunion", "Boutiques et vitrines", "Fonds de scène et événementiel"],
    materialNotes: [
      "Filtre la lumière du soleil, réduit la chaleur et l’éblouissement.",
      "Multicouche ou enduit ; bloque totalement la lumière.",
      "Le rideau principal derrière le voilage, qui apporte couleur et texture.",
      "Des tissus de rideau décoratifs, texturés ou à motifs, avec de la main.",
      "Fin et transparent ; une couche légère qui adoucit la lumière.",
    ],
    finishes: ["Qualités ignifugées (FR)", "Traitement anti-taches", "Enduction thermique isolante", "Options grande largeur"],
  },
  curtain: {
    structure: "Stores enrouleurs, zébra et occultants",
    lead: "Des tissus plats, précis et stables pour les stores à mécanisme : enrouleurs, zébra et occultants.",
    body: [
      "Les stores enrouleurs et zébra fonctionnent sur des mécanismes à rouleau : les lisières doivent rester droites, le tissu ne doit pas se froisser à l’enroulement ni se détendre avec le temps. Les tissus enduits pour stores enrouleurs apportent la rigidité et la stabilité dimensionnelle nécessaires.",
      "Les stores zébra règlent la lumière progressivement en faisant glisser des bandes transparentes et opaques les unes sur les autres. Les qualités occultantes bloquent totalement la lumière pour une obscurité complète à la maison, au bureau ou à l’hôtel.",
    ],
    features: [
      { title: "Stabilité dimensionnelle", text: "Une surface plane qui ne se froisse ni ne se détend sur le rouleau." },
      { title: "Lumière modulable", text: "Une luminosité réglable tout au long de la journée grâce aux bandes zébra." },
      { title: "Entretien facile", text: "Des surfaces enduites qui repoussent la poussière et se nettoient d’un geste." },
    ],
    uses: ["Stores enrouleurs pour la maison et le bureau", "Stores zébra", "Chambres d’hôtel", "Salles de réunion et de formation", "Façades vitrées et vérandas"],
    materialNotes: [
      "Une enduction rigidifiante qui le garde plat, avec des lisières nettes qui ne s’effilochent pas.",
      "Des bandes transparentes et opaques qui glissent l’une sur l’autre pour doser la lumière.",
      "Une structure dense ou enduite qui bloque totalement la lumière.",
    ],
    finishes: ["Qualités ignifugées (FR)", "Enduction anti-poussière et anti-taches", "Envers réfléchissant la chaleur", "Options grande largeur"],
  },
  "bed-linen": {
    structure: "Tissages poly-coton et microfibre",
    lead: "Des tissus qui touchent la peau chaque nuit : un linge de lit doux et résistant, qui garde sa tenue malgré les lavages fréquents.",
    body: [
      "Le linge de lit doit allier confort et résistance. Les mélanges poly-coton associent la respirabilité du coton à la résistance et à la facilité d’entretien du polyester — idéaux pour le linge hôtelier lavé très souvent.",
      "Les tissus de literie en microfibre offrent un toucher soyeux grâce à leurs fibres fines, sèchent vite et se froissent peu. En uni, rayé ou imprimé, nous travaillons aussi bien des collections maison que des projets en volume.",
    ],
    features: [
      { title: "Toucher doux", text: "Une surface lisse et agréable au contact de la peau." },
      { title: "Tenue au lavage", text: "Garde couleur et dimensions même avec des lavages fréquents." },
      { title: "Entretien facile", text: "Des qualités à séchage rapide et peu froissables." },
    ],
    uses: ["Parures de housse de couette", "Draps et taies d’oreiller", "Linge hôtelier", "Linge pour hôpitaux et internats", "Collections maison imprimées"],
    materialNotes: [
      "Le confort du coton, la résistance du polyester ; l’équilibre idéal pour un usage intensif.",
      "Des fibres ultrafines ; un linge de lit soyeux, léger et à séchage rapide.",
    ],
    finishes: ["Apprêt adoucissant", "Traitement anti-rétrécissement", "Base prête à imprimer (PFP)", "Apprêt antibactérien"],
  },
  "home-knit-velvet": {
    structure: "Raschel tricoté et velours",
    lead: "Pour les surfaces chaleureuses de la maison : des tissus maille et velours au toucher doux.",
    body: [
      "Cette famille est faite pour ce que l’on touche et dans quoi l’on s’enveloppe à la maison : plaids, coussins, jetés et objets décoratifs. Le raschel tricoté offre une surface extensible, légère et qui ne file pas, tandis que le velours apporte, par son poil, une chaleur visuelle et tactile.",
      "Les qualités à base de polyester et de viscose gardent des couleurs vives et s’entretiennent facilement. Nous définissons ensemble la couleur, la hauteur du poil et le grammage selon l’usage du produit.",
    ],
    features: [
      { title: "Douceur", text: "Un toucher chaud et doux, dès le premier contact." },
      { title: "Profondeur des couleurs", text: "Des tons riches sur le velours, qui changent avec la lumière." },
      { title: "Maille résistante", text: "La structure raschel ne file pas et garde sa forme." },
    ],
    uses: ["Plaids et châles", "Coussins et galettes", "Couvre-lits et chemins de lit", "Objets décoratifs pour la maison", "Linge de maison pour bébés et enfants"],
    materialNotes: [
      "Entretien facile et couleurs vives ; la fibre de base du linge de maison.",
      "Une fibre cellulosique qui apporte douceur et léger brillant.",
      "Une maille chaîne ; extensible, légère et qui ne file pas.",
      "Un poil court et dense ; toucher chaud et couleur profonde.",
    ],
    finishes: ["Apprêt adoucissant", "Traitement anti-perte de poils", "Anti-boulochage", "Motif gaufré"],
  },
  upholstery: {
    structure: "Suédine, raschel et velours d’ameublement",
    lead: "Pour les surfaces sur lesquelles on s’assoit, que l’on touche et utilise chaque jour : des tissus d’ameublement résistants et durables.",
    body: [
      "Les tissus d’ameublement subissent l’usage le plus intensif de la maison ; canapés, chaises et lits sont soumis aux frottements chaque jour. La résistance à l’abrasion, la tenue des coutures et la solidité des couleurs comptent donc autant que l’aspect.",
      "La suédine offre un toucher mat et velouté ; le velours, une couleur riche et profonde ; le raschel, une structure extensible et résistante. Pour la maison, le bureau, l’hôtel ou le café, nous choisissons ensemble la qualité adaptée à l’intensité d’usage.",
    ],
    features: [
      { title: "Résistance à l’abrasion", text: "Des surfaces durables, adaptées à un usage intensif." },
      { title: "Solidité des couleurs", text: "Des couleurs qui ne passent pas facilement au soleil et à l’usage." },
      { title: "Nettoyage facile", text: "Des qualités anti-taches, pratiques au quotidien." },
    ],
    uses: ["Canapés et fauteuils", "Chaises et poufs", "Sommiers et têtes de lit", "Mobilier d’hôtel, de café et de restaurant", "Assises de bureau"],
    materialNotes: [
      "À base de microfibre, mat et velouté ; un aspect intemporel.",
      "Une structure en maille chaîne ; extensible, résistante et qui ne file pas.",
      "Une surface à poil dense ; couleur riche et toucher luxueux.",
    ],
    finishes: ["Apprêt anti-taches et déperlant", "Qualités ignifugées (FR)", "Anti-boulochage", "Options easy-clean"],
  },
  mattress: {
    structure: "Coutil pour matelas",
    lead: "La face cachée du sommeil : des tissus respirants et résistants qui forment l’enveloppe du matelas.",
    body: [
      "Le tissu de matelas est l’enveloppe qui entoure le garnissage et influe directement sur le confort du sommeil. Il doit s’accorder au matelassage, respirer, rester bien tendu en surface et garder sa forme pendant des années.",
      "Les qualités polyester offrent résistance et solution économique, tandis que la viscose et le coton apportent un toucher plus doux et une meilleure gestion de l’humidité. Avec des options de motif et de couleur, nous construisons l’aspect du matelas autour de votre marque.",
    ],
    features: [
      { title: "Respirabilité", text: "Une structure aérée pour un couchage frais et sec." },
      { title: "Compatible matelassage", text: "Un tissu qui se pose proprement dans les piqûres, sans fronces." },
      { title: "Longévité", text: "Une résistance qui préserve forme et aspect pendant des années." },
    ],
    uses: ["Matelas et sommiers", "Protège-matelas", "Enveloppes d’oreillers et de couettes", "Matelas pour bébés et enfants", "Literie hôtelière"],
    materialNotes: [
      "Résistant et économique ; la fibre de base qui garde sa forme.",
      "Toucher doux et bonne absorption ; une surface fraîche.",
      "Naturel et respirant ; pour les peaux sensibles.",
    ],
    finishes: ["Apprêt antibactérien / anti-acariens", "Apprêt rafraîchissant (cooling)", "Qualités ignifugées (FR)", "Apprêt adoucissant"],
  },
  technical: {
    structure: "Tissages techniques teints en pièce et en fil",
    lead: "Des tissus qui travaillent en extérieur et sous charge : tissus techniques pour tentes, mobilier et sangles.",
    body: [
      "Pour les tissus techniques, la performance passe en premier : le tissu doit résister au soleil, à la pluie, à la tension et à l’usure. Nous travaillons des applications allant des toiles de tente et d’ombrage aux housses de mobilier de jardin, jusqu’aux sangles de portage et d’arrimage.",
      "Le mode de coloration se choisit selon l’usage : la teinture en pièce permet un travail de couleur souple et rapide, tandis que la teinture en fil fixe la couleur au niveau de la fibre pour une plus longue durée de vie en extérieur.",
    ],
    features: [
      { title: "Tenue en extérieur", text: "Résiste au soleil, à la pluie et aux variations de température." },
      { title: "Haute résistance", text: "Une structure résistante à la déchirure sous tension et sous charge." },
      { title: "Couleurs durables", text: "Des couleurs qui restent vives plus longtemps en extérieur." },
    ],
    uses: ["Tentes et ombrages", "Mobilier de jardin et d’extérieur", "Stores bannes et bâches", "Sangles de portage et d’arrimage", "Sacs et accessoires"],
    materialNotes: [
      "Teint en pièce après tissage ; souplesse et rapidité dans le choix des couleurs.",
      "Fil teint avant tissage ; grande solidité des couleurs et tenue en extérieur.",
    ],
    finishes: ["Enduction imperméable", "Résistance aux UV", "Qualités ignifugées (FR)", "Apprêt anti-moisissure"],
  },
};

const details = { tr, en, fr };
const labels = { tr: trLabels, en: enLabels, fr: frLabels };

export const getFabricDetail = (lang: Locale, slug: FabricSlug) => details[lang][slug];
export const getFabricLabels = (lang: Locale) => labels[lang];
/** All languages, the defaults the admin edits on top of */
export const fabricDetailsContent = details;
export const fabricLabelsContent = labels;
