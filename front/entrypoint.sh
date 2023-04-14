npm install;
cat >.env <<EOF
VITE_FRONT_FPS=$FRONT_FPS
VITE_HOST=$HOST
VITE_BACK_PORT=$BACK_PORT
EOF

npm install;
if [[ $NODE_ENV == "check" ]]; then
  npm run format && npm run check; echo "=== FINISH ==="
else
  npm run dev;
fi;
