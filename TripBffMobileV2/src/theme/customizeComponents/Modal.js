import variable from "./../variables/material";

export default (variables = variable) => {
  const modalTheme = {
    modal: {
      backgroundColor: variables.brandLight,
      borderRadius: variables.borderRadiusBase,
      // borderColor: "orange",
      // borderWidth: 1,
    }
  };

  return modalTheme;
};
