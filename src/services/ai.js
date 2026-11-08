import { menuItems } from '../data/restaurants'

const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')

/** AI mô phỏng: phân tích câu tiếng Việt thành ràng buộc rồi chấm điểm món. */
export function mockSuggest(query) {
  const q = norm(query)

  if (/^(hi|hello|helo|hey|alo|chao|xin chao)\b/.test(q)) {
    return {
      items: [],
      reply: 'Xin chào! Bạn thử mô tả món muốn ăn nhé, ví dụ: "đồ chay dưới 50k" hoặc "món nhẹ dưới 400 kcal".'
    }
  }

  const kcalMatch = q.match(/(?:duoi|<|toi da)\s*(\d{3,4})\s*(?:kcal|calo|cal)\b/)
  const maxKcal = Number(kcalMatch?.[1]) || (/(it calo|healthy|nhe|giam can|eat clean)/.test(q) ? 450 : null)
  const priceMatch = q.match(/(?:duoi|<|toi da)\s*(\d{2,3})\s*(k|nghin|ngan)\b|(?:duoi|<|toi da)\s*(\d{4,6})\s*(?:d|dong|vnd)\b/)
  const maxPrice = priceMatch ? Number(priceMatch[1] || priceMatch[3]) * (priceMatch[1] ? 1000 : 1) : null
  const noSpicy = /(khong|ko|k) cay/.test(q)
  const wantSpicy = !noSpicy && /\bcay\b/.test(q)
  const wantVeg = /\b(chay|thuan chay)\b/.test(q)
  const wantDrink = /\b(nuoc|do uong|uong|tra|soda|sua|sinh to|ca phe)\b/.test(q)
  const wantCheap = /(re nhat|gia re|tiet kiem)/.test(q)
  const constraintWords = new Set(['mon', 'duoi', 'toi', 'da', 'kcal', 'calo', 'cal', 'khong', 'ko', 'cay', 'chay', 'thuan', 'nuoc', 'do', 'uong', 'tra', 'soda', 're', 'nhat', 'gia', 'tiet', 'kiem', 'nhe', 'it', 'duong', 'healthy', 'eat', 'clean', 'giam', 'can'])
  const words = q.split(/\s+/).filter(w => w.length > 1 && !/\d/.test(w) && !constraintWords.has(w))
  const hasFilter = !!(maxKcal || maxPrice || noSpicy || wantSpicy || wantVeg || wantDrink || wantCheap)

  const ranked = menuItems
    .filter(i => i.stock > 0)
    .filter(i => !maxKcal || i.kcal <= maxKcal)
    .filter(i => !maxPrice || (i.salePrice ?? i.price) <= maxPrice)
    .filter(i => !noSpicy || !i.spicy)
    .filter(i => !wantSpicy || i.spicy)
    .filter(i => !wantVeg || i.veg)
    .filter(i => wantDrink ? i.tags.includes('nước') : !i.tags.includes('nước'))
    .map(i => {
      const tokens = value => norm(value).split(/[^a-z0-9]+/)
      const nameWords = tokens(i.name)
      const descWords = tokens(i.desc)
      const tagWords = tokens(i.tags.join(' '))
      const nameHits = words.filter(w => nameWords.includes(w)).length
      const descHits = words.filter(w => descWords.includes(w)).length
      const tagHits = words.filter(w => tagWords.includes(w)).length
      const hits = nameHits + descHits + tagHits
      const score = nameHits * 2 + descHits * 0.15 + tagHits * 0.5 + (i.salePrice ? 0.5 : 0) - (wantCheap ? (i.salePrice ?? i.price) / 100000 : 0)
      return { i, hits, score }
    })
    .filter(r => words.length ? r.hits > 0 : hasFilter)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const parts = []
  if (maxKcal) parts.push(`dưới ${maxKcal} kcal`)
  if (maxPrice) parts.push(`dưới ${maxPrice / 1000}k`)
  if (noSpicy) parts.push('không cay')
  if (wantSpicy) parts.push('có vị cay')
  if (wantVeg) parts.push('món chay')
  if (wantDrink) parts.push('đồ uống')
  if (maxKcal && /(it calo|healthy|nhe|giam can|eat clean)/.test(q) && !kcalMatch) parts.push('nhẹ bụng')
  return {
    items: ranked.map(r => ({
      ...r.i,
      reason: [
        wantVeg && r.i.veg ? 'Món chay' : null,
        wantDrink && r.i.tags.includes('nước') ? 'Đồ uống' : null,
        maxPrice && (r.i.salePrice ?? r.i.price) <= maxPrice ? `Trong ngân sách ${Math.round(maxPrice / 1000)}k` : null,
        maxKcal && r.i.kcal <= maxKcal ? `Dưới ${maxKcal} kcal` : null,
        noSpicy && !r.i.spicy ? 'Không cay' : null,
        r.hits ? 'Khớp mô tả của bạn' : null
      ].filter(Boolean).join(' · ') || 'Món đang được phục vụ hôm nay'
    })),
    reply: ranked.length
      ? `Mình tìm được ${ranked.length} món${parts.length ? ' ' + parts.join(', ') : ''} phù hợp với bạn:`
      : 'Mình chưa hiểu bạn muốn món nào. Bạn thử nói rõ hơn về giá, calo, vị cay hoặc tên món (phở, cơm, salad...) nhé.'
  }
}

/** Gọi Gemini; model chỉ được trả về id món có trong thực đơn. */
async function geminiSuggest(query, key) {
  const model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash'
  const catalog = menuItems.filter(i => i.stock > 0)
    .map(i => `${i.id}|${i.name}|${i.salePrice ?? i.price}đ|${i.kcal}kcal|${i.spicy ? 'cay' : 'khong cay'}|${i.veg ? 'chay' : 'man'}`).join('\n')
  const prompt = `Bạn là trợ lý gọi món của Bếp Nhà. Thực đơn (id|tên|giá|calo|vị|loại):\n${catalog}\n\nYêu cầu của khách: "${query}"\nNếu khách chỉ chào hỏi hoặc hỏi ngoài chủ đề ăn uống, trả lời ngắn gọn và để ids rỗng. Nếu không, chọn tối đa 3 món phù hợp nhất trong thực đơn và nêu ngắn lý do. Không bịa món/giá/calo. Chỉ trả về JSON: {"reply":"1 câu tiếng Việt","ids":["id1","id2"],"reasons":{"id1":"lý do"}}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`${res.status} ${err.error?.message ?? ''}`.slice(0, 160))
  }
  const data = await res.json()
  const parsed = JSON.parse(data.candidates[0].content.parts[0].text)
  const items = (parsed.ids ?? []).map(id => {
    const item = menuItems.find(i => i.id === id)
    return item ? { ...item, reason: parsed.reasons?.[id] || 'Được chọn theo yêu cầu của bạn' } : null
  }).filter(Boolean)
  return { items, reply: parsed.reply }
}

export async function suggest(query) {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (key) {
    try {
      return await geminiSuggest(query, key)
    } catch (e) {
      console.warn('Gemini lỗi:', e.message)
      const r = mockSuggest(query)
      return { ...r, reply: `[Gemini lỗi: ${e.message}] ` + r.reply }
    }
  }
  await new Promise(r => setTimeout(r, 400)) // giả lập độ trễ mạng
  return mockSuggest(query)
}
