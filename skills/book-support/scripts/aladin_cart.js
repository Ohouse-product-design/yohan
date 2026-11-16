#!/usr/bin/env node
/**
 * 알라딘 회사 공용 계정에 로그인해 도서를 장바구니에 담고, 담겼는지 장바구니에서 다시 확인한다.
 *
 * 사용법:
 *   ALADIN_ID=... ALADIN_PW=... node aladin_cart.js [--dry-run] "<도서명 또는 알라딘 상품 URL>" ["..."]
 *
 * --dry-run : 로그인 · 도서 확인 · 장바구니 중복 확인까지만 하고 실제로 담지는 않는다.
 *
 * 결과는 stdout 에 JSON 한 덩어리로 출력한다.
 *   { ok, login, books: [{ input, status, itemId, title, author, price, url, message }] }
 *   status: added | already_in_cart | would_add | not_found | failed
 *
 * 계정 정보는 절대 코드에 넣지 않는다. 노션 「📚 도서 지원」 페이지의 최신 계정을 환경 변수로 넘긴다.
 */
const { chromium } = require('playwright');

const BASE = 'https://www.aladin.co.kr';
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const inputs = args.filter((a) => a !== '--dry-run');

function out(obj, code = 0) {
  process.stdout.write(JSON.stringify(obj, null, 2) + '\n');
  process.exit(code);
}

if (!process.env.ALADIN_ID || !process.env.ALADIN_PW) {
  out({ ok: false, login: 'skipped', message: 'ALADIN_ID / ALADIN_PW 환경 변수가 없습니다.' }, 2);
}
if (inputs.length === 0) {
  out({ ok: false, login: 'skipped', message: '도서명 또는 알라딘 상품 URL 을 1개 이상 넘겨 주세요.' }, 2);
}

async function login(page) {
  const dialogs = [];
  const onDialog = (d) => { dialogs.push(d.message()); d.dismiss().catch(() => {}); };
  page.on('dialog', onDialog);
  // 주의: 헤드리스 브라우저 기본 설정으로는 알라딘이 '로그인 과정에 문제(에러코드 42FB6013…)'로 거부할 수 있다.
  // 그 경우 SKILL.md 의 「브라우저 경로」(Claude in Chrome / 내장 브라우저)로 진행한다.
  await page.goto(`${BASE}/login/wlogin_popup.aspx`, { waitUntil: 'networkidle' });
  await page.fill('#Email', process.env.ALADIN_ID);
  await page.fill('#Password', process.env.ALADIN_PW);
  // Enter 로 제출하면 서버가 에러를 낸다. 페이지의 fn_submit() 버튼을 눌러야 한다.
  await page.click('a[href="javascript:fn_submit();"]');
  const okLogin = await page
    .waitForURL(/wlogin_popup_result\.aspx/, { timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  page.off('dialog', onDialog);
  return { ok: okLogin, dialogs };
}

/** 장바구니(알라딘 배송 + 품절 영역)에 있는 상품의 ItemId → 제목 맵 */
async function readCart(page) {
  await page.goto(`${BASE}/shop/wbasket.aspx`, { waitUntil: 'domcontentloaded' });
  return page.$$eval('a[href*="ItemId="]', (els) => {
    const map = {};
    for (const e of els) {
      const id = (e.href.match(/ItemId=(\d+)/) || [])[1];
      const t = (e.innerText || '').trim();
      // 장바구니 행의 상품명 링크는 "[국내도서] 제목" 처럼 분류 접두어로 시작한다(추천/최근 본 상품 제외).
      if (id && /^\[[^\]]+\]/.test(t)) map[id] = t;
    }
    return map;
  });
}

async function resolveItem(page, input) {
  let itemId = (input.match(/ItemId=(\d+)/i) || [])[1];
  if (!itemId) {
    const q = encodeURIComponent(input);
    await page.goto(`${BASE}/search/wsearchresult.aspx?SearchTarget=Book&SearchWord=${q}`, { waitUntil: 'domcontentloaded' });
    itemId = await page.$$eval('.ss_book_box[itemid]', (els) => (els[0] ? els[0].getAttribute('itemid') : null));
    if (!itemId) return null;
  }
  const url = `${BASE}/shop/wproduct.aspx?ItemId=${itemId}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const info = await page.evaluate(() => {
    const isbnEl = document.querySelector('.hd_ISBN');
    const og = (p) => document.querySelector(`meta[property="${p}"]`)?.content || '';
    const docTitle = document.title.replace(/\s*\|\s*알라딘\s*$/, '');
    const parts = docTitle.split('|').map((s) => s.trim());
    const priceText = [...document.querySelectorAll('.Ritem, .info_list li, .Ere_prod_price')]
      .map((e) => e.innerText).join(' ');
    const price = (priceText.match(/판매가[^0-9]*([0-9,]+)\s*원/) || [])[1] || '';
    return {
      isbn: isbnEl ? isbnEl.value : '',
      title: og('og:title') || parts[0] || docTitle,
      author: parts.length > 1 ? parts[parts.length - 1] : '',
      price,
    };
  });
  return { itemId, url, ...info };
}

async function addToCart(page, isbn) {
  // 상품 상세의 「장바구니 담기」 버튼과 같은 엔드포인트.
  return page.evaluate(async (isbn) => {
    const r = await fetch(`/shop/BasketAjax.aspx?method=BasketAdd&isbn=${encodeURIComponent(isbn)}&_=${Date.now()}`, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      credentials: 'include',
    });
    const text = await r.text();
    try { return JSON.parse(text); } catch { return { raw: text.slice(0, 300) }; }
  }, isbn);
}

(async () => {
  // 로컬 맥 등에서 실제 창을 띄워 실행하려면 HEADED=1
  const browser = await chromium.launch({ headless: process.env.HEADED !== '1' });
  const context = await browser.newContext({ locale: 'ko-KR' });
  const page = await context.newPage();
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
  const result = { ok: false, login: 'failed', dryRun, books: [] };
  try {
    const l = await login(page);
    if (!l.ok) {
      result.message = `로그인 실패${l.dialogs.length ? ': ' + l.dialogs.join(' / ') : ''} — 노션의 최신 계정 정보를 확인해 주세요.`;
      return out(result, 3);
    }
    result.login = 'ok';

    let cart = await readCart(page);
    const pending = [];
    for (const input of inputs) {
      const book = { input };
      try {
        const item = await resolveItem(page, input);
        if (!item) { result.books.push({ ...book, status: 'not_found', message: '알라딘 도서 검색 결과가 없습니다.' }); continue; }
        Object.assign(book, item);
        if (cart[item.itemId]) {
          book.status = 'already_in_cart';
          book.message = '공용 장바구니에 이미 담겨 있습니다(누군가 신청했거나 이전에 담음).';
        } else if (dryRun) {
          book.status = 'would_add';
        } else if (!item.isbn) {
          book.status = 'failed';
          book.message = '상품 코드(hd_ISBN)를 찾지 못했습니다(품절·옵션 상품일 수 있음).';
        } else {
          book.addResponse = await addToCart(page, item.isbn);
          pending.push(book);
        }
      } catch (e) {
        book.status = 'failed';
        book.message = String(e.message || e).slice(0, 200);
      }
      result.books.push(book);
    }

    if (pending.length) {
      cart = await readCart(page);
      for (const b of pending) {
        if (cart[b.itemId]) { b.status = 'added'; }
        else {
          b.status = 'failed';
          b.message = `담기 요청 후 장바구니에서 확인되지 않음: ${JSON.stringify(b.addResponse).slice(0, 200)}`;
        }
      }
    }
    result.ok = result.books.every((b) => ['added', 'already_in_cart', 'would_add'].includes(b.status));
    out(result, result.ok ? 0 : 1);
  } catch (e) {
    result.message = String(e.message || e).slice(0, 300);
    out(result, 4);
  } finally {
    await browser.close().catch(() => {});
  }
})();
