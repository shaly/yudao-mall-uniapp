import { loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';
// import viteCompression from 'vite-plugin-compression';
import uniReadPagesV3Plugin from './sheep/router/utils/uni-read-pages-v3';
import mpliveMainfestPlugin from './sheep/libs/mplive-manifest-plugin';


// https://vitejs.dev/config/
export default (command, mode) => {
	const env = loadEnv(mode, __dirname, 'SHOPRO_');
	return {
		envPrefix: "SHOPRO_",
		plugins: [
			uni(),
			// viteCompression({
			// 	verbose: false
			// }),
			uniReadPagesV3Plugin({
				pagesJsonDir: path.resolve(__dirname, './pages.json'),
				includes: ['path', 'aliasPath', 'name', 'meta'],
			}),
			mpliveMainfestPlugin(env.SHOPRO_MPLIVE_ON)
		],
		server: {
			// host: true,
			// // open: true,
			// port: env.SHOPRO_DEV_PORT,
			// hmr: {
			// 	overlay: true,
			// },

			host: '0.0.0.0',  // 允许外部访问
			port: 3000,       // 开发服务器端口
			proxy: {
				// 匹配所有以 '/api' 开头的请求路径
				'/app-api': {
					target: env.SHOPRO_DEV_BASE_URL,  // 后端API地址 http://127.0.0.1:48080 ，从环境变量获取
					changeOrigin: true,            // 允许跨域
					rewrite: (path) => path.replace(/^\/app-api/, '')  // 重写路径：去掉路径开头的 '/api'
				}
			}
		},
	};
};
