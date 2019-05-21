import variable from "./../variables/material";

export default (variables = variable) => {
  const modalTheme = {
    modal: {
      backgroundColor: variables.brandDark,
      borderRadius: variables.borderRadiusBase,
      // borderColor: "orange",
      // borderWidth: 1,
    }
  };

  return modalTheme;
};
