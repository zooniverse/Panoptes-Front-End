export PORT="3735"

export DEV_DIR="public"
export BUILD_DIR="build"

export SRC_JS="app/main.cjsx"
export OUT_JS="main.js"
export VENDOR_JS="vendor.js"

export SRC_CSS="css/main.styl"
export OUT_CSS="main.css"

# NOTE: All non-dev dependencies are assumed to be front-end modules.
externals=$(node -p "Object.keys(require('./package').dependencies).join('\n');")

function flag_externals {
  out=""
  for module in $externals; do
    out="$out --$1 $module"
  done
  echo $out
}

export flag_externals
