import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// ✅ API URL - يُقرأ من متغير البيئة أو يستخدم fallback لـ production
var apiBaseUrl = process.env.VITE_API_BASE_URL || 'https://amal-for-treatment.onrender.com/api';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        // ✅ Plugins الأساسية
        plugins: [react()],
        // ✅.resolve alias للاستيراد بـ @
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // ✅ Proxy يعمل محلياً فقط - لا يؤثر على production
        server: mode === 'development' ? {
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://127.0.0.1:8002',
                    changeOrigin: true,
                    secure: false,
                },
            },
        } : {},
        // ✅ Define - لمنع حقن قيم محلية في production
        // هذا يضمن استخدام environment variable بشكل صحيح
        define: {
            'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
        },
        // ✅ تحسينات بناء production
        build: {
            outDir: 'dist',
            sourcemap: false,
            minify: 'esbuild',
            rollupOptions: {
                output: {
                    manualChunks: {
                        // فصل الـ dependencies الكبيرة
                        vendor: ['react', 'react-dom', 'react-router-dom'],
                        ui: ['lucide-react', '@tanstack/react-query'],
                    },
                },
            },
        },
        // ✅ إعدادات preview لـ Vercel
        preview: {
            port: 3000,
            strictPort: true,
        },
    });
});
