import re

with open('src/data/locations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Category type to just string
content = re.sub(r'export type Category =[\s\S]*?;', 'export type Category = string;', content)

# 2. Add exhibitionStatus to Location interface
if 'exhibitionStatus?: string;' not in content and 'exhibitionStatus?: "현재 전시 중" | "전시 준비 중";' not in content:
    content = content.replace('website?: string;\n}', 'website?: string;\n  exhibitionStatus?: "현재 전시 중" | "전시 준비 중";\n}')

# 3. Mappings for neighborhood and exhibitionStatus
# We will use regex to find each location object
# { id: 1, category: "...", name: "환기미술관", ... }

updates = {
    1: {"neigh": "부암동", "exh": "현재 전시 중"},
    2: {"neigh": "부암동"},
    3: {"neigh": "창성동", "exh": "전시 준비 중"},
    5: {"neigh": "통의동"},
    7: {"neigh": "가회동", "exh": "현재 전시 중"},
    8: {"neigh": "가회동", "exh": "전시 준비 중"},
    9: {"neigh": "소격동"},
    10: {"neigh": "성수동"},
    11: {"neigh": "사간동", "exh": "현재 전시 중"},
    12: {"neigh": "사간동", "exh": "현재 전시 중"},
    13: {"neigh": "소격동", "exh": "전시 준비 중"},
    37: {"neigh": "소격동", "exh": "현재 전시 중"},
    38: {"neigh": "가회동"},
    14: {"neigh": "세종로"},
    15: {"neigh": "세종로", "exh": "현재 전시 중"},
    16: {"neigh": "서소문동", "exh": "현재 전시 중"},
    17: {"neigh": "정동", "exh": "전시 준비 중"},
    18: {"neigh": "인사동"},
    19: {"neigh": "남대문로"},
    20: {"neigh": "동숭동", "exh": "현재 전시 중"},
    22: {"neigh": "평창동", "exh": "현재 전시 중"},
    23: {"neigh": "평창동", "exh": "현재 전시 중"},
    24: {"neigh": "평창동", "exh": "현재 전시 중"},
    26: {"neigh": "성수동"},
    27: {"neigh": "이태원동"},
    28: {"neigh": "이태원동"},
    39: {"neigh": "한남동"},
    29: {"neigh": "용두동", "exh": "전시 준비 중"},
    30: {"neigh": "중곡동"},
    31: {"neigh": "내곡동", "exh": "현재 전시 중"},
    32: {"neigh": "서초동", "exh": "현재 전시 중"},
    33: {"neigh": "신사동"},
    34: {"neigh": "논현동"},
    35: {"neigh": "신림동", "exh": "전시 준비 중"},
    40: {"neigh": "연희동"},
    41: {"neigh": "을지로"},
    42: {"neigh": "성수동"},
    43: {"neigh": "봉래동", "exh": "현재 전시 중"},
    44: {"neigh": "후암동", "exh": "전시 준비 중"},
    45: {"neigh": "옥인동"},
    46: {"neigh": "성수동"},
    47: {"neigh": "부암동"},
    48: {"neigh": "합정동", "exh": "전시 준비 중"}
}

def replacer(match):
    id_val = int(match.group(1))
    original = match.group(0)
    
    if id_val in updates:
        neigh = updates[id_val]["neigh"]
        exh = updates[id_val].get("exh")
        
        # Replace category
        replaced = re.sub(r'category:\s*"[^"]+"', f'category: "{neigh}"', original)
        
        # Add exhibitionStatus if present
        if exh and 'exhibitionStatus' not in replaced:
            replaced = replaced.replace(f'name: "', f'exhibitionStatus: "{exh}", name: "')
            
        return replaced
    return original

new_content = re.sub(r'\{\s*id:\s*(\d+)[^}]+\}', replacer, content)

with open('src/data/locations.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("locations.ts updated successfully")
