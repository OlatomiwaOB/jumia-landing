export const getMockedProducts = (initialBaseProduct: any) => {
  let allMocks: any[] = [];
  const baseProduct = { ...initialBaseProduct, code: undefined };
  const customFirstRow = [
    { ...baseProduct, name: "Disha Rice 5kg", salePrice: 9.99, oldPrice: undefined, rating: 5, picture: "/disha-rice.png", id: "mock-disha" },
    { ...baseProduct, name: "Tilda Basmati Rice 5kg", salePrice: 11.99, oldPrice: undefined, rating: 5, picture: "/tilda-5kg.png", id: "mock-tilda-5" },
    { ...baseProduct, name: "Tilda Long Grain Rice 10kg", salePrice: 16.99, oldPrice: undefined, rating: 4, picture: "/tilda-10kg.png", id: "mock-tilda-10" },
    { ...baseProduct, name: "Tilda Long Grain Rice 20kg", salePrice: 28.99, oldPrice: undefined, rating: 4, picture: "/tilda-20kg.png", id: "mock-tilda-20" },
  ];

  let customSecondRow = [
    { ...baseProduct, name: "Aani Basmati Rice 10kg", salePrice: 19.50, oldPrice: undefined, rating: 4, picture: "/aani-10kg.png", id: "mock-aani-10", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Aani Basmati Rice 20kg", salePrice: 35.99, oldPrice: undefined, rating: 4, picture: "/aani-20kg.png", id: "mock-aani-20", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "African Finest Jollof Rice 10kg", salePrice: 19.99, oldPrice: undefined, rating: 5, picture: "/african-finest.png", id: "mock-african", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Tolly Boy Rice 5kg", salePrice: 8.99, oldPrice: undefined, rating: 4, picture: "/tolly-boy.png", id: "mock-tolly-5", imageClass: "scale-125 group-hover:scale-[1.35]" },
  ];

  let customThirdRow = [
    { ...baseProduct, name: "Tolly Boy Rice 10kg", salePrice: 15.99, oldPrice: undefined, rating: 4, picture: "/tolly-10kg.png", id: "mock-tolly-10", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Tolly Boy Rice 20kg", salePrice: 28.99, oldPrice: undefined, rating: 4, picture: "/tolly-20kg.png", id: "mock-tolly-20", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Tropical Sun Basmati Rice 10kg", salePrice: 19.99, oldPrice: undefined, rating: 5, picture: "/tropical-sun.png", id: "mock-tropical", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Knorr Beef Cubes", salePrice: 2.20, oldPrice: undefined, rating: 5, picture: "/knorr-beef.png", id: "mock-knorr", imageClass: "scale-125 group-hover:scale-[1.35]" },
  ];

  let customFourthRow = [
    { ...baseProduct, name: "Maggi Star Cubes", salePrice: 2.20, oldPrice: undefined, rating: 5, picture: "/maggi-cubes.png", id: "mock-maggi", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Tasty Cube", salePrice: 3.50, oldPrice: undefined, rating: 4, picture: "/tasty-cube.png", id: "mock-tasty", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Rajah Curry Powder", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/rajah-curry.png", id: "mock-rajah-curry", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Rajah Chicken Seasoning 100g", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/rajah-chicken.png", id: "mock-rajah-chicken", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Knorr Chicken Cubes", salePrice: 2.20, oldPrice: undefined, rating: 4, picture: "/knorr-beef.png", id: "mock-knorr-chic", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Maggi Chicken Cubes", salePrice: 2.50, oldPrice: undefined, rating: 4, picture: "/maggi-cubes.png", id: "mock-maggi-chic", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Maggi Crayfish Cubes", salePrice: 2.50, oldPrice: undefined, rating: 4, picture: "/maggi-cubes.png", id: "mock-maggi-cray", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Maggi Star Cubes", salePrice: 2.50, oldPrice: undefined, rating: 4, picture: "/maggi-cubes.png", id: "mock-maggi-star", imageClass: "scale-125 group-hover:scale-[1.35]" },
  ];

  let customFifthRow = [
    { ...baseProduct, name: "Royco Chicken Cubes", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/knorr-beef.png", id: "mock-royco", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Onga Chicken Seasoning", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/spicity-jollof.png", id: "mock-onga-chic", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Onga Classic Seasoning", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/spicity-fried.png", id: "mock-onga-clas", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Onga Stew Seasoning", salePrice: 1.50, oldPrice: undefined, rating: 5, picture: "/tasty-cube.png", id: "mock-onga-stew", imageClass: "scale-125 group-hover:scale-[1.35]" },
  ];

  let customSixthRow = [
    { ...baseProduct, name: "Ducros Curry Powder", salePrice: 1.20, oldPrice: undefined, rating: 5, picture: "/ducros-thyme.png", id: "mock-ducros", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Lion Curry Powder", salePrice: 1.10, oldPrice: undefined, rating: 4, picture: "/tiger-masala.png", id: "mock-lion-curry", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Lion Dried Thyme", salePrice: 1.10, oldPrice: undefined, rating: 4, picture: "/tiger-masala.png", id: "mock-lion-thyme", imageClass: "scale-125 group-hover:scale-[1.35]" },
    { ...baseProduct, name: "Village Pride Jollof Rice Seasoning", salePrice: 2.50, oldPrice: undefined, rating: 5, picture: "/party-jollof.png", id: "mock-vp-jollof", imageClass: "scale-125 group-hover:scale-[1.35]" },
  ];

  allMocks.push(...[...customFirstRow, ...customSecondRow, ...customThirdRow, ...customFourthRow, ...customFifthRow, ...customSixthRow]);

  // Custom override for Page 2 cards
  const page2BaseProduct = { ...(baseProduct), code: undefined };

  let row1 = [
    { ...page2BaseProduct, name: "Euroma Bay Leaf 50g", salePrice: 1.50, oldPrice: undefined, rating: 5, picture: "/euroma-bay.png", id: "p2-mock-1", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Gino Pepper and Onion Roll", salePrice: 2.50, oldPrice: undefined, rating: 5, picture: "/gino-pepper.png", id: "p2-mock-2", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Party Jollof Roll", salePrice: 2.50, oldPrice: undefined, rating: 4, picture: "/party-jollof.png", id: "p2-mock-3", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Derica Tomato Paste 400g", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/derica-tomato.png", id: "p2-mock-4", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let row2 = [
    { ...page2BaseProduct, name: "Derica Tomato Paste 850g", salePrice: 3.50, oldPrice: undefined, rating: 4, picture: "/derica-850g.jpg", id: "p2-mock-5", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Maltina Can (Pack)", salePrice: 13.00, oldPrice: undefined, rating: 5, picture: "/maltina-can-pack.png", id: "p2-mock-6", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Maltina Bottle (each)", salePrice: 1.00, oldPrice: undefined, rating: 5, picture: "/maltina-bottle.jpg", id: "p2-mock-7", imageClass: "scale-[0.85] group-hover:scale-[0.95]" },
    { ...page2BaseProduct, name: "Malta Guinness Can (Pack)", salePrice: 13.00, oldPrice: undefined, rating: 5, picture: "/malta-guinness-can-pack.jpg", id: "p2-mock-8", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let row3 = [
    { ...page2BaseProduct, name: "Amstel Can (Pack)", salePrice: 13.00, oldPrice: undefined, rating: 4, picture: "/amstel-can-pack.jpg", id: "p2-mock-9", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Chi Exotic (each)", salePrice: 3.50, oldPrice: undefined, rating: 5, picture: "/chi-exotic.jpg", id: "p2-mock-10", imageClass: "scale-[0.85] group-hover:scale-[0.95]" },
    { ...page2BaseProduct, name: "Frozen Beef (per kg)", salePrice: 9.99, oldPrice: undefined, rating: 4, picture: "/frozen-beef.jpg", id: "p2-mock-11", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Boneless Goat Meat (per kg)", salePrice: 10.99, oldPrice: undefined, rating: 5, picture: "/boneless-goat-meat.jpg", id: "p2-mock-12", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let row4 = [
    { ...page2BaseProduct, name: "Naija Goat Meat with Skin", salePrice: 19.50, oldPrice: undefined, rating: 5, picture: "/naija-goat-meat.jpg", id: "p2-mock-13", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Abodi (per kg)", salePrice: 4.50, oldPrice: undefined, rating: 4, picture: "/abodi.jpg", id: "p2-mock-14", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Shaki Box (20kg)", salePrice: 65.00, oldPrice: undefined, rating: 4, picture: "/shaki-box.jpg", id: "p2-mock-15", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Assorted Meat Pack", salePrice: 6.50, oldPrice: undefined, rating: 5, picture: "/assorted-meat.jpg", id: "p2-mock-16", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let row5 = [
    { ...page2BaseProduct, name: "Chicken Gizzard (per kg)", salePrice: 3.30, oldPrice: undefined, rating: 4, picture: "/chicken-gizzard.jpg", id: "p2-mock-17", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Turkey Gizzard Box", salePrice: 48.00, oldPrice: undefined, rating: 4, picture: "/turkey-gizzard-box.jpg", id: "p2-mock-18", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Turkey Gizzard (per kg)", salePrice: 4.99, oldPrice: undefined, rating: 4, picture: "/turkey-gizzard.jpg", id: "p2-mock-19", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Turkey Box", salePrice: 38.00, oldPrice: undefined, rating: 4, picture: "/turkey-box.jpg", id: "p2-mock-20", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let row6 = [
    { ...page2BaseProduct, name: "Chicken Box (Orobo)", salePrice: 20.50, oldPrice: undefined, rating: 4, picture: "/chicken-box-orobo.jpg", id: "p2-mock-21", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Boneless Cowleg (per kg)", salePrice: 6.50, oldPrice: undefined, rating: 4, picture: "/boneless-cowleg.jpg", id: "p2-mock-22", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Tilapia Fish Box", salePrice: 18.00, oldPrice: undefined, rating: 4, picture: "/tilapia-fish-box.jpg", id: "p2-mock-23", imageClass: "scale-110 group-hover:scale-125" },
    { ...page2BaseProduct, name: "Hake Fish Box", salePrice: 50.00, oldPrice: undefined, rating: 4, picture: "/hake-fish-box.jpg", id: "p2-mock-24", imageClass: "scale-110 group-hover:scale-125" },
  ];

  allMocks.push(...[...row1, ...row2, ...row3, ...row4, ...row5, ...row6]);

  // Custom override for Page 3
  const page3BaseProduct = baseProduct;

  let p3row1 = [
    { ...page3BaseProduct, name: "Prawn", salePrice: 7.00, oldPrice: undefined, rating: 4, picture: "/prawn.jpg", id: "p3-mock-1", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Smoked Turkey Box", salePrice: 28.00, oldPrice: undefined, rating: 5, picture: "/smoked-turkey-box.jpg", id: "p3-mock-2", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Smoked Mackerel (each)", salePrice: 3.00, oldPrice: undefined, rating: 4, picture: "/smoked-mackerel.jpg", id: "p3-mock-3", imageClass: "scale-110 group-hover:scale-125", qtyInStore: 0 },
    { ...page3BaseProduct, name: "Abodi Half Box", salePrice: 20.00, oldPrice: undefined, rating: 4, picture: "/abodi-half-box.jpg", id: "p3-mock-4", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p3row2 = [
    { ...page3BaseProduct, name: "Turkey Quarter Box", salePrice: 10.00, oldPrice: undefined, rating: 4, picture: "/turkey-quarter-box.jpg", id: "p3-mock-5", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Shaki Half Box", salePrice: 32.50, oldPrice: undefined, rating: 4, picture: "/shaki-half-box.jpg", id: "p3-mock-6", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Shaki Quarter Box", salePrice: 16.50, oldPrice: undefined, rating: 4, picture: "/shaki-quarter-box.jpg", id: "p3-mock-7", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Cow Ear Box", salePrice: 30.00, oldPrice: undefined, rating: 4, picture: "/cow-ear-box.jpg", id: "p3-mock-8", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p3row3 = [
    { ...page3BaseProduct, name: "Cow Ear Quarter", salePrice: 7.50, oldPrice: undefined, rating: 4, picture: "/cow-ear-box.jpg", id: "p3-mock-9", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Indomie Chicken Noodles", salePrice: 9.50, oldPrice: undefined, rating: 5, picture: "/indomie-chicken.jpg", id: "p3-mock-10", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Indomie Onion Noodles", salePrice: 9.99, oldPrice: undefined, rating: 5, picture: "/indomie-onion.jpg", id: "p3-mock-11", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Peak Milk 2500g", salePrice: 22.99, oldPrice: undefined, rating: 5, picture: "/peak-milk-2500g.jpg", id: "p3-mock-12", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p3row4 = [
    { ...page3BaseProduct, name: "Peak Milk 900g", salePrice: 11.99, oldPrice: undefined, rating: 5, picture: "/peak-milk-900g.jpg", id: "p3-mock-13", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Ovaltine 800g", salePrice: 8.50, oldPrice: undefined, rating: 4, picture: "/ovaltine.jpg", id: "p3-mock-14", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Ovaltine 450g", salePrice: 4.50, oldPrice: undefined, rating: 4, picture: "/ovaltine.jpg", id: "p3-mock-15", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Checkers Custard 3in1", salePrice: 8.99, oldPrice: undefined, rating: 4, picture: "/checkers-custard-3in1.jpg", id: "p3-mock-16", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p3row5 = [
    { ...page3BaseProduct, name: "Golden Morn 900g", salePrice: 4.99, oldPrice: undefined, rating: 5, picture: "/golden-morn.jpg", id: "p3-mock-17", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Spaghetti (each)", salePrice: 1.20, oldPrice: undefined, rating: 4, picture: "/spaghetti-each.jpg", id: "p3-mock-18", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Nasco Cornflakes", salePrice: 5.50, oldPrice: undefined, rating: 4, picture: "/nasco-cornflakes.jpg", id: "p3-mock-19", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Grandios Pap (Yellow/White)", salePrice: 2.50, oldPrice: undefined, rating: 4, picture: "/grandios-pap.jpg", id: "p3-mock-20", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p3row6 = [
    { ...page3BaseProduct, name: "Hollandia Evaporated Milk", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/hollandia-milk.jpg", id: "p3-mock-21", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Aboniki Balm", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/aboniki-balm.jpg", id: "p3-mock-22", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Robb Balm", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/robb-balm.jpg", id: "p3-mock-23", imageClass: "scale-110 group-hover:scale-125" },
    { ...page3BaseProduct, name: "Ayoola Poundo Yam 9.1kg", salePrice: 26.00, oldPrice: undefined, rating: 5, picture: "/ayoola-poundo-yam-91kg.jpg", id: "p3-mock-24", imageClass: "scale-110 group-hover:scale-125" },
  ];

  allMocks.push(...[...p3row1, ...p3row2, ...p3row3, ...p3row4, ...p3row5, ...p3row6]);

  // Custom override for Page 4
  const page4BaseProduct = baseProduct;

  let p4row1 = [
    { ...page4BaseProduct, name: "Ayoola Poundo Yam 4.5kg", salePrice: 14.00, oldPrice: undefined, rating: 5, picture: "/ayoola-poundo-yam.jpg", id: "p4-mock-1", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Ayoola Poundo Yam 900g", salePrice: 3.50, oldPrice: undefined, rating: 5, picture: "/ayoola-poundo-yam.jpg", id: "p4-mock-2", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Olu Olu Poundo Yam 8kg", salePrice: 25.99, oldPrice: undefined, rating: 5, picture: "/olu-olu-poundo-yam.jpg", id: "p4-mock-3", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Semovita 5kg", salePrice: 9.99, oldPrice: undefined, rating: 5, picture: "/semovita.jpg", id: "p4-mock-4", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p4row2 = [
    { ...page4BaseProduct, name: "Yam Flour 20kg", salePrice: 60.00, oldPrice: undefined, rating: 4, picture: "/yam-flour.jpg", id: "p4-mock-5", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Yam Flour 5kg", salePrice: 15.00, oldPrice: undefined, rating: 4, picture: "/yam-flour.jpg", id: "p4-mock-6", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Honey Beans 20kg", salePrice: 65.00, oldPrice: undefined, rating: 5, picture: "/honey-beans-new.jpg", id: "p4-mock-7", imageClass: "scale-110 group-hover:scale-125", qtyInStore: 10 },
    { ...page4BaseProduct, name: "Honey Beans 5kg", salePrice: 16.99, oldPrice: undefined, rating: 5, picture: "/honey-beans-new.jpg", id: "p4-mock-8", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p4row3 = [
    { ...page4BaseProduct, name: "Peeled Beans 2kg", salePrice: 6.00, oldPrice: undefined, rating: 4, picture: "/peeled-beans-2kg.jpg", id: "p4-mock-9", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Blackeye Beans 5kg", salePrice: 12.00, oldPrice: undefined, rating: 4, picture: "/blackeye-beans-5kg.jpg", id: "p4-mock-10", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Garri Ijebu 20kg", salePrice: 27.00, oldPrice: undefined, rating: 5, picture: "/garri-ijebu-20kg.jpg", id: "p4-mock-11", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Garri Ijebu 5kg", salePrice: 7.50, oldPrice: undefined, rating: 5, picture: "/garri-ijebu-5kg.jpg", id: "p4-mock-12", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p4row4 = [
    { ...page4BaseProduct, name: "Olu Olu Poundo Yam 9.1kg", salePrice: 26.99, oldPrice: undefined, rating: 5, picture: "/olu-olu-poundo-yam-91kg.jpg", id: "p4-mock-13", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Tropical Sun Sunflower Oil 5L", salePrice: 8.50, oldPrice: undefined, rating: 4, picture: "/tropical-sun-sunflower-oil.jpg", id: "p4-mock-14", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "KTC Vegetable Oil 5L", salePrice: 8.99, oldPrice: undefined, rating: 4, picture: "/ktc-vegetable-oil.jpg", id: "p4-mock-15", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Banga Palm Oil 2L", salePrice: 8.50, oldPrice: undefined, rating: 5, picture: "/banga-palm-oil-2l.jpg", id: "p4-mock-16", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p4row5 = [
    { ...page4BaseProduct, name: "Banga Palm Oil 4L", salePrice: 13.99, oldPrice: undefined, rating: 5, picture: "/banga-palm-oil-4l.jpg", id: "p4-mock-17", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Exotic Palm Oil 1L", salePrice: 3.99, oldPrice: undefined, rating: 5, picture: "/exotic-palm-oil-1l.jpg", id: "p4-mock-18", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Exotic Palm Oil 2L", salePrice: 7.50, oldPrice: undefined, rating: 5, picture: "/exotic-palm-oil-2l.jpg", id: "p4-mock-19", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Ogbono Whole 500g", salePrice: 12.00, oldPrice: undefined, rating: 5, picture: "/ogbono-whole-500g.jpg", id: "p4-mock-20", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p4row6 = [
    { ...page4BaseProduct, name: "Whole Egusi Paint Bucket", salePrice: 19.00, oldPrice: undefined, rating: 5, picture: "/whole-egusi-paint-bucket.jpg", id: "p4-mock-21", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Blended Egusi 250g", salePrice: 3.00, oldPrice: undefined, rating: 5, picture: "/blended-egusi-250g.jpg", id: "p4-mock-22", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Whole Crayfish Paint Bucket", salePrice: 12.00, oldPrice: undefined, rating: 4, picture: "/whole-crayfish-paint-bucket.jpg", id: "p4-mock-23", imageClass: "scale-110 group-hover:scale-125" },
    { ...page4BaseProduct, name: "Achi Powder", salePrice: 1.99, oldPrice: undefined, rating: 4, picture: "/achi-powder.jpg", id: "p4-mock-24", imageClass: "scale-110 group-hover:scale-125" },
  ];

  allMocks.push(...[...p4row1, ...p4row2, ...p4row3, ...p4row4, ...p4row5, ...p4row6]);

  // Custom override for Page 5
  const page5BaseProduct = baseProduct;

  let p5row1 = [
    { ...page5BaseProduct, name: "Tropical Sun Coconut Chin Chin 250g", salePrice: 2.50, oldPrice: undefined, rating: 5, picture: "/chin-chin-coconut.jpg", id: "p5-mock-1", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Chips 80g Carton (Mixed)", salePrice: 18.99, oldPrice: undefined, rating: 4, picture: "/chips-80g-carton.jpg", id: "p5-mock-2", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Chips Bucket (Mixed Flavours)", salePrice: 4.30, oldPrice: undefined, rating: 4, picture: "/chips-bucket-mixed.jpg", id: "p5-mock-3", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Baba Blue Sweets", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/baba-blue-sweets.jpg", id: "p5-mock-4", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p5row2 = [
    { ...page5BaseProduct, name: "Vicks Lemon Plus", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/vicks-lemon-plus.jpg", id: "p5-mock-5", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Fresh Garlic Whole", salePrice: 1.50, oldPrice: undefined, rating: 4, picture: "/fresh-garlic-whole.jpg", id: "p5-mock-6", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "White Onions 4kg", salePrice: 3.50, oldPrice: undefined, rating: 4, picture: "/white-onions-4kg.jpg", id: "p5-mock-7", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "White Onions 20kg", salePrice: 12.00, oldPrice: undefined, rating: 4, picture: "/white-onions-20kg.jpg", id: "p5-mock-8", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p5row3 = [
    { ...page5BaseProduct, name: "Ugu Leaf (Pumpkin Leaf)", salePrice: 2.00, oldPrice: undefined, rating: 5, picture: "/ugu-leaf.jpg", id: "p5-mock-9", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Shoko Leaf", salePrice: 2.00, oldPrice: undefined, rating: 4, picture: "/shoko-leaf.jpg", id: "p5-mock-10", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Afang Leaf", salePrice: 2.00, oldPrice: undefined, rating: 5, picture: "/afang-leaf.jpg", id: "p5-mock-11", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Oha Leaf", salePrice: 2.00, oldPrice: undefined, rating: 5, picture: "/oha-leaf.jpg", id: "p5-mock-12", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p5row4 = [
    { ...page5BaseProduct, name: "Okro Half Box", salePrice: 13.00, oldPrice: undefined, rating: 5, picture: "/okro-half-box.jpg", id: "p5-mock-13", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Yam (Whole)", salePrice: 28.00, oldPrice: undefined, rating: 5, picture: "/yam-whole.jpg", id: "p5-mock-14", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Yam Quarter", salePrice: 7.00, oldPrice: undefined, rating: 5, picture: "/yam-whole.jpg", id: "p5-mock-15", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Plantain Box", salePrice: 48.00, oldPrice: undefined, rating: 5, picture: "/plantain-box.jpg", id: "p5-mock-16", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p5row5 = [
    { ...page5BaseProduct, name: "Plantain Half Box", salePrice: 24.00, oldPrice: undefined, rating: 5, picture: "/plantain-half-box.jpg", id: "p5-mock-17", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Tomatoes", salePrice: 12.00, oldPrice: undefined, rating: 5, picture: "/tomatoes.jpg", id: "p5-mock-18", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Tomatoes Half", salePrice: 6.00, oldPrice: undefined, rating: 5, picture: "/tomatoes.jpg", id: "p5-mock-19", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Long Pepper Half", salePrice: 6.00, oldPrice: undefined, rating: 5, picture: "/long-pepper-half.jpg", id: "p5-mock-20", imageClass: "scale-110 group-hover:scale-125" },
  ];

  let p5row6 = [
    { ...page5BaseProduct, name: "Bell Pepper Half", salePrice: 6.50, oldPrice: undefined, rating: 5, picture: "/bell-pepper-half.jpg", id: "p5-mock-21", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Village Pride Long Grain 10kg", salePrice: 11.99, oldPrice: undefined, rating: 5, picture: "/village-pride-rice.jpg", id: "p5-mock-22", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Disha Rice 10kg", salePrice: 18.99, oldPrice: undefined, rating: 5, picture: "/disha-rice.jpg", id: "p5-mock-23", imageClass: "scale-110 group-hover:scale-125" },
    { ...page5BaseProduct, name: "Tilda Basmati Rice 10kg", salePrice: 20.99, oldPrice: undefined, rating: 5, picture: "/tilda-rice.jpg", id: "p5-mock-24", imageClass: "scale-110 group-hover:scale-125" },
  ];

  allMocks.push(...[...p5row1, ...p5row2, ...p5row3, ...p5row4, ...p5row5, ...p5row6]);

  return allMocks;
};
