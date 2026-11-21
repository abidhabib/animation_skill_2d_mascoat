"""Premium motion helpers (user 2026-11-21). Each returns (svg, js). Scene id prefix = scene name before the first '-'.
   from motion import wall_clock, enter, exit_, chat_bubbles, cash_counter, polaroid, combine
"""
import random

def combine(*parts): return "".join(p[0] for p in parts), "".join(p[1] for p in parts)

def enter(sel, t, frm="left", d=0.6, dist=420, overshoot=True):
    """Polished entrance: slides + fades + slight overshoot settle."""
    ox = {"left": (-dist, 0), "right": (dist, 0), "up": (0, -dist), "down": (0, dist)}.get(frm, (0, 0))
    ease = "back.out(1.5)" if overshoot else "power3.out"
    return f"tl.fromTo('{sel}',{{x:{ox[0]},y:{ox[1]},opacity:0}},{{x:0,y:0,opacity:1,duration:{d},ease:'{ease}',immediateRender:false}},{t:.2f});"

def exit_(sel, t, to="right", d=0.45, dist=420):
    ox = {"left": (-dist, 0), "right": (dist, 0), "up": (0, -dist), "down": (0, dist)}.get(to, (0, 0))
    return f"tl.to('{sel}',{{x:{ox[0]},y:{ox[1]},opacity:0,duration:{d},ease:'power2.in'}},{t:.2f});"

def wall_clock(cid, x, y, r=100, h0=8, m0=50, sweep_min=10, t0=0.2, dur=3.0):
    """Clock MOUNTED on a wall: wall bracket + soft cast shadow + rim; the minute hand sweeps `sweep_min` minutes over `dur` seconds."""
    ticks = "".join(f"<path d='M{x},{y - r + 9} v{14 if i % 3 == 0 else 8}' stroke='#0b0620' stroke-width='{5 if i % 3 == 0 else 3}' transform='rotate({i * 30} {x} {y})'/>" for i in range(12))
    svg = (f"<g id='{cid}'><circle cx='{x + 8}' cy='{y + 10}' r='{r + 8}' fill='#000' opacity='0.16'/>"
           f"<circle cx='{x}' cy='{y}' r='{r + 8}' fill='#2a2233' stroke='#0b0620' stroke-width='6'/><circle cx='{x}' cy='{y}' r='{r}' fill='#faf5e8' stroke='#0b0620' stroke-width='4'/>{ticks}"
           f"<g id='{cid}-h' transform='rotate({h0 * 30 + m0 * 0.5} {x} {y})'><path d='M{x},{y} v-{r * 0.5:.0f}' stroke='#0b0620' stroke-width='9' stroke-linecap='round'/></g>"
           f"<g id='{cid}-m' transform='rotate({m0 * 6} {x} {y})'><path d='M{x},{y} v-{r * 0.78:.0f}' stroke='#0b0620' stroke-width='6' stroke-linecap='round'/></g><circle cx='{x}' cy='{y}' r='7' fill='#e6322c'/></g>")
    js = (f"tl.fromTo('#{cid}',{{opacity:0,scale:0.85,transformOrigin:'{x}px {y}px'}},{{opacity:1,scale:1,duration:0.5,ease:'back.out(1.6)',immediateRender:false}},{t0:.2f});"
          f"tl.to('#{cid}-m',{{rotation:{m0 * 6 + sweep_min * 6},svgOrigin:'{x} {y}',duration:{dur:.2f},ease:'power1.inOut'}},{t0 + 0.3:.2f});"
          f"tl.to('#{cid}-h',{{rotation:{h0 * 30 + (m0 + sweep_min) * 0.5},svgOrigin:'{x} {y}',duration:{dur:.2f},ease:'power1.inOut'}},{t0 + 0.3:.2f});")
    return svg, js

def chat_bubbles(cid, x, y, lines, t0=0.3, gap=0.55, w=420):
    """Chat bubbles that rise + pop in one by one. lines = [(text, 'me'|'them'), ...]."""
    svg, js = "", ""
    for i, (txt, who) in enumerate(lines):
        yy = y + i * 92; bx = x if who == "them" else x + 150
        col, tc = ("#ffffff", "#2a1f3d") if who == "them" else ("#4a78b8", "#ffffff")
        svg += (f"<g id='{cid}-b{i}' opacity='0'><g transform='translate({bx},{yy})'><rect x='0' y='0' width='{w}' height='74' rx='26' fill='{col}' stroke='#0b0620' stroke-width='5'/>"
                f"<text x='{w / 2}' y='48' font-size='34' font-family='Kalam' font-weight='700' fill='{tc}' text-anchor='middle'>{txt}</text></g></g>")
        js += f"tl.fromTo('#{cid}-b{i}',{{y:40,opacity:0,scale:0.85,transformOrigin:'{bx}px {yy}px'}},{{y:0,opacity:1,scale:1,duration:0.4,ease:'back.out(1.8)',immediateRender:false}},{t0 + i * gap:.2f});"
    return svg, js

def cash_counter(cid, x, y, start, end, t0=0.3, dur=1.6, n_bills=6, prefix="$"):
    """Bills fly in and stack; a big number counts up smoothly (seek-safe onUpdate)."""
    r = random.Random(5); svg, js = "", ""
    for i in range(n_bills):
        bx, by = x + r.uniform(-40, 40), y + 60 - i * 16
        svg += (f"<g id='{cid}-bl{i}' opacity='0'><g transform='translate({bx:.0f},{by:.0f}) rotate({r.uniform(-8, 8):.0f})'><rect x='-90' y='-38' width='180' height='76' rx='8' fill='#8fd18f' stroke='#0b0620' stroke-width='5'/>"
                f"<circle r='22' fill='#6bb56b' stroke='#0b0620' stroke-width='4'/><text y='10' font-size='30' font-family='Kalam' font-weight='700' fill='#0b0620' text-anchor='middle'>$</text></g></g>")
        js += f"tl.fromTo('#{cid}-bl{i}',{{x:-420,y:-200,rotation:-25,opacity:0}},{{x:0,y:0,rotation:0,opacity:1,duration:0.5,ease:'power3.out',immediateRender:false}},{t0 + i * (dur / n_bills) * 0.7:.2f});"
    svg += f"<text id='{cid}-num' x='{x}' y='{y - 120}' font-size='120' font-family='Kalam' font-weight='700' fill='#fff' stroke='#0b0620' stroke-width='12' paint-order='stroke' text-anchor='middle' opacity='0'>{prefix}{start}</text>"
    js += (f"tl.to('#{cid}-num',{{opacity:1,duration:0.3}},{t0:.2f});(function(){{const o={{v:{start}}};tl.to(o,{{v:{end},duration:{dur:.2f},ease:'power2.out',onUpdate:function(){{const e=document.getElementById('{cid}-num');if(e)e.textContent='{prefix}'+Math.round(o.v);}}}},{t0:.2f});}})();")
    return svg, js

def polaroid(pid, x, y, content_svg="", rot=-4, t0=0.3, k=1.0):
    """A framed photo that drops onto a surface with a bounce-settle and a contact shadow."""
    svg = (f"<g id='{pid}' opacity='0'><g transform='translate({x},{y}) rotate({rot}) scale({k})'><rect x='-150' y='-130' width='300' height='300' rx='6' fill='#000' opacity='0.18' transform='translate(10,12)'/>"
           f"<rect x='-150' y='-150' width='300' height='300' rx='6' fill='#fffdf5' stroke='#0b0620' stroke-width='6'/><rect x='-126' y='-126' width='252' height='220' fill='#e8d3a8'/>{content_svg}</g></g>")
    js = f"tl.fromTo('#{pid}',{{y:-260,opacity:0}},{{y:0,opacity:1,duration:0.7,ease:'bounce.out',immediateRender:false}},{t0:.2f});"
    return svg, js
