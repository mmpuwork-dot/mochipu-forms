import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BoxedInput } from '@/components/ui/BoxedInput';
import { Textarea } from '@/components/ui/Textarea';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DecorativeDivider } from '@/components/ui/DecorativeDivider';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Check, Sparkles, Mail, RefreshCw, X } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-[560px] mx-auto px-6 py-8 space-y-14">

        {/* ─── Header（忠實還原設計稿佈局） ─── */}
        <div>
          <div className="flex items-start justify-between gap-6 mb-7">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-[18px]">
                <span className="w-8 h-px bg-[var(--color-black)]" aria-hidden="true" />
                <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[var(--color-black)] m-0">
                  Mochipu Live2D
                </p>
              </div>
              <h1 className="text-[30px] font-normal tracking-[0.02em] text-[var(--color-black)] m-0 mb-2.5 leading-[1.2]">
                UI Component Demo.
              </h1>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.75] m-0 max-w-[420px]">
                All Phase 2 primitives — LanguageSwitcher, Buttons, Inputs, Section Labels, Dividers.
              </p>
            </div>
            {/* LanguageSwitcher 對齊設計稿右上，padding-top 26px */}
            <div className="pt-[26px] flex-shrink-0">
              <LanguageSwitcher />
            </div>
          </div>
          <DecorativeDivider side="left" />
        </div>

        {/* ─── Buttons ─── */}
        <section className="space-y-6">
          <SectionLabel withLine>Buttons</SectionLabel>

          <div className="space-y-2">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">Primary — 黑色實心 CTA</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Submit sm</Button>
              <Button variant="primary" size="md">送出反饋</Button>
              <Button variant="primary" size="lg">確認收貨</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">Secondary — 虛線框（紫色文字）</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">+ 新增另一個問題</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">Ghost / Link</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost">收起</Button>
              <Button variant="ghost">展開</Button>
              <Button variant="link">沒有問題 → 前往收貨確認</Button>
            </div>
          </div>

          <Button variant="primary" fullWidth size="lg">送出反饋（Full Width）</Button>
        </section>

        <DecorativeDivider side="right" />

        {/* ─── Input（底線） ─── */}
        <section className="space-y-6">
          <SectionLabel withLine>Input — 底線輸入框</SectionLabel>
          <div className="grid grid-cols-2 gap-5">
            <Input label="委託名" placeholder="例：Melchi VA" required />
            <Input label="電子信箱" type="email" placeholder="you@example.com" required />
          </div>
          <Input label="Error state" placeholder="something" error="此欄位為必填" />
          <Input label="Hint" placeholder="optional" hint="可不填，不確定時直接送出。" />
        </section>

        <DecorativeDivider side="left" />

        {/* ─── BoxedInput（框線） ─── */}
        <section className="space-y-6">
          <SectionLabel withLine>BoxedInput — 框線輸入框（URL 欄位）</SectionLabel>
          <SectionLabel dash>雲端連結</SectionLabel>
          <BoxedInput
            placeholder="https://drive.google.com/... · YouTube · Dropbox 等"
            hint="檔案太大時，請使用雲端連結分享"
          />
          <BoxedInput
            placeholder="https://..."
            error="請輸入有效的 URL"
          />
        </section>

        <DecorativeDivider side="right" />

        {/* ─── Textarea ─── */}
        <section className="space-y-4">
          <SectionLabel withLine>問題描述</SectionLabel>
          <div className="space-y-3">
            <SectionLabel dash>期望效果</SectionLabel>
            <Textarea
              placeholder="例：希望眨眼時雙眼能完全閉合，類似 demo 0:20 的效果。"
              rows={3}
            />
          </div>
          <div className="space-y-3">
            <SectionLabel dash>目前狀況</SectionLabel>
            <Textarea
              placeholder="例：眨眼時右眼會微微張開，可見於 demo 影片 0:14。"
              rows={3}
            />
          </div>
        </section>

        <DecorativeDivider side="left" />

        {/* ─── Section Labels showcase ─── */}
        <section className="space-y-4">
          <SectionLabel withLine>Section Labels</SectionLabel>
          <div className="space-y-4 pl-1">
            <div>
              <p className="text-[10px] text-[var(--color-text-tertiary)] italic mb-2">withLine（區段標題）</p>
              <SectionLabel withLine>基本資訊</SectionLabel>
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-tertiary)] italic mb-2">dash（card 內小標籤）</p>
              <div className="flex gap-6">
                <SectionLabel dash>期望效果</SectionLabel>
                <SectionLabel dash>目前狀況</SectionLabel>
                <SectionLabel dash>雲端連結</SectionLabel>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[var(--color-text-tertiary)] italic mb-2">plain（無修飾）</p>
              <SectionLabel>修改說明</SectionLabel>
            </div>
          </div>
        </section>

        <DecorativeDivider side="right" />

        {/* ─── Decorative Dividers showcase ─── */}
        <section className="space-y-6">
          <SectionLabel withLine>Decorative Dividers</SectionLabel>
          <div className="space-y-4">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">side=&quot;left&quot;（頂部，色塊左側）</p>
            <DecorativeDivider side="left" />
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">side=&quot;right&quot;（底部，色塊右側）</p>
            <DecorativeDivider side="right" />
          </div>
        </section>

        <DecorativeDivider side="left" />

        {/* ─── Priority Chips ─── */}
        <section className="space-y-4">
          <SectionLabel withLine>優先順序 · Priority Chips</SectionLabel>
          <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">
            三格等寬，選中「高」時有語意背景色；未選中為透明底。
          </p>

          {/* 高 selected */}
          <div>
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic mb-2">高 selected</p>
            <div className="grid grid-cols-3 gap-[6px]">
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px] font-medium
                bg-[var(--color-high-bg)] text-[var(--color-high-text)] border border-[var(--color-high-border)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-high)] flex-shrink-0" />
                高
              </span>
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px]
                bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-mid)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-medium)] flex-shrink-0" />
                中
              </span>
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px]
                bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-mid)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-low)] flex-shrink-0" />
                低
              </span>
            </div>
          </div>

          {/* 中 selected */}
          <div>
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic mb-2">中 selected</p>
            <div className="grid grid-cols-3 gap-[6px]">
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px]
                bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-mid)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-high)] flex-shrink-0" />
                高
              </span>
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px] font-medium
                bg-[var(--color-medium-bg)] text-[var(--color-medium-text)] border border-[var(--color-border-mid)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-medium)] flex-shrink-0" />
                中
              </span>
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px]
                bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-mid)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-low)] flex-shrink-0" />
                低
              </span>
            </div>
          </div>

          {/* 低 selected */}
          <div>
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic mb-2">低 selected</p>
            <div className="grid grid-cols-3 gap-[6px]">
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px]
                bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-mid)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-high)] flex-shrink-0" />
                高
              </span>
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px]
                bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-mid)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-medium)] flex-shrink-0" />
                中
              </span>
              <span className="flex items-center justify-center gap-2 px-3 py-2 text-[12px] font-medium
                bg-[var(--color-low-bg)] text-[var(--color-low-text)] border border-[var(--color-low-border)]">
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-low)] flex-shrink-0" />
                低
              </span>
            </div>
          </div>
        </section>

        <DecorativeDivider side="right" />

        {/* ─── Location / Type Chips（單/多選） ─── */}
        <section className="space-y-6">
          <SectionLabel withLine>選項 Chips — 單選 · 多選</SectionLabel>

          <div className="space-y-3">
            <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-black)]">問題位置</p>
            <div className="flex flex-wrap gap-[6px]">
              {['臉部', '頭髮', '身體', '物理', 'Toggle', '其他'].map((label, i) => (
                <span
                  key={label}
                  className={[
                    'px-[14px] py-[6px] text-[12px] border cursor-pointer',
                    i === 0
                      ? 'bg-[var(--color-black)] text-[var(--color-white)] border-[var(--color-black)]'
                      : 'bg-transparent text-[var(--color-black)] border-[var(--color-border-mid)]',
                  ].join(' ')}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-black)]">問題類型</p>
            <div className="grid grid-cols-2 gap-[6px]">
              {[
                { label: '模型錯誤', selected: true },
                { label: '原畫修改', selected: false },
                { label: '物理或動作調整', selected: false },
                { label: '新增或移除', selected: false },
              ].map(({ label, selected }) => (
                <span
                  key={label}
                  className={[
                    'flex items-center justify-center px-3 py-2 text-[12px] border text-center cursor-pointer',
                    selected
                      ? 'bg-[var(--color-black)] text-[var(--color-white)] border-[var(--color-black)]'
                      : 'bg-transparent text-[var(--color-black)] border-[var(--color-border-mid)]',
                  ].join(' ')}
                >
                  {label}
                </span>
              ))}
              <span className="col-span-2 flex items-center justify-center px-3 py-2 text-[12px] border cursor-pointer
                bg-transparent text-[var(--color-black)] border-[var(--color-border-mid)]">
                其他
              </span>
            </div>
          </div>
        </section>

        <DecorativeDivider side="left" />

        {/* ─── 確認表單樣式 ─── */}
        <section className="space-y-8">
          <SectionLabel withLine>確認表單元件 · Confirm Form Patterns</SectionLabel>

          {/* 警告框 — 左側黑色 2px accent */}
          <div className="space-y-3">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">警告 / 說明框（左側 2px 黑線）</p>
            <div className="bg-[var(--color-white)] border border-[var(--color-border-light)] border-l-2 border-l-[var(--color-black)] px-5 py-5 space-y-2.5">
              <SectionLabel>確認前請閱讀</SectionLabel>
              <p className="text-[12.5px] text-[#2C2540] leading-[1.75] m-0">
                提交此表單，即代表您確認{' '}
                <span className="text-[var(--color-black)] font-medium">本次委託已完成</span>
                。最終檔案已交付並通過您的審核。
              </p>
              <p className="text-[12px] text-[var(--color-text-secondary)] leading-[1.7] m-0">
                未來任何修改、更新或新增功能，將視為{' '}
                <span className="text-[var(--color-purple)] font-medium">新的委託</span>
                {' '}— 歡迎隨時透過電子郵件聯絡我，我們可以再次討論。
              </p>
              <p className="text-[11px] text-[var(--color-text-tertiary)] m-0">
                <span className="text-[var(--color-high)]">*</span> 為必填欄位
              </p>
            </div>
          </div>

          {/* Radio 選項 — 有邊框的 label */}
          <div className="space-y-3">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">Radio 選項（邊框 label 樣式）</p>
            <div className="flex flex-col gap-2">
              {/* 已選中 */}
              <label className="flex items-center gap-3 px-[14px] py-[10px] border border-[var(--color-border-mid)] bg-[var(--color-white)] cursor-pointer">
                <span className="w-[14px] h-[14px] border border-[var(--color-black)] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--color-black)]" />
                </span>
                <span className="text-[13px] text-[var(--color-black)]">已有規劃日期</span>
              </label>
              {/* 未選中 */}
              <label className="flex items-center gap-3 px-[14px] py-[10px] border border-[var(--color-border-mid)] cursor-pointer">
                <span className="w-[14px] h-[14px] border border-[var(--color-border-mid)] rounded-full flex-shrink-0" />
                <span className="text-[13px] text-[var(--color-text-secondary)]">尚未決定</span>
              </label>
            </div>
          </div>

          {/* 日期選擇器 */}
          <div className="space-y-3">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">Inline 日期選擇器</p>
            <div className="bg-[var(--color-white)] border border-[var(--color-border-light)] p-5">
              <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--color-black)] mb-3">選擇日期</p>

              {/* 月份導航 */}
              <div className="flex items-center justify-between mb-[14px]">
                <span className="text-[14px] text-[var(--color-black)] tracking-[0.04em]">2026 年 6 月</span>
                <div className="flex gap-2">
                  <button className="text-[13px] text-[var(--color-purple)] cursor-pointer bg-transparent border-none px-1">‹</button>
                  <button className="text-[13px] text-[var(--color-purple)] cursor-pointer bg-transparent border-none px-1">›</button>
                </div>
              </div>

              {/* 星期標題 */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['日','一','二','三','四','五','六'].map(d => (
                  <span key={d} className="text-[10px] text-[var(--color-purple)] text-center py-1 tracking-[0.04em]">{d}</span>
                ))}
              </div>

              {/* 日期格 */}
              <div className="grid grid-cols-7 gap-1">
                {/* 上月尾 */}
                <span className="text-[12px] text-[var(--color-border-mid)] text-center py-2">31</span>
                {/* 本月 1–6 */}
                {[1,2,3,4,5,6].map(d => (
                  <span key={d} className="text-[12px] text-[var(--color-black)] text-center py-2 cursor-pointer hover:bg-[var(--color-bg)]">{d}</span>
                ))}
                {/* 7–13 */}
                {[7,8,9,10,11,12,13].map(d => (
                  <span key={d} className="text-[12px] text-[var(--color-black)] text-center py-2 cursor-pointer hover:bg-[var(--color-bg)]">{d}</span>
                ))}
                {/* 14–20，19 為選中 */}
                {[14,15,16,17,18].map(d => (
                  <span key={d} className="text-[12px] text-[var(--color-black)] text-center py-2 cursor-pointer hover:bg-[var(--color-bg)]">{d}</span>
                ))}
                <span className="text-[12px] text-[var(--color-white)] text-center py-2 bg-[var(--color-accent-blue)] font-medium cursor-pointer">19</span>
                <span className="text-[12px] text-[var(--color-black)] text-center py-2 cursor-pointer hover:bg-[var(--color-bg)]">20</span>
                {/* 21–27 */}
                {[21,22,23,24,25,26,27].map(d => (
                  <span key={d} className="text-[12px] text-[var(--color-black)] text-center py-2 cursor-pointer hover:bg-[var(--color-bg)]">{d}</span>
                ))}
                {/* 28–30 + 下月頭 */}
                {[28,29,30].map(d => (
                  <span key={d} className="text-[12px] text-[var(--color-black)] text-center py-2 cursor-pointer hover:bg-[var(--color-bg)]">{d}</span>
                ))}
                {[1,2,3,4].map(d => (
                  <span key={`next-${d}`} className="text-[12px] text-[var(--color-border-mid)] text-center py-2">{d}</span>
                ))}
              </div>

              {/* 已選擇 */}
              <p className="text-[11px] text-[var(--color-text-secondary)] mt-[14px] pt-3 border-t border-[var(--color-border-light)] m-0">
                已選擇：<span className="text-[var(--color-accent-blue)] font-medium">2026 年 6 月 19 日</span>
              </p>
            </div>
          </div>

          {/* Checkbox — 確認收貨 */}
          <div className="space-y-3">
            <p className="text-[10px] text-[var(--color-text-tertiary)] italic">Checkbox（確認收貨）</p>
            <div className="pt-6 border-t border-[var(--color-border-light)]">
              <label className="flex items-start gap-[14px] cursor-pointer">
                {/* Checked state */}
                <span className="w-[18px] h-[18px] border border-[var(--color-black)] bg-[var(--color-black)] flex items-center justify-center flex-shrink-0 mt-[2px]">
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                    <path d="M1 4L4 7.5L10 1" stroke="#FBFAFD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <p className="text-[13px] text-[var(--color-black)] font-medium m-0 mb-1">
                    我確認本次委託已完成 <span className="text-[var(--color-high)]">*</span>
                  </p>
                  <p className="text-[12px] text-[var(--color-text-secondary)] leading-[1.65] m-0">
                    我已檢查最終模型並通過交付。我了解未來任何修改或更新將以新的委託方式進行。
                  </p>
                </div>
              </label>
            </div>
          </div>
        </section>

        <DecorativeDivider side="left" />

        {/* ══════════════════════════════════
            成功頁面 A · 反饋已送出
        ══════════════════════════════════ */}
        <section className="space-y-2">
          <SectionLabel withLine>Success Page A · 反饋已收到</SectionLabel>
        </section>

        <div className="max-w-[480px] mx-auto text-center space-y-7">

          {/* Logo header */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[var(--color-black)]" />
            <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[var(--color-black)] m-0">Mochipu Live2D</p>
            <span className="w-8 h-px bg-[var(--color-black)]" />
          </div>

          {/* Check icon box */}
          <div className="w-16 h-16 border border-[#B8D9F0] bg-[#EAF2FA] flex items-center justify-center mx-auto">
            <Check size={28} color="#5A8BBF" strokeWidth={1.5} />
          </div>

          {/* Label + heading */}
          <div>
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[var(--color-accent-blue)] m-0 mb-3">
              Feedback received
            </p>
            <h1 className="text-[28px] font-normal tracking-[-0.01em] text-[var(--color-black)] leading-[1.2] m-0 mb-4">
              Thank you, Melchi.
            </h1>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.75] m-0">
              I&apos;ve received your{' '}
              <span className="text-[var(--color-black)] font-medium">3 feedback items</span>
              . I&apos;ll review everything carefully and get back to you within 2–3 days.
            </p>
          </div>

          {/* Submission summary card */}
          <div className="bg-[var(--color-white)] border border-[var(--color-border-light)] p-5 text-left">
            <SectionLabel dash className="mb-[10px]">Submission summary</SectionLabel>
            <div className="flex flex-col gap-0">
              {[
                { num: '01', title: 'Eye blink not closing fully', priority: 'High', bg: 'var(--color-high-bg)', text: 'var(--color-high-text)', border: '' },
                { num: '02', title: 'Hair physics feels stiff',    priority: 'Med',  bg: 'var(--color-medium-bg)', text: 'var(--color-medium-text)', border: '' },
                { num: '03', title: 'Add small breathing animation', priority: 'Low', bg: 'transparent', text: 'var(--color-low-text)', border: '1px solid var(--color-low-border)' },
              ].map(({ num, title, priority, bg, text, border }, i, arr) => (
                <div
                  key={num}
                  className="flex items-center justify-between py-[6px]"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid #EBE6F2' : undefined }}
                >
                  <span className="text-[12px] text-[var(--color-text-secondary)]">{num} · {title}</span>
                  <span
                    className="text-[10px] tracking-[0.06em] px-2 py-[2px] flex-shrink-0"
                    style={{ background: bg, color: text, border }}
                  >
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DecorativeDivider side="right" />

        {/* ══════════════════════════════════
            成功頁面 B · 委託完成確認
        ══════════════════════════════════ */}
        <section className="space-y-2">
          <SectionLabel withLine>Success Page B · 委託完成</SectionLabel>
        </section>

        <div className="max-w-[480px] mx-auto text-center space-y-7">

          {/* Logo header */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[var(--color-black)]" />
            <p className="text-[11px] font-medium tracking-[0.24em] uppercase text-[var(--color-black)] m-0">Mochipu Live2D</p>
            <span className="w-8 h-px bg-[var(--color-black)]" />
          </div>

          {/* Sparkles icon box with decorative corner squares */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border border-[#B8D9F0] bg-[#EAF2FA] flex items-center justify-center">
              <Sparkles size={32} color="#5A8BBF" strokeWidth={1.5} />
            </div>
            {/* 裝飾角塊 */}
            <span className="absolute -top-[6px] -right-[6px] w-[14px] h-[14px] bg-[var(--color-black)]" />
            <span className="absolute -bottom-[6px] -left-[6px] w-[10px] h-[10px] bg-[var(--color-purple)]" />
          </div>

          {/* Label + heading */}
          <div>
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[var(--color-accent-blue)] m-0 mb-3">
              Commission complete
            </p>
            <h1 className="text-[28px] font-normal tracking-[-0.01em] text-[var(--color-black)] leading-[1.2] m-0 mb-4">
              Congratulations<br />on your new model.
            </h1>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-[1.75] m-0">
              Thank you for trusting me with your model. It was such a joy working together — I can&apos;t wait to see you bring this character to life.
            </p>
          </div>

          {/* Debut date card — 左側藍線 */}
          <div className="bg-[var(--color-white)] border border-[var(--color-border-light)] border-l-2 border-l-[var(--color-accent-blue)] px-5 py-5 text-left space-y-1.5">
            <SectionLabel dash className="text-[var(--color-accent-blue)]">Debut date noted</SectionLabel>
            <p className="text-[14px] text-[var(--color-black)] font-medium tracking-[0.02em] m-0">June 19, 2026</p>
            <p className="text-[12px] text-[var(--color-text-secondary)] leading-[1.6] m-0">
              I&apos;ll be cheering for you on the day. If you&apos;d like, tag me when you debut — I&apos;d love to share it.
            </p>
          </div>

          {/* Info rows */}
          <div className="flex flex-col text-left">
            {[
              { Icon: Mail,      text: <>A copy of your confirmation has been sent to your email.</> },
              { Icon: RefreshCw, text: <>For any future commissions, please contact me at <span className="text-[var(--color-black)] font-medium">mmpu.work@gmail.com</span>.</> },
              { Icon: X,         text: <>Follow me on X <span className="text-[var(--color-black)] font-medium">@mochimochibubu</span> for updates.</> },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-t border-[var(--color-border-light)] last:border-b last:border-b-[var(--color-border-light)]">
                <Icon size={16} color="var(--color-purple)" strokeWidth={1.5} className="flex-shrink-0" />
                <p className="text-[12px] text-[var(--color-text-secondary)] m-0 flex-1 leading-[1.6]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="pb-8">
          <DecorativeDivider side="right" />
          <p className="text-[11px] italic text-[var(--color-text-tertiary)] text-center pt-6">
            Phase 2 complete · All UI primitives match design reference.
          </p>
        </div>

      </div>
    </div>
  );
}
