if [ ! $1 ] ; then
  echo "Please enter the subcommand!"
fi

if [ $1 == "compile" ]; then
   if [ -f "./lottery" ] ; then
    rm ./bin/lottery
  fi
  deno compile --unstable --import-map=import_map.json -o lottery ./src/mod.ts
fi

if [ $1 == "bundle" ]; then
  if [ -f "./bin.mjs" ] ; then
    rm ./bin/bin.mjs
  fi
  deno bundle --unstable --import-map=import_map.json ./src/mod.ts >> bin.mjs
fi
