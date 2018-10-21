# Bluebird library wrapped with bluebird-q shim
# This library was packaged using following steps:
# Prerequisites: git, node.js, browserify.js

# 1) Clone bluebird and bluebird-q
git clone https://github.com/petkaantonov/bluebird.git
git clone https://github.com/petkaantonov/bluebird-q.git

# 2) Define bluebird version to be used
cd bluebird
git reset --hard v3.4.0

# 3) Disable all optional features for bluebird build
#    In package.json change line starting with "prepublish": to
#    "prepublish": "node tools/build.js node tools/build.js --no-debug --release --browser --features=\"core call_get map settle timers\"",
sed -i -e 's/"prepublish":.*$/"prepublish": "node tools\/build.js --no-debug --release --browser --features=\\\"core call_get map settle ll\\\\"",/g' package.json

# 4) Install bluebird dependencies
npm install && npm test || exit 1

# 5) Define bluebird version to be used
cd ../bluebird-q
git reset --hard v2.1.0

# 6) Point from bluebird-q to cusom bluebird
#    In package.json change dependency to bluebird from version (like "^3.3.1") to "file:../bluebird"
sed -i -e 's/"bluebird":.*$/"bluebird": "file:..\/bluebird"/g' package.json

# 7) Package bluebird-q and bluebird to file q.js 
npm install && npm test || exit 1
cp q.js ../updated.q.js

# 8) Cleanup
cd ..
rm -rf bluebird bluebird-q