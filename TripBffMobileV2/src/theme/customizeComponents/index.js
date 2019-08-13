import variable from "./../variables/platform";

import modalTheme from "./Modal";

export default (variables = variable) => {
  const theme = {
    "NativeBase.Modal": {
      ...modalTheme(variables)
    },
  };

  return theme;
};
