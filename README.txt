TITAN-AI2 workflow replacement

This ZIP contains only the replacement GitHub Actions workflow file:
.github/workflows/main.yml

It does NOT contain the complete TITAN-AI2 source project.

How to use:
1. Download and extract this ZIP.
2. In the GitHub repository, open .github/workflows/main.yml.
3. Choose Edit (pencil icon), replace the whole file contents with the contents of main.yml in this ZIP, and commit the change.
4. Open Actions and run "Build TITAN AI Android APK".

Note: This changes the dependency install command to try to avoid npm peer-dependency/lockfile resolution issues. It cannot guarantee success if the repository's package.json or Android project has other problems.
