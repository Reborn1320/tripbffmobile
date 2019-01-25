import variable from "./../variables/platform";

export default (variables = variable) => {
  const modalTheme = {
    modal: {
      backgroundColor: variables.brandDark,
      borderRadius: variables.borderRadiusBase,
    }
  };

  return modalTheme;
};
