export PORT="3735"

export DEV_DIR="public"
export BUILD_DIR="build"

export SRC_JS="app/main.cjsx"
export OUT_JS="main.js"
export VENDOR_JS="vendor.js"

export SRC_CSS="css/main.styl"
export OUT_CSS="main.css"

export SRC_HTML="index.erb"
export OUT_HTML="index.html"

# NOTE: Non-dev dependencies are assumed to be front-end modules.
externals=$(node -p "Object.keys(require('./package').dependencies).join('\n');")

function flag_externals {
  out=""
  for module in $externals; do
    # Symlinked modules are assumed to be in development and aren't externalized.
    [[ -L "node_modules/$module" ]] || out="$out --$1 $module"
  done
  echo $out
}

function rename_with_hash {
  md5=$(md5 -q "$1")
  fullname=$(basename "$1")
  filename="${fullname%.*}"
  extension="${fullname##*.}"
  echo "$filename.$md5.$extension"
}
