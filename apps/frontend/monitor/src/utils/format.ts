type InRow = {
  date: string;
  event_type: 'error' | 'behavior' | 'performance' | 'desktop'; // 'error' | 'behavior' | ...
  resting?: number;
  desktop?: number;
  visitors?: number;
};

type OutRow = {
  date: string;
  event_type: 'all';
  resting: number;
  desktop: number;
  visitors: number; // = resting
};

export function toAllFormat(rows: InRow[]): OutRow[] {
  const map = new Map<string, OutRow>();

  rows.forEach(r => {
    const cur = map.get(r.date) || { date: r.date, event_type: 'all', resting: 0, desktop: 0, visitors: 0 };

    if (r.event_type === 'error') {
      const v = Number(r.resting ?? r.visitors ?? 0);
      cur.resting += v;
      cur.visitors = cur.resting; // visitors 跟随 resting
    } else {
      const v = Number(r.desktop ?? r.visitors ?? 0);
      cur.desktop += v;
    }

    map.set(r.date, cur);
  });

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}
