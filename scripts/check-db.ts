import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const start = performance.now();
  console.log("🔍 Veritabanı bağlantısı kontrol ediliyor...");
  await prisma.$connect();
  const connectDuration = (performance.now() - start).toFixed(1);
  console.log(`✅ Bağlantı başarılı! (${connectDuration}ms)\n`);

  console.log("📊 Tablo Kayıt Sayıları:");
  const [
    users,
    categories,
    collections,
    products,
    productImages,
    blogCategories,
    blogs,
    pageContents,
    homepageSections,
    settings,
    mediaAssets,
    contactMessages,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.collection.count(),
    prisma.product.count(),
    prisma.productImage.count(),
    prisma.blogCategory.count(),
    prisma.blog.count(),
    prisma.pageContent.count(),
    prisma.homepageSection.count(),
    prisma.setting.count(),
    prisma.mediaAsset.count(),
    prisma.contactMessage.count(),
  ]);

  console.table({
    User: { Kayıt: users },
    Category: { Kayıt: categories },
    Collection: { Kayıt: collections },
    Product: { Kayıt: products },
    ProductImage: { Kayıt: productImages },
    BlogCategory: { Kayıt: blogCategories },
    Blog: { Kayıt: blogs },
    PageContent: { Kayıt: pageContents },
    HomepageSection: { Kayıt: homepageSections },
    Setting: { Kayıt: settings },
    MediaAsset: { Kayıt: mediaAssets },
    ContactMessage: { Kayıt: contactMessages },
  });

  console.log("\n🛡️ Veri Bütünlüğü Kontrolleri:");
  const [
    productsWithoutCategory,
    productsWithoutCollection,
    productsWithoutImages,
    mediaWithoutBytes,
    unreadMessages,
  ] = await Promise.all([
    prisma.product.count({ where: { categoryId: null } }),
    prisma.product.count({ where: { collectionId: null } }),
    prisma.product.count({ where: { images: { none: {} } } }),
    prisma.mediaAsset.count({ where: { data: null } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  console.log(`- Kategorisiz ürünler: ${productsWithoutCategory}`);
  console.log(`- Koleksiyonsuz ürünler: ${productsWithoutCollection}`);
  console.log(`- Görseli olmayan ürünler: ${productsWithoutImages}`);
  console.log(`- Boş (binary verisi eksik) medya: ${mediaWithoutBytes}`);
  console.log(`- Okunmamış mesajlar: ${unreadMessages}`);

  console.log("\n⚡ PostgreSQL İstatistik Güncellemesi (VACUUM ANALYZE)...");
  await prisma.$executeRawUnsafe("VACUUM ANALYZE;");
  console.log("✅ Sorgu optimizasyonu ve istatistikler güncellendi!");
}

main()
  .catch((e) => {
    console.error("❌ Veritabanı hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
