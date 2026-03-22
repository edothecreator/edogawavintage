import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const img = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=1400&q=82`;

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();

  const digital = await prisma.category.create({
    data: {
      slug: "digital-cameras",
      name: "Digital cameras",
      description: "Mirrorless and DSLR bodies curated for image quality and character.",
    },
  });
  const film = await prisma.category.create({
    data: {
      slug: "film-cameras",
      name: "Film cameras",
      description: "Analog bodies and rangefinders with timeless mechanical feel.",
    },
  });
  const camcorders = await prisma.category.create({
    data: {
      slug: "camcorders",
      name: "Camcorders",
      description: "Handheld cinema and archival recording instruments.",
    },
  });
  const accessories = await prisma.category.create({
    data: {
      slug: "accessories",
      name: "Accessories",
      description: "Glass, straps, bags, and essentials for your kit.",
    },
  });

  type SeedProduct = Omit<Prisma.ProductCreateInput, "category"> & {
    categoryId: string;
  };

  const products: SeedProduct[] = [
    {
      slug: "leica-q3-monochrome",
      name: "Leica Q3 Monochrome",
      brand: "Leica",
      categoryId: digital.id,
      price: new Prisma.Decimal(6295),
      currency: "USD",
      condition: "Excellent",
      shortDescription: "Full-frame monochrome compact with Summilux 28mm character.",
      fullDescription:
        "A distilled street and reportage tool with a dedicated monochrome sensor. Tactile dials, whisper-quiet shutter, and signature Leica micro-contrast. Inspected, sensor-cleaned, and bench-tested in our studio.",
      specs: {
        Sensor: "60MP full-frame B&W",
        Lens: "Summilux 28mm f/1.7 ASPH (fixed)",
        ISO: "100–100,000",
        Video: "8K / 4K capable",
      } as Prisma.InputJsonValue,
      includedItems: [
        "Body",
        "Original battery",
        "USB-C cable",
        "Edogawa inspection card",
      ] as Prisma.InputJsonValue,
      images: [
        img("photo-1516035069371-29a1b244cc32"),
        img("photo-1495121605193-baddb60c292d"),
      ] as Prisma.InputJsonValue,
      thumbnail: img("photo-1516035069371-29a1b244cc32"),
      inStock: true,
      quantity: 2,
      featured: true,
      tags: ["bestseller", "new"] as Prisma.InputJsonValue,
      badge: "featured",
    },
    {
      slug: "fujifilm-x100vi-silver",
      name: "Fujifilm X100VI",
      brand: "Fujifilm",
      categoryId: digital.id,
      price: new Prisma.Decimal(1699),
      currency: "USD",
      condition: "Mint",
      shortDescription: "Latest X100 generation with IBIS and classic silver finish.",
      fullDescription:
        "The cult compact evolved: in-body stabilization, latest X-Processor, and film simulations that feel alive. Perfect for daily carry without compromising on color science.",
      specs: {
        Sensor: "40.2MP APS-C X-Trans",
        Lens: "23mm f/2 (35mm equiv.)",
        Stabilization: "5-axis IBIS",
        Film: "20 simulations",
      } as Prisma.InputJsonValue,
      includedItems: ["Body", "Lens cap", "USB cable", "Strap"] as Prisma.InputJsonValue,
      images: [img("photo-1502920917128-1aa500764cb9")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1502920917128-1aa500764cb9"),
      inStock: true,
      quantity: 5,
      featured: true,
      tags: ["new", "bestseller"] as Prisma.InputJsonValue,
      badge: "new",
    },
    {
      slug: "sony-a7cr-body",
      name: "Sony Alpha 7CR (Body)",
      brand: "Sony",
      categoryId: digital.id,
      price: new Prisma.Decimal(2998),
      currency: "USD",
      condition: "Excellent",
      shortDescription: "Compact high-resolution E-mount body for travel and studio.",
      fullDescription:
        "61MP full-frame resolution in a travel-friendly footprint. Ideal for landscape and editorial workflows. Shutter count verified; ports and IBIS tested.",
      specs: {
        Sensor: "61MP full-frame",
        Mount: "Sony E",
        Video: "4K 60p",
        IBIS: "Yes",
      } as Prisma.InputJsonValue,
      includedItems: ["Body only", "Battery", "Charger"] as Prisma.InputJsonValue,
      images: [img("photo-1526170375885-4d8edc77a886")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1526170375885-4d8edc77a886"),
      inStock: true,
      quantity: 3,
      featured: false,
      tags: [] as Prisma.InputJsonValue,
      badge: null,
    },
    {
      slug: "canon-ae-1-program",
      name: "Canon AE-1 Program",
      brand: "Canon",
      categoryId: film.id,
      price: new Prisma.Decimal(289),
      currency: "USD",
      condition: "Good",
      shortDescription: "Classic FD-mount SLR with program auto for everyday shooting.",
      fullDescription:
        "A gateway into film with approachable controls and a huge lens ecosystem. Light brassing consistent with age; shutter speeds accurate within tolerance.",
      specs: {
        Mount: "Canon FD",
        Metering: "TTL",
        Power: "2x LR44 / 4LR44",
      } as Prisma.InputJsonValue,
      includedItems: ["Body", "Body cap"] as Prisma.InputJsonValue,
      images: [img("photo-1452587927108-aa8635c77f1f")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1452587927108-aa8635c77f1f"),
      inStock: true,
      quantity: 8,
      featured: true,
      tags: ["bestseller"] as Prisma.InputJsonValue,
      badge: null,
    },
    {
      slug: "contax-t2-champagne",
      name: "Contax T2",
      brand: "Contax",
      categoryId: film.id,
      price: new Prisma.Decimal(1299),
      currency: "USD",
      condition: "Excellent",
      shortDescription: "Zeiss lens compact with titanium build and cult following.",
      fullDescription:
        "The premium point-and-shoot era distilled: Sonnar 38mm f/2.8, autofocus, and a silhouette that fits a coat pocket. Glass clean; flash tested.",
      specs: {
        Lens: "Carl Zeiss Sonnar 38mm f/2.8",
        Film: "35mm",
        Power: "1x CR123",
      } as Prisma.InputJsonValue,
      includedItems: ["Camera", "Strap", "Soft pouch"] as Prisma.InputJsonValue,
      images: [img("photo-1526304640581-d334cdbbf45d")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1526304640581-d334cdbbf45d"),
      inStock: false,
      quantity: 0,
      featured: false,
      tags: ["rare"] as Prisma.InputJsonValue,
      badge: "rare",
    },
    {
      slug: "mamiya-rb67-pro-s",
      name: "Mamiya RB67 Pro-S",
      brand: "Mamiya",
      categoryId: film.id,
      price: new Prisma.Decimal(899),
      currency: "USD",
      condition: "Excellent",
      shortDescription: "Modular 6x7 studio workhorse with rotating back.",
      fullDescription:
        "The portrait photographer’s anchor: massive negatives, bellows focus, and a calm shooting rhythm. Body movements smooth; light seals replaced where needed.",
      specs: {
        Format: "6x7 cm",
        Shutter: "In-lens leaf",
        Movements: "Bellows focus, rotating back",
      } as Prisma.InputJsonValue,
      includedItems: ["Body", "120 back", "Waist-level finder"] as Prisma.InputJsonValue,
      images: [img("photo-1500634247344-2f0ae201c2b8")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1500634247344-2f0ae201c2b8"),
      inStock: true,
      quantity: 1,
      featured: true,
      tags: [] as Prisma.InputJsonValue,
      badge: null,
    },
    {
      slug: "sony-fx3-cinema-line",
      name: "Sony FX3",
      brand: "Sony",
      categoryId: camcorders.id,
      price: new Prisma.Decimal(3898),
      currency: "USD",
      condition: "Mint",
      shortDescription: "Compact cinema body with internal fan and S-Cinetone.",
      fullDescription:
        "Run-and-gun cinema with professional codecs, dual base ISO, and a body designed for rigs. Hours logged: low; includes cage-ready threads and tally.",
      specs: {
        Sensor: "12.1MP full-frame (video-optimized)",
        Codecs: "XAVC S / S-I",
        Stabilization: "Active IBIS",
      } as Prisma.InputJsonValue,
      includedItems: ["Body", "Top handle", "BP battery", "Charger"] as Prisma.InputJsonValue,
      images: [img("photo-1606983340126-99ab4feaa64a")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1606983340126-99ab4feaa64a"),
      inStock: true,
      quantity: 2,
      featured: true,
      tags: ["new"] as Prisma.InputJsonValue,
      badge: "new",
    },
    {
      slug: "canon-xa70-pro-camcorder",
      name: "Canon XA70",
      brand: "Canon",
      categoryId: camcorders.id,
      price: new Prisma.Decimal(1699),
      currency: "USD",
      condition: "Excellent",
      shortDescription: "1-inch sensor compact camcorder for events and documentary.",
      fullDescription:
        "Balanced handheld ergonomics with strong autofocus and XLR-ready workflow (via optional handle). Ideal for weddings and corporate capture.",
      specs: {
        Sensor: '1" CMOS',
        Zoom: "15x optical",
        Recording: "4K UHD",
      } as Prisma.InputJsonValue,
      includedItems: ["Camcorder", "Battery", "Charger", "Lens hood"] as Prisma.InputJsonValue,
      images: [img("photo-1492691527719-9d1e07e534b4")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1492691527719-9d1e07e534b4"),
      inStock: true,
      quantity: 4,
      featured: false,
      tags: [] as Prisma.InputJsonValue,
      badge: null,
    },
    {
      slug: "sigma-24-70-dg-dn-art",
      name: "Sigma 24-70mm f/2.8 DG DN Art",
      brand: "Sigma",
      categoryId: accessories.id,
      price: new Prisma.Decimal(1099),
      currency: "USD",
      condition: "Mint",
      shortDescription: "Pro-standard zoom for Sony E-mount with Art-line rendering.",
      fullDescription:
        "The workhorse zoom: fast aperture through the range, weather sealing, and consistent sharpness for events and editorial. Front and rear caps included.",
      specs: {
        Mount: "Sony E (tested)",
        Aperture: "f/2.8 constant",
        Filter: "82mm",
      } as Prisma.InputJsonValue,
      includedItems: ["Lens", "Caps", "Hood", "Pouch"] as Prisma.InputJsonValue,
      images: [img("photo-1617005082138-8c86a2a9e3a4")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1617005082138-8c86a2a9e3a4"),
      inStock: true,
      quantity: 6,
      featured: false,
      tags: ["bestseller"] as Prisma.InputJsonValue,
      badge: null,
    },
    {
      slug: "peak-design-everyday-sling-6l",
      name: "Peak Design Everyday Sling 6L",
      brand: "Peak Design",
      categoryId: accessories.id,
      price: new Prisma.Decimal(159),
      currency: "USD",
      condition: "Excellent",
      shortDescription: "MagLatch sling for a body plus one lens.",
      fullDescription:
        "Flexible dividers, weather-resistant shell, and quick-adjust strap hardware. Sized for mirrorless kits and compact film sets.",
      specs: {
        Volume: "6L",
        Carry: "Sling / waist",
        Laptop: "No",
      } as Prisma.InputJsonValue,
      includedItems: ["Bag", "FlexFold dividers"] as Prisma.InputJsonValue,
      images: [img("photo-1553062407-98eeb64c6a62")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1553062407-98eeb64c6a62"),
      inStock: true,
      quantity: 10,
      featured: false,
      tags: [] as Prisma.InputJsonValue,
      badge: null,
    },
    {
      slug: "nikon-zf-black",
      name: "Nikon Zf",
      brand: "Nikon",
      categoryId: digital.id,
      price: new Prisma.Decimal(1999),
      currency: "USD",
      condition: "Mint",
      shortDescription: "Full-frame retro body with dedicated B&W mode and dials.",
      fullDescription:
        "Where heritage ergonomics meet modern autofocus. A joy for stills-first photographers who want soul in the hand and precision in the AF system.",
      specs: {
        Sensor: "24.5MP BSI full-frame",
        Mount: "Nikon Z",
        Stabilization: "5-axis IBIS",
      } as Prisma.InputJsonValue,
      includedItems: ["Body", "Battery", "Charger", "Strap"] as Prisma.InputJsonValue,
      images: [img("photo-1502920917128-1aa500764cb9")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1502920917128-1aa500764cb9"),
      inStock: false,
      quantity: 0,
      featured: false,
      tags: [] as Prisma.InputJsonValue,
      badge: null,
    },
    {
      slug: "rollei-35-se",
      name: "Rollei 35 SE",
      brand: "Rollei",
      categoryId: film.id,
      price: new Prisma.Decimal(549),
      currency: "USD",
      condition: "Good",
      shortDescription: "Tiny full-frame 35mm with Sonnar 40mm f/2.8.",
      fullDescription:
        "One of the smallest full-frame film cameras ever made. Meter tested; patina on brassing adds character. Perfect for slow, deliberate frames.",
      specs: {
        Lens: "Sonnar 40mm f/2.8 HFT",
        Metering: "TTL",
      } as Prisma.InputJsonValue,
      includedItems: ["Camera", "Case"] as Prisma.InputJsonValue,
      images: [img("photo-1452587927108-aa8635c77f1f")] as Prisma.InputJsonValue,
      thumbnail: img("photo-1452587927108-aa8635c77f1f"),
      inStock: true,
      quantity: 2,
      featured: false,
      tags: ["new"] as Prisma.InputJsonValue,
      badge: "new",
    },
  ];

  for (const p of products) {
    const { categoryId, ...rest } = p;
    await prisma.product.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
      },
    });
  }

  const faqs = [
    {
      question: "Are the cameras tested?",
      answer:
        "Yes. Every body and lens passes a focused inspection: shutter accuracy where applicable, sensor or film plane checks, mount tolerances, and basic function cycles.",
      sortOrder: 0,
    },
    {
      question: "What condition are items in?",
      answer:
        "We grade clearly: Mint, Excellent, Good, or Fair—with notes on brassing, glass dust, and operational caveats on each product page.",
      sortOrder: 1,
    },
    {
      question: "What comes with the camera?",
      answer:
        "Each listing lists included accessories explicitly. If it is not listed, assume it is not included unless our team confirms otherwise after purchase.",
      sortOrder: 2,
    },
    {
      question: "How long does delivery take?",
      answer:
        "Domestic orders typically dispatch within 2–4 business days after confirmation. You will receive a personal confirmation call or message from our team.",
      sortOrder: 3,
    },
    {
      question: "Can I return or exchange?",
      answer:
        "See our Return & Refund Policy. Unopened or defective-on-arrival cases are prioritized; vintage items may have additional terms noted at checkout.",
      sortOrder: 4,
    },
    {
      question: "How do I place an order?",
      answer:
        "Add items to your cart, proceed to checkout, and choose card or cash on delivery. Our team will contact you shortly to confirm details.",
      sortOrder: 5,
    },
    {
      question: "Can I pay on delivery?",
      answer:
        "Yes—select Cash on Delivery at checkout. A team member will confirm availability and delivery arrangements before finalizing.",
      sortOrder: 6,
    },
    {
      question: "What if an item is sold out?",
      answer:
        "Sold-out pieces remain visible for reference in our archive where noted. Our assistant can only recommend in-stock items from the live catalog.",
      sortOrder: 7,
    },
  ];

  for (const f of faqs) {
    await prisma.faq.create({ data: f });
  }

  const testimonials = [
    {
      quote:
        "It felt less like buying gear and more like joining a quiet club of people who still believe in the ritual of making pictures.",
      author: "M. Okada",
      role: "Editorial photographer",
      sortOrder: 0,
    },
    {
      quote:
        "The Contax arrived exactly as described—tested, honest notes, and packaging that respected the object.",
      author: "S. Laurent",
      role: "Filmmaker",
      sortOrder: 1,
    },
    {
      quote:
        "Finally a shop that treats cameras as instruments, not commodities.",
      author: "J. Reyes",
      role: "Collector",
      sortOrder: 2,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log("Seed completed: categories, products, FAQ, testimonials.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
