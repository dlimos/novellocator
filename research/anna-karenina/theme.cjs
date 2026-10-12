const fs=require('node:fs');
const id='anna-karenina';
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144"><g fill="none" stroke="#49635b" stroke-opacity=".22" stroke-width="1.4"><path d="M30 100V44h32v56m20 0V44h32v56M26 100h92M30 70h84M30 80h84M30 90h84M42 47V32h11v15M37 32h21M62 49h27v24H62z"/><circle cx="45" cy="88" r="8"/><circle cx="69" cy="88" r="8"/><circle cx="93" cy="88" r="8"/><path d="M52 88h34M50 22c-8-8 8-10 1-17"/></g></svg>';
const selector=`html[data-book="${id}"]`;
const css=`/* Anna Karenina: forest green, ivory and railway brass. */
${selector}{--ink:#203d34;--muted:#526c60;--paper:#d2dfcf;--panel:#f5f4e9;--wash:#e8efdf;--line:#9daf98;--accent:#8b3547;--heading-font:Georgia,serif}
${selector} body{padding:40px 0;background-color:var(--paper);background-image:url("data:image/svg+xml,${encodeURIComponent(svg)}");background-repeat:repeat;background-size:144px 144px}
${selector} .masthead,${selector} main{background:transparent}
${selector} .introduction{background:linear-gradient(110deg,#f4f0de,#dbe6d2);border-top:6px solid #315345;border-bottom:2px solid #b59152;min-height:240px;padding:32px}
${selector} .introduction #title{font-family:Georgia,serif;font-weight:400;letter-spacing:-.035em;font-size:clamp(44px,5.5vw,76px);max-width:75%;line-height:1.05}
${selector} #book-author{color:#8b3547;letter-spacing:.13em}
${selector} .introduction::after{width:50%;opacity:.27;background-position:center 34%}
${selector} .workspace{border-top:4px solid #315345;box-shadow:0 6px 20px #203d3418}
${selector} .detail h2,${selector} .sidebar-title h2{font-family:Georgia,serif;font-weight:400}
${selector} .original-excerpt blockquote,${selector} .location-evidence blockquote{background:#f7f2e2;color:#203d34;border-left:4px solid #b59152;line-height:1.8}
.book-card[data-book="${id}"]{--card-bg:#e4eddb;--card-ink:#203d34;--card-line:#9daf98;--card-accent:#8b3547;background:var(--card-bg);color:var(--card-ink);border-top:6px solid #315345}
.book-card[data-book="${id}"] .book-copy{background:var(--card-bg)}
.book-card[data-book="${id}"] .book-copy h2{font-family:Georgia,serif;font-weight:400;color:var(--card-ink)}
.book-card[data-book="${id}"] .book-copy>p,.book-card[data-book="${id}"] .book-meta{color:var(--card-ink)}
.book-card[data-book="${id}"] .book-art img{filter:none}
${selector} .masthead>.brand,${selector} .masthead>.edition,${selector} .masthead>.language-picker,${selector} footer>p,${selector} footer>details{background:color-mix(in srgb,var(--paper) 92%,transparent);border-radius:3px;padding:5px 8px}
@media(max-width:700px){${selector} body{padding:30px 0;background-size:108px 108px}${selector} .introduction{padding:24px 20px;min-height:0}${selector} .introduction #title{font-size:44px;max-width:100%}${selector} .introduction::after{width:75%;opacity:.18}}
`;
fs.writeFileSync(`docs/themes/${id}.css`,css);
