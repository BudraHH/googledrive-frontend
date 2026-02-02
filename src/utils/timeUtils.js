
export const getTimeCategory = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Check if valid date
    if (isNaN(date.getTime())) return 'Never';

    if (date >= startOfToday) return 'Today';
    if (date >= startOfYesterday) return 'Yesterday';

    const oneWeekAgo = new Date(startOfToday);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (date >= oneWeekAgo) return 'Last week';

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (date >= startOfMonth) return 'Earlier this month';

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    if (date >= startOfLastMonth) return 'Last month';

    return 'Older';
};

export const groupItemsByTime = (items) => {
    const timeOrder = [
        'Today',
        'Yesterday',
        'Last week',
        'Earlier this month',
        'Last month',
        'Older',
        'Never'
    ];

    const groups = {};
    timeOrder.forEach(key => groups[key] = []);
    groups['Other'] = [];

    items.forEach(item => {
        // Use modifiedDate or updatedAt or created_at
        const dateStr = item.updatedAt || item.modifiedDate;
        const category = dateStr ? getTimeCategory(dateStr) : 'Never';

        if (groups[category]) {
            groups[category].push(item);
        } else {
            groups['Other'].push(item);
        }
    });

    const result = [];
    timeOrder.forEach(key => {
        if (groups[key].length > 0) {
            result.push({ name: key, items: groups[key] });
        }
    });

    if (groups['Other'].length > 0) {
        result.push({ name: 'Other', items: groups['Other'] });
    }

    return result;
};
