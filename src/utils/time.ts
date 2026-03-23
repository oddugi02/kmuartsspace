export function isOpenNow(hoursString: string, currentTime = new Date()): boolean {
  if (!hoursString) return false;
  if (hoursString.includes("상이") || hoursString.includes("다름") || hoursString.includes("미정")) return false;

  const dayOfWeek = currentTime.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const todayStr = days[dayOfWeek];

  const dayIdxMap: Record<string, number> = { "일":0, "월":1, "화":2, "수":3, "목":4, "금":5, "토":6 };
  
  // 1. Check for closed days (e.g., "(월요일 휴관)", "(일-수 휴무)")
  if (hoursString.includes("휴관") || hoursString.includes("휴무")) {
    const regex = /([일월화수목금토](?:요일)?(?:-[일월화수목금토](?:요일)?)?(?:(?:,\s*)?[일월화수목금토](?:요일)?)*)\s*(?:휴관|휴무)/;
    const match = hoursString.match(regex);
    if (match) {
      const condition = match[1];
      if (condition.includes("-")) {
        const [startDay, endDay] = condition.replace(/요일/g, "").split("-").map(d => d.trim());
        const startIdx = dayIdxMap[startDay];
        const endIdx = dayIdxMap[endDay];
        if (startIdx !== undefined && endIdx !== undefined) {
           if (startIdx <= endIdx) {
             if (dayOfWeek >= startIdx && dayOfWeek <= endIdx) return false;
           } else {
             if (dayOfWeek >= startIdx || dayOfWeek <= endIdx) return false;
           }
        }
      } else {
        const cleanCondition = condition.replace(/요일/g, "");
        if (cleanCondition.includes(todayStr)) {
          return false;
        }
      }
    }
  }

  // 2. Extract standard open/close times
  const timeRegex = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;
  const timeMatch = hoursString.match(timeRegex);
  
  if (timeMatch) {
    const startHour = parseInt(timeMatch[1], 10);
    const startMin = parseInt(timeMatch[2], 10);
    const endHour = parseInt(timeMatch[3], 10);
    const endMin = parseInt(timeMatch[4], 10);

    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();

    const currentMins = currentHour * 60 + currentMin;
    const startMins = startHour * 60 + startMin;
    let endMins = endHour * 60 + endMin;
    
    // Handle opening that extends past midnight (e.g. 18:00 - 02:00)
    if (endMins < startMins) {
      endMins += 24 * 60; 
    }

    let isTimeValid = false;
    if (currentMins >= startMins && currentMins <= endMins) {
      isTimeValid = true;
    }
    
    // 3. Exception for extended hours on specific days
    // e.g., "(수, 토 21:00 야간개장)" or "(금요일 21:00까지)"
    const extendedRegex = /([일월화수목금토](?:요일)?(?:,\s*[일월화수목금토](?:요일)?)*)[^\d]*(\d{1,2}):(\d{2})\s*(?:야간개장|까지)/;
    const extMatch = hoursString.match(extendedRegex);
    if (extMatch) {
      const extDays = extMatch[1].replace(/요일/g, "");
      if (extDays.includes(todayStr)) {
         const extEndHour = parseInt(extMatch[2], 10);
         const extEndMin = parseInt(extMatch[3], 10);
         const extEndMins = extEndHour * 60 + extEndMin;
         // Note: Assuming extended times don't wrap past midnight for this dataset
         if (currentMins >= startMins && currentMins <= extEndMins) {
           isTimeValid = true;
         }
      }
    }

    return isTimeValid;
  }

  // If no time string matched, we cannot guarantee it's open
  return false;
}
