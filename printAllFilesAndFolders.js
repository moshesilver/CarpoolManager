// Requires Node.js environment
const fs = require('fs');
const path = require('path');

/**
 * Recursively logs folders and files
 * @param {string} dirPath - The path to start from
 * @param {Set<string>} exclude - Folder names to exclude
 * @param {string} prefix - Used for formatting output
 */
function logFolderContents(dirPath, exclude = new Set(), prefix = '') {
	if (!fs.existsSync(dirPath)) {
		console.error(`Path does not exist: ${dirPath}`);
		return;
	}

	const entries = fs.readdirSync(dirPath, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);

		if (exclude.has(entry.name)) {
			continue;
		}

		console.log(`${prefix}${entry.name}`);

		if (entry.isDirectory()) {
			logFolderContents(fullPath, exclude, prefix + '  ');
		}
	}
}

// Example usage:
const startPath = './'; // replace with your folder path
const excludedFolders = new Set(['node_modules', '.git']); // add more names to skip if needed

logFolderContents(startPath, excludedFolders);
