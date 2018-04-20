module.exports = {
    "extends": "airbnb",
    "env": {
      "es6": true,
      "browser": true,
      "node": true,
    },
    "rules": {
      "react/jsx-filename-extension": 0,
      "react/prop-types": 0,
      "react/forbid-prop-types": 0,
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ]
};