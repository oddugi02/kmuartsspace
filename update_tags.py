import re
import json

with open('src/data/locations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add designTags to Location interface
if 'designTags?: string[];' not in content:
    content = content.replace('exhibitionStatus?: "현재 전시 중" | "전시 준비 중";', 'exhibitionStatus?: "현재 전시 중" | "전시 준비 중";\n  designTags?: string[];')

design_tags_map = {
    1: ["순수미술", "건축"],
    2: ["클래식", "다이닝", "공간"],
    3: ["설치미술", "그래픽"],
    5: ["가구디자인", "공간"],
    7: ["건축", "브랜딩", "공간"],
    8: ["공간", "건축", "브랜딩"],
    9: ["사진", "편집", "타이포그래피"],
    10: ["브랜딩", "인터랙티브", "공간"],
    11: ["그래픽", "순수미술"],
    12: ["순수미술"],
    13: ["건축", "설치미술", "인터랙티브"],
    37: ["순수미술", "그래픽", "미디어아트"],
    38: ["건축", "편집", "타이포그래피"],
    14: ["인터랙티브", "모션", "설치미술"],
    15: ["타이포그래피", "그래픽", "편집"],
    16: ["순수미술"],
    17: ["건축", "순수미술"],
    18: ["공예", "건축"],
    19: ["타이포그래피", "편집"],
    20: ["건축", "순수미술"],
    22: ["설치미술", "건축"],
    23: ["건축", "순수미술"],
    24: ["아카이브", "편집", "타이포그래피"],
    26: ["브랜딩", "타이포그래피", "모션"],
    27: ["사운드", "공간"],
    28: ["사진", "편집", "공간"],
    39: ["사운드", "브랜딩"],
    29: ["설치미술", "공간"],
    30: ["편집", "공예", "타이포그래피"],
    31: ["사운드", "건축"],
    32: ["그래픽", "편집", "브랜딩"],
    33: ["브랜딩", "공간", "사운드"],
    34: ["공예", "공간", "건축"],
    35: ["건축", "순수미술"],
    40: ["모션", "사운드", "공간"],
    41: ["편집", "타이포그래피"],
    42: ["브랜딩", "공간", "가구디자인"],
    43: ["건축", "순수미술"],
    44: ["공간", "패션", "브랜딩"],
    45: ["편집", "타이포그래피", "독립출판"],
    46: ["브랜딩", "공예", "공간"],
    47: ["공예", "편집"],
    48: ["조각", "설치미술", "공간"]
}

def replacer(match):
    id_val = int(match.group(1))
    original = match.group(0)
    
    # Remove exhibitionStatus from id 8 and 44
    if id_val in [8, 44]:
        original = re.sub(r',\s*exhibitionStatus:\s*"[^"]+"', '', original)

    if id_val in design_tags_map:
        tags = design_tags_map[id_val]
        tags_str = json.dumps(tags, ensure_ascii=False)
        
        if 'designTags:' not in original:
            # Insert designTags before 'name:'
            replaced = original.replace('name: "', f'designTags: {tags_str}, name: "')
            return replaced
    return original

new_content = re.sub(r'\{\s*id:\s*(\d+)[^}]+\}', replacer, content)

with open('src/data/locations.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("locations.ts updated successfully with designTags")
