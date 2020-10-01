git tag $PACKAGE_VERSION
git add package.json
git commit -m $PACKAGE_VERSION
npm publish
git push --tags
git push