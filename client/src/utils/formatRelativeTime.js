// Simple relative time formatter (fallback if Intl.RelativeTimeFormat not fully supported)
export function formatRelativeTime(dateInput) {
    if (!dateInput) return '—';
    const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '—';

    const now = new Date();
    let diffMs = date.getTime() - now.getTime(); // negative if in past
    const tense = diffMs > 0 ? 'in' : 'ago';
    diffMs = Math.abs(diffMs);

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    const week = Math.floor(day / 7);
    const month = Math.floor(day / 30); // rough
    const year = Math.floor(day / 365); // rough

    const withUnit = (value, unit) => {
        if (value <= 0) return 'just now';
        const plural = value === 1 ? unit : unit + 's';
        return tense === 'ago' ? `${value} ${plural} ago` : `in ${value} ${plural}`;
    };

    if (sec < 60) return 'just now';
    if (min < 60) return withUnit(min, 'min');
    if (hr < 24) return withUnit(hr, 'hour');
    if (day < 7) return withUnit(day, 'day');
    if (week < 5) return withUnit(week, 'week');
    if (month < 12) return withUnit(month, 'month');
    return withUnit(year, 'year');
}

export default formatRelativeTime;