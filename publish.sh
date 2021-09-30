#!/bin/bash

config=./package.json
pkg=`grep -o -m 1 'name.*' $config | awk 'BEGIN{FS="\""} {print $3}'`
version=`grep -o -m 1 'version.*' $config | awk 'BEGIN{FS="\""} {print $3}'`

versions=`npm view $pkg@~$version version | xargs`
if [[ $versions ]]; then
  latest=${versions##* };
  if [[ $latest > $version || $latest = $version ]]; then
    version=$(echo $latest | awk -F"." '{$NF+=1}{print $0RT}' OFS="." ORS="")
    npm version $version -m "Publish $pkg@$version"
    upgrade=true
  fi
fi

if [[ ! $upgrade ]]; then
  git tag -a v$version -m "Publish $pkg@$version"
fi

npm run build
npm publish dist --access public --dry-run
git push --tags
