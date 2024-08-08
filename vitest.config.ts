import { defineConfig } from 'vitest/config.js';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'json', 'html'],
		},
	},
});
