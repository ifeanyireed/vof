# 1. Stage all modified and new files
git add .

# 2. Commit changes
git commit -m "feat(gallery): 3-image collage album cards in admin,
cascading delete API routes, and schema sync"

# 3. Push dev branch to remote
git push origin dev

# 4. Checkout main, merge dev, and deploy to production
git checkout main
git merge dev
git push origin main

# 5. Switch back to dev branch
git checkout dev