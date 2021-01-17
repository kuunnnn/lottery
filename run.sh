if [ ! $1 ] ; then
  echo "Please enter the subcommand!"
fi

compile() {
  if [ -f "./lottery" ] ; then
    rm ./bin/lottery
  fi
  deno compile --unstable --import-map=import_map.json -o lottery ./mod.ts
}

bundle() {
  if [ -f "./bin.mjs" ] ; then
    rm ./bin/bin.mjs
  fi
  deno bundle --unstable --import-map=import_map.json ./mod.ts >> bin.mjs
}

if [ $1 == 'compile' ]; then
  compile
fi

if [ $1 == 'bundle' ]; then
  bundle
fi

if [ $1 == 'release' ]; then
  compile && bundle
fi
