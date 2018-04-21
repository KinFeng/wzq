module.exports = {
    "extends": "airbnb",
    "env": {
      "es6": true,
      "browser": true,
      "node": true,
    },
    "rules": {
      "max-len": 0,
      "linebreak-style": ["off", "unix"],
      "react/jsx-filename-extension": 0,
      "react/prop-types": 0,
      "react/forbid-prop-types": 0,
      "react/sort-comp": 0,
      "no-bitwise": 0,
      "no-mixed-operators": 0,
      "arrow-parens": 0,
      "arrow-body-style": 0,
      "no-restricted-syntax": 0,
      "jsx-a11y/no-static-element-interactions": 0,
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ]
};