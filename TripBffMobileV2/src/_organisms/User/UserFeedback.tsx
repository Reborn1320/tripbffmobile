import * as React from "react";
import { StyleSheet, TextStyle, ViewStyle, Platform, TextInput } from "react-native";
import { Container, Content, Text, H1, Button, Toast, Root, View } from "native-base";
import { StoreData } from "../../store/Interfaces";
import NBColor from "../../theme/variables/material.js";
import { mixins } from "../../_utils";
import { Input } from 'react-native-elements';
import { connect } from "react-redux";
import { PropsBase } from "../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";
import { createUserFeedback } from "../../store/User/operations";

interface IMapDispatchToProps extends PropsBase {
    createUserFeedback: (feedback: string, email: string) => Promise<void>;
}

export interface Props extends IMapDispatchToProps {
}

interface State {
    email: string,
    feedback: string
}

class UserFeedbackComponent extends React.Component<Props, State> {

   constructor(props) {
    super(props);

    this.state = {
        email: "",
        feedback: ""
    }
  }  
  
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: (<Button transparent style={{
                    alignSelf: "center"
                        }}
                    onPress={navigation.getParam('_onConfirm')}>
                    <Text style={styles.button}>
                        {screenProps.t("action:submit")}</Text>
                  </Button>)
  });

  componentDidMount() {
    this.props.navigation.setParams({ _onConfirm: this._onConfirm });
  }

  private _onConfirm = () => {
    const { feedback, email } = this.state;

    this.props.createUserFeedback(feedback, email).then(() => {
        Toast.show({
            text: this.props.t("setting:feedback_submit_message"),
            buttonText: this.props.t("action:okay"),
            textStyle: {
                ...mixins.themes.fontNormal
              },
              buttonTextStyle: {
                ...mixins.themes.fontNormal
              },
            position: "top",
            type: "success",
            duration: 5000
        });
    });
  }  


  render() {
    const { t } = this.props;
    const numberOfLines = 12;    

    return (
      <Root>
          <Container>
              <Content>
                  <View style={styles.messageContainer}>
                        <H1 style={styles.feedbackTitle}>{t("setting:feedback_title")}</H1>
                        <View style={styles.feedbackMessageContainer}>
                            <Text numberOfLines={8} style={styles.feedbackMessage}>
                                {t("setting:feedback_message")}
                            </Text>
                        </View>                        
                  </View>
                  <View style={styles.formContainer}>    
                        <Input
                          label={t("setting:feedback_content_label")}
                          labelStyle={styles.formLabel}            
                          value={this.state.feedback}
                          onChangeText={(feedback) => this.setState({ feedback })} 
                          inputStyle={[styles.formInput, styles.formInputTripName, styles.formInputIos]}
                          inputContainerStyle={styles.formInputContainer}   
                          multiline = {true}
                          textAlignVertical = "top"
                          numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}             
                          />     
   
                    <Input
                        label={t("setting:feedback_email_label")} 
                        labelStyle={styles.formLabel}            
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })} 
                        inputStyle={[styles.formInput, styles.formInputTripName]}
                        inputContainerStyle={styles.formInputContainer}                     
                        />                    
                </View> 
              </Content>
          </Container>
      </Root>             
    );
  }
}


interface Style {
  button: TextStyle;
  messageContainer: ViewStyle;
  feedbackTitle: TextStyle;
  feedbackMessageContainer: ViewStyle;
  feedbackMessage: TextStyle;
  formContainer: ViewStyle;
  formLabel: TextStyle;
  formInput: TextStyle;
  formInputIos: TextStyle;
  formInputTripName: TextStyle;
  formInputContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({  
    button: {
      color: NBColor.brandPrimary,
      ...mixins.themes.fontNormal, 
      fontSize: 16,
      lineHeight: 18
    },
    messageContainer: {
        marginTop: "7%",
        marginLeft: "6%"
    },
    feedbackTitle: {
        ...mixins.themes.fontExtraBold
    },
    feedbackMessageContainer: {
        maxWidth: "90%",
        marginTop: "3%"
    },
    feedbackMessage: {
        fontSize: 18,
        ...mixins.themes.fontNormal
    },
    formContainer: {
        marginTop: 24,
        marginLeft: "3.33%",
        marginRight: "3.33%",
        marginBottom: "3%"
    },
    formLabel: {
        color: "#383838",
        ...mixins.themes.fontSemiBold,
        fontSize: 14,
        lineHeight: 20
    },
    formInput: {
        ...mixins.themes.fontSemiBold,
        fontSize: 14,
        paddingLeft: 16
    },
    formInputTripName: {
        color: "#383838"
    },
    formInputIos: {
      height: 200
    },
    formInputContainer: {
        borderWidth: 1,
        borderStyle: "solid",    
        borderRadius: 4,
        marginTop: 8,
        borderColor: "#A1A1A1"
    },
});

const mapDispatchToProps = dispatch => {
  return {
    createUserFeedback: (feedback, email) => dispatch(createUserFeedback(feedback, email))
  }
};

const UserFeedback = connect(null, mapDispatchToProps)(UserFeedbackComponent);

export default withNamespaces(['action', 'setting'])(UserFeedback);


