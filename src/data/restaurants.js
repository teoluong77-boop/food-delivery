export const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'com', label: 'Cơm' },
  { id: 'bun-pho', label: 'Bún & phở' },
  { id: 'chay', label: 'Món chay' },
  { id: 'an-vat', label: 'Ăn vặt' }
]

export const sizes = [
  { id: 'S', label: 'Nhỏ', add: 0 },
  { id: 'M', label: 'Vừa', add: 8000 },
  { id: 'L', label: 'Lớn', add: 15000 }
]

export const toppings = [
  { id: 'trung', label: 'Trứng', price: 5000 },
  { id: 'pho-mai', label: 'Phô mai', price: 10000 },
  { id: 'rau', label: 'Thêm rau', price: 0 }
]

export const spiceLevels = ['Không cay', 'Cay vừa', 'Rất cay']

export const restaurants = [
  { 
    id: 'com-tam-ba-nam', 
    name: 'Cơm tấm Bà Năm', 
    category: 'com', 
    eta: 25, 
    rating: 4.7,
    address: '12 Nguyễn Trãi, Quận 5, TP.HCM', 
    hours: '9:00 - 21:00', 
    color: '#C2410C' 
  },
  { 
    id: 'pho-hanoi-24', 
    name: 'Phở Hà Nội 24', 
    category: 'bun-pho', 
    eta: 30, 
    rating: 4.5,
    address: '88 Lê Văn Sỹ, Quận 3, TP.HCM', 
    hours: '6:00 - 22:00', 
    color: '#0F766E' 
  },
  { 
    id: 'xanh-kitchen', 
    name: 'Xanh Kitchen', 
    category: 'chay', 
    eta: 20, 
    rating: 4.8,
    address: '5 Pasteur, Quận 1, TP.HCM', 
    hours: '8:00 - 20:00', 
    color: '#4D7C0F' 
  },
  { 
    id: 'xe-bap-chien', 
    name: 'Xế bắp chiên', 
    category: 'an-vat', 
    eta: 15, 
    rating: 4.3,
    address: '40 Hoàng Diệu, Quận 4, TP.HCM', 
    hours: '14:00 - 23:00', 
    color: '#A16207' 
  }
]

const item = (id, restaurantId, name, desc, price, kcal, o = {}) => ({
  id, 
  restaurantId, 
  name, 
  desc, 
  price, 
  kcal,
  salePrice: o.salePrice ?? null, 
  spicy: !!o.spicy, 
  veg: !!o.veg,
  tags: o.tags ?? [], 
  stock: o.stock ?? 10
})

const menuItemsRaw = [
  // Cơm tấm Bà Năm
  item('ct-suon', 'com-tam-ba-nam', 'Cơm tấm sườn nướng', 'Sườn nướng sả, chả trứng, bì, mỡ hành', 55000, 780, { tags: ['nướng', 'cơm'], stock: 12 }),
  item('ct-ga', 'com-tam-ba-nam', 'Cơm gà xối mỡ', 'Đùi gà chiên giòn, dưa leo, nước mắm chua ngọt', 50000, 720, { salePrice: 45000, tags: ['chiên', 'gà'] }),
  item('ct-canh', 'com-tam-ba-nam', 'Canh chua cá lóc', 'Canh chua miền Tây, ít dầu mỡ', 40000, 320, { tags: ['canh', 'nhẹ', 'healthy'], stock: 6 }),
  item('ct-bo', 'com-tam-ba-nam', 'Bò lúc lắc sốt tiêu', 'Bò mềm xào hành tây, tiêu đen cay nhẹ', 75000, 650, { spicy: true, tags: ['bò'], stock: 0 }),
  item('ct-cha', 'com-tam-ba-nam', 'Cơm tấm sườn bì chả', 'Sườn nướng mật ong, bì thính và chả trứng nhà làm', 62000, 820, { tags: ['nướng', 'cơm'] }),
  item('ct-heo-kho', 'com-tam-ba-nam', 'Cơm thịt kho trứng', 'Thịt ba chỉ kho nước dừa, trứng vịt và dưa giá', 58000, 760, { tags: ['cơm', 'truyền thống'] }),
  item('ct-tom-rim', 'com-tam-ba-nam', 'Cơm tôm rim mặn ngọt', 'Tôm rim nước mắm, ăn kèm rau luộc và cơm nóng', 59000, 540, { tags: ['cơm', 'hải sản'] }),
  item('ct-tra-dao', 'com-tam-ba-nam', 'Trà đào cam sả', 'Trà đào thơm mát, cam tươi và sả', 28000, 110, { tags: ['nước'] }),

  // Phở Hà Nội 24
  item('pho-tai', 'pho-hanoi-24', 'Phở bò tái', 'Nước dùng ninh xương 12 giờ', 60000, 480, { tags: ['phở', 'bò', 'nước'] }),
  item('pho-ga', 'pho-hanoi-24', 'Phở gà', 'Gà ta xé, hành lá, chanh', 55000, 410, { salePrice: 49000, tags: ['phở', 'gà', 'nhẹ'] }),
  item('bun-bo', 'pho-hanoi-24', 'Bún bò Huế', 'Sả ớt đậm vị, giò heo, chả cua', 65000, 590, { spicy: true, tags: ['bún', 'bò', 'nước'] }),
  item('goi-cuon', 'pho-hanoi-24', 'Gỏi cuốn tôm thịt', '2 cuốn, tương đậu phộng', 30000, 180, { tags: ['gỏi', 'nhẹ', 'healthy'], stock: 8 }),
  item('pho-bo-sot-vang', 'pho-hanoi-24', 'Phở bò sốt vang', 'Bò hầm vang mềm thơm, nước dùng đậm đà', 68000, 560, { tags: ['phở', 'bò'] }),
  item('bun-cha', 'pho-hanoi-24', 'Bún chả Hà Nội', 'Chả nướng than hoa, bún tươi và nước chấm', 62000, 610, { tags: ['bún', 'nướng'] }),
  item('mien-ga', 'pho-hanoi-24', 'Miến gà nấm hương', 'Gà xé, miến dong và nấm hương', 52000, 390, { tags: ['miến', 'gà', 'nhẹ'] }),
  item('pho-sua-dau-nanh', 'pho-hanoi-24', 'Sữa đậu nành', 'Sữa đậu nành nấu mới, dùng nóng hoặc lạnh', 18000, 130, { veg: true, tags: ['nước', 'chay'] }),

  // Xanh Kitchen
  item('xk-bun-chay', 'xanh-kitchen', 'Bún chay nấm', 'Nấm đông cô, đậu hũ, rau thơm', 48000, 390, { veg: true, tags: ['bún', 'chay', 'healthy'] }),
  item('xk-salad', 'xanh-kitchen', 'Salad quinoa', 'Quinoa, bơ, cà chua bi, sốt chanh', 59000, 310, { veg: true, salePrice: 52000, tags: ['salad', 'healthy', 'ít calo'] }),
  item('xk-com-chay', 'xanh-kitchen', 'Cơm gạo lứt đậu hũ sả ớt', 'Đậu hũ chiên sả ớt, rau củ luộc', 52000, 520, { veg: true, spicy: true, tags: ['cơm', 'chay'] }),
  item('xk-pho-chay', 'xanh-kitchen', 'Phở chay rau củ', 'Nước dùng rau củ, nấm tươi và đậu hũ', 49000, 350, { veg: true, tags: ['phở', 'chay', 'healthy'] }),
  item('xk-goi-ngu-sac', 'xanh-kitchen', 'Gỏi cuốn ngũ sắc', 'Cuốn rau củ, bún gạo lứt và sốt mè rang', 42000, 240, { veg: true, tags: ['chay', 'healthy'] }),
  item('xk-mi-xao', 'xanh-kitchen', 'Mì xào rau nấm', 'Mì trứng xào nấm, cải thìa và cà rốt', 50000, 430, { veg: true, tags: ['chay', 'mì'] }),
  item('xk-nuoc-ep', 'xanh-kitchen', 'Nước ép cam cà rốt', 'Cam tươi ép cùng cà rốt, không thêm đường', 32000, 95, { veg: true, tags: ['nước', 'ít calo'] }),

  // Xế bắp chiên
  item('xb-bap', 'xe-bap-chien', 'Bắp chiên bơ', 'Bắp ngọt chiên bơ, hành phi, tép khô', 25000, 340, { tags: ['ăn vặt', 'chiên'], stock: 15 }),
  item('xb-xien', 'xe-bap-chien', 'Xiên que nướng phô mai', '5 xiên mix, sốt phô mai', 35000, 450, { tags: ['nướng', 'ăn vặt'], stock: 3 }),
  item('xb-tra', 'xe-bap-chien', 'Trà tắc ít đường', 'Trà tắc tươi, ít đường', 18000, 60, { veg: true, tags: ['nước', 'ít calo'] }),
  item('xb-khoai', 'xe-bap-chien', 'Khoai lang kén', 'Khoai lang bọc lớp bột giòn, chiên vàng', 28000, 360, { veg: true, tags: ['ăn vặt', 'chiên'] }),
  item('xb-pho-mai', 'xe-bap-chien', 'Phô mai que', '5 que phô mai kéo sợi, lớp vỏ giòn rụm', 32000, 410, { veg: true, tags: ['ăn vặt', 'chiên'] }),
  item('xb-ca-vien', 'xe-bap-chien', 'Cá viên chiên thập cẩm', 'Cá viên, bò viên và xúc xích kèm tương', 35000, 390, { tags: ['ăn vặt', 'chiên'] }),
  item('xb-soda', 'xe-bap-chien', 'Soda chanh dây', 'Soda mát lạnh pha chanh dây tươi', 25000, 120, { veg: true, tags: ['nước'] })
]

// Map chính xác tên file thực tế trong thư mục public/images/menu
const dishImages = {
  // Cơm tấm Bà Năm
  'ct-suon': 'ct-suon.jpg',
  'ct-ga': 'ct-ga.jpg',
  'ct-canh': 'ct-canh.jpg',
  'ct-bo': 'ct-bo.jpg',
  'ct-cha': 'Cơm_Tấm_Sườn_Bì_Chả.jpg',
  'ct-heo-kho': 'Cơm_Thịt_Kho_Trứng.jpg',
  'ct-tom-rim': 'Cơm_Tôm_Rim_Mặn_Ngọt.jpg',
  'ct-tra-dao': 'Trà_Đào_Cam_Sả.jpg',

  // Phở Hà Nội 24
  'pho-tai': 'pho-tai.jpg',
  'pho-ga': 'pho-ga.jpg',
  'bun-bo': 'bun-bo.jpg',
  'goi-cuon': 'goi-cuon.jpg',
  'pho-bo-sot-vang': 'Phở_Bò_Sốt_Vang.jpg',
  'bun-cha': 'Bún_Chả_Hà_Nội.jpg',
  'mien-ga': 'Miến_Gà_Nấm_Hương.jpg',
  'pho-sua-dau-nanh': 'Sữa_Đậu_Nành.jpg',

  // Xanh Kitchen
  'xk-bun-chay': 'xk-bun-chay.jpg',
  'xk-salad': 'xk-salad.jpg',
  'xk-com-chay': 'xk-com-chay.jpg',
  'xk-pho-chay': 'Phở_Chay_Rau_Củ.jpg',
  'xk-goi-ngu-sac': 'Gỏi_Cuốn_Ngũ_Sắc.jpg',
  'xk-mi-xao': 'Mì_Xào_Rau_Nấm.jpg',
  'xk-nuoc-ep': 'Nước_Ép_Cam_Cà_Rốt.jpg',

  // Xế bắp chiên
  'xb-bap': 'xb-bap.jpg',
  'xb-xien': 'xb-xien.jpg',
  'xb-tra': 'xb-tra.jpg',
  'xb-khoai': 'Khoai_Lang_Kén.jpg',
  'xb-pho-mai': 'Phô_Mai_Que.jpg',
  'xb-ca-vien': 'Cá_Viên_Chiên_Thập_Cẩm.jpg',
  'xb-soda': 'Soda_Chanh_Dây.jpg'
}

export const menuItems = menuItemsRaw.map(it => ({
  ...it,
  image: `/images/menu/${dishImages[it.id]}`
}))

export const itemById = id => menuItems.find(i => i.id === id)
export const restaurantById = id => restaurants.find(r => r.id === id)

// Đơn giá = giá gốc (hoặc giá sale) + size + topping
export function priceOf(it, opt) {
  const base = it.salePrice ?? it.price
  const size = sizes.find(s => s.id === opt?.size)?.add ?? 0
  const topList = Array.isArray(opt?.toppings) ? opt.toppings : []
  const top = topList.reduce((t, id) => t + (toppings.find(x => x.id === id)?.price ?? 0), 0)
  return base + size + top
}

export const formatVND = n => (n ?? 0).toLocaleString('vi-VN') + 'đ'