import variable from "./../variables/material";

export default (variables = variable) => {
  const modalTheme = {
    modal: {
      backgroundColor: variables.brandDark,
      borderRadius: variables.borderRadiusBase,
    }
  };

  return modalTheme;
};
