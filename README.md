# Hands-on Git Practice: Complete Beginner Workflow

## 1. Create a new project

```bash
mkdir my-first-project
cd my-first-project
```

---

## 2. Initialize Git

```bash
git init
```

This creates a hidden `.git` folder, which turns your project into a Git repository.

---

## 3. Check the repository status

```bash
git status
```

Git tells you what is happening in your repository, such as untracked, modified, or staged files.

---

## 4. Create a file

```bash
touch README.md
```

Or open the folder in VS Code:

```bash
code .
```

Add the following content to `README.md`:

```markdown
# My First Git Project

Learning Git with ChatGPT 🚀
```

Save the file.

---

## 5. Check the status again

```bash
git status
```

You should see:

```
Untracked files:
README.md
```

This means Git sees the file but is not tracking it yet.

---

## 6. Stage the file

```bash
git add README.md
```

Or stage everything:

```bash
git add .
```

Check the status again:

```bash
git status
```

You should now see:

```
Changes to be committed:
new file: README.md
```

---

## 7. Create your first commit

```bash
git commit -m "Create README"
```

Congratulations! You have created your first Git commit.

---

## 8. View commit history

```bash
git log
```

Or use the shorter version:

```bash
git log --oneline
```

---

## 9. Modify the file

Update `README.md`:

```markdown
# My First Git Project

Learning Git with ChatGPT 🚀

Today I learned Git.
```

Save the file.

Check its status:

```bash
git status
```

Git will show that `README.md` has been modified.

Commit the changes:

```bash
git add .
git commit -m "Update README"
```

View the history again:

```bash
git log --oneline
```

---

# Working with Branches

## Create a new branch

```bash
git branch feature
```

List all branches:

```bash
git branch
```

---

## Switch to the new branch

```bash
git switch feature
```

Verify your current branch:

```bash
git branch
```

The active branch is marked with `*`.

---

## Make changes on the feature branch

Edit `README.md` and add:

```markdown
Working on Feature Branch
```

Commit the changes:

```bash
git add .
git commit -m "Add feature text"
```

---

## Merge the feature branch

Switch back to the main branch:

```bash
git switch main
```

Merge the feature branch:

```bash
git merge feature
```

The changes from the feature branch are now part of the `main` branch.

---

# Connect to GitHub

Connect your local repository to GitHub:

```bash
git remote add origin https://github.com/your-username/my-first-project.git
```

Verify the remote:

```bash
git remote -v
```

---

# Push to GitHub

```bash
git push -u origin main
```

This uploads your commits to GitHub.

---

# Pull the latest changes

```bash
git pull
```

This downloads and merges the latest commits from GitHub into your local repository.

---

# Complete Git Workflow

```text
Create Project
      │
      ▼
git init
      │
      ▼
Create Files
      │
      ▼
git status
      │
      ▼
git add .
      │
      ▼
git commit -m "message"
      │
      ▼
git log
      │
      ▼
git branch feature
      │
      ▼
git switch feature
      │
      ▼
Edit Files
      │
      ▼
git add .
      │
      ▼
git commit -m "feature"
      │
      ▼
git switch main
      │
      ▼
git merge feature
      │
      ▼
git remote add origin <repository-url>
      │
      ▼
git push -u origin main
      │
      ▼
git pull
```
# Coding-is-adventure
# Coding-is-adventure
# Coding-is-adventure
# Coding-is-adventure
