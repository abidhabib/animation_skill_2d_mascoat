"""Ambient life + physics for any scene (user 2026-11-20: moving objects, natural 2.5D touch, professional physics).
Each helper returns (svg, js): put svg into the scene's "extra" and js into the scene's "js" (strings are concatenated).
All motion is finite + deterministic (seed). Scene id prefix = scene name before the first '-' (e.g. "a1-wide" -> "a1").

    from ambient import dust, birds, drift_clouds, steam, falling, bob, combine
    svg, js = combine(dust("a1"), birds("a1", dur), falling("a1", dur, kinds="paper"))
"""
import random

def _rng(seed): return random.Random(seed)

def combine(*parts):
    return "".join(p[0] for p in parts), "".join(p[1] for p in parts)

def dust(sid, n=26, seed=3, y0=120, y1=900, x0=100, x1=1820, color="#fff1c8"):
    """Slow floating motes in a light beam (parallax-friendly: random sizes, speeds)."""
    r = _rng(seed); svg, js = "", ""
    for i in range(n):
        x, y, s = r.uniform(x0, x1), r.uniform(y0, y1), r.uniform(2, 6)
        svg += f"<circle id='{sid}-dm{i}' cx='{x:.0f}' cy='{y:.0f}' r='{s:.1f}' fill='{color}' opacity='{r.uniform(.25, .7):.2f}'/>"
        js += f"tl.fromTo('#{sid}-dm{i}',{{x:0,y:0}},{{x:{r.uniform(-70, 70):.0f},y:{r.uniform(-90, 40):.0f},duration:{r.uniform(5, 9):.1f},ease:'sine.inOut',yoyo:true,repeat:3,immediateRender:false}},0);"
    return svg, js

def birds(sid, dur, n=5, seed=5, y=(140, 360), color="#2a1f3d"):
    """A loose V of birds crossing the sky left -> right (drone/establishing shots)."""
    r = _rng(seed); svg, js = "", ""
    for i in range(n):
        yy = r.uniform(*y) + i * 12; x = -140 - i * 70
        svg += f"<path id='{sid}-bd{i}' d='M-16,0 q8,-10 16,0 q8,-10 16,0' fill='none' stroke='{color}' stroke-width='4' stroke-linecap='round' transform='translate({x},{yy:.0f})'/>"
        js += (f"tl.to('#{sid}-bd{i}',{{x:{2200 + i * 70},duration:{max(3, dur):.1f},ease:'none'}},0);"
               f"tl.to('#{sid}-bd{i}',{{y:'+=18',duration:0.5,ease:'sine.inOut',yoyo:true,repeat:{int(max(3, dur) / 0.5)}}},0);")
    return svg, js

def drift_clouds(sid, dur, n=3, seed=2, y=(90, 330), fill="#ffffff", opacity=0.55):
    r = _rng(seed); svg, js = "", ""
    for i in range(n):
        x, yy, k = r.uniform(100, 1600), r.uniform(*y), r.uniform(0.6, 1.2)
        svg += (f"<g id='{sid}-cl{i}' opacity='{opacity}'><g transform='translate({x:.0f},{yy:.0f}) scale({k:.2f})'>"
                f"<ellipse cx='0' cy='0' rx='120' ry='34' fill='{fill}'/><ellipse cx='60' cy='-22' rx='70' ry='34' fill='{fill}'/><ellipse cx='-50' cy='-16' rx='54' ry='28' fill='{fill}'/></g></g>")
        js += f"tl.to('#{sid}-cl{i}',{{x:{r.uniform(160, 340):.0f},duration:{max(3, dur):.1f},ease:'none'}},0);"
    return svg, js

def steam(sid, x, y, n=4, color="#ffffff", dur=6):
    """Rising curls (cup, toaster, pipe)."""
    svg, js = "", ""
    for i in range(n):
        svg += f"<path id='{sid}-st{i}' d='M0,0 c-10,-20 10,-36 0,-56' fill='none' stroke='{color}' stroke-width='6' stroke-linecap='round' opacity='0' transform='translate({x + i * 14 - 20},{y})'/>"
        js += (f"tl.fromTo('#{sid}-st{i}',{{y:0,opacity:0}},{{y:-70,opacity:0.7,duration:1.4,ease:'sine.out',yoyo:false,repeat:{int(dur / 1.6)},repeatDelay:0.2,immediateRender:false}},{i * 0.35});"
               f"tl.to('#{sid}-st{i}',{{opacity:0,duration:0.5,repeat:{int(dur / 1.6)},repeatDelay:1.1}},{i * 0.35 + 1.0});")
    return svg, js

def falling(sid, dur, n=8, seed=7, kinds="paper", x0=300, x1=1700, y_start=-120, floor=980, t0=0.0):
    """Objects dropped with real physics: gravity ease (power2.in), a small bounce, a settle rotation. kinds: paper | coin | leaf."""
    r = _rng(seed); svg, js = "", ""
    for i in range(n):
        x = r.uniform(x0, x1); t = t0 + r.uniform(0, max(0.2, dur * 0.6)); rot = r.uniform(-30, 30); fl = floor + r.uniform(-30, 20)
        if kinds == "coin": shape = "<circle r='16' fill='#ffd24a' stroke='#0b0620' stroke-width='4'/><path d='M-6,-6 L6,6' stroke='#c58a10' stroke-width='3'/>"
        elif kinds == "leaf": shape = "<path d='M0,-20 q22,14 0,40 q-22,-26 0,-40' fill='#e08a3a' stroke='#0b0620' stroke-width='3'/>"
        else: shape = "<rect x='-22' y='-28' width='44' height='56' fill='#fff' stroke='#0b0620' stroke-width='4' rx='3'/><path d='M-12,-12 h24 M-12,0 h24 M-12,12 h16' stroke='#9aa' stroke-width='3'/>"
        svg += f"<g id='{sid}-fl{i}' opacity='0' transform='translate({x:.0f},{y_start})'><g class='{sid}-flr{i}'>{shape}</g></g>"
        js += (f"tl.set('#{sid}-fl{i}',{{opacity:1}},{t:.2f});"
               f"tl.to('#{sid}-fl{i}',{{y:{fl - y_start:.0f},duration:0.95,ease:'power2.in'}},{t:.2f});"
               f"tl.to('#{sid}-fl{i}',{{y:'-=34',duration:0.2,ease:'power2.out'}},{t + 0.95:.2f});tl.to('#{sid}-fl{i}',{{y:'+=34',duration:0.2,ease:'power2.in'}},{t + 1.15:.2f});"
               f"tl.fromTo('.{sid}-flr{i}',{{rotation:{rot:.0f}}},{{rotation:{-rot * 0.4:.0f},duration:1.35,ease:'sine.out',immediateRender:false}},{t:.2f});")
    return svg, js

def bob(sel, amp=8, per=1.6, dur=8):
    """Gentle hover (floating number, lamp, balloon)."""
    return "", f"tl.to('{sel}',{{y:-{amp},duration:{per},ease:'sine.inOut',yoyo:true,repeat:{max(1, int(dur / per))}}},0);"

def lightrays(sid, x, y, w=900, h=900, color="#ffd98a", op=0.16, sway=40, dur=8):
    """Soft angled shafts from a window, slowly swaying."""
    svg = f"<g id='{sid}-lr' opacity='{op}'><path d='M{x},{y} L{x + w},{y + h} L{x + w - 260},{y + h} L{x - 120},{y}Z' fill='{color}'/><path d='M{x + 300},{y} L{x + w + 260},{y + h} L{x + w + 40},{y + h} L{x + 180},{y}Z' fill='{color}' opacity='0.7'/></g>"
    return svg, f"tl.to('#{sid}-lr',{{x:{sway},duration:{max(3, dur) / 2:.1f},ease:'sine.inOut',yoyo:true,repeat:1}},0);"
