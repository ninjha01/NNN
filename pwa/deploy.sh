set -xe
GIT_COMMIT_SHORT_SHA="$(git rev-parse --short HEAD)"
REPLACE_WITH_SHA="s/const NNS_COMMIT_SHA.*/const NNS_COMMIT_SHA=\"${GIT_COMMIT_SHORT_SHA}\";/"
sed -i '' "${REPLACE_WITH_SHA}" ./src/serviceWorker.ts ./src/components/NavBar/index.tsx

npm run build

REPLACE_WITH_PLACEHOLDER="s/const NNS_COMMIT_SHA.*/const NNS_COMMIT_SHA = \"local\";/"
sed -i '' "${REPLACE_WITH_PLACEHOLDER}" ./src/custom-serviceWorker.js ./src/serviceWorker.ts ./src/components/NavBar/index.tsx

gcloud app deploy --quiet --project notification-enabler
