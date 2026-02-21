import { ChangelogEntry, ChangelogTool } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export const SAMPLE_COMMITS: ChangelogEntry[] = [
	{
		type: 'feat',
		message: 'add user authentication system',
		hash: 'a1b2c3d',
		author: 'Developer',
		date: '2024-01-15',
		scope: 'auth',
	},
	{
		type: 'fix',
		message: 'resolve login validation bug',
		hash: 'b2c3d4e',
		author: 'Developer',
		date: '2024-01-14',
		scope: 'auth',
	},
	{
		type: 'docs',
		message: 'update API documentation',
		hash: 'c3d4e5f',
		author: 'Developer',
		date: '2024-01-13',
		scope: 'docs',
	},
	{
		type: 'feat',
		message: 'add dark mode support',
		hash: 'd4e5f6g',
		author: 'Developer',
		date: '2024-01-12',
		scope: 'ui',
		breaking: true,
	},
	{
		type: 'fix',
		message: 'fix responsive layout issues',
		hash: 'e5f6g7h',
		author: 'Developer',
		date: '2024-01-11',
		scope: 'ui',
	},
	{
		type: 'perf',
		message: 'optimize database queries',
		hash: 'f6g7h8i',
		author: 'Developer',
		date: '2024-01-10',
		scope: 'db',
	},
]

export const CHANGELOG_TEMPLATES: Record<string, ChangelogTool> = {
	'git-cliff': {
		name: 'git-cliff (Rust)',
		description: 'Highly customizable changelog generator',
		url: 'https://git-cliff.org/',
		features: [
			'Regex-powered parsers',
			'Custom configuration',
			'Multiple formats',
		],
		icon: getFontAwesomeIcon('Zap', 'w-5 h-5'),
	},
	'conventional-changelog': {
		name: 'conventional-changelog',
		description: 'Generate changelogs from conventional commits',
		url: 'https://github.com/conventional-changelog/conventional-changelog',
		features: ['Angular preset', 'Multiple formats', 'Git integration'],
		icon: getFontAwesomeIcon('GitCommit', 'w-5 h-5'),
	},
	'auto-changelog': {
		name: 'auto-changelog',
		description: 'Simple changelog generator from Git history',
		url: 'https://github.com/CookPete/auto-changelog',
		features: ['Simple setup', 'Git integration', 'Custom templates'],
		icon: getFontAwesomeIcon('FileText', 'w-5 h-5'),
	},
}
