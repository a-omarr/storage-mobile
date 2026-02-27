import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
    token: {
        colorPrimary: '#1677ff',
        borderRadius: 12,
        fontFamily: "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: 14,
    },
    components: {
        Button: { borderRadius: 12 },
        Card: { borderRadius: 12 },
        Input: { borderRadius: 10 },
        Select: { borderRadius: 10 },
    },
};