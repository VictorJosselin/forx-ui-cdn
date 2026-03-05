@echo off
git fetch --tags
for /f %%t in ('git tag -l') do git push origin --delete %%t
for /f %%t in ('git tag -l') do git tag -d %%t
git checkout --orphan fresh
git add -A
git commit -m "initial commit"
git branch -D main
git branch -m main
git push -f origin main
git push --set-upstream origin main
echo.
echo Repo reinitialise !
pause