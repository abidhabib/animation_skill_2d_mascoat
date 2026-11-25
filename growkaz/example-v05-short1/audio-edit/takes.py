# Download both Fish takes per line, transcribe them, check text / clipped endings, pick one. Writes raw/ + voices.json.
import json, os, re, subprocess, urllib.request
from email.utils import parsedate_to_datetime
import numpy as np
from faster_whisper import WhisperModel
os.chdir(os.path.dirname(os.path.abspath(__file__))); os.makedirs("raw", exist_ok=True)
NARR, YOU, DAD = ("narrator", "ea236949cd944d4f817eaf17410b2427"), ("you", "f8fb3d11726f44849b9ebc07f499abe6"), ("dad", "1428515a637f4915872df4a9d7101498")
L = [  # key, voice, tag, text, take1, take2 (history order)
 ("N1", NARR, "", "Starting today, you get one dollar for every minute you ignore your phone.", "04e8690a26d245f8a18312bf4afdf8a0", "fc0772f3b23847019f3e146a9dcbe483"),
 ("Y1", YOU, "excited", "Easy money. I'm going to be rich!", "d6b29c5dc28e40869d1be63128d511fe", "ec0bd5f4fcd940eb981b97bec8dc598d"),
 ("N2", NARR, "", "So you sit on the couch, and you stare at the wall.", "0fcd4da8b2264e75a09522e8384f0887", "c8095832e4484aa6b3ecbd907054770c"),
 ("N3", NARR, "", "Nine minutes, nine dollars.", "8eb985066dd14abaadebeedb58c9d0f1", "c4d49a62fb2f4c1cb97c20972b0cebb0"),
 ("N4", NARR, "", "Then it buzzes. You grab it, and everything drops to zero.", "611b327d50f54a0ca20cf2e6ebc6a7b6", "df3f62fe3c834d118f00246541c6f1ed"),
 ("Y2", YOU, "frustrated", "It was a spam message!", "78732e7bf8734164b408e530ff60dcfe", "09337a02172a4c05b6c2a55ea13d864d"),
 ("N5", NARR, "", "That night, you lock your phone in a drawer, and Dad asks you to help him cook.", "88aeb7a14c724c25b5ebca87cec90533", "6b39c314870e4f179cfc4ae982d2a3eb"),
 ("D1", DAD, "amused", "Careful, you're burning the onions.", "b226fffb1b9c43919c4744f8bd1bddc6", "c2c4cce1af294530a53a2e748c9f9ba9"),
 ("N6", NARR, "", "You laugh. He tells you how he met your mom, and you keep asking for more.", "d7bf6f2d9100426f80bc0ed0c4e76466", "25ba956197c949618f23eb19c3731425"),
 ("D2", DAD, "soft, touched", "You haven't stayed this long in years.", "da6a8413aa8349659ae3b691d0fdf4de", "6153afbc089740f2880a62886bed73da"),
 ("Y3", YOU, "hesitant, soft", "I know. I'm sorry, Dad.", "9b170e948a424858b2f87e50f764e198", "a99667a8d9d64d21ac5dd68724aec191"),
 ("N7", NARR, "", "At midnight, you open the drawer. Two hundred and forty dollars.", "afc662541fdf439dbca8252e299a23cb", "2ed325189037465d90f8bbd6f61ab9e7"),
 ("N8", NARR, "", "Four hours, and you never once thought about the money.", "918f48ace99e423fabe57b4f5f91357e", "d54f4c0ebee34fa7bf84d53f15a8a225"),
 ("N9", NARR, "", "The next evening, the game is over. No more dollars. You put your phone in the drawer anyway.", "8b86e9dfbb3745c1a703550ddf4a0cf0", "83f4dd0c46914219acddfbfbf0d41a0b"),
 ("D3", DAD, "playful, teasing", "Back to burn more onions?", "889b5e223c3f4a54a75bd1076b39327d", "da1132a20bfc4e4fa9d46112b4dd0e12"),
 ("Y4", YOU, "warm, smiling", "Yeah. Same time every night.", "29cdcfafcd2d44de8aeb28ab9f352780", "cdbd839f37824e4d9a3f531ae6afeac4"),
 ("N10", NARR, "", "The money got you into the kitchen. Your dad is why you stayed.", "94a4b11ad3264c46b74d8e35d2f73d66", "fe3a0875be7842bcaa769181ff402034"),
]
NUM = {"1": "one", "9": "nine", "4": "four", "240": "two hundred and forty", "$1": "one dollar", "$9": "nine dollars", "$240": "two hundred and forty dollars"}
def norm(s):
    s = s.lower().replace("’", "'")
    s = re.sub(r"\$(\d+)", lambda m: NUM.get(m[1], m[1]) + " dollars", s)
    s = re.sub(r"\d+", lambda m: NUM.get(m[0], m[0]), s)
    return re.sub(r"[^a-z' ]", " ", s.replace("-", " ")).split()
model = WhisperModel("small.en", device="cpu", compute_type="int8")
log = []
for key, (who, mid), tag, text, a, b in L:
    takes = []
    for tid in (a, b):
        path = f"raw/{key}_{tid[:8]}.mp3"
        with urllib.request.urlopen(urllib.request.Request(f"https://platform.r2.fish.audio/tasks/2026-11-25/{tid}.mp3", headers={"User-Agent": "studio-kit"}), timeout=40) as r:
            open(path, "wb").write(r.read()); mod = parsedate_to_datetime(r.headers["Last-Modified"]).timestamp()
        pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
        heard = " ".join(s.text for s in model.transcribe(np.frombuffer(pcm, np.float32), language="en")[0]).strip()
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True).stdout)
        tail = subprocess.run(["ffmpeg", "-sseof", "-0.05", "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
        end_db = float(re.search(r"max_volume: (-?[\d.]+)", tail)[1])
        want, got = norm(text), norm(heard)
        extra = [w for w in got if w not in want]
        score = sum(1 for w in want if w in got) / len(want)
        takes.append(dict(id=tid, file=path, mod=mod, dur=round(dur, 2), heard=heard, score=round(score, 2), extra=extra, end_db=end_db))
    # preference: exact words, no extra words (spoken tags), quiet ending; ties -> the older take
    takes.sort(key=lambda t: (-(t["score"] >= 0.99 and not t["extra"]), t["end_db"] > -20, t["mod"], t["id"] != b))
    best = takes[0]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", best["file"], "-c", "copy", f"raw/{key}.mp3"], check=True)
    log.append(dict(key=key, speaker=who, model=mid, speed=1.0, tag=tag, text=text, picked=best["id"], takes=[{k: v for k, v in t.items() if k != "mod"} for t in takes]))
    print(key, f"{best['dur']}s score={best['score']} extra={best['extra']} end={best['end_db']}dB | {best['heard']}")
json.dump(log, open("voices.json", "w", encoding="utf-8"), indent=1)
