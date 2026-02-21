import { GitCommands } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export const GIT_COMMANDS: GitCommands = {
	basic: [
		{
			command: 'git init',
			description: 'Initialize a new Git repository',
			example: 'git init my-project',
			details:
				'Creates a new Git repository in the current directory or specified directory. This is the first command you run in a new project.',
			useCases: [
				'Starting a new project',
				'Converting existing project to Git',
				'Creating a local repository',
			],
			options: [
				'--bare: Create a bare repository',
				'--template: Use a template directory',
			],
			icon: getFontAwesomeIcon('GitCommit', 'w-8 h-8'),
		},
		{
			command: 'git clone',
			description: 'Clone an existing repository',
			example: 'git clone https://github.com/user/repo.git',
			details:
				'Creates a local copy of a remote repository. Downloads all files, commit history, and branches.',
			useCases: [
				'Getting a copy of an existing project',
				'Contributing to open source',
				'Setting up development environment',
			],
			options: [
				'--depth 1: Shallow clone (only latest commit)',
				'--branch: Clone specific branch',
				'--recursive: Clone submodules',
			],
			icon: getFontAwesomeIcon('Download', 'w-6 h-6 text-blue-500'),
		},
		{
			command: 'git add',
			description: 'Stage changes for commit',
			example: 'git add .',
			details:
				'Adds files to the staging area. Changes must be staged before they can be committed.',
			useCases: [
				'Preparing files for commit',
				'Selective staging',
				'Adding new files to tracking',
			],
			options: [
				'git add . : Add all changes',
				'git add file.txt : Add specific file',
				'git add -p : Interactive staging',
			],
			icon: getFontAwesomeIcon('Plus', 'w-4 h-4'),
		},
		{
			command: 'git commit',
			description: 'Commit staged changes',
			example: 'git commit -m "feat: add new feature"',
			details:
				'Creates a new commit with the staged changes. Each commit represents a snapshot of your project.',
			useCases: [
				'Saving work progress',
				'Creating checkpoints',
				'Documenting changes',
			],
			options: [
				'-m: Add commit message',
				'-a: Stage and commit all tracked files',
				'--amend: Modify last commit',
			],
			icon: getFontAwesomeIcon('Save', 'w-4 h-4'),
		},
		{
			command: 'git push',
			description: 'Push commits to remote',
			example: 'git push origin main',
			details:
				'Uploads local commits to the remote repository. Makes your changes available to others.',
			useCases: [
				'Sharing changes with team',
				'Backing up work',
				'Deploying to production',
			],
			options: [
				'-u: Set upstream branch',
				'--force: Force push (dangerous)',
				'--tags: Push tags',
			],
			icon: getFontAwesomeIcon('Upload', 'w-4 h-4'),
		},
		{
			command: 'git pull',
			description: 'Pull latest changes',
			example: 'git pull origin main',
			details:
				'Downloads and merges changes from the remote repository. Keeps your local repository up to date.',
			useCases: [
				'Getting latest changes',
				'Syncing with team',
				'Updating before starting work',
			],
			options: [
				'--rebase: Rebase instead of merge',
				'--ff-only: Fast-forward only',
				'--no-ff: No fast-forward',
			],
			icon: getFontAwesomeIcon('Download', 'w-4 h-4'),
		},
		{
			command: 'git status',
			description: 'Show repository status',
			example: 'git status',
			details:
				'Shows the current state of your working directory and staging area. Essential for understanding what has changed.',
			useCases: [
				'Checking what files have changed',
				'Seeing staged vs unstaged changes',
				'Understanding repository state',
			],
			options: [
				'-s: Short format',
				'--porcelain: Machine-readable format',
				'--ignored: Show ignored files',
			],
			icon: getFontAwesomeIcon('Eye', 'w-4 h-4'),
		},
	],
	advanced: [
		{
			command: 'git branch',
			description: 'List/create/delete branches',
			example: 'git branch feature-auth',
			details:
				'Manages branches in your repository. Branches allow you to work on features independently.',
			useCases: [
				'Creating feature branches',
				'Listing all branches',
				'Deleting merged branches',
			],
			options: [
				'-a: List all branches',
				'-d: Delete branch',
				'-m: Rename branch',
			],
			icon: getFontAwesomeIcon('GitBranch', 'w-4 h-4'),
		},
		{
			command: 'git checkout',
			description: 'Switch branches or restore files',
			example: 'git checkout feature-auth',
			details:
				'Switches between branches or restores files from a specific commit. Changes your working directory.',
			useCases: [
				'Switching between branches',
				'Restoring files',
				'Creating new branches',
			],
			options: [
				'-b: Create and switch to new branch',
				'--track: Track remote branch',
				'--force: Force checkout',
			],
			icon: getFontAwesomeIcon('RefreshCw', 'w-4 h-4'),
		},
		{
			command: 'git merge',
			description: 'Merge branches',
			example: 'git merge feature-auth',
			details:
				'Combines changes from one branch into another. Creates a merge commit if there are conflicts.',
			useCases: [
				'Integrating feature branches',
				'Combining work from different developers',
				'Merging hotfixes',
			],
			options: [
				'--no-ff: Create merge commit',
				'--squash: Squash commits',
				'--abort: Abort merge',
			],
			icon: getFontAwesomeIcon('Merge', 'w-4 h-4'),
		},
		{
			command: 'git rebase',
			description: 'Rebase commits',
			example: 'git rebase main',
			details:
				'Replays commits from one branch onto another. Creates a linear history without merge commits.',
			useCases: [
				'Cleaning up commit history',
				'Integrating changes',
				'Preparing for merge',
			],
			options: [
				'-i: Interactive rebase',
				'--onto: Rebase onto specific commit',
				'--continue: Continue rebase',
			],
			icon: getFontAwesomeIcon('Split', 'w-4 h-4'),
		},
		{
			command: 'git stash',
			description: 'Temporarily save changes',
			example: 'git stash',
			details:
				'Saves uncommitted changes temporarily so you can switch branches or pull changes.',
			useCases: [
				'Switching branches with uncommitted changes',
				'Saving work in progress',
				'Quick context switching',
			],
			options: [
				'pop: Apply and remove stash',
				'list: List all stashes',
				'drop: Delete stash',
			],
			icon: getFontAwesomeIcon('Archive', 'w-4 h-4'),
		},
		{
			command: 'git reset',
			description: 'Reset commits or staging area',
			example: 'git reset --hard HEAD~1',
			details:
				'Moves the current branch pointer to a different commit. Can be used to undo commits or unstage files.',
			useCases: [
				'Undoing commits',
				'Unstaging files',
				'Reverting to previous state',
			],
			options: [
				'--soft: Keep changes staged',
				'--mixed: Unstage changes',
				'--hard: Discard all changes',
			],
			icon: getFontAwesomeIcon('RefreshCw', 'w-4 h-4'),
		},
		{
			command: 'git revert',
			description: 'Create a new commit that undoes changes',
			example: 'git revert abc123',
			details:
				'Creates a new commit that undoes the changes from a previous commit. Safe for shared repositories.',
			useCases: [
				'Undoing changes in shared repositories',
				'Fixing bugs in production',
				'Rolling back features',
			],
			options: [
				'-n: No commit, just stage changes',
				'--no-edit: Use default commit message',
				'-m: Specify parent for merge',
			],
			icon: getFontAwesomeIcon('RefreshCw', 'w-4 h-4'),
		},
	],
	workflow: [
		{
			command: 'git log',
			description: 'View commit history',
			example: 'git log --oneline',
			details:
				'Shows the commit history of the repository. Essential for understanding project evolution.',
			useCases: [
				'Reviewing project history',
				'Finding when changes were made',
				'Understanding commit relationships',
			],
			options: [
				'--oneline: One line per commit',
				'--graph: Show branch graph',
				'--since: Show commits since date',
			],
			icon: getFontAwesomeIcon('History', 'w-4 h-4'),
		},
		{
			command: 'git diff',
			description: 'Show differences between commits',
			example: 'git diff HEAD~1',
			details:
				'Shows the differences between commits, branches, or working directory and staging area.',
			useCases: [
				'Reviewing changes before commit',
				'Comparing different versions',
				'Understanding what changed',
			],
			options: [
				'--cached: Show staged changes',
				'--name-only: Show only file names',
				'--stat: Show statistics',
			],
			icon: getFontAwesomeIcon('FileText', 'w-4 h-4'),
		},
		{
			command: 'git remote',
			description: 'Manage remote repositories',
			example: 'git remote -v',
			details:
				'Manages connections to remote repositories. Essential for collaboration and backup.',
			useCases: [
				'Adding remote repositories',
				'Viewing remote connections',
				'Updating remote URLs',
			],
			options: [
				'-v: Show URLs',
				'add: Add new remote',
				'remove: Remove remote',
				'rename: Rename remote',
			],
			icon: getFontAwesomeIcon('Globe', 'w-4 h-4'),
		},
		{
			command: 'git tag',
			description: 'Create/manage tags',
			example: 'git tag v1.0.0',
			details:
				'Creates lightweight or annotated tags to mark specific points in history. Useful for releases.',
			useCases: [
				'Marking releases',
				'Creating milestones',
				'Tagging important commits',
			],
			options: [
				'-a: Create annotated tag',
				'-l: List tags',
				'-d: Delete tag',
				'--list: List tags with pattern',
			],
			icon: getFontAwesomeIcon('Tag', 'w-4 h-4'),
		},
		{
			command: 'git cherry-pick',
			description: 'Apply specific commits',
			example: 'git cherry-pick abc123',
			details:
				'Applies the changes from a specific commit to the current branch. Useful for hotfixes.',
			useCases: [
				'Applying hotfixes',
				'Moving commits between branches',
				'Selective merging',
			],
			options: [
				'-x: Add cherry-pick reference',
				'-n: No commit, just stage',
				'--continue: Continue cherry-pick',
			],
			icon: getFontAwesomeIcon('Target', 'w-4 h-4'),
		},
		{
			command: 'git fetch',
			description: 'Download objects and refs from remote',
			example: 'git fetch origin',
			details:
				'Downloads changes from remote repository without merging them. Safer than pull.',
			useCases: [
				'Checking for remote changes',
				'Updating remote references',
				'Preparing for merge',
			],
			options: [
				'--all: Fetch all remotes',
				'--prune: Remove deleted remote branches',
				'--dry-run: Show what would be fetched',
			],
			icon: getFontAwesomeIcon('Download', 'w-4 h-4'),
		},
		{
			command: 'git clean',
			description: 'Remove untracked files',
			example: 'git clean -fd',
			details:
				'Removes untracked files and directories from the working directory. Useful for cleaning up.',
			useCases: [
				'Removing build artifacts',
				'Cleaning up untracked files',
				'Preparing for fresh start',
			],
			options: [
				'-f: Force removal',
				'-d: Remove directories',
				'-n: Dry run',
				'-x: Remove ignored files',
			],
			icon: getFontAwesomeIcon('Trash2', 'w-4 h-4'),
		},
	],
}
